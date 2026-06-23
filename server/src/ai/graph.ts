import { model as chatModel } from "../config/model"
import {
    CONTEXT_GATHERING_SYSTEM_PROMPT,
    RESEARCH_SYNTHESIS_PROMPT,
    POST_FEEDBACK_SYSTEM_PROMPT,
    LINKEDIN_POST_GENERATOR_PROMPT,
    TWITTER_POST_GENERATOR_PROMPT,
    THREADS_POST_GENERATOR_PROMPT,
} from "./prompts"
import { StateAnnotation } from "./state"
import { StateGraph } from "@langchain/langgraph";
import { AIMessage, BaseMessage, HumanMessage, isAIMessage, SystemMessage, ToolMessage } from "@langchain/core/messages";
import { researchTools } from "./tools";

function getPlatformGeneratorPrompt(platform: string | undefined): string {
    switch (platform?.toLowerCase()) {
        case "twitter": case "x": return TWITTER_POST_GENERATOR_PROMPT;
        case "threads": return THREADS_POST_GENERATOR_PROMPT;
        default: return LINKEDIN_POST_GENERATOR_PROMPT;
    }
}

// ─── Context Gathering Agent ──────────────────────────────────────────────────
// Reads full conversation, extracts context, calculates confidence, asks questions
// or routes to research/generate/refine.

async function contextGatheringAgent(state: typeof StateAnnotation.State) {
    console.log("--- Executing Context Gathering Agent ---");

    const clarificationCount = state.clarificationCount ?? 0;
    const hasPriorPost = !!(state.finalPost);

    // Inject a context hint into the conversation so the model knows how many
    // rounds of questions have already been asked and whether a post exists.
    const contextHint = new HumanMessage(
        `[SYSTEM CONTEXT — not visible to end user]\nClarification rounds so far: ${clarificationCount}\nPost already generated: ${hasPriorPost ? "yes" : "no"}`
    );

    let parsed: {
        phase: "gather" | "research" | "generate" | "refine";
        contextData: Record<string, unknown>;
        contextConfidence: number;
        message: string;
        improvementNotes?: string[];
    } | null = null;

    try {
        const response = await chatModel.invoke(
            [new SystemMessage(CONTEXT_GATHERING_SYSTEM_PROMPT), ...state.messages, contextHint],
            { response_format: { type: "json_object" } }
        );
        parsed = JSON.parse(response.content as string);
    } catch (err) {
        console.error("--- Context Gathering: parse failed ---", err);
    }

    if (!parsed) {
        return {
            messages: [new AIMessage({
                content: "I'd love to help you create a great post! To get started, could you tell me:\n\n1. What is the post about?\n2. Who is your target audience?\n3. What's the main goal — awareness, engagement, or driving action?"
            })],
            clarificationCount: clarificationCount + 1,
            nextRepresentative: "__end__"
        };
    }

    console.log(`--- Context Gathering: phase=${parsed.phase}, confidence=${parsed.contextConfidence}, clarifications=${clarificationCount} ---`);

    const sources: string[] = ["User Instructions"];

    if (parsed.phase === "gather") {
        return {
            messages: [new AIMessage({ content: parsed.message })],
            contextData: parsed.contextData,
            contextConfidence: parsed.contextConfidence,
            clarificationCount: clarificationCount + 1,
            nextRepresentative: "__end__"
        };
    }

    if (parsed.phase === "refine") {
        return {
            messages: [new AIMessage({ content: parsed.message })],
            contextData: parsed.contextData,
            contextConfidence: parsed.contextConfidence,
            improvementNotes: parsed.improvementNotes ?? [],
            feedBackReviewCount: 0,
            contextSources: sources,
            nextRepresentative: "POST_GENERATOR"
        };
    }

    if (parsed.phase === "research") {
        return {
            messages: [new AIMessage({ content: parsed.message })],
            contextData: parsed.contextData,
            contextConfidence: parsed.contextConfidence,
            improvementNotes: [],
            feedBackReviewCount: 0,
            contextSources: sources,
            nextRepresentative: "RESEARCH"
        };
    }

    // generate
    return {
        messages: [new AIMessage({ content: parsed.message })],
        contextData: parsed.contextData,
        contextConfidence: parsed.contextConfidence,
        improvementNotes: [],
        feedBackReviewCount: 0,
        contextSources: sources,
        nextRepresentative: "POST_GENERATOR"
    };
}

// ─── Research Agent ───────────────────────────────────────────────────────────
// Two-phase: tool calling loop → synthesis JSON call

