import { create } from "zustand";
import type { MediaAsset, ToolType } from "@/types";
import { type EditOperation, generateImage, editImage, saveMediaAsset } from "@/lib/api";

interface StudioContext {
    chatId?: string;
    draftId?: string;
    postTitle?: string;
    platform?: string;
    version?: number;
    audience?: string;
    tone?: string;
}

interface ImageStudioState {
    image: string | null;
    mask: string | null;
    history: string[];
    historyIndex: number;
    prompt: string;
    isLoading: boolean;
    loadingLabel: string;
    selectedTool: ToolType;
    brushSize: number;
    context: StudioContext | null;
    lastGeneratedAsset: MediaAsset | null;

    setImage: (image: string | null) => void;
    setMask: (mask: string | null) => void;
    setPrompt: (prompt: string) => void;
    setSelectedTool: (tool: ToolType) => void;
    setBrushSize: (size: number) => void;
    setContext: (context: StudioContext | null) => void;

    pushHistory: (image: string) => void;
    undo: () => void;
    redo: () => void;

    // Generation
    generateNewImage: (prompt: string, size?: string, quality?: string) => Promise<void>;

    // Editing (all use Gemini)
    generateEdit: () => Promise<void>;
    applyFilter: (filterPrompt: string) => Promise<void>;
    applyExpansion: (aspectRatio: string) => Promise<void>;
    removeBackground: () => Promise<void>;
    replaceBackground: (bgPrompt: string) => Promise<void>;
    removeObject: () => Promise<void>;
    addObject: (objectPrompt: string) => Promise<void>;
    recolor: (colorPrompt: string) => Promise<void>;
    smartEdit: (instruction: string) => Promise<void>;

    saveToLibrary: () => Promise<MediaAsset>;
    reset: () => void;
}

async function runEdit(
    get: () => ImageStudioState,
    set: (s: Partial<ImageStudioState>) => void,
    operation: EditOperation,
    prompt: string,
    opts?: { useMask?: boolean; aspectRatio?: string; label?: string }
) {
    const { image, mask, context } = get();
    if (!image) return;
    set({ isLoading: true, loadingLabel: opts?.label ?? "Processing..." });
    try {
        const res = await editImage({
            imageBase64: image,
            maskBase64: opts?.useMask && mask ? mask : undefined,
            prompt,
            operation,
            aspectRatio: opts?.aspectRatio,
            context: context ?? undefined,
        });
        const { resultBase64, asset } = res.data;
        get().pushHistory(resultBase64);
        set({ mask: null, lastGeneratedAsset: asset ?? null });
    } finally {
        set({ isLoading: false, loadingLabel: "" });
    }
}

export const useImageStudio = create<ImageStudioState>((set, get) => ({
    image: null,
    mask: null,
    history: [],
    historyIndex: -1,
    prompt: "",
    isLoading: false,
    loadingLabel: "",
    selectedTool: "MOVE",
    brushSize: 20,
    context: null,
    lastGeneratedAsset: null,

    setImage: (image) => set({ image }),
    setMask: (mask) => set({ mask }),
    setPrompt: (prompt) => set({ prompt }),
    setSelectedTool: (selectedTool) => set({ selectedTool }),
    setBrushSize: (brushSize) => set({ brushSize }),
    setContext: (context) => set({ context }),

    pushHistory: (image) => {
        const { history, historyIndex } = get();
        const next = history.slice(0, historyIndex + 1);
        next.push(image);
        set({ history: next, historyIndex: next.length - 1, image });
    },

    undo: () => {
        const { history, historyIndex } = get();
        if (historyIndex <= 0) return;
        const i = historyIndex - 1;
        set({ historyIndex: i, image: history[i] });
    },

    redo: () => {
        const { history, historyIndex } = get();
        if (historyIndex >= history.length - 1) return;
        const i = historyIndex + 1;
        set({ historyIndex: i, image: history[i] });
    },

    generateNewImage: async (prompt, size = "1024x1024", quality = "medium") => {
        set({ isLoading: true, loadingLabel: "Generating image..." });
        try {
            const res = await generateImage({ prompt, size, quality, context: get().context ?? undefined });
            const asset: MediaAsset = res.data;
            const response = await fetch(asset.url);
            const blob = await response.blob();
            const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
            get().pushHistory(base64);
            set({ lastGeneratedAsset: asset, mask: null });
        } finally {
            set({ isLoading: false, loadingLabel: "" });
        }
    },

    generateEdit: async () => {
        const { prompt } = get();
        if (!prompt) return;
        await runEdit(get, set, "inpaint", prompt, { useMask: true, label: "Editing selection..." });
    },

    applyFilter: async (filterPrompt) => {
        await runEdit(get, set, "filter", filterPrompt, { label: "Applying filter..." });
    },

    applyExpansion: async (aspectRatio) => {
        const { prompt } = get();
        await runEdit(get, set, "expand", prompt || "Expand naturally", { aspectRatio, label: "Expanding canvas..." });
    },

    removeBackground: async () => {
        await runEdit(get, set, "remove-background", "Remove the background, keep only the main subject", { label: "Removing background..." });
    },

    replaceBackground: async (bgPrompt) => {
        await runEdit(get, set, "replace-background", bgPrompt, { label: "Replacing background..." });
    },

    removeObject: async () => {
        await runEdit(get, set, "remove-object", "Remove the selected object and fill naturally", { useMask: true, label: "Removing object..." });
    },

    addObject: async (objectPrompt) => {
        await runEdit(get, set, "add-object", objectPrompt, { useMask: true, label: "Adding object..." });
    },

    recolor: async (colorPrompt) => {
        await runEdit(get, set, "recolor", colorPrompt, { label: "Recoloring..." });
    },

    smartEdit: async (instruction) => {
        await runEdit(get, set, "smart-edit", instruction, { label: "Applying edit..." });
    },

    saveToLibrary: async () => {
        const { lastGeneratedAsset, image, context } = get();
        if (lastGeneratedAsset) return lastGeneratedAsset;
        if (!image) throw new Error("No image to save");
        const res = await saveMediaAsset({
            name: `studio-${Date.now()}.png`,
            url: image,
            type: "IMAGE",
            source: "GENERATED",
            metadata: { context },
        });
        const asset: MediaAsset = res.data;
        set({ lastGeneratedAsset: asset });
        return asset;
    },

    reset: () => set({
        image: null, mask: null, history: [], historyIndex: -1,
        prompt: "", isLoading: false, loadingLabel: "",
        selectedTool: "MOVE", brushSize: 20, context: null, lastGeneratedAsset: null,
    }),
}));
