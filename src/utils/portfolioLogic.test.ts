import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterProjects,
  validateContactForm,
  calculateSkillStats,
  getViewpointCameraTarget,
  getLoadingStage,
  shouldBypassLoading,
  isValidSoundscape,
  validateChatMessage,
  getFpsStatus,
  formatFrameTime,
  calculateFpsFromDelta,
  formatFpsDisplay,
  clampBloomIntensity,
  formatBloomIntensity,
  getBloomPresetLabel,
  clampFogDensity,
  formatFogDensity,
  getFogStatus,
  isValidMoodPreset,
  getMoodThemeStyles,
  mapCharToKeyboardKey,
  isValidKeyboardSwitch,
  isValidScreenMode,
  getNextScreenMode,
  calculateVaporParticle,
  perlin2D,
  calculateSucculentMotion,
  calculateLeafFlex,
  isInteractiveObjectType,
  getCursorVisualConfig,
  calculateCursorLerp,
  calculateGlowPulse,
  generateCursorParticles
} from './portfolioLogic';
import {
  PROJECTS_DATA,
  SKILL_CATEGORIES,
  SOUNDSCAPE_PRESETS,
  MOOD_PRESETS,
  KEYBOARD_SWITCHES,
  SCREEN_MODES
} from '../data/portfolioData';

test('filterProjects filters correctly by category', () => {
  const cloudProjects = filterProjects(PROJECTS_DATA, '', 'Cloud & Systems');
  assert.ok(cloudProjects.length >= 2, 'Should find at least 2 cloud projects');
  assert.ok(cloudProjects.every(p => p.category === 'Cloud & Systems'));

  const allProjects = filterProjects(PROJECTS_DATA, '', 'All');
  assert.equal(allProjects.length, PROJECTS_DATA.length);
});

test('filterProjects searches correctly by text and tags', () => {
  const threeProjects = filterProjects(PROJECTS_DATA, 'three.js', 'All');
  assert.ok(threeProjects.length > 0, 'Should find Three.js projects');
  assert.equal(threeProjects[0].id, 'apex3d-studio');

  const emptyResults = filterProjects(PROJECTS_DATA, 'nonexistenttermxyz99', 'All');
  assert.equal(emptyResults.length, 0);
});

test('validateContactForm checks required fields and formats', () => {
  const invalid = validateContactForm({
    name: '',
    email: 'bad-email',
    subject: 'hi',
    message: 'short'
  });
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.name, 'Name error expected');
  assert.ok(invalid.errors.email, 'Email error expected');
  assert.ok(invalid.errors.subject, 'Subject error expected');
  assert.ok(invalid.errors.message, 'Message error expected');

  const valid = validateContactForm({
    name: 'Sarah Connor',
    email: 'sarah@skynet.com',
    subject: 'Full Stack 3D Project Inquiry',
    message: 'Hello Sawon, we loved your 3D portfolio and want to discuss a full stack role.'
  });
  assert.equal(valid.isValid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});

test('calculateSkillStats aggregates skills metrics accurately', () => {
  const stats = calculateSkillStats(SKILL_CATEGORIES);
  assert.ok(stats.totalSkills > 15, 'Total skills should be greater than 15');
  assert.ok(stats.averageMastery >= 80 && stats.averageMastery <= 100, 'Average mastery should be in realistic high range');
  assert.ok(stats.topSkillsCount > 5, 'Top skills >= 90% should be populated');
});

test('getViewpointCameraTarget produces valid coordinates for all viewpoints', () => {
  const modes: ('overview' | 'projects' | 'skills' | 'timeline' | 'contact')[] = [
    'overview',
    'projects',
    'skills',
    'timeline',
    'contact'
  ];

  for (const mode of modes) {
    const config = getViewpointCameraTarget(mode);
    assert.equal(config.position.length, 3, `${mode} position must be 3D vector`);
    assert.equal(config.target.length, 3, `${mode} target must be 3D vector`);
    assert.ok(config.fov >= 30 && config.fov <= 60, `${mode} FOV in comfortable range`);
  }
});

