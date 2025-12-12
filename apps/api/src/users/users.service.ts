import {
    BadRequestException,
    Injectable,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(query: QueryUsersDto) {
        const { page = 1, limit = 10, search, role } = query;
        const skip = (page - 1) * limit;

        const where: any = {};

        // Add search filter
        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { name: { contains: search, mode: 'insensitive' } },
            ];
        }

        // Add role filter
        if (role) {
            where.role = role;
        }

        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }),
            this.prisma.user.count({ where }),
        ]);

        return {
            data: users,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return user;
    }

    async create(dto: CreateUserDto) {
        // Check if email already exists
        const exists = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase() },
        });

        if (exists) {
            throw new BadRequestException('Email sudah terdaftar');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        // Create user
        const user = await this.prisma.user.create({
            data: {
                email: dto.email.toLowerCase(),
                name: dto.name,
                password: hashedPassword,
                role: dto.role ?? Role.SISWA,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return user;
    }

    async update(id: string, dto: UpdateUserDto, currentUserId: string) {
        // Check if user exists
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        // Prevent user from changing their own role
        if (id === currentUserId && dto.role && dto.role !== user.role) {
            throw new ForbiddenException('Cannot change your own role');
        }

        // Check if email is being changed and if it's already taken
        if (dto.email && dto.email.toLowerCase() !== user.email) {
            const emailExists = await this.prisma.user.findUnique({
                where: { email: dto.email.toLowerCase() },
            });
            if (emailExists) {
                throw new BadRequestException('Email sudah digunakan');
            }
        }

        const updateData: any = {};
        if (dto.email) updateData.email = dto.email.toLowerCase();
        if (dto.name) updateData.name = dto.name;
        if (dto.role) updateData.role = dto.role;
        if (dto.password) {
            updateData.password = await bcrypt.hash(dto.password, 10);
        }

        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return updatedUser;
    }

    async remove(id: string, currentUserId: string) {
        // Check if user exists
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        // Prevent user from deleting themselves
        if (id === currentUserId) {
            throw new ForbiddenException('Cannot delete your own account');
        }

        // Check if this is the last admin
        if (user.role === Role.ADMIN) {
            const adminCount = await this.prisma.user.count({
                where: { role: Role.ADMIN },
            });
            if (adminCount <= 1) {
                throw new ForbiddenException(
                    'Cannot delete the last admin user',
                );
            }
        }

        await this.prisma.user.delete({ where: { id } });

        return { message: 'User deleted successfully' };
    }
}
