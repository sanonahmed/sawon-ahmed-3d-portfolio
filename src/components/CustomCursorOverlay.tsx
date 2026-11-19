import React, { useEffect, useState, useRef, useCallback } from 'react';
import { InteractiveHoverTarget, CursorVisualConfig } from '../types/portfolio';
import {
  getCursorVisualConfig,
  calculateCursorLerp,
  calculateGlowPulse,
  generateCursorParticles,
  CursorParticle
} from '../utils/portfolioLogic';

interface CustomCursorOverlayProps {
  hoveredTarget: InteractiveHoverTarget | null;
  clickEffectTrigger?: { x: number; y: number; time: number } | null;
  isModalOpen?: boolean;
}

export const CustomCursorOverlay: React.FC<CustomCursorOverlayProps> = ({
  hoveredTarget,
  clickEffectTrigger,
  isModalOpen = false
}) => {
  const initialPos = typeof window !== 'undefined'
    ? { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    : { x: 640, y: 360 };
  // Raw instantaneous pointer coordinates
  const targetPos = useRef(initialPos);
  // Interpolated smooth coordinates
  const [lerpPos, setLerpPos] = useState(initialPos);
  // Dot instantaneous position for ultra-sharp tracking
  const [dotPos, setDotPos] = useState(initialPos);

  const [isVisible, setIsVisible] = useState(true);
  const [isPointerDown, setIsPointerDown] = useState(false);

  // Temporary glow pulse state
  const [pulseStartTime, setPulseStartTime] = useState<number | null>(null);
  const [pulseColor, setPulseColor] = useState<string>('#38bdf8');
  const [pulseOrigin, setPulseOrigin] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [pulseState, setPulseState] = useState<{ scale: number; opacity: number; active: boolean }>({
    scale: 1,
    opacity: 0,
    active: false
  });

  // Spark burst particles
  const [particles, setParticles] = useState<CursorParticle[]>([]);
  const particlesRef = useRef<CursorParticle[]>([]);

  // Visual configuration based on currently hovered 3D scene target
  const visualConfig: CursorVisualConfig = getCursorVisualConfig(hoveredTarget);
  const prevTargetTypeRef = useRef<string | null>(null);

  // Trigger pulse on target enter or switch
  useEffect(() => {
    const currentType = hoveredTarget?.type || null;
    if (currentType && currentType !== prevTargetTypeRef.current) {
      setPulseStartTime(performance.now());
      setPulseColor(visualConfig.color);
      setPulseOrigin({ x: targetPos.current.x, y: targetPos.current.y });
    }
    prevTargetTypeRef.current = currentType;
  }, [hoveredTarget?.type, visualConfig.color]);

  // Trigger pulse & sparks on external click trigger
  useEffect(() => {
    if (clickEffectTrigger && clickEffectTrigger.time > 0) {
      setPulseStartTime(performance.now());
      setPulseColor(visualConfig.color);
      setPulseOrigin({ x: clickEffectTrigger.x, y: clickEffectTrigger.y });

      const newSparks = generateCursorParticles(
        clickEffectTrigger.x,
        clickEffectTrigger.y,
        visualConfig.color,
        8,
        3.2
      );
      particlesRef.current = newSparks;
      setParticles(newSparks);
    }
  }, [clickEffectTrigger, visualConfig.color]);

  // Track window pointer movements
  useEffect(() => {
    const handleMove = (e: MouseEvent | PointerEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      setDotPos({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleDown = (e: MouseEvent | PointerEvent) => {
      setIsPointerDown(true);
      setPulseStartTime(performance.now());
      setPulseColor(visualConfig.color);
      setPulseOrigin({ x: e.clientX, y: e.clientY });

      const newSparks = generateCursorParticles(
        e.clientX,
        e.clientY,
        visualConfig.color,
        8,
        2.8
      );
      particlesRef.current = newSparks;
      setParticles(newSparks);
    };

    const handleUp = () => {
      setIsPointerDown(false);
    };

    const handleLeave = () => {
      setIsVisible(false);
    };

    const handleEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('pointerdown', handleDown, { passive: true });
    window.addEventListener('mousedown', handleDown, { passive: true });
    window.addEventListener('pointerup', handleUp, { passive: true });
    window.addEventListener('mouseup', handleUp, { passive: true });
    document.addEventListener('mouseleave', handleLeave);
    document.addEventListener('mouseenter', handleEnter);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('pointerdown', handleDown);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('mouseup', handleUp);
      document.removeEventListener('mouseleave', handleLeave);
      document.removeEventListener('mouseenter', handleEnter);
    };
  }, [visualConfig.color]);

  // Animation frame loop: lerp outer reticle, update glow pulse and spark particles
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Smooth lerp tracking for outer reticle
      setLerpPos((prev) => calculateCursorLerp(prev, targetPos.current, 0.28));

      // Glow pulse calculation
      if (pulseStartTime !== null) {
        const elapsed = now - pulseStartTime;
        const pulse = calculateGlowPulse(elapsed, 480);
        setPulseState(pulse);
        if (!pulse.active) {
          setPulseStartTime(null);
        }
      }

      // Spark particles physics simulation
      if (particlesRef.current.length > 0) {
        const updated: CursorParticle[] = [];
        for (const p of particlesRef.current) {
          const progress = p.progress + dt * 2.5;
          if (progress < 1) {
            updated.push({
              ...p,
              x: p.x + p.vx * (1 - progress * 0.4),
              y: p.y + p.vy * (1 - progress * 0.4),
              progress
            });
          }
        }
        particlesRef.current = updated;
        setParticles(updated);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [pulseStartTime]);

  const isInteractive = hoveredTarget !== null && !isModalOpen;
  const reticleSize = isInteractive ? visualConfig.size : isPointerDown ? 20 : 28;

  return (
    <div
      data-testid="custom-cursor-overlay"
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none transition-opacity duration-150"
      style={{ opacity: isVisible && dotPos.x >= 0 ? 1 : 0 }}
      aria-hidden="true"
    >
      {/* 1. Temporary Glow Pulse Shockwave */}
      {pulseState.active && (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-current pointer-events-none transition-none"
          style={{
            left: `${pulseOrigin.x}px`,
            top: `${pulseOrigin.y}px`,
            width: `${reticleSize * 1.6}px`,
            height: `${reticleSize * 1.6}px`,
            transform: `translate(-50%, -50%) scale(${pulseState.scale})`,
            opacity: pulseState.opacity,
            color: pulseColor,
            boxShadow: `0 0 16px ${pulseColor}, inset 0 0 12px ${pulseColor}`,
            borderColor: pulseColor
          }}
        />
      )}

      {/* 2. Tactile Micro-Spark Burst Particles */}
      {particles.map((p) => {
        const opacity = Math.max(0, 1 - p.progress);
        const scale = 1 - p.progress * 0.5;
        return (
          <div
            key={p.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{
              left: `${p.x}px`,
              top: `${p.y}px`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              boxShadow: `0 0 6px ${p.color}`,
              opacity,
              transform: `translate(-50%, -50%) scale(${scale})`
            }}
          />
        );
      })}

      {/* 3. Smooth Lerping Morphing Outer Reticle */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-150 ease-out"
        style={{
          left: `${lerpPos.x}px`,
          top: `${lerpPos.y}px`,
          width: `${reticleSize}px`,
          height: `${reticleSize}px`,
          opacity: isModalOpen ? 0.35 : 1
        }}
      >
        {/* Default Minimalist Compass Reticle */}
        {visualConfig.shape === 'default' && (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Outer Subtle Ring */}
            <div
              className="w-full h-full rounded-full border transition-all duration-200"
              style={{
                borderColor: visualConfig.color,
                opacity: isPointerDown ? 0.9 : 0.45,
                transform: isPointerDown ? 'scale(0.85)' : 'scale(1)'
              }}
            />
            {/* Cardinal Tick Marks */}
            <div
              className="absolute -top-1 w-0.5 h-1.5 rounded-full"
              style={{ backgroundColor: visualConfig.color, opacity: 0.6 }}
            />
            <div
              className="absolute -bottom-1 w-0.5 h-1.5 rounded-full"
              style={{ backgroundColor: visualConfig.color, opacity: 0.6 }}
            />
            <div
              className="absolute -left-1 w-1.5 h-0.5 rounded-full"
              style={{ backgroundColor: visualConfig.color, opacity: 0.6 }}
            />
            <div
              className="absolute -right-1 w-1.5 h-0.5 rounded-full"
              style={{ backgroundColor: visualConfig.color, opacity: 0.6 }}
            />
          </div>
        )}

        {/* Screen Terminal: Cyber HUD Corner Brackets */}
        {visualConfig.shape === 'screen' && (
          <div className="relative w-full h-full flex items-center justify-center animate-pulse">
            {/* Corner brackets */}
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 52 52"
              fill="none"
              style={{ filter: `drop-shadow(0 0 6px ${visualConfig.glowColor})` }}
            >
              {/* Top-Left Bracket */}
              <path d="M 4 14 L 4 4 L 14 4" stroke={visualConfig.color} strokeWidth="2.5" strokeLinecap="square" />
              {/* Top-Right Bracket */}
              <path d="M 38 4 L 48 4 L 48 14" stroke={visualConfig.color} strokeWidth="2.5" strokeLinecap="square" />
              {/* Bottom-Left Bracket */}
              <path d="M 4 38 L 4 48 L 14 48" stroke={visualConfig.color} strokeWidth="2.5" strokeLinecap="square" />
              {/* Bottom-Right Bracket */}
              <path d="M 38 48 L 48 48 L 48 38" stroke={visualConfig.color} strokeWidth="2.5" strokeLinecap="square" />
              {/* Central scanline tick */}
              <line x1="20" y1="26" x2="32" y2="26" stroke={visualConfig.color} strokeWidth="1.5" strokeDasharray="2 2" opacity="0.8" />
            </svg>
          </div>
        )}

        {/* Mechanical Keyboard: Hex / Keycap Chamfer Reticle */}
        {visualConfig.shape === 'keyboard' && (
          <div className="relative w-full h-full flex items-center justify-center">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 48 48"
              fill="none"
              style={{ filter: `drop-shadow(0 0 7px ${visualConfig.glowColor})` }}
            >
              {/* Outer Keycap Chamfer Border */}
              <polygon
                points="10,4 38,4 44,10 44,38 38,44 10,44 4,38 4,10"
                stroke={visualConfig.color}
                strokeWidth="2"
                fill={visualConfig.accentBg}
              />
              {/* Inner Key Switch Cross Stem */}
              <line x1="24" y1="18" x2="24" y2="30" stroke={visualConfig.color} strokeWidth="2" strokeLinecap="round" />
              <line x1="18" y1="24" x2="30" y2="24" stroke={visualConfig.color} strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        )}

        {/* Artisan Coffee Mug: Warm Steam Thermal Aura */}
        {visualConfig.shape === 'coffee' && (
          <div className="relative w-full h-full flex items-center justify-center">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 46 46"
              fill="none"
              style={{ filter: `drop-shadow(0 0 6px ${visualConfig.glowColor})` }}
            >
              {/* Circular thermal rim */}
              <circle
                cx="23"
                cy="23"
                r="18"
                stroke={visualConfig.color}
                strokeWidth="2"
                strokeDasharray="6 4"
                fill={visualConfig.accentBg}
              />
              {/* Rising steam waves */}
              <path
                d="M 18 26 Q 21 21 18 16"
                stroke={visualConfig.color}
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.9"
              />
              <path
                d="M 28 26 Q 25 21 28 16"
                stroke={visualConfig.color}
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.9"
              />
            </svg>
          </div>
        )}

        {/* Potted Succulent: Biometric Rosette Reticle */}
        {visualConfig.shape === 'succulent' && (
          <div className="relative w-full h-full flex items-center justify-center">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 48 48"
              fill="none"
              style={{ filter: `drop-shadow(0 0 7px ${visualConfig.glowColor})` }}
            >
              {/* Rosette curved petal arcs */}
              <path d="M 24 6 Q 34 16 24 24" stroke={visualConfig.color} strokeWidth="2" strokeLinecap="round" />
              <path d="M 42 24 Q 32 34 24 24" stroke={visualConfig.color} strokeWidth="2" strokeLinecap="round" />
              <path d="M 24 42 Q 14 32 24 24" stroke={visualConfig.color} strokeWidth="2" strokeLinecap="round" />
              <path d="M 6 24 Q 16 14 24 24" stroke={visualConfig.color} strokeWidth="2" strokeLinecap="round" />
              {/* Central node */}
              <circle cx="24" cy="24" r="3" fill={visualConfig.color} />
            </svg>
          </div>
        )}

        {/* Project Beacon: Futuristic Diamond Target Lock */}
        {visualConfig.shape === 'project' && (
          <div className="relative w-full h-full flex items-center justify-center">
            <svg
              className="w-full h-full overflow-visible animate-[spin_10s_linear_infinite]"
              viewBox="0 0 54 54"
              fill="none"
              style={{ filter: `drop-shadow(0 0 8px ${visualConfig.glowColor})` }}
            >
              {/* Rotated Diamond Frame */}
              <rect
                x="12"
                y="12"
                width="30"
                height="30"
                stroke={visualConfig.color}
                strokeWidth="2"
                fill={visualConfig.accentBg}
                transform="rotate(45 27 27)"
              />
              {/* Outer corner ticks */}
              <line x1="27" y1="2" x2="27" y2="8" stroke={visualConfig.color} strokeWidth="2" />
              <line x1="27" y1="46" x2="27" y2="52" stroke={visualConfig.color} strokeWidth="2" />
              <line x1="2" y1="27" x2="8" y2="27" stroke={visualConfig.color} strokeWidth="2" />
              <line x1="46" y1="27" x2="52" y2="27" stroke={visualConfig.color} strokeWidth="2" />
            </svg>
          </div>
        )}

        {/* Desk Sticky Note: Tactile Paper with Pin & Curled Corner */}
        {visualConfig.shape === 'sticky-note' && (
          <div className="relative w-full h-full flex items-center justify-center">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 50 50"
              fill="none"
              style={{ filter: `drop-shadow(0 0 8px ${visualConfig.glowColor})` }}
            >
              {/* Paper note outline with folded bottom-right corner */}
              <path
                d="M 8 12 L 8 42 L 34 42 L 42 34 L 42 12 Z"
                stroke={visualConfig.color}
                strokeWidth="2"
                fill={visualConfig.accentBg}
              />
              {/* Folded corner triangle */}
              <path
                d="M 34 42 L 34 34 L 42 34"
                stroke={visualConfig.color}
                strokeWidth="1.5"
                fill="rgba(250, 204, 21, 0.35)"
              />
              {/* Top pushpin dot */}
              <circle cx="25" cy="8" r="3.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
              {/* Horizontal note text lines */}
              <line x1="14" y1="18" x2="36" y2="18" stroke={visualConfig.color} strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
              <line x1="14" y1="24" x2="32" y2="24" stroke={visualConfig.color} strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />
              <line x1="14" y1="30" x2="26" y2="30" stroke={visualConfig.color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            </svg>
          </div>
        )}

        {/* Tactical HUD Metadata Badge (monospaced, sci-fi tag) */}
        {isInteractive && visualConfig.label && (
          <div
            className="absolute left-full top-1/2 -translate-y-1/2 ml-3.5 whitespace-nowrap pointer-events-none"
            style={{
              textShadow: `0 0 8px ${visualConfig.glowColor}`
            }}
          >
            <div
              className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider font-semibold uppercase flex items-center gap-1.5 backdrop-blur-md shadow-lg"
              style={{
                backgroundColor: 'rgba(8, 10, 15, 0.88)',
                color: visualConfig.color,
                border: `1px solid ${visualConfig.color}55`
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-ping"
                style={{ backgroundColor: visualConfig.color }}
              />
              <span>{visualConfig.label}</span>
            </div>
            {visualConfig.actionHint && (
              <div className="mt-0.5 px-1 text-[8.5px] font-mono text-neutral-400 tracking-tight">
                {visualConfig.actionHint}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Instantaneous Laser Precision Dot */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-transform duration-75"
        style={{
          left: `${dotPos.x}px`,
          top: `${dotPos.y}px`,
          width: isInteractive ? '4px' : '3px',
          height: isInteractive ? '4px' : '3px',
          backgroundColor: isInteractive ? visualConfig.color : '#f8fafc',
          boxShadow: isInteractive
            ? `0 0 6px ${visualConfig.color}, 0 0 10px ${visualConfig.glowColor}`
            : '0 0 4px rgba(255, 255, 255, 0.8)',
          transform: isPointerDown ? 'scale(1.6)' : 'scale(1)'
        }}
      />
    </div>
  );
};
