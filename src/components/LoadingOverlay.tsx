import React, { useState, useEffect } from 'react';
import { Layers, Terminal, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { getLoadingStage } from '../utils/portfolioLogic';
import { soundManager } from '../audio/soundEffects';

export interface LoadingOverlayProps {
  progress: number;
  statusText?: string;
  isReady: boolean;
  onEnter: () => void;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  progress,
  statusText,
  isReady,
  onEnter
}) => {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isDismissing, setIsDismissing] = useState(false);

  // Smoothly interpolate displayed percentage towards target progress
  useEffect(() => {
    const timer = setInterval(() => {
      setDisplayProgress((prev) => {
        if (prev < progress) {
          const step = Math.max(1, Math.round((progress - prev) * 0.25));
          return Math.min(progress, prev + step);
        }
        return prev;
      });
    }, 25);

    return () => clearInterval(timer);
  }, [progress]);

  // Handle Enter trigger
  const handleEnterWorkspace = () => {
    soundManager.playClick();
    soundManager.playChime();
    setIsDismissing(true);
    setTimeout(() => {
      onEnter();
    }, 600);
  };

  // Keyboard shortcut: Press Enter to enter workspace when ready
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (displayProgress >= 90 || isReady) {
          handleEnterWorkspace();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [displayProgress, isReady]);

  const stage = getLoadingStage(displayProgress);
  const currentStatus = statusText || stage.label;

  const telemetryLogs = [
    { threshold: 18, label: 'WebGL2 PBR Pipeline & Shader Rig', code: 'SYS_GL_READY' },
    { threshold: 42, label: 'Procedural Live Code & Telemetry Maps', code: 'TEX_PROC_OK' },
    { threshold: 72, label: '12-Part Mechanical Workstation Rig', code: 'GEO_RIG_SYNC' },
    { threshold: 92, label: 'PMREM Studio Environment & Audio Rig', code: 'ENV_PBR_ARM' }
  ];

  return (
    <div
      data-testid="loading-overlay"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-12 bg-[#07090e] text-neutral-100 transition-all duration-700 ease-out select-none ${
        isDismissing ? 'opacity-0 scale-102 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Radial Atmosphere Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_45%,rgba(56,189,248,0.09),transparent_60%)]" />

      {/* Top Header Badge */}
      <div className="relative z-10 w-full max-w-2xl flex items-center justify-between border-b border-neutral-850 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-400">
            SA // 3D WORKSPACE ENGINE
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px] text-neutral-500">
          <span className="w-2 h-2 rounded-full bg-emerald-400/80" />
          <span>v2.4.0 • PBR STUDIO</span>
        </div>
      </div>

      {/* Center Main Stage Content */}
      <div className="relative z-10 w-full max-w-xl flex flex-col items-center text-center space-y-7 my-auto">
        {/* Holographic Wireframe Icon */}
        <div className="relative w-16 h-16 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex items-center justify-center shadow-2xl shadow-sky-500/10">
          <div className="absolute inset-0 rounded-2xl border border-sky-500/30 animate-pulse" />
          <Terminal className="w-7 h-7 text-sky-400" />
        </div>

        {/* Title & Role */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-white uppercase">
            Sawon Ahmed
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-sans tracking-wide">
            Full Stack Developer & 3D Interactive Web Architect
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-sky-400/90 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>[{stage.code}]</span>
            </span>
            <span className="font-bold text-white text-sm">
              {displayProgress}%
            </span>
          </div>

          {/* Shimmering Progress Bar Track */}
          <div className="relative w-full h-2.5 bg-neutral-900 border border-neutral-800 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-purple-500 transition-all duration-300 ease-out shadow-[0_0_12px_rgba(56,189,248,0.5)]"
              style={{ width: `${displayProgress}%` }}
            />
          </div>

          {/* Active Stage Description */}
          <div className="min-h-[22px] flex items-center justify-center">
            <p className="text-xs font-mono text-neutral-400 transition-all duration-200">
              {currentStatus}
            </p>
          </div>
        </div>

        {/* Telemetry Activity Checklist */}
        <div className="w-full bg-[#0b0e14] border border-neutral-850 rounded-xl p-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
          {telemetryLogs.map((log) => {
            const isCompleted = displayProgress >= log.threshold;
            return (
              <div
                key={log.code}
                className={`flex items-center gap-2 text-[11px] font-mono transition-colors duration-300 ${
                  isCompleted ? 'text-neutral-300' : 'text-neutral-600'
                }`}
              >
                <ShieldCheck
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isCompleted ? 'text-emerald-400' : 'text-neutral-700'
                  }`}
                />
                <span className="truncate">{log.label}</span>
              </div>
            );
          })}
        </div>

        {/* Action Button: Enter Workspace when loaded */}
        <div className="pt-2">
          {displayProgress >= 90 || isReady ? (
            <button
              onClick={handleEnterWorkspace}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-mono text-xs font-bold text-neutral-950 bg-sky-400 hover:bg-sky-300 transition-all duration-200 shadow-xl shadow-sky-500/25 animate-in fade-in cursor-pointer active:scale-95"
            >
              <span>ENTER WORKSPACE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleEnterWorkspace}
              className="text-[11px] font-mono text-neutral-500 hover:text-neutral-300 transition-colors py-1 px-3"
            >
              Skip Loading Intro →
            </button>
          )}
        </div>
      </div>

      {/* Footer Navigation Tip */}
      <div className="relative z-10 w-full max-w-2xl flex items-center justify-between border-t border-neutral-850 pt-4 text-[11px] font-mono text-neutral-500">
        <span>ASYNCHRONOUS PROCEDURAL STREAM</span>
        <span>PRESS [ENTER] TO INITIALIZE</span>
      </div>
    </div>
  );
};
