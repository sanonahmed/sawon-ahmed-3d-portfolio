import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Camera,
  SunMedium,
  Layers,
  RotateCw,
  Sparkles,
  Radio,
  Volume2,
  CloudFog,
  Keyboard,
  Monitor,
  Coffee,
  Sprout,
  Pin
} from 'lucide-react';
import {
  ViewpointMode,
  MoodLighting,
  SoundscapeType,
  KeyboardSwitchType,
  ScreenTerminalMode
} from '../types/portfolio';
import {
  MOOD_PRESETS,
  SOUNDSCAPE_PRESETS,
  KEYBOARD_SWITCHES,
  SCREEN_MODES
} from '../data/portfolioData';
import {
  formatBloomIntensity,
  getBloomPresetLabel,
  formatFogDensity,
  getFogStatus,
  MOBILE_BREAKPOINT_PX,
  isMobileViewport
} from '../utils/portfolioLogic';
import { soundManager } from '../audio/soundEffects';

export interface ControlDockProps {
  viewpoint: ViewpointMode;
  onSelectViewpoint: (v: ViewpointMode) => void;
  mood: MoodLighting;
  onSelectMood: (m: MoodLighting) => void;
  bloomIntensity: number;
  onBloomIntensityChange: (val: number) => void;
  fogEnabled: boolean;
  onToggleFog: () => void;
  fogDensity: number;
  onFogDensityChange: (density: number) => void;
  soundscape: SoundscapeType;
  onSelectSoundscape: (s: SoundscapeType) => void;
  ambientVolume: number;
  onAmbientVolumeChange: (vol: number) => void;
  explodedProgress: number;
  onExplodedChange: (val: number) => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  switchType: KeyboardSwitchType;
  onSelectSwitchType: (st: KeyboardSwitchType) => void;
  screenMode: ScreenTerminalMode;
  onSelectScreenMode: (sm: ScreenTerminalMode) => void;
  onPuffSteam?: () => void;
  onNudgeSucculent?: () => void;
  onTriggerKeyboardTyping?: (char?: string) => void;
  onOpenNotes?: () => void;
}

type DockTab = 'viewpoints' | 'lighting' | 'gadgets' | 'soundscapes' | 'exploded';

