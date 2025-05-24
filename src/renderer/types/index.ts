// Core chess types
export interface Move {
  from: string;
  to: string;
  san: string;
  fen: string;
  promotion?: string;
}

export interface Position {
  fen: string;
  moves: Move[];
  evaluation?: number;
  depth?: number;
}

// Repertoire data structure as specified
export interface Repertoire {
  id: string;
  name: string;
  moves: string[];
  annotations: { [move: string]: string };
  color: 'white' | 'black';
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}

// Variation tree structure
export interface VariationNode {
  id: string;
  move: string;
  san: string;
  fen: string;
  comment?: string;
  evaluation?: number;
  children: VariationNode[];
  parent?: string;
  isMainLine: boolean;
}

// Training/drill types
export interface DrillCard {
  id: string;
  repertoireId: string;
  position: string; // FEN
  correctMove: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  lastReviewed?: Date;
  nextReview?: Date;
  successCount: number;
  failureCount: number;
  interval: number; // days
}

export interface TrainingSession {
  id: string;
  repertoireId: string;
  startTime: Date;
  endTime?: Date;
  cardsReviewed: number;
  correctAnswers: number;
  incorrectAnswers: number;
  averageTime: number; // seconds
}

// Lichess API types
export interface LichessOpeningData {
  white: number;
  draws: number;
  black: number;
  moves: LichessMove[];
  topGames?: LichessGame[];
  recentGames?: LichessGame[];
}

export interface LichessMove {
  uci: string;
  san: string;
  white: number;
  draws: number;
  black: number;
  averageRating: number;
}

export interface LichessGame {
  id: string;
  winner: 'white' | 'black' | 'draw';
  speed: string;
  mode: string;
  white: {
    name: string;
    rating: number;
  };
  black: {
    name: string;
    rating: number;
  };
  year: number;
  month: string;
}

// Engine analysis types
export interface EngineEvaluation {
  depth: number;
  score: {
    type: 'cp' | 'mate';
    value: number;
  };
  pv: string[];
  time: number;
  nodes: number;
  nps: number;
}

// UI state types
export interface AppState {
  currentRepertoire?: Repertoire;
  repertoires: Repertoire[];
  currentPosition: string; // FEN
  selectedMove?: string;
  isAnalysisMode: boolean;
  engineEnabled: boolean;
  engineDepth: number;
  showCoordinates: boolean;
  pieceTheme: string;
  boardTheme: string;
  autoSave: boolean;
  soundEnabled: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  duration?: number;
}

// Settings types
export interface AppSettings {
  notation: 'san' | 'lan' | 'uci';
  engineDepth: number;
  autoSave: boolean;
  soundEnabled: boolean;
  showCoordinates: boolean;
  pieceTheme: 'classic' | 'modern' | 'neon';
  boardTheme: 'dark' | 'purple' | 'blue';
  animationSpeed: 'slow' | 'normal' | 'fast';
  theme: 'dark' | 'auto';
  language: 'en' | 'es' | 'fr' | 'de';
  updateChannel: 'stable' | 'beta';
}

// File I/O types
export interface ImportResult {
  success: boolean;
  repertoires?: Repertoire[];
  errors?: string[];
  warnings?: string[];
}

export interface ExportOptions {
  format: 'pgn' | 'json';
  includeAnnotations: boolean;
  includeVariations: boolean;
  includeComments: boolean;
}

// Navigation types
export type ModuleRoute = 
  | 'home'
  | 'editor' 
  | 'tree'
  | 'explorer'
  | 'trainer'
  | 'io'
  | 'settings';

export interface NavigationItem {
  id: ModuleRoute;
  label: string;
  icon: string;
  path: string;
  description: string;
}

// Component prop types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  dark?: boolean;
  onClick?: () => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}