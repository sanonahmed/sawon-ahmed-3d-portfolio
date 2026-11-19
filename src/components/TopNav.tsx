import React from 'react';
import { Volume2, VolumeX, Mail, Github, FolderGit2, Cpu, History, User, Terminal, Bot, Sparkles, Activity } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { soundManager } from '../audio/soundEffects';

export interface TopNavProps {
  onOpenProjects: () => void;
  onOpenSkills: () => void;
  onOpenTimeline: () => void;
  onOpenAbout: () => void;
  onOpenContact: () => void;
  onOpenChatbot: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isFpsOpen?: boolean;
  onToggleFps?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  onOpenProjects,
  onOpenSkills,
  onOpenTimeline,
  onOpenAbout,
  onOpenContact,
  onOpenChatbot,
  isMuted,
  onToggleMute,
  isFpsOpen,
  onToggleFps
}) => {
  const handleClick = (action: () => void) => {
    soundManager.playClick();
    action();
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-20 pointer-events-none px-4 py-3.5 md:px-6 md:py-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2.5">
      {/* Top-Left: Floating Developer Identity */}
      <div className="pointer-events-auto flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-400/25 flex items-center justify-center text-sky-400 font-mono font-bold text-sm shadow-[0_0_15px_rgba(56,189,248,0.15)]">
          SA
        </div>
        <div className="[text-shadow:0_2px_10px_rgba(0,0,0,0.95)]">
          <div className="flex items-center gap-2">
            <h1 className="text-xs sm:text-sm font-semibold tracking-wider text-neutral-100 uppercase font-mono">
              {PERSONAL_INFO.name}
            </h1>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AVAILABLE
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 font-sans">
            Full Stack Developer & 3D Web Architect
          </p>
        </div>
      </div>

      {/* Top-Right: Floating Links & 4 Logos on One Line in 3D Space (No Bar, No Scrollbar) */}
      <nav
        aria-label="Main Navigation"
        className="pointer-events-auto flex flex-wrap md:flex-nowrap items-center gap-x-1 gap-y-1 lg:gap-1.5 xl:gap-2.5 overflow-visible [text-shadow:0_2px_10px_rgba(0,0,0,0.95)]"
      >
        <button
          onClick={() => handleClick(onOpenAbout)}
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] sm:text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/[0.06] hover:-translate-y-0.5 transition-all whitespace-nowrap"
          aria-label="Open About Sawon"
        >
          <User className="w-3.5 h-3.5 text-neutral-400" />
          <span>About</span>
        </button>

        <button
          onClick={() => handleClick(onOpenProjects)}
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] sm:text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/[0.06] hover:-translate-y-0.5 transition-all whitespace-nowrap"
          aria-label="Open Featured Projects"
        >
          <FolderGit2 className="w-3.5 h-3.5 text-sky-400" />
          <span>Projects</span>
        </button>

        <button
          onClick={() => handleClick(onOpenSkills)}
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] sm:text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/[0.06] hover:-translate-y-0.5 transition-all whitespace-nowrap"
          aria-label="Open Tech Stack"
        >
          <Cpu className="w-3.5 h-3.5 text-purple-400" />
          <span>Tech Stack</span>
        </button>

        <button
          onClick={() => handleClick(onOpenTimeline)}
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] sm:text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/[0.06] hover:-translate-y-0.5 transition-all whitespace-nowrap"
          aria-label="Open Career Experience"
        >
          <History className="w-3.5 h-3.5 text-emerald-400" />
          <span>Experience</span>
        </button>

        <button
          onClick={() => handleClick(onOpenContact)}
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] sm:text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/[0.06] hover:-translate-y-0.5 transition-all whitespace-nowrap"
          aria-label="Open Contact Console"
        >
          <Terminal className="w-3.5 h-3.5 text-neutral-400" />
          <span>Contact</span>
        </button>

        <button
          onClick={() => handleClick(onOpenChatbot)}
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] sm:text-xs font-medium text-sky-300 hover:text-sky-200 hover:bg-sky-400/10 hover:-translate-y-0.5 transition-all whitespace-nowrap"
          aria-label="Open Gemini Services Chatbot"
        >
          <Bot className="w-3.5 h-3.5 text-sky-400" />
          <span>AI Services</span>
          <Sparkles className="w-2.5 h-2.5 text-amber-300" />
        </button>

        <div className="h-3.5 w-px bg-white/15 mx-0.5 hidden md:block" />

        <a
          href={PERSONAL_INFO.github}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-white/[0.06] hover:scale-110 transition-all"
          aria-label="Sawon's GitHub profile"
          title="GitHub profile"
        >
          <Github className="w-4 h-4" />
        </a>

        <a
          href={`mailto:${PERSONAL_INFO.email}`}
          className="p-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-white/[0.06] hover:scale-110 transition-all"
          aria-label="Send email to Sawon"
          title={PERSONAL_INFO.email}
        >
          <Mail className="w-4 h-4" />
        </a>

        <button
          onClick={() => {
            soundManager.playClick();
            onToggleFps?.();
          }}
          className={`p-1.5 rounded-lg hover:bg-white/[0.06] hover:scale-110 transition-all ${
            isFpsOpen ? 'text-emerald-400' : 'text-neutral-300 hover:text-white'
          }`}
          aria-label={isFpsOpen ? 'Hide FPS performance monitor' : 'Show FPS performance monitor'}
          title={isFpsOpen ? 'Hide FPS monitor [F]' : 'Show FPS monitor [F]'}
        >
          <Activity className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            onToggleMute();
          }}
          className="p-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-white/[0.06] hover:scale-110 transition-all"
          aria-label={isMuted ? 'Unmute procedural audio' : 'Mute procedural audio'}
          title={isMuted ? 'Unmute procedural audio' : 'Mute procedural audio'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>
      </nav>
    </header>
  );
};
