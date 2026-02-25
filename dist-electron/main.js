import { app, ipcMain, dialog, BrowserWindow } from "electron";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
let mainWindow = null;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    titleBarStyle: "hiddenInset",
    webPreferences: {
      preload: path.join(__dirname$1, "preload.mjs"),
      nodeIntegration: false,
      contextIsolation: true
    },
    show: false,
    backgroundColor: "#ffffff"
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(process.env.DIST, "index.html"));
  }
  mainWindow.once("ready-to-show", () => {
    mainWindow?.show();
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}
app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
ipcMain.handle("show-open-dialog", async () => {
  if (!mainWindow) return null;
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openFile"],
    filters: [{ name: "Mind Map", extensions: ["mmap"] }]
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  const content = fs.readFileSync(result.filePaths[0], "utf-8");
  return {
    filePath: result.filePaths[0],
    content: JSON.parse(content)
  };
});
ipcMain.handle("show-save-dialog", async (event, title) => {
  if (!mainWindow) return null;
  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: `${title}.mmap`,
    filters: [{ name: "Mind Map", extensions: ["mmap"] }]
  });
  if (result.canceled || !result.filePath) return null;
  return result.filePath;
});
ipcMain.handle("save-file", async (event, filePath, content) => {
  try {
    const tempPath = `${filePath}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(content, null, 2));
    fs.renameSync(tempPath, filePath);
    return true;
  } catch (error) {
    console.error("Save failed:", error);
    return false;
  }
});
ipcMain.handle("export-file", async (event, defaultName, data, extension) => {
  if (!mainWindow) return null;
  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: `${defaultName}.${extension}`,
    filters: [{ name: extension.toUpperCase(), extensions: [extension] }]
  });
  if (result.canceled || !result.filePath) return null;
  if (extension === "json") {
    fs.writeFileSync(result.filePath, data);
  } else {
    const base64Data = data.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    fs.writeFileSync(result.filePath, buffer);
  }
  return true;
});
