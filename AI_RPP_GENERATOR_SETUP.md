# AI RPP Generator Setup Guide (Google Gemini - FREE!)

Panduan lengkap untuk menggunakan fitur AI RPP Generator dengan **Google Gemini (100% GRATIS!)**.

---

## Step 1: Dapatkan Google Gemini API Key (GRATIS!)

1. **Buka:** https://aistudio.google.com/app/apikey
2. **Login** dengan akun Google Anda
3. **Klik "Create API Key"**
4. **Copy API key** yang muncul (format: `AIza...`)

**Note:** Benar-benar gratis, no credit card needed! 🎉

---

## Step 2: Setup API Key di Project

Edit file `.env` di folder `apps/api`:

```bash
# apps/api/.env
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Cara edit:**
```bash
# Buka file .env
nano apps/api/.env

# Atau pakai text editor favorit
code apps/api/.env
```

---

## Step 3: Restart Server

```bash
# Ctrl+C untuk stop turbo dev
# Lalu jalankan lagi:
npm run dev
```

Server akan membaca .env yang baru.

---

## Step 4: Test AI Generator! 🚀

1. **Login** sebagai GURU atau ADMIN
2. **Buka** `/rpp/create`
3. **Isi form step 1:**
   - **Mata Pelajaran:** pilih dari dropdown (misal: Matematika)
   - **Materi:** contoh "Trigonometri" atau "Limit Fungsi"
   - **Fase:** contoh "XI" atau "Fase E"
   - **Alokasi Waktu:** 90 menit (atau sesuaikan)
   - **Dimensi Profil Lulusan:** pilih minimal 1 (misal: Bernalar Kritis)

4. **Scroll ke bawah**, klik tombol:
   ```
   ✨ Generate RPP dengan AI
   ```
   
5. **Tunggu 10-20 detik** (Gemini biasanya cepat!)
6. **BOOM!** 🎉 Semua field otomatis terisi!
7. **Review & Edit** sesuai kebutuhan
8. **Save atau Publish**

---

## Features yang Auto-Generate

✅ **Identifikasi Peserta Didik** - Karakteristik siswa, kesiapan belajar  
✅ **Identifikasi Materi** - Jenis pengetahuan, relevansi, tingkat kesulitan  
✅ **Capaian Pembelajaran** - Sesuai Kurikulum Merdeka  
✅ **Tujuan Pembelajaran** - 3-5 tujuan SMART  
✅ **Topik Pembelajaran** - Topik spesifik yang relevan  
✅ **Praktik Pedagogik** - Model/strategi/metode pembelajaran  
✅ **Lingkungan Pembelajaran** - Setting fisik & virtual  
✅ **Pemanfaatan Digital** - Teknologi yang digunakan  
✅ **Kegiatan Awal** - Apersepsi, motivasi  
✅ **Kegiatan Memahami** - Kegiatan untuk pemahaman konsep  
✅ **Kegiatan Mengaplikasi** - Aplikasi ke konteks nyata  
✅ **Kegiatan Merefleksi** - Evaluasi proses belajar  
✅ **Kegiatan Penutup** - Kesimpulan & perencanaan  
✅ **Asesmen Awal, Proses, Akhir** - Lengkap!

---

## Why Gemini? 🌟

| Feature | OpenAI GPT-4 | Google Gemini |
|---------|--------------|---------------|
| **Price** | $0.01-0.03/RPP | **FREE!** |
| **Quality** | Excellent | Excellent |
| **Speed** | 15-30 sec | 10-20 sec |
| **Bahasa Indonesia** | Good | **Very Good** |
| **Limit** | Pay-per-use | 15 RPM* |
| **Setup** | Credit card | **No CC!** |

*15 Requests Per Minute = cukup untuk 900 RPP/jam!

---

## Troubleshooting

### ❌ Error: "API key not configured"
```bash
# Cek apakah .env sudah ada API key
cat apps/api/.env | grep GOOGLE

# Pastikan formatnya benar:
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSy...
# (tanpa spasi, tanpa quotes)

# Restart server setelah edit .env
```

### ❌ Error: "403 Forbidden" atau "API key invalid"
- Cek lagi API key di https://aistudio.google.com/app/apikey
- Pastikan copy-paste dengan benar
- Coba generate API key baru

### ❌ Error: "Rate limit exceeded"
- Gemini free tier: 15 requests per minute
- Tunggu 1 menit, lalu coba lagi
- Atau coba model `gemini-1.5-flash` (lebih cepat, limit lebih tinggi)

### 💡 Hasil kurang memuaskan?
Edit prompt di `apps/api/src/rpp/ai-rpp.service.ts`:
```typescript
const prompt = `Anda adalah guru berpengalaman...
// Customize sesuai kebutuhan
// Tambah contoh konkret
// Spesifikasikan format yang diinginkan
`;
```

---

## Advanced: Switch Model

Edit `apps/api/src/rpp/ai-rpp.service.ts`:

```typescript
// Gemini 1.5 Pro (default, terbaik)
model: google('gemini-1.5-pro'),

// Gemini 1.5 Flash (lebih cepat, limit lebih tinggi)
model: google('gemini-1.5-flash'),

// Gemini 2.0 Flash (terbaru, experimental)
model: google('gemini-2.0-flash-exp'),
```

---

## Cost Comparison (100 RPP)

| Provider | Cost | Setup |
|----------|------|-------|
| OpenAI GPT-4 | $1-3 USD | Credit card |
| Google Gemini | **$0 USD** | **Email only** |

**Pilihan jelas kan? 😊**

---

## Support & Customization

Untuk customize prompt atau adjust behavior:
- File: `apps/api/src/rpp/ai-rpp.service.ts`
- Line: 91-144 (prompt engineering)
- Adjust `temperature` untuk kontrol randomness (0.5-1.0)

Enjoy your FREE AI-powered RPP Generator! 🎉🚀

---

**Created with ❤️ using:**
- Google Gemini API (Free tier)
- Vercel AI SDK
- NestJS + Next.js
- Deep Learning Pedagogy Principles
