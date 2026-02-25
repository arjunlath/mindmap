export interface IElectronAPI {
  showOpenDialog: () => Promise<{ filePath: string; content: any } | null>;
  showSaveDialog: (title: string) => Promise<string | null>;
  saveFile: (filePath: string, content: any) => Promise<boolean>;
  exportFile: (defaultName: string, data: string, extension: string) => Promise<boolean>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
