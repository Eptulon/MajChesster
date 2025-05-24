import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, Repertoire, ToastMessage, AppSettings } from '../types';

// Initial state
const initialState: AppState = {
  repertoires: [],
  currentPosition: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', // Starting position
  isAnalysisMode: false,
  engineEnabled: true,
  engineDepth: 15,
  showCoordinates: true,
  pieceTheme: 'classic',
  boardTheme: 'dark',
  autoSave: true,
  soundEnabled: true,
};

const initialSettings: AppSettings = {
  notation: 'san',
  engineDepth: 15,
  autoSave: true,
  soundEnabled: true,
  showCoordinates: true,
  pieceTheme: 'classic',
  boardTheme: 'dark',
  animationSpeed: 'normal',
  theme: 'dark',
  language: 'en',
  updateChannel: 'stable',
};

// Action types
type AppAction =
  | { type: 'SET_CURRENT_REPERTOIRE'; payload: Repertoire | undefined }
  | { type: 'ADD_REPERTOIRE'; payload: Repertoire }
  | { type: 'UPDATE_REPERTOIRE'; payload: Repertoire }
  | { type: 'DELETE_REPERTOIRE'; payload: string }
  | { type: 'SET_REPERTOIRES'; payload: Repertoire[] }
  | { type: 'SET_CURRENT_POSITION'; payload: string }
  | { type: 'SET_SELECTED_MOVE'; payload: string | undefined }
  | { type: 'TOGGLE_ANALYSIS_MODE' }
  | { type: 'SET_ENGINE_ENABLED'; payload: boolean }
  | { type: 'SET_ENGINE_DEPTH'; payload: number }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'SHOW_TOAST'; payload: ToastMessage }
  | { type: 'HIDE_TOAST'; payload: string }
  | { type: 'LOAD_STATE'; payload: Partial<AppState> };

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CURRENT_REPERTOIRE':
      return { ...state, currentRepertoire: action.payload };
    
    case 'ADD_REPERTOIRE':
      return { 
        ...state, 
        repertoires: [...state.repertoires, action.payload],
        currentRepertoire: action.payload
      };
    
    case 'UPDATE_REPERTOIRE':
      return {
        ...state,
        repertoires: state.repertoires.map(rep => 
          rep.id === action.payload.id ? action.payload : rep
        ),
        currentRepertoire: state.currentRepertoire?.id === action.payload.id 
          ? action.payload 
          : state.currentRepertoire
      };
    
    case 'DELETE_REPERTOIRE':
      return {
        ...state,
        repertoires: state.repertoires.filter(rep => rep.id !== action.payload),
        currentRepertoire: state.currentRepertoire?.id === action.payload 
          ? undefined 
          : state.currentRepertoire
      };
    
    case 'SET_REPERTOIRES':
      return { ...state, repertoires: action.payload };
    
    case 'SET_CURRENT_POSITION':
      return { ...state, currentPosition: action.payload };
    
    case 'SET_SELECTED_MOVE':
      return { ...state, selectedMove: action.payload };
    
    case 'TOGGLE_ANALYSIS_MODE':
      return { ...state, isAnalysisMode: !state.isAnalysisMode };
    
    case 'SET_ENGINE_ENABLED':
      return { ...state, engineEnabled: action.payload };
    
    case 'SET_ENGINE_DEPTH':
      return { ...state, engineDepth: action.payload };
    
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    
    default:
      return state;
  }
}

