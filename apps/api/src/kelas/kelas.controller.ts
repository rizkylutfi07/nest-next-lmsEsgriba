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
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
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
@Roles(Role.ADMIN, Role.GURU)
export class KelasController {
  constructor(private readonly kelasService: KelasService) { }

  @Get()
  findAll(@Query() query: QueryKelasDto) {
    return this.kelasService.findAll(query);
  }

  @Get('export')
  async exportExcel(@Res() res: Response) {
    const buffer = await this.kelasService.exportToExcel();

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=data_kelas.xlsx');
    res.send(buffer);
  }

  @Get('template')
  downloadTemplate(@Res() res: Response) {
    const workbook = XLSX.utils.book_new();
    const templateData = [
      {
        'Nama Kelas': 'X Akuntansi',
        'Tingkat': 'X',
        'Kapasitas': 32,
        'Kode Jurusan': 'AK',
        'NIP Kelas': '123456789',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=template_import_kelas.xlsx');
    res.send(buffer);
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
      nama: String(row['Nama Kelas'] || '').trim(),
      tingkat: String(row['Tingkat'] || '').trim(),
      kapasitas: parseInt(String(row['Kapasitas'] || '32')),
      kodeJurusan: String(row['Kode Jurusan'] || '').trim(),
      nipWaliKelas: String(row['NIP Kelas'] || '').trim(),
    }));

    return this.kelasService.importFromExcel(transformedRows);
  }
}
