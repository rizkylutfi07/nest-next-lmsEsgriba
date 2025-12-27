import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LoginNisnDto } from './dto/login-nisn.dto';
import { Role, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

type TokenResponse = {
  accessToken: string;
  user: Pick<User, 'id' | 'email' | 'name' | 'role' | 'createdAt'> & {
    guru?: { id: string; nama: string } | null;
    siswa?: { id: string; nama: string; nisn?: string | null; kelasId: string | null; kelas?: { id: string; nama: string } | null } | null;
  };
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) { }

  async register(dto: RegisterDto): Promise<TokenResponse> {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (exists) {
      throw new BadRequestException('Email sudah terdaftar');
    }

    const hashed = await this.hashPassword(dto.password);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        name: dto.name,
        role: dto.role ?? Role.SISWA,
        password: hashed,
      },
    });

    // New users don't have guru/siswa relations yet
    return this.buildToken({ ...user, guru: null, siswa: null });
  }

  async login(dto: LoginDto): Promise<TokenResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: {
        guru: {
          select: {
            id: true,
            nama: true,
          },
        },
        siswa: {
          select: {
            id: true,
            nama: true,
            nisn: true,
            kelasId: true,
            kelas: {
              select: {
                id: true,
                nama: true,
              }
            }
          },
        },
      },
    });
    if (!user) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Email atau password salah');
    }

    return this.buildToken(user);
  }

  async loginWithNisn(dto: LoginNisnDto): Promise<TokenResponse> {
    const siswa = await this.prisma.siswa.findUnique({
      where: { nisn: dto.nisn },
      include: {
        user: true,
      },
    });

    if (!siswa || !siswa.user) {
      throw new UnauthorizedException('NISN atau password salah');
    }

    const valid = await bcrypt.compare(dto.password, siswa.user.password);
    if (!valid) {
      throw new UnauthorizedException('NISN atau password salah');
    }

    // Build token with full user data including siswa relation
    const userWithRelations = await this.prisma.user.findUnique({
      where: { id: siswa.user.id },
      include: {
        guru: {
          select: {
            id: true,
            nama: true,
          },
        },
        siswa: {
          select: {
            id: true,
            nama: true,
            nisn: true,
            kelasId: true,
            kelas: {
              select: {
                id: true,
                nama: true,
              }
            }
          },
        },
      },
    });

    if (!userWithRelations) {
      throw new UnauthorizedException('NISN atau password salah');
    }

    return this.buildToken(userWithRelations);
  }

  async hashPassword(password: string) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  private async buildToken(user: User & { guru?: { id: string; nama: string } | null; siswa?: { id: string; nama: string; nisn?: string | null; kelasId: string | null; kelas?: { id: string; nama: string } | null } | null }): Promise<TokenResponse> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    const { password, ...rest } = user;
    return { accessToken, user: rest };
  }

  async updateProfile(userId: string, updateData: { name: string; email: string }) {
    // Check if email is already used by another user
    if (updateData.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateData.email.toLowerCase() },
      });
      if (existingUser && existingUser.id !== userId) {
        throw new BadRequestException('Email sudah digunakan oleh user lain');
      }
    }

    // Get current user to check role
    const currentUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    // Update user
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: updateData.name,
        email: updateData.email?.toLowerCase(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    // Update related Siswa or Guru record if exists
    if (currentUser?.role === 'SISWA') {
      await this.prisma.siswa.updateMany({
        where: { userId: userId },
        data: {
          nama: updateData.name,
          email: updateData.email?.toLowerCase(),
        },
      });
    } else if (currentUser?.role === 'GURU') {
      await this.prisma.guru.updateMany({
        where: { userId: userId },
        data: {
          nama: updateData.name,
          email: updateData.email?.toLowerCase(),
        },
      });
    }

    return updatedUser;
  }

  async changePassword(
    userId: string,
    passwordData: { oldPassword: string; newPassword: string },
  ) {
    // Get current user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User tidak ditemukan');
    }

    // Verify old password
    const validOldPassword = await bcrypt.compare(
      passwordData.oldPassword,
      user.password,
    );
    if (!validOldPassword) {
      throw new UnauthorizedException('Password lama salah');
    }

    // Hash and update new password
    const hashedNewPassword = await this.hashPassword(passwordData.newPassword);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return { message: 'Password berhasil diubah' };
  }

  async adminResetPassword(userId: string, newPassword: string) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User tidak ditemukan');
    }

    // Hash and update new password (no old password verification needed for admin reset)
    const hashedNewPassword = await this.hashPassword(newPassword);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return { message: `Password untuk ${user.name || user.email} berhasil direset` };
  }
}
