import {
  Project,
  SkillCategory,
  ContactFormData,
  ContactValidationResult,
  ViewpointMode,
  MoodLighting,
  KeyboardSwitchType,
  ScreenTerminalMode,
  InteractiveHoverTarget,
  CursorVisualConfig,
  InteractiveObjectType,
  StickyNote
} from '../types/portfolio';

export interface CameraTargetConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

/**
 * Filter projects by search query and category
 */
export function filterProjects(
  projects: Project[],
  query: string,
  category: string
): Project[] {
  const normalizedQuery = query.trim().toLowerCase();
  
  return projects.filter(project => {
    const matchesCategory = category === 'All' || project.category === category;
    if (!matchesCategory) return false;
    
    if (!normalizedQuery) return true;
    
    const matchesTitle = project.title.toLowerCase().includes(normalizedQuery);
    const matchesDesc = project.description.toLowerCase().includes(normalizedQuery);
    const matchesTagline = project.tagline.toLowerCase().includes(normalizedQuery);
    const matchesTags = project.tags.some(tag => tag.toLowerCase().includes(normalizedQuery));
    
    return matchesTitle || matchesDesc || matchesTagline || matchesTags;
  });
}

/**
 * Validate contact form data
 */
export function validateContactForm(data: ContactFormData): ContactValidationResult {
  const errors: Partial<Record<keyof ContactFormData, string>> = {};
  
  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long.';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email.trim())) {
    errors.email = 'Please provide a valid email address.';
  }
  
  if (!data.subject || data.subject.trim().length < 3) {
    errors.subject = 'Subject must be at least 3 characters long.';
  }
  
  if (!data.message || data.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters long.';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Calculate aggregate skills statistics
 */
export function calculateSkillStats(categories: SkillCategory[]): {
  totalSkills: number;
  averageMastery: number;
  topSkillsCount: number;
} {
  let totalSkills = 0;
  let totalMastery = 0;
  let topSkillsCount = 0;
  
  for (const cat of categories) {
    for (const skill of cat.skills) {
      totalSkills += 1;
      totalMastery += skill.level;
      if (skill.level >= 90) {
        topSkillsCount += 1;
      }
    }
  }
  
  return {
    totalSkills,
    averageMastery: totalSkills > 0 ? Math.round(totalMastery / totalSkills) : 0,
    topSkillsCount
  };
}

/**
 * Return camera position, lookAt target, and FOV for each viewpoint preset
 */
export function getViewpointCameraTarget(mode: ViewpointMode): CameraTargetConfig {
  switch (mode) {
    case 'overview':
      // Cinematic isometric studio vantage point
      return {
        position: [4.8, 3.6, 5.8],
        target: [0, 0.9, 0],
        fov: 42
      };
    case 'projects':
      // Focus on the ultra-wide curved terminal and holographic project array
      return {
        position: [0.3, 2.1, 3.4],
        target: [0, 1.45, 0],
        fov: 38
      };
    case 'skills':
      // Closer high-angle view on the tech core, keyboard, and server modules
      return {
        position: [-3.2, 3.2, 3.6],
        target: [-0.3, 1.2, 0],
        fov: 40
      };
    case 'timeline':
      // Profile view highlighting workstation architecture and depth
      return {
        position: [4.2, 2.2, 2.4],
        target: [0.2, 1.1, -0.2],
        fov: 42
      };
    case 'contact':
      // Frontal immersive console view (like sitting at the developer desk)
      return {
        position: [0, 1.65, 2.3],
        target: [0, 1.35, -0.2],
        fov: 45
      };
    case 'notes':
      // Close-up inspect vantage point focused directly onto the desk sticky notes
      return {
        position: [0.0, 1.42, 0.65],
        target: [0.0, 1.01, 0.06],
        fov: 34
      };
    default:
      return {
        position: [4.8, 3.6, 5.8],
        target: [0, 0.9, 0],
        fov: 42
      };
  }
}

/**
 * Returns formatted loading metadata based on current progress percentage
 */
export function getLoadingStage(progress: number): {
  percent: number;
  label: string;
  code: string;
} {
  const clamped = Math.max(0, Math.min(100, Math.round(progress)));

  if (clamped < 25) {
    return {
      percent: clamped,
      label: 'Probing GPU capabilities & initializing WebGL2 context...',
      code: 'SYS_INIT_GPU_PROBE'
    };
  } else if (clamped < 50) {
    return {
      percent: clamped,
      label: 'Synthesizing procedural textures, syntax maps & carbon weaves...',
      code: 'TEX_SYNTHESIZE_PROCEDURAL'
    };
  } else if (clamped < 75) {
    return {
      percent: clamped,
      label: 'Assembling 12-part developer workstation & mechanical geometries...',
      code: 'GEO_RIG_ASSEMBLY_PBR'
    };
  } else if (clamped < 95) {
    return {
      percent: clamped,
      label: 'Generating PMREM studio environment & baking contact shadows...',
      code: 'ENV_PMREM_BAKE'
    };
  } else {
    return {
      percent: clamped,
      label: 'Workspace calibrated. Ready to enter.',
      code: 'SYS_CALIBRATED_READY'
    };
  }
}

/**
 * Check if ?autostart=1 or ?skip_loading=1 query parameter is set
 */
export function shouldBypassLoading(queryString: string): boolean {
  if (!queryString) return false;
  return /autostart=1|skip_loading=1/i.test(queryString);
}

/**
 * Validate soundscape ID against known presets
 */
export function isValidSoundscape(type: string): boolean {
  return ['off', 'cyber-space', 'server-hum', 'tokyo-rain', 'synthwave-breeze'].includes(type);
}

/**
 * Validate chat message content
 */
export function validateChatMessage(text: string): { isValid: boolean; error?: string } {
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return { isValid: false, error: 'Message cannot be empty.' };
  }
  if (trimmed.length > 2000) {
    return { isValid: false, error: 'Message exceeds maximum length of 2000 characters.' };
  }
  return { isValid: true };
}

