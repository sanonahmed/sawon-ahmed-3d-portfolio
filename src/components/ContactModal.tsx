import React, { useState, useEffect } from 'react';
import { X, Terminal as TerminalIcon, Send, Mail, CheckCircle2, Copy, Check } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { validateContactForm } from '../utils/portfolioLogic';
import { soundManager } from '../audio/soundEffects';

export interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSubject?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, initialSubject }) => {
  const [activeMode, setActiveMode] = useState<'form' | 'terminal'>('form');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: initialSubject || '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSent, setIsSent] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    if (initialSubject) {
      setFormData((prev) => ({ ...prev, subject: initialSubject }));
    }
  }, [initialSubject, isOpen]);

  // Terminal State
  const [terminalHistory, setTerminalHistory] = useState<
    { type: 'input' | 'output' | 'error'; text: string }[]
  >([
    {
      type: 'output',
      text: 'Sawon Ahmed Terminal [Version 2.4.0-edge]\nType "help" to view available developer commands, or write directly.'
    }
  ]);
  const [terminalInput, setTerminalInput] = useState('');

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    soundManager.playClick();
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();

    const validation = validateContactForm(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors as Record<string, string>);
      return;
    }

    setFormErrors({});
    setIsSent(true);
    soundManager.playChime();

    // Construct mailto for direct delivery
    const mailtoUrl = `mailto:${PERSONAL_INFO.email}?subject=${encodeURIComponent(
      formData.subject
    )}&body=${encodeURIComponent(
      `From: ${formData.name} (${formData.email})\n\n${formData.message}`
    )}`;

    // Trigger mail client or simulate instant dispatch
    setTimeout(() => {
      window.open(mailtoUrl, '_blank');
    }, 600);
  };

  const handleTerminalCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    soundManager.playKey();
    const newHistory = [...terminalHistory, { type: 'input' as const, text: `$ ${terminalInput}` }];

    if (cmd === 'help') {
      newHistory.push({
        type: 'output',
        text: 'Available Commands:\n  • bio       - Display developer summary & background\n  • skills    - Print core full stack & 3D proficiencies\n  • projects  - List featured production architectures\n  • email     - Output contact email address\n  • clear     - Clear terminal history'
      });
    } else if (cmd === 'bio') {
      newHistory.push({
        type: 'output',
        text: `${PERSONAL_INFO.name} — ${PERSONAL_INFO.title}\n${PERSONAL_INFO.bio}\nLocation: ${PERSONAL_INFO.location} | Status: ${PERSONAL_INFO.status}`
      });
    } else if (cmd === 'skills') {
      newHistory.push({
        type: 'output',
        text: 'Primary Stack:\n  [Frontend] React 19, TypeScript, Three.js, WebGL, Tailwind, GLSL\n  [Backend]  Node.js, Go, Python, FastAPI, GraphQL, gRPC\n  [Database] PostgreSQL, Redis, MongoDB\n  [Cloud]    Docker, Kubernetes, AWS, Cloud Run, CI/CD'
      });
    } else if (cmd === 'projects') {
      newHistory.push({
        type: 'output',
        text: 'Featured Deployments:\n  1. OmniFlow Cloud Engine (Go, K8s, Redis, React)\n  2. Apex3D Spatial Studio (Three.js, WebGL, GLSL, TS)\n  3. KubePulse Microservices Monitor (Python, FastAPI, Postgres)'
      });
    } else if (cmd === 'email') {
      newHistory.push({
        type: 'output',
        text: `Direct Email: ${PERSONAL_INFO.email}\nFeel free to send proposals, collaborations, or inquiries.`
      });
    } else if (cmd === 'clear') {
      setTerminalHistory([]);
      setTerminalInput('');
      return;
    } else {
      newHistory.push({
        type: 'error',
        text: `Command not recognized: "${cmd}". Type "help" for a list of commands.`
      });
    }

    setTerminalHistory(newHistory);
    setTerminalInput('');
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#0c1017] border border-neutral-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-neutral-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-[#0f141f]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <TerminalIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold font-mono tracking-wide text-white">
                DEVELOPER DISPATCH & CONTACT
              </h2>
              <p className="text-xs text-neutral-400">
                Direct line to Sawon Ahmed • asawon800@gmail.com
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            aria-label="Close contact modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Toggle: Form vs CLI Terminal */}
        <div className="flex items-center justify-between px-6 py-2.5 border-b border-neutral-800 bg-[#090d14]">
          <div className="flex items-center gap-1 bg-neutral-900 rounded-lg p-1 border border-neutral-800">
            <button
              onClick={() => {
                soundManager.playClick();
                setActiveMode('form');
              }}
              className={`px-3 py-1 rounded-md text-xs font-mono transition-colors ${
                activeMode === 'form'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Direct Message
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setActiveMode('terminal');
              }}
              className={`px-3 py-1 rounded-md text-xs font-mono transition-colors ${
                activeMode === 'terminal'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Interactive CLI
            </button>
          </div>

          {/* Quick Copy Email */}
          <button
            onClick={handleCopyEmail}
            className="flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-lg transition-colors"
            title="Click to copy email"
          >
            {copiedEmail ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{PERSONAL_INFO.email}</span>
              </>
            )}
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeMode === 'form' ? (
            isSent ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-mono text-white">
                    Message Dispatched Successfully!
                  </h3>
                  <p className="text-xs text-neutral-400 max-w-sm mt-1">
                    Thank you for reaching out. Sawon will review your inquiry and respond within 24 hours.
                  </p>
                </div>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setIsSent(false);
                    setFormData({ name: '', email: '', subject: '', message: '' });
                  }}
                  className="px-4 py-2 rounded-lg text-xs font-mono bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-neutral-400">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Alex Morgan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#111622] border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-sky-500"
                    />
                    {formErrors.name && (
                      <p className="text-[11px] text-rose-400">{formErrors.name}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-neutral-400">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="alex@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#111622] border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-sky-500"
                    />
                    {formErrors.email && (
                      <p className="text-[11px] text-rose-400">{formErrors.email}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-400">
                    Subject *
                  </label>
                  <input
                    type="text"
                    placeholder="Full Stack Engineering / 3D Web Project / Role Inquiry"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-[#111622] border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-sky-500"
                  />
                  {formErrors.subject && (
                    <p className="text-[11px] text-rose-400">{formErrors.subject}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-400">
                    Message Details *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell me about your project, timeline, architecture goals, or role..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#111622] border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-sky-500 resize-none"
                  />
                  {formErrors.message && (
                    <p className="text-[11px] text-rose-400">{formErrors.message}</p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-neutral-500 font-mono">
                    Direct delivery to asawon800@gmail.com
                  </span>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-mono font-semibold bg-sky-500 hover:bg-sky-400 text-neutral-950 transition-colors shadow-lg shadow-sky-500/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Dispatch</span>
                  </button>
                </div>
              </form>
            )
          ) : (
            <div className="flex flex-col h-[320px] bg-[#070a10] border border-neutral-850 rounded-xl p-4 font-mono text-xs">
              <div className="flex-1 overflow-y-auto space-y-2 whitespace-pre-wrap">
                {terminalHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className={
                      item.type === 'input'
                        ? 'text-sky-300 font-semibold'
                        : item.type === 'error'
                        ? 'text-rose-400'
                        : 'text-neutral-300'
                    }
                  >
                    {item.text}
                  </div>
                ))}
              </div>

              <form onSubmit={handleTerminalCommand} className="flex items-center gap-2 pt-3 border-t border-neutral-800">
                <span className="text-sky-400 font-bold">$</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="type command (help, bio, skills, projects, email)..."
                  className="flex-1 bg-transparent text-white focus:outline-none text-xs placeholder-neutral-600 font-mono"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px]"
                >
                  RUN
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
