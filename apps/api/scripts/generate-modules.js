#!/usr/bin/env node

/**
 * Script to generate NestJS CRUD modules for LMS entities
 * Usage: node generate-modules.js
 */

const fs = require('fs');
const path = require('path');

const entities = [
  {
    name: 'MataPelajaran',
    route: 'mata-pelajaran',
    fields: [
      { name: 'kode', type: 'string', required: true, unique: true },
      { name: 'nama', type: 'string', required: true },
      { name: 'jamPelajaran', type: 'number', required: true },
      { name: 'deskripsi', type: 'string', required: false },
      { name: 'tingkat', type: 'string', required: true },
    ],
  },
  {
    name: 'Guru',
    route: 'guru',
    fields: [
      { name: 'nip', type: 'string', required: true, unique: true },
      { name: 'nama', type: 'string', required: true },
      { name: 'email', type: 'string', required: true, unique: true },
      { name: 'nomorTelepon', type: 'string', required: false },
      { name: 'status', type: 'enum', enum: 'StatusGuru', required: true },
      { name: 'mataPelajaranId', type: 'string', required: false },
    ],
  },
  {
    name: 'Kelas',
    route: 'kelas',
    fields: [
      { name: 'nama', type: 'string', required: true },
      { name: 'tingkat', type: 'string', required: true },
      { name: 'jurusan', type: 'string', required: true },
      { name: 'kapasitas', type: 'number', required: true },
      { name: 'tahunAjaranId', type: 'string', required: true },
      { name: 'waliKelasId', type: 'string', required: false },
    ],
  },
  {
    name: 'Siswa',
    route: 'siswa',
    fields: [
      { name: 'nisn', type: 'string', required: true, unique: true },
      { name: 'nama', type: 'string', required: true },
      { name: 'tanggalLahir', type: 'date', required: true },
      { name: 'alamat', type: 'string', required: false },
      { name: 'nomorTelepon', type: 'string', required: false },
      { name: 'email', type: 'string', required: false },
      { name: 'status', type: 'enum', enum: 'StatusSiswa', required: true },
      { name: 'kelasId', type: 'string', required: false },
    ],
  },
];

const baseDir = path.join(__dirname, '../src');

function generateCreateDto(entity) {
  const imports = ['IsNotEmpty', 'IsOptional', 'IsString', 'IsInt', 'IsEnum', 'IsDateString'];
  const enumImports = entity.fields
    .filter(f => f.type === 'enum')
    .map(f => f.enum);

  let content = `import { ${imports.join(', ')} } from 'class-validator';\n`;
  if (enumImports.length > 0) {
    content += `import { ${enumImports.join(', ')} } from '@prisma/client';\n`;
  }
  content += `\nexport class Create${entity.name}Dto {\n`;

  entity.fields.forEach(field => {
    const decorator = field.required ? '@IsNotEmpty()' : '@IsOptional()';
    let typeDecorator = '';

    if (field.type === 'string') typeDecorator = '@IsString()';
    else if (field.type === 'number') typeDecorator = '@IsInt()';
    else if (field.type === 'date') typeDecorator = '@IsDateString()';
    else if (field.type === 'enum') typeDecorator = `@IsEnum(${field.enum})`;

    content += `  ${typeDecorator}\n`;
    if (!field.required) content += `  ${decorator}\n`;
    else content += `  @IsNotEmpty()\n`;

    const tsType = field.type === 'enum' ? field.enum :
      field.type === 'number' ? 'number' :
        field.type === 'date' ? 'string' : 'string';
    content += `  ${field.name}${field.required ? '' : '?'}: ${tsType};\n\n`;
  });

  content += '}\n';
  return content;
}

function generateUpdateDto(entity) {
  return `import { PartialType } from '@nestjs/mapped-types';
import { Create${entity.name}Dto } from './create-${entity.route}.dto';

export class Update${entity.name}Dto extends PartialType(Create${entity.name}Dto) {}
`;
}

function generateQueryDto(entity) {
  return `import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class Query${entity.name}Dto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;

  @IsString()
  @IsOptional()
  search?: string;
}
`;
}

