import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ForumService } from './forum.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('forum')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ForumController {
    constructor(private readonly forumService: ForumService) { }

    @Post('threads')
    @Roles(Role.ADMIN, Role.GURU, Role.SISWA)
    createThread(@Body() data: any, @Req() req: any) {
        const authorId = req.user.userId;
        const authorType = req.user.role === Role.GURU ? 'GURU' : 'SISWA';
        return this.forumService.createThread(data, authorId, authorType);
    }

    @Get('threads')
    @Roles(Role.ADMIN, Role.GURU, Role.SISWA)
    findAllThreads(
        @Query('kategoriId') kategoriId?: string,
        @Query('myThreads') myThreads?: string,
        @Req() req?: any
    ) {
        // For GURU, optionally filter by their own threads
        let authorId: string | undefined;
        if (req.user.role === Role.GURU && myThreads === 'true') {
            authorId = req.user.userId;
        }
        return this.forumService.findAllThreads(kategoriId, authorId);
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
