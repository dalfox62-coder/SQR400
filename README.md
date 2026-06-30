# SQR400 - v5.8 (Premium Plan)

SQR400 adalah aplikasi web berbasis Next.js yang dirancang untuk memproses, memvisualisasikan, dan memformat data transaksi keuangan serta pesan standar SWIFT MT103 untuk berbagai bank nasional maupun internasional secara terstruktur.

Aplikasi ini dilengkapi dengan antarmuka pengguna yang bersih, responsif, dan didesain secara premium menggunakan Tailwind CSS.

## 🚀 Fitur Utama

- **Bank Selector**: Memilih bank pengirim/penerima secara dinamis dengan konfigurasi Swift Code dan alamat yang sudah terpasang.
- **Formulir Transaksi Khusus**: Formulir input data transaksi yang disesuaikan dengan parameter masing-masing bank (HSBC, BNI, Deutsche Bank, Mandiri, BCA, CitiBank, DBS, dan Standard Chartered).
- **Visualisasi Hasil Transaksi**: Tampilan ringkasan transaksi dengan visualisasi yang menarik dan profesional.
- **Format SWIFT MT103**: Kerangka kerja terintegrasi untuk menangani standardisasi data SWIFT MT103.

## 🛠️ Teknologi yang Digunakan

- **Framework**: [Next.js v14.2.5](https://nextjs.org/) (React v18)
- **Styling**: [Tailwind CSS v3.4.6](https://tailwindcss.com/) & PostCSS
- **Bahasa**: JavaScript / TypeScript

## 📂 Struktur Proyek

```text
sqr400-app/
├── app/
│   ├── banks/            # Komponen formulir transaksi spesifik per bank (BCA, BNI, Citi, Deutsche, HSBC, Mandiri)
│   ├── components/       # Komponen UI global (BankSelector, TransactionResult, dll.)
│   ├── utils/            # Fungsi utilitas (formatMT103.js, konfigurasi bankConfig.js)
│   ├── globals.css       # Styling global Tailwind
│   ├── layout.js         # Layout utama aplikasi
│   └── page.js           # Halaman utama aplikasi (dashboard utama)
├── public/               # Aset statis seperti logo bank
└── package.json          # Dependensi dan skrip proyek
```

## ⚙️ Persiapan & Menjalankan Aplikasi

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi secara lokal:

1. **Instalasi Dependensi**
   Pastikan Anda telah menginstal Node.js di sistem Anda, kemudian jalankan:
   ```bash
   npm install
   ```

2. **Menjalankan Server Pengembangan**
   Jalankan server pengembangan lokal:
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) pada browser Anda untuk melihat hasilnya.

3. **Membangun untuk Produksi**
   Untuk membuat bundel produksi yang dioptimalkan:
   ```bash
   npm run build
   ```

4. **Menjalankan Server Produksi**
   Setelah proses build selesai, jalankan:
   ```bash
   npm run start
   ```
