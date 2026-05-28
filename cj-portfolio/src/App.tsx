import { useEffect, useState, useCallback } from 'react';
import './App.css';
import profileImg from './assets/profile.png';
import FilmStrip from './FilmStrip';

/* ─── Crosshair / Radar SVG Background ─── */
function CrosshairBg() {
  return (
    <div className="crosshair-bg" aria-hidden="true">
      <svg
        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '900px', height: '900px', opacity: 0.07 }}
        viewBox="0 0 900 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="450" cy="450" r="400" stroke="white" strokeWidth="1" />
        <circle cx="450" cy="450" r="280" stroke="white" strokeWidth="1" />
        <circle cx="450" cy="450" r="160" stroke="white" strokeWidth="1" />
        <circle cx="450" cy="450" r="60"  stroke="white" strokeWidth="1" />
        {/* crosshair lines */}
        <line x1="450" y1="10"  x2="450" y2="130" stroke="white" strokeWidth="1" />
        <line x1="450" y1="770" x2="450" y2="890" stroke="white" strokeWidth="1" />
        <line x1="10"  y1="450" x2="130" y2="450" stroke="white" strokeWidth="1" />
        <line x1="770" y1="450" x2="890" y2="450" stroke="white" strokeWidth="1" />
        {/* tick marks */}
        {[0,45,90,135,180,225,270,315].map(deg => {
          const rad = (deg * Math.PI) / 180;
          const cx = 450, cy = 450, r1 = 395, r2 = 415;
          const x1 = cx + r1 * Math.cos(rad);
          const y1 = cy + r1 * Math.sin(rad);
          const x2 = cx + r2 * Math.cos(rad);
          const y2 = cy + r2 * Math.sin(rad);
          return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="1.5" />;
        })}
      </svg>
      {/* Animated ping ring */}
      <div
        className="radar-ping"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '600px',
          height: '600px',
          marginLeft: '-300px',
          marginTop: '-300px',
          borderRadius: '50%',
          border: '1px solid rgba(227,30,36,0.3)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

/* ─── Stat Badge ─── */
function StatBadge({ label, value, active = false }: { label: string; value: string; active?: boolean }) {
  return (
    <div className={`stat-badge ${active ? 'active-badge' : ''}`}>
      <span className="stat-badge-value">{value}</span>
      <span className="stat-badge-label">{label}</span>
    </div>
  );
}

/* ─── Star Rating ─── */
function Stars({ filled = 4, total = 5 }: { filled?: number; total?: number }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={i < filled ? 'star' : 'star-empty'}>★</span>
      ))}
    </div>
  );
}

/* ─── Skill Group ─── */
function SkillGroup({ icon, title, tags, dark = true }: { icon: string; title: string; tags: string[]; dark?: boolean }) {
  return (
    <div
      style={{
        padding: '28px',
        borderRadius: '16px',
        border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)'}`,
        background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.3s, box-shadow 0.3s',
      }}
      className="interactive-card"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <span style={{ fontSize: '1.1rem' }}>{icon}</span>
        <span
          style={{
            fontFamily: 'var(--font-condensed)',
            fontWeight: 700,
            fontSize: '1rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: dark ? 'var(--white)' : '#111',
          }}
        >
          {title}
        </span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {tags.map(tag => (
          <span key={tag} className={dark ? 'skill-tag' : 'skill-tag-light'}>{tag}</span>
        ))}
      </div>
    </div>
  );
}

