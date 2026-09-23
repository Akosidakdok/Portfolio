import { useEffect, useState, useCallback } from 'react';
import './App.css';
import profileImg from './assets/profile.png';
import FilmStrip from './FilmStrip';
import Chatbot from './Chatbot';
import feasifyImg from './assets/projects/feasify.png';
import barangayImg from './assets/projects/barangay.png';
import portfolioThumbImg from './assets/projects/portfolio.png';
import mangDelfinsImg from './assets/projects/mang-delfins.png';
import alertoPhImg from './assets/projects/alerto-ph.png';
import pIdtmsImg from './assets/projects/p-idtms.png';
import paisImg from './assets/projects/pais.png';
import campNaviImg from './assets/projects/camp-navi.png';
import pnpSurveyImg from './assets/projects/pnp-survey.png';
import fccWebDesignImg from './assets/certifications/fcc-responsive-web-design.png';
import fccFrontendImg from './assets/certifications/fcc-frontend-libraries.png';
import codeOrgAiImg from './assets/certifications/code-org-ai-for-oceans.png';
import TechIcon from './components/TechIcon';
import TelemetryConsole from './components/TelemetryConsole';
import GitHubContributions from './components/GitHubContributions';





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
function SkillGroup({ icon, title, tags, dark = true }: { icon: React.ReactNode; title: string; tags: string[]; dark?: boolean }) {
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(227,30,36,0.12)',
            border: '1px solid rgba(227,30,36,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ff6b6b',
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: '0.95rem',
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
            color: dark ? 'var(--white)' : '#111',
          }}
        >
          {title}
        </span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {tags.map(tag => (
          <span key={tag} className={dark ? 'skill-tag' : 'skill-tag-light'}>
            <TechIcon name={tag} size={15} />
            <span>{tag}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Project Card (dark booking-style) ─── */
function ProjectCard({ title, stack, link, description, venue, date, image }: {
  title: string;
  stack: string[];
  link: string;
  description: string;
  venue: string;
  date: string;
  image: string;
}) {
  const isGithub = link.toLowerCase().includes('github.com');

  return (
    <div className="project-card-dark interactive-card" style={{ maxWidth: '340px', width: '100%' }}>
      {/* Card Header */}
      <div style={{ background: 'var(--accent)', padding: '7px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.15em', color: 'var(--white)', textTransform: 'uppercase' }}>Project</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.92)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          {isGithub ? (
            <>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GITHUB COLLAB
            </>
          ) : (
            <>
              <svg width="8" height="8" viewBox="0 0 76 65" fill="#fff">
                <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
              </svg>
              VERCEL DEPLOYED
            </>
          )}
        </span>
      </div>

      {/* Card Thumbnail Preview */}
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="project-thumb-container"
        title={`Visit ${title} on ${isGithub ? 'GitHub' : 'Vercel'}`}
        style={{
          display: 'block',
          position: 'relative',
          width: '100%',
          height: '175px',
          overflow: 'hidden',
          backgroundColor: '#0a0a0a',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          textDecoration: 'none',
        }}
      >
        <img
          src={image}
          alt={`${title} Preview`}
          className="project-thumb-img"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'top',
            display: 'block',
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), filter 0.3s ease',
          }}
        />
        {/* Overlay gradient & live pill */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.7) 100%)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            padding: '10px 14px',
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.58rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255,255,255,0.18)',
              color: '#fff',
              padding: '3px 9px',
              borderRadius: '999px',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 8px #22c55e' }} />
            {isGithub ? 'Collaborator Repo' : 'Live Preview'}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              fontWeight: 600,
              color: '#fff',
              letterSpacing: '0.06em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              background: 'rgba(227,30,36,0.9)',
              padding: '3px 8px',
              borderRadius: '4px',
            }}
          >
            {isGithub ? 'GitHub ↗' : 'Vercel ↗'}
          </span>
        </div>
      </a>

      {/* Card Body */}
      <div style={{ padding: '20px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', letterSpacing: '0.04em', color: 'var(--white)', marginBottom: '14px', lineHeight: 1.1 }}>
          {title}
        </h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--gray-light)', lineHeight: 1.6, marginBottom: '18px', whiteSpace: 'pre-line' }}>
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
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.85rem', color: 'var(--white)', textTransform: 'uppercase' }}>{venue}</div>
            </div>
            <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gray)', marginBottom: '4px' }}>YEAR</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.85rem', color: 'var(--white)' }}>{date}</div>
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
          {isGithub ? 'View GitHub Repository' : 'View Live Project'} <span>↗</span>
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
  image: string;
}

