import React, { useEffect, useRef } from 'react';
import { SceneManager } from '../three/SceneManager';
import {
  ViewpointMode,
  MoodLighting,
  FpsMetrics,
  KeyboardSwitchType,
  ScreenTerminalMode,
  InteractiveHoverTarget
} from '../types/portfolio';

export interface ThreeCanvasProps {
  viewpoint: ViewpointMode;
  mood: MoodLighting;
  explodedProgress: number;
  autoRotate: boolean;
  onProjectSelect: (projectId: string) => void;
  onSceneReady?: () => void;
  onProgress?: (progress: number, stage: string) => void;
  onFpsUpdate?: (metrics: FpsMetrics) => void;
  onHoverTarget?: (target: InteractiveHoverTarget | null) => void;
  onPointerClickEffect?: (e: { x: number; y: number; type?: string }) => void;
  onStickyNoteSelect?: (noteId: string) => void;
  switchType?: KeyboardSwitchType;
  screenMode?: ScreenTerminalMode;
  onScreenModeChange?: (mode: ScreenTerminalMode) => void;
  keyboardTriggerRef?: React.MutableRefObject<((char?: string) => void) | null>;
  coffeePuffRef?: React.MutableRefObject<(() => void) | null>;
  succulentNudgeRef?: React.MutableRefObject<(() => void) | null>;
  bloomIntensity?: number;
  fogEnabled?: boolean;
  fogDensity?: number;
  immediate?: boolean;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  viewpoint,
  mood,
  explodedProgress,
  autoRotate,
  onProjectSelect,
  onSceneReady,
  onProgress,
  onFpsUpdate,
  onHoverTarget,
  onPointerClickEffect,
  onStickyNoteSelect,
  switchType = 'blue',
  screenMode = 'code',
  onScreenModeChange,
  keyboardTriggerRef,
  coffeePuffRef,
  succulentNudgeRef,
  bloomIntensity = 1.25,
  fogEnabled = true,
  fogDensity = 0.055,
  immediate
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const managerRef = useRef<SceneManager | null>(null);

  // Initialize SceneManager once
  useEffect(() => {
    if (!mountRef.current) return;

    const manager = new SceneManager({
      container: mountRef.current,
      onProjectSelect: (id) => onProjectSelect(id),
      onProgress: (p, stage) => onProgress?.(p, stage),
      onReady: () => onSceneReady?.(),
      onFpsUpdate: (metrics) => onFpsUpdate?.(metrics),
      onScreenModeChange: (mode) => onScreenModeChange?.(mode),
      onHoverTarget: (t) => onHoverTarget?.(t),
      onPointerClickEffect: (e) => onPointerClickEffect?.(e),
      onStickyNoteSelect: (id) => onStickyNoteSelect?.(id),
      switchType,
      screenMode,
      bloomIntensity,
      fogEnabled,
      fogDensity,
      immediate
    });

    managerRef.current = manager;

    if (keyboardTriggerRef) {
      keyboardTriggerRef.current = (char) => manager.triggerKeyPress(char);
    }
    if (coffeePuffRef) {
      coffeePuffRef.current = () => manager.puffCoffeeSteam();
    }
    if (succulentNudgeRef) {
      succulentNudgeRef.current = () => manager.nudgeSucculent();
    }

    return () => {
      manager.dispose();
      managerRef.current = null;
      if (keyboardTriggerRef) keyboardTriggerRef.current = null;
      if (coffeePuffRef) coffeePuffRef.current = null;
      if (succulentNudgeRef) succulentNudgeRef.current = null;
    };
  }, []);

  // Update viewpoint smoothly
  useEffect(() => {
    managerRef.current?.setViewpoint(viewpoint);
  }, [viewpoint]);

  // Update mood lighting
  useEffect(() => {
    managerRef.current?.setMood(mood);
  }, [mood]);

  // Update bloom intensity dynamically
  useEffect(() => {
    if (typeof bloomIntensity === 'number') {
      managerRef.current?.setBloomIntensity(bloomIntensity);
    }
  }, [bloomIntensity]);

  // Update volumetric atmospheric fog dynamically
  useEffect(() => {
    managerRef.current?.setFog(fogEnabled, fogDensity);
  }, [fogEnabled, fogDensity]);

  // Update exploded view progress
  useEffect(() => {
    managerRef.current?.setExploded(explodedProgress);
  }, [explodedProgress]);

  // Update keyboard switch type
  useEffect(() => {
    if (switchType) {
      managerRef.current?.setSwitchType(switchType);
    }
  }, [switchType]);

  // Update screen terminal mode
  useEffect(() => {
    if (screenMode) {
      managerRef.current?.setScreenMode(screenMode);
    }
  }, [screenMode]);

  // Update auto rotation
  useEffect(() => {
    managerRef.current?.setAutoRotate(autoRotate);
  }, [autoRotate]);

  return (
    <div
      ref={mountRef}
      data-testid="three-canvas-container"
      className="absolute inset-0 w-full h-full overflow-hidden select-none touch-none bg-neutral-950 cursor-none"
    />
  );
};
