import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import { MindMapCanvas } from '@/canvas/MindMapCanvas';
import { Sidebar } from '@/components/Sidebar';
import { Toolbar } from '@/components/Toolbar';
import { StatusBar } from '@/components/StatusBar';
import { useTheme } from '@/hooks/useTheme';

function App() {
  useTheme();

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-500">
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