export const ControlDock: React.FC<ControlDockProps> = ({
  viewpoint,
  onSelectViewpoint,
  mood,
  onSelectMood,
  bloomIntensity,
  onBloomIntensityChange,
  fogEnabled,
  onToggleFog,
  fogDensity,
  onFogDensityChange,
  soundscape,
  onSelectSoundscape,
  ambientVolume,
  onAmbientVolumeChange,
  explodedProgress,
  onExplodedChange,
  autoRotate,
  onToggleAutoRotate,
  switchType,
  onSelectSwitchType,
  screenMode,
  onSelectScreenMode,
  onPuffSteam,
  onNudgeSucculent,
  onTriggerKeyboardTyping,
  onOpenNotes
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() =>
    typeof window !== 'undefined' ? isMobileViewport(window.innerWidth) : false
  );
  const [activeTab, setActiveTab] = useState<DockTab>('viewpoints');

  // Keep dock hidden by default whenever entering mobile view (< 768px)
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX - 1}px)`);
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsCollapsed(e.matches);
    };
    mq.addEventListener('change', handleMediaChange);
    return () => mq.removeEventListener('change', handleMediaChange);
  }, []);

  // Keyboard shortcut [H] to toggle dock collapse
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'h' || e.key === 'H') {
        setIsCollapsed((prev) => !prev);
        soundManager.playClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const viewpointsList: { id: ViewpointMode; label: string; desc: string }[] = [
    { id: 'overview', label: 'Studio', desc: 'Isometric workstation vantage' },
    { id: 'projects', label: 'Projects', desc: 'Holographic matrix focus' },
    { id: 'skills', label: 'Tech Core', desc: 'Hardware & architecture angle' },
    { id: 'timeline', label: 'Journey', desc: 'Workstation depth profile' },
    { id: 'contact', label: 'Console', desc: 'First-person developer view' },
    { id: 'notes', label: 'Desk Notes', desc: 'Pinned dev notes & scratchpad' }
  ];

  return (
    <div
      data-testid="control-dock"
      data-collapsed={isCollapsed ? 'true' : 'false'}
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94vw] max-w-[920px] transition-transform duration-300 ease-out select-none ${
        isCollapsed ? 'translate-y-[calc(100%-34px)]' : 'translate-y-0'
      }`}
    >
      {/* Collapse / Expand Tab attached to top edge */}
      <div className="flex justify-center -mb-px">
        <button
          onClick={() => {
            soundManager.playClick();
            setIsCollapsed(!isCollapsed);
          }}
          aria-expanded={!isCollapsed}
          className={`flex items-center gap-1.5 px-4 py-1.5 bg-[#0d1117] border border-neutral-800 text-[11px] font-mono text-neutral-300 hover:text-white transition-colors shadow-lg ${
            isCollapsed ? 'rounded-xl' : 'rounded-t-xl border-b-0'
          }`}
          aria-label={isCollapsed ? 'Expand 3D scene controls' : 'Collapse 3D scene controls'}
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-sky-400" />
              <span>
                SHOW CONTROLS <span className="hidden sm:inline">[H]</span>
              </span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              <span>
                HIDE DOCK <span className="hidden sm:inline">[H]</span>
              </span>
            </>
          )}
        </button>
      </div>

      {/* Main Dock Container (Solid opaque surface, zero backdrop-filter over WebGL) */}
      <div
        aria-hidden={isCollapsed}
        className={`bg-[#0d1117] border border-neutral-800 rounded-2xl p-3 shadow-2xl transition-all duration-200 ${
          isCollapsed ? 'opacity-0 pointer-events-none invisible' : 'opacity-100 pointer-events-auto visible'
        }`}
      >
        {/* Navigation Tabs Header */}
        <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2.5 mb-2.5 flex-wrap gap-2">
          <div className="flex items-center flex-wrap sm:flex-nowrap gap-1 bg-neutral-900/90 rounded-lg p-1 border border-neutral-800 no-scrollbar max-w-full">
            <button
              onClick={() => {
                soundManager.playClick();
                setActiveTab('viewpoints');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                activeTab === 'viewpoints'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Cameras</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setActiveTab('lighting');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                activeTab === 'lighting'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <SunMedium className="w-3.5 h-3.5" />
              <span>Lighting & Fog</span>
              {bloomIntensity > 0 && (
                <span className="w-2 h-2 rounded-full bg-cyan-400" title="Bloom active" />
              )}
              {fogEnabled && (
                <span className="w-2 h-2 rounded-full bg-purple-400" title="Volumetric fog active" />
              )}
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setActiveTab('gadgets');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                activeTab === 'gadgets'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <Keyboard className="w-3.5 h-3.5 text-emerald-400" />
              <span>Desk Gadgets</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setActiveTab('soundscapes');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                activeTab === 'soundscapes'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span>Soundscape</span>
              {soundscape !== 'off' && (
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
              )}
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setActiveTab('exploded');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                activeTab === 'exploded'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Exploded Rig</span>
              {explodedProgress > 0 && (
                <span className="text-[10px] bg-purple-500/30 px-1 rounded">
                  {Math.round(explodedProgress * 100)}%
                </span>
              )}
            </button>
          </div>

          {/* Quick scene toggles: Auto Rotate & Hint */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundManager.playClick();
                onToggleAutoRotate();
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono border transition-colors ${
                autoRotate
                  ? 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
              aria-label="Toggle auto-orbit rotation"
            >
              <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
              <span>ORBIT {autoRotate ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* Tab Content Panes */}
        <div className="pt-0.5">
          {activeTab === 'viewpoints' && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {viewpointsList.map((vp) => {
                const isActive = viewpoint === vp.id;
                return (
                  <button
                    key={vp.id}
                    onClick={() => onSelectViewpoint(vp.id)}
                    className={`flex flex-col text-left px-3 py-2 rounded-xl border transition-all ${
                      isActive
                        ? 'bg-sky-950/40 border-sky-500/60 text-sky-200 ring-1 ring-sky-500/30'
                        : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800/60 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-mono font-semibold tracking-wide">
                        {vp.label}
                      </span>
                      {isActive && <Sparkles className="w-3 h-3 text-sky-400" />}
                    </div>
                    <span className="text-[10px] text-neutral-500 truncate mt-0.5">
                      {vp.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {activeTab === 'lighting' && (
            <div className="space-y-2.5">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {MOOD_PRESETS.map((m) => {
                  const isActive = mood === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => onSelectMood(m.id)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-left transition-all duration-500 ease-in-out ${
                        isActive
                          ? 'bg-neutral-800/90 text-neutral-100 shadow-md ring-1'
                          : 'bg-neutral-900/60 border-neutral-800/80 text-neutral-400 hover:text-white hover:bg-neutral-800/50 hover:border-neutral-700'
                      }`}
                      style={
                        isActive
                          ? ({
                              borderColor: `${m.accentGlow}88`,
                              boxShadow: `0 0 16px ${m.accentGlow}25`,
                              '--tw-ring-color': `${m.accentGlow}66`
                            } as React.CSSProperties)
                          : undefined
                      }
                    >
                      <div
                        className="w-4 h-4 rounded-full border border-neutral-700 shrink-0 transition-all duration-500 ease-out"
                        style={{
                          backgroundColor: m.accentGlow,
                          transform: isActive ? 'scale(1.15)' : 'scale(1)',
                          boxShadow: isActive ? `0 0 8px ${m.accentGlow}` : 'none'
                        }}
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-medium truncate">{m.name}</div>
                        <div className="text-[10px] text-neutral-500 truncate">
                          Studio PBR Rig
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Post-Processing Bloom Intensity Control */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-neutral-900/60 border border-neutral-800/80 rounded-xl px-4 py-2.5">
                <div className="flex items-center gap-1.5 text-xs text-neutral-300 font-mono shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-semibold">CYBER BLOOM INTENSITY:</span>
                </div>

                <div className="flex-1 w-full flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="2.5"
                    step="0.05"
                    value={bloomIntensity}
                    onChange={(e) => onBloomIntensityChange(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
                    aria-label="Dynamic post-processing bloom intensity slider"
                  />
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="font-mono text-xs font-bold text-cyan-300 w-12 text-right">
                      {formatBloomIntensity(bloomIntensity)}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                        getBloomPresetLabel(bloomIntensity).badgeColor
                      }`}
                    >
                      {getBloomPresetLabel(bloomIntensity).label}
                    </span>
                  </div>
                </div>

                {/* Quick intensity presets */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onBloomIntensityChange(0);
                    }}
                    className={`px-2 py-0.5 text-[10px] font-mono rounded transition-colors ${
                      bloomIntensity === 0
                        ? 'bg-neutral-700 text-white font-bold'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white'
                    }`}
                  >
                    OFF
                  </button>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onBloomIntensityChange(0.6);
                    }}
                    className={`px-2 py-0.5 text-[10px] font-mono rounded transition-colors ${
                      Math.abs(bloomIntensity - 0.6) < 0.05
                        ? 'bg-sky-500/30 text-sky-200 border border-sky-500/50 font-bold'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white'
                    }`}
                  >
                    SUBTLE
                  </button>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onBloomIntensityChange(1.25);
                    }}
                    className={`px-2 py-0.5 text-[10px] font-mono rounded transition-colors ${
                      Math.abs(bloomIntensity - 1.25) < 0.05
                        ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-500/50 font-bold'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white'
                    }`}
                  >
                    CYBER-NEON
                  </button>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onBloomIntensityChange(2.2);
                    }}
                    className={`px-2 py-0.5 text-[10px] font-mono rounded transition-colors ${
                      bloomIntensity >= 2.0
                        ? 'bg-fuchsia-500/30 text-fuchsia-200 border border-fuchsia-500/50 font-bold'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white'
                    }`}
                  >
                    MAX GLOW
                  </button>
                </div>
              </div>

              {/* Dynamic Volumetric Atmospheric Fog Control */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-neutral-900/60 border border-neutral-800/80 rounded-xl px-4 py-2.5">
                <div className="flex items-center gap-1.5 text-xs text-neutral-300 font-mono shrink-0">
                  <CloudFog className={`w-3.5 h-3.5 ${fogEnabled ? 'text-purple-400' : 'text-neutral-500'}`} />
                  <span className="font-semibold">VOLUMETRIC ATMOSPHERIC FOG:</span>
                </div>

                <div className="flex-1 w-full flex items-center gap-3">
                  {/* Fog Toggle Button */}
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onToggleFog();
                    }}
                    className={`px-2.5 py-1 text-xs font-mono rounded-lg border transition-all flex items-center gap-1.5 shrink-0 ${
                      fogEnabled
                        ? 'bg-purple-500/20 text-purple-200 border-purple-500/40 shadow-sm'
                        : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-white'
                    }`}
                    aria-label="Toggle volumetric scene fog"
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        fogEnabled ? 'bg-purple-400 animate-pulse' : 'bg-neutral-600'
                      }`}
                    />
                    <span>{fogEnabled ? 'FOG ON' : 'FOG OFF'}</span>
                  </button>

                  {/* Fog Density Slider */}
                  <div
                    className={`flex-1 flex items-center gap-2 transition-opacity ${
                      fogEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'
                    }`}
                  >
                    <input
                      type="range"
                      min="0.01"
                      max="0.12"
                      step="0.005"
                      disabled={!fogEnabled}
                      value={fogDensity}
                      onChange={(e) => onFogDensityChange(parseFloat(e.target.value))}
                      className="w-full accent-purple-400 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
                      aria-label="Volumetric atmospheric fog density slider"
                    />
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="font-mono text-xs font-bold text-purple-300 w-12 text-right">
                        {formatFogDensity(fogDensity)}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                          getFogStatus(fogEnabled, fogDensity).badgeColor
                        }`}
                      >
                        {getFogStatus(fogEnabled, fogDensity).label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Density Presets */}
                <div
                  className={`flex items-center gap-1 shrink-0 transition-opacity ${
                    fogEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'
                  }`}
                >
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onFogDensityChange(0.025);
                    }}
                    className={`px-2 py-0.5 text-[10px] font-mono rounded transition-colors ${
                      Math.abs(fogDensity - 0.025) < 0.01 && fogEnabled
                        ? 'bg-sky-500/30 text-sky-200 border border-sky-500/50 font-bold'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white'
                    }`}
                  >
                    HAZE
                  </button>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onFogDensityChange(0.055);
                    }}
                    className={`px-2 py-0.5 text-[10px] font-mono rounded transition-colors ${
                      Math.abs(fogDensity - 0.055) < 0.01 && fogEnabled
                        ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-500/50 font-bold'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white'
                    }`}
                  >
                    BALANCED
                  </button>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onFogDensityChange(0.095);
                    }}
                    className={`px-2 py-0.5 text-[10px] font-mono rounded transition-colors ${
                      fogDensity >= 0.085 && fogEnabled
                        ? 'bg-purple-500/30 text-purple-200 border border-purple-500/50 font-bold'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white'
                    }`}
                  >
                    DEEP CYBER
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'gadgets' && (
            <div className="space-y-3">
              {/* Mechanical Keyboard Switches & Interactive Testing */}
              <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Keyboard className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-mono font-semibold text-neutral-200">
                      MECHANICAL KEYBOARD SWITCH:
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400">
                    Shortcut: <kbd className="px-1 py-0.5 rounded bg-neutral-800 text-neutral-300">K</kbd> to cycle switch
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {KEYBOARD_SWITCHES.map((sw) => {
                    const isActive = switchType === sw.type;
                    return (
                      <button
                        key={sw.type}
                        onClick={() => {
                          onSelectSwitchType(sw.type);
                          soundManager.playKey(sw.type);
                          onTriggerKeyboardTyping?.(' ');
                        }}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl border text-left transition-all ${
                          isActive
                            ? 'bg-neutral-800/90 text-neutral-100 shadow-md ring-1'
                            : 'bg-neutral-900/60 border-neutral-800/80 text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                        }`}
                        style={
                          isActive
                            ? {
                                borderColor: `${sw.color}88`,
                                boxShadow: `0 0 12px ${sw.color}25`
                              }
                            : undefined
                        }
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className="w-3.5 h-3.5 rounded-full border border-neutral-700 shrink-0"
                            style={{
                              backgroundColor: sw.color,
                              boxShadow: isActive ? `0 0 8px ${sw.color}` : 'none'
                            }}
                          />
                          <div className="min-w-0">
                            <div className="text-xs font-medium truncate">{sw.name}</div>
                            <div className="text-[10px] text-neutral-400 truncate">{sw.feel}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-950/60 border border-neutral-800 text-neutral-300 shrink-0">
                          {sw.soundType}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Keyboard typing simulation & quick-test keys */}
                <div className="mt-2.5 pt-2 border-t border-neutral-800/60 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-mono text-neutral-400">Quick Test:</span>
                    {['W', 'A', 'S', 'D', 'Space', 'Enter'].map((k) => (
                      <button
                        key={k}
                        onClick={() => {
                          soundManager.playKey(switchType);
                          onTriggerKeyboardTyping?.(k === 'Space' ? ' ' : k === 'Enter' ? 'Enter' : k);
                        }}
                        className="px-2 py-0.5 text-[10px] font-mono bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-neutral-300 rounded border border-neutral-700/60 transition-transform shadow-xs"
                      >
                        {k}
                      </button>
                    ))}
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400/90 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>Physical keyboard typing triggers 3D keycaps & RGB wave</span>
                  </div>
                </div>
              </div>

              {/* Workstation Gadgets: Screen Terminal, Coffee Mug, Succulent, and Desk Sticky Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {/* Curved Screen Mode */}
                <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-xl p-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-mono font-semibold text-neutral-200">
                          CURVED SCREEN TERMINAL:
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-400">
                        Shortcut: <kbd className="px-1 py-0.5 rounded bg-neutral-800 text-neutral-300">M</kbd>
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      {SCREEN_MODES.map((sm) => {
                        const isActive = screenMode === sm.mode;
                        return (
                          <button
                            key={sm.mode}
                            onClick={() => {
                              soundManager.playClick();
                              onSelectScreenMode(sm.mode);
                            }}
                            className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all ${
                              isActive
                                ? 'bg-neutral-800 text-white font-semibold'
                                : 'bg-neutral-900/80 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                            }`}
                            style={
                              isActive
                                ? {
                                    borderColor: sm.color,
                                    boxShadow: `0 0 10px ${sm.color}33`
                                  }
                                : undefined
                            }
                          >
                            <span
                              className="text-[10px] font-mono px-1.5 py-0.5 rounded mb-1 font-bold"
                              style={{
                                backgroundColor: `${sm.color}25`,
                                color: sm.color
                              }}
                            >
                              {sm.badge}
                            </span>
                            <span className="text-[11px] truncate w-full">{sm.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="mt-2 text-[10px] text-neutral-500 font-mono text-center">
                    Click curved monitor in 3D scene to cycle live canvas
                  </div>
                </div>

                {/* Coffee Mug Steam Effect */}
                <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-xl p-3 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Coffee className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-mono font-semibold text-neutral-200">
                        VOLUMETRIC COFFEE STEAM:
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-amber-400/80">
                      48 GPU Swirl Particles
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        onPuffSteam?.();
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 active:scale-98 border border-amber-500/40 text-amber-200 text-xs font-mono font-semibold transition-all shadow-sm"
                    >
                      <Coffee className="w-3.5 h-3.5 text-amber-400" />
                      <span>PUFF FRESH STEAM [P]</span>
                    </button>
                  </div>
                  <div className="mt-2 text-[10px] text-neutral-500 font-mono text-center">
                    Click coffee cup or press <kbd className="px-1 py-0.5 rounded bg-neutral-800 text-neutral-300">P</kbd> to trigger steam swirl
                  </div>
                </div>

                {/* Cozy Potted Succulent */}
                <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-xl p-3 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Sprout className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-mono font-semibold text-neutral-200">
                        COZY SUCCULENT:
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400/80">
                      Perlin Noise Breathing
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        soundManager.playChime();
                        onNudgeSucculent?.();
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 active:scale-98 border border-emerald-500/40 text-emerald-200 text-xs font-mono font-semibold transition-all shadow-sm"
                    >
                      <Sprout className="w-3.5 h-3.5 text-emerald-400" />
                      <span>NUDGE SUCCULENT [N]</span>
                    </button>
                  </div>
                  <div className="mt-2 text-[10px] text-neutral-500 font-mono text-center">
                    Click succulent in 3D scene or press <kbd className="px-1 py-0.5 rounded bg-neutral-800 text-neutral-300">N</kbd> to trigger gentle spring wobble
                  </div>
                </div>

                {/* Interactive Desk Sticky Notes */}
                <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-xl p-3 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Pin className="w-4 h-4 text-amber-400 rotate-45" />
                      <span className="text-xs font-mono font-semibold text-neutral-200">
                        DESK NOTES:
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-amber-400/80">
                      4 Pinned Notes
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        soundManager.playPaperRustle();
                        onOpenNotes?.();
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 active:scale-98 border border-amber-500/40 text-amber-200 text-xs font-mono font-semibold transition-all shadow-sm"
                    >
                      <Pin className="w-3.5 h-3.5 text-amber-400 rotate-45" />
                      <span>INSPECT NOTES [O]</span>
                    </button>
                  </div>
                  <div className="mt-2 text-[10px] text-neutral-500 font-mono text-center">
                    Click 3D note or press <kbd className="px-1 py-0.5 rounded bg-neutral-800 text-neutral-300">O</kbd> to inspect
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'soundscapes' && (
            <div className="space-y-2.5">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {SOUNDSCAPE_PRESETS.map((s) => {
                  const isActive = soundscape === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => onSelectSoundscape(s.id)}
                      className={`flex flex-col text-left px-3 py-2 rounded-xl border transition-all ${
                        isActive
                          ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-200 ring-1 ring-cyan-500/30'
                          : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-mono font-semibold truncate">
                          {s.name}
                        </span>
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: s.color }}
                        />
                      </div>
                      <span className="text-[10px] text-neutral-500 truncate mt-0.5">
                        {s.subtitle}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Volume Slider for Ambient Soundscape */}
              <div className="flex items-center gap-3 bg-neutral-900/60 border border-neutral-800/80 rounded-xl px-4 py-2">
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono shrink-0">
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>AMBIENT VOLUME:</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={ambientVolume}
                  onChange={(e) => onAmbientVolumeChange(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
                  aria-label="Ambient soundscape volume control"
                />
                <span className="font-mono text-xs text-neutral-300 w-10 text-right shrink-0">
                  {Math.round(ambientVolume * 100)}%
                </span>
              </div>
            </div>
          )}

          {activeTab === 'exploded' && (
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-neutral-900/60 border border-neutral-800/80 rounded-xl px-4 py-2.5">
              <div className="text-xs text-neutral-300 font-mono shrink-0">
                EXPLODED RIG VIEW:
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={explodedProgress}
                onChange={(e) => onExplodedChange(parseFloat(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer h-2 bg-neutral-800 rounded-lg"
                aria-label="Exploded workstation inspection slider"
              />
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-mono text-xs font-bold text-purple-400 w-12 text-right">
                  {Math.round(explodedProgress * 100)}%
                </span>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onExplodedChange(explodedProgress > 0 ? 0 : 0.75);
                  }}
                  className="px-2.5 py-1 text-[11px] font-mono rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
                >
                  {explodedProgress > 0 ? 'RESET' : 'INSPECT'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
