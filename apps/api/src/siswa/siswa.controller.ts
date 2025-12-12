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
import { SiswaService } from './siswa.service';
import { CreateSiswaDto } from './dto/create-siswa.dto';
import { UpdateSiswaDto } from './dto/update-siswa.dto';
import { QuerySiswaDto } from './dto/query-siswa.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import * as XLSX from 'xlsx';

@Controller('siswa')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class SiswaController {
  constructor(private readonly siswaService: SiswaService) { }

  @Get()
  findAll(@Query() query: QuerySiswaDto) {
    return this.siswaService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.siswaService.findOne(id);
  }

  @Post()
  create(@Body() createDto: any) {
    const { createUserAccount, ...dto } = createDto;

    if (createUserAccount) {
      return this.siswaService.createWithUser(dto);
    }

    return this.siswaService.create(dto);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File tidak ditemukan');
    }

    // Parse Excel file
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet);

    // Transform Excel rows to match our DTO
    const transformedRows = rows.map((row: any) => ({
      nisn: String(row['NISN'] || row['nisn'] || ''),
      nama: String(row['Nama Lengkap'] || row['nama'] || ''),
      tanggalLahir: row['Tanggal Lahir'] || row['tanggalLahir'] || '',
      alamat: row['Alamat'] || row['alamat'] || '',
      nomorTelepon: row['Nomor Telepon'] || row['nomorTelepon'] ? String(row['Nomor Telepon'] || row['nomorTelepon']) : '',
      email: row['Email'] || row['email'] || '',
      status: row['Status'] || row['status'] || 'AKTIF',
      kelasNama: row['Kelas'] || row['kelasNama'] || '',
      createUserAccount: row['Buat Akun'] === 'Ya' || row['createUserAccount'] === true,
    }));

    return this.siswaService.importFromExcel(transformedRows);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateSiswaDto) {
    return this.siswaService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.siswaService.remove(id);
  }

  @Post('kenaikan-kelas')
  async kenaikanKelas(@Body() dto: any) {
    return this.siswaService.kenaikanKelas(dto);
  }
}