/**
 * Return performance quality status based on measured FPS
 */
export function getFpsStatus(fps: number): {
  status: 'optimal' | 'stable' | 'low';
  label: string;
  color: string;
  bg: string;
  border: string;
} {
  const rounded = Math.round(fps);
  if (rounded >= 55) {
    return {
      status: 'optimal',
      label: 'Optimal',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20'
    };
  } else if (rounded >= 30) {
    return {
      status: 'stable',
      label: 'Stable',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20'
    };
  } else {
    return {
      status: 'low',
      label: 'Low',
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20'
    };
  }
}

/**
 * Format frame render delta time in milliseconds
 */
export function formatFrameTime(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) return '0.0 ms';
  return `${ms.toFixed(1)} ms`;
}

/**
 * Calculate FPS from render delta time in seconds
 */
export function calculateFpsFromDelta(deltaSeconds: number): number {
  if (!Number.isFinite(deltaSeconds) || deltaSeconds <= 0) return 0;
  const rawFps = 1 / deltaSeconds;
  return Math.min(240, Math.max(0, Math.round(rawFps)));
}

/**
 * Format FPS counter display string
 */
export function formatFpsDisplay(fps: number): string {
  const clamped = Math.max(0, Math.round(fps));
  return `${clamped} FPS`;
}

/**
 * Clamp bloom intensity value between minimum and maximum bounds
 */
export function clampBloomIntensity(intensity: number, min: number = 0, max: number = 2.5): number {
  if (!Number.isFinite(intensity)) return 1.0;
  return Math.min(max, Math.max(min, Number(intensity.toFixed(2))));
}

/**
 * Format bloom intensity value as a human-readable multiplier or percentage string
 */
export function formatBloomIntensity(intensity: number): string {
  const clamped = clampBloomIntensity(intensity);
  return `${clamped.toFixed(2)}x`;
}

/**
 * Return descriptive label and color for the current bloom intensity level
 */
export function getBloomPresetLabel(intensity: number): {
  label: string;
  badgeColor: string;
  glowColor: string;
} {
  const clamped = clampBloomIntensity(intensity);
  if (clamped === 0) {
    return {
      label: 'Disabled',
      badgeColor: 'text-neutral-400 bg-neutral-800/80 border-neutral-700',
      glowColor: 'transparent'
    };
  } else if (clamped < 0.7) {
    return {
      label: 'Subtle',
      badgeColor: 'text-sky-300 bg-sky-500/10 border-sky-500/20',
      glowColor: 'rgba(56, 189, 248, 0.2)'
    };
  } else if (clamped <= 1.5) {
    return {
      label: 'Cyber Glow',
      badgeColor: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/20',
      glowColor: 'rgba(6, 182, 212, 0.4)'
    };
  } else {
    return {
      label: 'Intense Neon',
      badgeColor: 'text-fuchsia-300 bg-fuchsia-500/10 border-fuchsia-500/20',
      glowColor: 'rgba(217, 70, 239, 0.6)'
    };
  }
}

