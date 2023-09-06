const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld('electronAPI', {
  updateData: (callback) => ipcRenderer.on('update-data', callback),
});
