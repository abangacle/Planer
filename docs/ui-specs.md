# Spesifikasi UI Planer App

## Tema dan Warna
- **Tema Utama**: Modern dan profesional
- **Palet Warna**:
  - Tema Hijau: `#4CAF50` (primary), `#388E3C` (dark), `#C8E6C9` (light), `#212121` (text)
  - Tema Ungu: `#673AB7` (primary), `#512DA8` (dark), `#D1C4E9` (light), `#212121` (text)
  - Tema Biru: `#2196F3` (primary), `#1976D2` (dark), `#BBDEFB` (light), `#212121` (text)
- **Font**: Poppins/Roboto untuk text, Montserrat untuk heading

## Layout

### Global Layout
- **Header**: Logo, judul aplikasi, search bar, notifikasi, profil pengguna
- **Sidebar**: Navigasi utama dengan icon dan label
- **Content Area**: Area utama dengan konten yang berubah sesuai halaman
- **Footer**: Info versi, copyright, pengaturan

### Responsive Behavior
- **Desktop**: Full layout dengan sidebar tetap terlihat
- **Tablet**: Sidebar collapsed dengan icon saja, expandable
- **Mobile**: Sidebar bisa disembunyikan, navs pada bottom bar

## Komponen UI

### Common Components
1. **Button**
   - Primary: Filled dengan warna primary theme
   - Secondary: Outlined dengan warna primary
   - Text: Hanya text tanpa background
   - Icon: Button dengan icon saja
   - Size: small, medium, large

2. **Input Fields**
   - Text Input: Dengan label floating
   - Text Area: Untuk input deskripsi panjang
   - Select/Dropdown
   - Checkbox & Radio
   - Date & Time picker

3. **Cards**
   - Task Card: Menampilkan judul, due date, priority, status
   - Event Card: Menampilkan waktu, judul, lokasi
   - Project Card: Menampilkan judul, progress, deadline
   - Note Card: Menampilkan judul dan preview

4. **Lists**
   - Task List: Daftar task dengan sort dan filter
   - Event List: Daftar event dengan timeline view
   - Project List: Daftar project dengan status

5. **Modal & Dialog**
   - Dialog konfirmasi
   - Modal form untuk create/edit item
   - Modal detail untuk melihat informasi lengkap

6. **Navigation**
   - Tabs untuk perpindahan dalam satu halaman
   - Breadcrumbs untuk navigasi hirarki
   - Dropdown menu

### Page-specific Components

1. **Dashboard**
   - **Header Widget**: Menampilkan tanggal, hari, dan greeting
   - **Today's Agenda**: Timeline vertikal untuk agenda hari ini
   - **Task Summary**: Card dengan jumlah task berdasarkan status
   - **Project Progress**: Visual chart progress project aktif
   - **Quick Add**: Floating action button untuk cepat menambah task/event

2. **Work Planner**
   - **Calendar View**: 
     - Month view: Calendar grid dengan event dots
     - Week view: Hourly timeline dengan blocks untuk events
     - Day view: Detail agenda per jam
   - **Task Manager**:
     - List view dengan grouping (by project, priority, status)
     - Kanban view (Todo, In Progress, Done)
     - Gantt chart untuk project timeline

3. **Timer & Focus**
   - **Pomodoro Timer**: 
     - Circular progress dengan countdown
     - Start/pause/reset controls
     - Session settings (work time, break time)
   - **Focus Mode**: 
     - Distraction-free interface
     - Current task highlight
     - Session stats (time spent, breaks)

4. **Projects**
   - **Project Dashboard**: Overview dengan stats dan progress
   - **Task Breakdown**: Hierarchical view task dan subtask
   - **Timeline**: Visual timeline project milestones
   - **Team View**: Jika aplikasi mendukung kolaborasi

## Screen Flows

### Onboarding
1. Welcome screen dengan app intro
2. User profile setup (nama, email, foto)
3. Preferensi kerja (jam kerja, hari kerja)
4. Tema pilihan
5. Quick tips untuk memulai

### Task Management
1. List view tasks
2. Add new task form
3. Edit task details
4. Mark task as complete
5. Filter dan sort tasks

### Focus Session
1. Select task untuk fokus
2. Set session duration
3. Active session dengan timer
4. Break reminder
5. Session summary dengan stats

## Microinteractions & Animations
- Subtle transitions antar halaman
- Loading states dengan skeleton screens
- Highlight untuk task yang mendekati deadline
- Celebration animation untuk task yang selesai
- Smooth scrolling dan lazy loading untuk list panjang

## Mockups
(Placeholder: Akan ditambahkan wireframe dan mockup design screens utama)

## Design Guidelines
- Consistency dalam penggunaan margin, padding, dan spacing
- Hirarki visual yang jelas untuk elemen penting
- Contrast yang cukup untuk readable text
- Touch targets minimal 44x44px untuk mobile
- Feedback visual untuk semua interaksi user 