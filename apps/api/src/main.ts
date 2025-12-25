import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT') ?? 3001;
  const frontendOrigin =
    configService.get<string>('FRONTEND_ORIGIN') ?? 'http://localhost:3000';

  // Allow both localhost and local network access
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) {
        callback(null, true);
        return;
      }

      // Allow localhost (any port)
      if (origin.match(/^https?:\/\/localhost(:\d+)?$/)) {
        callback(null, true);
        return;
      }

      // Allow any local network IP (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
      if (origin.match(/^https?:\/\/(192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)(:\d+)?$/)) {
        callback(null, true);
        return;
      }

      // Also check against configured frontend origin
      if (origin === frontendOrigin) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Serve static files from uploads directory
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(port, '0.0.0.0');
  console.log(`dYs? API ready on:`);
  console.log(`  - Local:   http://localhost:${port}`);
  console.log(`  - Network: http://192.168.1.17:${port}`);
}
void bootstrap();
