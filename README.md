# Premium Mind Map Application

A production-grade Mind Map application with a modern, premium UI similar to Wondershare EdrawMind and XMind. Built with React, TypeScript, React Flow, and Electron.

## 🚀 Features

### 🧠 Core Mind Map Logic
- **Node Management**: Add nodes (Tab) and siblings (Enter).
- **Auto Layout**: Hierarchical layout engine to keep your maps organized.
- **Drag & Drop**: Intuitive reordering and movement.
- **Keyboard Shortcuts**: Full keyboard navigation support for productivity.

### 🎨 Premium UI/UX
- **Glassmorphism Design**: Modern, translucent UI with blurred backgrounds.
- **Dark/Light Mode**: Seamless theme switching.
- **Animations**: Smooth transitions using Framer Motion.
- **Infinite Canvas**: Smooth zoom & pan with mouse wheel and trackpad support.
- **Mini-map**: Overview panel for large map navigation.

### 💾 Data & Persistence
- **Autosave**: Debounced background saving (every 3 seconds).
- **Local Storage**: Opens and saves `.mmap` (JSON-based) files directly to your machine.
- **Export**: Save your maps as PNG, PDF, or JSON.
- **Undo/Redo**: Full history stack for worry-free editing.

## 🛠 Technical Stack

- **Frontend**: React + TypeScript
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Canvas Rendering**: React Flow
- **Desktop Wrapper**: Electron
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Testing**: Vitest

## 📂 Project Architecture

```
/src
  /canvas      # React Flow canvas implementation
  /components  # UI components (Node, Toolbar, Sidebar, etc.)
  /hooks       # Custom hooks (useKeyboardShortcuts, useAutosave, etc.)
  /layout      # Layout engine and tree algorithms
  /services    # File system and export services
  /store       # Zustand state management
  /types       # TypeScript interfaces
  /utils       # Helper functions
/electron      # Electron main and preload scripts
```

## 💻 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

To start the application in development mode:
```bash
npm run dev
```

### Building

To package the application for production:
```bash
npm run build
```

## 🧪 Testing

Run unit tests for the layout engine and state logic:
```bash
npm test
```

## 📄 License

MIT
