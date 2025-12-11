import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { Server } from 'http';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let server: Server;

  const prismaMock = {
    user: {
      findMany: jest.fn().mockResolvedValue([]),
    },
  } as unknown as PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer() as unknown as Server;
  });

  it('/health (GET)', async () => {
    const { body } = (await request(server).get('/health').expect(200)) as {
      body: { status: string };
    };
    expect(body.status).toBe('ok');
  });

  it('/users (GET)', () => {
    return request(server).get('/users').expect(200).expect([]);
  });
});
