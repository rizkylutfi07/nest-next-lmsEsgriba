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
import { TahunAjaranService } from './tahun-ajaran.service';
import { CreateTahunAjaranDto } from './dto/create-tahun-ajaran.dto';
import { UpdateTahunAjaranDto } from './dto/update-tahun-ajaran.dto';
import { QueryTahunAjaranDto } from './dto/query-tahun-ajaran.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('tahun-ajaran')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class TahunAjaranController {
    constructor(private readonly tahunAjaranService: TahunAjaranService) { }

    @Get()
    findAll(@Query() query: QueryTahunAjaranDto) {
        return this.tahunAjaranService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.tahunAjaranService.findOne(id);
    }

    @Post()
    create(@Body() createDto: CreateTahunAjaranDto) {
        return this.tahunAjaranService.create(createDto);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateDto: UpdateTahunAjaranDto) {
        return this.tahunAjaranService.update(id, updateDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.tahunAjaranService.remove(id);
    }

    @Get('active/current')
    getActive() {
        return this.tahunAjaranService.getActive();
    }

    @Post(':id/set-active')
    setActive(@Param('id') id: string) {
        return this.tahunAjaranService.setActive(id);
    }
}
