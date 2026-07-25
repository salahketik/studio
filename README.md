# Visual Creative Suite 🎨

Workstation digital profesional yang dirancang untuk mempercepat alur kerja desainer dan konten kreator melalui pengolahan gambar berbasis AI dan alat manipulasi visual yang presisi.

## 🚀 Fitur Unggulan

### 📸 Visual & Gambar
- **Konverter Gambar Cerdas**: Konversi massal ke WebP, JPG, atau PNG dengan optimisasi kompresi berbasis AI (Genkit).
- **Generator Mockup Profesional**: Ciptakan visual produk dengan latar belakang artistik yang dihasilkan oleh AI Imagen 4.
- **Smart Trim (Potong Cerdas)**: Penghapusan area kosong atau margin transparan secara otomatis menggunakan algoritma deteksi piksel yang presisi.

## 🛠️ Teknologi Utama
- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **UI & Styling**: [Tailwind CSS](https://tailwindcss.com/) & [ShadCN UI](https://ui.shadcn.com/)
- **AI Integration**: [Firebase Genkit](https://firebase.google.com/docs/genkit)
- **Model AI**: Google Gemini 2.0 Flash & Imagen 4
- **Image Processing**: Canvas API & Browser-local processing

## 📂 Struktur Proyek
- `src/app`: Routing dan halaman utama aplikasi.
- `src/features`: Modul fitur yang terisolasi (Components, Hooks, Types).
- `src/ai`: Definisi alur Genkit dan prompt AI.
- `src/components`: Komponen UI global dan ShadCN.

## 🏁 Memulai Pengembangan

1. **Instalasi Dependensi**:
   ```bash
   npm install
   ```

2. **Konfigurasi Environment**:
   Pastikan file `.env` berisi `GOOGLE_GENAI_API_KEY` untuk fitur AI.

3. **Jalankan Aplikasi**:
   ```bash
   npm run dev
   ```

4. **Jalankan Genkit Dev UI**:
   ```bash
   npm run genkit:dev
   ```

## 🔐 Privasi & Keamanan
Aplikasi ini memprioritaskan privasi. Sebagian besar pemrosesan gambar (Konversi & Trimming) dilakukan secara **lokal di browser Anda** tanpa mengirimkan file asli ke server, kecuali untuk fitur yang memerlukan bantuan AI Cloud seperti optimisasi kompresi dan pembuatan latar belakang.

---
© 2025 Visual Creative Suite. Built with ❤️ for Creators.