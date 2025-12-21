import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createAdminUser() {
    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: 'rizky@mail.com' },
        });

        if (existingUser) {
            console.log('⚠️  User already exists with email: rizky@mail.com');
            console.log('User ID:', existingUser.id);
            console.log('Role:', existingUser.role);
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash('password', 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email: 'rizky@mail.com',
                name: 'Rizky Admin',
                role: 'ADMIN',
                password: hashedPassword,
            },
        });

        console.log('✅ Admin user created successfully!');
        console.log('');
        console.log('Login credentials:');
        console.log('  Email: rizky@mail.com');
        console.log('  Password: password');
        console.log('  Role: ADMIN');
        console.log('');
        console.log('User ID:', user.id);
    } catch (error: any) {
        console.error('❌ Error creating admin user:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

createAdminUser();
