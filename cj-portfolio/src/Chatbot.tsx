import { useState, useRef, useEffect } from 'react';
import robotImg from './assets/robot_avatar.png';

/* ─── Types ─── */
interface Message {
  role: 'user' | 'assistant';
  text: string;
}

/* ─── Portfolio System Prompt ─── */
const SYSTEM_PROMPT = `You are "CJ Bot", the personal AI assistant for CJ Baldonado's portfolio website.
Your ONLY purpose is to answer questions about CJ Baldonado — his skills, projects, education, experience, and contact info.
Keep answers friendly, concise (2-4 sentences max unless listing things), and professional.
If someone asks ANYTHING unrelated to CJ (e.g. general trivia, other people, random topics), politely decline and redirect them to ask about CJ.

Here is everything you know about CJ Baldonado:

--- PERSONAL ---
Full name: Christian James D. Baldonado (CJ)
Role: Front-End Developer / Networking / Cybersecurity enthusiast
Education: BSIT Student at Pamantasan ng Lungsod ng Valenzuela (PLV)
Availability: Open to opportunities in 2026
Personality: Passionate, detail-oriented, loves building modern & scalable systems

--- SKILLS ---
Frontend: React.js, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS
Backend & APIs: Gemini AI API, OpenAI API, Node.js, Firebase
Networking: Protocols, Subnetting, IP Configuration, VLAN
Database: Firebase Firestore, Firebase Authentication
Core strengths: Agile methodology, Problem-Solving, Analytical thinking, Team Collaboration
Experience: 3+ years, 5+ projects, 5+ tech stacks, 4+ frameworks

--- PROJECTS ---
1. FEASIFY (2026)
   - AI-powered financial feasibility system for BSBA FM students
   - Automates complex financial model generation using Gemini Flash AI
   - Tech: React, TypeScript, Gemini AI, Firebase
   - Live at: https://feasify-ten.vercel.app/
   - Demo credentials: user: baldonado@gmail.com / password: BALDONADO-1111

2. Barangay Equipment Borrowing & Tracking System (2025)
   - Web-based application for tracking and borrowing local barangay equipment
   - Streamlines inventory management for community staff
   - Tech: HTML/CSS, Firebase

3. Portfolio Site (2026)
   - CJ's personal portfolio with cinematic editorial black/red design
   - Animated film strips, crosshair motifs, and scroll reveal animations
   - Tech: React, TypeScript, Tailwind, Vite

4. Mang Delfins Putong Pulo Website (2025)
   - Marketing and storefront platform for a local delicacy business
   - Interactive product carousels, custom branch locator, product modals
   - Tech: HTML/CSS, JavaScript, PHP

--- CONTACT ---
GitHub: https://github.com/Akosidakdok
Portfolio: This website you are currently on!
(CJ is open to freelance work, collaborations, and job opportunities)

--- RULES ---
- NEVER answer questions unrelated to CJ Baldonado.
- If asked "who are you?" say you are CJ Bot, CJ's personal AI assistant.
- Always be positive and enthusiastic about CJ's work.
- If you don't know something specific about CJ, say so honestly.`;

/* ─── Predefined Quick Questions ─── */
const QUICK_QUESTIONS = [
  "What are CJ's skills?",
  "Tell me about his projects.",
  "How can I contact CJ?",
  "What is FEASIFY?",
];

/* ─── AI call via Groq (free tier, OpenAI-compatible) ─── */
async function askGemini(history: Message[], newUserText: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_api_key_here') {
    return '⚠️ API key not configured. Please add your Groq API key to the .env file.';
  }

  // Build message array for OpenAI-compatible format
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    // Include conversation history (skip the initial greeting)
    ...history
      .filter(m => !(m.role === 'assistant' && m.text.startsWith('Hey there!')))
      .map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text,
      })),
    { role: 'user', content: newUserText },
  ];

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages,
        temperature: 0.75,
        max_tokens: 512,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`Groq API error (${res.status}):`, errText);
      if (res.status === 401) return '⚠️ Invalid API key. Please check your Groq API key.';
      if (res.status === 429) return '⚠️ Too many requests — please wait a moment and try again.';
      return `⚠️ Error ${res.status}: Could not reach the AI. Please try again.`;
    }

    const data = await res.json();
    return data?.choices?.[0]?.message?.content ?? "I'm not sure how to answer that. Try asking something else about CJ!";
  } catch (err) {
    console.error('Groq fetch error:', err);
    return '⚠️ Network error — please check your internet connection.';
  }
}

