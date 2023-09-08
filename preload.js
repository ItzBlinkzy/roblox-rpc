const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld('electronAPI', {
  updateData: (callback) => ipcRenderer.on('update-data', callback),
  sendToMain: (channel, data) => ipcRenderer.send(channel, data),
});
// window.electronAPI.ipcRenderer = ipcRenderer