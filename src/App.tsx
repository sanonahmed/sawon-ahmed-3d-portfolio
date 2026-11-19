/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ThreeCanvas } from './components/ThreeCanvas';
import { TopNav } from './components/TopNav';
import { ControlDock } from './components/ControlDock';
import { LoadingOverlay } from './components/LoadingOverlay';
import { ProjectModal } from './components/ProjectModal';
import { SkillsModal } from './components/SkillsModal';
import { TimelineModal } from './components/TimelineModal';
import { AboutModal } from './components/AboutModal';
import { ContactModal } from './components/ContactModal';
import { ChatbotModal } from './components/ChatbotModal';
import { FpsMonitorOverlay } from './components/FpsMonitorOverlay';
import { CustomCursorOverlay } from './components/CustomCursorOverlay';
import { StickyNoteModal } from './components/StickyNoteModal';
import {
  ViewpointMode,
  MoodLighting,
  SoundscapeType,
  FpsMetrics,
  KeyboardSwitchType,
  ScreenTerminalMode,
  InteractiveHoverTarget,
  StickyNote
} from './types/portfolio';
import { MOOD_PRESETS } from './data/portfolioData';
import {
  shouldBypassLoading,
  getMoodThemeStyles,
  getNextScreenMode,
  MOBILE_BREAKPOINT_PX,
  isMobileViewport
} from './utils/portfolioLogic';
import { soundManager } from './audio/soundEffects';

