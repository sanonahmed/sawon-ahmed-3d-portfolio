import React, { useState } from 'react';
import { Activity, X, ChevronDown, ChevronUp, Cpu, Gauge } from 'lucide-react';
import { FpsMetrics } from '../types/portfolio';
import { getFpsStatus, formatFrameTime, formatFpsDisplay } from '../utils/portfolioLogic';
import { soundManager } from '../audio/soundEffects';

export interface FpsMonitorOverlayProps {
  metrics: FpsMetrics | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FpsMonitorOverlay: React.FC<FpsMonitorOverlayProps> = ({
  metrics,
  isOpen,
  onClose
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentFps = metrics?.fps ?? 60;
  const frameTime = metrics?.frameTimeMs ?? 16.6;
  const isSoftware = metrics?.isSoftwareGl ?? false;
  const history = metrics?.frameHistory && metrics.frameHistory.length > 0
    ? metrics.frameHistory
    : [59, 60, 60, 58, 60, 60, 59, 60];

  const status = getFpsStatus(currentFps);

  const handleToggleExpand = () => {
    soundManager.playClick();
    setIsExpanded(!isExpanded);
  };

  const handleClose = () => {
    soundManager.playClick();
    onClose();
  };

  return (
    <aside
      aria-label="Performance Monitor FPS Overlay"
      data-testid="fps-monitor-overlay"
      className="absolute top-36 md:top-28 lg:top-20 right-4 md:right-6 z-20 pointer-events-auto select-none bg-[#0d1117]/95 border border-neutral-800 rounded-xl shadow-2xl transition-all duration-200"
      style={{ minWidth: isExpanded ? '240px' : '180px' }}
    >
      {/* Compact Header Bar */}
      <div className="flex items-center justify-between gap-2.5 px-3 py-2 border-b border-neutral-850">
        <div className="flex items-center gap-2">
          {/* Status Pulse Dot */}
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                status.status === 'optimal'
                  ? 'bg-emerald-400'
                  : status.status === 'stable'
                  ? 'bg-amber-400'
                  : 'bg-rose-400'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                status.status === 'optimal'
                  ? 'bg-emerald-500'
                  : status.status === 'stable'
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
            />
          </span>

          {/* Real-time FPS Value */}
          <div className="flex items-baseline gap-1 font-mono">
            <span className={`text-sm font-bold tracking-tight ${status.color}`}>
              {formatFpsDisplay(currentFps)}
            </span>
            <span className="text-[10px] text-neutral-400 font-normal">
              ({formatFrameTime(frameTime)})
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={handleToggleExpand}
            className="p-1 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded transition-colors"
            title={isExpanded ? 'Collapse metrics' : 'Expand detailed metrics'}
            aria-label={isExpanded ? 'Collapse metrics' : 'Expand detailed metrics'}
          >
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            onClick={handleClose}
            className="p-1 text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 rounded transition-colors"
            title="Close FPS monitor (Press F to reopen)"
            aria-label="Close performance monitor"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expanded Detailed Diagnostics */}
      {isExpanded && (
        <div className="p-3 flex flex-col gap-2.5 text-[11px] font-mono">
          {/* Frame cadence histogram sparkline */}
          <div>
            <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1.5">
              <span>Frame History</span>
              <span className={`px-1.5 py-0.2 rounded border text-[9px] ${status.bg} ${status.border} ${status.color}`}>
                {status.label}
              </span>
            </div>
            <div className="h-7 bg-neutral-900/90 border border-neutral-800 rounded px-1.5 py-1 flex items-end gap-1">
              {history.map((rate, idx) => {
                const heightPercent = Math.min(100, Math.max(15, (rate / 60) * 100));
                const barColor =
                  rate >= 55 ? 'bg-emerald-400' : rate >= 30 ? 'bg-amber-400' : 'bg-rose-400';
                return (
                  <div
                    key={idx}
                    className={`flex-1 rounded-t-sm transition-all duration-150 ${barColor}`}
                    style={{ height: `${heightPercent}%` }}
                    title={`${rate} FPS`}
                  />
                );
              })}
            </div>
          </div>

          {/* Engine & Pipeline specs */}
          <div className="space-y-1.5 pt-1 border-t border-neutral-850">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-sky-400" />
                <span>Pipeline</span>
              </span>
              <span className="text-neutral-200">
                {isSoftware ? 'SwiftShader (CPU)' : 'WebGL2 (GPU)'}
              </span>
            </div>

            <div className="flex items-center justify-between text-neutral-400">
              <span className="flex items-center gap-1.5">
                <Gauge className="w-3 h-3 text-purple-400" />
                <span>Target</span>
              </span>
              <span className="text-neutral-200">60 FPS / VSync</span>
            </div>
          </div>

          {/* Shortcut hint */}
          <div className="text-[10px] text-neutral-400 text-center pt-1 border-t border-neutral-850">
            Press <kbd className="px-1 py-0.5 rounded bg-neutral-800 text-neutral-300">F</kbd> to toggle HUD
          </div>
        </div>
      )}
    </aside>
  );
};