/**
 * Clamp volumetric fog density between minimum and maximum bounds
 */
export function clampFogDensity(density: number, min: number = 0.01, max: number = 0.15): number {
  if (!Number.isFinite(density)) return 0.055;
  return Math.min(max, Math.max(min, Number(density.toFixed(3))));
}

/**
 * Format volumetric fog density percentage string
 */
export function formatFogDensity(density: number): string {
  const clamped = clampFogDensity(density);
  return `${(clamped * 100).toFixed(1)}%`;
}

/**
 * Return status badge and description for current volumetric fog state
 */
export function getFogStatus(enabled: boolean, density: number): {
  label: string;
  badgeColor: string;
  description: string;
} {
  if (!enabled) {
    return {
      label: 'Clear Space',
      badgeColor: 'text-neutral-400 bg-neutral-800/80 border-neutral-700',
      description: 'Zero scene fog, high contrast space background'
    };
  }
  const clamped = clampFogDensity(density);
  if (clamped < 0.04) {
    return {
      label: 'Subtle Haze',
      badgeColor: 'text-sky-300 bg-sky-500/10 border-sky-500/20',
      description: 'Gentle atmospheric depth gradient'
    };
  } else if (clamped <= 0.07) {
    return {
      label: 'Cyber Atmosphere',
      badgeColor: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/20',
      description: 'Balanced volumetric neon mist'
    };
  } else {
    return {
      label: 'Deep Cyber Fog',
      badgeColor: 'text-purple-300 bg-purple-500/10 border-purple-500/20',
      description: 'Heavy atmospheric depth and mystery'
    };
  }
}

/**
 * Validate if a mood preset identifier is recognized
 */
export function isValidMoodPreset(moodId: string): boolean {
  const validMoods = ['cyber-neon', 'retro-synthwave', 'tokyo-dusk', 'matrix-emerald', 'clean-studio'];
  return validMoods.includes(moodId);
}

/**
 * Return CSS transition styles and color tokens for the active mood preset
 */
export function getMoodThemeStyles(moodId: MoodLighting): {
  accentGlow: string;
  fogHex: string;
  radialGradient: string;
} {
  switch (moodId) {
    case 'retro-synthwave':
      return {
        accentGlow: '#ec4899',
        fogHex: '#190533',
        radialGradient: 'radial-gradient(ellipse 90% 60% at 50% 45%, rgba(236, 72, 153, 0.16) 0%, rgba(76, 29, 149, 0.10) 45%, transparent 75%)'
      };
    case 'tokyo-dusk':
      return {
        accentGlow: '#f59e0b',
        fogHex: '#0f0a17',
        radialGradient: 'radial-gradient(ellipse 90% 60% at 50% 45%, rgba(245, 158, 11, 0.12) 0%, rgba(59, 7, 100, 0.08) 45%, transparent 75%)'
      };
    case 'matrix-emerald':
      return {
        accentGlow: '#10b981',
        fogHex: '#050f0b',
        radialGradient: 'radial-gradient(ellipse 90% 60% at 50% 45%, rgba(16, 185, 129, 0.12) 0%, rgba(6, 78, 59, 0.08) 45%, transparent 75%)'
      };
    case 'clean-studio':
      return {
        accentGlow: '#60a5fa',
        fogHex: '#0a0e17',
        radialGradient: 'radial-gradient(ellipse 90% 60% at 50% 45%, rgba(96, 165, 250, 0.10) 0%, rgba(51, 65, 85, 0.06) 45%, transparent 75%)'
      };
    case 'cyber-neon':
    default:
      return {
        accentGlow: '#38bdf8',
        fogHex: '#08090d',
        radialGradient: 'radial-gradient(ellipse 90% 60% at 50% 45%, rgba(56, 189, 248, 0.12) 0%, rgba(56, 189, 248, 0.03) 40%, transparent 75%)'
      };
  }
}

/**
 * Maps standard alphanumeric and control keys to the 5x14 mechanical keyboard matrix (total 70 keycaps)
 */
