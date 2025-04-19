# Planer App

Planer adalah aplikasi desktop yang dirancang untuk meningkatkan produktivitas dan manajemen tugas bagi para profesional. Aplikasi ini menyediakan fitur-fitur untuk mengelola tugas, jadwal, proyek, dan sesi fokus dalam satu tempat yang intuitif.

## Fitur Utama

- **Dashboard Profesional** - Ringkasan jadwal dan tugas dengan tampilan visual yang menarik
- **Work Planner** - Manajemen tugas dan jadwal dengan tampilan kalender interaktif
- **Timer dan Fokus** - Pomodoro timer dan tracking untuk sesi fokus dan deep work
- **Manajemen Proyek** - Organisasi tugas berdasarkan proyek dan pelacakan progres
- **Multi-tema** - Pilihan tema visual yang dapat disesuaikan

## Teknologi

- **Frontend**: React.js
- **Desktop Wrapper**: Electron.js
- **State Management**: Context API + useReducer
- **Styling**: Styled Components
- **Date Management**: date-fns
- **Build & Packaging**: electron-builder

## Instalasi dan Penggunaan

### Prasyarat

- Node.js v14.x atau lebih tinggi
- npm v6.x atau lebih tinggi

### Instalasi Dependensi

```bash
npm install
```

### Menjalankan dalam Mode Development

```bash
npm run electron-dev
```

### Build untuk Produksi

```bash
npm run electron-pack
```

Ini akan menghasilkan installer aplikasi untuk sistem operasi Anda di folder `/dist`.

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