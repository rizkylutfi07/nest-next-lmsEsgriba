import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
} from '@nestjs/common';
import { PengumumanService } from './pengumuman.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('pengumuman')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PengumumanController {
    constructor(private readonly pengumumanService: PengumumanService) { }

    @Post()
    @Roles(Role.ADMIN, Role.GURU)
    create(@Request() req, @Body() createPengumumanDto: { judul: string; konten: string; targetRoles: Role[]; isActive?: boolean }) {
        return this.pengumumanService.create({
            ...createPengumumanDto,
            authorId: req.user.userId,
        });
    }

    @Get()
    findAll(@Request() req) {
        const userRole = req.user.role;
        // Admins can see everything via manage endpoint usually, but this is for dashboard view
        if (userRole === Role.ADMIN) {
            return this.pengumumanService.findAllForAdmin();
        }
        return this.pengumumanService.findAll(userRole);
    }

    @Get('manage')
    @Roles(Role.ADMIN)
    findAllManage() {
        return this.pengumumanService.findAllForAdmin();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.pengumumanService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.ADMIN)
    update(@Param('id') id: string, @Body() updatePengumumanDto: any) {
        return this.pengumumanService.update(id, updatePengumumanDto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    remove(@Param('id') id: string) {
        return this.pengumumanService.remove(id);
    }
}
