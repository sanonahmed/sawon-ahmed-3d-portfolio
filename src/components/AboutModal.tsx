import React from 'react';
import { X, User, Code2, Globe, Cpu, Heart, CheckCircle2 } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { soundManager } from '../audio/soundEffects';

export interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenContact: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, onOpenContact }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[88vh] bg-[#0c1017] border border-neutral-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-neutral-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-[#0f141f]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold font-mono tracking-wide text-white">
                ABOUT SAWON AHMED
              </h2>
              <p className="text-xs text-neutral-400">
                Full Stack Developer & 3D Interactive Web Architect
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            aria-label="Close about modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Bio Intro */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white font-mono">
              Engineering Scalable Systems & Spatial Web Experiences
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Hello! I'm <strong className="text-white">Sawon Ahmed</strong>. Over the last 6+ years, I've worked across the full software stack—from orchestrating distributed cloud services in Go and Node.js, to engineering real-time 3D WebGL interfaces using Three.js and modern React.
            </p>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              I believe the web is evolving beyond flat document pages into tactile, spatial universes where users interact with software like physical instruments. My mission is to build digital products that combine rock-solid microservice reliability with fluid 60 FPS graphics craft.
            </p>
          </div>

          {/* Core Philosophy Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="bg-[#111622] border border-neutral-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-sky-400 font-mono text-xs font-semibold">
                <Cpu className="w-4 h-4" />
                <span>Distributed Backends</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Zero-tolerance for race conditions, sub-50ms API response targets, resilient Docker & Kubernetes topologies with robust observability.
              </p>
            </div>

            <div className="bg-[#111622] border border-neutral-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-semibold">
                <Globe className="w-4 h-4" />
                <span>3D & Spatial UI</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Lossless 60 FPS Three.js rendering, custom PBR studio lighting, exponential damping, and memory-safe instanced drawing.
              </p>
            </div>

            <div className="bg-[#111622] border border-neutral-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-semibold">
                <Code2 className="w-4 h-4" />
                <span>Type Safety & Craft</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Strict TypeScript type boundaries, automated unit and integration tests, and pristine clean code that scales across teams.
              </p>
            </div>

            <div className="bg-[#111622] border border-neutral-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-semibold">
                <Heart className="w-4 h-4" />
                <span>User-First Polish</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Micro-interactions, procedural Web Audio sound feedback, accessible semantic HTML, and zero unnecessary visual clutter.
              </p>
            </div>
          </div>

          {/* Key Facts */}
          <div className="bg-[#090d14] border border-neutral-850 rounded-xl p-4 space-y-2.5">
            <h4 className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider">
              Quick Facts
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Primary Email: {PERSONAL_INFO.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Status: Open for Full Stack roles</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Experience: 6+ Years In Production</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Focus: Full Stack + 3D WebGL</span>
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-neutral-500 font-mono">
              Ready to create something impactful?
            </span>
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
                onOpenContact();
              }}
              className="px-5 py-2 rounded-xl text-xs font-mono font-semibold bg-sky-500 hover:bg-sky-400 text-neutral-950 transition-colors shadow-lg shadow-sky-500/20"
            >
              Get In Touch With Sawon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