function generateService(entity) {
  const modelName = entity.name.charAt(0).toLowerCase() + entity.name.slice(1);

  return `import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Create${entity.name}Dto } from './dto/create-${entity.route}.dto';
import { Update${entity.name}Dto } from './dto/update-${entity.route}.dto';
import { Query${entity.name}Dto } from './dto/query-${entity.route}.dto';

@Injectable()
export class ${entity.name}Service {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: Query${entity.name}Dto) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };

    if (search) {
      where.OR = [
        { nama: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.${modelName}.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.${modelName}.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const item = await this.prisma.${modelName}.findFirst({
      where: { id, deletedAt: null },
    });

    if (!item) {
      throw new NotFoundException(\`${entity.name} dengan ID \${id} tidak ditemukan\`);
    }

    return item;
  }

  async create(dto: Create${entity.name}Dto) {
    return this.prisma.${modelName}.create({
      data: dto as any,
    });
  }

  async update(id: string, dto: Update${entity.name}Dto) {
    await this.findOne(id);
    return this.prisma.${modelName}.update({
      where: { id },
      data: dto as any,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.${modelName}.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { message: '${entity.name} berhasil dihapus' };
  }
}
`;
}

function generateController(entity) {
  return `import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ${entity.name}Service } from './${entity.route}.service';
import { Create${entity.name}Dto } from './dto/create-${entity.route}.dto';
import { Update${entity.name}Dto } from './dto/update-${entity.route}.dto';
import { Query${entity.name}Dto } from './dto/query-${entity.route}.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('${entity.route}')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class ${entity.name}Controller {
  constructor(private readonly ${entity.route.replace(/-/g, '')}Service: ${entity.name}Service) {}

  @Get()
  findAll(@Query() query: Query${entity.name}Dto) {
    return this.${entity.route.replace(/-/g, '')}Service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.${entity.route.replace(/-/g, '')}Service.findOne(id);
  }

  @Post()
  create(@Body() createDto: Create${entity.name}Dto) {
    return this.${entity.route.replace(/-/g, '')}Service.create(createDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: Update${entity.name}Dto) {
    return this.${entity.route.replace(/-/g, '')}Service.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.${entity.route.replace(/-/g, '')}Service.remove(id);
  }
}
`;
}

function generateModule(entity) {
  return `import { Module } from '@nestjs/common';
import { ${entity.name}Controller } from './${entity.route}.controller';
import { ${entity.name}Service } from './${entity.route}.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [${entity.name}Controller],
  providers: [${entity.name}Service],
  exports: [${entity.name}Service],
})
export class ${entity.name}Module {}
`;
}

// Generate files for each entity
entities.forEach(entity => {
  const entityDir = path.join(baseDir, entity.route);
  const dtoDir = path.join(entityDir, 'dto');

  // Create directories
  if (!fs.existsSync(entityDir)) fs.mkdirSync(entityDir, { recursive: true });
  if (!fs.existsSync(dtoDir)) fs.mkdirSync(dtoDir, { recursive: true });

  // Generate DTOs
  fs.writeFileSync(
    path.join(dtoDir, `create-${entity.route}.dto.ts`),
    generateCreateDto(entity)
  );
  fs.writeFileSync(
    path.join(dtoDir, `update-${entity.route}.dto.ts`),
    generateUpdateDto(entity)
  );
  fs.writeFileSync(
    path.join(dtoDir, `query-${entity.route}.dto.ts`),
    generateQueryDto(entity)
  );

  // Generate Service, Controller, Module
  fs.writeFileSync(
    path.join(entityDir, `${entity.route}.service.ts`),
    generateService(entity)
  );
  fs.writeFileSync(
    path.join(entityDir, `${entity.route}.controller.ts`),
    generateController(entity)
  );
  fs.writeFileSync(
    path.join(entityDir, `${entity.route}.module.ts`),
    generateModule(entity)
  );

  console.log(`✓ Generated ${entity.name} module`);
});

console.log('\n✅ All modules generated successfully!');
console.log('\nNext steps:');
console.log('1. Add modules to app.module.ts imports');
console.log('2. Test the endpoints');
