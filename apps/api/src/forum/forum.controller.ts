import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ForumService } from './forum.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '@prisma/client';

@Controller('forum')
@UseGuards(JwtAuthGuard)
export class ForumController {
    constructor(private readonly forumService: ForumService) { }

    @Post('threads')
    createThread(@Body() data: any, @Req() req: any) {
        const authorId = req.user.id;
        const authorType = req.user.role === Role.GURU ? 'GURU' : 'SISWA';
        return this.forumService.createThread(data, authorId, authorType);
    }

    @Get('threads')
    findAllThreads(@Query('kategoriId') kategoriId?: string) {
        return this.forumService.findAllThreads(kategoriId);
    }

    @Get('threads/:id')
    findThread(@Param('id') id: string) {
        return this.forumService.findThread(id);
    }

    @Post('threads/:id/posts')
    createPost(@Param('id') threadId: string, @Body() data: any, @Req() req: any) {
        const authorId = req.user.id;
        const authorType = req.user.role === Role.GURU ? 'GURU' : 'SISWA';
        return this.forumService.createPost(threadId, data, authorId, authorType);
    }

    @Post('posts/:id/react')
    toggleReaction(@Param('id') postId: string, @Body('tipe') tipe: string, @Req() req: any) {
        return this.forumService.toggleReaction(postId, req.user.id, tipe);
    }
}
