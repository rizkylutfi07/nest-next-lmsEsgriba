# Panduan Backup & Restore Database

Berikut adalah panduan untuk melakukan backup dan restore database PostgreSQL yang berjalan di dalam Docker container project ini.

## Informasi Container
- **Nama Container**: `belajar-postgres`
- **Nama Database**: `belajar`
- **User**: `postgres`

## 1. Backup Database

### Opsi A: Backup dengan Data (Recommended)
Backup lengkap dengan schema dan data, **dengan urutan yang benar** untuk foreign key:

```bash
# Pastikan folder database sudah ada
mkdir -p database

# Jalankan backup dengan opsi --disable-triggers
docker exec belajar-postgres pg_dump -U postgres \
  --if-exists \
  --clean \
  --disable-triggers \
  belajar > database/data-backup-$(date +%Y%m%d_%H%M%S).sql
```

### Opsi B: Backup Schema + Data Terpisah
Untuk kontrol lebih detail, pisahkan schema dan data:

```bash
# Backup schema saja
docker exec belajar-postgres pg_dump -U postgres \
  --schema-only \
  --if-exists \
  --clean \
  belajar > database/schema.sql

# Backup data saja  
docker exec belajar-postgres pg_dump -U postgres \
  --data-only \
  --disable-triggers \
  --column-inserts \
  belajar > database/data-only.sql
```

**Penjelasan Opsi:**
- `--if-exists`: Tambahkan IF EXISTS pada DROP commands
- `--clean`: Tambahkan perintah DROP sebelum CREATE
- `--disable-triggers`: Nonaktifkan trigger saat restore (untuk bypass foreign key temporarily)
-` --column-inserts`: Gunakan INSERT dengan nama kolom eksplisit (lebih aman)
- `--data-only`: Hanya data tanpa schema

---

## 2. Restore Database

### ⚠️ Peringatan
Proses restore akan memodifikasi/mengganti data yang ada. **Pastikan Anda sudah backup terlebih dahulu!**

### Cara 1: Restore dengan Prisma Migrate (Recommended) ✅
Cara paling aman karena menggunakan Prisma untuk manage schema:

```bash
# 1. Drop & Create Database baru
docker exec belajar-postgres psql -U postgres -c "DROP DATABASE belajar WITH (FORCE);"
docker exec belajar-postgres psql -U postgres -c "CREATE DATABASE belajar;"

# 2. Jalankan Prisma Migrate untuk create schema
cd apps/api
npm run prisma:migrate

# 3. Import data saja (dari backup yang --data-only)
cd ../..
cat database/data-only.sql | docker exec -i belajar-postgres psql -U postgres -d belajar
```

### Cara 2: Restore Langsung (Full Backup)
Jika backup file Anda sudah pakai `--clean` dan `--disable-triggers`:

```bash
# 1. Drop & Create Database
docker exec belajar-postgres psql -U postgres -c "DROP DATABASE belajar WITH (FORCE);"
docker exec belajar-postgres psql -U postgres -c "CREATE DATABASE belajar;"

# 2. Restore langsung
cat database/data-backup-*.sql | docker exec -i belajar-postgres psql -U postgres -d belajar
```

### Cara 3: Restore Manual dengan Disable Constraint ⚡
Untuk file backup lama yang bermasalah dengan foreign key:

```bash
# 1. Drop & Create Database
docker exec belajar-postgres psql -U postgres -c "DROP DATABASE belajar WITH (FORCE);"
docker exec belajar-postgres psql -U postgres -c "CREATE DATABASE belajar;"

# 2. Run Prisma Migrate
cd apps/api && npm run prisma:migrate && cd ../..

# 3. Disable semua constraint
docker exec belajar-postgres psql -U postgres -d belajar << 'EOF'
SET session_replication_role = replica;
EOF

# 4. Import data
cat database/data-awal.sql | docker exec -i belajar-postgres psql -U postgres -d belajar

# 5. Enable kembali constraint
docker exec belajar-postgres psql -U postgres -d belajar << 'EOF'
SET session_replication_role = DEFAULT;
EOF
```

**Penjelasan:**
- `SET session_replication_role = replica`: Menonaktifkan semua trigger dan foreign key constraint untuk session ini
- `SET session_replication_role = DEFAULT`: Mengaktifkan kembali semua constraint

---

## 3. Quick Commands Cheat Sheet

```bash
# Backup cepat dengan timestamp
docker exec belajar-postgres pg_dump -U postgres --disable-triggers belajar > database/backup-$(date +%Y%m%d_%H%M%S).sql

# Restore cepat (dari fresh database)  
docker exec belajar-postgres psql -U postgres -c "DROP DATABASE belajar WITH (FORCE);" && \
docker exec belajar-postgres psql -U postgres -c "CREATE DATABASE belajar;" && \
cd apps/api && npm run prisma:migrate && cd ../.. && \
cat database/data-awal.sql | docker exec -i belajar-postgres psql -U postgres -d belajar

# Cek jumlah data setelah restore
docker exec belajar-postgres psql -U postgres -d belajar -c "SELECT COUNT(*) FROM \"User\"; SELECT COUNT(*) FROM \"Guru\"; SELECT COUNT(*) FROM \"Siswa\";"
```
