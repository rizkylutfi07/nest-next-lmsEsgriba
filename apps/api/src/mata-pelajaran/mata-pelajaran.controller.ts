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
  constructor(private readonly matapelajaranService: MataPelajaranService) {}

  @Get()
  findAll(@Query() query: QueryMataPelajaranDto) {
    return this.matapelajaranService.findAll(query);
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
}
