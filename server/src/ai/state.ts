import { Annotation, MessagesAnnotation } from "@langchain/langgraph";

export const StateAnnotation = Annotation.Root({
    ...MessagesAnnotation.spec,
    nextRepresentative: Annotation<string>,
    feedBackReviewCount: Annotation<number>,
    clarificationCount: Annotation<number>,
    contextData: Annotation<Record<string, unknown> | null>,
    contextConfidence: Annotation<number>,
    researchSummary: Annotation<string>,
    contextSources: Annotation<string[]>,
    lastFeedbackScore: Annotation<number>,
    improvementNotes: Annotation<string[]>,
    finalPost: Annotation<string>,
});