export function mapCharToKeyboardKey(key: string): { row: number; col: number; index: number } {
  const normalized = key.toLowerCase();
  const rows = 5;
  const cols = 14;

  const keyMap: Record<string, [number, number]> = {
    // Row 0 (Number & Function Row)
    escape: [0, 0],
    '1': [0, 1],
    '2': [0, 2],
    '3': [0, 3],
    '4': [0, 4],
    '5': [0, 5],
    '6': [0, 6],
    '7': [0, 7],
    '8': [0, 8],
    '9': [0, 9],
    '0': [0, 10],
    '-': [0, 11],
    '=': [0, 12],
    backspace: [0, 13],

    // Row 1 (QWERTY top row)
    tab: [1, 0],
    q: [1, 1],
    w: [1, 2],
    e: [1, 3],
    r: [1, 4],
    t: [1, 5],
    y: [1, 6],
    u: [1, 7],
    i: [1, 8],
    o: [1, 9],
    p: [1, 10],
    '[': [1, 11],
    ']': [1, 12],
    '\\': [1, 13],

    // Row 2 (Home row)
    capslock: [2, 0],
    a: [2, 1],
    s: [2, 2],
    d: [2, 3],
    f: [2, 4],
    g: [2, 5],
    h: [2, 6],
    j: [2, 7],
    k: [2, 8],
    l: [2, 9],
    ';': [2, 10],
    "'": [2, 11],
    enter: [2, 12],
    return: [2, 12],

    // Row 3 (Bottom letter row)
    shift: [3, 0],
    z: [3, 1],
    x: [3, 2],
    c: [3, 3],
    v: [3, 4],
    b: [3, 5],
    n: [3, 6],
    m: [3, 7],
    ',': [3, 8],
    '.': [3, 9],
    '/': [3, 10],
    arrowup: [3, 12],

    // Row 4 (Modifier & Space row)
    control: [4, 0],
    alt: [4, 1],
    meta: [4, 2],
    ' ': [4, 6], // space bar
    space: [4, 6],
    arrowleft: [4, 11],
    arrowdown: [4, 12],
    arrowright: [4, 13]
  };

  if (keyMap[normalized]) {
    const [row, col] = keyMap[normalized];
    return { row, col, index: row * cols + col };
  }

  // Fallback hash mapping for unmapped special keys
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash << 5) - hash + normalized.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % (rows * cols);
  const row = Math.floor(index / cols);
  const col = index % cols;
  return { row, col, index };
}

/**
 * Validate keyboard switch type
 */
export function isValidKeyboardSwitch(switchType: string): switchType is KeyboardSwitchType {
  return ['blue', 'brown', 'red'].includes(switchType);
}

/**
 * Validate screen terminal mode
 */
export function isValidScreenMode(mode: string): mode is ScreenTerminalMode {
  return ['code', 'build', 'matrix'].includes(mode);
}

/**
 * Cycle to the next screen mode (code -> build -> matrix -> code)
 */
export function getNextScreenMode(currentMode: ScreenTerminalMode): ScreenTerminalMode {
  switch (currentMode) {
    case 'code':
      return 'build';
    case 'build':
      return 'matrix';
    case 'matrix':
    default:
      return 'code';
  }
}

/**
 * Computes curling volumetric steam vapor coordinates, expansion scale, and soft alpha
 */
export function calculateVaporParticle(
  time: number,
  index: number,
  total: number
): { x: number; y: number; z: number; scale: number; alpha: number } {
  const seed = (index / total) * Math.PI * 2;
  const loopDuration = 3.2; // seconds per particle lifecycle
  const phase = ((time * 0.55 + index * (loopDuration / total)) % loopDuration) / loopDuration; // 0 to 1

  // Height: rises from mug brim (y=0.15) to air ceiling (y=0.52)
  const y = 0.15 + phase * 0.38;

  // Lateral curling swirl (vortex noise)
  const swirlRadius = 0.015 + phase * 0.055;
  const angle = time * 2.2 + seed + phase * 4.5;
  const x = Math.cos(angle) * swirlRadius + Math.sin(time * 1.5 + index) * 0.008;
  const z = Math.sin(angle) * swirlRadius + Math.cos(time * 1.2 + index) * 0.008;

  // Scale: billows outward as vapor disperses
  const scale = 0.02 + phase * 0.06;

  // Alpha: fade in from mug, peak around middle, dissipate into air
  let alpha = 0;
  if (phase < 0.2) {
    alpha = (phase / 0.2) * 0.42;
  } else if (phase < 0.65) {
    alpha = 0.42 * (1 - (phase - 0.2) / 0.45 * 0.3);
  } else {
    alpha = 0.3 * (1 - (phase - 0.65) / 0.35);
  }

  return { x, y, z, scale, alpha: Math.max(0, Math.min(0.45, alpha)) };
}

