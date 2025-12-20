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

@Controller('jadwal-pelajaran')
@UseGuards(JwtAuthGuard)
export class JadwalPelajaranController {
    constructor(private readonly jadwalPelajaranService: JadwalPelajaranService) { }

    @Get()
    findAll(@Query('kelasId') kelasId?: string, @Query('hari') hari?: string) {
        return this.jadwalPelajaranService.findAll(kelasId, hari);
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
    create(@Body() dto: CreateJadwalPelajaranDto) {
        return this.jadwalPelajaranService.create(dto);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdateJadwalPelajaranDto) {
        return this.jadwalPelajaranService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.jadwalPelajaranService.remove(id);
    }
}
