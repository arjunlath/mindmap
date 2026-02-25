import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Mock Electron API for web-based preview/verification
if (typeof window !== 'undefined' && !window.electronAPI) {
  (window as any).electronAPI = {
    showOpenDialog: async () => null,
    showSaveDialog: async () => 'mock-path.mmap',
    saveFile: async () => true,
    exportFile: async () => true,
  };
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