async function researchAgent(state: typeof StateAnnotation.State, config?: any) {
    console.log("--- Executing Research Agent ---");

    const onSearch: OnSearchCallback | undefined = config?.configurable?.onSearch;

    const ctx = state.contextData as Record<string, unknown> | null;
    const urlsToResearch: string[] = (ctx?.urls_to_research as string[]) ?? [];
    const mentionsToFind: string[] = (ctx?.mentions_to_find as string[]) ?? [];
    const platform = (ctx?.platform as string) ?? "linkedin";

    const researchTaskPrompt = [
        `Research the following to improve a social media post:\n`,
        `Topic/Subject: ${ctx?.subject ?? "Not specified"}`,
        `Platform: ${platform}`,
        `Product/Company: ${ctx?.product_name ?? ctx?.company_name ?? "Not specified"}`,
        `Target Audience: ${ctx?.target_audience ?? "General professional audience"}`,
        urlsToResearch.length > 0 ? `URLs to visit: ${urlsToResearch.join(", ")}` : "",
        mentionsToFind.length > 0 ? `People to find handles for (use find_person_handle tool for each): ${mentionsToFind.join(", ")}` : "",
        `\nResearch priorities:`,
        mentionsToFind.length > 0 ? `0. Find the ${platform} handle for each person in the mentions list using find_person_handle` : "",
        `1. Visit any provided URLs and extract product/service details`,
        `2. Search for compelling angles and data points about this topic`,
        `3. Research how top-performing posts on ${platform} handle this type of content`,
        `4. Find any relevant statistics, trends, or news that would strengthen the post`,
    ].filter(Boolean).join("\n");

    const modelWithTools = chatModel.bindTools(researchTools);
    const researchMessages: BaseMessage[] = [
        new SystemMessage(RESEARCH_SYNTHESIS_PROMPT),
        new HumanMessage(researchTaskPrompt),
    ];

    const sources: string[] = [...(state.contextSources ?? ["User Instructions"])];

    // Phase 1: autonomous tool use (max 7 iterations to allow handle lookups + research)
    for (let i = 0; i < 7; i++) {
        const response = await modelWithTools.invoke(researchMessages);
        researchMessages.push(response);

        if (!response.tool_calls?.length) break;

        for (const toolCall of response.tool_calls) {
            const matched = researchTools.find(t => t.name === toolCall.name);
            let toolResult = "Tool not found";
            if (matched) {
                try {
                    console.log(`--- Research Agent: calling tool "${toolCall.name}" ---`);
                    toolResult = await (matched as any).invoke(toolCall.args);

                    // Emit search event AFTER tool completes so we can include real result refs
                    const refs = extractRefs(toolResult);
                    if (toolCall.name === "visit_website") {
                        let domain = toolCall.args.url;
                        try { domain = new URL(toolCall.args.url).hostname.replace(/^www\./, ""); } catch {}
                        const ev: SearchEvent = { type: "search", label: `Visited ${domain}`, query: toolCall.args.url, icon: "url" };
                        onSearch?.(ev, { type: "url", title: domain, url: toolCall.args.url, refs: [{ title: domain, url: toolCall.args.url, domain }] });
                        sources.push("Website Research");
                    } else if (toolCall.name === "web_search") {
                        const ev: SearchEvent = { type: "search", label: `Searched: "${toolCall.args.query}"`, query: toolCall.args.query, icon: "web" };
                        onSearch?.(ev, { type: "web", title: toolCall.args.query, query: toolCall.args.query, refs });
                        sources.push("Web Research");
                    } else if (toolCall.name === "research_platform_posts") {
                        const ev: SearchEvent = { type: "search", label: `${platform} posts: "${toolCall.args.topic}"`, query: toolCall.args.topic, icon: "platform" };
                        onSearch?.(ev, { type: "platform", title: `${platform} posts: ${toolCall.args.topic}`, query: toolCall.args.topic, refs });
                        sources.push("Platform Research");
                    } else if (toolCall.name === "trend_research") {
                        const ev: SearchEvent = { type: "search", label: `Trends: "${toolCall.args.niche}"`, query: toolCall.args.niche, icon: "trend" };
                        onSearch?.(ev, { type: "trend", title: `Trends: ${toolCall.args.niche}`, query: toolCall.args.niche, refs });
                        sources.push("Trend Research");
                    } else if (toolCall.name === "find_person_handle") {
                        const ev: SearchEvent = { type: "search", label: `Found handle for ${toolCall.args.name}`, query: toolCall.args.name, icon: "person" };
                        onSearch?.(ev, { type: "person", title: toolCall.args.name, query: toolCall.args.name, refs });
                        sources.push("Profile Lookup");
                    }
                } catch (err) {
                    toolResult = `Tool error: ${String(err)}`;
                    console.error(`--- Tool "${toolCall.name}" failed:`, err);
                }
            }
            researchMessages.push(new ToolMessage({
                content: toolResult,
                tool_call_id: toolCall.id ?? toolCall.name,
            }));
        }
    }

    // Phase 2: synthesize all research into a clean summary
    const synthesisResponse = await chatModel.invoke([
        ...researchMessages,
        new HumanMessage(
            "Synthesize all research findings into a structured content brief (300-500 words) using the format in your instructions. Be specific and concrete — give the writer material they can actually use."
        )
    ]);

    const researchSummary = synthesisResponse.content as string;
    const uniqueSources = [...new Set(sources)];

    console.log(`--- Research Agent: found ${uniqueSources.length} sources ---`);

    return {
        researchSummary,
        contextSources: uniqueSources,
        nextRepresentative: "POST_GENERATOR"
    };
}

