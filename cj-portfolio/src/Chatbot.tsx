import { useState, useRef, useEffect } from 'react';
import sussyAvatarImg from './assets/sussy_avatar.png';
import sussyIdleWebp from './assets/sussy_idle.webp';
import sussyWaveWebp from './assets/sussy_wave.webp';
import sussyRunWebp from './assets/sussy_run.webp';

/* ─── Types ─── */
interface Message {
  role: 'user' | 'assistant';
  text: string;
}

/* ─── Portfolio System Prompt ─── */
const SYSTEM_PROMPT = `You are "CJ Bot" (accompanied by Sussy, the cute coral bean astronaut from Codex Pets: https://codex-pets.net/share/sussy), the personal AI assistant for CJ Baldonado's portfolio website.
Your ONLY purpose is to answer questions about CJ Baldonado — his skills, projects, education, experience, and contact info.
Keep answers friendly, concise (2-4 sentences max unless listing things), and professional.
If someone asks ANYTHING unrelated to CJ (e.g. general trivia, other people, random topics), politely decline and redirect them to ask about CJ.

Here is everything you know about CJ Baldonado:

--- PERSONAL ---
Full name: Christian James D. Baldonado (CJ)
Role: Front-End Developer / Full-Stack / Networking enthusiast
Education: BSIT Student at Pamantasan ng Lungsod ng Valenzuela (PLV)
Availability: Open to opportunities in 2026
Personality: Passionate, detail-oriented, loves building modern & scalable systems

--- EXPERIENCE & INTERNSHIPS ---
1. PLV OJT — PNP ITMS (Full Stack Developer)
   - Architected enterprise personnel records and attendance platforms (P-IDTMS, PAIS 2.0)
2. SHS OJT — AFDB Enterprise (Accounting / Social Media Manager)
   - Managed accounting, financial documentation, and digital social media marketing

--- SKILLS & TECHNICAL ARSENAL (31+ Technologies) ---
Frontend & UI/UX: React.js, TypeScript, JavaScript, Tailwind CSS, HTML5, CSS3, Figma, Leaflet.js, Vite
Backend & Languages: Node.js, Express.js, Python, Java, PHP, REST APIs
Databases & Cloud: PostgreSQL, Supabase, MySQL, MSSQL, Firebase (Firestore), Cloud Storage, Vercel
DevOps & Virtualization: Docker, VirtualBox, Git, GitHub, GitHub Desktop
Developer Tools & Diagrams: VS Code, PyCharm, Draw.io, Mermaid.js
AI & Intelligent Systems: Google Gemini AI, Antigravity Agentic IDE, Anthropic Claude, OpenAI Codex, OpenAI API, GroqCloud
Networking & Security: Cisco, Protocols, Subnetting, IP Configuration, VLAN, RBAC
Collaboration & Project Management: Atlassian (Jira / Confluence), Microsoft Teams, Zoom, Google Meet
Core strengths: Agile methodology, Problem-Solving, Analytical thinking, Team Collaboration
Experience: 3+ years, 7+ projects, 31+ tech stacks & tools, 9 core engineering domains

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
   - Live at: https://barangaymapulanglupa.vercel.app/

3. Portfolio Site (2026)
   - CJ's personal portfolio with cinematic editorial black/red design
   - Animated film strips, crosshair motifs, and scroll reveal animations
   - Tech: React, TypeScript, Tailwind, Vite
   - Live at: https://baldonadoportfolio.vercel.app/

4. Mang Delfins Putong Pulo Website (2025)
   - Marketing and storefront platform for a local delicacy business
   - Interactive product carousels, custom branch locator, product modals
   - Tech: HTML/CSS, JavaScript, PHP
   - Live at: https://mang-delfins-putong-pulo.vercel.app/

5. AlertoPH (2026)
   - Community-powered flood monitoring, early-warning, and disaster resilience platform for Filipinos
   - Real-time hazard crowdsourcing, Leaflet.js GIS mapping, PAGASA weather telemetry, and safe bypass routing
   - Tech: React, TypeScript, Tailwind CSS, Leaflet, Node.js
   - Live at: https://alerto-ph.vercel.app/
   - Repository: https://github.com/Akosidakdok/BantayBaha

6. P-IDTMS (2026)
   - PNP-ITMS Internship Daily Time Record Management System
   - Enterprise web application for tracking intern attendance via QR/identity verification, DTR logging, and supervisor evaluations
   - Tech: React, TypeScript, Node.js, Express, Supabase
   - Live at: https://pnp-itms-internship-attendance.vercel.app/
   - Repository: https://github.com/Akosidakdok/PNP-ITMS-INTERNSHIP-ATTENDANCE

7. PAIS 2.0 (2026)
   - PNP-ITMS Personnel and Assignment Information System
   - Comprehensive enterprise HR directory automating promotions, rank-aware time-in-grade calculations, service histories, and PDF report generation
   - Tech: React, TypeScript, Tailwind CSS, Express, Supabase
   - Live at: https://itms-armd-directory-two.vercel.app/
   - Repository: https://github.com/Akosidakdok/ITMS-ARMD-Directory

--- CERTIFICATIONS & CREDENTIALS ---
1. freeCodeCamp: Front-End Development Libraries V8 (July 22, 2026, ~300 hours) - Verified: https://freecodecamp.org/certification/jay-baldonado/front-end-development-libraries
2. freeCodeCamp: Legacy Responsive Web Design V8 (July 22, 2026, ~300 hours) - Verified: https://freecodecamp.org/certification/jay-baldonado/responsive-web-design
3. Code.org: AI for Oceans Hour of Code (2026) - Computer Science & AI ML Classification concepts


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
  "What certifications does CJ have?",
  "How can I contact CJ?",
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
    { role: 'assistant', text: "Hey there! 👋 I'm CJ Bot (accompanied by Sussy from Codex Pets!). Ask me anything about CJ's skills, projects, or background — and feel free to drag me anywhere on your screen!" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pulse, setPulse] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Draggable state */
  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    if (typeof window === 'undefined') return { x: 0, y: 0 };
    return {
      x: Math.max(16, window.innerWidth - 78 - 24),
      y: Math.max(16, window.innerHeight - 78 - 24),
    };
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const dragStartRef = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    hasMoved: boolean;
  }>({ startX: 0, startY: 0, origX: 0, origY: 0, hasMoved: false });

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

  /* Keep Sussy within viewport on window resize */
  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => {
        const btnSize = 78;
        return {
          x: Math.min(Math.max(12, prev.x), window.innerWidth - btnSize - 12),
          y: Math.min(Math.max(12, prev.y), window.innerHeight - btnSize - 12),
        };
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /* Pointer drag handler for both mouse and touch */
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return; // primary button only
    e.preventDefault();

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: position.x,
      origY: position.y,
      hasMoved: false,
    };

    const handlePointerMove = (moveEvt: PointerEvent) => {
      const dx = moveEvt.clientX - dragStartRef.current.startX;
      const dy = moveEvt.clientY - dragStartRef.current.startY;

      if (!dragStartRef.current.hasMoved && Math.hypot(dx, dy) > 4) {
        dragStartRef.current.hasMoved = true;
        setIsDragging(true);
      }

      if (dragStartRef.current.hasMoved) {
        const btnSize = 78;
        const newX = Math.min(
          Math.max(12, dragStartRef.current.origX + dx),
          window.innerWidth - btnSize - 12
        );
        const newY = Math.min(
          Math.max(12, dragStartRef.current.origY + dy),
          window.innerHeight - btnSize - 12
        );
        setPosition({ x: newX, y: newY });
      }
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);

      if (dragStartRef.current.hasMoved) {
        // It was a drag: don't toggle chat window
        setTimeout(() => setIsDragging(false), 50);
      } else {
        // It was a click: toggle chat window
        setIsDragging(false);
        setOpen(prev => !prev);
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  };

  /* Dynamic Sussy animation frame */
  const sussySprite = isDragging
    ? sussyRunWebp
    : isHovered && !open
    ? sussyWaveWebp
    : sussyIdleWebp;

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
          0%, 100% { box-shadow: 0 0 16px rgba(6,182,212,0.4), 0 0 32px rgba(225,29,72,0.2); }
          50%       { box-shadow: 0 0 28px rgba(6,182,212,0.7), 0 0 56px rgba(225,29,72,0.4); }
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
        .cj-chat-scrollbar::-webkit-scrollbar-thumb { background: rgba(6,182,212,0.35); border-radius: 4px; }
        .quick-btn:hover { background: rgba(225,29,72,0.15) !important; border-color: #f43f5e !important; color: #f43f5e !important; transform: translateY(-1px); }
        .send-btn:hover { background: #0284c7 !important; transform: scale(1.05); }
        .send-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }
        .chat-toggle-btn:hover { transform: scale(1.06); }
      `}</style>

      {/* ── CHAT WINDOW (Anchored to Draggable Sussy) ── */}
      {open && (() => {
        const w = typeof window !== 'undefined' ? window.innerWidth : 1024;
        const h = typeof window !== 'undefined' ? window.innerHeight : 768;
        const chatWidth = Math.min(380, w - 32);
        const chatHeight = Math.min(520, h - 120);

        let left: number;
        let top: number;

        if (position.x + 78 / 2 > w / 2) {
          left = position.x + 78 - chatWidth;
        } else {
          left = position.x;
        }
        left = Math.max(16, Math.min(left, w - chatWidth - 16));

        if (position.y > chatHeight + 24) {
          top = position.y - chatHeight - 14;
        } else {
          top = position.y + 78 + 14;
        }
        top = Math.max(16, Math.min(top, h - chatHeight - 16));

        return (
          <div
            className="chat-slide-up"
            style={{
              position: 'fixed',
              left: `${left}px`,
              top: `${top}px`,
              width: `${chatWidth}px`,
              height: `${chatHeight}px`,
              borderRadius: '20px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid rgba(6,182,212,0.35)',
              background: 'rgba(8,12,24,0.97)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.85), 0 0 0 1px rgba(6,182,212,0.15), 0 0 40px rgba(6,182,212,0.15)',
              pointerEvents: 'all',
              zIndex: 9998,
            }}
          >
            {/* ── HEADER ── */}
            <div
              style={{
                padding: '14px 16px',
                background: 'linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(30,15,35,0.98) 100%)',
                borderBottom: '1px solid rgba(6,182,212,0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flexShrink: 0,
              }}
            >
              {/* Sussy icon in header */}
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0284c7, #e11d48)',
                  border: '1.5px solid rgba(6,182,212,0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  flexShrink: 0,
                  boxShadow: '0 0 12px rgba(6,182,212,0.35)',
                }}
              >
                <img src={sussyAvatarImg} alt="Sussy" style={{ width: '85%', height: '85%', objectFit: 'contain' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-condensed, sans-serif)', fontWeight: 700, fontSize: '0.92rem', color: '#fff', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>CJ BOT</span>
                  <span style={{ fontSize: '0.55rem', padding: '1px 5px', borderRadius: '4px', background: 'rgba(6,182,212,0.2)', color: '#38bdf8', border: '1px solid rgba(6,182,212,0.4)', letterSpacing: '0.05em' }}>SUSSY</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e', flexShrink: 0 }} />
                  <span style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    AI · Online · Draggable
                  </span>
                </div>
              </div>
              {/* Cyan to Pink accent line */}
              <div style={{ width: '3px', height: '32px', borderRadius: '2px', background: 'linear-gradient(to bottom, #06b6d4, #e11d48)', flexShrink: 0 }} />
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
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', overflow: 'hidden', background: 'linear-gradient(135deg,#0284c7,#e11d48)', border: '1px solid rgba(6,182,212,0.4)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={sussyAvatarImg} alt="Sussy" style={{ width: '85%', height: '85%', objectFit: 'contain' }} />
                    </div>
                  )}
                  <div
                    style={{
                      maxWidth: '75%',
                      padding: '10px 14px',
                      borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      background: msg.role === 'user'
                        ? 'linear-gradient(135deg, #0284c7, #e11d48)'
                        : 'rgba(255,255,255,0.06)',
                      border: msg.role === 'user'
                        ? '1px solid rgba(6,182,212,0.4)'
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
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', overflow: 'hidden', background: 'linear-gradient(135deg,#0284c7,#e11d48)', border: '1px solid rgba(6,182,212,0.4)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={sussyAvatarImg} alt="Sussy" style={{ width: '85%', height: '85%', objectFit: 'contain' }} />
                  </div>
                  <div style={{ padding: '12px 16px', borderRadius: '16px 16px 16px 4px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <span className="dot1" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#06b6d4', display: 'inline-block' }} />
                    <span className="dot2" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#06b6d4', display: 'inline-block' }} />
                    <span className="dot3" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#06b6d4', display: 'inline-block' }} />
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
                    border: '1px solid rgba(6,182,212,0.3)',
                    background: 'rgba(6,182,212,0.08)',
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
                padding: '12px 14px',
                borderTop: '1px solid rgba(6,182,212,0.2)',
                background: 'rgba(15,23,42,0.98)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexShrink: 0,
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask about CJ's work, skills..."
                disabled={loading}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '9px 13px',
                  color: '#fff',
                  fontSize: '0.78rem',
                  fontFamily: 'system-ui, sans-serif',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => (e.target.style.borderColor = 'rgba(6,182,212,0.6)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
              <button
                className="send-btn"
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #0284c7, #e11d48)',
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
        );
      })()}

      {/* ── DRAGGABLE SUSSY PET BUTTON ── */}
      <div
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 9999,
          touchAction: 'none',
          userSelect: 'none',
          pointerEvents: 'all',
        }}
      >
        {/* Pulse ring when closed */}
        {!open && pulse && (
          <div
            style={{
              position: 'absolute',
              inset: '-6px',
              borderRadius: '50%',
              border: '2px solid rgba(6,182,212,0.6)',
              animation: 'bot-pulse-ring 0.6s ease-out forwards',
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Glow orb behind Sussy */}
        <div
          style={{
            position: 'absolute',
            bottom: '-6px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '74px',
            height: '22px',
            borderRadius: '50%',
            background: open
              ? 'rgba(239,68,68,0.35)'
              : isDragging
              ? 'rgba(6,182,212,0.6)'
              : 'rgba(6,182,212,0.35)',
            filter: 'blur(9px)',
            transition: 'background 0.4s',
            animation: !isDragging ? 'glow-pulse 2.5s ease-in-out infinite' : 'none',
            pointerEvents: 'none',
          }}
        />

        {/* Sussy interactive draggable button */}
        <div
          role="button"
          tabIndex={0}
          onPointerDown={handlePointerDown}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label={open ? 'Close CJ Bot (Sussy)' : 'Open CJ Bot (Sussy - Draggable)'}
          className={`chat-toggle-btn ${!open && !isDragging ? 'bot-float' : ''}`}
          title="Drag to reposition · Click to chat"
          style={{
            width: '78px',
            height: '78px',
            borderRadius: '50%',
            border: `2.5px solid ${
              open
                ? 'rgba(239,68,68,0.7)'
                : isDragging
                ? 'rgba(6,182,212,0.95)'
                : 'rgba(6,182,212,0.65)'
            }`,
            background: 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(28,12,32,0.95) 100%)',
            cursor: isDragging ? 'grabbing' : 'grab',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            transition: isDragging
              ? 'none'
              : 'border-color 0.3s, transform 0.2s, box-shadow 0.3s',
            boxShadow: open
              ? '0 0 0 3px rgba(239,68,68,0.25), 0 8px 32px rgba(0,0,0,0.7)'
              : isDragging
              ? '0 0 0 4px rgba(6,182,212,0.4), 0 16px 40px rgba(0,0,0,0.85), 0 0 24px rgba(6,182,212,0.5)'
              : '0 0 0 3px rgba(6,182,212,0.18), 0 8px 30px rgba(0,0,0,0.65), 0 0 16px rgba(6,182,212,0.25)',
            transform: isDragging ? 'scale(1.12)' : undefined,
            position: 'relative',
          }}
        >
          {/* Inner radial tint */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 50% 35%, rgba(6,182,212,0.18) 0%, transparent 75%)',
              pointerEvents: 'none',
            }}
          />

          {/* Sussy character sprite */}
          <img
            src={sussySprite}
            alt="Sussy Codex Pet"
            draggable={false}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.5))',
              pointerEvents: 'none',
              transform: isDragging ? 'scale(1.05)' : undefined,
              transition: 'transform 0.15s ease',
            }}
          />

          {/* Online status indicator */}
          <span
            style={{
              position: 'absolute',
              bottom: '4px',
              right: '4px',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#22c55e',
              border: '2px solid rgba(15,23,42,0.95)',
              boxShadow: '0 0 8px #22c55e',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* "ASK ME!" label tag - only when closed */}
        {!open && (
          <div
            style={{
              position: 'absolute',
              top: '-10px',
              right: '-4px',
              background: isDragging
                ? 'linear-gradient(135deg, #0284c7, #06b6d4)'
                : 'linear-gradient(135deg, #0284c7, #e11d48)',
              color: '#fff',
              fontFamily: 'monospace',
              fontSize: '0.52rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '3px 8px',
              borderRadius: '20px',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
              pointerEvents: 'none',
            }}
          >
            {isDragging ? 'DRAGGING...' : 'ASK ME!'}
          </div>
        )}

        {/* Drag tooltip hint on hover when closed */}
        {!open && isHovered && !isDragging && (
          <div
            style={{
              position: 'absolute',
              bottom: '-22px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#94a3b8',
              fontFamily: 'monospace',
              fontSize: '0.48rem',
              letterSpacing: '0.1em',
              padding: '2px 7px',
              borderRadius: '6px',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}
          >
            DRAGGABLE · CLICK
          </div>
        )}
      </div>
    </>
  );
}
