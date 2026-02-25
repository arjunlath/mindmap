import { contextBridge, ipcRenderer } from "electron";
contextBridge.exposeInMainWorld("electronAPI", {
  showOpenDialog: () => ipcRenderer.invoke("show-open-dialog"),
  showSaveDialog: (title) => ipcRenderer.invoke("show-save-dialog", title),
  saveFile: (filePath, content) => ipcRenderer.invoke("save-file", filePath, content),
  exportFile: (defaultName, data, extension) => ipcRenderer.invoke("export-file", defaultName, data, extension)
});