// Toast context
interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Settings context
interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Main app context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Repertoire actions
  setCurrentRepertoire: (repertoire: Repertoire | undefined) => void;
  addRepertoire: (repertoire: Repertoire) => void;
  updateRepertoire: (repertoire: Repertoire) => void;
  deleteRepertoire: (id: string) => void;
  // Position actions
  setCurrentPosition: (fen: string) => void;
  setSelectedMove: (move: string | undefined) => void;
  // UI actions
  toggleAnalysisMode: () => void;
  setEngineEnabled: (enabled: boolean) => void;
  setEngineDepth: (depth: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);
  const [settings, setSettings] = React.useState<AppSettings>(initialSettings);

  // Load saved state on mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        // Load repertoires from localStorage
        const savedRepertoires = localStorage.getItem('majchesster-repertoires');
        if (savedRepertoires) {
          const repertoires = JSON.parse(savedRepertoires);
          dispatch({ type: 'SET_REPERTOIRES', payload: repertoires });
        }

        // Load settings from localStorage
        const savedSettings = localStorage.getItem('majchesster-settings');
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);
          setSettings({ ...initialSettings, ...parsedSettings });
        }

        // Load app state from localStorage
        const savedState = localStorage.getItem('majchesster-state');
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          dispatch({ type: 'LOAD_STATE', payload: parsedState });
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    };

    loadSavedData();
  }, []);

  // Auto-save state changes
  useEffect(() => {
    if (settings.autoSave) {
      localStorage.setItem('majchesster-repertoires', JSON.stringify(state.repertoires));
      localStorage.setItem('majchesster-state', JSON.stringify({
        currentPosition: state.currentPosition,
        engineEnabled: state.engineEnabled,
        engineDepth: state.engineDepth,
        showCoordinates: state.showCoordinates,
        pieceTheme: state.pieceTheme,
        boardTheme: state.boardTheme,
      }));
    }
  }, [state, settings.autoSave]);

  // Save settings changes
  useEffect(() => {
    localStorage.setItem('majchesster-settings', JSON.stringify(settings));
  }, [settings]);

  // Action creators
  const setCurrentRepertoire = (repertoire: Repertoire | undefined) => {
    dispatch({ type: 'SET_CURRENT_REPERTOIRE', payload: repertoire });
  };

  const addRepertoire = (repertoire: Repertoire) => {
    dispatch({ type: 'ADD_REPERTOIRE', payload: repertoire });
  };

  const updateRepertoire = (repertoire: Repertoire) => {
    dispatch({ type: 'UPDATE_REPERTOIRE', payload: repertoire });
  };

  const deleteRepertoire = (id: string) => {
    dispatch({ type: 'DELETE_REPERTOIRE', payload: id });
  };

  const setCurrentPosition = (fen: string) => {
    dispatch({ type: 'SET_CURRENT_POSITION', payload: fen });
  };

  const setSelectedMove = (move: string | undefined) => {
    dispatch({ type: 'SET_SELECTED_MOVE', payload: move });
  };

  const toggleAnalysisMode = () => {
    dispatch({ type: 'TOGGLE_ANALYSIS_MODE' });
  };

  const setEngineEnabled = (enabled: boolean) => {
    dispatch({ type: 'SET_ENGINE_ENABLED', payload: enabled });
  };

  const setEngineDepth = (depth: number) => {
    dispatch({ type: 'SET_ENGINE_DEPTH', payload: depth });
  };

  // Toast functions
  const showToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Date.now().toString();
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);
    
    // Auto-hide after duration
    setTimeout(() => {
      hideToast(id);
    }, toast.duration || 5000);
  };

  const hideToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Settings functions
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const appContextValue: AppContextType = {
    state,
    dispatch,
    setCurrentRepertoire,
    addRepertoire,
    updateRepertoire,
    deleteRepertoire,
    setCurrentPosition,
    setSelectedMove,
    toggleAnalysisMode,
    setEngineEnabled,
    setEngineDepth,
  };

  const toastContextValue: ToastContextType = {
    toasts,
    showToast,
    hideToast,
  };

  const settingsContextValue: SettingsContextType = {
    settings,
    updateSettings,
  };

  return (
    <AppContext.Provider value={appContextValue}>
      <ToastContext.Provider value={toastContextValue}>
        <SettingsContext.Provider value={settingsContextValue}>
          {children}
        </SettingsContext.Provider>
      </ToastContext.Provider>
    </AppContext.Provider>
  );
}

// Custom hooks
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within an AppProvider');
  }
  return context;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within an AppProvider');
  }
  return context;
}