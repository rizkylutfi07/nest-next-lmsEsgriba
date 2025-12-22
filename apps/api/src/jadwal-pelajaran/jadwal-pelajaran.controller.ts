import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
} from '@nestjs/common';
import { JadwalPelajaranService } from './jadwal-pelajaran.service';
import { CreateJadwalPelajaranDto } from './dto/create-jadwal-pelajaran.dto';
import { UpdateJadwalPelajaranDto } from './dto/update-jadwal-pelajaran.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('jadwal-pelajaran')
@UseGuards(JwtAuthGuard)
export class JadwalPelajaranController {
    constructor(private readonly jadwalPelajaranService: JadwalPelajaranService) { }

    @Get()
    findAll(@Query('kelasId') kelasId?: string, @Query('hari') hari?: string, @CurrentUser() user?: any) {
        return this.jadwalPelajaranService.findAll(kelasId, hari, user);
    }

    @Get('kelas/:kelasId')
    findByKelas(@Param('kelasId') kelasId: string) {
        return this.jadwalPelajaranService.findByKelas(kelasId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.jadwalPelajaranService.findOne(id);
    }

    @Post()
    create(@Body() dto: CreateJadwalPelajaranDto, @CurrentUser() user?: any) {
        if (user?.role === 'SISWA') {
            throw new Error('SISWA tidak memiliki akses untuk membuat jadwal');
        }
        return this.jadwalPelajaranService.create(dto);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdateJadwalPelajaranDto, @CurrentUser() user?: any) {
        if (user?.role === 'SISWA') {
            throw new Error('SISWA tidak memiliki akses untuk mengubah jadwal');
        }
        return this.jadwalPelajaranService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @CurrentUser() user?: any) {
        if (user?.role === 'SISWA') {
            throw new Error('SISWA tidak memiliki akses untuk menghapus jadwal');
        }
        return this.jadwalPelajaranService.remove(id);
    }
}
