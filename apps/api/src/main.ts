import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT') ?? 3001;
  const origin =
    configService.get<string>('FRONTEND_ORIGIN') ?? 'http://localhost:3000';

  app.enableCors({
    origin,
    credentials: true,
  });

  await app.listen(port);
  const appUrl = await app.getUrl();
  console.log(`🚀 API ready on ${appUrl}`);
}
void bootstrap();