// ─── Post Generator Agent ─────────────────────────────────────────────────────

async function postGeneratorAgent(state: typeof StateAnnotation.State) {
    console.log("--- Executing Post Generator Agent ---");

    const ctx = state.contextData as Record<string, string> | null;
    const platform = ctx?.platform ?? "linkedin";
    const platformPrompt = getPlatformGeneratorPrompt(platform);
    const improvementNotes = state.improvementNotes ?? [];

    console.log(`--- Post Generator: ${platform} prompt, ${improvementNotes.length} improvement notes ---`);

    const parts = [
        `Generate a ${platform} post based on this content brief:\n`,
        `CONTEXT BRIEF:\n${JSON.stringify(ctx, null, 2)}`,
    ];

    if (state.researchSummary) {
        parts.push(`\nRESEARCH INSIGHTS (incorporate specific facts and angles where relevant):\n${state.researchSummary}`);
    }

    if (improvementNotes.length > 0) {
        parts.push(`\nREFINEMENT INSTRUCTIONS — apply ALL of these precisely:\n${improvementNotes.map((n, i) => `${i + 1}. ${n}`).join("\n")}`);
    }

    const response = await chatModel.invoke([
        new SystemMessage(platformPrompt),
        new HumanMessage({ content: parts.join("\n\n") })
    ]);

    return {
        messages: [new AIMessage({ content: response.content as string })],
        nextRepresentative: "POST_FEEDBACK"
    };
}

// ─── Post Feedback Agent ──────────────────────────────────────────────────────

