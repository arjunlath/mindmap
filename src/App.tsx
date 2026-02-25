import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import { MindMapCanvas } from '@/canvas/MindMapCanvas';
import { Sidebar } from '@/components/Sidebar';
import { Toolbar } from '@/components/Toolbar';
import { StatusBar } from '@/components/StatusBar';
import { useAutosave } from '@/hooks/useAutosave';
import { useTheme } from '@/hooks/useTheme';

function App() {
  // Initialize hooks
  useAutosave();
  useTheme();

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <ReactFlowProvider>
        <div className="relative flex-1">
          <Sidebar />
          <Toolbar />
          <MindMapCanvas />
          <StatusBar />
        </div>
      </ReactFlowProvider>
    </div>
  );
}

export default App;
