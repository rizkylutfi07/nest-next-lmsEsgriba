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
    BadRequestException,
} from '@nestjs/common';
import { RppService } from './rpp.service';
import { AiRppService } from './ai-rpp.service';
import { CreateRppDto, UpdateRppDto, QueryRppDto } from './dto/rpp.dto';
import { GenerateRppDto } from './dto/generate-rpp.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('rpp')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RppController {
    constructor(
        private readonly rppService: RppService,
        private readonly aiRppService: AiRppService,
    ) { }

    @Post()
    @Roles(Role.GURU, Role.ADMIN)
    async create(@Body() createRppDto: CreateRppDto, @Req() req: any) {
        let guruId: string;

        // If GURU role, always use their own guruId
        if (req.user.role === Role.GURU) {
            guruId = req.user.guru?.id;
            if (!guruId) {
                throw new BadRequestException('Guru profile not found for this user');
            }
        }
        // If ADMIN, can create RPP for any guru (requires guruId in request)
        else if (req.user.role === Role.ADMIN) {
            guruId = req.user.guru?.id;
            if (!guruId) {
                throw new BadRequestException('ADMIN must have a guru profile or specify guruId');
            }
        } else {
            throw new BadRequestException('Unauthorized role');
        }

        return this.rppService.create(guruId, createRppDto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.GURU, Role.SISWA)
    findAll(@Query() filters: QueryRppDto, @Req() req: any) {
        // If GURU, filter by their own RPP
        if (req.user.role === Role.GURU && req.user.guru?.id) {
            return this.rppService.findAll({
                ...filters,
                guruId: req.user.guru.id,
            });
        }

        // If SISWA, only show published RPP for their class
        if (req.user.role === Role.SISWA) {
            const kelasId = req.user.siswa?.kelasId;
            return this.rppService.findAll({
                ...filters,
                kelasId,
                status: 'PUBLISHED',
            });
        }

        // For ADMIN, show all
        return this.rppService.findAll(filters);
    }

    @Get('my')
    @Roles(Role.GURU)
    getMyRpp(@Query() filters: QueryRppDto, @Req() req: any) {
        const guruId = req.user.guru?.id;
        if (!guruId) {
            throw new BadRequestException('Guru profile not found');
        }

        return this.rppService.findAll({
            ...filters,
            guruId,
        });
    }

    @Get('stats')
    @Roles(Role.GURU, Role.ADMIN)
    getStats(@Req() req: any) {
        const guruId = req.user.role === Role.GURU ? req.user.guru?.id : undefined;
        return this.rppService.getStats(guruId);
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.GURU, Role.SISWA)
    findOne(@Param('id') id: string) {
        return this.rppService.findOne(id);
    }

    @Put(':id')
    @Roles(Role.GURU, Role.ADMIN)
    update(
        @Param('id') id: string,
        @Body() updateRppDto: UpdateRppDto,
        @Req() req: any
    ) {
        const isAdmin = req.user.role === Role.ADMIN;
        const guruId = req.user.guru?.id || null;
        return this.rppService.update(id, guruId, updateRppDto, isAdmin);
    }

    @Delete(':id')
    @Roles(Role.GURU, Role.ADMIN)
    remove(@Param('id') id: string, @Req() req: any) {
        const isAdmin = req.user.role === Role.ADMIN;
        const guruId = req.user.guru?.id || null;
        return this.rppService.remove(id, guruId, isAdmin);
    }

    @Post(':id/publish')
    @Roles(Role.GURU, Role.ADMIN)
    publish(@Param('id') id: string, @Req() req: any) {
        const isAdmin = req.user.role === Role.ADMIN;
        const guruId = req.user.guru?.id || null;
        return this.rppService.publish(id, guruId, isAdmin);
    }

    @Post(':id/duplicate')
    @Roles(Role.GURU, Role.ADMIN)
    duplicate(@Param('id') id: string, @Req() req: any) {
        const guruId = req.user.guru?.id;
        if (!guruId) {
            throw new BadRequestException('Guru profile not found');
        }
        return this.rppService.duplicate(id, guruId);
    }

    @Post('generate')
    @Roles(Role.GURU, Role.ADMIN)
    async generateWithAI(@Body() generateDto: GenerateRppDto) {
        return this.aiRppService.generateRpp(generateDto);
    }
}
