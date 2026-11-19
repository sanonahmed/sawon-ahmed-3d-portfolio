export interface Project {
  id: string;
  title: string;
  category: 'Full Stack' | '3D & WebGL' | 'Cloud & Systems' | 'AI & Tools';
  tagline: string;
  description: string;
  fullDetails: string;
  architectureHighlights: string[];
  metrics: { label: string; value: string }[];
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  color: string;
}

export interface SkillCategory {
  name: string;
  icon: string;
  description: string;
  skills: {
    name: string;
    level: number; // 0 - 100
    experience: string;
    highlight?: boolean;
  }[];
}

export interface TimelineEntry {
  id: string;
  period: string;
  role: string;
  company: string;
  location: string;
  description: string;
  achievements: string[];
  techStack: string[];
}

export type ViewpointMode = 'overview' | 'projects' | 'skills' | 'timeline' | 'contact' | 'notes';

export interface StickyNote {
  id: string;
  title: string;
  category: 'architecture' | 'easter-egg' | 'quick-contact' | 'dev-notes';
  color: string; // CSS color
  paperHex: number; // Three.js material color
  pinColor: string;
  rotation: number; // radians
  position: [number, number, number];
  content: string;
  codeSnippet?: string;
  date: string;
  badge: string;
  action?: {
    label: string;
    type: 'contact' | 'screen-mode' | 'copy';
    payload?: string;
  };
}

export type MoodLighting = 'cyber-neon' | 'tokyo-dusk' | 'matrix-emerald' | 'clean-studio' | 'retro-synthwave';

export interface MoodPreset {
  id: MoodLighting;
  name: string;
  description: string;
  keyLight: number; // hex color
  fillLight: number;
  rimLight: number;
  groundLight: number;
  fogColor: number;
  accentGlow: string; // css color
  bloomIntensity?: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof ContactFormData, string>>;
}

export type SoundscapeType = 'off' | 'cyber-space' | 'server-hum' | 'tokyo-rain' | 'synthwave-breeze';

export interface SoundscapePreset {
  id: SoundscapeType;
  name: string;
  subtitle: string;
  color: string;
  genre: string;
}

export interface FpsMetrics {
  fps: number;
  frameTimeMs: number;
  isSoftwareGl: boolean;
  frameHistory: number[];
}

export type KeyboardSwitchType = 'blue' | 'brown' | 'red';

export interface KeyboardSwitchInfo {
  type: KeyboardSwitchType;
  name: string;
  feel: string;
  soundType: string;
  color: string;
  accentHex: number;
}

export type ScreenTerminalMode = 'code' | 'build' | 'matrix';

export interface ScreenTerminalModeInfo {
  mode: ScreenTerminalMode;
  name: string;
  tagline: string;
  badge: string;
  color: string;
}

export type InteractiveObjectType = 'screen' | 'keyboard' | 'coffee' | 'succulent' | 'project' | 'sticky-note';

export interface InteractiveHoverTarget {
  type: InteractiveObjectType;
  id?: string;
  title?: string;
  label?: string;
  actionHint?: string;
  point?: { x: number; y: number };
}

export interface CursorVisualConfig {
  shape: 'default' | 'screen' | 'keyboard' | 'coffee' | 'succulent' | 'project' | 'sticky-note';
  color: string;
  glowColor: string;
  accentBg: string;
  size: number;
  label: string;
  actionHint: string;
  hudStyle: 'minimal' | 'brackets' | 'hex' | 'organic' | 'crosshair' | 'pinned';
}