test('getLoadingStage produces progressive status labels and codes', () => {
  const stage0 = getLoadingStage(10);
  assert.equal(stage0.percent, 10);
  assert.equal(stage0.code, 'SYS_INIT_GPU_PROBE');

  const stage50 = getLoadingStage(55);
  assert.equal(stage50.code, 'GEO_RIG_ASSEMBLY_PBR');

  const stage100 = getLoadingStage(100);
  assert.equal(stage100.code, 'SYS_CALIBRATED_READY');
  assert.ok(stage100.label.includes('Ready'));
});

test('shouldBypassLoading correctly identifies autostart parameter', () => {
  assert.equal(shouldBypassLoading('?autostart=1'), true);
  assert.equal(shouldBypassLoading('?utm_source=twitter&autostart=1'), true);
  assert.equal(shouldBypassLoading('?skip_loading=1'), true);
  assert.equal(shouldBypassLoading(''), false);
  assert.equal(shouldBypassLoading('?page=projects'), false);
});

test('isValidSoundscape validates known soundscapes accurately', () => {
  assert.equal(isValidSoundscape('cyber-space'), true);
  assert.equal(isValidSoundscape('server-hum'), true);
  assert.equal(isValidSoundscape('tokyo-rain'), true);
  assert.equal(isValidSoundscape('synthwave-breeze'), true);
  assert.equal(isValidSoundscape('off'), true);
  assert.equal(isValidSoundscape('invalid-sound'), false);

  assert.equal(SOUNDSCAPE_PRESETS.length, 5);
});

test('validateChatMessage validates empty and oversized messages', () => {
  assert.equal(validateChatMessage('').isValid, false);
  assert.equal(validateChatMessage('   ').isValid, false);
  assert.equal(validateChatMessage('Hello, can you help with Three.js?').isValid, true);
  assert.equal(validateChatMessage('a'.repeat(2500)).isValid, false);
});

test('getFpsStatus classifies optimal, stable, and low frame rates correctly', () => {
  const opt = getFpsStatus(60);
  assert.equal(opt.status, 'optimal');
  assert.equal(opt.label, 'Optimal');
  assert.ok(opt.color.includes('emerald'));

  const mid = getFpsStatus(45);
  assert.equal(mid.status, 'stable');
  assert.equal(mid.label, 'Stable');
  assert.ok(mid.color.includes('amber'));

  const low = getFpsStatus(22);
  assert.equal(low.status, 'low');
  assert.equal(low.label, 'Low');
  assert.ok(low.color.includes('rose'));
});

test('formatFrameTime and formatFpsDisplay format outputs correctly', () => {
  assert.equal(formatFrameTime(16.666), '16.7 ms');
  assert.equal(formatFrameTime(0), '0.0 ms');
  assert.equal(formatFrameTime(-2), '0.0 ms');

  assert.equal(formatFpsDisplay(59.8), '60 FPS');
  assert.equal(formatFpsDisplay(30), '30 FPS');
  assert.equal(formatFpsDisplay(-5), '0 FPS');

  assert.equal(calculateFpsFromDelta(0.016666), 60);
  assert.equal(calculateFpsFromDelta(0.033333), 30);
  assert.equal(calculateFpsFromDelta(0), 0);
});

test('clampBloomIntensity and formatBloomIntensity format correctly', () => {
  assert.equal(clampBloomIntensity(1.25), 1.25);
  assert.equal(clampBloomIntensity(-0.5), 0);
  assert.equal(clampBloomIntensity(5.0), 2.5);
  assert.equal(clampBloomIntensity(NaN), 1.0);

  assert.equal(formatBloomIntensity(1.25), '1.25x');
  assert.equal(formatBloomIntensity(0), '0.00x');
  assert.equal(formatBloomIntensity(2.2), '2.20x');
});