// -------------------------------------------------------------
// Procedural Perlin Noise & Succulent Botanical Kinetics
// -------------------------------------------------------------

// Standard 256-permutation table for deterministic gradient noise
const PERLIN_P = [
  151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30,
  69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62,
  94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136,
  171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122,
  60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161,
  1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86,
  164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126,
  255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213,
  119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253,
  19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193,
  238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31,
  181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93,
  222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180
];

const PERLIN_PERM = new Uint8Array(512);
for (let i = 0; i < 512; i++) {
  PERLIN_PERM[i] = PERLIN_P[i & 255];
}

function perlinFade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function perlinLerp(a: number, b: number, t: number): number {
  return a + t * (b - a);
}

function perlinGrad2D(hash: number, x: number, y: number): number {
  const h = hash & 3;
  const u = h < 2 ? x : y;
  const v = h < 2 ? y : x;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

/**
 * 2D Perlin Gradient Noise returning a smooth continuous value in [-1, 1]
 */
export function perlin2D(x: number, y: number): number {
  const xi = Math.floor(x) & 255;
  const yi = Math.floor(y) & 255;
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);

  const u = perlinFade(xf);
  const v = perlinFade(yf);

  const aa = PERLIN_PERM[PERLIN_PERM[xi] + yi];
  const ab = PERLIN_PERM[PERLIN_PERM[xi] + yi + 1];
  const ba = PERLIN_PERM[PERLIN_PERM[xi + 1] + yi];
  const bb = PERLIN_PERM[PERLIN_PERM[xi + 1] + yi + 1];

  const x1 = perlinLerp(perlinGrad2D(aa, xf, yf), perlinGrad2D(ba, xf - 1, yf), u);
  const x2 = perlinLerp(perlinGrad2D(ab, xf, yf - 1), perlinGrad2D(bb, xf - 1, yf - 1), u);

  const result = perlinLerp(x1, x2, v);
  return Math.max(-1, Math.min(1, result * 1.4142));
}

export interface SucculentMotion {
  swayX: number;
  swayZ: number;
  breathingScale: number;
  jiggleAngle: number;
}

/**
 * Calculate organic swaying, Perlin breathing, and jiggle dynamics for the potted succulent
 */
export function calculateSucculentMotion(
  time: number,
  jiggleImpulse: number = 0
): SucculentMotion {
  // Gentle breeze swaying using multi-frequency Perlin noise
  const swayX = perlin2D(time * 0.35, 1.2) * 0.035 + Math.sin(time * 0.5) * 0.008;
  const swayZ = perlin2D(3.7, time * 0.3) * 0.028 + Math.cos(time * 0.42) * 0.006;

  // Gentle rhythmic breathing cycle: subtle volumetric expansion & contraction
  const primaryRespiration = Math.sin(time * 0.85) * 0.018;
  const organicVariation = perlin2D(time * 0.45, 8.4) * 0.012;
  const breathingScale = 1.0 + primaryRespiration + organicVariation;

  // Damped spring oscillation when nudged or clicked
  const jiggleAngle = jiggleImpulse * Math.sin(time * 16.0);

  return {
    swayX,
    swayZ,
    breathingScale,
    jiggleAngle
  };
}

/**
 * Calculate independent micro-flex dynamics for individual succulent leaf tiers
 */
export function calculateLeafFlex(
  time: number,
  leafIndex: number,
  tier: number
): { pitch: number; roll: number; scale: number } {
  const tierWeight = 0.5 + tier * 0.25; // outer leaves flex slightly more than center rosette
  const phase = leafIndex * 0.65;
  const pitch = perlin2D(time * 0.4 + phase, tier * 1.5) * 0.03 * tierWeight;
  const roll = perlin2D(tier * 2.1, time * 0.35 + phase) * 0.025 * tierWeight;
  const scale = 1.0 + (Math.sin(time * 0.85 + phase * 0.2) * 0.015 + perlin2D(time * 0.5 + phase, 4.0) * 0.01) * tierWeight;

  return { pitch, roll, scale };
}

