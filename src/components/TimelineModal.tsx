import React from 'react';
import { X, History, Briefcase, MapPin, Award } from 'lucide-react';
import { TIMELINE_DATA } from '../data/portfolioData';
import { soundManager } from '../audio/soundEffects';

export interface TimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TimelineModal: React.FC<TimelineModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[88vh] bg-[#0c1017] border border-neutral-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-neutral-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-[#0f141f]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold font-mono tracking-wide text-white">
                CAREER TRAJECTORY & EXPERIENCE
              </h2>
              <p className="text-xs text-neutral-400">
                6+ years building distributed backends and cutting-edge 3D web applications
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            aria-label="Close timeline modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timeline body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="relative border-l-2 border-neutral-800 ml-4 space-y-8">
            {TIMELINE_DATA.map((entry) => (
              <div key={entry.id} className="relative pl-6">
                {/* Timeline node */}
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-neutral-900 border-2 border-emerald-500" />

                <div className="bg-[#111622] border border-neutral-800 rounded-xl p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                        {entry.period}
                      </span>
                      <h3 className="text-base font-bold text-white mt-0.5">
                        {entry.role}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-neutral-400">
                      <span className="flex items-center gap-1 font-medium text-neutral-300">
                        <Briefcase className="w-3.5 h-3.5 text-sky-400" />
                        {entry.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                        {entry.location}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {entry.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-1.5 pt-1">
                    {entry.achievements.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 text-xs text-neutral-400"
                      >
                        <Award className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-neutral-800/80">
                    {entry.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