test('getBloomPresetLabel identifies bloom stages accurately', () => {
  const off = getBloomPresetLabel(0);
  assert.equal(off.label, 'Disabled');

  const subtle = getBloomPresetLabel(0.5);
  assert.equal(subtle.label, 'Subtle');

  const cyber = getBloomPresetLabel(1.25);
  assert.equal(cyber.label, 'Cyber Glow');

  const max = getBloomPresetLabel(2.2);
  assert.equal(max.label, 'Intense Neon');
});

test('clampFogDensity and formatFogDensity format density correctly', () => {
  assert.equal(clampFogDensity(0.055), 0.055);
  assert.equal(clampFogDensity(-0.02), 0.01);
  assert.equal(clampFogDensity(0.5), 0.15);
  assert.equal(clampFogDensity(NaN), 0.055);

  assert.equal(formatFogDensity(0.055), '5.5%');
  assert.equal(formatFogDensity(0.025), '2.5%');
  assert.equal(formatFogDensity(0.095), '9.5%');
});

test('getFogStatus identifies clear space and density atmosphere levels accurately', () => {
  const disabled = getFogStatus(false, 0.055);
  assert.equal(disabled.label, 'Clear Space');
  assert.ok(disabled.description.includes('Zero scene fog'));

  const haze = getFogStatus(true, 0.025);
  assert.equal(haze.label, 'Subtle Haze');

  const cyber = getFogStatus(true, 0.055);
  assert.equal(cyber.label, 'Cyber Atmosphere');

  const deep = getFogStatus(true, 0.095);
  assert.equal(deep.label, 'Deep Cyber Fog');
});

test('isValidMoodPreset recognizes all presets including retro-synthwave', () => {
  assert.equal(isValidMoodPreset('retro-synthwave'), true);
  assert.equal(isValidMoodPreset('cyber-neon'), true);
  assert.equal(isValidMoodPreset('tokyo-dusk'), true);
  assert.equal(isValidMoodPreset('matrix-emerald'), true);
  assert.equal(isValidMoodPreset('clean-studio'), true);
  assert.equal(isValidMoodPreset('unknown-sunset'), false);
});

test('MOOD_PRESETS includes retro-synthwave with correct bloom and fog configuration', () => {
  const synthwave = MOOD_PRESETS.find(p => p.id === 'retro-synthwave');
  assert.ok(synthwave, 'Retro-synthwave preset must exist');
  assert.equal(synthwave.name, 'Retro Synthwave');
  assert.equal(synthwave.fogColor, 0x190533);
  assert.equal(synthwave.bloomIntensity, 1.85);
  assert.equal(synthwave.keyLight, 0xf43f5e);
  assert.equal(synthwave.rimLight, 0x06b6d4);
  assert.equal(synthwave.accentGlow, '#ec4899');
});

test('getMoodThemeStyles returns distinct gradients and accents for all presets', () => {
  const synthwaveStyle = getMoodThemeStyles('retro-synthwave');
  assert.equal(synthwaveStyle.accentGlow, '#ec4899');
  assert.equal(synthwaveStyle.fogHex, '#190533');
  assert.ok(synthwaveStyle.radialGradient.includes('rgba(236, 72, 153'));

  const cyberStyle = getMoodThemeStyles('cyber-neon');
  assert.equal(cyberStyle.accentGlow, '#38bdf8');
  assert.equal(cyberStyle.fogHex, '#08090d');

  const matrixStyle = getMoodThemeStyles('matrix-emerald');
  assert.equal(matrixStyle.accentGlow, '#10b981');
  assert.equal(matrixStyle.fogHex, '#050f0b');
});

test('mapCharToKeyboardKey maps characters accurately to 5x14 key matrix', () => {
  const esc = mapCharToKeyboardKey('escape');
  assert.deepEqual(esc, { row: 0, col: 0, index: 0 });

  const space = mapCharToKeyboardKey(' ');
  assert.deepEqual(space, { row: 4, col: 6, index: 62 });

  const aKey = mapCharToKeyboardKey('a');
  assert.deepEqual(aKey, { row: 2, col: 1, index: 29 });

  const unknown = mapCharToKeyboardKey('§');
  assert.ok(unknown.index >= 0 && unknown.index < 70, 'Fallback hash must stay in bounds');
});

