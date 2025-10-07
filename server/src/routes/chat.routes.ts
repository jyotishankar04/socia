import { Router } from "express";
import { authenticate } from "../middlewares/auth.midddleware";
import { ChatController } from "../controllers/chat.controller";
import type { AuthRequest } from "../types";
import { ChatService } from "../services/chat.service";
import prisma from "../config/prisma";


const router = Router();
const chatService = new ChatService(prisma);
const chatController = new ChatController(chatService);

router.post("/new",authenticate, (req, res, next) => {
    return chatController.createConversation(req as AuthRequest, res, next);
});

router.get("/",authenticate, (req, res, next) => {
    return chatController.getConversations(req as AuthRequest, res, next);
});

router.get("/:conversationId",authenticate, (req, res, next) => {
    return chatController.getMessages(req as AuthRequest, res, next);
}); 

export default router;