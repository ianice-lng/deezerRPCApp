const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    trackUpdate: (trackInfo) => ipcRenderer.send('trackUpdate', trackInfo)
});
