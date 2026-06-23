import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../../shared/types";
import { createConversationSchema, newMessageSchema } from "../../shared/validators";
import createHttpError from "http-errors";
import type { ChatService } from "./chat.service";

export class ChatController {
    constructor(private chatService: ChatService) { }

    async createConversation(req: AuthRequest, res: Response, next: NextFunction) {
        const body = createConversationSchema.safeParse(req.body);
        if (!body.success) {
            next(createHttpError(400, body.error.issues[0]?.message ?? "Validation error"));
            return;
        }
        const userId = req.auth.userId;
        if (!userId) {
            next(createHttpError(400, "User not found"));
            return;
        }
        try {
            const { conversationId } = await this.chatService.createConversation({ userId, data: body.data });
            return res.json({ success: true, message: "Conversation created successfully", data: { conversationId } });
        } catch (err) {
            console.error("createConversation error:", err);
            next(createHttpError(500, "Failed to create conversation. Please try again."));
        }
    }

    async getConversations(req: AuthRequest, res: Response, next: NextFunction) {
        const userId = req.auth.userId;
        if (!userId) {
            next(createHttpError(400, "User not found"));
            return;
        }
        const conversations = await this.chatService.getConversations(userId);
        return res.json({ success: true, message: "Conversations fetched successfully", data: conversations });
    }

    async getMessages(req: AuthRequest, res: Response, next: NextFunction) {
        const conversationId = req.params.conversationId;
        if (!conversationId) {
            next(createHttpError(400, "Conversation not found"));
            return;
        }
        const messages = await this.chatService.getMessages(conversationId);
        return res.json({ success: true, message: "Messages fetched successfully", data: messages });
    }

    async streamMessage(req: AuthRequest, res: Response, next: NextFunction) {
        const { conversationId } = req.params;
        if (!conversationId) {
            next(createHttpError(400, "Conversation not found"));
            return;
        }

        const body = newMessageSchema.safeParse(req.body);
        if (!body.success) {
            next(createHttpError(400, body.error.issues[0]?.message ?? "Validation error"));
            return;
        }

        const chat = await this.chatService.getConversation(conversationId);
        if (!chat) {
            next(createHttpError(404, "Conversation not found"));
            return;
        }
        if (chat.user.id !== req.auth.userId) {
            next(createHttpError(403, "Not authorized"));
            return;
        }

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.flushHeaders();

        const send = (data: object) => res.write(`data: ${JSON.stringify(data)}\n\n`);

        try {
            for await (const event of this.chatService.streamNewMessage({
                content: body.data.content,
                conversationId,
                userId: req.auth.userId,
            })) {
                send(event);
            }
        } catch (err) {
            console.error("Stream error:", err);
            send({ type: "error", message: "Something went wrong while generating the response." });
        } finally {
            res.end();
        }
    }

    async acceptPost(req: AuthRequest, res: Response, next: NextFunction) {
        const { conversationId, postId } = req.params;
        if (!conversationId || !postId) {
            next(createHttpError(400, "Missing conversationId or postId"));
            return;
        }

        const chat = await this.chatService.getConversation(conversationId);
        if (!chat) {
            next(createHttpError(404, "Conversation not found"));
            return;
        }
        if (chat.user.id !== req.auth.userId) {
            next(createHttpError(403, "Not authorized"));
            return;
        }

        const result = await this.chatService.acceptPost(postId, conversationId);
        return res.json({ success: true, message: "Draft accepted", data: result });
    }

    async updatePost(req: AuthRequest, res: Response, next: NextFunction) {
        const { conversationId, postId } = req.params;
        const { content, media } = req.body;

        if (!conversationId || !postId) {
            next(createHttpError(400, "Missing conversationId or postId"));
            return;
        }

        const chat = await this.chatService.getConversation(conversationId);
        if (!chat) { next(createHttpError(404, "Conversation not found")); return; }
        if (chat.user.id !== req.auth.userId) { next(createHttpError(403, "Not authorized")); return; }

        const result = await this.chatService.updatePost(postId, { content, media });
        return res.json({ success: true, message: "Post updated", data: result });
    }

    async renameConversation(req: AuthRequest, res: Response, next: NextFunction) {
        const { conversationId } = req.params;
        const { title } = req.body;
        if (!conversationId || !title?.trim()) {
            next(createHttpError(400, "Missing conversationId or title"));
            return;
        }
        const chat = await this.chatService.getConversation(conversationId);
        if (!chat) { next(createHttpError(404, "Conversation not found")); return; }
        if (chat.user.id !== req.auth.userId) { next(createHttpError(403, "Not authorized")); return; }
        const result = await this.chatService.renameConversation(conversationId, title);
        return res.json({ success: true, data: result });
    }

    async deleteConversation(req: AuthRequest, res: Response, next: NextFunction) {
        const { conversationId } = req.params;
        if (!conversationId) { next(createHttpError(400, "Missing conversationId")); return; }
        const chat = await this.chatService.getConversation(conversationId);
        if (!chat) { next(createHttpError(404, "Conversation not found")); return; }
        if (chat.user.id !== req.auth.userId) { next(createHttpError(403, "Not authorized")); return; }
        await this.chatService.deleteConversation(conversationId);
        return res.json({ success: true, message: "Conversation deleted" });
    }

    async newMessage(req: AuthRequest, res: Response, next: NextFunction) {
        const { conversationId } = req.params;
        if (!conversationId) {
            next(createHttpError(400, "Conversation not found"));
            return;
        }

        const body = newMessageSchema.safeParse(req.body);
        if (!body.success) {
            next(createHttpError(400, body.error.issues[0]?.message ?? "Validation error"));
            return;
        }

        const chat = await this.chatService.getConversation(conversationId);
        if (!chat) {
            next(createHttpError(400, "Conversation not found"));
            return;
        }
        if (chat.user.id !== req.auth.userId) {
            next(createHttpError(400, "Not authorized"));
            return;
        }

        const result = await this.chatService.newMessage({ content: body.data.content, conversationId });
        return res.json({ success: true, message: "Message sent successfully", data: result });
    }
}