const PROJECTS: Project[] = [
  {
    id: '1',
    label: 'PROJECT A',
    title: 'FEASIFY',
    stack: ['React', 'TypeScript', 'Gemini AI', 'Firebase'],
    link: 'https://feasify-ten.vercel.app/',
    description: 'AI-powered financial feasibility system. Automates complex model generation for finance students with real-time AI assistance.\n-------------------------------------------------\nTo Login, use this credentials:\nuser:baldonado@gmail.com\npassword: BALDONADO-1111',
    venue: 'WEB APP',
    date: '2026',
    longDesc: 'AI-assisted financial feasibility web system built for BSBA FM students. Automates the generation of financial parameters and complex system architecture using Gemini Flash AI.',
    color: '#6366F1',
    image: feasifyImg,
  },
  {
    id: '2',
    label: 'PROJECT B',
    title: 'Barangay-Equipment-Borrowing-and-Tracking-System',
    stack: ['Software Development', 'HTML/CSS', 'Firebase'],
    link: 'https://barangaymapulanglupa.vercel.app/',
    description: 'Developed a web-based application for tracking and borrowing local barangay equipment, streamlining the inventory management process.',
    venue: 'WEB APP',
    date: '2025',
    longDesc: 'Designed and implemented a responsive interface using HTML5 and CSS3, ensuring seamless navigation for community users and staff.',
    color: '#374151',
    image: barangayImg,
  },
  {
    id: '3',
    label: 'PROJECT C',
    title: 'PORTFOLIO SITE',
    stack: ['React', 'TypeScript', 'Tailwind', 'Vite'],
    link: 'https://baldonadoportfolio.vercel.app/',
    description: 'This very portfolio. Cinematic editorial design with animated film strips, crosshair motifs, and scroll reveals.',
    venue: 'WEB APP',
    date: '2026',
    longDesc: 'Personal portfolio built with React and TypeScript. Features a cinematic black/red editorial aesthetic inspired by bold film UI design, with Bebas Neue display typography and animated components.',
    color: '#7C3AED',
    image: portfolioThumbImg,
  },
  {
    id: '4',
    label: 'PROJECT D',
    title: 'Mang Delfins Putong Pulo Website',
    stack: ['HTML/CSS', 'JavaScript', 'PHP'],
    link: 'https://mang-delfins-putong-pulo.vercel.app/',
    description: 'Engineered a highly responsive, multi-page marketing and storefront platform to showcase local delicacies, significantly enhancing the business digital presence and customer accessibility.',
    venue: 'WEB APP',
    date: '2025',
    longDesc: 'Built interactive product carousels, a custom branch locator, and dynamic product overlay modals utilizing semantic HTML5, CSS3 structural grids, and JavaScript, resulting in a user-friendly experience that boosted online engagement and sales for the local delicacy business.',
    color: '#EC4899',
    image: mangDelfinsImg,
  },
  {
    id: '5',
    label: 'PROJECT E',
    title: 'AlertoPH',
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Leaflet', 'Node.js'],
    link: 'https://alerto-ph.vercel.app/',
    description: 'Community-powered flood monitoring, early-warning, and disaster resilience platform for Filipinos with real-time hazard reporting and GIS navigation.',
    venue: 'WEB APP',
    date: '2026',
    longDesc: 'Combines citizen crowdsourcing, Leaflet.js GIS mapping, and PAGASA meteorological telemetry to deliver street-by-street flood monitoring, drainage hazard tracking, and automated safe bypass routing.',
    color: '#0284C7',
    image: alertoPhImg,
  },
  {
    id: '6',
    label: 'PROJECT F',
    title: 'P-IDTMS',
    stack: ['React', 'TypeScript', 'Node.js', 'Express', 'Supabase'],
    link: 'https://pnp-itms-internship-attendance.vercel.app/',
    description: 'PNP-ITMS Internship Daily Time Record Management System. Comprehensive web application for tracking attendance, managing intern evaluations, and automating DTR workflows.',
    venue: 'WEB APP',
    date: '2026',
    longDesc: 'A secure enterprise attendance and internship management system for PNP ITMS, featuring QR/identity-assisted attendance verification, automated DTR generation, document workflows, and role-based access control.',
    color: '#059669',
    image: pIdtmsImg,
  },
  {
    id: '7',
    label: 'PROJECT G',
    title: 'PAIS 2.0',
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Express', 'Supabase'],
    link: 'https://itms-armd-directory-two.vercel.app/',
    description: 'PNP-ITMS Personnel and Assignment Information System. Full-scale enterprise HR and personnel management platform for uniformed and civilian personnel.',
    venue: 'ENTERPRISE APP',
    date: '2026',
    longDesc: 'Architected an enterprise personnel management information system for PNP-ITMS ARMD, automating rank-aware time-in-grade calculations, promotion tracking, service histories, leave workflows, and PDF report generation.',
    color: '#D97706',
    image: paisImg,
  },
  {
    id: '8',
    label: 'PROJECT H',
    title: 'Camp-Navi',
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Leaflet', 'Supabase', 'PostGIS'],
    link: 'https://github.com/Markssuave/Camp-Navi',
    description: 'PNP Camp Crame real-time security geofencing, facility navigation, and active personnel tracking router with automated restricted-zone avoidance.',
    venue: 'GIS / WEB APP',
    date: '2026',
    longDesc: 'Architected a real-time security geofencing, facility navigation, and personnel tracking platform for PNP Camp Crame. Utilizes PostGIS/pgRouting algorithms, Leaflet GIS mapping, and Supabase Realtime to calculate Dijkstra safe routes avoiding restricted zones with live civilian and personnel GPS telemetry.',
    color: '#10B981',
    image: campNaviImg,
  },
  {
    id: '9',
    label: 'PROJECT I',
    title: 'PNP-Assignment-Survey',
    stack: ['Python', 'Django', 'PostgreSQL', 'Docker', 'Railway'],
    link: 'https://github.com/Markssuave/PNP-Assignment-Survey',
    description: 'PNP Preferred Assignment Location Survey & Admin Dashboard. Handles badge-verified personnel surveys, deployment capacity matrices, and officer transfer decisions.',
    venue: 'ENTERPRISE / GOV',
    date: '2026',
    longDesc: 'Collaborative enterprise personnel assignment portal for the Philippine National Police. Integrates rate-limited badge number identity verification, cyclical survey submissions, capacity-aware transfer planning matrices, audit trails, and zero-email password workflows tailored for secure police intranets.',
    color: '#2563EB',
    image: pnpSurveyImg,
  },
];

/* ══════════════════════════════════════════════════════════ */
/*  CERTIFICATION DATA                                        */
/* ══════════════════════════════════════════════════════════ */
export interface Certification {
  id: string;
  title: string;
  issuer: string;
  organization: string;
  date: string;
  credentialId: string;
  category: 'Web Development' | 'AI & Computer Science';
  skills: string[];
  description: string;
  color: string;
  status: 'VERIFIED' | 'ACTIVE';
  image?: string;
  verifyUrl?: string;
  workHours?: string;
  signatory?: string;
}

const CERT_CATEGORIES = ['ALL', 'Web Development', 'AI & Computer Science'] as const;

const CERTIFICATIONS: Certification[] = [
  {
    id: '1',
    title: 'Front-End Development Libraries V8',
    issuer: 'freeCodeCamp',
    organization: 'freeCodeCamp.org',
    date: 'July 22, 2026',
    credentialId: 'jay-baldonado/front-end-development-libraries',
    category: 'Web Development',
    skills: ['React.js', 'Redux', 'Bootstrap', 'jQuery', 'Sass', 'Interactive UI Engineering'],
    description: 'Developer certification representing approximately 300 hours of coursework and project builds mastering modern frontend libraries, state management architectures, and interactive responsive application engineering.',
    color: '#0A0A23',
    status: 'VERIFIED',
    image: fccFrontendImg,
    verifyUrl: 'https://freecodecamp.org/certification/jay-baldonado/front-end-development-libraries',
    workHours: '300 Hours',
    signatory: 'Quincy Larson, Executive Director, freeCodeCamp.org',
  },
  {
    id: '2',
    title: 'Legacy Responsive Web Design V8',
    issuer: 'freeCodeCamp',
    organization: 'freeCodeCamp.org',
    date: 'July 22, 2026',
    credentialId: 'jay-baldonado/responsive-web-design',
    category: 'Web Development',
    skills: ['HTML5', 'CSS3', 'Responsive Layouts', 'Flexbox', 'CSS Grid', 'Media Queries'],
    description: 'Developer certification representing approximately 300 hours of intensive coursework covering semantic HTML5 structures, fluid responsive grid designs, typography standards, and mobile-first web engineering.',
    color: '#0A0A23',
    status: 'VERIFIED',
    image: fccWebDesignImg,
    verifyUrl: 'https://freecodecamp.org/certification/jay-baldonado/responsive-web-design',
    workHours: '300 Hours',
    signatory: 'Quincy Larson, Executive Director, freeCodeCamp.org',
  },
  {
    id: '3',
    title: 'AI for Oceans - Hour of Code',
    issuer: 'Code.org',
    organization: 'Code.org / #CSforGood',
    date: '2026',
    credentialId: 'CODE-ORG-AI-OCEANS-2026',
    category: 'AI & Computer Science',
    skills: ['Artificial Intelligence', 'Machine Learning Models', 'Training Data & Bias', 'Computer Science Concepts'],
    description: 'Certificate of completion awarded for demonstrating understanding of basic concepts of computer science, training machine learning classification models, ethical AI considerations, and data labeling.',
    color: '#0094A8',
    status: 'VERIFIED',
    image: codeOrgAiImg,
    verifyUrl: 'https://www.code.org',
    signatory: 'Hadi Partovi, Co-founder and CEO, Code.org',
  },
];

