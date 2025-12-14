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
import { MataPelajaranService } from './mata-pelajaran.service';
import { CreateMataPelajaranDto } from './dto/create-mata-pelajaran.dto';
import { UpdateMataPelajaranDto } from './dto/update-mata-pelajaran.dto';
import { QueryMataPelajaranDto } from './dto/query-mata-pelajaran.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('mata-pelajaran')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class MataPelajaranController {
  constructor(private readonly matapelajaranService: MataPelajaranService) { }

  @Get()
  findAll(@Query() query: QueryMataPelajaranDto) {
    return this.matapelajaranService.findAll(query);
  }

  @Get('export')
  async exportExcel(@Res() res: Response) {
    const buffer = await this.matapelajaranService.exportToExcel();

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=data_mata_pelajaran.xlsx');
    res.send(buffer);
  }

  @Get('template')
  downloadTemplate(@Res() res: Response) {
    const workbook = XLSX.utils.book_new();
    const templateData = [
      {
        'Kode': 'MTK',
        'Nama': 'Matematika',
        'Jam Pelajaran': 4,
        'Tingkat': 'SEMUA',
        'Deskripsi': 'Mata pelajaran matematika',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=template_import_mata_pelajaran.xlsx');
    res.send(buffer);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matapelajaranService.findOne(id);
  }

  @Post()
  create(@Body() createDto: CreateMataPelajaranDto) {
    return this.matapelajaranService.create(createDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateMataPelajaranDto) {
    return this.matapelajaranService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matapelajaranService.remove(id);
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
      kode: String(row['Kode'] || row['kode'] || ''),
      nama: String(row['Nama'] || row['nama'] || ''),
      jamPelajaran: parseInt(row['Jam Pelajaran'] || row['jamPelajaran'] || '2'),
      tingkat: String(row['Tingkat'] || row['tingkat'] || 'SEMUA'),
      deskripsi: row['Deskripsi'] || row['deskripsi'] || '',
    }));

    return this.matapelajaranService.importFromExcel(transformedRows);
  }
}
