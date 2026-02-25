import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  showOpenDialog: () => ipcRenderer.invoke('show-open-dialog'),
  showSaveDialog: (title: string) => ipcRenderer.invoke('show-save-dialog', title),
  saveFile: (filePath: string, content: any) => ipcRenderer.invoke('save-file', filePath, content),
  exportFile: (defaultName: string, data: string, extension: string) =>
    ipcRenderer.invoke('export-file', defaultName, data, extension),
});
