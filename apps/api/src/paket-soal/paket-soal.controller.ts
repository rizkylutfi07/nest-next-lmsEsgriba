import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaketSoalService } from './paket-soal.service';
import { CreatePaketSoalDto } from './dto/create-paket-soal.dto';
import { UpdatePaketSoalDto } from './dto/update-paket-soal.dto';
import { FilterPaketSoalDto } from './dto/filter-paket-soal.dto';
import { AddSoalDto } from './dto/add-soal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('paket-soal')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaketSoalController {
    constructor(private readonly paketSoalService: PaketSoalService) { }

    @Post()
    @Roles(Role.ADMIN, Role.GURU)
    create(@Body() createPaketSoalDto: CreatePaketSoalDto, @Req() req: any) {
        // If user is GURU, potential security check or auto-fill guruId
        if (req.user.role === Role.GURU) {
            createPaketSoalDto.guruId = req.user.guruId;
        }
        return this.paketSoalService.create(createPaketSoalDto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.GURU)
    findAll(@Query() filterDto: FilterPaketSoalDto) {
        return this.paketSoalService.findAll(filterDto);
    }

    @Get('generate-kode')
    @Roles(Role.ADMIN, Role.GURU)
    async generateKode() {
        const kode = await this.paketSoalService.generateKode();
        return { kode };
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.GURU)
    findOne(@Param('id') id: string) {
        return this.paketSoalService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.ADMIN, Role.GURU)
    update(@Param('id') id: string, @Body() updatePaketSoalDto: UpdatePaketSoalDto) {
        return this.paketSoalService.update(id, updatePaketSoalDto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN, Role.GURU)
    remove(@Param('id') id: string) {
        return this.paketSoalService.remove(id);
    }

    @Post(':id/soal')
    @Roles(Role.ADMIN, Role.GURU)
    addSoal(@Param('id') id: string, @Body() addSoalDto: AddSoalDto) {
        return this.paketSoalService.addSoal(id, addSoalDto);
    }

    @Post(':id/preview')
    @Roles(Role.ADMIN, Role.GURU)
    @UseInterceptors(FileInterceptor('file'))
    async previewImport(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.paketSoalService.previewImport(id, file);
    }

    @Post(':id/import')
    @Roles(Role.ADMIN, Role.GURU)
    @UseInterceptors(FileInterceptor('file'))
    async importSoal(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
        @Body('mataPelajaranId') mataPelajaranId?: string,
    ) {
        return this.paketSoalService.importSoal(id, file, mataPelajaranId);
    }

    @Delete(':id/soal/:itemId')
    @Roles(Role.ADMIN, Role.GURU)
    removeSoal(@Param('id') id: string, @Param('itemId') itemId: string) {
        return this.paketSoalService.removeSoal(id, itemId);
    }
}
