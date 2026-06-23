import type { PrismaClient } from "../../generated/prisma";
import { Platform, MessageRole } from "../../generated/prisma";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { streamAIResponse, type StreamEvent } from "../../ai/graph";

function extractHashtags(text: string): string[] {
    return (text.match(/#\w+/g) ?? []).map(tag => tag.slice(1));
}

function toPlatform(p: string | null | undefined): Platform {
    switch (p?.toUpperCase()) {
        case "TWITTER":
        case "X": return Platform.X;
        case "THREADS": return Platform.THREADS;
        default: return Platform.LINKEDIN;
    }
}

export class ChatService {
    constructor(private prisma: PrismaClient) { }

    async createConversation({ userId, data }: { userId: string, data: { content: string, platform: string } }): Promise<{ conversationId: string }> {
        const conversation = await this.prisma.conversation.create({
            data: {
                title: data.content.substring(0, 50),
                platform: toPlatform(data.platform),
                user: { connect: { id: userId } },
                messages: {
                    create: { content: data.content, role: MessageRole.USER }
                }
            }
        });

        let aiContent = "";
        let finalPost = "";
        let initialMeta: Record<string, unknown> | null = null;

        try {
            for await (const event of streamAIResponse([new HumanMessage({ content: data.content })])) {
                if (event.type === "metadata") {
                    initialMeta = { score: event.score, iterations: event.iterations, platform: event.platform, tone: event.tone, post: event.post, contextSources: event.contextSources, resources: event.resources };
                    finalPost = event.post;
                }
                if (event.type === "complete") aiContent = event.content;
            }
        } catch (aiErr) {
            console.error("AI pipeline error in createConversation:", aiErr);
            // Delete the orphaned conversation so the user can try again
            await this.prisma.$transaction([
                this.prisma.message.deleteMany({ where: { conversationId: conversation.id } }),
                this.prisma.conversation.delete({ where: { id: conversation.id } }),
            ]);
            throw aiErr;
        }

        const assistantMessage = await this.prisma.message.create({
            data: {
                content: aiContent,
                role: MessageRole.ASSISTANT,
                conversation: { connect: { id: conversation.id } }
            }
        });

        if (finalPost) {
            const draftCount = await this.prisma.post.count({ where: { conversationId: conversation.id } });
            const postRecord = await this.prisma.post.create({
                data: {
                    content: finalPost,
                    platform: conversation.platform,
                    hashtags: extractHashtags(finalPost),
                    version: draftCount + 1,
                    isLastConversationPost: false,
                    isAccepted: false,
                    userId,
                    conversationId: conversation.id,
                    messageId: assistantMessage.id,
                }
            });

            await this.prisma.message.update({
                where: { id: assistantMessage.id },
                data: { metadata: { ...(initialMeta ?? {}), postId: postRecord.id } }
            });
        } else {
            await this.prisma.message.update({
                where: { id: assistantMessage.id },
                data: { metadata: initialMeta as any ?? undefined }
            });
        }

        return { conversationId: conversation.id };
    }

    async getConversations(userId: string) {
        const conversations = await this.prisma.conversation.findMany({
            where: { userId },
            orderBy: { updatedAt: "desc" }
        });
        return conversations;
    }

    async renameConversation(conversationId: string, title: string) {
        return this.prisma.conversation.update({
            where: { id: conversationId },
            data: { title: title.trim().substring(0, 100) },
            select: { id: true, title: true }
        });
    }

    async deleteConversation(conversationId: string) {
        await this.prisma.$transaction([
            this.prisma.post.deleteMany({ where: { conversationId } }),
            this.prisma.message.deleteMany({ where: { conversationId } }),
            this.prisma.conversation.delete({ where: { id: conversationId } }),
        ]);
        return { success: true };
    }

    async getMessages(conversationId: string) {
        const [messages, conversation] = await Promise.all([
            this.prisma.message.findMany({
                where: { conversationId },
                orderBy: { createdAt: "asc" },
                include: { post: true }
            }),
            this.prisma.conversation.findUnique({
                where: { id: conversationId },
                select: { platform: true, title: true }
            })
        ]);
        return {
            messages,
            platform: conversation?.platform?.toLowerCase() ?? "linkedin",
            title: conversation?.title ?? ""
        };
    }

    async getConversation(conversationId: string) {
        return this.prisma.conversation.findUnique({
            where: { id: conversationId },
            select: {
                id: true,
                title: true,
                platform: true,
                user: { select: { id: true } },
                _count: true
            }
        });
    }

    async acceptPost(postId: string, conversationId: string) {
        await this.prisma.$transaction([
            this.prisma.post.updateMany({
                where: { conversationId },
                data: { isLastConversationPost: false, isAccepted: false }
            }),
            this.prisma.post.update({
                where: { id: postId },
                data: { isLastConversationPost: true, isAccepted: true }
            })
        ]);
        return { success: true };
    }

    async updatePost(postId: string, data: { content?: string; media?: Record<string, unknown>[] }) {
        const update: Record<string, unknown> = {};
        if (data.content !== undefined) update.editedContent = data.content;
        if (data.media !== undefined) update.media = data.media;
        return this.prisma.post.update({
            where: { id: postId },
            data: update,
            select: { id: true, editedContent: true, media: true },
        });
    }

    async *streamNewMessage({ content, conversationId, userId }: { content: string, conversationId: string, userId: string }): AsyncGenerator<StreamEvent> {
        await this.prisma.message.create({
            data: {
                content,
                role: MessageRole.USER,
                conversation: { connect: { id: conversationId } }
            }
        });

        const conversation = await this.prisma.conversation.findUnique({
            where: { id: conversationId },
            select: { platform: true }
        });

        const allMessages = await this.prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: "asc" }
        });

        const langGraphMessages = allMessages.map(m =>
            m.role === MessageRole.USER
                ? new HumanMessage({ content: m.content })
                : new AIMessage({ content: m.content })
        );

        let finalContent = "";
        let finalPostContent = "";
        let generationMeta: Record<string, unknown> | null = null;

        for await (const event of streamAIResponse(langGraphMessages)) {
            yield event;
            if (event.type === "metadata") {
                generationMeta = {
                    score: event.score,
                    iterations: event.iterations,
                    platform: event.platform,
                    tone: event.tone,
                    post: event.post,
                    contextSources: event.contextSources,
                    resources: event.resources,
                };
                finalPostContent = event.post;
            }
            if (event.type === "complete") {
                finalContent = event.content;
            }
        }

        if (finalContent) {
            const draftCount = await this.prisma.post.count({ where: { conversationId } });
            const version = draftCount + 1;

            const assistantMessage = await this.prisma.message.create({
                data: {
                    content: finalContent,
                    role: MessageRole.ASSISTANT,
                    conversation: { connect: { id: conversationId } }
                }
            });

            if (finalPostContent) {
                const postRecord = await this.prisma.post.create({
                    data: {
                        content: finalPostContent,
                        platform: conversation?.platform ?? Platform.LINKEDIN,
                        hashtags: extractHashtags(finalPostContent),
                        version,
                        isLastConversationPost: false,
                        isAccepted: false,
                        userId,
                        conversationId,
                        messageId: assistantMessage.id,
                    }
                });

                await this.prisma.message.update({
                    where: { id: assistantMessage.id },
                    data: { metadata: { ...(generationMeta ?? {}), postId: postRecord.id } }
                });
            } else {
                await this.prisma.message.update({
                    where: { id: assistantMessage.id },
                    data: { metadata: generationMeta as any ?? undefined }
                });
            }
        }
    }

    async newMessage({ content, conversationId }: { content: string, conversationId: string }) {
        const userMessage = await this.prisma.message.create({
            data: {
                content,
                role: MessageRole.USER,
                conversation: { connect: { id: conversationId } }
            }
        });

        const allMessages = await this.prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: "asc" }
        });

        const langGraphMessages = allMessages.map(m =>
            m.role === MessageRole.USER
                ? new HumanMessage({ content: m.content })
                : new AIMessage({ content: m.content })
        );

        let aiContent = "";
        let meta: Record<string, unknown> | null = null;
        for await (const event of streamAIResponse(langGraphMessages)) {
            if (event.type === "metadata") {
                meta = { score: event.score, iterations: event.iterations, platform: event.platform, tone: event.tone, post: event.post };
            }
            if (event.type === "complete") aiContent = event.content;
        }

        const aiMessage = await this.prisma.message.create({
            data: {
                content: aiContent,
                role: MessageRole.ASSISTANT,
                metadata: meta as any ?? undefined,
                conversation: { connect: { id: conversationId } }
            }
        });

        return { userMessage, aiMessage };
    }
}
