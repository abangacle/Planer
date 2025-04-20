# Planer - Aplikasi Manajemen Tugas

[![GitHub issues](https://img.shields.io/github/issues/abangacle/Planer)](https://github.com/abangacle/Planer/issues)
[![GitHub stars](https://img.shields.io/github/stars/abangacle/Planer)](https://github.com/abangacle/Planer/stargazers)
[![GitHub license](https://img.shields.io/github/license/abangacle/Planer)](https://github.com/abangacle/Planer/blob/master/LICENSE)

Planer adalah aplikasi manajemen tugas yang dikembangkan menggunakan React.js dengan fitur-fitur komprehensif untuk membantu pengguna mengelola tugas dan meningkatkan produktivitas.

## Fitur Utama

### Manajemen Tugas
- **Tampilan Multi-view**: Lihat tugas dalam format daftar, grid, atau tabel
- **Pengelompokan Prioritas**: Tandai tugas dengan prioritas tinggi, sedang, atau rendah
- **Subtasks**: Buat checklist subtask di dalam tugas utama
- **Timer Terintegasi**: Lacak waktu yang dihabiskan untuk menyelesaikan tugas
- **Drag-and-Drop**: Susun ulang tugas dengan mudah menggunakan fitur tarik dan lepas
- **Filter dan Pencarian**: Temukan tugas berdasarkan status, prioritas, atau kata kunci
- **Statistik dan Progres**: Pantau kemajuan penyelesaian tugas dengan visualisasi

### Analitik
- **Grafik Aktivitas Mingguan**: Visualisasi tugas yang dibuat dan diselesaikan per hari
- **Metrik Produktivitas**: Pengukuran kinerja seperti rasio penyelesaian dan waktu rata-rata
- **Analisis Prioritas**: Pantau tugas prioritas tinggi yang tertunda
- **Tren Mingguan**: Lihat pola penyelesaian tugas selama seminggu

### Penyimpanan
- **Penyimpanan Lokal**: Data tersimpan di perangkat pengguna menggunakan localStorage
- **Rencana IndexedDB**: Peningkatan mendatang untuk dukungan offline dan performa lebih baik

## Pembaruan Terbaru (Juni 2024)

### 1. Dashboard Analitik
- Menambahkan komponen TaskAnalytics dengan grafik mingguan
- Mengimplementasikan metrik produktivitas terperinci
- Antarmuka interaktif dengan hover tooltips untuk detail tambahan
- Terjemahan lengkap ke Bahasa Indonesia

### 2. Peningkatan Kinerja dan UI
- Mengoptimalkan rendering dengan useMemo untuk filter tugas
- Meningkatkan UI pemilihan prioritas dengan antarmuka visual yang lebih intuitif

### 3. Fitur Baru
- Menambahkan tampilan daftar tugas dengan kemampuan drag-and-drop
- Mengimplementasikan timer tugas untuk melacak waktu pengerjaan
- Menambahkan rencana migrasi ke IndexedDB untuk penyimpanan data yang lebih baik

### 4. Peningkatan Struktur Kode
- Refaktor pengelolaan state dengan pola konteks dan reducer
- Pemisahan komponen untuk meningkatkan maintainability

## Cara Menjalankan Proyek

1. Kloning repositori
```
git clone https://github.com/ihyaabrar/Planer.git
```

2. Instal dependensi
```
cd Planer
npm install
```

3. Jalankan aplikasi
```
npm start
```

## Teknologi Yang Digunakan

- React.js
- Styled Components
- date-fns dengan lokalisasi Bahasa Indonesia
- Context API
- localStorage

## Rencana Pengembangan Mendatang

- Migrasi ke IndexedDB untuk penyimpanan lokal yang lebih baik
- Sinkronisasi data dengan backend cloud
- Mode offline
- Tema gelap/terang
- Integrasi dengan layanan kalender

## Struktur Proyek

```
planer/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable components
│   ├── contexts/       # React contexts
│   ├── hooks/          # Custom hooks
│   ├── pages/          # Main pages
│   ├── services/       # Services for data handling
│   ├── styles/         # Global styles
│   ├── utils/          # Utility functions
│   ├── App.js          # Main component
│   └── index.js        # Entry point
└── docs/               # Documentation
```

## Fase Pengembangan

Proyek ini dikembangkan dalam beberapa fase:

1. **MVP** - Fitur-fitur dasar untuk manajemen tugas dan kalender
2. **Core Enhancement** - Peningkatan fitur inti dan UI
3. **Advanced Features** - Penambahan fitur lanjutan
4. **Polish & Enterprise** - Penyempurnaan dan fitur enterprise
5. **Future Enhancements** - Fitur-fitur masa depan

Untuk detail lebih lanjut, silakan lihat file [roadmap.md](docs/roadmap.md).

## Kontribusi

Kontribusi untuk proyek ini sangat diapresiasi. Silakan fork repositori ini dan buat Pull Request untuk perubahan yang diusulkan.

## Lisensi

[MIT License](LICENSE) 