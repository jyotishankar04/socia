import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../types";
import { createConversationSchema } from "../validator";
import createHttpError from "http-errors";
import type { ChatService } from "../services/chat.service";

export class ChatController {
    constructor(private chatService: ChatService) { }
    async createConversation(req: AuthRequest, res: Response, next: NextFunction) {
        const body = createConversationSchema.safeParse(req.body)
        if (!body.success) {
            console.log(body.error)
            next(createHttpError(400, JSON.parse(body.error.message)[0].message))
            return;
        }
        const userId = req.auth.userId
        if (!userId) {
            next(createHttpError(400, "User not found"))
            return;
        }

        const { success, conversationId } = await this.chatService.createConversation({ userId, data: body.data })
        if (!success) {
            next(createHttpError(500, "Something went wrong"))
            return;
        }

        return res.json({
            success: true, message: "Conversation created successfully",
            data: {
                conversationId
            }
        })
    }
    async getConversations(req: AuthRequest, res: Response, next: NextFunction) {
        const userId = req.auth.userId
        if (!userId) {
            next(createHttpError(400, "User not found"))
            return;
        }
        const conversations = await this.chatService.getConversations(userId)
        return res.json({ success: true, message: "Conversations fetched successfully", data: conversations })
    }
    async getMessages(req: AuthRequest, res: Response, next: NextFunction) {
        const conversationId = req.params.conversationId
        if (!conversationId) {
            next(createHttpError(400, "Conversation not found"))
            return;
        }
        const messages = await this.chatService.getMessages(conversationId)
        return res.json({ success: true, message: "Messages fetched successfully", data: messages })
    }
}
