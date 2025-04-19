# Arsitektur Planer App

## Stack Teknologi
- Frontend: React.js
- Desktop Wrapper: Electron.js
- State Management: Context API + useReducer
- Styling: Styled Components
- Date Management: date-fns
- Build & Packaging: electron-builder

## Struktur Direktori
```
planer/
├── public/
│   ├── electron.js           # Entry point untuk aplikasi Electron
│   ├── index.html
│   └── assets/               # Gambar statis, icon, dll
├── src/
│   ├── components/           # Komponen React yang reusable
│   │   ├── common/           # Komponen umum (Button, Input, dll)
│   │   ├── dashboard/        # Komponen khusus dashboard
│   │   ├── planner/          # Komponen khusus planner
│   │   └── timer/            # Komponen timer dan pengingat
│   ├── contexts/             # Context API untuk state management
│   ├── hooks/                # Custom hooks
│   ├── pages/                # Halaman utama
│   ├── services/             # Layanan (localStorage, notification, dll)
│   ├── styles/               # Global styles, themes, utils
│   ├── utils/                # Utility functions
│   ├── App.js                # Komponen utama
│   └── index.js              # Entry point React
├── assets/                   # Resource untuk build Electron
└── docs/                     # Dokumentasi
```

## Alur Data
1. Data pengguna disimpan di localStorage untuk persistensi
2. Context API digunakan untuk state management global
3. Hooks digunakan untuk logic yang reusable
4. Services menangani operasi non-UI

## Fitur Utama
1. **Dashboard Profesional**
   - Ringkasan jadwal harian/mingguan
   - Status tugas dan deadline
   - Widget progres dan produktivitas

2. **Work Planner**
   - Kalender interaktif untuk jadwal kerja
   - Daftar tugas dengan kategori dan prioritas
   - Manajemen meeting dan jadwal penting

3. **Timer dan Fokus**
   - Pomodoro timer untuk meningkatkan produktivitas
   - Pengingat tugas/deadline
   - Tracker fokus dan deep work

4. **Tema Visual**
   - Multiple tema (default: hijau, ungu, dll)
   - Customizable UI untuk lingkungan kerja

5. **Sinkronisasi & Backup**
   - Export/import data
   - Backup otomatis lokal 