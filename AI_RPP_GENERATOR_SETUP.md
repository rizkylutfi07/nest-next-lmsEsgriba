# AI RPP Generator Setup Guide

Panduan lengkap untuk menggunakan fitur AI RPP Generator.

## Prerequisites

1. **OpenAI API Key** - Daftar di https://platform.openai.com/api-keys
2. **Atau alternative:** Google Gemini / Groq (gratis)

---

## Step 1: Setup OpenAI API Key

### Option A: OpenAI (Recommended untuk kualitas terbaik)

1. Daftar/Login ke https://platform.openai.com
2. Buat API key di https://platform.openai.com/api-keys  
3. Copy API key yang dimulai dengan `sk-proj-...`
4. Tambahkan ke file `.env`:

```bash
# Edit file apps/api/.env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxx
```

### Option B: Google Gemini (Gratis)

Jika ingin pakai Gemini (gratis):

1. Install `@ai-sdk/google`:
```bash
cd apps/api && npm install @ai-sdk/google
```

2. Update `apps/api/src/rpp/ai-rpp.service.ts`:
```typescript
import { google } from '@ai-sdk/google'; // ganti dari openai
...
model: google('gemini-pro'), // ganti dari openai('gpt-4-turbo')
```

3. Tambahkan API key ke `.env`:
```bash
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-api-key
```

---

## Step 2: Restart Server

```bash
# Restart turbo dev agar .env terbaca
# Ctrl+C untuk stop, lalu:
npm run dev
```

---

## Step 3: Test AI Generator

1. Login sebagai GURU atau ADMIN
2. Buka `/rpp/create`
3. Isi form step 1:
   - Mata Pelajaran: pilih dari dropdown
   - Materi: contoh "Trigonometri"
   - Fase: contoh "XI"
   - Alokasi Waktu: 90 menit
   - Dimensi Profil Lulusan: pilih minimal 1
4. Klik tombol **"✨ Generate RPP dengan AI"**
5. Tunggu 10-30 detik
6. Otomatis semua field terisi!
7. Review & edit sesuai kebutuhan
8. Save atau Publish

---

## Troubleshooting

### Error: "API key not configured"
```bash
# Pastikan .env sudah ada OPENAI_API_KEY
cat apps/api/.env | grep OPENAI

# Restart server setelah tambah .env
```

### Error: "Rate limit exceeded"
- Cek usage di https://platform.openai.com/usage
- Tambah credit/upgrade plan jika perlu
- Atau switch ke Gemini (gratis)

### Hasil kurang bagus
- Edit prompt di `apps/api/src/rpp/ai-rpp.service.ts`
- Tambahkan contoh/template yang lebih spesifik
- Adjust temperature (sekarang 0.7, bisa turunkan ke 0.5 untuk lebih konsisten)

---

## Cost Estimate

**OpenAI GPT-4 Turbo:**
- Input: ~500-1000 tokens per request
- Output: ~1500-3000 tokens per response
- Cost: ~$0.01-0.03 per RPP generation
- 100 RPP = ~$1-3 USD

**Google Gemini:**
- FREE tier: 15 requests per minute
- Cocok untuk testing dan production kecil

---

## Customization

### 1. Ubah Prompt

Edit file `apps/api/src/rpp/ai-rpp.service.ts`:

```typescript
const prompt = `Anda adalah guru berpengalaman...
// Customize sesuai kebutuhan
`;
```

### 2. Tambah Validation

```typescript
// Validate hasil AI
if (!generated.capaianPembelajaran || !generated.tujuanPembelajaran) {
    throw new Error('AI generated incomplete RPP content');
}
```

### 3. Switch ke Model Lain

```typescript
// GPT-3.5 Turbo (lebih murah, kualitas sedikit turun)
model: openai('gpt-3.5-turbo'),

// GPT-4 (paling bagus, lebih mahal)
model: openai('gpt-4'),
```

---

## Features

✅ Auto-generate semua field RPP
✅ Sesuai format blanko RPP Deep Learning
✅ Prinsip Mindful, Meaningful, Joyful
✅ Kegiatan pembelajaran terstruktur
✅ Asesmen lengkap (awal, proses, akhir)
✅ Editable sebelum save
✅ Error handling lengkap

Enjoy! 🎉
