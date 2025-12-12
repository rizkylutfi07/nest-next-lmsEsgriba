import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TahunAjaranModule } from './tahun-ajaran/tahun-ajaran.module';
import { MataPelajaranModule } from './mata-pelajaran/mata-pelajaran.module';
import { GuruModule } from './guru/guru.module';
import { KelasModule } from './kelas/kelas.module';
import { SiswaModule } from './siswa/siswa.module';
import { JurusanModule } from './jurusan/jurusan.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    TahunAjaranModule,
    MataPelajaranModule,
    GuruModule,
    KelasModule,
    SiswaModule,
    JurusanModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