/**
 * Validate whether a string is a recognized interactive 3D object type
 */
export function isInteractiveObjectType(type: unknown): type is InteractiveObjectType {
  return typeof type === 'string' && ['screen', 'keyboard', 'coffee', 'succulent', 'project', 'sticky-note'].includes(type);
}

/**
 * Returns visual layout, colors, HUD brackets, and metadata tag for 3D cursor states
 */
export function getCursorVisualConfig(
  target?: InteractiveHoverTarget | null
): CursorVisualConfig {
  if (!target || !target.type) {
    return {
      shape: 'default',
      color: '#94a3b8',
      glowColor: 'rgba(148, 163, 184, 0.45)',
      accentBg: 'rgba(148, 163, 184, 0.12)',
      size: 28,
      label: '',
      actionHint: '',
      hudStyle: 'minimal'
    };
  }

  switch (target.type) {
    case 'screen':
      return {
        shape: 'screen',
        color: '#38bdf8',
        glowColor: 'rgba(56, 189, 248, 0.75)',
        accentBg: 'rgba(56, 189, 248, 0.18)',
        size: 52,
        label: target.label || 'TERMINAL DISPLAY',
        actionHint: target.actionHint || 'CLICK TO CYCLE CODE // BUILD // MATRIX',
        hudStyle: 'brackets'
      };

    case 'keyboard':
      return {
        shape: 'keyboard',
        color: '#f59e0b',
        glowColor: 'rgba(245, 158, 11, 0.75)',
        accentBg: 'rgba(245, 158, 11, 0.18)',
        size: 48,
        label: target.label || 'MECHANICAL KEYBOARD',
        actionHint: target.actionHint || 'TYPE ANY KEY // RGB AUDIO WAVE',
        hudStyle: 'hex'
      };

    case 'coffee':
      return {
        shape: 'coffee',
        color: '#fb923c',
        glowColor: 'rgba(251, 146, 60, 0.75)',
        accentBg: 'rgba(251, 146, 60, 0.18)',
        size: 46,
        label: target.label || 'ARTISAN COFFEE MUG',
        actionHint: target.actionHint || 'CLICK TO PUFF STEAM',
        hudStyle: 'organic'
      };

    case 'succulent':
      return {
        shape: 'succulent',
        color: '#10b981',
        glowColor: 'rgba(16, 185, 129, 0.75)',
        accentBg: 'rgba(16, 185, 129, 0.18)',
        size: 48,
        label: target.label || 'ECHEVERIA SUCCULENT',
        actionHint: target.actionHint || 'CLICK OR TAP N TO JIGGLE',
        hudStyle: 'organic'
      };

    case 'project':
      return {
        shape: 'project',
        color: '#c084fc',
        glowColor: 'rgba(192, 132, 252, 0.8)',
        accentBg: 'rgba(192, 132, 252, 0.2)',
        size: 54,
        label: target.title || target.label || 'PROJECT BEACON',
        actionHint: target.actionHint || 'CLICK TO EXPLORE ARCHITECTURE',
        hudStyle: 'crosshair'
      };

    case 'sticky-note':
      return {
        shape: 'sticky-note',
        color: '#facc15',
        glowColor: 'rgba(250, 204, 21, 0.8)',
        accentBg: 'rgba(250, 204, 21, 0.2)',
        size: 50,
        label: target.title || target.label || 'DESK NOTE',
        actionHint: target.actionHint || 'CLICK TO INSPECT NOTE // SCRATCHPAD',
        hudStyle: 'pinned'
      };

    default:
      return {
        shape: 'default',
        color: '#94a3b8',
        glowColor: 'rgba(148, 163, 184, 0.45)',
        accentBg: 'rgba(148, 163, 184, 0.12)',
        size: 28,
        label: '',
        actionHint: '',
        hudStyle: 'minimal'
      };
  }
}

/**
 * Calculates smoothed cursor position using an exponential interpolation factor
 */
export function calculateCursorLerp(
  current: { x: number; y: number },
  target: { x: number; y: number },
  factor: number
): { x: number; y: number } {
  const f = Math.max(0, Math.min(1, factor));
  return {
    x: Math.round((current.x + (target.x - current.x) * f) * 100) / 100,
    y: Math.round((current.y + (target.y - current.y) * f) * 100) / 100
  };
}

