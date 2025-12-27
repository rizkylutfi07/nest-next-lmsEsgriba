import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type JwtPayload = {
  sub: string;
  email: string;
  role: Role;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') ?? 'change-me',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        siswa: {
          select: {
            id: true,
            kelasId: true,
            nama: true,
            nisn: true,
            kelas: {
              select: {
                id: true,
                nama: true,
              }
            }
          }
        },
        guru: {
          select: {
            id: true,
            nama: true,
            mataPelajaran: {
              select: {
                id: true,
              }
            }
          }
        },
      },
    });

    // Extract mataPelajaranIds for guru
    const mataPelajaranIds = user?.guru?.mataPelajaran?.map(mp => mp.id) ?? [];

    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      siswa: user?.siswa ?? null,
      guru: user?.guru ?? null,
      // Keep legacy fields for backward compatibility
      siswaId: user?.siswa?.id ?? null,
      guruId: user?.guru?.id ?? null,
      // Add mataPelajaranIds for filtering bank soal
      mataPelajaranIds: mataPelajaranIds,
    };
  }
}

