import * as THREE from 'three';
import { ScreenTerminalMode } from '../types/portfolio';
import { getNextScreenMode } from '../utils/portfolioLogic';

/**
 * Procedural texture generators using HTML5 2D Canvas
 * 100% code-driven with zero 404 dependencies.
 */

/**
 * Creates live code editor screen texture
 */
export interface LiveScreenController {
  texture: THREE.CanvasTexture;
  update: (time: number) => void;
  setMode: (mode: ScreenTerminalMode) => void;
  getMode: () => ScreenTerminalMode;
  cycleMode: () => ScreenTerminalMode;
}

/**
 * Creates live multi-mode workstation screen texture
 * Modes: 'code' (IDE), 'build' (Docker CI/CD), 'matrix' (Digital Rain)
 */
export function createLiveCodeTexture(renderer?: THREE.WebGLRenderer): LiveScreenController {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  if (renderer) {
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  }

  let currentMode: ScreenTerminalMode = 'code';
  let lastDrawTime = 0;

  // Code editor lines
  const codeLines = [
    { text: '// Sawon Ahmed — Full Stack & 3D Web Architect', color: '#64748b' },
    { text: 'import { CloudCluster, ThreeEngine, DistributedMesh } from "@sawon/core";', color: '#c084fc' },
    { text: '', color: '#94a3b8' },
    { text: 'export async function bootstrapPlatform(config: DeploymentConfig) {', color: '#38bdf8' },
    { text: '  const cluster = await CloudCluster.init({ region: "global-edge" });', color: '#93c5fd' },
    { text: '  const engine = new ThreeEngine({ pbr: true, antialias: true, bloom: 1.25 });', color: '#34d399' },
    { text: '  const telemetry = cluster.streamMetrics({ p99_latency: "<50ms", fps: 60 });', color: '#fbbf24' },
    { text: '', color: '#94a3b8' },
    { text: '  console.log(`[SYS] Cluster status: 120 nodes operational at 60 FPS`);', color: '#f43f5e' },
    { text: '  return { cluster, engine, telemetry, status: "READY" };', color: '#38bdf8' },
    { text: '}', color: '#38bdf8' },
    { text: '', color: '#94a3b8' },
    { text: 'const sawon = new FullStackDeveloper({ experience: "6+ yrs", passion: "3D Web" });', color: '#34d399' },
    { text: 'await sawon.buildExtraordinaryProducts();', color: '#c084fc' }
  ];

  // Matrix digital rain state
  const matrixChars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF<>/=*{}+-@#$%&';
  const columnCount = 44;
  const columnWidth = canvas.width / columnCount;
  const drops: number[] = new Array(columnCount).fill(0).map(() => Math.floor(Math.random() * -30));
  const speeds: number[] = new Array(columnCount).fill(1).map(() => 0.8 + Math.random() * 1.4);

  // CI/CD Build script lines
  const buildSteps = [
    { label: '[STEP 1/6] ⚙️  Compiling TypeScript 5.8 AST & PBR shaders', status: 'OK', color: '#38bdf8' },
    { label: '[STEP 2/6] 📦 Bundling 12-piece standing desk rig & materials', status: 'OK', color: '#93c5fd' },
    { label: '[STEP 3/6] 🚀 Initializing UnrealBloomPass & FogExp2 pipeline', status: 'OK', color: '#34d399' },
    { label: '[STEP 4/6] 🔒 Running distributed security test suite: 18/18', status: 'PASSED', color: '#a78bfa' },
    { label: '[STEP 5/6] 🐳 Deploying Docker edge container (12,500 TPS)', status: 'OK', color: '#fbbf24' },
    { label: '[STEP 6/6] ✨ Production deployment ACTIVE • Zero latency', status: 'READY', color: '#10b981' }
  ];

  function drawCodeMode(time: number) {
    ctx.fillStyle = '#0b0f19';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Editor top tab bar
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, 42);

    // Window control buttons
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(20, 21, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(38, 21, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(56, 21, 6, 0, Math.PI * 2);
    ctx.fill();

    // Tab title
    ctx.font = 'bold 15px "Fira Code", monospace';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText('sawon-workstation.ts', 85, 26);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '12px "Fira Code", monospace';
    ctx.fillText('TypeScript 5.8 • [CLICK SCREEN TO SWITCH MODE]', canvas.width - 340, 26);

    // Code area
    const startY = 75;
    const lineHeight = 28;

    codeLines.forEach((line, index) => {
      const y = startY + index * lineHeight;
      if (y > canvas.height - 40) return;

      // Line number
      ctx.font = '14px "Fira Code", monospace';
      ctx.fillStyle = '#475569';
      ctx.fillText(String(index + 1).padStart(2, ' '), 24, y);

      // Code text
      ctx.fillStyle = line.color;
      ctx.fillText(line.text, 65, y);
    });

    // Blinking cursor
    if (Math.floor(time * 2) % 2 === 0) {
      const cursorY = startY + (codeLines.length - 1) * lineHeight;
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(445, cursorY - 14, 8, 18);
    }

    // Terminal footer status bar
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px "Fira Code", monospace';
    ctx.fillText('⚡ MODE: IDE • 0 ERRORS • DOCKER: HEALTHY • 60 FPS • CLICK TO SWITCH', 15, canvas.height - 10);
  }

  function drawBuildMode(time: number) {
    ctx.fillStyle = '#05070c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Terminal top bar
    ctx.fillStyle = '#0d131f';
    ctx.fillRect(0, 0, canvas.width, 42);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 14px "Fira Code", monospace';
    ctx.fillText('sawon@edge-cluster: ~/production-pipeline (docker-compose up -d)', 20, 26);

    ctx.fillStyle = '#64748b';
    ctx.font = '12px "Fira Code", monospace';
    ctx.fillText('[CLICK SCREEN TO SWITCH MODE]', canvas.width - 240, 26);

    // Streaming logs
    const startY = 75;
    const lineHeight = 32;

    buildSteps.forEach((step, idx) => {
      const y = startY + idx * lineHeight;
      ctx.font = '14px "Fira Code", monospace';
      ctx.fillStyle = step.color;
      ctx.fillText(step.label, 30, y);

      // Status pill badge
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 13px "Fira Code", monospace';
      ctx.fillText(`[${step.status}]`, canvas.width - 160, y);
    });

    // Live container deployment metric
    const pulseProgress = Math.min(100, Math.floor(((time * 18) % 100) + 1));
    const barWidth = 450;
    const filledWidth = (barWidth * pulseProgress) / 100;

    const barY = 320;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(30, barY, barWidth, 18);

    ctx.fillStyle = '#10b981';
    ctx.fillRect(30, barY, filledWidth, 18);

    ctx.font = 'bold 13px "Fira Code", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`CONTAINER DEPLOYMENT PROGRESS: ${pulseProgress}%`, 30, barY - 10);

    // Live terminal output stream
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px "Fira Code", monospace';
    ctx.fillText(`> docker swarm deploy --compose-file docker-compose.prod.yml`, 30, 375);
    ctx.fillText(`> [cluster-edge-01] Health check OK • TLS 1.3 cert renewed • HTTP/3 QUIC active`, 30, 400);
    ctx.fillText(`> P99 Latency: 18.4ms • Memory: 342MB / 16GB • CPU Load: 12.4%`, 30, 425);

    // Terminal footer status bar
    ctx.fillStyle = '#065f46';
    ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 13px "Fira Code", monospace';
    ctx.fillText('🚀 MODE: CI/CD BUILD TERMINAL • 12,500 TPS • 100% HEALTHY • CLICK TO SWITCH', 15, canvas.height - 10);
  }

  function drawMatrixMode(time: number) {
    // Semi-transparent fade background for trailing luminescent glow
    ctx.fillStyle = 'rgba(2, 8, 4, 0.28)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Top subtle status
    ctx.fillStyle = 'rgba(0, 20, 10, 0.85)';
    ctx.fillRect(0, 0, canvas.width, 36);
    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 13px "Fira Code", monospace';
    ctx.fillText('MATRIX DIGITAL RAIN PROTOCOL • NEURAL LINK ACTIVE • CLICK SCREEN TO SWITCH', 20, 23);

    ctx.font = '18px monospace';

    for (let i = 0; i < drops.length; i++) {
      const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
      const x = i * columnWidth + 2;
      const y = drops[i] * 22;

      if (y > 40 && y < canvas.height - 30) {
        // Leading head character: bright white with green aura
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#4ade80';
        ctx.shadowBlur = 10;
        ctx.fillText(char, x, y);

        // Second character: bright green
        ctx.fillStyle = '#4ade80';
        ctx.shadowBlur = 5;
        const trailChar = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        ctx.fillText(trailChar, x, y - 22);

        // Reset shadow
        ctx.shadowBlur = 0;
      }

      drops[i] += speeds[i];

      // Reset to top when off screen with random stagger
      if (drops[i] * 22 > canvas.height - 30 && Math.random() > 0.96) {
        drops[i] = -2;
      }
    }

    // Terminal footer status bar
    ctx.fillStyle = '#052e16';
    ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 13px "Fira Code", monospace';
    ctx.fillText('🟢 MODE: MATRIX DIGITAL RAIN • INFILTRATION COMPLETE • CLICK TO SWITCH', 15, canvas.height - 10);
  }

  function draw(time: number) {
    if (currentMode === 'code') {
      drawCodeMode(time);
    } else if (currentMode === 'build') {
      drawBuildMode(time);
    } else {
      drawMatrixMode(time);
    }
    texture.needsUpdate = true;
  }

  draw(0);

  return {
    texture,
    update: (time: number) => {
      // For code mode, throttle redraw to cursor blink (~250ms)
      // For build mode, redraw ~100ms for smooth progress bar
      // For matrix mode, redraw ~40ms (25 FPS) for smooth falling rain
      const throttleInterval = currentMode === 'matrix' ? 0.04 : currentMode === 'build' ? 0.1 : 0.25;
      if (time - lastDrawTime >= throttleInterval) {
        lastDrawTime = time;
        draw(time);
      }
    },
    setMode: (mode: ScreenTerminalMode) => {
      currentMode = mode;
      draw(lastDrawTime);
    },
    getMode: () => currentMode,
    cycleMode: () => {
      currentMode = getNextScreenMode(currentMode);
      draw(lastDrawTime);
      return currentMode;
    }
  };
}

/**
 * Creates vertical secondary display texture (telemetry & terminal)
 */
export function createVerticalTerminalTexture(renderer?: THREE.WebGLRenderer): {
  texture: THREE.CanvasTexture;
  update: (time: number) => void;
} {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  if (renderer) {
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  }

  let lastUpdate = 0;

  function draw(time: number) {
    ctx.fillStyle = '#060911';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Header
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, 48);
    ctx.font = 'bold 16px "Fira Code", monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('SYSTEM TELEMETRY // PODS', 20, 30);

    // CPU / Memory Graphs
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(20, 70, canvas.width - 40, 110);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px "Fira Code", monospace';
    ctx.fillText('CPU LOAD: 28% • RAM: 4.8 / 32 GB', 32, 92);

    // Waveform graph
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 32; x < canvas.width - 32; x += 6) {
      const val = Math.sin((x + time * 60) * 0.05) * 20 + Math.cos((x - time * 40) * 0.08) * 15;
      const y = 145 + val;
      if (x === 32) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Services list
    const services = [
      { name: 'api-gateway', port: ':8080', status: '200 OK', color: '#10b981' },
      { name: 'auth-service', port: ':8081', status: 'HEALTHY', color: '#10b981' },
      { name: 'websocket-hub', port: ':8090', status: '4.2k CONN', color: '#38bdf8' },
      { name: 'redis-cluster', port: ':6379', status: 'ACTIVE', color: '#10b981' },
      { name: 'postgres-db', port: ':5432', status: 'SYNCED', color: '#10b981' },
      { name: 'k8s-ingress', port: ':443', status: 'NOMINAL', color: '#10b981' }
    ];

    ctx.font = 'bold 14px "Fira Code", monospace';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText('DEPLOYED MICROSERVICES', 20, 220);

    services.forEach((s, idx) => {
      const y = 250 + idx * 36;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(20, y - 18, canvas.width - 40, 30);

      ctx.fillStyle = '#f8fafc';
      ctx.font = '13px "Fira Code", monospace';
      ctx.fillText(s.name, 32, y + 2);

      ctx.fillStyle = '#64748b';
      ctx.fillText(s.port, 190, y + 2);

      ctx.fillStyle = s.color;
      ctx.fillText(s.status, canvas.width - 130, y + 2);
    });

    // Recent Git Commits Stream
    ctx.font = 'bold 14px "Fira Code", monospace';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText('RECENT COMMITS (sanonahmed)', 20, 500);

    const commits = [
      { hash: '7f9c21a', msg: 'feat: optimize 3D shader uniforms', time: '14m ago' },
      { hash: '3e41b90', msg: 'refactor: decouple gRPC stream pipeline', time: '2h ago' },
      { hash: 'a12b489', msg: 'perf: reduce Redis memory footprint', time: '5h ago' },
      { hash: 'b83c110', msg: 'test: achieve 98% test coverage', time: '1d ago' },
      { hash: 'd92a014', msg: 'feat: add Web Audio spatial clicks', time: '2d ago' }
    ];

    commits.forEach((c, idx) => {
      const y = 530 + idx * 46;
      ctx.fillStyle = '#38bdf8';
      ctx.font = '12px "Fira Code", monospace';
      ctx.fillText(c.hash, 24, y);

      ctx.fillStyle = '#94a3b8';
      ctx.fillText(c.time, canvas.width - 90, y);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '12px "Inter", sans-serif';
      ctx.fillText(c.msg, 24, y + 18);
    });

    // Terminal Live Log Stream at bottom
    ctx.fillStyle = '#020617';
    ctx.fillRect(20, 780, canvas.width - 40, 220);
    ctx.fillStyle = '#22c55e';
    ctx.font = '11px "Fira Code", monospace';
    ctx.fillText('$ kubectl get pods -A --watch', 32, 805);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('sawon-prod-app-6d8b9   1/1   Running   0   42h', 32, 830);
    ctx.fillText('sawon-cache-redis-0     1/1   Running   0   7d', 32, 855);
    ctx.fillText('sawon-engine-three-2    1/1   Running   0   12h', 32, 880);
    ctx.fillText('[INFO] 0 errors, all systems running optimum', 32, 915);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('Ready for new deployments...', 32, 945);

    texture.needsUpdate = true;
  }

  draw(0);

  return {
    texture,
    update: (time: number) => {
      if (Math.abs(time - lastUpdate) > 0.08) {
        lastUpdate = time;
        draw(time);
      }
    }
  };
}

/**
 * Creates soft radial contact shadow texture for grounding the desk and props
 */
export function createRadialContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
  gradient.addColorStop(0.35, 'rgba(0, 0, 0, 0.55)');
  gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.2)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/**
 * Creates subtle procedural carbon fiber weave texture
 */
export function createCarbonFiberTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#15171d';
  ctx.fillRect(0, 0, 64, 64);

  ctx.fillStyle = '#1d212a';
  for (let i = 0; i < 64; i += 8) {
    for (let j = 0; j < 64; j += 8) {
      if ((i + j) % 16 === 0) {
        ctx.fillRect(i, j, 8, 8);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 16);
  return texture;
}
