import { api } from "./axios";

export const register = async (data: { name: string; email: string; password: string; }) => {
    return (await api.post("/auth/register", data)).data;
};

export const signin = async (data: { email: string; password: string; }) => {
    return (await api.post("/auth/login", data)).data;
};

export const self = async () => {
    return (await api.get("/auth/self")).data;
};

export const verifyOtp = async (data: { otp: string; userId: string}) => {
    return (await api.post("/auth/verify-otp", data)).data;
};


// Conversations
export const getConversations = async () => {
    return (await api.get("/conversations")).data;
};

export const createConversation = async (data: { content: string; platform: string }) => {
    return (await api.post("/conversations/new", data)).data;
};

export const getConversesation = async (id: string) => {
    return (await api.get(`/conversations/${id}`)).data;
};

export const sendMessage = async (data: { content: string; conversationId: string }) => {
    return (await api.put(`/conversations/${data.conversationId}`, { content: data.content })).data;
};

export const logout = async () => {
    return (await api.get("/auth/logout")).data;
};

export const acceptDraft = async ({ conversationId, postId }: { conversationId: string; postId: string }) => {
    return (await api.patch(`/conversations/${conversationId}/posts/${postId}/accept`)).data;
};

export const renameConversation = async ({ id, title }: { id: string; title: string }) => {
    return (await api.patch(`/conversations/${id}/rename`, { title })).data;
};

export const deleteConversation = async (id: string) => {
    return (await api.delete(`/conversations/${id}`)).data;
};

// Media
export const getMediaAuth = async () => {
    return (await api.get("/media/auth")).data;
};

// Posts
export const updatePost = async ({ conversationId, postId, data }: { conversationId: string; postId: string; data: { content?: string; media?: unknown[] } }) => {
    return (await api.patch(`/conversations/${conversationId}/posts/${postId}`, data)).data;
};

// Media Library
export const getMediaLibrary = async (params?: {
    page?: number; limit?: number; type?: string; source?: string; favorite?: boolean; q?: string;
}) => {
    return (await api.get("/media/library", { params })).data;
};

export const generateImage = async (body: {
    prompt: string; size?: string; quality?: string; context?: { chatId?: string; draftId?: string };
}) => {
    return (await api.post("/media/generate/image", body)).data;
};

export type EditOperation =
    | "inpaint" | "filter" | "expand"
    | "remove-background" | "replace-background"
    | "remove-object" | "add-object"
    | "recolor" | "smart-crop" | "upscale" | "smart-edit";

export const editImage = async (body: {
    imageBase64: string; maskBase64?: string; prompt: string;
    operation: EditOperation; aspectRatio?: string;
    context?: { chatId?: string; draftId?: string };
}) => {
    return (await api.post("/media/edit", body)).data;
};

export const generateBanner = async (body: {
    prompt: string; bannerType?: string; style?: string; context?: { chatId?: string; draftId?: string };
}) => {
    return (await api.post("/media/generate/banner", body)).data;
};

export const generateCarousel = async (body: {
    topic: string; slideCount?: number; audience?: string; tone?: string; context?: { chatId?: string; draftId?: string };
}) => {
    return (await api.post("/media/generate/carousel", body)).data;
};

export const generateThumbnail = async (body: {
    prompt: string; platform?: string; quality?: string;
    referenceImage?: string; context?: { chatId?: string; draftId?: string };
}) => {
    return (await api.post("/media/generate/thumbnail", body)).data;
};

export const saveMediaAsset = async (body: {
    name: string; url: string; type: string; source: string;
    size?: number; width?: number; height?: number; metadata?: unknown;
}) => {
    return (await api.post("/media/save", body)).data;
};

export const deleteMediaAsset = async (assetId: string) => {
    return (await api.delete(`/media/${assetId}`)).data;
};

export const toggleAssetFavorite = async (assetId: string) => {
    return (await api.patch(`/media/${assetId}/favorite`)).data;
};

export const getS3PresignedUrl = async (fileName: string, contentType: string) => {
    return (await api.get("/media/s3-presign", { params: { fileName, contentType } })).data;
};