import { ChatGroq } from "@langchain/groq";
import { ChatOpenAI } from "@langchain/openai";

const useGroq = !!process.env.GROQ_API_KEY;

export const model = useGroq
    ? new ChatGroq({
        model: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
        apiKey: process.env.GROQ_API_KEY,
        temperature: 0.7,
    })
    : new ChatOpenAI({
        model: process.env.OPENROUTER_MODEL ?? "openrouter/owl-alpha",
        apiKey: process.env.OPENROUTER_API_KEY,
        temperature: 0.7,
        configuration: {
            baseURL: "https://openrouter.ai/api/v1",
            defaultHeaders: {
                "HTTP-Referer": process.env.FRONTEND_URL ?? "http://localhost:3000",
                "X-Title": "Qwikish Socia",
            },
        },
    });
