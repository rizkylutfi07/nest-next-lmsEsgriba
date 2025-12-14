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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as XLSX from 'xlsx';
import { KelasService } from './kelas.service';
import { CreateKelasDto } from './dto/create-kelas.dto';
import { UpdateKelasDto } from './dto/update-kelas.dto';
import { QueryKelasDto } from './dto/query-kelas.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('kelas')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class KelasController {
  constructor(private readonly kelasService: KelasService) { }

  @Get()
  findAll(@Query() query: QueryKelasDto) {
    return this.kelasService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kelasService.findOne(id);
  }

  @Post()
  create(@Body() createDto: CreateKelasDto) {
    return this.kelasService.create(createDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateKelasDto) {
    return this.kelasService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kelasService.remove(id);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File tidak ditemukan');
    }

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet);

    const transformedRows = rows.map((row: any) => ({
      nama: String(row['Nama Kelas'] || row['nama'] || ''),
      tingkat: String(row['Tingkat'] || row['tingkat'] || ''),
      kapasitas: parseInt(row['Kapasitas'] || row['kapasitas'] || '32'),
      kodeJurusan: row['Kode Jurusan'] || row['kodeJurusan'] || '',
      nipWaliKelas: row['NIP Wali Kelas'] || row['nipWaliKelas'] || '',
    }));

    return this.kelasService.importFromExcel(transformedRows);
  }
}
