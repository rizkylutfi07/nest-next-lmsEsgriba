import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter: new PrismaPg(pool),
});

async function main() {
    // Fetch all PILIHAN_GANDA questions
    const soalList = await prisma.bankSoal.findMany({
        where: { tipe: 'PILIHAN_GANDA' },
        select: { id: true, kode: true, pilihanJawaban: true, jawabanBenar: true }
    });

    console.log(`Found ${soalList.length} PILIHAN_GANDA questions\n`);

    let corruptedCount = 0;

    // Check for corrupted options
    for (const soal of soalList) {
        const options = soal.pilihanJawaban as any[];
        if (!options || !Array.isArray(options)) continue;

        let hasCorruption = false;
        const corruptedOptions: string[] = [];

        for (const opt of options) {
            if (opt.id && opt.text) {
                // Detect if text looks like it's missing a letter (starts with lowercase when it shouldn't)
                // This assumes that proper answers should start with uppercase
                const firstChar = opt.text.charAt(0);

                // Special case: Check if the text could have had the same letter as the id removed
                // e.g., id="A", original="Abstraksi" but got corrupted to "bstraksi"
                if (opt.text.length > 0 && firstChar === firstChar.toLowerCase() && firstChar.match(/[a-z]/)) {
                    // Could be corrupted - text starts with lowercase letter
                    hasCorruption = true;
                    corruptedOptions.push(`  ${opt.id}: "${opt.text}"`);
                }
            }
        }

        if (hasCorruption) {
            corruptedCount++;
            console.log(`[CORRUPTED] ${soal.kode}:`);
            corruptedOptions.forEach(c => console.log(c));
            console.log('');
        }
    }

    console.log(`\nTotal corrupted: ${corruptedCount} out of ${soalList.length}`);
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