export default function App() {
  const isAutostart = typeof window !== 'undefined' && shouldBypassLoading(window.location.search);

  // 3D Scene state
  const [viewpoint, setViewpoint] = useState<ViewpointMode>('overview');
  const [mood, setMood] = useState<MoodLighting>('cyber-neon');
  const [bloomIntensity, setBloomIntensity] = useState<number>(1.25);
  const [fogEnabled, setFogEnabled] = useState<boolean>(true);
  const [fogDensity, setFogDensity] = useState<number>(0.055);
  const [explodedProgress, setExplodedProgress] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Performance Monitor state (closed by default on mobile viewports)
  const [isFpsOpen, setIsFpsOpen] = useState<boolean>(() =>
    typeof window !== 'undefined' ? !isMobileViewport(window.innerWidth) : true
  );
  const [fpsMetrics, setFpsMetrics] = useState<FpsMetrics | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX - 1}px)`);
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsFpsOpen(!e.matches);
    };
    mq.addEventListener('change', handleMediaChange);
    return () => mq.removeEventListener('change', handleMediaChange);
  }, []);

  // Soundscape state
  const [soundscape, setSoundscape] = useState<SoundscapeType>('off');
  const [ambientVolume, setAmbientVolume] = useState<number>(0.65);

  // Interactive Workstation Gadgets state
  const [switchType, setSwitchType] = useState<KeyboardSwitchType>('blue');
  const [screenMode, setScreenMode] = useState<ScreenTerminalMode>('code');
  const keyboardTriggerRef = React.useRef<((char?: string) => void) | null>(null);
  const coffeePuffRef = React.useRef<(() => void) | null>(null);
  const succulentNudgeRef = React.useRef<(() => void) | null>(null);

  // 3D Scene Cursor & Reactive Hover state
  const [hoveredTarget, setHoveredTarget] = useState<InteractiveHoverTarget | null>(null);
  const [clickEffectTrigger, setClickEffectTrigger] = useState<{ x: number; y: number; time: number } | null>(null);

  // Loading Overlay state
  const [loadingProgress, setLoadingProgress] = useState<number>(isAutostart ? 100 : 0);
  const [loadingStatus, setLoadingStatus] = useState<string>('Initializing WebGL2 pipeline...');
  const [isSceneReady, setIsSceneReady] = useState<boolean>(isAutostart);
  const [isLoadingOverlayActive, setIsLoadingOverlayActive] = useState<boolean>(!isAutostart);

  // Modals state
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactPrefillSubject, setContactPrefillSubject] = useState<string>('');
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isStickyNotesOpen, setIsStickyNotesOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [customNotes, setCustomNotes] = useState<StickyNote[]>([]);

  // Keyboard shortcuts & physical mechanical keyboard typing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.metaKey ||
        e.ctrlKey ||
        e.altKey
      ) {
        return;
      }
      if (e.key === 'f' || e.key === 'F') {
        setIsFpsOpen((prev) => !prev);
        soundManager.playClick();
      } else if (e.key === 'g' || e.key === 'G') {
        setFogEnabled((prev) => !prev);
        soundManager.playClick();
      } else if (e.key === 'm' || e.key === 'M') {
        setScreenMode((prev) => {
          const next = getNextScreenMode(prev);
          soundManager.playClick();
          return next;
        });
      } else if (e.key === 'k' || e.key === 'K') {
        setSwitchType((prev) => {
          const next: KeyboardSwitchType =
            prev === 'blue' ? 'brown' : prev === 'brown' ? 'red' : 'blue';
          soundManager.playKey(next);
          return next;
        });
      } else if (e.key === 'p' || e.key === 'P') {
        coffeePuffRef.current?.();
        soundManager.playClick();
      } else if (e.key === 'n' || e.key === 'N') {
        succulentNudgeRef.current?.();
        soundManager.playChime();
      } else if (e.key === 'o' || e.key === 'O') {
        setIsStickyNotesOpen((prev) => !prev);
        soundManager.playPaperRustle();
      } else {
        // Physical keyboard typing triggers 3D keycap depress, RGB wave ripple & mechanical sound
        soundManager.playKey(switchType);
        keyboardTriggerRef.current?.(e.key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [switchType]);

  const handleSelectViewpoint = (mode: ViewpointMode) => {
    setViewpoint(mode);
    if (mode === 'projects') {
      setTimeout(() => {
        setIsProjectsOpen(true);
      }, 700);
    } else if (mode === 'skills') {
      setTimeout(() => {
        setIsSkillsOpen(true);
      }, 700);
    } else if (mode === 'timeline') {
      setTimeout(() => {
        setIsTimelineOpen(true);
      }, 700);
    } else if (mode === 'contact') {
      setTimeout(() => {
        setIsContactOpen(true);
      }, 700);
    } else if (mode === 'notes') {
      setTimeout(() => {
        setIsStickyNotesOpen(true);
      }, 700);
    }
  };

  const handleSelectProjectFrom3D = (projectId: string) => {
    setSelectedProjectId(projectId);
    setIsProjectsOpen(true);
  };

  const handleSelectStickyNoteFrom3D = (noteId: string) => {
    setSelectedNoteId(noteId);
    setIsStickyNotesOpen(true);
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundManager.setMuted(nextMuted);
  };

  const handleLoadingProgress = (progress: number, stage: string) => {
    setLoadingProgress(progress);
    setLoadingStatus(stage);
  };

  const handleSceneReady = () => {
    setIsSceneReady(true);
  };

  const moodStyles = getMoodThemeStyles(mood);

  return (
    <main
      className="relative w-screen h-screen overflow-hidden bg-neutral-950 select-none transition-colors duration-700 ease-in-out"
      style={{
        '--mood-accent': moodStyles.accentGlow,
        '--mood-fog': moodStyles.fogHex
      } as React.CSSProperties}
    >
      {/* Smooth CSS Ambient Atmospheric Backdrop Transition */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-all duration-700 ease-in-out opacity-25"
        style={{
          background: moodStyles.radialGradient
        }}
        aria-hidden="true"
      />

      {/* Sophisticated Asynchronous 3D Loading Overlay */}
      {isLoadingOverlayActive && (
        <LoadingOverlay
          progress={loadingProgress}
          statusText={loadingStatus}
          isReady={isSceneReady}
          onEnter={() => setIsLoadingOverlayActive(false)}
        />
      )}

      {/* 3D WebGL Canvas Layer (Zero Backdrop-Filter applied over it) */}
      <ThreeCanvas
        viewpoint={viewpoint}
        mood={mood}
        explodedProgress={explodedProgress}
        autoRotate={autoRotate}
        onProjectSelect={handleSelectProjectFrom3D}
        onProgress={handleLoadingProgress}
        onSceneReady={handleSceneReady}
        onFpsUpdate={setFpsMetrics}
        onHoverTarget={setHoveredTarget}
        onPointerClickEffect={(e) => setClickEffectTrigger({ x: e.x, y: e.y, time: performance.now() })}
        onStickyNoteSelect={handleSelectStickyNoteFrom3D}
        switchType={switchType}
        screenMode={screenMode}
        onScreenModeChange={setScreenMode}
        keyboardTriggerRef={keyboardTriggerRef}
        coffeePuffRef={coffeePuffRef}
        succulentNudgeRef={succulentNudgeRef}
        bloomIntensity={bloomIntensity}
        fogEnabled={fogEnabled}
        fogDensity={fogDensity}
        immediate={isAutostart}
      />

      {/* Top Branding and Main Navigation */}
      <TopNav
        onOpenProjects={() => setIsProjectsOpen(true)}
        onOpenSkills={() => setIsSkillsOpen(true)}
        onOpenTimeline={() => setIsTimelineOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenChatbot={() => setIsChatbotOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isFpsOpen={isFpsOpen}
        onToggleFps={() => setIsFpsOpen(!isFpsOpen)}
      />

      {/* Minimal Discreet Performance Monitor Overlay (Top-Right) */}
      <FpsMonitorOverlay
        metrics={fpsMetrics}
        isOpen={isFpsOpen}
        onClose={() => setIsFpsOpen(false)}
      />

      {/* Unified Ergonomic Collapsible Bottom Dock */}
      <ControlDock
        viewpoint={viewpoint}
        onSelectViewpoint={handleSelectViewpoint}
        mood={mood}
        onSelectMood={(m) => {
          setMood(m);
          const preset = MOOD_PRESETS.find((p) => p.id === m);
          if (preset?.bloomIntensity !== undefined) {
            setBloomIntensity(preset.bloomIntensity);
          } else if (m === 'retro-synthwave') {
            setBloomIntensity(1.85);
          } else if (m === 'cyber-neon' && bloomIntensity < 0.8) {
            setBloomIntensity(1.25);
          }
        }}
        bloomIntensity={bloomIntensity}
        onBloomIntensityChange={(val) => setBloomIntensity(val)}
        fogEnabled={fogEnabled}
        onToggleFog={() => setFogEnabled(!fogEnabled)}
        fogDensity={fogDensity}
        onFogDensityChange={(density) => setFogDensity(density)}
        soundscape={soundscape}
        onSelectSoundscape={(s) => {
          setSoundscape(s);
          soundManager.setSoundscape(s);
          soundManager.playClick();
        }}
        ambientVolume={ambientVolume}
        onAmbientVolumeChange={(vol) => {
          setAmbientVolume(vol);
          soundManager.setAmbientVolume(vol);
        }}
        explodedProgress={explodedProgress}
        onExplodedChange={(val) => setExplodedProgress(val)}
        autoRotate={autoRotate}
        onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
        switchType={switchType}
        onSelectSwitchType={setSwitchType}
        screenMode={screenMode}
        onSelectScreenMode={setScreenMode}
        onPuffSteam={() => coffeePuffRef.current?.()}
        onNudgeSucculent={() => succulentNudgeRef.current?.()}
        onTriggerKeyboardTyping={(char) => keyboardTriggerRef.current?.(char)}
        onOpenNotes={() => setIsStickyNotesOpen(true)}
      />

      {/* Overlays / Modals */}
      <ProjectModal
        isOpen={isProjectsOpen}
        onClose={() => setIsProjectsOpen(false)}
        initialProjectId={selectedProjectId}
      />

      <SkillsModal
        isOpen={isSkillsOpen}
        onClose={() => setIsSkillsOpen(false)}
      />

      <TimelineModal
        isOpen={isTimelineOpen}
        onClose={() => setIsTimelineOpen(false)}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        onOpenContact={() => setIsContactOpen(true)}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        initialSubject={contactPrefillSubject}
      />

      <ChatbotModal
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* Desk Sticky Notes & Interactive Scratchpad Modal */}
      <StickyNoteModal
        isOpen={isStickyNotesOpen}
        onClose={() => setIsStickyNotesOpen(false)}
        selectedNoteId={selectedNoteId}
        onOpenContact={(subj) => {
          setContactPrefillSubject(subj || '');
          setIsContactOpen(true);
        }}
        onCycleScreenMode={() => {
          setScreenMode((prev) => getNextScreenMode(prev));
        }}
        customNotes={customNotes}
        onAddCustomNote={(note) => setCustomNotes((prev) => [note, ...prev])}
      />

      {/* Reactive 3D Cursor Overlay with Reticle Morphing & Glow Pulses */}
      <CustomCursorOverlay
        hoveredTarget={hoveredTarget}
        clickEffectTrigger={clickEffectTrigger}
        isModalOpen={
          isProjectsOpen ||
          isSkillsOpen ||
          isTimelineOpen ||
          isAboutOpen ||
          isContactOpen ||
          isChatbotOpen ||
          isStickyNotesOpen
        }
      />
    </main>
  );
}