/**
 * Calculates temporary glow pulse expansion and fade parameters for hover and click impulses
 */
export function calculateGlowPulse(
  elapsedMs: number,
  durationMs: number = 450
): { scale: number; opacity: number; active: boolean } {
  if (elapsedMs < 0 || elapsedMs >= durationMs || durationMs <= 0) {
    return { scale: 1, opacity: 0, active: false };
  }

  const p = elapsedMs / durationMs;
  // Ease-out expansion: starts fast, slows down
  const scale = 1.0 + Math.sin((p * Math.PI) / 2) * 1.5;
  // Smooth bell/fade curve: brief flash then elegant decay
  const opacity = Math.max(0, (1 - p) * 0.95);

  return {
    scale: Math.round(scale * 1000) / 1000,
    opacity: Math.round(opacity * 1000) / 1000,
    active: true
  };
}

export interface CursorParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  progress: number;
}

/**
 * Generates temporary radial micro-sparks for tactile click/hover impacts
 */
export function generateCursorParticles(
  originX: number,
  originY: number,
  color: string,
  count: number = 6,
  speed: number = 2.4
): CursorParticle[] {
  const particles: CursorParticle[] = [];
  const countClamped = Math.max(1, Math.min(24, count));

  for (let i = 0; i < countClamped; i++) {
    const angle = (i / countClamped) * Math.PI * 2 + (i % 2 === 0 ? 0.15 : -0.15);
    const particleSpeed = speed * (0.7 + (i % 4) * 0.2);
    particles.push({
      id: i,
      x: originX,
      y: originY,
      vx: Math.round(Math.cos(angle) * particleSpeed * 100) / 100,
      vy: Math.round(Math.sin(angle) * particleSpeed * 100) / 100,
      size: 2.5 + (i % 3) * 1.0,
      color,
      progress: 0
    });
  }

  return particles;
}

/**
 * Retrieve a sticky note by ID
 */
export function getStickyNoteById(notes: StickyNote[], id: string): StickyNote | undefined {
  return notes.find((n) => n.id === id);
}

/**
 * Filter sticky notes by category
 */
export function filterStickyNotesByCategory(
  notes: StickyNote[],
  category: string
): StickyNote[] {
  if (!category || category === 'all') return notes;
  return notes.filter((n) => n.category === category);
}

/**
 * Generate a new custom user sticky note for the scratchpad
 */
export function createCustomStickyNote(
  title: string,
  content: string,
  category: StickyNote['category'] = 'dev-notes',
  color: string = '#fef08a'
): StickyNote {
  const cleanTitle = title.trim() || 'Quick Dev Note';
  const cleanContent = content.trim() || 'No content provided.';
  const colorMap: Record<string, number> = {
    '#fef08a': 0xfef08a,
    '#bae6fd': 0xbae6fd,
    '#fed7aa': 0xfed7aa,
    '#bbf7d0': 0xbbf7d0,
    '#fbcfe8': 0xfbcfe8
  };

  return {
    id: `custom-note-${Date.now()}`,
    title: cleanTitle,
    category,
    color,
    paperHex: colorMap[color] || 0xfef08a,
    pinColor: '#f43f5e',
    rotation: (Math.random() - 0.5) * 0.12,
    position: [0.0, 1.002, 0.15],
    date: 'NOW',
    badge: 'SCRATCHPAD',
    content: cleanContent,
    action: {
      label: 'Copy Note',
      type: 'copy',
      payload: `${cleanTitle}: ${cleanContent}`
    }
  };
}

export const MOBILE_BREAKPOINT_PX = 768;

/**
 * Returns true when viewport width is in the mobile range (< 768px)
 */
export function isMobileViewport(width: number): boolean {
  if (!Number.isFinite(width) || width <= 0) return false;
  return width < MOBILE_BREAKPOINT_PX;
}

/**
 * Returns default visibility for the bottom ControlDock and FPS overlay
 * based on viewport width: both are hidden/collapsed on mobile (< 768px)
 * and shown on tablet/desktop (>= 768px).
 */
export function getInitialOverlayVisibility(viewportWidth: number): {
  isDockCollapsed: boolean;
  isFpsOpen: boolean;
} {
  const mobile = isMobileViewport(viewportWidth);
  return {
    isDockCollapsed: mobile,
    isFpsOpen: !mobile
  };
}

