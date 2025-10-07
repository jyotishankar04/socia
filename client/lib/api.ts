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