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
  constructor(private readonly guruService: GuruService) {}

  @Get()
  findAll(@Query() query: QueryGuruDto) {
    return this.guruService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.guruService.findOne(id);
  }

  @Post()
  create(@Body() createDto: CreateGuruDto) {
    return this.guruService.create(createDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateGuruDto) {
    return this.guruService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.guruService.remove(id);
  }
}
