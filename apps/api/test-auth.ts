import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

async function main() {
    // Initialize Prisma client
    const prisma = new PrismaClient();

    try {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email: 'rizky@mail.com' },
        });

        if (existingUser) {
            console.log('✓ User found:');
            console.log('  Email:', existingUser.email);
            console.log('  Name:', existingUser.name);
            console.log('  Role:', existingUser.role);
            console.log('  Password hash preview:', existingUser.password.substring(0, 30) + '...');

            // Test password comparison
            const testPassword = '123456';
            const isValid = await bcrypt.compare(testPassword, existingUser.password);
            console.log(`\n✓ Testing password '${testPassword}':`, isValid ? '✓ VALID' : '✗ INVALID');

            if (!isValid) {
                console.log('\n⚠ Password does not match. The user might have a different password.');
                console.log('  Try using the registration endpoint to create a new account.');
            }
        } else {
            console.log('✗ User not found with email: rizky@mail.com');
            console.log('\nCreating test user...');

            // Create a test user
            const hashedPassword = await bcrypt.hash('123456', 10);
            const newUser = await prisma.user.create({
                data: {
                    email: 'rizky@mail.com',
                    name: 'Rizky Test',
                    role: Role.ADMIN,
                    password: hashedPassword,
                },
            });

            console.log('\n✓ User created successfully!');
            console.log('  Email:', newUser.email);
            console.log('  Name:', newUser.name);
            console.log('  Role:', newUser.role);
            console.log('  Password: 123456');
            console.log('\nYou can now login with:');
            console.log('  Email: rizky@mail.com');
            console.log('  Password: 123456');
        }
    } finally {
        await prisma.$disconnect();
    }
}

main().catch(console.error);
