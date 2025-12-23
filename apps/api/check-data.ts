import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('=== Checking Tugas Attachments ===');

    // Get all tugas with attachments
    const tugasWithAttachments = await prisma.tugas.findMany({
        include: {
            attachments: true,
            guru: { select: { nama: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
    });

    tugasWithAttachments.forEach(tugas => {
        console.log(`\nTugas: ${tugas.judul}`);
        console.log(`  Guru: ${tugas.guru?.nama}`);
        console.log(`  Attachments: ${tugas.attachments.length}`);
        tugas.attachments.forEach((att, i) => {
            console.log(`    ${i + 1}. ${att.namaFile} (${att.urlFile})`);
        });
    });

    console.log('\n=== Checking Notifikasi for Students ===');

    // Get some students
    const students = await prisma.siswa.findMany({
        take: 3,
        select: { id: true, nama: true },
    });

    for (const student of students) {
        const notifications = await prisma.notifikasi.findMany({
            where: { userId: student.id },
            orderBy: { createdAt: 'desc' },
            take: 5,
        });

        console.log(`\nStudent: ${student.nama} (${student.id})`);
        console.log(`  Notifications: ${notifications.length}`);
        notifications.forEach((notif, i) => {
            console.log(`    ${i + 1}. ${notif.judul} - ${notif.isRead ? 'Read' : 'Unread'}`);
        });
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
