import { test, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  isInteractiveObjectType,
  getCursorVisualConfig,
  calculateCursorLerp,
  calculateGlowPulse,
  generateCursorParticles,
  getNextScreenMode,
  getMoodThemeStyles,
  filterProjects,
  validateContactForm,
  calculateSkillStats,
  getStickyNoteById,
  filterStickyNotesByCategory,
  createCustomStickyNote,
  getViewpointCameraTarget,
  isMobileViewport,
  getInitialOverlayVisibility
} from '../src/utils/portfolioLogic.ts';
import { PERSONAL_INFO, PROJECTS_DATA } from '../src/data/portfolioData.ts';
import { Project, SkillCategory, StickyNote } from '../src/types/portfolio.ts';

describe('portfolioLogic - Custom 3D Cursor & Interactive Target Tests', () => {
  it('validates interactive object types correctly', () => {
    assert.equal(isInteractiveObjectType('screen'), true);
    assert.equal(isInteractiveObjectType('keyboard'), true);
    assert.equal(isInteractiveObjectType('coffee'), true);
    assert.equal(isInteractiveObjectType('succulent'), true);
    assert.equal(isInteractiveObjectType('project'), true);
    assert.equal(isInteractiveObjectType('sticky-note'), true);
    assert.equal(isInteractiveObjectType('random-string'), false);
    assert.equal(isInteractiveObjectType(null), false);
    assert.equal(isInteractiveObjectType(undefined), false);
  });

  it('returns default visual config when no target is hovered', () => {
    const config = getCursorVisualConfig(null);
    assert.equal(config.shape, 'default');
    assert.equal(config.hudStyle, 'minimal');
    assert.equal(config.size, 28);
    assert.equal(config.color, '#94a3b8');
  });

  it('returns screen bracket config when curved monitor is hovered', () => {
    const config = getCursorVisualConfig({
      type: 'screen',
      label: 'TERMINAL DISPLAY'
    });
    assert.equal(config.shape, 'screen');
    assert.equal(config.hudStyle, 'brackets');
    assert.equal(config.size, 52);
    assert.equal(config.color, '#38bdf8');
    assert.match(config.actionHint, /CYCLE CODE/);
  });

  it('returns mechanical keyboard hex config with switch cues', () => {
    const config = getCursorVisualConfig({
      type: 'keyboard'
    });
    assert.equal(config.shape, 'keyboard');
    assert.equal(config.hudStyle, 'hex');
    assert.equal(config.size, 48);
    assert.equal(config.color, '#f59e0b');
    assert.match(config.actionHint, /RGB/);
  });

  it('returns coffee steam thermal aura config', () => {
    const config = getCursorVisualConfig({
      type: 'coffee'
    });
    assert.equal(config.shape, 'coffee');
    assert.equal(config.hudStyle, 'organic');
    assert.equal(config.size, 46);
    assert.equal(config.color, '#fb923c');
    assert.match(config.actionHint, /STEAM/);
  });

  it('returns echeveria rosette config for cozy succulent', () => {
    const config = getCursorVisualConfig({
      type: 'succulent'
    });
    assert.equal(config.shape, 'succulent');
    assert.equal(config.hudStyle, 'organic');
    assert.equal(config.size, 48);
    assert.equal(config.color, '#10b981');
    assert.match(config.actionHint, /JIGGLE/);
  });

  it('returns holographic project diamond lock config', () => {
    const config = getCursorVisualConfig({
      type: 'project',
      title: 'OmniFlow',
      id: 'omniflow'
    });
    assert.equal(config.shape, 'project');
    assert.equal(config.hudStyle, 'crosshair');
    assert.equal(config.size, 54);
    assert.equal(config.color, '#c084fc');
    assert.equal(config.label, 'OmniFlow');
  });

  it('returns tactile sticky-note pinned config with warm gold glow', () => {
    const config = getCursorVisualConfig({
      type: 'sticky-note',
      title: 'Zero-GC 3D Engine',
      label: 'ARCH NOTE'
    });
    assert.equal(config.shape, 'sticky-note');
    assert.equal(config.hudStyle, 'pinned');
    assert.equal(config.size, 50);
    assert.equal(config.color, '#facc15');
    assert.equal(config.label, 'Zero-GC 3D Engine');
    assert.match(config.actionHint, /INSPECT NOTE/);
  });

  it('computes exponential cursor lerp correctly without NaN', () => {
    const start = { x: 100, y: 100 };
    const target = { x: 200, y: 300 };
    const half = calculateCursorLerp(start, target, 0.5);
    assert.equal(half.x, 150);
    assert.equal(half.y, 200);

    const full = calculateCursorLerp(start, target, 1.0);
    assert.equal(full.x, 200);
    assert.equal(full.y, 300);

    const zero = calculateCursorLerp(start, target, 0);
    assert.equal(zero.x, 100);
    assert.equal(zero.y, 100);
  });

  it('computes glow pulse expansion and decay physics', () => {
    const startPulse = calculateGlowPulse(0, 400);
    assert.equal(startPulse.active, true);
    assert.equal(startPulse.scale, 1.0);
    assert.ok(startPulse.opacity > 0.9);

    const midPulse = calculateGlowPulse(200, 400);
    assert.equal(midPulse.active, true);
    assert.ok(midPulse.scale > 1.0);
    assert.ok(midPulse.opacity < startPulse.opacity);

    const finishedPulse = calculateGlowPulse(450, 400);
    assert.equal(finishedPulse.active, false);
    assert.equal(finishedPulse.opacity, 0);
  });

  it('generates radial tactile cursor spark particles', () => {
    const sparks = generateCursorParticles(300, 400, '#38bdf8', 8, 3.0);
    assert.equal(sparks.length, 8);
    sparks.forEach((p, idx) => {
      assert.equal(p.x, 300);
      assert.equal(p.y, 400);
      assert.equal(p.color, '#38bdf8');
      assert.equal(p.progress, 0);
      assert.ok(p.size >= 2.0);
      assert.ok(typeof p.vx === 'number');
      assert.ok(typeof p.vy === 'number');
    });
  });

  it('cycles terminal screen mode in round-robin sequence', () => {
    assert.equal(getNextScreenMode('code'), 'build');
    assert.equal(getNextScreenMode('build'), 'matrix');
    assert.equal(getNextScreenMode('matrix'), 'code');
  });

  it('provides smooth mood theme styling presets', () => {
    const cyber = getMoodThemeStyles('cyber-neon');
    assert.ok(cyber.accentGlow);
    assert.ok(cyber.radialGradient);

    const retro = getMoodThemeStyles('retro-synthwave');
    assert.ok(retro.accentGlow);
    assert.equal(retro.accentGlow, '#ec4899');
    assert.ok(retro.radialGradient);
  });
});

