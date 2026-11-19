import React, { useState, useMemo } from 'react';
import { X, ExternalLink, Github, Search, CheckCircle2, Sparkles, Layers } from 'lucide-react';
import { Project } from '../types/portfolio';
import { PROJECTS_DATA } from '../data/portfolioData';
import { filterProjects } from '../utils/portfolioLogic';
import { soundManager } from '../audio/soundEffects';

export interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProjectId?: string | null;
}

const CATEGORIES = ['All', 'Cloud & Systems', '3D & WebGL', 'Full Stack', 'AI & Tools'];

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  initialProjectId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(
    initialProjectId || PROJECTS_DATA[0].id
  );

  // Sync initialProjectId when changed from 3D beacon click
  React.useEffect(() => {
    if (initialProjectId) {
      setActiveProjectId(initialProjectId);
    }
  }, [initialProjectId]);

  const filteredProjects = useMemo(() => {
    return filterProjects(PROJECTS_DATA, searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

  const activeProject = useMemo(() => {
    return PROJECTS_DATA.find((p) => p.id === activeProjectId) || PROJECTS_DATA[0];
  }, [activeProjectId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[88vh] bg-[#0c1017] border border-neutral-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-neutral-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-[#0f141f]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold font-mono tracking-wide text-white">
                PROJECT PORTFOLIO
              </h2>
              <p className="text-xs text-neutral-400">
                Architectural highlights & production systems built by Sawon Ahmed
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            aria-label="Close project modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split view (Projects list on left, details on right) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Sidebar: Filter & Projects List */}
          <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-neutral-800 flex flex-col bg-[#090d14]">
            {/* Search and Filters */}
            <div className="p-3.5 border-b border-neutral-800 space-y-2.5">
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search projects or tech..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedCategory(cat);
                    }}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Project items list */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {filteredProjects.length === 0 ? (
                <div className="p-6 text-center text-xs text-neutral-500">
                  No projects match your filter criteria.
                </div>
              ) : (
                filteredProjects.map((p) => {
                  const isSelected = p.id === activeProject.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        soundManager.playClick();
                        setActiveProjectId(p.id);
                      }}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-neutral-800/90 border-neutral-600 text-white shadow-md'
                          : 'bg-neutral-900/40 border-neutral-850 text-neutral-400 hover:text-white hover:bg-neutral-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold font-mono tracking-wide text-neutral-200">
                          {p.title}
                        </span>
                        {p.featured && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                            FEATURED
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-400 line-clamp-1 mt-1">
                        {p.tagline}
                      </p>
                      <div className="flex items-center gap-1 mt-2 overflow-hidden">
                        <span className="text-[10px] text-sky-400 font-mono">
                          {p.category}
                        </span>
                        <span className="text-neutral-600">•</span>
                        <span className="text-[10px] text-neutral-500 truncate">
                          {p.tags.slice(0, 3).join(', ')}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Pane: In-Depth Project Details */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#0c1017]">
            {/* Project Header */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: activeProject.color }}
                  />
                  <h3 className="text-xl font-bold font-mono text-white">
                    {activeProject.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {activeProject.demoUrl && (
                    <a
                      href={activeProject.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live Showcase</span>
                    </a>
                  )}

                  {activeProject.githubUrl && (
                    <a
                      href={activeProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors border border-neutral-700"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Codebase</span>
                    </a>
                  )}
                </div>
              </div>

              <p className="text-sm font-medium text-sky-400/90 font-mono">
                {activeProject.tagline}
              </p>
            </div>

            {/* Performance Metrics Cards */}
            <div className="grid grid-cols-3 gap-3">
              {activeProject.metrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="bg-[#111622] border border-neutral-800 rounded-xl p-3.5"
                >
                  <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                    {metric.label}
                  </div>
                  <div className="text-lg font-bold font-mono text-white mt-1">
                    {metric.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Project Narrative */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-semibold text-neutral-400 uppercase tracking-wider">
                System Overview & Architecture
              </h4>
              <p className="text-sm text-neutral-300 leading-relaxed">
                {activeProject.fullDetails}
              </p>
            </div>

            {/* Architectural Highlights */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-mono font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Key Engineering Achievements
              </h4>
              <div className="space-y-2">
                {activeProject.architectureHighlights.map((highlight, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 text-xs text-neutral-300 bg-[#0f141f] border border-neutral-850 p-3 rounded-lg"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack Pills */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-semibold text-neutral-400 uppercase tracking-wider">
                Technologies & Tools
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {activeProject.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md text-xs font-mono bg-neutral-900 border border-neutral-800 text-neutral-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