test('keyboard switch and screen mode validators work correctly', () => {
  assert.equal(isValidKeyboardSwitch('blue'), true);
  assert.equal(isValidKeyboardSwitch('brown'), true);
  assert.equal(isValidKeyboardSwitch('red'), true);
  assert.equal(isValidKeyboardSwitch('yellow'), false);

  assert.equal(isValidScreenMode('code'), true);
  assert.equal(isValidScreenMode('build'), true);
  assert.equal(isValidScreenMode('matrix'), true);
  assert.equal(isValidScreenMode('invalid'), false);

  assert.equal(getNextScreenMode('code'), 'build');
  assert.equal(getNextScreenMode('build'), 'matrix');
  assert.equal(getNextScreenMode('matrix'), 'code');

  assert.equal(KEYBOARD_SWITCHES.length, 3);
  assert.equal(SCREEN_MODES.length, 3);
});

test('calculateVaporParticle produces smooth rising coordinates and valid alpha', () => {
  const p0 = calculateVaporParticle(1.0, 0, 50);
  assert.ok(p0.y >= 0.15 && p0.y <= 0.55, 'Particle height must stay within mug-to-air bounds');
  assert.ok(p0.scale >= 0.015 && p0.scale <= 0.1, 'Scale must billow realistically');
  assert.ok(p0.alpha >= 0 && p0.alpha <= 0.45, 'Alpha must stay within transparent fog range');
  assert.ok(Number.isFinite(p0.x) && Number.isFinite(p0.z), 'Coordinates must be valid finite floats');
});

test('perlin2D produces bounded, smooth, continuous gradient noise', () => {
  const v1 = perlin2D(1.5, 2.5);
  const v2 = perlin2D(1.51, 2.5);
  assert.ok(v1 >= -1 && v1 <= 1, 'Noise must be bounded in [-1, 1]');
  assert.ok(v2 >= -1 && v2 <= 1, 'Noise must be bounded in [-1, 1]');
  assert.ok(Math.abs(v2 - v1) < 0.1, 'Noise must be continuous without sharp step discontinuities');

  // Verify multiple coordinate samples are all finite and bounded
  for (let x = 0; x < 5; x += 0.8) {
    for (let y = 0; y < 5; y += 0.8) {
      const val = perlin2D(x, y);
      assert.ok(Number.isFinite(val));
      assert.ok(val >= -1 && val <= 1);
    }
  }
});

test('calculateSucculentMotion computes realistic sway, breathing, and jiggle', () => {
  const motion = calculateSucculentMotion(2.0, 0.05);
  assert.ok(Number.isFinite(motion.swayX) && Math.abs(motion.swayX) < 0.1, 'Sway X must be gentle');
  assert.ok(Number.isFinite(motion.swayZ) && Math.abs(motion.swayZ) < 0.1, 'Sway Z must be gentle');
  assert.ok(motion.breathingScale >= 0.96 && motion.breathingScale <= 1.05, 'Breathing scale must expand and contract smoothly');
  assert.ok(Number.isFinite(motion.jiggleAngle));

  const flex = calculateLeafFlex(1.5, 3, 2);
  assert.ok(Number.isFinite(flex.pitch));
  assert.ok(Number.isFinite(flex.roll));
  assert.ok(flex.scale >= 0.95 && flex.scale <= 1.05);
});

test('isInteractiveObjectType validates known interactive 3D elements', () => {
  assert.equal(isInteractiveObjectType('screen'), true);
  assert.equal(isInteractiveObjectType('keyboard'), true);
  assert.equal(isInteractiveObjectType('coffee'), true);
  assert.equal(isInteractiveObjectType('succulent'), true);
  assert.equal(isInteractiveObjectType('project'), true);
  assert.equal(isInteractiveObjectType('floor'), false);
  assert.equal(isInteractiveObjectType(null), false);
  assert.equal(isInteractiveObjectType(undefined), false);
  assert.equal(isInteractiveObjectType(123), false);
});

