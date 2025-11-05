import { tool } from "@langchain/core/tools";
import { model as chatModel } from "../config/model"
import { FRONTDESK_SYSTEM_PROMPT, POST_FEEDBACK_SYSTEM_PROMPT, POST_GENERATOR_SYSTEM_PROMPT, PROMPT_BUILDER_SYSTEM_PROMPT } from "../prompts"
import { StateAnnotation } from "../state"
import { TavilySearch } from "@langchain/tavily";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { MemorySaver, StateGraph } from "@langchain/langgraph";
import { AIMessage, HumanMessage, isAIMessage, isHumanMessage, SystemMessage } from "@langchain/core/messages";
import { createInterface } from "readline/promises";

export const TavilyWebSearch = new TavilySearch({
    maxResults: 3,
    topic: "general",
});

const webSearchTools = [TavilyWebSearch]
const webSearchToolNode = new ToolNode(webSearchTools)
export const model = chatModel.bindTools(webSearchTools)

async function frontdeskAgent(state: typeof StateAnnotation.State) {
    // 1️⃣ Generate primary response
    console.log("--- Executing Frontdesk Agent ---");
    const response = await chatModel.invoke(
        [
            { role: "system", content: FRONTDESK_SYSTEM_PROMPT },
            ...state.messages,
        ],
    );
    console.log(`--- Frontdesk Agent Response ---`);
    console.log(response.content);

    // 2️⃣ Categorization system prompt
    const CATEGORIZATION_SYSTEM_PROMPT = `
You are an expert intent classifier and router for a conversational assistant.

Your job is to examine the conversation history AND the AI's latest response to decide if the user request should be routed to the PromptBuilderAgent or handled here.

Respond ONLY with a JSON object with one field:
{ "nextRepresentative": "PROMPT_BUILDER" } or { "nextRepresentative": "RESPOND" }

Rules:
- Choose "PROMPT_BUILDER" if the user clearly requests content generation (post, caption, marketing copy, blog snippet, etc.).
- Otherwise, choose "RESPOND".
- Do not add any extra text or explanation. Output only a valid JSON object as your response.
`;

    // 3️⃣ Categorization human prompt
    const CATEGORIZATION_HUMAN_PROMPT = `
Conversation History:
${state.messages.map((msg: any) => `${msg.role}: ${msg.content}`).join("\n")}

Latest AI Response:
${response.content}
`;

    // 4️⃣ Invoke categorization
    const categorizationResponse = await chatModel.invoke(
        [
            { role: "system", content: CATEGORIZATION_SYSTEM_PROMPT },
            { role: "user", content: CATEGORIZATION_HUMAN_PROMPT },
        ],
        { response_format: { type: "json_object" } }
    );

    // 5️⃣ Parse categorization safely
    let nextRepresentative: "PROMPT_BUILDER" | "RESPOND" = "RESPOND";
    try {
        nextRepresentative = JSON.parse(categorizationResponse.content as string).nextRepresentative
    } catch (e) {
        nextRepresentative = "RESPOND";
    }
    console.log(`--- Next Representative ---`, categorizationResponse.content);

    return {
        messages: [response],
        nextRepresentative: nextRepresentative,
    };
}

async function promptBuilderAgent(state: typeof StateAnnotation.State) {


}

async function postGeneratorAgent(state: typeof StateAnnotation.State) {
    console.log("--- Executing Post Generator Agent ---");

    // CHANGED: Include conversation history and any web search results
    const messages = [
        {
            role: "system",
            content: POST_GENERATOR_SYSTEM_PROMPT
        },
        ...state.messages
    ];

    const response = await model.invoke(messages)

    return {
        messages: [
            new AIMessage({ content: response.content })
        ],
        nextRepresentative: "POST_FEEDBACK"
    }
}

