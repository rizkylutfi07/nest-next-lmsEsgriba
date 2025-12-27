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

// Dry run mode - set to false to actually fix the database
const DRY_RUN = true;

async function main() {
    console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no changes will be made)' : 'LIVE (will fix database)'}\n`);

    // Fetch all PILIHAN_GANDA questions
    const soalList = await prisma.bankSoal.findMany({
        where: { tipe: 'PILIHAN_GANDA' },
        select: { id: true, kode: true, pilihanJawaban: true, jawabanBenar: true }
    });

    console.log(`Found ${soalList.length} PILIHAN_GANDA questions\n`);

    let fixedCount = 0;

    for (const soal of soalList) {
        const options = soal.pilihanJawaban as any[];
        if (!options || !Array.isArray(options)) continue;

        let needsFix = false;
        const fixedOptions = options.map(opt => {
            if (!opt.id || !opt.text) return opt;

            const firstChar = opt.text.charAt(0);
            const optionLetter = opt.id.toUpperCase();

            // If text starts with lowercase and the option letter could be the missing first letter
            if (firstChar === firstChar.toLowerCase() && firstChar.match(/[a-z]/)) {
                // Check if prepending the option letter makes sense
                // This is a heuristic - we assume the bug removed the letter that matched the option id
                const potentialFixed = optionLetter + opt.text;

                // Special cases where we're confident about the fix
                const knownFixes: Record<string, string> = {
                    // Indonesian words
                    'bstraksi': 'Abstraksi',
                    'lgoritma': 'Algoritma',
                    'ebugging': 'Debugging',
                    'ksperimen': 'Eksperimen',
                    'rowser': 'Browser',
                    'xcel': 'Excel',
                    'tesis': 'Tesis',
                    'rgumentasi': 'Argumentasi',
                    'koda': 'Koda',
                    'eskripsi': 'Deskripsi',
                    'ksposisi': 'Eksposisi',
                    'uku referensi': 'Buku referensi',
                    'uku mutasi': 'Buku mutasi',
                    'uku nonfiksi': 'Buku nonfiksi',
                    'uku fiksi': 'Buku fiksi',
                    'uku ajar': 'Buku ajar',
                    'ongeng': 'Dongeng',
                    'erpen': 'Cerpen',
                    'ialog antartokoh': 'Dialog antartokoh',
                    'entuk atau ciri fisik': 'Bentuk atau ciri fisik',
                    'lur dan latar': 'Alur dan latar',
                    'lur dan tokoh': 'Alur dan tokoh',
                    'lur dan tema': 'Alur dan tema',
                    'ua arah': 'Dua arah',
                    'mpat arah': 'Empat arah',
                    'nalisis fenomena yang terjadi': 'Analisis fenomena yang terjadi',
                    'esign': 'Design',
                    'orel Draw': 'Corel Draw',
                    'hrome': 'Chrome',
                    'ata': 'Data',
                    'loud Storage': 'Cloud Storage',
                    'ntivirus': 'Antivirus',
                    'trl + A': 'Ctrl + A',
                    'trl + V': 'Ctrl + V',
                    'trl + S': 'Ctrl + S',
                    'trl + P': 'Ctrl + P',
                    'trl + C': 'Ctrl + C',
                    // English words
                    'oing': 'Doing',
                    'one': 'Done',
                    'oes': 'Does',
                    'o': 'Do',
                    'id': 'Did',
                    're': 'Are',
                    'm': 'Am',
                    'm not': 'Am not',
                    'oes not': 'Does not',
                    'o not': 'Do not',
                    'ooking': 'Cooking',
                    'ooked': 'Cooked',
                    'ooks': 'Cooks',
                    'ook': 'Cook',
                    'ooken': 'Cooken',
                    'm sleeping': 'Am sleeping',
                    'm doing': 'Am doing',
                    'm confusing': 'Am confusing',
                    'id not confusing': 'Did not confusing',
                    'go': 'Ego',
                    'e designing': 'Be designing',
                    'esigned': 'Designed',
                    'escriptive text': 'Descriptive text',
                    'escription – identification': 'Description – identification',
                    'dvertisement': 'Advertisement',
                    'avid': 'David',
                    'ditor': 'Editor',
                    'rgument': 'Argument',
                    'laboration': 'Elaboration',
                    'eremonies': 'Ceremonies',
                    'uses': 'Buses',
                    'ali People will never be angry': 'Bali People will never be angry',
                    'll Bali people will live in a prosperous way': 'All Bali people will live in a prosperous way',
                    'ark and very dangerous': 'Dark and very dangerous',
                    'ekerja tanpa menggunakan komputer': 'Bekerja tanpa menggunakan komputer',
                    'mbil nomor antrean': 'Ambil nomor antrean',
                };

                // Check if we have a known fix
                if (knownFixes[opt.text]) {
                    needsFix = true;
                    console.log(`  Fix: "${opt.text}" -> "${knownFixes[opt.text]}"`);
                    return { ...opt, text: knownFixes[opt.text] };
                }

                // For text that starts with lowercase and could be fixed by adding the option letter
                // Only fix if the result would start with uppercase
                if (potentialFixed.charAt(0) === potentialFixed.charAt(0).toUpperCase()) {
                    needsFix = true;
                    console.log(`  Auto-fix: "${opt.text}" -> "${potentialFixed}" (added ${optionLetter})`);
                    return { ...opt, text: potentialFixed };
                }
            }

            return opt;
        });

        if (needsFix) {
            fixedCount++;
            console.log(`[FIXING] ${soal.kode}`);

            if (!DRY_RUN) {
                await prisma.bankSoal.update({
                    where: { id: soal.id },
                    data: { pilihanJawaban: fixedOptions as any }
                });
                console.log(`  ✓ Updated in database\n`);
            } else {
                console.log(`  (dry run - not saved)\n`);
            }
        }
    }

    console.log(`\n${'='.repeat(50)}`);
    console.log(`Total fixed: ${fixedCount}`);
    if (DRY_RUN) {
        console.log(`\nThis was a DRY RUN. To actually fix the database, set DRY_RUN = false`);
    }
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