test('getCursorVisualConfig provides custom HUD styles, labels, and glows for each target', () => {
  // Default cursor when null or ambient
  const def = getCursorVisualConfig(null);
  assert.equal(def.shape, 'default');
  assert.equal(def.hudStyle, 'minimal');
  assert.equal(def.size, 28);
  assert.ok(def.color.length > 0);

  // Screen terminal
  const screenCfg = getCursorVisualConfig({ type: 'screen' });
  assert.equal(screenCfg.shape, 'screen');
  assert.equal(screenCfg.hudStyle, 'brackets');
  assert.equal(screenCfg.color, '#38bdf8');
  assert.ok(screenCfg.actionHint.includes('TERMINAL') || screenCfg.actionHint.includes('CYCLE'));

  // Mechanical Keyboard
  const kbCfg = getCursorVisualConfig({ type: 'keyboard' });
  assert.equal(kbCfg.shape, 'keyboard');
  assert.equal(kbCfg.hudStyle, 'hex');
  assert.equal(kbCfg.color, '#f59e0b');

  // Potted Succulent
  const succCfg = getCursorVisualConfig({ type: 'succulent' });
  assert.equal(succCfg.shape, 'succulent');
  assert.equal(succCfg.color, '#10b981');
  assert.ok(succCfg.actionHint.includes('JIGGLE') || succCfg.actionHint.includes('N'));

  // Coffee Mug
  const mugCfg = getCursorVisualConfig({ type: 'coffee' });
  assert.equal(mugCfg.shape, 'coffee');
  assert.equal(mugCfg.color, '#fb923c');

  // Project Beacon
  const projCfg = getCursorVisualConfig({ type: 'project', title: 'Apex3D WebGL Studio' });
  assert.equal(projCfg.shape, 'project');
  assert.equal(projCfg.hudStyle, 'crosshair');
  assert.equal(projCfg.label, 'Apex3D WebGL Studio');
});

test('calculateCursorLerp interpolates smoothly towards target', () => {
  const current = { x: 100, y: 100 };
  const target = { x: 200, y: 300 };

  const half = calculateCursorLerp(current, target, 0.5);
  assert.equal(half.x, 150);
  assert.equal(half.y, 200);

  const start = calculateCursorLerp(current, target, 0);
  assert.equal(start.x, 100);
  assert.equal(start.y, 100);

  const end = calculateCursorLerp(current, target, 1);
  assert.equal(end.x, 200);
  assert.equal(end.y, 300);

  // Clamped factor outside [0, 1]
  const overClamped = calculateCursorLerp(current, target, 1.5);
  assert.equal(overClamped.x, 200);
  assert.equal(overClamped.y, 300);
});

test('calculateGlowPulse computes temporary pulse scale and fade curve', () => {
  const duration = 400;

  // Before pulse or expired
  const expired = calculateGlowPulse(500, duration);
  assert.equal(expired.active, false);
  assert.equal(expired.opacity, 0);

  // Inactive negative time
  const neg = calculateGlowPulse(-10, duration);
  assert.equal(neg.active, false);

  // Mid pulse: active, expanded scale, fading opacity
  const start = calculateGlowPulse(0, duration);
  assert.equal(start.active, true);
  assert.equal(start.scale, 1.0);
  assert.ok(start.opacity > 0.9, 'Initial flash opacity should be high');

  const mid = calculateGlowPulse(200, duration);
  assert.equal(mid.active, true);
  assert.ok(mid.scale > 1.5, 'Pulse scale should expand');
  assert.ok(mid.opacity < start.opacity, 'Opacity should fade over time');
});

test('generateCursorParticles outputs bounded, valid particle trajectories', () => {
  const particles = generateCursorParticles(150, 250, '#38bdf8', 8, 3.0);
  assert.equal(particles.length, 8);
  for (const p of particles) {
    assert.equal(p.x, 150);
    assert.equal(p.y, 250);
    assert.ok(Number.isFinite(p.vx));
    assert.ok(Number.isFinite(p.vy));
    assert.equal(p.color, '#38bdf8');
    assert.ok(p.size >= 2.0 && p.size <= 6.0);
  }
});
