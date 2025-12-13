# Panduan Backup & Restore Database

Berikut adalah panduan untuk melakukan backup dan restore database PostgreSQL yang berjalan di dalam Docker container project ini.

## Informasi Container
- **Nama Container**: `belajar-postgres`
- **Nama Database**: `belajar`
- **User**: `postgres`

## 1. Backup Database
Untuk mem-backup database saat ini ke dalam file SQL, jalankan perintah berikut di terminal (dari root folder project):

```bash
# Pastikan folder database sudah ada
mkdir -p database

# Jalankan backup
docker exec belajar-postgres pg_dump -U postgres belajar > database/data-awal.sql
```

**Penjelasan:**
- `docker exec belajar-postgres`: Menjalankan perintah di dalam container bernama `belajar-postgres`.
- `pg_dump`: Program utility PostgreSQL untuk mengambil backup.
- `-U postgres`: Connect menggunakan user `postgres`.
- `belajar`: Nama database yang akan di-backup.
- `> database/data-awal.sql`: Mengarahkan output dump ke file `data-awal.sql` di dalam folder `database` komputer host Anda.

---

## 2. Restore Database
Untuk mengembalikan (restore) database dari file backup, ikuti langkah-langkah di bawah ini.

### ⚠️ Peringatan
Proses restore akan memodifikasi data yang ada. Jika Anda ingin mengganti database sepenuhnya dengan versi backup, disarankan untuk mereset database terlebih dahulu (Cara 2).

### Cara 1: Restore Langsung (Insert/Overwrite)
Gunakan cara ini jika Anda hanya ingin menambahkan data dari backup ke database yang sudah ada, atau jika file backup sudah berisi perintah "clean".

```bash
cat database/data-awal.sql | docker exec -i belajar-postgres psql -U postgres -d belajar
```

### Cara 2: Reset Total & Restore (Fresh Start)
Gunakan cara ini jika Anda ingin menghapus semua data saat ini dan menggantinya persis dengan data dari backup.

1. **Drop & Create Database** (Hapus dan buat ulang database kosong):
   ```bash
   # Hapus database lama (Pastikan tidak ada koneksi aktif lain ke DB)
   docker exec belajar-postgres psql -U postgres -c "DROP DATABASE belajar WITH (FORCE);"
   
   # Buat database baru kosong
   docker exec belajar-postgres psql -U postgres -c "CREATE DATABASE belajar;"
   ```

2. **Restore Data**:
   ```bash
   cat database/data-awal.sql | docker exec -i belajar-postgres psql -U postgres -d belajar
   ```

**Penjelasan:**
- `cat ...`: Membaca isi file backup.
- `|`: "Pipe" yang mengirimkan isi file tersebut sebagai input ke perintah selanjutnya.
- `docker exec -i`: Mode interaktif, memungkinkan container menerima input dari luar (dari file backup kita).
- `psql`: Client command line PostgreSQL.
- `-d belajar`: Menentukan target database yang akan diisi.
