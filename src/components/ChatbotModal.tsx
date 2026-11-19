import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Bot,
  User,
  Sparkles,
  RotateCcw,
  Mail,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { validateChatMessage } from '../utils/portfolioLogic';
import { soundManager } from '../audio/soundEffects';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenContact: () => void;
}

const DEFAULT_SUGGESTIONS = [
  'What services does Sawon offer?',
  'Can Sawon build an interactive 3D WebGL site?',
  'What is his backend and cloud tech stack?',
  'What are typical project timelines & pricing?'
];

export const ChatbotModal: React.FC<ChatbotModalProps> = ({
  isOpen,
  onClose,
  onOpenContact
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      text: `Hello! I am **Sawon Ahmed's AI Services & Architecture Assistant**.\n\nI can help you explore Sawon's technical capabilities, full-stack microservices, 3D WebGL architectures, project estimates, or schedule an engineering consultation. How can I assist with your project today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom of chat thread when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const rawText = textToSend !== undefined ? textToSend : inputText;
    const validation = validateChatMessage(rawText);

    if (!validation.isValid) {
      setErrorMessage(validation.error || 'Please enter a valid message.');
      return;
    }

    setErrorMessage(null);
    soundManager.playKey();

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: rawText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setInputText('');
    setIsLoading(true);

    try {
      // Send conversation history to server-side Gemini endpoint
      const payload = {
        model: 'gemini-3.8-flash',
        messages: updatedHistory.map((m) => ({
          role: m.role,
          text: m.text
        }))
      };

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const replyText =
        data.reply ||
        "Sawon Ahmed provides expert Full Stack development (React, Node, Go, PostgreSQL) and 3D WebGL experiences (Three.js). You can reach him directly at asawon800@gmail.com.";

      const modelMessage: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, modelMessage]);
      soundManager.playChime();
    } catch {
      // Graceful fallback response
      const fallbackMessage: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: `Sawon provides end-to-end Full Stack Engineering (Go, Node.js, React 19, TypeScript), Distributed Microservices (PostgreSQL, Redis, Kubernetes), and 3D WebGL interfaces (Three.js, GLSL).\n\nFeel free to email him directly at **${PERSONAL_INFO.email}** to discuss your project requirements!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    soundManager.playClick();
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        text: `Conversation reset. I am ready to answer any questions about Sawon Ahmed's technical services, portfolio, or architecture solutions.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Simple clean formatting for markdown bold, lists, and line breaks
  const renderFormattedText = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, i) => {
      // Bullet list
      if (line.trim().startsWith('•') || line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const itemText = line.trim().replace(/^[•\-\*]\s*/, '');
        return (
          <div key={i} className="flex items-start gap-2 my-0.5 pl-1">
            <span className="text-sky-400 mt-1 text-xs">•</span>
            <span>{renderInlineFormatting(itemText)}</span>
          </div>
        );
      }
      return (
        <p key={i} className="min-h-[1.2em]">
          {renderInlineFormatting(line)}
        </p>
      );
    });
  };

  const renderInlineFormatting = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-semibold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={index}
            className="px-1 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-sky-300 font-mono text-[11px]"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl h-[88vh] max-h-[720px] bg-[#0c1017] border border-neutral-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-neutral-100">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-800 bg-[#0f141f]">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Bot className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0f141f]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold font-mono tracking-wide text-white">
                  SAWON AI ASSISTANT
                </h2>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  Gemini 3.8
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Services, architecture consulting & inquiry guide
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleClearChat}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Reset conversation"
              aria-label="Reset conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              aria-label="Close chatbot modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Thread (Scrollable) */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#090d14]"
        >
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed space-y-1 ${
                    isUser
                      ? 'bg-sky-600 text-white rounded-tr-none'
                      : 'bg-[#111622] border border-neutral-800 text-neutral-200 rounded-tl-none'
                  }`}
                >
                  <div className="space-y-1">{renderFormattedText(m.text)}</div>
                  <div
                    className={`text-[9px] font-mono mt-1 ${
                      isUser ? 'text-sky-200 text-right' : 'text-neutral-500'
                    }`}
                  >
                    {m.timestamp}
                  </div>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-300 shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="bg-[#111622] border border-neutral-800 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-neutral-400 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
                <span className="font-mono text-[11px]">
                  Sawon AI is analyzing your inquiry...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Suggestion Chips */}
        <div className="px-4 py-2 border-t border-neutral-850 bg-[#0c1017] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <Sparkles className="w-3 h-3 text-sky-400 shrink-0" />
          {DEFAULT_SUGGESTIONS.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(s)}
              disabled={isLoading}
              className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 whitespace-nowrap transition-colors disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3.5 border-t border-neutral-800 bg-[#0f141f] space-y-2">
          {errorMessage && (
            <p className="text-[11px] text-rose-400 font-mono px-1">
              {errorMessage}
            </p>
          )}

          <div className="flex items-center gap-2">
            <textarea
              ref={inputRef}
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about Sawon's services, stack, pricing, or architecture..."
              className="flex-1 bg-[#111622] border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-sky-500 resize-none font-sans"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputText.trim()}
              className="p-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-neutral-950 disabled:opacity-40 disabled:hover:bg-sky-500 transition-colors shrink-0 shadow-lg shadow-sky-500/20"
              aria-label="Send message to Gemini chatbot"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono px-1">
            <span>Powered by Google Gemini 3.8 Flash</span>
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
                onOpenContact();
              }}
              className="hover:text-sky-300 flex items-center gap-1 transition-colors"
            >
              <span>Direct Email / Form</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
