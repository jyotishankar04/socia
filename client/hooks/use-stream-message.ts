"use client"

import { useState, useCallback } from "react";
import type { ResourceItem, SearchItem } from "@/types";

type StreamEvent =
    | { type: "step"; step: string; message: string; sources?: string[] }
    | { type: "search"; label: string; query: string; icon: string }
    | { type: "metadata"; score: number | null; iterations: number; platform: string | null; tone: string | null; resources?: ResourceItem[] }
    | { type: "complete"; content: string }
    | { type: "error"; message: string };

export function useStreamMessage(conversationId: string) {
    const [isStreaming, setIsStreaming] = useState(false);
    const [currentStep, setCurrentStep] = useState<string | null>(null);
    const [currentSources, setCurrentSources] = useState<string[]>([]);
    const [liveSearches, setLiveSearches] = useState<SearchItem[]>([]);

    const sendMessage = useCallback(
        async (content: string, onComplete: () => void) => {
            setIsStreaming(true);
            setCurrentStep("Starting...");
            setLiveSearches([]);

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/conversations/${conversationId}/stream`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({ content }),
                    }
                );

                if (!response.ok || !response.body) {
                    throw new Error("Stream request failed");
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let buffer = "";

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split("\n");
                    buffer = lines.pop() ?? "";

                    for (const line of lines) {
                        if (!line.startsWith("data: ")) continue;
                        try {
                            const event: StreamEvent = JSON.parse(line.slice(6));
                            if (event.type === "step") {
                                setCurrentStep(event.message);
                                if (event.sources?.length) setCurrentSources(event.sources);
                            } else if (event.type === "search") {
                                setLiveSearches(prev => [...prev, { label: event.label, query: event.query, icon: event.icon as SearchItem["icon"] }]);
                            } else if (event.type === "complete") {
                                setCurrentStep(null);
                            }
                        } catch {
                            // ignore malformed lines
                        }
                    }
                }
            } catch {
                // stream failed — still refresh so any partial DB state is reflected
            } finally {
                setIsStreaming(false);
                setCurrentStep(null);
                setCurrentSources([]);
                setLiveSearches([]);
                // Call onComplete after stream closes — server has finished saving to DB by then
                onComplete();
            }
        },
        [conversationId]
    );

    return { sendMessage, isStreaming, currentStep, currentSources, liveSearches };
}