describe('portfolioLogic - Filtering & Validation Tests', () => {
  const dummyProjects: Project[] = [
    {
      id: 'p1',
      title: 'Realtime Cloud Engine',
      category: 'Full Stack',
      tagline: 'High throughput pipeline',
      description: 'Built with TypeScript and WebSockets',
      fullDetails: 'Full scalable cloud infrastructure',
      architectureHighlights: ['Pub/sub cluster', 'Redis cache'],
      tags: ['TypeScript', 'Node.js', 'Redis'],
      metrics: [{ label: 'Throughput', value: '100k msg/s' }],
      githubUrl: 'https://github.com',
      demoUrl: 'https://live.dev',
      featured: true,
      color: '#38bdf8'
    },
    {
      id: 'p2',
      title: 'WebGL Shader Canvas',
      category: '3D & WebGL',
      tagline: 'Interactive 3D shaders',
      description: 'PBR shading and procedural textures',
      fullDetails: 'Raymarching pipeline with custom post-processing',
      architectureHighlights: ['Custom fragment shaders', 'GLSL uniforms'],
      tags: ['Three.js', 'WebGL', 'GLSL'],
      metrics: [{ label: 'FPS', value: '60 FPS' }],
      githubUrl: 'https://github.com',
      demoUrl: 'https://live.dev',
      featured: false,
      color: '#a855f7'
    }
  ];

  it('filters projects by search term and category correctly', () => {
    const all = filterProjects(dummyProjects, '', 'All');
    assert.equal(all.length, 2);

    const categoryFiltered = filterProjects(dummyProjects, '', '3D & WebGL');
    assert.equal(categoryFiltered.length, 1);
    assert.equal(categoryFiltered[0].id, 'p2');

    const searched = filterProjects(dummyProjects, 'shader', 'All');
    assert.equal(searched.length, 1);
    assert.equal(searched[0].id, 'p2');

    const empty = filterProjects(dummyProjects, 'nonexistent', 'All');
    assert.equal(empty.length, 0);
  });

  it('validates contact form inputs thoroughly', () => {
    const invalid = validateContactForm({
      name: '',
      email: 'notanemail',
      subject: 'hi',
      message: 'short'
    });
    assert.equal(invalid.isValid, false);
    assert.ok(invalid.errors.name);
    assert.ok(invalid.errors.email);
    assert.ok(invalid.errors.subject);
    assert.ok(invalid.errors.message);

    const valid = validateContactForm({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      subject: 'Collaboration opportunity',
      message: 'Hello, I loved your 3D interactive portfolio and would love to connect!'
    });
    assert.equal(valid.isValid, true);
    assert.equal(Object.keys(valid.errors).length, 0);
  });
});