async function postFeedbackAgent(state: typeof StateAnnotation.State) {
    console.log("--- Executing Post Feedback Agent ---");

    // CHANGED: Track iteration count and implement max 3 loops
    const currentIteration = state.feedBackReviewCount ? state.feedBackReviewCount + 1 : 1;
    console.log(`--- Feedback Iteration: ${currentIteration}/3 ---`);

    const firstUserMessage = state.messages.find(m => isHumanMessage(m))
    const lastAiMessage = state.messages.slice().reverse().find(m => isAIMessage(m))

    console.log("firstUserMessage", firstUserMessage?.content);
    console.log("lastAiMessage", lastAiMessage?.content);

    // CHANGED: Use chatModel without tools for JSON parsing to avoid tool validation errors
    const response = await chatModel.invoke([
        new SystemMessage(POST_FEEDBACK_SYSTEM_PROMPT),
        firstUserMessage as any,
        lastAiMessage as any
    ], { response_format: { type: "json_object" } });

    let parsedResponse;
    try {
        parsedResponse = JSON.parse(response.content as string);
        console.log("Parsed feedback response:", parsedResponse);
    } catch (e) {
        console.error("Failed to parse feedback response:", e);
        // CHANGED: If we can't parse and we've reached max iterations, end the conversation
        if (currentIteration >= 3) {
            return {
                messages: [
                    new AIMessage({ content: "I've reached the maximum number of revisions. Let's start over with a new request." })
                ],
                nextRepresentative: "__end__"
            };
        }
        return {
            messages: [
                new AIMessage({ content: "I encountered an error processing the feedback. Please try again." })
            ],
            feedBackReviewCount: currentIteration,
            nextRepresentative: "PROMPT_BUILDER"
        };
    }

    if (parsedResponse.decision === "APPROVE") {
        console.log(`--- Approving Post ---`);
        return {
            messages: [
                new AIMessage({ content: parsedResponse.message })
            ],
            nextRepresentative: "__end__"
        };
    }

    if (parsedResponse.decision === "SUGGEST_CHANGES") {
        console.log(`--- Suggesting Changes ---`);

        // CHANGED: Check if we've reached maximum iterations (3)
        if (currentIteration >= 3) {
            return {
                messages: [
                    new AIMessage({ content: "I've reached the maximum number of revisions (3). Here's the final version: " + parsedResponse.message })
                ],
                nextRepresentative: "__end__"
            };
        }

        return {
            messages: [
                new AIMessage({ content: parsedResponse.message })
            ],
            feedBackReviewCount: currentIteration,
            nextRepresentative: "PROMPT_BUILDER" // CHANGED: Go back to prompt builder for refinement
        };
    }

    // CHANGED: Default case with iteration tracking
    return {
        messages: [response],
        feedBackReviewCount: currentIteration,
        nextRepresentative: "PROMPT_BUILDER"
    }
}

function whoIsNextForFrontdesk(state: typeof StateAnnotation.State) {
    if (state.nextRepresentative === "RESPOND") {
        return "__end__"
    }
    if (state.nextRepresentative === "PROMPT_BUILDER") {
        return "promptBuilderAgent" // CHANGED: Fixed routing to promptBuilderAgent
    }
    return "__end__"
}

function whoIsNextForPromptBuilder(state: typeof StateAnnotation.State) {
    if (state.nextRepresentative === "WEB_SEARCH") {
        return "webSearchToolNode"
    }
    if (state.nextRepresentative === "REQUEST_CLARIFICATION") {
        return "__end__"
    }
    if (state.nextRepresentative === "RESPOND") {
        return "__end__"
    }
    if (state.nextRepresentative === "POST_GENERATOR") {
        return "postGeneratorAgent"
    }
    return "__end__"
}

function whoIsNextForPostFeedbackAgent(state: typeof StateAnnotation.State) {
    // CHANGED: Implement iterative loop with max 3 iterations
    if (state.feedBackReviewCount && state.feedBackReviewCount < 3) {
        return "promptBuilderAgent" // CHANGED: Go back to prompt builder for refinement
    }
    return "__end__"
}

// CHANGED: Fixed graph configuration with proper routing
const graph = new StateGraph(StateAnnotation)
    .addNode("frontdeskAgent", frontdeskAgent)
    .addNode("promptBuilderAgent", promptBuilderAgent)
    .addNode("postGeneratorAgent", postGeneratorAgent)
    .addNode("postFeedbackAgent", postFeedbackAgent)
    .addNode("webSearchToolNode", webSearchToolNode)
    .addEdge("__start__", "frontdeskAgent")
    .addEdge("webSearchToolNode", "promptBuilderAgent") // CHANGED: Web search goes back to prompt builder
    .addEdge("postGeneratorAgent", "postFeedbackAgent")
    .addConditionalEdges("frontdeskAgent", whoIsNextForFrontdesk, {
        promptBuilderAgent: "promptBuilderAgent", // CHANGED: Fixed routing to promptBuilderAgent
        "__end__": "__end__"
    })
    .addConditionalEdges("promptBuilderAgent", whoIsNextForPromptBuilder, {
        webSearchToolNode: "webSearchToolNode",
        postGeneratorAgent: "postGeneratorAgent",
        "__end__": "__end__"
    })
    .addConditionalEdges("postFeedbackAgent", whoIsNextForPostFeedbackAgent, {
        promptBuilderAgent: "promptBuilderAgent", // CHANGED: Go back to prompt builder for iterative refinement
        "__end__": "__end__"
    })

const config = { configurable: { thread_id: "1" } }
const app = graph.compile({
    checkpointer: new MemorySaver()
})

async function main() {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout
    });
    const messages: (HumanMessage | AIMessage)[] = [];

    while (true) {
        const input = await rl.question("You: ");
        if (input.trim().toLowerCase() === "exit") break;

        messages.push(new HumanMessage({ content: input }));
        const response = await app.invoke({ messages }, config);
        const aiReply = response.messages?.slice(-1)[0]?.content ?? "[no response]";
        console.log("AI:", aiReply);
        messages.push(new AIMessage({ content: aiReply }));
    }

    rl.close();
    console.log("Chat ended.");
}

main().catch(console.error);