export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: string;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Conversation{
    id: string;
    userId: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Message{
    id: string;
    conversationId: string;
    content: string;
    role: "USER" | "ASSISTANT";
    metadata: any;
    post: any;
    createdAt: Date;
    updatedAt: Date;
}
