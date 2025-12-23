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
import { GuruService } from './guru.service';
import { CreateGuruDto } from './dto/create-guru.dto';
import { UpdateGuruDto } from './dto/update-guru.dto';
import { QueryGuruDto } from './dto/query-guru.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('guru')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class GuruController {
  constructor(private readonly guruService: GuruService) { }

  @Get()
  findAll(@Query() query: QueryGuruDto) {
    return this.guruService.findAll(query);
  }

  @Get('export')
  async exportExcel(@Res() res: Response) {
    const buffer = await this.guruService.exportToExcel();

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=data_guru.xlsx');
    res.send(buffer);
  }

  @Get('template')
  downloadTemplate(@Res() res: Response) {
    const workbook = XLSX.utils.book_new();
    const templateData = [
      {
        'NIP': '123456789',
        'Nama Lengkap': 'Ahmad Fauzi',
        'Email': 'ahmad@school.com',
        'Nomor Telepon': '081234567890',
        'Status': 'AKTIF',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=template_import_guru.xlsx');
    res.send(buffer);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.GURU)
  findOne(@Param('id') id: string) {
    return this.guruService.findOne(id);
  }

  @Post()
  create(@Body() createDto: any) {
    const { createUserAccount, ...dto } = createDto;

    if (createUserAccount) {
      return this.guruService.createWithUser(dto);
    }

    return this.guruService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateGuruDto) {
    return this.guruService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.guruService.remove(id);
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
      nip: String(row['NIP'] || row['nip'] || ''),
      nama: String(row['Nama Lengkap'] || row['Nama'] || row['nama'] || ''),
      email: String(row['Email'] || row['email'] || ''),
      nomorTelepon: row['Nomor Telepon'] || row['nomorTelepon'] || '',
      status: row['Status'] || row['status'] || 'AKTIF',
    }));

    return this.guruService.importFromExcel(transformedRows);
  }
}
