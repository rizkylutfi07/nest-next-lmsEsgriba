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
    Req,
    ParseBoolPipe,
    DefaultValuePipe,
    BadRequestException,
} from '@nestjs/common';
import { MateriService } from './materi.service';
import { CreateMateriDto, UpdateMateriDto } from './dto/materi.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('materi')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MateriController {
    constructor(private readonly materiService: MateriService) { }

    @Post()
    @Roles(Role.GURU, Role.ADMIN)
    async create(@Body() createMateriDto: CreateMateriDto, @Req() req: any) {
        let guruId: string;

        // If GURU role, always use their own guruId
        if (req.user.role === Role.GURU) {
            guruId = req.user.guru?.id;
            if (!guruId) {
                throw new BadRequestException('Guru profile not found for this user');
            }
        }
        // If ADMIN, use guruId from request body (they can choose)
        else if (req.user.role === Role.ADMIN) {
            guruId = (createMateriDto as any).guruId;
            if (!guruId) {
                throw new BadRequestException('ADMIN must specify guruId when creating material');
            }
        } else {
            throw new BadRequestException('Unauthorized role');
        }

        return this.materiService.create(guruId, createMateriDto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.GURU, Role.SISWA)
    findAll(
        @Query('mataPelajaranId') mataPelajaranId?: string,
        @Query('kelasId') kelasId?: string,
        @Query('guruId') guruId?: string,
        @Query('isPublished') isPublished?: boolean,
        @Query('search') search?: string,
    ) {
        return this.materiService.findAll({
            mataPelajaranId,
            kelasId,
            guruId,
            isPublished,
            search,
        });
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.GURU, Role.SISWA)
    findOne(
        @Param('id') id: string,
        @Query('incrementView', new DefaultValuePipe(false), ParseBoolPipe) incrementView: boolean,
    ) {
        return this.materiService.findOne(id, incrementView);
    }

    @Put(':id')
    @Roles(Role.GURU)
    update(
        @Param('id') id: string,
        @Body() updateMateriDto: UpdateMateriDto,
        @Req() req: any,
    ) {
        const guruId = req.user.guru?.id;
        return this.materiService.update(id, guruId, updateMateriDto);
    }

    @Delete(':id')
    @Roles(Role.GURU)
    remove(@Param('id') id: string, @Req() req: any) {
        const guruId = req.user.guru?.id;
        return this.materiService.remove(id, guruId);
    }

    // Bookmark operations
    @Post(':id/bookmark')
    @Roles(Role.SISWA)
    toggleBookmark(@Param('id') materiId: string, @Req() req: any) {
        const siswaId = req.user.siswa?.id;
        return this.materiService.toggleBookmark(materiId, siswaId);
    }

    @Get('bookmarked/list')
    @Roles(Role.SISWA)
    getBookmarkedMateri(@Req() req: any) {
        const siswaId = req.user.siswa?.id;
        return this.materiService.getBookmarkedMateri(siswaId);
    }
}
