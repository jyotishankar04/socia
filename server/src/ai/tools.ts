import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { TavilySearch } from "@langchain/tavily";

const tavily = new TavilySearch({ maxResults: 5, topic: "general" });

const tavilyInvoke = async (query: string): Promise<string> => {
    const result = await tavily.invoke({ query });
    return typeof result === "string" ? result : JSON.stringify(result);
};

export const webSearchTool = tool(
    ({ query }) => tavilyInvoke(query),
    {
        name: "web_search",
        description:
            "Search the web for current events, statistics, news, research data, or any factual information needed to write an accurate and timely post.",
        schema: z.object({
            query: z.string().describe("Specific, targeted search query"),
        }),
    }
);

export const platformPostResearchTool = tool(
    ({ topic, platform }) => {
        const queries: Record<string, string> = {
            linkedin: `viral high-engagement LinkedIn posts about "${topic}" examples hooks format 2025`,
            twitter: `viral tweets high-engagement about "${topic}" examples best performing 2025`,
            threads: `popular threads.net posts about "${topic}" high engagement examples 2025`,
        };
        return tavilyInvoke(queries[platform] ?? `social media posts about "${topic}" viral examples`);
    },
    {
        name: "research_platform_posts",
        description:
            "Research successful, high-engagement posts on a specific platform about a given topic. Returns examples of real posts that performed well — use this to understand proven angles, hook formats, content structures, and audience tone before writing the content brief.",
        schema: z.object({
            topic: z.string().describe("The topic or niche to research posts about"),
            platform: z
                .enum(["linkedin", "twitter", "threads"])
                .describe("The target platform to research posts on"),
        }),
    }
);

export const trendResearchTool = tool(
    ({ niche, platform }) =>
        tavilyInvoke(
            `trending topics discussions ${niche} ${platform} 2025 what's popular viral`
        ),
    {
        name: "trend_research",
        description:
            "Discover what topics, angles, and conversations are currently trending in a niche on a platform. Use when the user's topic is broad or when you want to find the most timely and resonant angle before finalizing the content brief.",
        schema: z.object({
            niche: z.string().describe("The industry or subject area to check trends in"),
            platform: z
                .enum(["linkedin", "twitter", "threads"])
                .describe("Platform to check for trends"),
        }),
    }
);

export const visitWebsiteTool = tool(
    async ({ url }) => {
        try {
            const response = await fetch(url, {
                headers: { "User-Agent": "Mozilla/5.0 (compatible; SociaResearch/1.0)" },
                signal: AbortSignal.timeout(10_000),
            });
            if (!response.ok) {
                return `Failed to fetch ${url}: HTTP ${response.status}`;
            }
            const html = await response.text();

            // Strip <script>, <style>, <head> blocks entirely
            const stripped = html
                .replace(/<head[\s\S]*?<\/head>/gi, "")
                .replace(/<script\b[\s\S]*?<\/script>/gi, "")
                .replace(/<style\b[\s\S]*?<\/style>/gi, "")
                .replace(/<svg\b[\s\S]*?<\/svg>/gi, "")
                .replace(/<nav\b[\s\S]*?<\/nav>/gi, "")
                .replace(/<footer\b[\s\S]*?<\/footer>/gi, "")
                .replace(/<header\b[\s\S]*?<\/header>/gi, "");

            // Decode common HTML entities then strip remaining tags
            const text = stripped
                .replace(/<[^>]+>/g, " ")
                .replace(/&nbsp;/g, " ")
                .replace(/&amp;/g, "&")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/\s{2,}/g, " ")
                .trim();

            if (!text) return "The page had no readable text content.";

            // Cap at 5 000 chars to stay within context limits
            return text.length > 5000 ? `${text.slice(0, 5000)}\n...[content truncated]` : text;
        } catch (err) {
            return `Error visiting ${url}: ${String(err)}`;
        }
    },
    {
        name: "visit_website",
        description:
            "Visit a URL and extract its full text content. Use whenever the user provides a website link and wants to create a post based on what is on that page (article, blog post, product page, news item, etc.).",
        schema: z.object({
            url: z.string().describe("The full URL to visit (must start with http:// or https://)"),
        }),
    }
);

export const findPersonHandleTool = tool(
    async ({ name, platform }) => {
        const query = `${name} ${platform} profile username handle official account ${platform === "twitter" ? "site:twitter.com OR site:x.com" : `site:${platform}.com`}`;
        return tavilyInvoke(query);
    },
    {
        name: "find_person_handle",
        description: "Find a person's social media username or @handle on a specific platform. Use this when the user wants to @mention someone by name in their post.",
        schema: z.object({
            name: z.string().describe("The person's full name or common alias/brand name to find"),
            platform: z.enum(["linkedin", "twitter", "threads"]).describe("The platform to find their handle on"),
        }),
    }
);

export const researchTools = [visitWebsiteTool, webSearchTool, platformPostResearchTool, trendResearchTool, findPersonHandleTool];
