import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ForumService {
    constructor(private readonly prisma: PrismaService) { }

    async createThread(data: any, authorId: string, authorType: string) {
        return this.prisma.forumThread.create({
            data: { ...data, authorId, authorType },
            include: { kategori: true },
        });
    }

    async findAllThreads(kategoriId?: string) {
        return this.prisma.forumThread.findMany({
            where: { deletedAt: null, ...(kategoriId && { kategoriId }) },
            include: {
                kategori: true,
                _count: { select: { posts: true } },
            },
            orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
        });
    }

    async findThread(id: string) {
        return this.prisma.forumThread.findUnique({
            where: { id },
            include: {
                kategori: true,
                posts: {
                    where: { deletedAt: null },
                    include: {
                        replies: { where: { deletedAt: null } },
                        reactions: true,
                    },
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
    }

    async createPost(threadId: string, data: any, authorId: string, authorType: string) {
        // Increment reply count
        await this.prisma.forumThread.update({
            where: { id: threadId },
            data: { replyCount: { increment: 1 } },
        });

        return this.prisma.forumPost.create({
            data: { threadId, ...data, authorId, authorType },
        });
    }

    async toggleReaction(postId: string, userId: string, tipe: string) {
        const existing = await this.prisma.forumReaction.findUnique({
            where: { postId_userId_tipe: { postId, userId, tipe } },
        });

        if (existing) {
            await this.prisma.forumReaction.delete({ where: { id: existing.id } });
            return { reacted: false };
        } else {
            await this.prisma.forumReaction.create({ data: { postId, userId, tipe } });
            return { reacted: true };
        }
    }
}
