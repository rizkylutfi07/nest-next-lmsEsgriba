import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { TugasService } from './tugas.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('tugas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TugasController {
    constructor(private readonly tugasService: TugasService) { }

    @Post()
    @Roles(Role.GURU)
    create(@Body() data: any, @Req() req: any) {
        const guruId = req.user.guru?.id;
        return this.tugasService.create(guruId, data);
    }

    @Get()
    @Roles(Role.ADMIN, Role.GURU, Role.SISWA)
    findAll(@Query() filters?: any) {
        return this.tugasService.findAll(filters);
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.GURU, Role.SISWA)
    findOne(@Param('id') id: string) {
        return this.tugasService.findOne(id);
    }

    @Post(':id/submit')
    @Roles(Role.SISWA)
    submit(@Param('id') tugasId: string, @Body() data: any, @Req() req: any) {
        const siswaId = req.user.siswa?.id;
        return this.tugasService.submitTugas(tugasId, siswaId, data);
    }

    @Put(':tugasId/grade/:siswaId')
    @Roles(Role.GURU)
    grade(@Param('tugasId') tugasId: string, @Param('siswaId') siswaId: string, @Body() data: any) {
        return this.tugasService.gradeTugas(tugasId, siswaId, data.score, data.feedback);
    }
}
