import type { PrismaClient } from "../generated/prisma";
import { Platform } from "../generated/prisma";
import { MessageRole } from "../generated/prisma";

export class ChatService {
    constructor(private prisma: PrismaClient) { }

    async createConversation({ userId, data }: { userId: string, data: { content: string,platform: string } }): Promise<{ success: boolean, conversationId: string }> {
        const conversation = await this.prisma.conversation.create({
            data: {
                title: data.content.substring(0, 50),
                platform: data.platform as Platform,
                user: {
                    connect: {
                        id: userId
                    },
                },
                messages: {
                    create: {
                        content: data.content,
                        role: MessageRole.USER,
                    }
                }
            }
        })
        return { success: true, conversationId: conversation.id }
    }
    async getConversations(userId: string) {
        const conversations = await this.prisma.conversation.findMany({
            where: {
                userId
            },
        })
        return conversations
    }
    async getMessages(conversationId: string) {
        const messages = await this.prisma.message.findMany({
            where: {
                conversationId
            },
        })
        return messages
    }
}