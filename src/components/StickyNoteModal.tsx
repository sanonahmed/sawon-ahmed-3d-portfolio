import React, { useState, useEffect } from 'react';
import {
  X,
  Pin,
  Copy,
  Check,
  Sparkles,
  PenTool,
  ExternalLink,
  Tag,
  Code2,
  Calendar,
  Layers,
  Send
} from 'lucide-react';
import { StickyNote } from '../types/portfolio';
import { STICKY_NOTES_DATA } from '../data/portfolioData';
import { soundManager } from '../audio/soundEffects';
import { createCustomStickyNote } from '../utils/portfolioLogic';

interface StickyNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNoteId?: string | null;
  onOpenContact?: (prefillSubject?: string) => void;
  onCycleScreenMode?: () => void;
  customNotes?: StickyNote[];
  onAddCustomNote?: (note: StickyNote) => void;
}

export const StickyNoteModal: React.FC<StickyNoteModalProps> = ({
  isOpen,
  onClose,
  selectedNoteId,
  onOpenContact,
  onCycleScreenMode,
  customNotes = [],
  onAddCustomNote
}) => {
  const allNotes = [...STICKY_NOTES_DATA, ...customNotes];
  const [activeNoteId, setActiveNoteId] = useState<string>(
    selectedNoteId || allNotes[0]?.id || 'note-arch'
  );
  const [activeTab, setActiveTab] = useState<'read' | 'scratchpad'>('read');
  const [copied, setCopied] = useState(false);

  // Scratchpad Form State
  const [scratchTitle, setScratchTitle] = useState('');
  const [scratchCategory, setScratchCategory] = useState<StickyNote['category']>('dev-notes');
  const [scratchColor, setScratchColor] = useState<string>('#fef08a');
  const [scratchContent, setScratchContent] = useState('');
  const [scratchSuccess, setScratchSuccess] = useState(false);

  // Sync incoming selectedNoteId
  useEffect(() => {
    if (selectedNoteId) {
      setActiveNoteId(selectedNoteId);
      setActiveTab('read');
    }
  }, [selectedNoteId]);

  // Handle ESC key to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
        soundManager.playClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentNote = allNotes.find((n) => n.id === activeNoteId) || allNotes[0];

  const handleCopyText = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      soundManager.playClick();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExecuteAction = () => {
    if (!currentNote?.action) return;
    const { type, payload } = currentNote.action;
    if (type === 'contact') {
      onClose();
      onOpenContact?.(payload || 'Collaboration via 3D Desk Sticky Note');
    } else if (type === 'screen-mode') {
      onCycleScreenMode?.();
      soundManager.playClick();
    } else if (type === 'copy' && payload) {
      handleCopyText(payload);
    }
  };

  const handleCreateCustomNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scratchTitle.trim() || !scratchContent.trim()) return;

    const newNote = createCustomStickyNote(
      scratchTitle,
      scratchContent,
      scratchCategory,
      scratchColor
    );

    onAddCustomNote?.(newNote);
    setActiveNoteId(newNote.id);
    setActiveTab('read');
    setScratchSuccess(true);
    soundManager.playPaperRustle();

    // Reset form
    setScratchTitle('');
    setScratchContent('');
    setTimeout(() => setScratchSuccess(false), 3000);
  };

  const colorOptions = [
    { label: 'Canary Yellow', hex: '#fef08a' },
    { label: 'Tech Cyan', hex: '#bae6fd' },
    { label: 'Apricot Orange', hex: '#fed7aa' },
    { label: 'Mint Emerald', hex: '#bbf7d0' },
    { label: 'Bubblegum Pink', hex: '#fbcfe8' }
  ];

  return (
    <div
      data-testid="sticky-note-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#0f131a] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800/80 bg-[#141824]/90">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Pin className="w-4 h-4 rotate-45" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-neutral-100 flex items-center gap-2">
                <span>Desk Sticky Notes & Scratchpad</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-normal">
                  3D Interactive Desk Items
                </span>
              </h2>
              <p className="text-xs text-neutral-400 font-sans">
                Dev notes, architecture guidelines, and interactive scratchpad
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              soundManager.playClick();
            }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            aria-label="Close notes modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Toggle Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-2 bg-[#121620] border-b border-neutral-850">
          <button
            onClick={() => {
              setActiveTab('read');
              soundManager.playClick();
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'read'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Pinned Desk Notes ({allNotes.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('scratchpad');
              soundManager.playClick();
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'scratchpad'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Leave a Quick Note (Scratchpad)</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'read' ? (
            <>
              {/* Note Selection Carousel / Grid */}
              <div>
                <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-2.5">
                  Select Desk Note to Inspect:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {allNotes.map((note) => {
                    const isSelected = note.id === currentNote?.id;
                    return (
                      <button
                        key={note.id}
                        onClick={() => {
                          setActiveNoteId(note.id);
                          soundManager.playPaperRustle();
                        }}
                        className={`text-left p-2.5 rounded-xl border transition-all duration-150 flex flex-col gap-1.5 relative overflow-hidden ${
                          isSelected
                            ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-md scale-[1.02]'
                            : 'border-neutral-800 hover:border-neutral-700 bg-neutral-900/40'
                        }`}
                        style={{
                          backgroundColor: isSelected ? `${note.color}15` : undefined
                        }}
                      >
                        {/* Little colored pin indicator */}
                        <div className="flex items-center justify-between">
                          <span
                            className="w-2.5 h-2.5 rounded-full shadow-sm"
                            style={{ backgroundColor: note.pinColor }}
                          />
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300 font-medium">
                            {note.badge}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-neutral-200 truncate">
                          {note.title}
                        </div>
                        <div className="text-[10px] text-neutral-400 line-clamp-1">
                          {note.date}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main Realistic Paper Sticky Note Display */}
              {currentNote && (
                <div
                  className="relative rounded-2xl p-6 shadow-2xl transition-all duration-300 border border-black/10 select-text overflow-hidden"
                  style={{
                    backgroundColor: currentNote.color,
                    color: '#0f172a'
                  }}
                >
                  {/* Top Scotch Tape or Pin Visual */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-white/40 backdrop-blur-sm border-x border-b border-black/10 shadow-sm rounded-b-sm" />
                  <div
                    className="absolute top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full shadow-md border border-white/80"
                    style={{ backgroundColor: currentNote.pinColor }}
                  />

                  {/* Curled Corner Bottom Right Shadow */}
                  <div className="absolute bottom-0 right-0 w-8 h-8 bg-black/15 [clip-path:polygon(100%_0,0_100%,100%_100%)] pointer-events-none" />

                  {/* Note Meta Header */}
                  <div className="flex items-center justify-between pt-3 pb-2 border-b border-black/10 text-xs font-mono">
                    <span className="font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-black/10">
                      {currentNote.badge}
                    </span>
                    <span className="text-neutral-700 font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {currentNote.date}
                    </span>
                  </div>

                  {/* Note Title */}
                  <div className="mt-3.5">
                    <h3 className="text-xl font-bold tracking-tight font-sans text-neutral-900">
                      {currentNote.title}
                    </h3>
                  </div>

                  {/* Note Content Text */}
                  <div className="mt-3 text-sm leading-relaxed text-neutral-800 font-sans whitespace-pre-line font-medium">
                    {currentNote.content}
                  </div>

                  {/* Code Snippet Box (if available) */}
                  {currentNote.codeSnippet && (
                    <div className="mt-4 rounded-xl bg-neutral-950/90 text-neutral-200 border border-black/20 p-3 font-mono text-xs overflow-x-auto shadow-inner relative group">
                      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-neutral-800 text-[10px] text-neutral-400">
                        <span className="flex items-center gap-1">
                          <Code2 className="w-3 h-3 text-amber-400" />
                          <span>Code Excerpt</span>
                        </span>
                        <button
                          onClick={() => handleCopyText(currentNote.codeSnippet!)}
                          className="flex items-center gap-1 hover:text-white transition-colors"
                        >
                          {copied ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="text-[11px] leading-relaxed select-text text-amber-200">
                        {currentNote.codeSnippet}
                      </pre>
                    </div>
                  )}

                  {/* Interactive Action Button */}
                  {currentNote.action && (
                    <div className="mt-5 pt-3 border-t border-black/10 flex items-center justify-between">
                      <button
                        onClick={handleExecuteAction}
                        className="px-4 py-2 rounded-xl text-xs font-semibold tracking-wide bg-neutral-900 text-white hover:bg-neutral-800 active:scale-95 transition-all shadow-md flex items-center gap-2"
                      >
                        {currentNote.action.type === 'contact' && <Send className="w-3.5 h-3.5" />}
                        {currentNote.action.type === 'screen-mode' && <Sparkles className="w-3.5 h-3.5" />}
                        {currentNote.action.type === 'copy' && <Copy className="w-3.5 h-3.5" />}
                        <span>{currentNote.action.label}</span>
                      </button>

                      <span className="text-[10px] font-mono text-neutral-600">
                        Pinned at Developer Desk
                      </span>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            /* Scratchpad Form */
            <form onSubmit={handleCreateCustomNote} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
                <span>
                  Write a quick feedback note, idea, or reminder. It will be temporarily pinned to your 3D desk view for this session!
                </span>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Note Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Great 3D lighting, let's connect!"
                  value={scratchTitle}
                  onChange={(e) => setScratchTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#161b26] border border-neutral-750 text-neutral-100 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>

              {/* Category & Color Picker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Category Tag
                  </label>
                  <select
                    value={scratchCategory}
                    onChange={(e) => setScratchCategory(e.target.value as StickyNote['category'])}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#161b26] border border-neutral-750 text-neutral-200 text-sm focus:outline-none focus:border-amber-400"
                  >
                    <option value="dev-notes">Dev Notes & Todos</option>
                    <option value="architecture">Architecture Idea</option>
                    <option value="easter-egg">Easter Egg / Fun</option>
                    <option value="quick-contact">Quick Contact</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Sticky Paper Color
                  </label>
                  <div className="flex items-center gap-2 pt-1">
                    {colorOptions.map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => setScratchColor(c.hex)}
                        title={c.label}
                        className={`w-7 h-7 rounded-lg transition-transform ${
                          scratchColor === c.hex
                            ? 'ring-2 ring-white scale-110 shadow-md'
                            : 'opacity-80 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Content Body */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Note Body
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write your note here..."
                  value={scratchContent}
                  onChange={(e) => setScratchContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#161b26] border border-neutral-750 text-neutral-100 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 resize-none font-sans"
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-400 text-neutral-950 font-semibold text-sm hover:bg-amber-300 active:scale-95 transition-all shadow-md flex items-center gap-2"
                >
                  <Pin className="w-4 h-4 rotate-45" />
                  <span>Pin Note to 3D Desk</span>
                </button>

                {scratchSuccess && (
                  <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
                    <Check className="w-4 h-4" />
                    <span>Note successfully pinned!</span>
                  </span>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#11141e] border-t border-neutral-850 flex items-center justify-between text-[11px] font-mono text-neutral-400">
          <div>
            <span>Shortcuts: Press </span>
            <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">Esc</kbd>
            <span> to exit</span>
          </div>

          <div className="flex items-center gap-1 text-amber-400/90 font-medium">
            <span>Click any note on the 3D desk to reopen</span>
          </div>
        </div>
      </div>
    </div>
  );
};