async function postFeedbackAgent(state: typeof StateAnnotation.State) {
    const feedBackReviewCount = state.feedBackReviewCount ?? 0;
    const lastFeedbackScore = state.lastFeedbackScore ?? 0;
    console.log(`--- Executing Post Feedback Agent (iteration ${feedBackReviewCount + 1}/3) ---`);

    const lastAiMessage = state.messages.slice().reverse().find(m => isAIMessage(m));
    const generatedPost = (lastAiMessage?.content as string) ?? "";

    const ctx = state.contextData as Record<string, string> | null;
    const platform = ctx?.platform ?? "social media";
    const tone = ctx?.tone ?? "";

    const buildFallbackChatResponse = (score: number, iterations: number) => {
        const parts = [`Your **${platform} post** is ready!`];
        if (tone) parts.push(` I used a **${tone}** tone.`);
        if (iterations > 0) parts.push(`\n\nRefined ${iterations} time${iterations > 1 ? "s" : ""} to improve quality.`);
        parts.push(`\n\n**Quality score: ${score.toFixed(1)}/10**`);
        return parts.join("");
    };

    let rawContent: string;
    try {
        const response = await chatModel.invoke(
            [
                new SystemMessage(POST_FEEDBACK_SYSTEM_PROMPT),
                new HumanMessage({
                    content: JSON.stringify({
                        contextData: state.contextData,
                        generatedPost,
                        feedBackReviewCount,
                        lastFeedbackScore,
                    })
                })
            ],
            { response_format: { type: "json_object" } }
        );
        rawContent = response.content as string;
    } catch (err) {
        console.warn("--- Feedback: Groq rejected JSON, approving current post ---", err);
        return {
            messages: [new AIMessage({ content: buildFallbackChatResponse(0, feedBackReviewCount) })],
            finalPost: generatedPost,
            lastFeedbackScore: 0,
            feedBackReviewCount: feedBackReviewCount + 1,
            nextRepresentative: "__end__"
        };
    }

    let parsed: {
        decision: string;
        scores: Record<string, number>;
        finalScore: number;
        post?: string;
        chat_response?: string;
        improvementNotes?: string[];
    };

    try {
        parsed = JSON.parse(rawContent);
    } catch {
        console.warn("--- Feedback: failed to parse response JSON, approving current post ---");
        return {
            messages: [new AIMessage({ content: buildFallbackChatResponse(0, feedBackReviewCount) })],
            finalPost: generatedPost,
            lastFeedbackScore: 0,
            feedBackReviewCount: feedBackReviewCount + 1,
            nextRepresentative: "__end__"
        };
    }

    console.log(`--- Feedback: decision=${parsed.decision}, score=${parsed.finalScore} ---`);

    if (parsed.decision === "APPROVE") {
        const approvedPost = parsed.post ?? generatedPost;
        const chatResponse = parsed.chat_response ?? buildFallbackChatResponse(parsed.finalScore, feedBackReviewCount);
        return {
            messages: [new AIMessage({ content: chatResponse })],
            finalPost: approvedPost,
            lastFeedbackScore: parsed.finalScore,
            improvementNotes: [],
            nextRepresentative: "__end__"
        };
    }

    // Force approve: max iterations or diminishing returns
    const diminishing = lastFeedbackScore > 0 && (parsed.finalScore - lastFeedbackScore) < 0.5;
    if (feedBackReviewCount >= 2 || diminishing) {
        console.log(`--- Feedback: forcing approval (maxIter=${feedBackReviewCount >= 2}, diminishing=${diminishing}) ---`);
        return {
            messages: [new AIMessage({ content: buildFallbackChatResponse(parsed.finalScore, feedBackReviewCount) })],
            finalPost: generatedPost,
            lastFeedbackScore: parsed.finalScore,
            improvementNotes: [],
            nextRepresentative: "__end__"
        };
    }

    return {
        feedBackReviewCount: feedBackReviewCount + 1,
        lastFeedbackScore: parsed.finalScore,
        improvementNotes: parsed.improvementNotes ?? [],
        nextRepresentative: "POST_GENERATOR"
    };
}

// ─── Conditional Edge Functions ───────────────────────────────────────────────

function afterContextGathering(state: typeof StateAnnotation.State) {
    switch (state.nextRepresentative) {
        case "RESEARCH": return "researchAgent";
        case "POST_GENERATOR": return "postGeneratorAgent";
        default: return "__end__";
    }
}

function afterPostFeedback(state: typeof StateAnnotation.State) {
    return state.nextRepresentative === "POST_GENERATOR" ? "postGeneratorAgent" : "__end__";
}

// ─── Graph Assembly ───────────────────────────────────────────────────────────

const graph = new StateGraph(StateAnnotation)
    .addNode("contextGatheringAgent", contextGatheringAgent)
    .addNode("researchAgent", researchAgent)
    .addNode("postGeneratorAgent", postGeneratorAgent)
    .addNode("postFeedbackAgent", postFeedbackAgent)
    .addEdge("__start__", "contextGatheringAgent")
    .addEdge("researchAgent", "postGeneratorAgent")
    .addEdge("postGeneratorAgent", "postFeedbackAgent")
    .addConditionalEdges("contextGatheringAgent", afterContextGathering, {
        researchAgent: "researchAgent",
        postGeneratorAgent: "postGeneratorAgent",
        __end__: "__end__"
    })
    .addConditionalEdges("postFeedbackAgent", afterPostFeedback, {
        postGeneratorAgent: "postGeneratorAgent",
        __end__: "__end__"
    });

const compiledGraph = graph.compile();

// ─── Public API ───────────────────────────────────────────────────────────────

const NODE_STEP_MESSAGES: Record<string, string> = {
    contextGatheringAgent: "Analyzing your request...",
    researchAgent: "Researching your topic...",
    postGeneratorAgent: "Writing your post...",
    postFeedbackAgent: "Reviewing quality...",
};

export interface StepEvent {
    type: "step";
    step: string;
    message: string;
    sources?: string[];
}

export interface SearchEvent {
    type: "search";
    label: string;
    query: string;
    icon: "web" | "url" | "person" | "platform" | "trend";
}

export interface SourceRef {
    title: string;
    url: string;
    domain: string;
}

