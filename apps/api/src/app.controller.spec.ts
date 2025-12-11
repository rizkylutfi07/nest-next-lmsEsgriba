import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

describe('AppController', () => {
  let appController: AppController;

  const prismaMock = {
    user: {
      findMany: jest.fn().mockResolvedValue([
        {
          id: 'user-1',
          email: 'first@example.com',
          name: 'First User',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),
    },
  } as unknown as PrismaService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health', () => {
    it('should report status ok', () => {
      expect(appController.getHealth()).toMatchObject({ status: 'ok' });
    });
  });

  describe('users', () => {
    it('should list users', async () => {
      const users = await appController.getUsers();
      expect(users).toHaveLength(1);
    });
  });
});
