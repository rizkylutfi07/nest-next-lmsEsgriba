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
    UseInterceptors,
    UploadedFiles,
    BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { TugasService } from './tugas.service';
import { CreateTugasDto, UpdateTugasDto, SubmitTugasDto, GradeTugasDto } from './dto/tugas.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

// File upload configuration for assignments
const tugasStorage = diskStorage({
    destination: './uploads/tugas',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `tugas-${uniqueSuffix}${extname(file.originalname)}`);
    },
});

// File upload configuration for submissions
const submissionStorage = diskStorage({
    destination: './uploads/submissions',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `submission-${uniqueSuffix}${extname(file.originalname)}`);
    },
});

@Controller('tugas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TugasController {
    constructor(private readonly tugasService: TugasService) { }

    @Post()
    @Roles(Role.GURU, Role.ADMIN)
    @UseInterceptors(
        FilesInterceptor('attachments', 5, {
            storage: tugasStorage,
            limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
        })
    )
    async create(
        @Body() createTugasDto: CreateTugasDto,
        @UploadedFiles() files: Express.Multer.File[],
        @Req() req: any
    ) {
        let guruId: string;

        // If GURU role, always use their own guruId
        if (req.user.role === Role.GURU) {
            guruId = req.user.guru?.id;
            if (!guruId) {
                throw new BadRequestException('Guru profile not found for this user');
            }
        }
        // If ADMIN, use guruId from request body
        else if (req.user.role === Role.ADMIN) {
            guruId = createTugasDto.guruId || req.user.guru?.id;
            if (!guruId) {
                throw new BadRequestException('ADMIN must specify guruId when creating assignment');
            }
        } else {
            throw new BadRequestException('Unauthorized role');
        }

        const tugas = await this.tugasService.create(guruId, createTugasDto);

        // Add attachments if any files were uploaded
        if (files && files.length > 0) {
            for (const file of files) {
                await this.tugasService.addAttachment(
                    tugas.id,
                    file.originalname,
                    file.size,
                    file.mimetype,
                    file.filename
                );
            }
        }

        return this.tugasService.findOne(tugas.id);
    }

    @Get()
    @Roles(Role.ADMIN, Role.GURU, Role.SISWA)
    findAll(@Query() filters?: any, @Req() req?: any) {
        // If student, only show published assignments for their class
        // Also include their own submissions for dashboard stats
        if (req.user.role === Role.SISWA) {
            const kelasId = req.user.siswa?.kelasId;
            const siswaId = req.user.siswa?.id;

            console.log('[TUGAS CONTROLLER] Student request:');
            console.log('  kelasId:', kelasId);
            console.log('  siswaId:', siswaId);

            return this.tugasService.findAll({
                ...filters,
                kelasId,
                siswaId,
                isPublished: true,
            });
        }

        // For guru, optionally filter by their own assignments
        if (req.user.role === Role.GURU && filters?.myAssignments === 'true') {
            return this.tugasService.findAll({
                ...filters,
                guruId: req.user.guru?.id,
            });
        }

        return this.tugasService.findAll(filters);
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.GURU, Role.SISWA)
    findOne(@Param('id') id: string) {
        return this.tugasService.findOne(id);
    }

    @Put(':id')
    @Roles(Role.GURU, Role.ADMIN)
    update(
        @Param('id') id: string,
        @Body() updateTugasDto: UpdateTugasDto,
        @Req() req: any
    ) {
        const isAdmin = req.user.role === Role.ADMIN;
        const guruId = req.user.guru?.id || null;
        return this.tugasService.update(id, guruId, updateTugasDto, isAdmin);
    }

    @Delete(':id')
    @Roles(Role.GURU, Role.ADMIN)
    remove(@Param('id') id: string, @Req() req: any) {
        const isAdmin = req.user.role === Role.ADMIN;
        const guruId = req.user.guru?.id || null;
        return this.tugasService.remove(id, guruId, isAdmin);
    }

    @Get(':id/submissions')
    @Roles(Role.GURU, Role.ADMIN)
    getSubmissions(@Param('id') tugasId: string) {
        return this.tugasService.getSubmissions(tugasId);
    }

    @Post(':id/submit')
    @Roles(Role.SISWA)
    @UseInterceptors(
        FilesInterceptor('files', 5, {
            storage: submissionStorage,
            limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
        })
    )
    async submit(
        @Param('id') tugasId: string,
        @Body() submitTugasDto: SubmitTugasDto,
        @UploadedFiles() files: Express.Multer.File[],
        @Req() req: any
    ) {
        const siswaId = req.user.siswa?.id;
        if (!siswaId) {
            throw new BadRequestException('Siswa profile not found');
        }

        const submission = await this.tugasService.submitTugas(tugasId, siswaId, submitTugasDto);

        // Add files if any were uploaded
        if (files && files.length > 0) {
            for (const file of files) {
                await this.tugasService.addSubmissionFile(
                    submission.id,
                    file.originalname,
                    file.size,
                    file.mimetype,
                    file.filename
                );
            }
        }

        // Return the updated submission with files
        return this.tugasService.getSubmissions(tugasId).then(submissions =>
            submissions.find(s => s.siswaId === siswaId)
        );
    }

    @Put(':tugasId/grade/:siswaId')
    @Roles(Role.GURU, Role.ADMIN)
    grade(
        @Param('tugasId') tugasId: string,
        @Param('siswaId') siswaId: string,
        @Body() gradeTugasDto: GradeTugasDto
    ) {
        return this.tugasService.gradeTugas(tugasId, siswaId, gradeTugasDto.score, gradeTugasDto.feedback);
    }
}
