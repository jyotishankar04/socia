import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { ChatController } from "./chat.controller";
import type { AuthRequest } from "../../shared/types";
import { ChatService } from "./chat.service";
import prisma from "../../config/prisma";


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
router.post("/:conversationId/stream", authenticate, (req, res, next) => {
    return chatController.streamMessage(req as AuthRequest, res, next);
});

router.patch("/:conversationId/posts/:postId/accept", authenticate, (req, res, next) => {
    return chatController.acceptPost(req as AuthRequest, res, next);
});

router.patch("/:conversationId/posts/:postId", authenticate, (req, res, next) => {
    return chatController.updatePost(req as AuthRequest, res, next);
});

router.patch("/:conversationId/rename", authenticate, (req, res, next) => {
    return chatController.renameConversation(req as AuthRequest, res, next);
});

router.delete("/:conversationId", authenticate, (req, res, next) => {
    return chatController.deleteConversation(req as AuthRequest, res, next);
});

router.put("/:conversationId", authenticate, (req, res, next) => {
    return chatController.newMessage(req as AuthRequest, res, next);
});

export default router;