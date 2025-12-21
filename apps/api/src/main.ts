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
  const allowedOrigins = [
    frontendOrigin,
    'http://localhost:3000',
    'http://192.168.1.8:3000',
    'https://localhost:3000',
    'https://192.168.1.8:3000',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
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
  console.log(`  - Network: http://192.168.1.8:${port}`);
}
void bootstrap();
