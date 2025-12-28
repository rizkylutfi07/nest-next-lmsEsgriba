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
    Res,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { JurusanService } from './jurusan.service';
import { CreateJurusanDto } from './dto/create-jurusan.dto';
import { UpdateJurusanDto } from './dto/update-jurusan.dto';
import { QueryJurusanDto } from './dto/query-jurusan.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('jurusan')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class JurusanController {
    constructor(private readonly jurusanService: JurusanService) { }

    @Get()
    findAll(@Query() query: QueryJurusanDto) {
        return this.jurusanService.findAll(query);
    }

    @Get('export/excel')
    async exportExcel(@Res() res: Response) {
        const buffer = await this.jurusanService.exportToExcel();
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="Data_Jurusan_${new Date().toISOString().split('T')[0]}.xlsx"`,
            'Content-Length': buffer.length,
        });
        res.send(buffer);
    }

    @Get('template/excel')
    async downloadTemplate(@Res() res: Response) {
        const buffer = await this.jurusanService.generateTemplate();
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename="Template_Import_Jurusan.xlsx"',
            'Content-Length': buffer.length,
        });
        res.send(buffer);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.jurusanService.findOne(id);
    }

    @Post()
    create(@Body() createDto: CreateJurusanDto) {
        return this.jurusanService.create(createDto);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateDto: UpdateJurusanDto) {
        return this.jurusanService.update(id, updateDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.jurusanService.remove(id);
    }

    @Post('import/excel')
    @UseInterceptors(FileInterceptor('file'))
    async importExcel(@UploadedFile() file: Express.Multer.File) {
        return this.jurusanService.importFromExcel(file);
    }
}
