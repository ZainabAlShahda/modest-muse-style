'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { axiosInstance } from '@/lib/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hello! I'm **Muse**, your personal style assistant at Modest Muse Style. ✨\n\nI can help you with:\n- Finding the perfect outfit\n- Tracking your order\n- Returns & exchanges\n- Sizing guidance\n\nHow can I help you today?",
  timestamp: new Date(),
};

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

/** Render bold text (**text**) and newlines inside a message bubble */
function MessageText({ content }: { content: string }) {
  const lines = content.split('\n');
  return (
    <span>
      {lines.map((line, li) => {
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <span key={li}>
            {li > 0 && <br />}
            {parts.map((part, pi) =>
              part.startsWith('**') && part.endsWith('**') ? (
                <strong key={pi}>{part.slice(2, -2)}</strong>
              ) : (
                <span key={pi}>{part}</span>
              )
            )}
          </span>
        );
      })}
    </span>
  );
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, scrollToBottom]);

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isLoading, isOpen, scrollToBottom]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Build conversation history for API (exclude welcome message, use only real turns)
      const history = [...messages.filter((m) => m.id !== 'welcome'), userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await axiosInstance.post('/chat', { messages: history });
      const reply = res.data?.data?.reply ?? "I'm sorry, I couldn't get a response. Please try again.";

      const assistantMsg: Message = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      if (!isOpen) setHasUnread(true);
    } catch {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content:
          "I'm having trouble connecting right now. Please try again or email us at **hello@modestmusestyle.com**.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) setHasUnread(false);
  };

  return (
    <>
      {/* Chat Panel */}
      <div
        className={`fixed bottom-24 right-4 z-50 flex flex-col w-[350px] max-h-[520px] rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
          isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        style={{ background: '#FAF8F2' }}
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-4 py-3 shrink-0"
          style={{ background: '#2D5A1B' }}
        >
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-lg"
            style={{ background: '#C49A3A' }}>
            <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white leading-none">Muse</p>
            <p className="text-xs mt-0.5" style={{ color: '#C49A3A' }}>
              Modest Muse Style Assistant
            </p>
          </div>
          {/* Online indicator */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-white/70">Online</span>
          </div>
          {/* Close button */}
          <button
            onClick={handleToggle}
            className="ml-2 w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors text-white"
            aria-label="Close chat"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 scroll-smooth"
          style={{ maxHeight: '360px' }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-white text-xs font-bold"
                  style={{ background: '#2D5A1B' }}>
                  M
                </div>
              )}
              <div className={`max-w-[78%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                <div
                  className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'rounded-br-sm text-white'
                      : 'rounded-bl-sm border'
                  }`}
                  style={
                    msg.role === 'user'
                      ? { background: '#2D5A1B' }
                      : { background: '#fff', borderColor: '#EDE8DC', color: '#1C261A' }
                  }
                >
                  <MessageText content={msg.content} />
                </div>
                <span className="text-[10px] px-1" style={{ color: '#617060' }}>
                  {formatTime(msg.timestamp)}
                </span>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex gap-2 justify-start">
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold"
                style={{ background: '#2D5A1B' }}>
                M
              </div>
              <div className="px-3 py-2.5 rounded-2xl rounded-bl-sm border"
                style={{ background: '#fff', borderColor: '#EDE8DC' }}>
                <div className="flex gap-1 items-center h-4">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full animate-bounce"
                      style={{ background: '#4A8A36', animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick suggestions (only when just the welcome message is showing) */}
        {messages.length === 1 && !isLoading && (
          <div className="px-3 pb-1 flex flex-wrap gap-1.5 shrink-0">
            {['Track my order', 'Find an abaya', 'Return policy', 'Sizing help'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setInput(suggestion);
                  setTimeout(() => inputRef.current?.focus(), 50);
                }}
                className="text-xs px-2.5 py-1 rounded-full border transition-colors hover:text-white"
                style={{ borderColor: '#2D5A1B', color: '#2D5A1B' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#2D5A1B';
                  (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  (e.currentTarget as HTMLButtonElement).style.color = '#2D5A1B';
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="px-3 pb-3 pt-2 shrink-0 border-t" style={{ borderColor: '#EDE8DC' }}>
          <div className="flex gap-2 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Type a message..."
              disabled={isLoading}
              className="flex-1 resize-none rounded-xl border px-3 py-2 text-sm outline-none transition-colors disabled:opacity-50"
              style={{
                borderColor: '#C49A3A',
                color: '#1C261A',
                background: '#fff',
                maxHeight: '80px',
                lineHeight: '1.4',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#2D5A1B')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#C49A3A')}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = 'auto';
                el.style.height = `${Math.min(el.scrollHeight, 80)}px`;
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95"
              style={{ background: '#2D5A1B' }}
              aria-label="Send message"
            >
              <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4 translate-x-0.5">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
          <p className="text-center text-[10px] mt-1.5" style={{ color: '#617060' }}>
            Powered by AI · Not a substitute for human support
          </p>
        </div>
      </div>

      {/* Floating Trigger Button */}
      <button
        onClick={handleToggle}
        className="fixed bottom-6 right-4 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 focus:outline-none"
        style={{ background: '#2D5A1B' }}
        aria-label={isOpen ? 'Close chat' : 'Open chat with Muse'}
      >
        {/* Unread badge */}
        {hasUnread && !isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-bold border-2 border-white">
            !
          </span>
        )}

        {/* Icon: chat bubble when closed, X when open */}
        {isOpen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
          </svg>
        )}
      </button>
    </>
  );
}