describe('portfolioLogic - Desk Sticky Notes & Scratchpad Logic Tests', () => {
  const dummyNotes: StickyNote[] = [
    {
      id: 'n1',
      title: 'Zero-GC Loop',
      category: 'architecture',
      color: '#fef08a',
      paperHex: 0xfef08a,
      pinColor: '#ef4444',
      rotation: 0.05,
      position: [-0.6, 1.0, 0.1],
      content: 'Pre-allocate vectors outside loop.',
      date: 'OCT 2026',
      badge: 'ARCH'
    },
    {
      id: 'n2',
      title: 'WebGPU Pipeline',
      category: 'dev-notes',
      color: '#bae6fd',
      paperHex: 0xbae6fd,
      pinColor: '#3b82f6',
      rotation: -0.04,
      position: [-0.3, 1.0, 0.05],
      content: 'Experiment with WGSL shaders.',
      date: 'SPRINT',
      badge: 'TODO'
    }
  ];

  it('retrieves sticky notes by ID correctly', () => {
    const note = getStickyNoteById(dummyNotes, 'n1');
    assert.ok(note);
    assert.equal(note?.title, 'Zero-GC Loop');

    const missing = getStickyNoteById(dummyNotes, 'non-existent');
    assert.equal(missing, undefined);
  });

  it('filters sticky notes by category', () => {
    const archNotes = filterStickyNotesByCategory(dummyNotes, 'architecture');
    assert.equal(archNotes.length, 1);
    assert.equal(archNotes[0].id, 'n1');

    const allNotes = filterStickyNotesByCategory(dummyNotes, 'all');
    assert.equal(allNotes.length, 2);
  });

  it('creates custom sticky notes for scratchpad correctly', () => {
    const custom = createCustomStickyNote(
      'Feedback Note',
      'Love the 3D portfolio!',
      'dev-notes',
      '#fed7aa'
    );
    assert.ok(custom.id.startsWith('custom-note-'));
    assert.equal(custom.title, 'Feedback Note');
    assert.equal(custom.content, 'Love the 3D portfolio!');
    assert.equal(custom.category, 'dev-notes');
    assert.equal(custom.color, '#fed7aa');
    assert.equal(custom.paperHex, 0xfed7aa);
    assert.equal(custom.badge, 'SCRATCHPAD');
    assert.ok(custom.action);
  });

  it('returns close-up desk camera target for notes viewpoint', () => {
    const target = getViewpointCameraTarget('notes');
    assert.ok(target);
    assert.equal(target.position[0], 0.0);
    assert.ok(target.position[1] > 1.0); // elevated slightly above desk
    assert.ok(target.fov > 0);
  });
});

describe('portfolioLogic - Responsive Mobile Defaults & GitHub Links', () => {
  it('detects mobile viewports (<768px) accurately', () => {
    assert.equal(isMobileViewport(390), true);
    assert.equal(isMobileViewport(640), true);
    assert.equal(isMobileViewport(767), true);
    assert.equal(isMobileViewport(768), false);
    assert.equal(isMobileViewport(1024), false);
    assert.equal(isMobileViewport(1440), false);
  });

  it('hides dock and FPS overlay on mobile viewports while showing both on desktop', () => {
    const mobile = getInitialOverlayVisibility(390);
    assert.equal(mobile.isDockCollapsed, true);
    assert.equal(mobile.isFpsOpen, false);

    const desktop = getInitialOverlayVisibility(1440);
    assert.equal(desktop.isDockCollapsed, false);
    assert.equal(desktop.isFpsOpen, true);
  });

  it('uses sanonahmed for all GitHub portfolio links', () => {
    assert.equal(PERSONAL_INFO.github, 'https://github.com/sanonahmed');
    for (const project of PROJECTS_DATA) {
      assert.ok(project.githubUrl);
      assert.match(project.githubUrl, /^https:\/\/github\.com\/sanonahmed\//);
      assert.ok(project.demoUrl);
      assert.match(project.demoUrl, /^https:\/\/github\.com\/sanonahmed\//);
    }
  });
});

