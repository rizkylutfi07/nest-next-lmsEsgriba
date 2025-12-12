-- Step 1: Create default Tahun Ajaran if none exists with status AKTIF
DO $$
DECLARE
    default_tahun_ajaran_id TEXT;
    active_tahun_ajaran_id TEXT;
BEGIN
    -- Check if there's an active Tahun Ajaran
    SELECT id INTO active_tahun_ajaran_id 
    FROM "TahunAjaran" 
    WHERE status = 'AKTIF' AND "deletedAt" IS NULL 
    LIMIT 1;

    -- If no active year, create a default one
    IF active_tahun_ajaran_id IS NULL THEN
        INSERT INTO "TahunAjaran" (id, tahun, semester, "tanggalMulai", "tanggalSelesai", status, "createdAt", "updatedAt")
        VALUES (
            gen_random_uuid()::text,
            '2024/2025',
            1,
            '2024-07-01'::timestamp,
            '2024-12-31'::timestamp,
            'AKTIF',
            NOW(),
            NOW()
        )
        RETURNING id INTO default_tahun_ajaran_id;
        
        RAISE NOTICE 'Created default Tahun Ajaran: %', default_tahun_ajaran_id;
    ELSE
        default_tahun_ajaran_id := active_tahun_ajaran_id;
        RAISE NOTICE 'Using existing active Tahun Ajaran: %', default_tahun_ajaran_id;
    END IF;

    -- Step 2: Assign all Kelas without tahunAjaranId to the active/default Tahun Ajaran
    UPDATE "Kelas"
    SET "tahunAjaranId" = default_tahun_ajaran_id
    WHERE "tahunAjaranId" IS NULL AND "deletedAt" IS NULL;

    RAISE NOTICE 'Updated % Kelas records with tahunAjaranId', (SELECT COUNT(*) FROM "Kelas" WHERE "tahunAjaranId" = default_tahun_ajaran_id);
END $$;

-- Step 3: Make tahunAjaranId required (NOT NULL)
ALTER TABLE "Kelas" ALTER COLUMN "tahunAjaranId" SET NOT NULL;