/* ─── Main Chatbot Component ─── */
export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "Hey there! 👋 I'm CJ Bot, your guide to everything about CJ Baldonado. Ask me anything about his skills, projects, or how to get in touch!" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pulse, setPulse] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Auto-scroll to bottom */
  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  /* Focus input when open */
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  /* Pulse the robot every few seconds when closed */
  useEffect(() => {
    if (open) return;
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 600);
    }, 4000);
    return () => clearInterval(interval);
  }, [open]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: 'user', text: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const reply = await askGemini(messages, text.trim());
      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: "Oops! Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* ── GLOBAL STYLES ── */}
      <style>{`
        @keyframes bot-float {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50%       { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes bot-pulse-ring {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        @keyframes bot-blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95%           { transform: scaleY(0.08); }
        }
        @keyframes chat-slide-up {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
        @keyframes msg-pop {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dot-bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40%           { transform: translateY(-6px); }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 16px rgba(59,130,246,0.4), 0 0 32px rgba(239,68,68,0.2); }
          50%       { box-shadow: 0 0 28px rgba(59,130,246,0.7), 0 0 56px rgba(239,68,68,0.4); }
        }
        .bot-float { animation: bot-float 3s ease-in-out infinite; }
        .bot-blink { animation: bot-blink 4s ease-in-out infinite; }
        .chat-slide-up { animation: chat-slide-up 0.3s cubic-bezier(.22,1,.36,1) forwards; }
        .msg-pop { animation: msg-pop 0.25s ease forwards; }
        .dot1 { animation: dot-bounce 1.2s ease-in-out infinite; }
        .dot2 { animation: dot-bounce 1.2s ease-in-out 0.15s infinite; }
        .dot3 { animation: dot-bounce 1.2s ease-in-out 0.3s infinite; }
        .cj-chat-scrollbar::-webkit-scrollbar { width: 4px; }
        .cj-chat-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .cj-chat-scrollbar::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.3); border-radius: 4px; }
        .quick-btn:hover { background: rgba(239,68,68,0.15) !important; border-color: #ef4444 !important; color: #ef4444 !important; transform: translateY(-1px); }
        .send-btn:hover { background: #2563eb !important; transform: scale(1.05); }
        .send-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }
        .chat-toggle-btn:hover { transform: scale(1.08); }
      `}</style>

      {/* ════════════════════════════════════════ */}
      {/*  FIXED WRAPPER — stays on lower right   */}
      {/* ════════════════════════════════════════ */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '12px',
          pointerEvents: 'none',
        }}
      >
        {/* ── CHAT WINDOW ── */}
        {open && (
          <div
            className="chat-slide-up"
            style={{
              width: 'min(380px, calc(100vw - 48px))',
              height: '520px',
              borderRadius: '20px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid rgba(59,130,246,0.3)',
              background: 'rgba(8,8,20,0.97)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(59,130,246,0.15), 0 0 40px rgba(59,130,246,0.1)',
              pointerEvents: 'all',
            }}
          >
            {/* ── HEADER ── */}
            <div
              style={{
                padding: '14px 16px',
                background: 'linear-gradient(135deg, rgba(10,10,30,0.98) 0%, rgba(20,10,30,0.98) 100%)',
                borderBottom: '1px solid rgba(59,130,246,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flexShrink: 0,
              }}
            >
              {/* Robot icon in header */}
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1e3a8a, #7f1d1d)',
                  border: '1.5px solid rgba(59,130,246,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                <img src={robotImg} alt="CJ Bot" style={{ width: '130%', height: '130%', objectFit: 'cover', objectPosition: 'top' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-condensed, sans-serif)', fontWeight: 700, fontSize: '0.9rem', color: '#fff', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  CJ BOT
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e', flexShrink: 0 }} />
                  <span style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    AI · Online
                  </span>
                </div>
              </div>
              {/* Red accent line */}
              <div style={{ width: '3px', height: '32px', borderRadius: '2px', background: 'linear-gradient(to bottom, #3b82f6, #ef4444)', flexShrink: 0 }} />
              {/* Close button */}
              <button
                onClick={() => setOpen(false)}
                style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(255,255,255,0.06)',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'background 0.2s, color 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.2)'; (e.currentTarget as HTMLButtonElement).style.color = '#ef4444'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.6)'; }}
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>

            {/* ── MESSAGES ── */}
            <div
              className="cj-chat-scrollbar"
              style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className="msg-pop"
                  style={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    gap: '8px',
                    alignItems: 'flex-end',
                  }}
                >
                  {msg.role === 'assistant' && (
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', overflow: 'hidden', background: 'linear-gradient(135deg,#1e3a8a,#7f1d1d)', border: '1px solid rgba(59,130,246,0.4)', flexShrink: 0 }}>
                      <img src={robotImg} alt="" style={{ width: '140%', height: '140%', objectFit: 'cover', objectPosition: 'top', marginLeft: '-20%' }} />
                    </div>
                  )}
                  <div
                    style={{
                      maxWidth: '75%',
                      padding: '10px 14px',
                      borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      background: msg.role === 'user'
                        ? 'linear-gradient(135deg, #1d4ed8, #7f1d1d)'
                        : 'rgba(255,255,255,0.06)',
                      border: msg.role === 'user'
                        ? '1px solid rgba(59,130,246,0.4)'
                        : '1px solid rgba(255,255,255,0.08)',
                      fontFamily: 'system-ui, sans-serif',
                      fontSize: '0.78rem',
                      lineHeight: 1.6,
                      color: msg.role === 'user' ? '#fff' : 'rgba(255,255,255,0.88)',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {loading && (
                <div className="msg-pop" style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', overflow: 'hidden', background: 'linear-gradient(135deg,#1e3a8a,#7f1d1d)', border: '1px solid rgba(59,130,246,0.4)', flexShrink: 0 }}>
                    <img src={robotImg} alt="" style={{ width: '140%', height: '140%', objectFit: 'cover', objectPosition: 'top', marginLeft: '-20%' }} />
                  </div>
                  <div style={{ padding: '12px 16px', borderRadius: '16px 16px 16px 4px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <span className="dot1" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6', display: 'inline-block' }} />
                    <span className="dot2" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6', display: 'inline-block' }} />
                    <span className="dot3" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6', display: 'inline-block' }} />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* ── QUICK QUESTIONS ── */}
            <div style={{ padding: '8px 12px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '6px', overflowX: 'auto', flexShrink: 0 }}>
              {QUICK_QUESTIONS.map(q => (
                <button
                  key={q}
                  className="quick-btn"
                  onClick={() => sendMessage(q)}
                  disabled={loading}
                  style={{
                    whiteSpace: 'nowrap',
                    padding: '5px 11px',
                    borderRadius: '20px',
                    border: '1px solid rgba(59,130,246,0.3)',
                    background: 'rgba(59,130,246,0.08)',
                    color: 'rgba(255,255,255,0.65)',
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '0.65rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    opacity: loading ? 0.4 : 1,
                    letterSpacing: '0.02em',
                  }}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* ── INPUT BAR ── */}
            <div
              style={{
                padding: '10px 12px 14px',
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                background: 'rgba(5,5,15,0.6)',
                borderTop: '1px solid rgba(59,130,246,0.15)',
                flexShrink: 0,
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask about CJ..."
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '9px 14px',
                  borderRadius: '12px',
                  border: '1px solid rgba(59,130,246,0.25)',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '0.8rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => (e.target.style.borderColor = 'rgba(59,130,246,0.6)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(59,130,246,0.25)')}
              />
              <button
                className="send-btn"
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #1d4ed8, #7f1d1d)',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'background 0.2s, transform 0.15s',
                }}
                aria-label="Send message"
              >
                ➤
              </button>
            </div>
          </div>
        )}

        {/* ── FLOATING ROBOT BUTTON ── */}
        <div style={{ position: 'relative', pointerEvents: 'all' }}>
          {/* Pulse ring when closed */}
          {!open && pulse && (
            <div
              style={{
                position: 'absolute',
                inset: '-4px',
                borderRadius: '50%',
                border: '2px solid rgba(59,130,246,0.5)',
                animation: 'bot-pulse-ring 0.6s ease-out forwards',
                pointerEvents: 'none',
              }}
            />
          )}

          {/* Glow orb behind robot */}
          <div
            style={{
              position: 'absolute',
              bottom: '-8px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '70px',
              height: '20px',
              borderRadius: '50%',
              background: open ? 'rgba(239,68,68,0.3)' : 'rgba(59,130,246,0.3)',
              filter: 'blur(8px)',
              transition: 'background 0.4s',
              animation: 'glow-pulse 2.5s ease-in-out infinite',
              pointerEvents: 'none',
            }}
          />

          {/* Robot toggle button */}
          <button
            className={`chat-toggle-btn ${!open ? 'bot-float' : ''}`}
            onClick={() => setOpen(v => !v)}
            aria-label={open ? 'Close CJ Bot' : 'Open CJ Bot'}
            style={{
              width: '76px',
              height: '76px',
              borderRadius: '50%',
              border: `2.5px solid ${open ? 'rgba(239,68,68,0.6)' : 'rgba(59,130,246,0.6)'}`,
              background: 'linear-gradient(135deg, rgba(10,10,30,0.95), rgba(20,5,15,0.95))',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              transition: 'border-color 0.4s, transform 0.2s, box-shadow 0.4s',
              boxShadow: open
                ? '0 0 0 3px rgba(239,68,68,0.2), 0 8px 30px rgba(0,0,0,0.6)'
                : '0 0 0 3px rgba(59,130,246,0.15), 0 8px 30px rgba(0,0,0,0.6)',
              position: 'relative',
            }}
          >
            <img
              src={robotImg}
              alt="CJ Bot"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'top center',
                borderRadius: '50%',
                filter: 'drop-shadow(0 0 6px rgba(59,130,246,0.5))',
                transition: 'filter 0.3s',
              }}
            />
            {/* Online indicator badge */}
            <span
              style={{
                position: 'absolute',
                bottom: '4px',
                right: '4px',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#22c55e',
                border: '2px solid rgba(10,10,30,0.95)',
                boxShadow: '0 0 8px #22c55e',
              }}
            />
          </button>

          {/* "Ask me!" label tag - only when closed */}
          {!open && (
            <div
              style={{
                position: 'absolute',
                top: '-10px',
                right: '-4px',
                background: 'linear-gradient(135deg, #1d4ed8, #7f1d1d)',
                color: '#fff',
                fontFamily: 'monospace',
                fontSize: '0.5rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '3px 8px',
                borderRadius: '20px',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                pointerEvents: 'none',
              }}
            >
              Ask me!
            </div>
          )}
        </div>
      </div>
    </>
  );
}
