const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron',
  {
    windowControl: {
      minimize: () => ipcRenderer.send('app-minimize'),
      maximize: () => ipcRenderer.send('app-maximize'),
      quit: () => ipcRenderer.send('app-quit')
    },
    data: {
      exportData: (data) => ipcRenderer.invoke('export-data', data),
      importData: () => ipcRenderer.invoke('import-data')
    },
    notification: {
      showNotification: (title, body) => {
        new Notification(title, { body });
      }
    }
  }
); 