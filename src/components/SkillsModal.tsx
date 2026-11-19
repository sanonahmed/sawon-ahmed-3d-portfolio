import React, { useState } from 'react';
import { X, Cpu, Layers, Server, Database, Check } from 'lucide-react';
import { SKILL_CATEGORIES } from '../data/portfolioData';
import { calculateSkillStats } from '../utils/portfolioLogic';
import { soundManager } from '../audio/soundEffects';

export interface SkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SkillsModal: React.FC<SkillsModalProps> = ({ isOpen, onClose }) => {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  const stats = React.useMemo(() => {
    return calculateSkillStats(SKILL_CATEGORIES);
  }, []);

  if (!isOpen) return null;

  const currentCategory = SKILL_CATEGORIES[activeCategoryIndex];

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[88vh] bg-[#0c1017] border border-neutral-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-neutral-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-[#0f141f]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold font-mono tracking-wide text-white">
                TECHNICAL CAPABILITIES & PROFICIENCY
              </h2>
              <p className="text-xs text-neutral-400">
                Full stack engineering, low-latency microservices & 3D WebGL architecture
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            aria-label="Close skills modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Aggregate Stats Bar */}
        <div className="grid grid-cols-3 border-b border-neutral-800 bg-[#090d14] px-6 py-3 text-center">
          <div>
            <div className="text-[11px] font-mono text-neutral-400 uppercase">
              Core Technologies
            </div>
            <div className="text-lg font-bold font-mono text-sky-400">
              {stats.totalSkills} Mastered
            </div>
          </div>
          <div className="border-x border-neutral-850">
            <div className="text-[11px] font-mono text-neutral-400 uppercase">
              Average Proficiency
            </div>
            <div className="text-lg font-bold font-mono text-purple-400">
              {stats.averageMastery}%
            </div>
          </div>
          <div>
            <div className="text-[11px] font-mono text-neutral-400 uppercase">
              Specialist Tier (≥90%)
            </div>
            <div className="text-lg font-bold font-mono text-emerald-400">
              {stats.topSkillsCount} Domains
            </div>
          </div>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-neutral-800 bg-[#0c1017] overflow-x-auto">
          {SKILL_CATEGORIES.map((cat, idx) => {
            const isSelected = idx === activeCategoryIndex;
            return (
              <button
                key={cat.name}
                onClick={() => {
                  soundManager.playClick();
                  setActiveCategoryIndex(idx);
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
                }`}
              >
                {idx === 0 && <Layers className="w-3.5 h-3.5" />}
                {idx === 1 && <Server className="w-3.5 h-3.5" />}
                {idx === 2 && <Database className="w-3.5 h-3.5" />}
                {idx === 3 && <Cpu className="w-3.5 h-3.5" />}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Content Pane */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <p className="text-xs text-neutral-400 font-mono">
            {currentCategory.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {currentCategory.skills.map((skill) => (
              <div
                key={skill.name}
                className="bg-[#111622] border border-neutral-800/80 rounded-xl p-3.5 flex flex-col justify-between space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold font-mono text-neutral-200">
                      {skill.name}
                    </span>
                    {skill.highlight && (
                      <span className="flex items-center gap-0.5 text-[9px] px-1.5 py-0.2 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-mono">
                        <Check className="w-2.5 h-2.5" /> CORE
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-neutral-400">
                    {skill.experience}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-neutral-500">
                    <span>Proficiency</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${skill.level}%`,
                        backgroundColor:
                          skill.level >= 95
                            ? '#38bdf8'
                            : skill.level >= 90
                            ? '#a855f7'
                            : '#10b981'
                      }}
                    />
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