export interface ResourceItem {
    type: "web" | "url" | "person" | "platform" | "trend";
    title: string;
    url?: string;
    query?: string;
    refs?: SourceRef[];
}

export interface MetadataEvent {
    type: "metadata";
    score: number | null;
    iterations: number;
    platform: string | null;
    tone: string | null;
    post: string;
    contextSources: string[];
    resources: ResourceItem[];
}

export interface CompleteEvent {
    type: "complete";
    content: string;
}

export interface ErrorEvent {
    type: "error";
    message: string;
}

export type StreamEvent = StepEvent | SearchEvent | MetadataEvent | CompleteEvent | ErrorEvent;

type OnSearchCallback = (event: SearchEvent, resource: ResourceItem) => void;

function extractRefs(toolResult: string): SourceRef[] {
    try {
        const parsed = JSON.parse(toolResult);
        const items: any[] = Array.isArray(parsed) ? parsed : (parsed?.results ?? []);
        return items
            .filter((r: any) => typeof r?.url === "string")
            .slice(0, 5)
            .map((r: any) => {
                let domain = r.url;
                try { domain = new URL(r.url).hostname.replace(/^www\./, ""); } catch {}
                return { title: r.title || domain, url: r.url, domain };
            });
    } catch {
        return [];
    }
}

export async function* streamAIResponse(messages: (HumanMessage | AIMessage)[]): AsyncGenerator<StreamEvent> {
    let lastAIContent = "";
    let finalPostContent = "";
    let score: number | null = null;
    let platform: string | null = null;
    let tone: string | null = null;
    let contextSources: string[] = [];
    let generatorIterations = 0;

    // Per-stream search event queue — filled by onSearch callbacks during node execution,
    // drained and yielded after each graph chunk arrives.
    const pendingSearchEvents: SearchEvent[] = [];
    const resources: ResourceItem[] = [];

    const onSearch: OnSearchCallback = (event, resource) => {
        pendingSearchEvents.push(event);
        resources.push(resource);
    };

    const graphStream = await compiledGraph.stream(
        { messages },
        { configurable: { onSearch } }
    );

    for await (const chunk of graphStream) {
        const nodeName = Object.keys(chunk)[0];
        if (!nodeName || nodeName === "__end__") continue;

        const nodeUpdate = (chunk as Record<string, any>)[nodeName] as Partial<typeof StateAnnotation.State>;

        // Drain search events emitted during this node's execution
        while (pendingSearchEvents.length > 0) {
            yield pendingSearchEvents.shift()!;
        }

        if (nodeUpdate?.messages?.length) {
            const nodeMessages = nodeUpdate.messages as any[];
            const lastMsg = [...nodeMessages].reverse().find((m) => isAIMessage(m));
            if (lastMsg?.content && typeof lastMsg.content === "string") {
                lastAIContent = lastMsg.content;
            }
        }

        if ((nodeUpdate as any)?.finalPost) {
            finalPostContent = (nodeUpdate as any).finalPost as string;
        }

        if (nodeUpdate?.contextData) {
            const ctx = nodeUpdate.contextData as Record<string, string>;
            if (!platform && ctx.platform) platform = ctx.platform;
            if (!tone && ctx.tone) tone = ctx.tone;
        }

        if (nodeUpdate?.contextSources?.length) {
            contextSources = nodeUpdate.contextSources;
        }

        if (nodeName === "postFeedbackAgent" && typeof nodeUpdate?.lastFeedbackScore === "number") {
            score = nodeUpdate.lastFeedbackScore;
        }

        if (nodeName === "postGeneratorAgent") {
            generatorIterations++;
        }

        const stepMessage = NODE_STEP_MESSAGES[nodeName];
        if (stepMessage) {
            yield {
                type: "step",
                step: nodeName,
                message: stepMessage,
                ...(nodeName === "researchAgent" && contextSources.length > 0 ? { sources: contextSources } : {}),
            };
        }
    }

    if (finalPostContent) {
        yield {
            type: "metadata",
            score,
            iterations: generatorIterations,
            platform,
            tone,
            post: finalPostContent,
            contextSources,
            resources,
        };
    }

    yield { type: "complete", content: lastAIContent };
}

export async function generateAIResponse(messages: (HumanMessage | AIMessage)[]): Promise<string> {
    const result = await compiledGraph.invoke({ messages });
    const lastMessage = result.messages?.slice(-1)[0];
    return (lastMessage?.content as string) ?? "I couldn't generate a response. Please try again.";
}
