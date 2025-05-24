import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import ToastContainer from './components/Toast';
import { useToast } from './hooks/useAppContext';

// Module imports
import HomeDashboard from './modules/HomeDashboard';
import LineEditor from './modules/LineEditor';
import VariationTree from './modules/VariationTree';
import MoveExplorer from './modules/MoveExplorer';
import DrillTrainer from './modules/DrillTrainer';
import ImportExport from './modules/ImportExport';
import Settings from './modules/Settings';

import './App.scss';

const App: React.FC = () => {
  const { showToast } = useToast();

  useEffect(() => {
    // Set up Electron menu event listeners
    if (window.electronAPI) {
      const { electronAPI } = window;

      // Menu event handlers
      const handleNewRepertoire = () => {
        showToast({
          type: 'info',
          title: 'New Repertoire',
          message: 'Creating a new repertoire...',
        });
      };

      const handleSaveRepertoire = () => {
        showToast({
          type: 'success',
          title: 'Saved',
          message: 'Repertoire saved successfully!',
        });
      };

      const handleStartTraining = () => {
        showToast({
          type: 'info',
          title: 'Training',
          message: 'Starting drill session...',
        });
      };

      const handleFileOpened = (event: any, data: { path: string; content: string }) => {
        showToast({
          type: 'success',
          title: 'File Opened',
          message: `Loaded ${data.path}`,
        });
      };

      const handleAbout = () => {
        showToast({
          type: 'info',
          title: 'MajChesster v1.0.0',
          message: 'Cross-platform chess repertoire application',
          duration: 8000,
        });
      };

      // Register event listeners
      electronAPI.onMenuNewRepertoire(handleNewRepertoire);
      electronAPI.onMenuSaveRepertoire(handleSaveRepertoire);
      electronAPI.onMenuStartTraining(handleStartTraining);
      electronAPI.onFileOpened(handleFileOpened);
      electronAPI.onMenuAbout(handleAbout);

      // Cleanup function
      return () => {
        electronAPI.removeAllListeners('menu-new-repertoire');
        electronAPI.removeAllListeners('menu-save-repertoire');
        electronAPI.removeAllListeners('menu-start-training');
        electronAPI.removeAllListeners('file-opened');
        electronAPI.removeAllListeners('menu-about');
      };
    }
  }, [showToast]);

  return (
    <div className="app">
      <Sidebar />
      <div className="app__main">
        <TopBar />
        <main className="app__content">
          <Routes>
            <Route path="/" element={<HomeDashboard />} />
            <Route path="/editor" element={<LineEditor />} />
            <Route path="/tree" element={<VariationTree />} />
            <Route path="/explorer" element={<MoveExplorer />} />
            <Route path="/trainer" element={<DrillTrainer />} />
            <Route path="/io" element={<ImportExport />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};

export default App;