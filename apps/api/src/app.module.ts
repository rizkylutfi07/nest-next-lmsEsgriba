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
import { DatabaseModule } from './database/database.module';
import { AttendanceModule } from './attendance/attendance.module';
import { SettingsModule } from './settings/settings.module';
import { BankSoalModule } from './bank-soal/bank-soal.module';
import { PaketSoalModule } from './paket-soal/paket-soal.module';
import { UjianModule } from './ujian/ujian.module';
import { UjianSiswaModule } from './ujian-siswa/ujian-siswa.module';

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
    DatabaseModule,
    AttendanceModule,
    SettingsModule,
    BankSoalModule,
    PaketSoalModule,
    UjianModule,
    UjianSiswaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
