import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
    Request,
} from '@nestjs/common';
import { UjianService } from './ujian.service';
import { CreateUjianDto } from './dto/create-ujian.dto';
import { UpdateUjianDto } from './dto/update-ujian.dto';
import { FilterUjianDto } from './dto/filter-ujian.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('ujian')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UjianController {
    constructor(private readonly ujianService: UjianService) { }

    @Post()
    @Roles(Role.ADMIN, Role.GURU)
    create(@Body() createUjianDto: CreateUjianDto, @Request() req) {
        return this.ujianService.create(createUjianDto, req.user.userId);
    }

    @Get()
    @Roles(Role.ADMIN, Role.GURU)
    findAll(@Query() filterDto: FilterUjianDto) {
        return this.ujianService.findAll(filterDto);
    }

    @Get('generate-kode')
    @Roles(Role.ADMIN, Role.GURU)
    generateKode() {
        return this.ujianService.generateKode();
    }

    @Get('students-by-classes')
    @Roles(Role.ADMIN, Role.GURU)
    async getStudentsByClasses(@Query('kelasIds') kelasIds: string | string[]) {
        // Ensure kelasIds is an array
        const kelasIdsArray = Array.isArray(kelasIds) ? kelasIds : [kelasIds];

        const students = await this.ujianService['prisma'].siswa.findMany({
            where: {
                kelasId: { in: kelasIdsArray },
                status: 'AKTIF',
                deletedAt: null,
            },
            select: {
                id: true,
                nisn: true,
                nama: true,
                agama: true,
                kelasId: true,
                kelas: {
                    select: {
                        id: true,
                        nama: true,
                    },
                },
            },
            orderBy: [
                { kelas: { nama: 'asc' } },
                { nama: 'asc' },
            ],
        });

        return students;
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.GURU, Role.SISWA)
    findOne(@Param('id') id: string) {
        return this.ujianService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.ADMIN, Role.GURU)
    update(@Param('id') id: string, @Body() updateUjianDto: UpdateUjianDto) {
        return this.ujianService.update(id, updateUjianDto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN, Role.GURU)
    remove(@Param('id') id: string) {
        return this.ujianService.remove(id);
    }

    @Post(':id/publish')
    @Roles(Role.ADMIN, Role.GURU)
    publish(@Param('id') id: string) {
        return this.ujianService.publish(id);
    }

    @Post(':id/assign')
    @Roles(Role.ADMIN, Role.GURU)
    assignToStudents(@Param('id') id: string, @Body() body?: { siswaIds?: string[] }) {
        return this.ujianService.assignToStudents(id, body?.siswaIds);
    }
}
