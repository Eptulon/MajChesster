import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // File operations
  saveFile: (filePath: string, content: string) => 
    ipcRenderer.invoke('save-file', filePath, content),
  readFile: (filePath: string) => 
    ipcRenderer.invoke('read-file', filePath),

  // Menu event listeners
  onMenuNewRepertoire: (callback: () => void) => 
    ipcRenderer.on('menu-new-repertoire', callback),
  onMenuSaveRepertoire: (callback: () => void) => 
    ipcRenderer.on('menu-save-repertoire', callback),
  onMenuStartTraining: (callback: () => void) => 
    ipcRenderer.on('menu-start-training', callback),
  onMenuReviewMistakes: (callback: () => void) => 
    ipcRenderer.on('menu-review-mistakes', callback),
  onMenuAbout: (callback: () => void) => 
    ipcRenderer.on('menu-about', callback),

  // File events
  onFileOpened: (callback: (event: any, data: { path: string; content: string }) => void) => 
    ipcRenderer.on('file-opened', callback),
  onExportPgn: (callback: (event: any, filePath: string) => void) => 
    ipcRenderer.on('export-pgn', callback),
  onExportJson: (callback: (event: any, filePath: string) => void) => 
    ipcRenderer.on('export-json', callback),

  // Remove listeners
  removeAllListeners: (channel: string) => 
    ipcRenderer.removeAllListeners(channel),
});

// Type definitions for the exposed API
declare global {
  interface Window {
    electronAPI: {
      saveFile: (filePath: string, content: string) => Promise<{ success: boolean; error?: string }>;
      readFile: (filePath: string) => Promise<{ success: boolean; content?: string; error?: string }>;
      onMenuNewRepertoire: (callback: () => void) => void;
      onMenuSaveRepertoire: (callback: () => void) => void;
      onMenuStartTraining: (callback: () => void) => void;
      onMenuReviewMistakes: (callback: () => void) => void;
      onMenuAbout: (callback: () => void) => void;
      onFileOpened: (callback: (event: any, data: { path: string; content: string }) => void) => void;
      onExportPgn: (callback: (event: any, filePath: string) => void) => void;
      onExportJson: (callback: (event: any, filePath: string) => void) => void;
      removeAllListeners: (channel: string) => void;
    };
  }
}