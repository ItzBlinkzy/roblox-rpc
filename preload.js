const { contextBridge, ipcRenderer } = require('electron')

console.log("PRELOAD SCRIPT RUNNING??!?!?!");
contextBridge.exposeInMainWorld('electronAPI', {
  updateData: (callback) => ipcRenderer.on('update-data', callback)
})