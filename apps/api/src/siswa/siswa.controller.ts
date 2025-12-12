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
import { SiswaService } from './siswa.service';
import { CreateSiswaDto } from './dto/create-siswa.dto';
import { UpdateSiswaDto } from './dto/update-siswa.dto';
import { QuerySiswaDto } from './dto/query-siswa.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('siswa')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class SiswaController {
  constructor(private readonly siswaService: SiswaService) {}

  @Get()
  findAll(@Query() query: QuerySiswaDto) {
    return this.siswaService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.siswaService.findOne(id);
  }

  @Post()
  create(@Body() createDto: CreateSiswaDto) {
    return this.siswaService.create(createDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateSiswaDto) {
    return this.siswaService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.siswaService.remove(id);
  }
}
