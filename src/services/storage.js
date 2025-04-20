/**
 * Service untuk mengelola penyimpanan data
 * 
 * TODO: IndexedDB Implementation Plan
 * 1. Create database and object stores for tasks, events, notes, etc.
 * 2. Implement CRUD operations using IndexedDB API
 * 3. Add migration logic from localStorage to IndexedDB
 * 4. Implement transaction handling for data integrity
 * 5. Add error handling and fallback mechanisms
 * 6. Add data synchronization with potential future backend
 * 
 * Pada fase awal, menggunakan localStorage
 * Pada fase selanjutnya akan ditingkatkan ke IndexedDB
 */

// Namespace untuk menyimpan data aplikasi
const STORAGE_KEY = 'planer_app';

// Mendapatkan semua data
const getAllData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {
      tasks: [],
      events: [],
      notes: [],
      focusSessions: [],
      projects: [],
      user: null
    };
  } catch (error) {
    console.error('Error getting data from storage:', error);
    return {
      tasks: [],
      events: [],
      notes: [],
      focusSessions: [],
      projects: [],
      user: null
    };
  }
};

// Menyimpan semua data
const saveAllData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving data to storage:', error);
    return false;
  }
};

// ===== Tasks =====
// Mendapatkan semua task
const getTasks = () => {
  const data = getAllData();
  return data.tasks || [];
};

// Mendapatkan task berdasarkan ID
const getTaskById = (taskId) => {
  const tasks = getTasks();
  return tasks.find(task => task.id === taskId);
};

// Menyimpan task baru
const saveTask = (task) => {
  const data = getAllData();
  const existingTaskIndex = data.tasks.findIndex(t => t.id === task.id);
  
  if (existingTaskIndex >= 0) {
    // Update task yang sudah ada
    data.tasks[existingTaskIndex] = {
      ...data.tasks[existingTaskIndex],
      ...task,
      updatedAt: new Date().toISOString()
    };
  } else {
    // Tambahkan task baru
    data.tasks.push({
      ...task,
      id: task.id || `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  
  return saveAllData(data);
};

// Menghapus task
const deleteTask = (taskId) => {
  const data = getAllData();
  data.tasks = data.tasks.filter(task => task.id !== taskId);
  return saveAllData(data);
};

// ===== Events =====
// Mendapatkan semua event
const getEvents = () => {
  const data = getAllData();
  return data.events || [];
};

// Mendapatkan event berdasarkan ID
const getEventById = (eventId) => {
  const events = getEvents();
  return events.find(event => event.id === eventId);
};

// Menyimpan event baru
const saveEvent = (event) => {
  const data = getAllData();
  const existingEventIndex = data.events.findIndex(e => e.id === event.id);
  
  if (existingEventIndex >= 0) {
    // Update event yang sudah ada
    data.events[existingEventIndex] = {
      ...data.events[existingEventIndex],
      ...event,
      updatedAt: new Date().toISOString()
    };
  } else {
    // Tambahkan event baru
    data.events.push({
      ...event,
      id: event.id || `event-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  
  return saveAllData(data);
};

// Menghapus event
const deleteEvent = (eventId) => {
  const data = getAllData();
  data.events = data.events.filter(event => event.id !== eventId);
  return saveAllData(data);
};

// ===== Projects =====
// Mendapatkan semua project
const getProjects = () => {
  const data = getAllData();
  return data.projects || [];
};

// Mendapatkan project berdasarkan ID
const getProjectById = (projectId) => {
  const projects = getProjects();
  return projects.find(project => project.id === projectId);
};

// Menyimpan project baru
const saveProject = (project) => {
  const data = getAllData();
  const existingProjectIndex = data.projects.findIndex(p => p.id === project.id);
  
  if (existingProjectIndex >= 0) {
    // Update project yang sudah ada
    data.projects[existingProjectIndex] = {
      ...data.projects[existingProjectIndex],
      ...project,
      updatedAt: new Date().toISOString()
    };
  } else {
    // Tambahkan project baru
    data.projects.push({
      ...project,
      id: project.id || `project-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  
  return saveAllData(data);
};

// Menghapus project
const deleteProject = (projectId) => {
  const data = getAllData();
  data.projects = data.projects.filter(project => project.id !== projectId);
  return saveAllData(data);
};

// ===== User Data =====
// Mendapatkan user data
const getUserData = () => {
  const data = getAllData();
  return data.user;
};

// Menyimpan user data
const saveUserData = (userData) => {
  const data = getAllData();
  data.user = { ...userData };
  return saveAllData(data);
};

// ===== Data Export/Import =====
// Export data
const exportData = () => {
  return getAllData();
};

// Import data
const importData = (data) => {
  return saveAllData(data);
};

// Export functions
export default {
  // Tasks
  getTasks,
  getTaskById,
  saveTask,
  deleteTask,
  
  // Events
  getEvents,
  getEventById,
  saveEvent,
  deleteEvent,
  
  // Projects
  getProjects,
  getProjectById,
  saveProject,
  deleteProject,
  
  // User
  getUserData,
  saveUserData,
  
  // Utilities
  exportData,
  importData
}; 