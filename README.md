# Modern SaaS Mind Map Application

A production-grade, web-based Mind Map application with a premium, glassmorphism UI. Built for SaaS deployment but supports local file operations and modern browser features.

## 🚀 Key Features

- **Premium UI**: Modern glassmorphism panels, soft shadows, and clean typography.
- **Dynamic State**: Powered by Zustand with local persistence and undo/redo history.
- **Auto-Layout**: Hierarchical tree layout engine for instant organization.
- **SaaS-Ready**: Optimized for browser deployment with local file download/upload (.mmap).
- **Smooth Navigation**: Infinite canvas with smooth zoom, pan, and mini-map overview.
- **Export Engine**: Export your maps directly to PNG or PDF.
- **Keyboard Productivity**: Tab for children, Enter for siblings, and more.
- **Adaptive Themes**: Light, Dark, and System theme synchronization.

## 🛠 Tech Stack

- **Frontend**: React 19 + TypeScript
- **State**: Zustand (Persisted)
- **Canvas**: React Flow
- **Styling**: TailwindCSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Build**: Vite

## 📂 Architecture

- `/src/canvas`: Main React Flow implementation.
- `/src/store`: Centralized state management with persistence logic.
- `/src/components`: Premium UI components with glassmorphism.
- `/src/services`: Browser-based file handling and export services.
- `/src/utils`: Layout algorithms and UI helpers.

## 💻 Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start dev server:
   ```bash
   npm run dev
   ```

## 🧪 Testing

Run unit tests for core logic:
```bash
npm test
```

## 📄 License

MIT