/* ─── Project Card (dark booking-style) ─── */
function ProjectCard({ title, stack, link, description, venue, date }: {
  title: string;
  stack: string[];
  link: string;
  description: string;
  venue: string;
  date: string;
}) {
  return (
    <div className="project-card-dark interactive-card" style={{ maxWidth: '320px', width: '100%' }}>
      {/* Card Header */}
      <div style={{ background: 'var(--red)', padding: '6px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.15em', color: 'var(--white)', textTransform: 'uppercase' }}>Project</span>
      </div>
      {/* Card Body */}
      <div style={{ padding: '24px 20px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', letterSpacing: '0.04em', color: 'var(--white)', marginBottom: '16px' }}>
          {title}
        </h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--gray-light)', lineHeight: 1.6, marginBottom: '20px' }}>
          {description}
        </p>
        {/* Meta rows */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {stack.map(s => (
              <span key={s} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(227,30,36,0.15)', border: '1px solid rgba(227,30,36,0.3)', color: '#ff8a8a', letterSpacing: '0.06em' }}>
                {s}
              </span>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gray)', marginBottom: '4px' }}>VENUE</div>
              <div style={{ fontFamily: 'var(--font-condensed)', fontWeight: 700, fontSize: '0.85rem', color: 'var(--white)', textTransform: 'uppercase' }}>{venue}</div>
            </div>
            <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gray)', marginBottom: '4px' }}>YEAR</div>
              <div style={{ fontFamily: 'var(--font-condensed)', fontWeight: 700, fontSize: '0.85rem', color: 'var(--white)' }}>{date}</div>
            </div>
          </div>
        </div>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-cta-red"
          style={{ marginTop: '20px', width: '100%', justifyContent: 'center', fontSize: '0.75rem' }}
        >
          View Project <span>↗</span>
        </a>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  PROJECT DATA                                               */
/* ══════════════════════════════════════════════════════════ */
interface Project {
  id: string;
  label: string;
  title: string;
  stack: string[];
  link: string;
  description: string;
  venue: string;
  date: string;
  longDesc: string;
  color: string;
}

const PROJECTS: Project[] = [
  {
    id: '1',
    label: 'PROJECT A',
    title: 'FEASIFY',
    stack: ['React', 'TypeScript', 'Gemini AI', 'Firebase'],
    link: 'https://github.com/Akosidakdok',
    description: 'AI-powered financial feasibility system. Automates complex model generation for finance students with real-time AI assistance.',
    venue: 'WEB APP',
    date: '2026',
    longDesc: 'AI-assisted financial feasibility web system built for BSBA FM students. Automates the generation of financial parameters and complex system architecture using Gemini Flash AI.',
    color: '#E31E24',
  },
  {
    id: '2',
    label: 'PROJECT B',
    title: 'Barangay-Equipment-Borrowing-and-Tracking-System',
    stack: ['Software Developtment', 'HTML/CSS', 'Firebase'],
    link: '#',
    description: 'Developed a web-based application for tracking and borrowing local barangay equipment, streamlining the inventory management process',
    venue: 'WEB APP',
    date: '2025',
    longDesc: 'Designed and implemented a responsive interface using HTML5 and CSS3, ensuring seamless navigation for community users and staff.',
    color: '#333333',
  },
  {
    id: '3',
    label: 'PROJECT C',
    title: 'PORTFOLIO SITE',
    stack: ['React', 'TypeScript', 'Tailwind', 'Vite'],
    link: '#about',
    description: 'This very portfolio. Cinematic editorial design with animated film strips, crosshair motifs, and scroll reveals.',
    venue: 'WEB APP',
    date: '2026',
    longDesc: 'Personal portfolio built with React and TypeScript. Features a cinematic black/red editorial aesthetic inspired by bold film UI design, with Bebas Neue display typography and animated components.',
    color: '#6B21A8',
  },
  {
    id: '4',
    label: 'PROJECT D',
    title: 'Mang Delfins Putong Pulo Website',
    stack: ['HTML/CSS', 'JavaScript', 'PHP'],
    link: '#about',
    description: 'Engineered a highly responsive, multi-page marketing and storefront platform to showcase local delicacies, significantly enhancing the business digital presence and customer accessibility.',
    venue: 'WEB APP',
    date: '2025',
    longDesc: 'Built interactive product carousels, a custom branch locator, and dynamic product overlay modals utilizing semantic HTML5, CSS3 structural grids, and JavaScript, resulting in a user-friendly experience that boosted online engagement and sales for the local delicacy business.',
    color: '#6B21A8',
  },
];

/* ══════════════════════════════════════════════════════════ */
/*  MAIN APP                                                   */
/* ══════════════════════════════════════════════════════════ */
function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(0);
  const [cardVisible, setCardVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const switchProject = useCallback((nextIndex: number) => {
    setCardVisible(false);
    setTimeout(() => {
      setActiveProject(nextIndex);
      setCardVisible(true);
    }, 280);
  }, []);

  const goPrev = () => {
    switchProject((activeProject - 1 + PROJECTS.length) % PROJECTS.length);
  };

  const goNext = () => {
    switchProject((activeProject + 1) % PROJECTS.length);
  };

  /* Scroll reveal */
  useEffect(() => {
    const classes = ['.reveal', '.reveal-left', '.reveal-right'];
    const selectors = classes.join(', ');
    const reveals = document.querySelectorAll(selectors);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* ────────────────────────────────────────── */}
      {/* NAVBAR                                      */}
      {/* ────────────────────────────────────────── */}
      <nav
        id="navbar"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: 'rgba(13,13,13,0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <a href="#about" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '2px' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', letterSpacing: '0.05em', color: 'var(--white)' }}>CJ</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--red)', lineHeight: 1 }}>+</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', letterSpacing: '0.05em', color: 'var(--white)' }}>DEV</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: 0 }}>
            {['About', 'Skills', 'Projects', 'Contact'].map((item, i) => (
              <span key={item} style={{ display: 'flex', alignItems: 'center' }}>
                {i > 0 && (
                  <span style={{ color: 'var(--red)', fontSize: '0.4rem', margin: '0 10px', verticalAlign: 'middle' }}>●</span>
                )}
                <a
                  href={`#${item.toLowerCase()}`}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'var(--gray-light)',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--white)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--gray-light)')}
                >
                  {item}
                </a>
              </span>
            ))}
          </div>

          {/* Right Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <a href="/Baldonado-Resume.pdf" download className="icon-btn" title="Download Resume" style={{ textDecoration: 'none', fontSize: '0.85rem' }}>
              ↓
            </a>
            <a href="https://github.com/Akosidakdok" target="_blank" rel="noopener noreferrer" className="icon-btn" title="GitHub" style={{ textDecoration: 'none', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
              GH
            </a>
            <button
              className="icon-btn md:hidden"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Toggle menu"
              style={{ fontSize: '1.2rem' }}
            >
              {menuOpen ? '✕' : '≡'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{ background: 'var(--bg-darker)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {['About', 'Skills', 'Projects', 'Contact'].map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--white)',
                  textDecoration: 'none',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  paddingBottom: '16px',
                }}
              >
                {item}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* ────────────────────────────────────────── */}
      {/* HERO SECTION                               */}
      {/* ────────────────────────────────────────── */}
      <section
        id="about"
        style={{
          position: 'relative',
          minHeight: '100vh',
          background: 'var(--bg-dark)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: isMobile ? 'flex-start' : 'flex-end',
          paddingTop: isMobile ? '80px' : 0,
        }}
      >
        <CrosshairBg />

        {/* Red circle behind profile */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -44%)',
            width: isMobile ? '320px' : '520px',
            height: isMobile ? '320px' : '520px',
            borderRadius: '50%',
            background: 'var(--red)',
            opacity: 0.18,
            filter: 'blur(60px)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {/* ── MOBILE LAYOUT ── */}
        {isMobile ? (
          <div style={{ position: 'relative', zIndex: 5, display: 'flex', flexDirection: 'column', flex: 1 }}>

            {/* Top tags row */}
            <div style={{ padding: '12px 20px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <span className="pill-tag">Front-End</span>
              <span className="pill-tag">React</span>
              <span className="pill-tag">Networking</span>
              <span className="pill-tag">Cybersecurity</span>
            </div>

            {/* Giant title */}
            <div style={{ textAlign: 'center', padding: '0 12px', marginTop: '8px' }}>
              <h1
                className="reveal"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(3.8rem, 18vw, 6rem)',
                  lineHeight: 0.9,
                  color: 'var(--white)',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.01em',
                }}
              >
                CJ BALDONADO
              </h1>
            </div>

            {/* Profile image — in flow on mobile */}
            <div
              className="reveal delay-100"
              style={{
                width: '72%',
                maxWidth: '300px',
                margin: '0 auto',
                position: 'relative',
                zIndex: 10,
                marginTop: '-16px',
              }}
            >
              <img
                src={profileImg}
                alt="Christian James D. Baldonado"
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                  objectPosition: 'top center',
                  display: 'block',
                  filter: 'drop-shadow(0 -12px 40px rgba(0,0,0,0.9))',
                }}
              />
            </div>

            {/* Bottom info */}
            <div
              style={{
                background: 'linear-gradient(to top, rgba(13,13,13,1) 0%, rgba(13,13,13,0.95) 100%)',
                padding: '20px 20px 32px',
                marginTop: '-32px',
                position: 'relative',
                zIndex: 15,
              }}
            >
              <span className="section-label-dark" style={{ fontSize: '0.55rem' }}>FRONT END DEVELOPER/ NETWORKING / CYBER SECURITY</span>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--gray)', lineHeight: 1.7, margin: '10px 0 20px' }}>
                BSIT Student at PLV. Building modern web apps &amp; data-driven systems.
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <a href="#contact" className="btn-cta" style={{ fontSize: '0.72rem', padding: '11px 20px' }}>
                  Hire Me ↗
                </a>
                <a href="#projects" className="btn-cta-red" style={{ fontSize: '0.72rem', padding: '11px 20px' }}>
                  View Work →
                </a>
              </div>
            </div>
          </div>

        ) : (
          /* ── DESKTOP LAYOUT ── */
          <>
            {/* Top meta row */}
            <div
              style={{
                position: 'absolute',
                top: '80px',
                left: 0,
                right: 0,
                padding: '0 32px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 5,
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span className="pill-tag">Front-End</span>
                <span className="pill-tag">React</span>
                <span className="pill-tag">Networking</span>
                <span className="pill-tag">Cybersecurity</span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gray)' }}>
                AVAILABLE [2026]
              </span>
            </div>

            {/* Cast / tech row */}
            <div
              style={{
                position: 'absolute',
                top: '140px',
                left: 0,
                right: 0,
                padding: '0 32px',
                display: 'flex',
                justifyContent: 'space-between',
                zIndex: 5,
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              {['REACT.JS', 'TYPESCRIPT', 'NETWORKING', 'GEMINI AI'].map(tech => (
                <span
                  key={tech}
                  style={{
                    fontFamily: 'var(--font-condensed)',
                    fontWeight: 700,
                    fontSize: 'clamp(0.7rem, 1.5vw, 1rem)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.55)',
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* GIANT TITLE */}
            <div
              style={{
                position: 'relative',
                zIndex: 5,
                textAlign: 'center',
                padding: '0 16px',
                pointerEvents: 'none',
                marginBottom: '-24px',
              }}
            >
              <div
                className="reveal"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
                  color: 'var(--white)',
                  letterSpacing: '0.5em',
                  opacity: 0.8,
                  marginBottom: '-16px',
                }}
              >
                ◆
              </div>
              <h1
                className="hero-title-clip reveal delay-100"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(6rem, 15vw, 14rem)',
                  lineHeight: 0.88,
                  letterSpacing: '-0.01em',
                  color: 'var(--white)',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'clip',
                }}
              >
                CJ BALDONADO
              </h1>
            </div>

            {/* Profile image */}
            <div
              style={{
                position: 'absolute',
                bottom: '60px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 15,
                width: 'clamp(260px, 30vw, 420px)',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
              className="reveal delay-200"
            >
              <img
                src={profileImg}
                alt="Christian James D. Baldonado"
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                  objectPosition: 'top center',
                  maxHeight: '520px',
                  display: 'block',
                  filter: 'drop-shadow(0 -20px 60px rgba(0,0,0,0.8))',
                }}
              />
            </div>

            {/* [2026] vertical text */}
            <div
              className="rotate-vert-cw reveal-right delay-300"
              style={{
                position: 'absolute',
                right: '24px',
                bottom: '120px',
                zIndex: 20,
                fontFamily: 'var(--font-display)',
                fontSize: '1rem',
                letterSpacing: '0.3em',
                color: 'var(--white)',
                opacity: 0.5,
              }}
            >
              [2026]
            </div>

            {/* Bottom info row */}
            <div
              style={{
                position: 'relative',
                zIndex: 20,
                padding: '24px 32px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                flexWrap: 'wrap',
                gap: '16px',
                background: 'linear-gradient(to top, rgba(13,13,13,1) 0%, rgba(13,13,13,0) 100%)',
                paddingTop: '80px',
              }}
            >
              <div className="reveal" style={{ maxWidth: '320px' }}>
                <span className="section-label-dark" style={{ marginBottom: '8px' }}>FRONT END DEVELOPER / NETWORKING / CYBER SECURITY</span>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--gray)', lineHeight: 1.7, marginTop: '10px' }}>
                  BSIT Student at PLV. Building modern web apps &amp; data-driven systems. Specializing in React frontends with AI integrations.
                </p>
              </div>
              <div className="reveal delay-200" style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <a href="#contact" className="btn-cta">Hire Me <span>↗</span></a>
                <a href="#projects" className="btn-cta-red">View Work →</a>
              </div>
            </div>
          </>
        )}
      </section>

      {/* ────────────────────────────────────────── */}
      {/* FILM STRIP                                 */}
      {/* ────────────────────────────────────────── */}
      <FilmStrip />

      {/* ────────────────────────────────────────── */}
      {/* SKILLS / PRODUCTION SECTION (Dark)         */}
      {/* ────────────────────────────────────────── */}
      <section
        id="skills"
        style={{
          position: 'relative',
          background: 'var(--bg-darker)',
          padding: '80px 0 100px',
          overflow: 'hidden',
        }}
      >
        {/* Faint radar bg */}
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.04, pointerEvents: 'none' }}>
          <svg width="700" height="700" viewBox="0 0 700 700" fill="none">
            <circle cx="350" cy="350" r="340" stroke="white" strokeWidth="1" />
            <circle cx="350" cy="350" r="220" stroke="white" strokeWidth="1" />
            <circle cx="350" cy="350" r="100" stroke="white" strokeWidth="1" />
          </svg>
        </div>

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 5 }}>

          {/* Section header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '60px' }}>
            <div className="reveal">
              <span className="section-label-dark">TECHNICAL ARSENAL</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '0.04em', color: 'var(--white)', marginTop: '8px', lineHeight: 1 }}>
                SKILLS &amp; STACK
              </h2>
            </div>
            {/* Stars + rating */}
            <div className="reveal delay-200" style={{ textAlign: 'right' }}>
              <Stars filled={4} total={5} />
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--gray)', marginTop: '6px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Proficiency Rating
              </p>
            </div>
          </div>

          {/* Stat badges row */}
          <div
            className="reveal delay-100"
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              flexWrap: 'wrap',
              marginBottom: '64px',
            }}
          >
            <StatBadge label="YEARS EXP" value='3+"' />
            <StatBadge label="PROJECTS" value="5+" active />
            <StatBadge label="TECH STACK" value="5+" />
            <StatBadge label="FRAMEWORKS" value="4+" />
          </div>

          {/* Quote */}
          <div className="reveal delay-200" style={{ textAlign: 'center', maxWidth: '560px', margin: '0 auto 64px' }}>
            <div className="quote-mark">"</div>
            <p style={{ fontFamily: 'var(--font-condensed)', fontWeight: 600, fontSize: '1.15rem', letterSpacing: '0.04em', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, textTransform: 'uppercase' }}>
              Passionate about building modern, scalable systems — where clean code meets exceptional user experience.
            </p>
          </div>

          {/* Skill groups grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            <div className="reveal delay-100">
              <SkillGroup icon="⟨/⟩" title="Frontend" tags={['React.js', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind']} />
            </div>
            <div className="reveal delay-200">
              <SkillGroup icon="⚙" title="Backend & APIs" tags={['OpenAI API', 'Gemini API', 'Node.js']} />
            </div>
            <div className="reveal delay-300">
              <SkillGroup icon="⬡" title="Networking" tags={['Protocols', 'Subnetting', 'IP Config', 'VLAN']} />
            </div>
            <div className="reveal delay-400">
              <SkillGroup icon="★" title="Core Strengths" tags={['Agile', 'Problem-Solving', 'Analytical', 'Team Collab']} />
            </div>
          </div>

        </div>
      </section>

      {/* ────────────────────────────────────────── */}
      {/* FILM STRIP 2                               */}
      {/* ────────────────────────────────────────── */}
      <FilmStrip />

      {/* ────────────────────────────────────────── */}
      {/* DIRECTOR / ABOUT SPLIT SECTION             */}
      {/* ────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          background: 'var(--bg-dark)',
          overflow: 'hidden',
        }}
      >
        {/* Top dark half */}
        <div style={{ padding: '80px 32px 60px', maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '32px' }}>

            {/* Left: PLV badge */}
            <div className="reveal" style={{ maxWidth: '300px' }}>
              <span className="section-label-dark" style={{ marginBottom: '16px' }}>EDUCATION</span>
              <div style={{ marginTop: '16px', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', letterSpacing: '0.1em', color: 'var(--white)', marginBottom: '4px' }}>
                  PAMANTASAN
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.08em', color: 'var(--gray-light)' }}>
                  NG LUNGSOD NG VALENZUELA
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--gray)', marginTop: '8px', letterSpacing: '0.1em' }}>
                  BSIT — GRADUATING 2027
                </div>
              </div>
            </div>

            {/* Center: numbered section nav links */}
            <div className="reveal delay-200" style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
              {[
                { n: '01', label: 'ABOUT',    href: '#about'    },
                { n: '02', label: 'SKILLS',   href: '#skills'   },
                { n: '03', label: 'PROJECTS', href: '#projects' },
                { n: '04', label: 'CONTACT',  href: '#contact'  },
              ].map(({ n, label, href }) => (
                <a
                  key={n}
                  href={href}
                  style={{
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget;
                    (el.querySelector('.num-txt') as HTMLElement).style.color = 'var(--red)';
                    (el.querySelector('.num-bar') as HTMLElement).style.background = 'var(--red)';
                    (el.querySelector('.num-lbl') as HTMLElement).style.color = 'var(--red)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget;
                    (el.querySelector('.num-txt') as HTMLElement).style.color = 'rgba(255,255,255,0.3)';
                    (el.querySelector('.num-bar') as HTMLElement).style.background = 'rgba(255,255,255,0.15)';
                    (el.querySelector('.num-lbl') as HTMLElement).style.color = 'rgba(255,255,255,0.35)';
                  }}
                >
                  <span
                    className="num-txt"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.5rem',
                      color: 'rgba(255,255,255,0.3)',
                      letterSpacing: '0.05em',
                      transition: 'color 0.2s',
                    }}
                  >
                    {n}
                  </span>
                  <div
                    className="num-bar"
                    style={{
                      width: '24px',
                      height: '2px',
                      background: 'rgba(255,255,255,0.15)',
                      borderRadius: '2px',
                      transition: 'background 0.2s',
                    }}
                  />
                  <span
                    className="num-lbl"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.5rem',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.35)',
                      transition: 'color 0.2s',
                    }}
                  >
                    {label}
                  </span>
                </a>
              ))}
            </div>

            {/* Right: quick facts */}
            <div className="reveal delay-300" style={{ maxWidth: '260px' }}>
              <span className="section-label-dark" style={{ marginBottom: '12px' }}>QUICK FACTS</span>
              <ul style={{ listStyle: 'none', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  ['📍', 'Valenzuela City, PH'],
                  ['💼', 'Seeking Internship'],
                  ['💼', 'Freelance Web Developer'],
                  ['🧠', 'Front-End+ AI / NETWORKING / CYBER SECURITY'],
                  ['📧', 'cjbaldonado11@gmail.com'],
                ].map(([icon, text]) => (
                  <li key={text} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem' }}>{icon}</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--gray-light)' }}>{text}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* "DIRECTED BY" style full-width bold text */}
        <div
          style={{
            background: 'var(--bg-light)',
            overflow: 'hidden',
            padding: '40px 0 32px',
            borderTop: '1px solid rgba(0,0,0,0.1)',
          }}
        >
          <div className="reveal" style={{ padding: '0 32px', marginBottom: '12px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999' }}>
              GALLERY 01 / 04
            </span>
          </div>
          <div
            className="reveal"
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '20px',
              padding: '0 32px',
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3rem, 8vw, 7.5rem)',
                color: '#111',
                lineHeight: 0.9,
                textTransform: 'uppercase',
                letterSpacing: '-0.01em',
              }}
            >
              DEVELOPED
            </span>
            <span
              style={{
                fontFamily: 'var(--font-condensed)',
                fontWeight: 400,
                fontSize: 'clamp(1rem, 2.5vw, 2rem)',
                color: '#888',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              BY
            </span>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3rem, 8vw, 7.5rem)',
                color: '#111',
                lineHeight: 0.9,
                textTransform: 'uppercase',
                letterSpacing: '-0.01em',
              }}
            >
              PASSION
            </span>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────── */}
      <section
        id="projects"
        style={{
          background: 'var(--bg-light)',
          padding: '80px 32px 100px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

          {/* Numbered section tabs — active follows activeProject */}
          <div style={{ display: 'flex', gap: '32px', marginBottom: '48px', alignItems: 'center' }}>
            {PROJECTS.map((p, i) => (
              <button
                key={p.id}
                onClick={() => switchProject(i)}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '4px',
                  transition: 'opacity 0.2s',
                  opacity: i === activeProject ? 1 : 0.45,
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: i === activeProject ? 'var(--red)' : '#aaa', letterSpacing: '0.12em' }}>
                  0{i + 1}
                </span>
                <div style={{ width: '24px', height: '2px', background: i === activeProject ? 'var(--red)' : 'rgba(0,0,0,0.15)', borderRadius: '2px', transition: 'background 0.3s' }} />
              </button>
            ))}
          </div>

          {/* Section title */}
          <div className="reveal" style={{ marginBottom: '64px', textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 4rem)', color: '#111', letterSpacing: '0.04em', textTransform: 'uppercase', lineHeight: 1.05 }}>
              FEATURED WORK:<br />PROJECTS &amp; BUILDS
            </h2>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
              {PROJECTS.map((p, i) => (
                <div
                  key={p.id}
                  style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: p.color,
                    border: '3px solid var(--bg-light)',
                    marginLeft: i > 0 ? '-10px' : 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.65rem', color: 'white',
                    fontFamily: 'var(--font-condensed)', fontWeight: 700,
                    opacity: i === activeProject ? 1 : 0.5,
                    transition: 'opacity 0.3s',
                    cursor: 'pointer',
                    zIndex: i === activeProject ? 2 : 1,
                    position: 'relative',
                  }}
                  onClick={() => switchProject(i)}
                >
                  {p.id}
                </div>
              ))}
            </div>
          </div>

          {/* Responsive layout: 3-col desktop / single-col mobile */}
          {isMobile ? (
            /* ── MOBILE: stacked card + active info ── */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px' }}>
              {/* Active card */}
              <div
                style={{
                  width: '100%', maxWidth: '340px',
                  opacity: cardVisible ? 1 : 0,
                  transform: cardVisible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.97)',
                  transition: 'opacity 0.28s ease, transform 0.28s ease',
                }}
              >
                <ProjectCard
                  title={PROJECTS[activeProject].title}
                  stack={PROJECTS[activeProject].stack}
                  link={PROJECTS[activeProject].link}
                  description={PROJECTS[activeProject].description}
                  venue={PROJECTS[activeProject].venue}
                  date={PROJECTS[activeProject].date}
                />
              </div>
              {/* Active project description below card */}
              <div
                style={{
                  width: '100%', maxWidth: '340px',
                  opacity: cardVisible ? 1 : 0,
                  transition: 'opacity 0.28s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: PROJECTS[activeProject].color }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#666' }}>
                    {PROJECTS[activeProject].label}
                  </span>
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: '#555', lineHeight: 1.7 }}>
                  {PROJECTS[activeProject].longDesc}
                </p>
              </div>
            </div>
          ) : (
            /* ── DESKTOP: 3-column ── */
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                gap: '40px',
                alignItems: 'center',
              }}
            >
              {/* Left — previous project info */}
              {(() => {
                const prev = PROJECTS[(activeProject - 1 + PROJECTS.length) % PROJECTS.length];
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', opacity: cardVisible ? 1 : 0, transition: 'opacity 0.28s ease' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: prev.color }} />
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888' }}>{prev.label}</span>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-condensed)', fontWeight: 700, fontSize: '1rem', color: '#444', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{prev.title}</h3>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#777', lineHeight: 1.7 }}>{prev.longDesc}</p>
                    <button onClick={goPrev} style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--red)', marginTop: '4px', transition: 'gap 0.2s' }} onMouseEnter={e => (e.currentTarget.style.gap = '12px')} onMouseLeave={e => (e.currentTarget.style.gap = '6px')}>← PREV</button>
                  </div>
                );
              })()}

              {/* Center — active project card */}
              <div style={{ position: 'relative', zIndex: 10, opacity: cardVisible ? 1 : 0, transform: cardVisible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.97)', transition: 'opacity 0.28s ease, transform 0.28s ease' }}>
                <ProjectCard
                  title={PROJECTS[activeProject].title}
                  stack={PROJECTS[activeProject].stack}
                  link={PROJECTS[activeProject].link}
                  description={PROJECTS[activeProject].description}
                  venue={PROJECTS[activeProject].venue}
                  date={PROJECTS[activeProject].date}
                />
              </div>

              {/* Right — next project info */}
              {(() => {
                const next = PROJECTS[(activeProject + 1) % PROJECTS.length];
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', opacity: cardVisible ? 1 : 0, transition: 'opacity 0.28s ease' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: next.color }} />
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888' }}>{next.label}</span>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-condensed)', fontWeight: 700, fontSize: '1rem', color: '#444', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{next.title}</h3>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#777', lineHeight: 1.7 }}>{next.longDesc}</p>
                    <button onClick={goNext} style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--red)', marginTop: '4px', transition: 'gap 0.2s' }} onMouseEnter={e => (e.currentTarget.style.gap = '12px')} onMouseLeave={e => (e.currentTarget.style.gap = '6px')}>NEXT →</button>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Bottom nav bar with circular prev/next buttons + dot indicators */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '24px', marginTop: '60px' }}>
            {/* Prev circular button */}
            <button
              id="proj-prev"
              onClick={goPrev}
              aria-label="Previous project"
              style={{
                width: '52px', height: '52px', borderRadius: '50%',
                border: '2px solid rgba(0,0,0,0.2)',
                background: 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: '1.1rem', color: '#333',
                transition: 'background 0.2s, border-color 0.2s, color 0.2s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'var(--red)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--red)';
                (e.currentTarget as HTMLButtonElement).style.color = 'white';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,0,0,0.2)';
                (e.currentTarget as HTMLButtonElement).style.color = '#333';
              }}
            >
              ←
            </button>

            {/* Dot indicators */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {PROJECTS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => switchProject(i)}
                  aria-label={`Go to project ${i + 1}`}
                  style={{
                    all: 'unset', cursor: 'pointer',
                    width: i === activeProject ? '28px' : '8px',
                    height: '8px',
                    borderRadius: '999px',
                    background: i === activeProject ? 'var(--red)' : 'rgba(0,0,0,0.2)',
                    transition: 'width 0.3s ease, background 0.3s ease',
                  }}
                />
              ))}
            </div>

            {/* Next circular button */}
            <button
              id="proj-next"
              onClick={goNext}
              aria-label="Next project"
              style={{
                width: '52px', height: '52px', borderRadius: '50%',
                background: 'var(--red)',
                border: '2px solid var(--red)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: '1.1rem', color: 'white',
                transition: 'background 0.2s, transform 0.2s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
              }}
            >
              →
            </button>
          </div>

        </div>
      </section>

      {/* ────────────────────────────────────────── */}
      {/* CONTACT / FOOTER (Dark)                    */}
      {/* ────────────────────────────────────────── */}
      <footer
        id="contact"
        style={{
          background: 'var(--bg-dark)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Large text */}
        <div
          style={{
            padding: '80px 32px 0',
            maxWidth: '1280px',
            margin: '0 auto',
          }}
        >
          <div className="reveal" style={{ marginBottom: '8px' }}>
            <span className="section-label-dark">INITIALIZE CONNECTION</span>
          </div>
          <h2
            className="reveal delay-100"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 9vw, 8rem)',
              lineHeight: 0.92,
              letterSpacing: '-0.01em',
              color: 'var(--white)',
              textTransform: 'uppercase',
              marginTop: '16px',
              marginBottom: '40px',
            }}
          >
            LET'S BUILD<br />
            <span style={{ color: 'var(--red)' }}>SOMETHING</span><br />
            GREAT.
          </h2>

          <p className="reveal delay-200" style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--gray)', maxWidth: '480px', lineHeight: 1.8, marginBottom: '40px' }}>
            I'm currently looking for an internship position and Freelance as Front End Developer. Let's discuss how my Front-End development skills,  AI experience, Networking, and Cybersecurity can contribute to your team.
          </p>

          {/* CTAs */}
          <div className="reveal delay-300" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '60px' }}>
            <a href="mailto:cjbaldonado11@gmail.com" className="btn-cta-red">
              Send Email ↗
            </a>
            <a href="https://www.linkedin.com/in/christian-james-baldonado-7b7721410/" target="_blank" rel="noopener noreferrer" className="btn-cta">
              LinkedIn ↗
            </a>
          </div>

          {/* Social links row */}
          <div
            style={{
              display: 'flex',
              gap: 0,
              alignItems: 'center',
              flexWrap: 'wrap',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              paddingTop: '32px',
              paddingBottom: '80px',
            }}
          >
            {[
              { label: 'GitHub', href: 'https://github.com/Akosidakdok' },
              { label: 'LinkedIn', href: 'https://www.linkedin.com/in/christian-james-baldonado-7b7721410/' },
              { label: 'Email', href: 'mailto:cjbaldonado11@gmail.com' },
            ].map((link, i) => (
              <span key={link.label} style={{ display: 'flex', alignItems: 'center' }}>
                {i > 0 && (
                  <span style={{ color: 'var(--red)', fontSize: '0.4rem', margin: '0 16px' }}>●</span>
                )}
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'var(--gray)',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--white)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--gray)')}
                >
                  {link.label}
                </a>
              </span>
            ))}

            <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}>
              © 2026 CJ BALDONADO · SYSTEM ONLINE.
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;