# Model Data Planer App

## Entitas Utama

### User
```json
{
  "id": "unique-id",
  "name": "Nama Pengguna",
  "email": "email@example.com",
  "preferences": {
    "theme": "green",
    "notifications": true,
    "startOfWeek": 1,
    "workHours": {
      "start": "09:00",
      "end": "17:00"
    },
    "workDays": [1, 2, 3, 4, 5] // 0 = Minggu, 1 = Senin, dst.
  },
  "lastSync": "2023-08-15T12:00:00Z"
}
```

### Task
```json
{
  "id": "task-id",
  "title": "Judul Tugas",
  "description": "Deskripsi detail tugas",
  "dueDate": "2023-08-20T23:59:59Z",
  "status": "pending", // pending, in-progress, completed, canceled
  "priority": 2, // 1 (rendah) - 3 (tinggi)
  "category": "work", // work, project, personal, etc.
  "tags": ["report", "client-x"],
  "reminder": "2023-08-20T18:00:00Z",
  "attachments": [
    {
      "name": "dokumen.pdf",
      "path": "path/to/dokumen.pdf"
    }
  ],
  "subtasks": [
    {
      "id": "subtask-id",
      "title": "Subtask 1",
      "completed": false
    }
  ],
  "project": "project-id", // opsional, referensi ke project
  "assignedBy": "user-id", // opsional, untuk tugas yang diberikan oleh orang lain
  "timeEstimate": 120, // dalam menit
  "timeSpent": 90, // dalam menit
  "createdAt": "2023-08-15T10:00:00Z",
  "updatedAt": "2023-08-15T11:30:00Z"
}
```

### Event
```json
{
  "id": "event-id",
  "title": "Nama Event",
  "description": "Deskripsi event",
  "startTime": "2023-08-21T09:00:00Z",
  "endTime": "2023-08-21T10:30:00Z",
  "location": "Ruang Rapat A",
  "isRecurring": true,
  "recurrencePattern": {
    "frequency": "weekly", // daily, weekly, monthly, yearly
    "interval": 1,
    "daysOfWeek": [1, 3, 5], // 0 = Minggu, 1 = Senin, dst.
    "until": "2023-12-15T00:00:00Z"
  },
  "reminder": "2023-08-21T08:30:00Z",
  "category": "meeting", // meeting, call, deadline, etc.
  "color": "#4CAF50",
  "attendees": [
    {
      "name": "John Doe",
      "email": "john@example.com"
    }
  ],
  "agenda": "Agenda rapat..." // opsional, untuk pertemuan
}
```

### Project
```json
{
  "id": "project-id",
  "name": "Nama Proyek",
  "description": "Deskripsi proyek",
  "startDate": "2023-08-10T00:00:00Z",
  "endDate": "2023-09-10T00:00:00Z",
  "status": "active", // pending, active, completed, on-hold
  "client": "Nama Klien", // opsional
  "tasks": ["task-id-1", "task-id-2"], // referensi ke task yang terkait
  "progress": 45, // persentase penyelesaian (0-100)
  "createdAt": "2023-08-10T09:00:00Z",
  "updatedAt": "2023-08-15T14:20:00Z"
}
```

### Note
```json
{
  "id": "note-id",
  "title": "Judul Catatan",
  "content": "Isi catatan...",
  "tags": ["meeting", "important"],
  "createdAt": "2023-08-16T14:00:00Z",
  "updatedAt": "2023-08-16T14:30:00Z",
  "relatedTasks": ["task-id-1", "task-id-2"],
  "relatedEvents": ["event-id-1"],
  "relatedProjects": ["project-id-1"]
}
```

### FocusSession
```json
{
  "id": "session-id",
  "taskId": "task-id", // opsional, bisa null
  "projectId": "project-id", // opsional, bisa null
  "startTime": "2023-08-18T15:00:00Z",
  "endTime": "2023-08-18T16:00:00Z",
  "duration": 60, // dalam menit
  "breaks": [
    {
      "startTime": "2023-08-18T15:25:00Z",
      "endTime": "2023-08-18T15:30:00Z"
    }
  ],
  "focusScore": 85, // 0-100
  "activity": "coding", // opsional, jenis aktivitas 
  "notes": "Catatan tentang sesi fokus"
}
```

## Relasi Antar Entitas

1. **User** memiliki banyak **Task**
2. **User** memiliki banyak **Event**
3. **User** memiliki banyak **Note**
4. **User** memiliki banyak **FocusSession**
5. **User** memiliki banyak **Project**
6. **Project** memiliki banyak **Task**
7. **Task** dapat memiliki banyak **Subtask**
8. **Task** dapat terkait dengan satu **Project**
9. **Task** dapat terkait dengan satu atau lebih **Note**
10. **Event** dapat terkait dengan satu atau lebih **Note**
11. **FocusSession** dapat terkait dengan satu **Task** dan/atau satu **Project** (opsional)

## Penyimpanan Data

Untuk aplikasi desktop, data akan disimpan secara lokal menggunakan:

1. **Local Storage**: Untuk preferensi dan data kecil
2. **IndexedDB**: Untuk penyimpanan data yang lebih besar dan kompleks
3. **File System**: Untuk backup, export/import, dan attachments 