/* ─── Certification Card ─── */
function CertificationCard({
  cert,
  onOpen,
}: {
  cert: Certification;
  onOpen: (cert: Certification) => void;
}) {
  return (
    <div
      className="project-card-dark interactive-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top Banner */}
      <div
        style={{
          background: cert.color,
          padding: '8px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#fff', textTransform: 'uppercase', fontWeight: 600 }}>
          {cert.category}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.58rem',
            letterSpacing: '0.1em',
            color: 'rgba(255,255,255,0.95)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 6px #22c55e' }} />
          VERIFIED
        </span>
      </div>

      {/* Certificate Image Thumbnail Preview (if image exists) */}
      {cert.image && (
        <div
          onClick={() => onOpen(cert)}
          className="project-thumb-container"
          title={`Click to preview certificate for ${cert.title}`}
          style={{
            position: 'relative',
            width: '100%',
            height: '190px',
            overflow: 'hidden',
            backgroundColor: '#0a0a0a',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            cursor: 'pointer',
          }}
        >
          <img
            src={cert.image}
            alt={`${cert.title} Official Certificate`}
            className="project-thumb-img"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
              transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), filter 0.3s ease',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.72) 100%)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              padding: '10px 14px',
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.58rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                background: 'rgba(0,0,0,0.75)',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255,255,255,0.18)',
                color: '#fff',
                padding: '3px 9px',
                borderRadius: '999px',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 8px #22c55e' }} />
              Official Certificate
            </span>
            {cert.workHours && (
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.58rem',
                  fontWeight: 600,
                  color: '#fff',
                  background: 'rgba(227,30,36,0.9)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                }}
              >
                {cert.workHours}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Card Content */}
      <div style={{ padding: '24px 22px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Organization / Year Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gray-light)' }}>
            {cert.issuer}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#ff8a8a', background: 'rgba(227,30,36,0.12)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(227,30,36,0.25)' }}>
            {cert.date}
          </span>
        </div>

        {/* Title */}
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', letterSpacing: '0.03em', color: 'var(--white)', marginBottom: '12px', lineHeight: 1.15 }}>
          {cert.title}
        </h3>

        {/* Description */}
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--gray-light)', lineHeight: 1.6, marginBottom: '18px', flex: 1 }}>
          {cert.description}
        </p>

        {/* Skills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
          {cert.skills.map(s => (
            <span
              key={s}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.58rem',
                padding: '3px 8px',
                borderRadius: '4px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--gray-light)',
              }}
            >
              {s}
            </span>
          ))}
        </div>

        {/* Bottom Credential ID + Action */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gray)' }}>
              CREDENTIAL ID
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#fff', letterSpacing: '0.04em', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {cert.credentialId}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
            <button
              onClick={() => onOpen(cert)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                padding: '6px 10px',
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
            >
              Details
            </button>
            {cert.verifyUrl ? (
              <a
                href={cert.verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cta-red"
                style={{
                  padding: '6px 12px',
                  fontSize: '0.65rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                }}
              >
                Verify ↗
              </a>
            ) : (
              <button
                onClick={() => onOpen(cert)}
                className="btn-cta-red"
                style={{
                  padding: '6px 12px',
                  fontSize: '0.65rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                }}
              >
                View ↗
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Certification Modal ─── */
function CertificationModal({
  cert,
  onClose,
}: {
  cert: Certification;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const copyCredential = () => {
    navigator.clipboard.writeText(cert.verifyUrl || cert.credentialId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(0,0,0,0.88)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.25s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#0d0d0d',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '24px',
          maxWidth: '740px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.8), 0 0 40px rgba(227,30,36,0.15)',
          padding: '36px 32px',
          animation: 'modalSlideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff',
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s, transform 0.2s',
            zIndex: 10,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--accent)';
            e.currentTarget.style.transform = 'scale(1.08)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          ✕
        </button>

        {/* Certificate Frame Header */}
        <div style={{ textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '22px', marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '999px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', color: '#818cf8', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '14px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
            OFFICIAL CREDENTIAL RECORD
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', color: '#fff', letterSpacing: '0.04em', textTransform: 'uppercase', margin: 0, lineHeight: 1.1 }}>
            {cert.title}
          </h2>
          <div style={{ marginTop: '10px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#a5b4fc', letterSpacing: '0.08em' }}>
            ISSUED BY: {cert.issuer} ({cert.organization}) · {cert.date}
          </div>
        </div>

        {/* Full Certificate Image Display (if available) */}
        {cert.image && (
          <div
            style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '2px solid rgba(255,255,255,0.15)',
              marginBottom: '24px',
              boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
              background: '#050505',
            }}
          >
            <img
              src={cert.image}
              alt={cert.title}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                maxHeight: '400px',
                objectFit: 'contain',
                margin: '0 auto',
              }}
            />
          </div>
        )}

        {/* Recipient Ribbon */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '18px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888' }}>
              RECIPIENT / HOLDER
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              Christian James Baldonado
            </div>
            {cert.signatory && (
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#999', marginTop: '4px' }}>
                Signed by: {cert.signatory}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {cert.workHours && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888' }}>
                  WORKLOAD
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#818cf8', fontWeight: 600 }}>
                  {cert.workHours}
                </div>
              </div>
            )}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888' }}>
                STATUS
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#22c55e', fontWeight: 600 }}>
                ● VERIFIED ACTIVE
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Competencies & Description */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '8px' }}>
            CREDENTIAL OVERVIEW &amp; SCOPE
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: '#ccc', lineHeight: 1.7, margin: 0 }}>
            {cert.description}
          </p>
        </div>

        {/* Skills Tag Matrix */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', marginBottom: '10px' }}>
            CORE COMPETENCIES &amp; DOMAIN MASTERY
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {cert.skills.map(s => (
              <span
                key={s}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  background: 'rgba(227,30,36,0.12)',
                  border: '1px solid rgba(227,30,36,0.25)',
                  color: '#ff8a8a',
                  letterSpacing: '0.04em',
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Verification Footer Bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#777' }}>
              SERIALIZED CREDENTIAL / VERIFICATION LINK
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#fff', letterSpacing: '0.04em', fontWeight: 600, marginTop: '3px', wordBreak: 'break-all' }}>
              {cert.verifyUrl || cert.credentialId}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={copyCredential}
              style={{
                all: 'unset',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '8px 16px',
                borderRadius: '8px',
                background: copied ? '#22c55e' : 'rgba(255,255,255,0.08)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.15)',
                transition: 'all 0.2s',
              }}
            >
              {copied ? '✓ Copied Link' : 'Copy Link'}
            </button>
            {cert.verifyUrl && (
              <a
                href={cert.verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cta-red"
                style={{
                  padding: '8px 18px',
                  fontSize: '0.7rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                Verify Online <span>↗</span>
              </a>
            )}
            <button
              onClick={onClose}
              style={{
                all: 'unset',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '8px 16px',
                borderRadius: '8px',
                background: 'transparent',
                color: '#aaa',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  FULL TECH STACK LIST (PLAIN)                               */
/* ══════════════════════════════════════════════════════════ */
interface PlainTechItem {
  name: string;
  category: string;
  highlight?: string;
}

const FULL_LIST_PLAIN: PlainTechItem[] = [
  { name: 'HTML', category: 'Frontend', highlight: 'Markup' },
  { name: 'CSS', category: 'Frontend', highlight: 'Styling' },
  { name: 'JavaScript', category: 'Frontend / Scripting', highlight: 'Language' },
  { name: 'React', category: 'Frontend', highlight: 'Framework' },
  { name: 'Figma', category: 'Design & UI/UX', highlight: 'Prototyping' },
  { name: 'Python', category: 'Backend & Data', highlight: 'Language' },
  { name: 'Java', category: 'Backend & OOP', highlight: 'Language' },
  { name: 'Node.js', category: 'Backend & Runtime', highlight: 'Engine' },
  { name: 'PostgreSQL', category: 'Database', highlight: 'Relational' },
  { name: 'Supabase', category: 'Database & Cloud BaaS', highlight: 'BaaS' },
  { name: 'MySQL', category: 'Database', highlight: 'Relational' },
  { name: 'MSSQL', category: 'Database', highlight: 'Enterprise' },
  { name: 'Docker', category: 'DevOps & Containers', highlight: 'Virtualization' },
  { name: 'VirtualBox', category: 'Virtualization', highlight: 'Hypervisor' },
  { name: 'Draw.io', category: 'Architecture & Diagrams', highlight: 'Design' },
  { name: 'Mermaid.js', category: 'Architecture & Diagrams', highlight: 'Code-to-UML' },
  { name: 'Cisco', category: 'Networking & Hardware', highlight: 'Enterprise' },
  { name: 'VS Code', category: 'Developer Tools', highlight: 'IDE' },
  { name: 'Git', category: 'Version Control', highlight: 'VCS' },
  { name: 'GitHub', category: 'Version Control', highlight: 'Cloud VCS' },
  { name: 'GitHub Desktop', category: 'Developer Tools', highlight: 'GUI' },
  { name: 'PyCharm', category: 'Developer Tools', highlight: 'IDE' },
  { name: 'Vercel', category: 'Cloud & Hosting', highlight: 'Deployment' },
  { name: 'Codex', category: 'AI & Automation', highlight: 'Code Gen' },
  { name: 'Claude', category: 'AI & LLMs', highlight: 'Anthropic' },
  { name: 'Gemini', category: 'AI & LLMs', highlight: 'Google' },
  { name: 'Antigravity', category: 'AI Agentic IDE', highlight: 'Google' },
  { name: 'Atlassian (Jira / Confluence)', category: 'Productivity & PM', highlight: 'Agile PM' },
  { name: 'Microsoft Teams', category: 'Collaboration', highlight: 'Communication' },
  { name: 'Zoom', category: 'Collaboration', highlight: 'Conferencing' },
  { name: 'Google Meet', category: 'Collaboration', highlight: 'Conferencing' },
];

/* ══════════════════════════════════════════════════════════ */
/*  MAIN APP                                                   */
/* ══════════════════════════════════════════════════════════ */
function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(0);
  const [cardVisible, setCardVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeNavSection, setActiveNavSection] = useState<'about' | 'skills' | 'projects' | 'contact'>('about');
  const [activeSectionTab, setActiveSectionTab] = useState<'projects' | 'certifications'>('projects');
  const [certCategory, setCertCategory] = useState<string>('ALL');
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [skillViewMode, setSkillViewMode] = useState<'categorized' | 'plain'>('categorized');
  const [plainSearch, setPlainSearch] = useState('');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /* Active section scroll spy */
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // Bottom of page detection for Contact
      if (windowHeight + scrollY >= docHeight - 80) {
        setActiveNavSection('contact');
        return;
      }

      const sectionIds: Array<'about' | 'skills' | 'projects' | 'contact'> = ['about', 'skills', 'projects', 'contact'];
      const scrollThreshold = 180;
      let current: 'about' | 'skills' | 'projects' | 'contact' = 'about';

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= scrollThreshold) {
            current = id;
          }
        }
      }

      setActiveNavSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isItemActive = (item: string) => {
    const lower = item.toLowerCase();
    if (activeNavSection === 'projects') {
      return lower === activeSectionTab;
    }
    return lower === activeNavSection;
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: string, isMobileMenu = false) => {
    if (isMobileMenu) setMenuOpen(false);
    const lower = item.toLowerCase();
    if (lower === 'certifications') {
      e.preventDefault();
      setActiveSectionTab('certifications');
      setActiveNavSection('projects');
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    } else if (lower === 'projects') {
      e.preventDefault();
      setActiveSectionTab('projects');
      setActiveNavSection('projects');
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setActiveNavSection(lower as 'about' | 'skills' | 'contact');
    }
  };

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
          <a
            href="#about"
            onClick={() => setActiveNavSection('about')}
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '2px' }}
          >
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', letterSpacing: '0.05em', color: 'var(--white)' }}>CJ</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--accent)', lineHeight: 1 }}>+</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', letterSpacing: '0.05em', color: 'var(--white)' }}>DEV</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: 0 }}>
            {['About', 'Skills', 'Projects', 'Certifications', 'Contact'].map((item, i) => (
              <span key={item} style={{ display: 'flex', alignItems: 'center' }}>
                {i > 0 && (
                  <span style={{ color: 'var(--accent)', fontSize: '0.4rem', margin: '0 10px', verticalAlign: 'middle' }}>●</span>
                )}
                <a
                  href={`#${item.toLowerCase()}`}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`desktop-nav-link ${isItemActive(item) ? 'active' : ''}`}
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
            {['About', 'Skills', 'Projects', 'Certifications', 'Contact'].map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={(e) => handleNavClick(e, item, true)}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: isItemActive(item) ? 'var(--accent)' : 'var(--white)',
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
      {/* HERO SECTION — Sleek Modern Tech (Linear/Vercel) */}
      {/* ────────────────────────────────────────── */}
      <section
        id="about"
        style={{
          position: 'relative',
          minHeight: isMobile ? 'auto' : '90vh',
          background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 102, 241, 0.15), transparent 70%), var(--bg-dark)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          paddingTop: isMobile ? '100px' : '120px',
          paddingBottom: isMobile ? '60px' : '80px',
        }}
      >
        {/* Subtle high-tech ambient grid overlay */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            maskImage: 'radial-gradient(ellipse 60% 60% at 50% 40%, black 20%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 40%, black 20%, transparent 80%)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        <div
          style={{
            maxWidth: '1280px',
            width: '100%',
            margin: '0 auto',
            padding: '0 32px',
            position: 'relative',
            zIndex: 5,
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1.15fr 0.85fr',
            gap: isMobile ? '48px' : '64px',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Developer Info & Value Proposition */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'center' : 'flex-start', textAlign: isMobile ? 'center' : 'left' }}>
            
            {/* Live Availability Badge */}
            <div
              className="reveal"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '9999px',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                color: '#34d399',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                letterSpacing: '0.06em',
                marginBottom: '24px',
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Available for Full-Stack &amp; Front-End Roles [2026]</span>
            </div>

            {/* High Impact Modern Headline */}
            <h1
              className="reveal delay-100"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.4rem, 4.2vw, 4.4rem)',
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: '-0.03em',
                color: 'var(--white)',
                marginBottom: '20px',
              }}
            >
              Building scalable web systems &amp;{' '}
              <span style={{ color: 'var(--accent)' }}>
                intelligent interfaces.
              </span>
            </h1>

            {/* Subtext Developer Bio */}
            <p
              className="reveal delay-200"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.95rem, 1.1vw, 1.08rem)',
                color: 'var(--gray-light)',
                lineHeight: 1.7,
                maxWidth: '560px',
                marginBottom: '32px',
              }}
            >
              Hi, I'm <strong style={{ color: '#fff', fontWeight: 600 }}>Christian James (CJ) Baldonado</strong> — a Front-End &amp; Full-Stack Developer specializing in React, TypeScript, Node.js, and modern AI integrations. Focused on high-performance architecture and polished digital experiences.
            </p>

            {/* CTA Button Row */}
            <div
              className="reveal delay-300"
              style={{
                display: 'flex',
                gap: '14px',
                alignItems: 'center',
                flexWrap: 'wrap',
                justifyContent: isMobile ? 'center' : 'flex-start',
                marginBottom: '40px',
              }}
            >
              <a
                href="#projects"
                onClick={() => {
                  setActiveSectionTab('projects');
                  setActiveNavSection('projects');
                }}
                className="btn-cta-red"
              >
                Explore Projects ↓
              </a>
              <a
                href="/Baldonado-Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cta"
              >
                Resume ↗
              </a>
              <a
                href="#contact"
                className="btn-cta"
                style={{ background: 'transparent', borderColor: 'rgba(255,255,255,0.1)' }}
              >
                Contact Me
              </a>
            </div>

            {/* Quick Metrics Bento Row */}
            <div
              className="reveal delay-400"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                width: '100%',
                maxWidth: '520px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>5+</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--gray)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Years Building</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: '#6366f1' }}>10+</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--gray)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Featured Projects</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: '#38bdf8' }}>31+</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--gray)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Tech Stack &amp; Tools</div>
              </div>
            </div>

          </div>

          {/* Right Column: Modern Developer Portrait Card */}
          <div
            className="reveal delay-200"
            style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* Ambient backlight glow */}
            <div
              style={{
                position: 'absolute',
                width: isMobile ? '280px' : '380px',
                height: isMobile ? '280px' : '380px',
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, rgba(56, 189, 248, 0.12) 50%, transparent 70%)',
                filter: 'blur(50px)',
                borderRadius: '50%',
                zIndex: 0,
                pointerEvents: 'none',
              }}
            />

            {/* Glassmorphic Card Container */}
            <div
              style={{
                position: 'relative',
                zIndex: 2,
                width: '100%',
                maxWidth: '380px',
                borderRadius: '24px',
                background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(16px)',
                padding: '16px',
                overflow: 'hidden',
              }}
            >
              {/* Photo Frame */}
              <div
                style={{
                  position: 'relative',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  background: 'radial-gradient(ellipse at 50% 30%, rgba(99, 102, 241, 0.18) 0%, rgba(15, 23, 42, 0.6) 55%, #09090b 85%)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <img
                  src={profileImg}
                  alt="Christian James Baldonado"
                  style={{
                    width: '100%',
                    height: isMobile ? '340px' : '410px',
                    objectFit: 'cover',
                    objectPosition: 'top center',
                    display: 'block',
                    filter: 'contrast(1.04) brightness(1.02)',
                  }}
                />
              </div>

              {/* Card Identity & Details Below Photo */}
              <div style={{ marginTop: '14px', padding: '0 4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
                    Christian James Baldonado
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.62rem',
                      fontWeight: 600,
                      color: '#34d399',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: 'rgba(16, 185, 129, 0.12)',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    PLV BSIT
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#94a3b8', letterSpacing: '0.02em', marginBottom: '14px' }}>
                  Full-Stack &amp; Front-End Developer
                </div>

                {/* Tech Chips */}
                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                    paddingTop: '10px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <span className="skill-tag" style={{ fontSize: '0.68rem', padding: '5px 10px' }}>
                    <TechIcon name="React" size={13} /> React
                  </span>
                  <span className="skill-tag" style={{ fontSize: '0.68rem', padding: '5px 10px' }}>
                    <TechIcon name="TypeScript" size={13} /> TypeScript
                  </span>
                  <span className="skill-tag" style={{ fontSize: '0.68rem', padding: '5px 10px' }}>
                    <TechIcon name="Gemini" size={13} /> Gemini AI
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ────────────────────────────────────────── */}
      {/* TECH STREAM & LIVE TELEMETRY MARQUEE       */}
      {/* ────────────────────────────────────────── */}
      <FilmStrip variant="tech" direction="left" />

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
        {/* Subtle ambient glow */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
            filter: 'blur(60px)',
          }}
        />

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 5 }}>

          {/* Section header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '60px' }}>
            <div className="reveal">
              <span className="section-label-dark">TECHNICAL ARSENAL</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '0.02em', color: 'var(--white)', marginTop: '8px', lineHeight: 1 }}>
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
            <StatBadge label="YEARS EXP" value="5+" />
            <StatBadge label="PROJECTS" value="10+" active />
            <StatBadge label="TECH STACK" value="31+" />
            <StatBadge label="DOMAINS" value="9" />
          </div>

          {/* Quote */}
          <div className="reveal delay-200" style={{ textAlign: 'center', maxWidth: '620px', margin: '0 auto 40px' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: '1.05rem', color: 'var(--gray-light)', lineHeight: 1.7 }}>
              "Passionate about building modern, scalable systems — where clean code meets exceptional user experience."
            </p>
          </div>

          {/* View Mode Switcher: Categorized vs Full List (Plain) */}
          <div className="reveal delay-200" style={{ display: 'flex', justifyContent: 'center', marginBottom: '44px' }}>
            <div className="stack-view-switcher">
              <button
                type="button"
                onClick={() => setSkillViewMode('categorized')}
                className={`stack-toggle-btn ${skillViewMode === 'categorized' ? 'active' : ''}`}
                title="View grouped by engineering domain"
              >
                <span style={{ fontSize: '0.85rem' }}>⊞</span> Categorized Stack
              </button>
              <button
                type="button"
                onClick={() => setSkillViewMode('plain')}
                className={`stack-toggle-btn ${skillViewMode === 'plain' ? 'active' : ''}`}
                title="View plain list of all 31 technologies with icons"
              >
                <span style={{ fontSize: '0.85rem' }}>☰</span> Full List (Plain) <span style={{ opacity: 0.85, fontSize: '0.62rem', padding: '2px 7px', borderRadius: '4px', background: 'rgba(255,255,255,0.18)' }}>{FULL_LIST_PLAIN.length}</span>
              </button>
            </div>
          </div>

          {/* VIEW 1: CATEGORIZED STACK */}
          {skillViewMode === 'categorized' ? (
            <div
              key="categorized"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
                animation: 'fadeIn 0.3s ease forwards',
              }}
            >
              {/* 1. Frontend & UI/UX */}
              <SkillGroup
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                }
                title="Frontend & UI/UX"
                tags={['React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'HTML', 'CSS', 'Figma', 'Leaflet.js', 'Vite']}
              />

              {/* 2. Backend & Languages */}
              <SkillGroup
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                    <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                    <line x1="6" y1="6" x2="6.01" y2="6" />
                    <line x1="6" y1="18" x2="6.01" y2="18" />
                  </svg>
                }
                title="Backend & Languages"
                tags={['Node.js', 'Express.js', 'Python', 'Java', 'PHP', 'REST APIs']}
              />

              {/* 3. Database & Cloud */}
              <SkillGroup
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <ellipse cx="12" cy="5" rx="9" ry="3" />
                    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                  </svg>
                }
                title="Database & Cloud"
                tags={['PostgreSQL', 'Supabase', 'MySQL', 'MSSQL', 'Firebase', 'Firestore', 'Vercel']}
              />

              {/* 4. DevOps & Virtualization */}
              <SkillGroup
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                }
                title="DevOps & Virtualization"
                tags={['Docker', 'VirtualBox', 'Git', 'GitHub', 'GitHub Desktop']}
              />

              {/* 5. Developer Tools & Diagrams */}
              <SkillGroup
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                }
                title="Developer Tools & Diagrams"
                tags={['VS Code', 'PyCharm', 'Draw.io', 'Mermaid.js']}
              />

              {/* 6. AI & Intelligent Systems */}
              <SkillGroup
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                }
                title="AI & Intelligent Systems"
                tags={['Gemini', 'Antigravity', 'Claude', 'Codex', 'OpenAI API', 'GroqCloud']}
              />

              {/* 7. Networking & Security */}
              <SkillGroup
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                }
                title="Networking & Security"
                tags={['Cisco', 'Protocols', 'Subnetting', 'IP Config', 'VLAN', 'RBAC']}
              />

              {/* 8. Collaboration & Productivity */}
              <SkillGroup
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                }
                title="Collaboration & Productivity"
                tags={['Atlassian (Jira / Confluence)', 'Microsoft Teams', 'Zoom', 'Google Meet']}
              />

              {/* 9. Core Strengths */}
              <SkillGroup
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                }
                title="Core Strengths"
                tags={['Agile', 'Problem-Solving', 'Analytical', 'Team Collab']}
              />
            </div>
          ) : (
            /* VIEW 2: FULL LIST (PLAIN) */
            <div key="plain" className="plain-list-container" style={{ animation: 'fadeIn 0.3s ease forwards' }}>
              {/* Header & Search Filter */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '28px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '20px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '3px 10px', borderRadius: '6px', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
                      OFFICIAL CATALOG
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--gray-light)', letterSpacing: '0.08em' }}>
                      {FULL_LIST_PLAIN.length} TOTAL TECHNOLOGIES
                    </span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', letterSpacing: '0.04em', color: 'var(--white)', marginTop: '8px' }}>
                    FULL LIST (PLAIN)
                  </h3>
                </div>

                {/* Instant Search Bar */}
                <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
                  <input
                    type="text"
                    value={plainSearch}
                    onChange={e => setPlainSearch(e.target.value)}
                    placeholder="Search tech stack..."
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 36px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.14)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      letterSpacing: '0.05em',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.14)')}
                  />
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--gray)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  {plainSearch && (
                    <button
                      type="button"
                      onClick={() => setPlainSearch('')}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--gray)',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Grid of All Technologies with individual brand images/icons */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
                  gap: '12px',
                }}
              >
                {FULL_LIST_PLAIN
                  .filter(item =>
                    item.name.toLowerCase().includes(plainSearch.toLowerCase()) ||
                    item.category.toLowerCase().includes(plainSearch.toLowerCase()) ||
                    (item.highlight && item.highlight.toLowerCase().includes(plainSearch.toLowerCase()))
                  )
                  .map((item, idx) => (
                    <div
                      key={item.name}
                      className="plain-list-item"
                      title={`${item.name} · ${item.category}`}
                    >
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                        }}
                      >
                        <TechIcon name={item.name} size={18} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontWeight: 700,
                              fontSize: '0.78rem',
                              color: 'var(--white)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {item.name}
                          </span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', color: 'rgba(255,255,255,0.3)' }}>
                            #{String(idx + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.58rem',
                            color: 'var(--gray-light)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            marginTop: '2px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {item.category}
                        </span>
                      </div>
                      {item.highlight && (
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.52rem',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: 'rgba(99,102,241,0.12)',
                            border: '1px solid rgba(99,102,241,0.25)',
                            color: '#a5b4fc',
                            letterSpacing: '0.06em',
                            flexShrink: 0,
                          }}
                        >
                          {item.highlight}
                        </span>
                      )}
                    </div>
                  ))}
              </div>

              {/* Empty state if search has no results */}
              {FULL_LIST_PLAIN.filter(item =>
                item.name.toLowerCase().includes(plainSearch.toLowerCase()) ||
                item.category.toLowerCase().includes(plainSearch.toLowerCase())
              ).length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--gray)' }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.08em' }}>
                    No technology found matching "{plainSearch}".
                  </p>
                  <button
                    type="button"
                    onClick={() => setPlainSearch('')}
                    style={{
                      marginTop: '12px',
                      background: 'transparent',
                      border: '1px solid var(--accent)',
                      color: 'var(--accent)',
                      padding: '6px 14px',
                      borderRadius: '6px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      cursor: 'pointer',
                    }}
                  >
                    Clear Filter
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </section>

      {/* ────────────────────────────────────────── */}
      {/* ENGINEERING HIGHLIGHTS & CAPABILITIES      */}
      {/* ────────────────────────────────────────── */}
      <FilmStrip variant="philosophy" direction="right" />

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
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', letterSpacing: '0.1em', color: 'var(--white)', marginBottom: '4px' }}>
                  NG LUNGSOD NG VALENZUELA
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--gray)', marginTop: '8px', letterSpacing: '0.1em' }}>
                  BSIT — GRADUATING 2027
                </div>
              </div>
            </div>

            {/* Center: Experience */}
            <div className="reveal delay-200" style={{ maxWidth: '440px', flex: '1 1 320px' }}>
              <span className="section-label-dark" style={{ marginBottom: '16px' }}>EXPERIENCE</span>
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* 1. PLV OJT - PNP ITMS */}
                <div
                  style={{
                    padding: '16px 20px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.02)',
                    transition: 'border-color 0.25s, background 0.25s, transform 0.25s',
                  }}
                  className="interactive-card"
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }} />
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.12em', color: '#34d399', textTransform: 'uppercase', fontWeight: 700 }}>
                        PLV OJT
                      </span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--gray)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      COLLEGE INTERNSHIP
                    </span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', letterSpacing: '0.05em', color: 'var(--white)', lineHeight: 1.15 }}>
                    PNP ITMS
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--gray-light)', marginTop: '4px', letterSpacing: '0.04em' }}>
                    Full Stack Developer
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--gray)', lineHeight: 1.5, marginTop: '8px', marginBottom: 0 }}>
                    Architected enterprise attendance, assignment survey, navigation &amp; personnel records systems (P-IDTMS, PAIS 2.0, Camp-Navi, PNP Survey).
                  </p>
                </div>

                {/* 2. Freelance - Full Stack Developer */}
                <div
                  style={{
                    padding: '16px 20px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.02)',
                    transition: 'border-color 0.25s, background 0.25s, transform 0.25s',
                  }}
                  className="interactive-card"
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }} />
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.12em', color: '#34d399', textTransform: 'uppercase', fontWeight: 700 }}>
                        FREELANCE
                      </span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--gray)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      SELF-EMPLOYED
                    </span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', letterSpacing: '0.05em', color: 'var(--white)', lineHeight: 1.15 }}>
                    FREELANCE
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--gray-light)', marginTop: '4px', letterSpacing: '0.04em' }}>
                    Full Stack Developer
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--gray)', lineHeight: 1.5, marginTop: '8px', marginBottom: 0 }}>
                    Architecting and engineering tailored web applications, client solutions, and modern digital platforms.
                  </p>
                </div>

                {/* 3. SHS OJT - AFDB Enterprise */}
                <div
                  style={{
                    padding: '16px 20px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.02)',
                    transition: 'border-color 0.25s, background 0.25s, transform 0.25s',
                  }}
                  className="interactive-card"
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.5)', display: 'inline-block' }} />
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.12em', color: 'var(--gray-light)', textTransform: 'uppercase', fontWeight: 700 }}>
                        SHS OJT
                      </span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--gray)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      SENIOR HIGH INTERNSHIP
                    </span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', letterSpacing: '0.05em', color: 'var(--white)', lineHeight: 1.15 }}>
                    AFDB ENTERPRISE
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--gray-light)', marginTop: '4px', letterSpacing: '0.04em' }}>
                    Accounting / Social Media Manager
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--gray)', lineHeight: 1.5, marginTop: '8px', marginBottom: 0 }}>
                    Managed financial records, bookkeeping documentation, and digital marketing channels.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: quick facts */}
            <div className="reveal delay-300" style={{ maxWidth: '280px' }}>
              <span className="section-label-dark" style={{ marginBottom: '12px' }}>QUICK FACTS</span>
              <ul style={{ listStyle: 'none', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  {
                    icon: (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    ),
                    text: 'Valenzuela City, PH',
                  },
                  
                  {
                    icon: (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="16 18 22 12 16 6" />
                        <polyline points="8 6 2 12 8 18" />
                      </svg>
                    ),
                    text: 'Freelance Full-Stack Developer',
                  },
                  {
                    icon: (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="4" y="4" width="16" height="16" rx="2" />
                        <rect x="9" y="9" width="6" height="6" />
                        <line x1="9" y1="1" x2="9" y2="4" />
                        <line x1="15" y1="1" x2="15" y2="4" />
                        <line x1="9" y1="20" x2="9" y2="23" />
                        <line x1="15" y1="20" x2="15" y2="23" />
                        <line x1="20" y1="9" x2="23" y2="9" />
                        <line x1="20" y1="14" x2="23" y2="14" />
                        <line x1="1" y1="9" x2="4" y2="9" />
                        <line x1="1" y1="14" x2="4" y2="14" />
                      </svg>
                    ),
                    text: 'Front-End + AI / Networking',
                  },
                  {
                    icon: (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    ),
                    text: 'cjbaldonado11@gmail.com',
                    href: 'mailto:cjbaldonado11@gmail.com',
                  },
                ].map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '6px',
                        background: 'rgba(99,102,241,0.1)',
                        border: '1px solid rgba(99,102,241,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent)',
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </div>
                    {item.href ? (
                      <a
                        href={item.href}
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.78rem',
                          color: 'var(--gray-light)',
                          textDecoration: 'none',
                          transition: 'color 0.2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--white)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--gray-light)')}
                      >
                        {item.text}
                      </a>
                    ) : (
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--gray-light)' }}>
                        {item.text}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Modern Section Transition Header */}
        <div
          style={{
            background: 'var(--bg-light)',
            overflow: 'hidden',
            padding: '36px 32px 24px',
            borderTop: '1px solid rgba(0,0,0,0.08)',
          }}
        >
          <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div className="reveal">
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#64748b' }}>
                SHOWCASE // ARCHIVE
              </span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginTop: '4px' }}>
                Featured Engineering &amp; Work
              </h3>
            </div>
            <div className="reveal delay-100" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#64748b', background: 'rgba(0,0,0,0.04)', padding: '6px 14px', borderRadius: '9999px' }}>
              Full-Stack &amp; Front-End Solutions
            </div>
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
        <div id="certifications" style={{ position: 'absolute', top: 0, left: 0 }} />
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

          {/* Primary View Switcher: Projects vs Certifications */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
            <div
              style={{
                display: 'inline-flex',
                background: 'rgba(0,0,0,0.06)',
                padding: '5px',
                borderRadius: '999px',
                border: '1px solid rgba(0,0,0,0.08)',
                gap: '4px',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <button
                onClick={() => setActiveSectionTab('projects')}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 24px',
                  borderRadius: '999px',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  transition: 'all 0.25s ease',
                  background: activeSectionTab === 'projects' ? 'var(--accent)' : 'transparent',
                  color: activeSectionTab === 'projects' ? 'white' : '#666',
                  boxShadow: activeSectionTab === 'projects' ? '0 4px 16px rgba(99, 102, 241, 0.4)' : 'none',
                }}
              >
                <span>01</span>
                <span>Projects &amp; Builds</span>
                <span
                  style={{
                    background: activeSectionTab === 'projects' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.08)',
                    fontSize: '0.68rem',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {PROJECTS.length}
                </span>
              </button>

              <button
                onClick={() => setActiveSectionTab('certifications')}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 24px',
                  borderRadius: '999px',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  transition: 'all 0.25s ease',
                  background: activeSectionTab === 'certifications' ? 'var(--accent)' : 'transparent',
                  color: activeSectionTab === 'certifications' ? 'white' : '#666',
                  boxShadow: activeSectionTab === 'certifications' ? '0 4px 16px rgba(99, 102, 241, 0.4)' : 'none',
                }}
              >
                <span>02</span>
                <span>Certifications</span>
                <span
                  style={{
                    background: activeSectionTab === 'certifications' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.08)',
                    fontSize: '0.68rem',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {CERTIFICATIONS.length}
                </span>
              </button>
            </div>
          </div>

          {/* Section title */}
          <div className="reveal" style={{ marginBottom: activeSectionTab === 'projects' ? '64px' : '44px', textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 4rem)', color: '#111', letterSpacing: '0.04em', textTransform: 'uppercase', lineHeight: 1.05 }}>
              FEATURED WORK:<br />
              <span style={{ color: activeSectionTab === 'projects' ? '#111' : 'var(--accent)' }}>
                {activeSectionTab === 'projects' ? 'PROJECTS & BUILDS' : 'CERTIFICATIONS & LICENSES'}
              </span>
            </h2>

            {/* Overlapping circle avatars */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
              {activeSectionTab === 'projects' ? (
                PROJECTS.map((p, i) => (
                  <div
                    key={p.id}
                    style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      background: p.color,
                      border: '3px solid var(--bg-light)',
                      marginLeft: i > 0 ? '-10px' : 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.65rem', color: 'white',
                      fontFamily: 'var(--font-mono)', fontWeight: 600,
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
                ))
              ) : (
                CERTIFICATIONS.map((c, i) => (
                  <div
                    key={c.id}
                    style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      background: c.color,
                      border: '3px solid var(--bg-light)',
                      marginLeft: i > 0 ? '-10px' : 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.65rem', color: 'white',
                      fontFamily: 'var(--font-mono)', fontWeight: 600,
                      cursor: 'pointer',
                      position: 'relative',
                      zIndex: 1,
                    }}
                    onClick={() => setSelectedCert(c)}
                    title={c.title}
                  >
                    0{i + 1}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ══════════ PROJECTS VIEW ══════════ */}
          {activeSectionTab === 'projects' && (
            <>
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
                      image={PROJECTS[activeProject].image}
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
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', opacity: cardVisible ? 1 : 0, transition: 'opacity 0.28s ease' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: prev.color }} />
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888' }}>{prev.label}</span>
                        </div>

                        {/* Prev project thumbnail preview */}
                        <div
                          onClick={goPrev}
                          title={`Previous: ${prev.title}`}
                          style={{
                            cursor: 'pointer',
                            position: 'relative',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            height: '115px',
                            maxWidth: '240px',
                            border: '1px solid rgba(0,0,0,0.12)',
                            boxShadow: '0 6px 18px rgba(0,0,0,0.07)',
                            transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-3px)';
                            e.currentTarget.style.boxShadow = '0 10px 24px rgba(99, 102, 241, 0.22)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.07)';
                          }}
                        >
                          <img
                            src={prev.image}
                            alt={prev.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              inset: 0,
                              background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 100%)',
                              display: 'flex',
                              alignItems: 'flex-end',
                              padding: '8px 10px',
                            }}
                          >
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                              ← PREV PREVIEW
                            </span>
                          </div>
                        </div>

                        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.05rem', color: '#111', letterSpacing: '0.02em' }}>{prev.title}</h3>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#666', lineHeight: 1.7 }}>{prev.longDesc}</p>
                        <button onClick={goPrev} style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginTop: '4px', transition: 'gap 0.2s' }} onMouseEnter={e => (e.currentTarget.style.gap = '12px')} onMouseLeave={e => (e.currentTarget.style.gap = '6px')}>← PREV</button>
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
                      image={PROJECTS[activeProject].image}
                    />
                  </div>

                  {/* Right — next project info */}
                  {(() => {
                    const next = PROJECTS[(activeProject + 1) % PROJECTS.length];
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', opacity: cardVisible ? 1 : 0, transition: 'opacity 0.28s ease' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: next.color }} />
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888' }}>{next.label}</span>
                        </div>

                        {/* Next project thumbnail preview */}
                        <div
                          onClick={goNext}
                          title={`Next: ${next.title}`}
                          style={{
                            cursor: 'pointer',
                            position: 'relative',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            height: '115px',
                            maxWidth: '240px',
                            border: '1px solid rgba(0,0,0,0.12)',
                            boxShadow: '0 6px 18px rgba(0,0,0,0.07)',
                            transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-3px)';
                            e.currentTarget.style.boxShadow = '0 10px 24px rgba(99, 102, 241, 0.22)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.07)';
                          }}
                        >
                          <img
                            src={next.image}
                            alt={next.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              inset: 0,
                              background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 100%)',
                              display: 'flex',
                              alignItems: 'flex-end',
                              justifyContent: 'flex-end',
                              padding: '8px 10px',
                            }}
                          >
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                              NEXT PREVIEW →
                            </span>
                          </div>
                        </div>

                        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.05rem', color: '#111', letterSpacing: '0.02em' }}>{next.title}</h3>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#666', lineHeight: 1.7 }}>{next.longDesc}</p>
                        <button onClick={goNext} style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginTop: '4px', transition: 'gap 0.2s' }} onMouseEnter={e => (e.currentTarget.style.gap = '12px')} onMouseLeave={e => (e.currentTarget.style.gap = '6px')}>NEXT →</button>
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
                    border: '2px solid rgba(0,0,0,0.15)',
                    background: 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', fontSize: '1.1rem', color: '#333',
                    transition: 'background 0.2s, border-color 0.2s, color 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'var(--accent)';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = '#6366f1';
                    (e.currentTarget as HTMLButtonElement).style.color = 'white';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(99, 102, 241, 0.35)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,0,0,0.15)';
                    (e.currentTarget as HTMLButtonElement).style.color = '#333';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
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
                        background: i === activeProject ? 'var(--accent)' : 'rgba(0,0,0,0.2)',
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
                    background: 'var(--accent)',
                    border: 'none',
                    boxShadow: '0 4px 16px rgba(99, 102, 241, 0.35)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', fontSize: '1.1rem', color: 'white',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.08)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.5)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(99, 102, 241, 0.35)';
                  }}
                >
                  →
                </button>
              </div>
            </>
          )}

          {/* ══════════ CERTIFICATIONS VIEW ══════════ */}
          {activeSectionTab === 'certifications' && (
            <div>
              {/* Category Filter Pills */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '40px' }}>
                {CERT_CATEGORIES.map(cat => {
                  const isSelected = certCategory === cat;
                  const count = cat === 'ALL' ? CERTIFICATIONS.length : CERTIFICATIONS.filter(c => c.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setCertCategory(cat)}
                      style={{
                        all: 'unset',
                        cursor: 'pointer',
                        padding: '8px 18px',
                        borderRadius: '999px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.68rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        transition: 'all 0.2s ease',
                        background: isSelected ? '#111' : 'rgba(0,0,0,0.05)',
                        color: isSelected ? '#fff' : '#555',
                        border: isSelected ? '1px solid #111' : '1px solid rgba(0,0,0,0.08)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>{cat}</span>
                      <span
                        style={{
                          fontSize: '0.6rem',
                          padding: '1px 6px',
                          borderRadius: '999px',
                          background: isSelected ? 'var(--accent)' : 'rgba(0,0,0,0.08)',
                          color: '#fff',
                        }}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Certifications Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(340px, 1fr))',
                  gap: '28px',
                  alignItems: 'stretch',
                }}
              >
                {(certCategory === 'ALL' ? CERTIFICATIONS : CERTIFICATIONS.filter(c => c.category === certCategory)).map(cert => (
                  <CertificationCard
                    key={cert.id}
                    cert={cert}
                    onOpen={c => setSelectedCert(c)}
                  />
                ))}
              </div>

              {/* Bottom Credential Verification Note */}
              <div
                style={{
                  textAlign: 'center',
                  marginTop: '56px',
                  padding: '24px 28px',
                  borderRadius: '16px',
                  background: 'rgba(0,0,0,0.03)',
                  border: '1px solid rgba(0,0,0,0.06)',
                  maxWidth: '720px',
                  margin: '56px auto 0',
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#666', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
                  VERIFIED TECHNICAL CREDENTIALS &amp; CERTIFICATIONS
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: '#777', margin: 0, lineHeight: 1.6 }}>
                  All credentials listed represent certified academic, enterprise government, and industry-standard milestones. Click "Details ↗" on any certificate card to view verified credential identifiers and competency matrices.
                </p>
              </div>
            </div>
          )}

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
        {/* Contact Content Container */}
        <div
          style={{
            padding: '80px 32px 0',
            maxWidth: '1280px',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '56px',
              alignItems: 'center',
              marginBottom: '64px',
            }}
          >
            {/* Left Column: Heading, description, and CTAs */}
            <div>
              <div className="reveal" style={{ marginBottom: '8px' }}>
                <span className="section-label-dark">INITIALIZE CONNECTION</span>
              </div>
              <h2
                className="reveal delay-100"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.8rem, 5.5vw, 5.8rem)',
                  lineHeight: 0.92,
                  letterSpacing: '-0.01em',
                  color: 'var(--white)',
                  textTransform: 'uppercase',
                  marginTop: '16px',
                  marginBottom: '28px',
                }}
              >
                LET'S BUILD<br />
                <span style={{ color: 'var(--accent)' }}>SOMETHING</span><br />
                GREAT.
              </h2>

              <p className="reveal delay-200" style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--gray)', maxWidth: '480px', lineHeight: 1.8, marginBottom: '36px' }}>
                I'm currently looking for a Freelance position as a Front End Developer/Full-Stack Developer. Let's discuss how my Front-End/Full-Stack development skills, AI experience, and Networking can contribute to your team.
              </p>

              {/* CTAs */}
              <div className="reveal delay-300" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <a href="mailto:cjbaldonado11@gmail.com" className="btn-cta-red">
                  Send Email ↗
                </a>
                <a href="https://www.linkedin.com/in/christian-james-baldonado-7b7721410/" target="_blank" rel="noopener noreferrer" className="btn-cta">
                  LinkedIn ↗
                </a>
              </div>
            </div>

            {/* Right Column: Interactive Dev Console & Telemetry Hub */}
            <div className="reveal delay-200" style={{ width: '100%', maxWidth: '580px', justifySelf: 'center' }}>
              <TelemetryConsole />
            </div>
          </div>

          {/* GitHub Activity & Contribution Telemetry Hub */}
          <div className="reveal delay-300" style={{ width: '100%', marginBottom: '56px' }}>
            <GitHubContributions />
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
                  <span style={{ color: 'var(--accent)', fontSize: '0.4rem', margin: '0 16px' }}>●</span>
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

      {/* ── CERTIFICATION MODAL ── */}
      {selectedCert && (
        <CertificationModal
          cert={selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      )}

      {/* ── AI CHATBOT ── */}
      <Chatbot />
    </>
  );
}

export default App;