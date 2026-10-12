import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ExternalLink,
  Cpu,
  Layers,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Maximize2,
  X,
  ShieldCheck,
  Terminal,
  Compass
} from 'lucide-react';
import TechIcon from './TechIcon';

export interface ProjectGalleryItem {
  caption: string;
  image: string;
}

export interface ProjectFeature {
  title: string;
  desc: string;
}

export interface ProjectArchitectureItem {
  component: string;
  detail: string;
}

export interface Project {
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
  role?: string;
  context?: string;
  slug?: string;
  githubUrl?: string;
  liveUrl?: string;
  credentials?: { user: string; pass: string; note?: string };
  gallery?: ProjectGalleryItem[];
  overview?: string[];
  features?: ProjectFeature[];
  architecture?: ProjectArchitectureItem[];
  metrics?: { label: string; value: string }[];
}

interface ProjectDetailPageProps {
  project: Project;
  allProjects: Project[];
  onBack: () => void;
  onSelectProject: (project: Project) => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  project,
  allProjects,
  onBack,
  onSelectProject,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCreds, setCopiedCreds] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Gallery images: default to project.image + any extra gallery items
  const galleryItems: ProjectGalleryItem[] = project.gallery && project.gallery.length > 0
    ? project.gallery
    : [{ caption: `${project.title} Preview`, image: project.image }];

  const activeImage = galleryItems[activeImageIndex] || galleryItems[0];

  // Current project index and next/prev references
  const currentIndex = allProjects.findIndex(p => p.id === project.id);
  const prevProject = allProjects[(currentIndex - 1 + allProjects.length) % allProjects.length];
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];

  const isGithubLink = project.link.toLowerCase().includes('github.com');
  const liveUrl = project.liveUrl || (!isGithubLink ? project.link : undefined);
  const githubUrl = project.githubUrl || (isGithubLink ? project.link : undefined);

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Lock body scroll while modal is mounted
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Reset active image & reset inner modal scroll on project switch
  useEffect(() => {
    setActiveImageIndex(0);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [project.id]);

  // Keyboard navigation: Escape closes, Left/Right cycles projects
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxOpen) {
          setLightboxOpen(false);
        } else {
          onBack();
        }
      } else if (!lightboxOpen && e.key === 'ArrowRight') {
        onSelectProject(nextProject);
      } else if (!lightboxOpen && e.key === 'ArrowLeft') {
        onSelectProject(prevProject);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, nextProject, prevProject, onBack, onSelectProject]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCredentials = () => {
    if (!project.credentials) return;
    const text = `User: ${project.credentials.user}\nPassword: ${project.credentials.pass}`;
    navigator.clipboard.writeText(text);
    setCopiedCreds(true);
    setTimeout(() => setCopiedCreds(false), 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        backgroundColor: 'rgba(0, 0, 0, 0.88)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(10px, 2.5vw, 24px)',
        animation: 'fadeIn 0.25s ease',
      }}
      onClick={onBack}
    >
      {/* ── Expansive Modal Card Dialog ── */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '1240px',
          width: '100%',
          height: '92vh',
          maxHeight: '92vh',
          backgroundColor: '#0c0c0e',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '24px',
          boxShadow: '0 30px 80px -15px rgba(0, 0, 0, 0.9), 0 0 50px rgba(99, 102, 241, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
          animation: 'modalSlideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* ── Top Pinned Modal Bar ── */}
        <header
          className="project-modal-header"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 24px',
            backgroundColor: 'rgba(15, 15, 18, 0.96)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            zIndex: 20,
            gap: '12px',
            flexShrink: 0,
          }}
        >
          {/* Back Button */}
          <button
            onClick={onBack}
            className="interactive-card"
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--white)',
              padding: '6px 14px',
              borderRadius: '6px',
              border: '1px solid var(--border-dark)',
              background: 'rgba(255, 255, 255, 0.04)',
              transition: 'all 0.2s ease',
            }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Projects</span>
            <span style={{ color: 'var(--gray)', fontSize: '0.62rem', marginLeft: '4px' }}>[ESC]</span>
          </button>

          {/* Project Index & Category Indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              color: 'var(--gray-light)',
              letterSpacing: '0.08em',
            }}
          >
            <span style={{ color: project.color, fontWeight: 700 }}>{project.label}</span>
            <span>•</span>
            <span style={{ textTransform: 'uppercase' }}>{project.venue}</span>
            <span>•</span>
            <span>{project.date}</span>
          </div>

          {/* Quick Prev / Next Navigator & Actions */}
          <div className="project-modal-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => onSelectProject(prevProject)}
                title={`Previous: ${prevProject.title}`}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-dark)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  color: 'var(--gray-light)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--white)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--gray-light)')}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--gray)' }}>
                {currentIndex + 1} / {allProjects.length}
              </span>
              <button
                onClick={() => onSelectProject(nextProject)}
                title={`Next: ${nextProject.title}`}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-dark)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  color: 'var(--gray-light)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--white)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--gray-light)')}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Circular Close Button */}
            <button
              onClick={onBack}
              title="Close modal [ESC]"
              aria-label="Close case study modal"
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff',
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s, transform 0.2s',
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
          </div>
        </header>

        {/* ── Scrollable Modal Body ── */}
        <div
          ref={scrollContainerRef}
          className="project-modal-scroll"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 'clamp(20px, 3.5vw, 36px) clamp(16px, 3vw, 32px)',
            overscrollBehavior: 'contain',
          }}
        >
          <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
            {/* Project Header Banner */}
            <section style={{ marginBottom: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.62rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '4px 10px',
                borderRadius: '4px',
                background: `${project.color}22`,
                border: `1px solid ${project.color}66`,
                color: project.color,
                fontWeight: 600,
              }}
            >
              {project.label} // {project.venue}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.62rem',
                letterSpacing: '0.1em',
                color: '#34d399',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                padding: '3px 8px',
                borderRadius: '4px',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
              ACTIVE BUILD • {project.date}
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
              color: 'var(--white)',
              marginBottom: '18px',
            }}
          >
            {project.title}
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.95rem, 2vw, 1.15rem)',
              color: 'var(--gray-light)',
              lineHeight: 1.6,
              maxWidth: '920px',
              marginBottom: '28px',
            }}
          >
            {project.longDesc || project.description}
          </p>

          {/* Quick Action Links & Metadata Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap',
              paddingTop: '18px',
              borderTop: '1px solid var(--border-dark)',
            }}
          >
            {/* Primary Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-cta-red"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.78rem',
                    textDecoration: 'none',
                    padding: '10px 20px',
                  }}
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Launch Live Project</span>
                </a>
              )}

              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    letterSpacing: '0.06em',
                    color: 'var(--white)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-dark)',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.borderColor = 'var(--border-dark)';
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>View Source Code</span>
                </a>
              )}

              <button
                onClick={handleCopyLink}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.04em',
                  color: 'var(--gray-light)',
                  background: 'transparent',
                  border: '1px solid var(--border-dark)',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied!' : 'Share Case Study'}</span>
              </button>
            </div>

            {/* Quick Specs Pill Badges */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {project.role && (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--gray-light)' }}>
                  <span style={{ color: 'var(--gray)' }}>ROLE:</span> {project.role}
                </div>
              )}
              {project.context && (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--gray-light)' }}>
                  <span style={{ color: 'var(--gray)' }}>CONTEXT:</span> {project.context}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Interactive Screenshot Gallery Showcase ── */}
        <section style={{ marginBottom: '48px' }}>
          <div
            style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              backgroundColor: '#050507',
              border: '1px solid var(--border-dark)',
              boxShadow: '0 20px 48px -12px rgba(0, 0, 0, 0.7)',
            }}
          >
            {/* Viewport Top Window Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 18px',
                background: 'rgba(255, 255, 255, 0.02)',
                borderBottom: '1px solid var(--border-dark)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#eab308' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e' }} />
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    color: 'var(--gray)',
                    marginLeft: '8px',
                    letterSpacing: '0.04em',
                  }}
                >
                  {project.title.toLowerCase().replace(/\s+/g, '-')}.interface.preview
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setLightboxOpen(true)}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.62rem',
                    color: 'var(--gray-light)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    background: 'rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Enlarge</span>
                </button>
              </div>
            </div>

            {/* Main Active Image Display */}
            <div
              onClick={() => setLightboxOpen(true)}
              style={{
                cursor: 'zoom-in',
                position: 'relative',
                maxHeight: '680px',
                minHeight: '360px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#09090b',
                overflow: 'hidden',
              }}
            >
              <img
                src={activeImage.image}
                alt={activeImage.caption}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '680px',
                  objectFit: 'contain',
                  display: 'block',
                  transition: 'transform 0.3s ease',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '14px 20px',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--white)' }}>
                  {activeImage.caption}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--gray-light)' }}>
                  Click to inspect full resolution 🔍
                </span>
              </div>
            </div>

            {/* Gallery Thumbnail Strip (if multiple images exist) */}
            {galleryItems.length > 1 && (
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  padding: '14px 18px',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  borderTop: '1px solid var(--border-dark)',
                  overflowX: 'auto',
                }}
              >
                {galleryItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    style={{
                      all: 'unset',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      width: '120px',
                      height: '75px',
                      flexShrink: 0,
                      border: idx === activeImageIndex ? `2px solid ${project.color}` : '2px solid transparent',
                      opacity: idx === activeImageIndex ? 1 : 0.6,
                      transition: 'all 0.2s',
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.caption}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Two-Column Editorial Deep Dive Grid ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 360px)',
            gap: '40px',
            alignItems: 'start',
          }}
          className="project-deepdive-grid"
        >
          {/* ── Left Column: Narrative, Features, Architecture ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
            {/* Overview / Mission */}
            <div
              style={{
                padding: '28px',
                borderRadius: '14px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-dark)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Compass className="w-4 h-4" style={{ color: project.color }} />
                <h2
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--white)',
                    margin: 0,
                  }}
                >
                  Mission & Problem Statement
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {(project.overview && project.overview.length > 0
                  ? project.overview
                  : [project.longDesc, project.description]
                ).map((para, i) => (
                  <p
                    key={i}
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.88rem',
                      lineHeight: 1.75,
                      color: 'var(--gray-light)',
                      margin: 0,
                    }}
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* Key Features & System Capabilities */}
            {project.features && project.features.length > 0 && (
              <div
                style={{
                  padding: '28px',
                  borderRadius: '14px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-dark)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                  <Sparkles className="w-4 h-4" style={{ color: project.color }} />
                  <h2
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--white)',
                      margin: 0,
                    }}
                  >
                    Core Architectural Capabilities
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                  {project.features.map((feat, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '16px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--border-dark)',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontWeight: 600,
                          fontSize: '0.92rem',
                          color: 'var(--white)',
                          marginBottom: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: project.color }} />
                        {feat.title}
                      </div>
                      <p
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.78rem',
                          color: 'var(--gray)',
                          lineHeight: 1.6,
                          margin: 0,
                        }}
                      >
                        {feat.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* System Architecture Breakdown */}
            {project.architecture && project.architecture.length > 0 && (
              <div
                style={{
                  padding: '28px',
                  borderRadius: '14px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-dark)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                  <Layers className="w-4 h-4" style={{ color: project.color }} />
                  <h2
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--white)',
                      margin: 0,
                    }}
                  >
                    Engineering & Infrastructure Pipeline
                  </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {project.architecture.map((arch, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '160px 1fr',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--border-dark)',
                        gap: '12px',
                        alignItems: 'center',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.72rem',
                          color: 'var(--white)',
                          fontWeight: 600,
                        }}
                      >
                        {arch.component}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.75rem',
                          color: 'var(--gray-light)',
                        }}
                      >
                        {arch.detail}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Credentials / Sandbox Access Card (if project provides it) */}
            {project.credentials && (
              <div
                style={{
                  padding: '24px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(99, 102, 241, 0.05)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--white)' }}>
                      DEMO & ACCESS CREDENTIALS
                    </span>
                  </div>
                  <button
                    onClick={handleCopyCredentials}
                    style={{
                      all: 'unset',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.65rem',
                      color: 'var(--accent)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      background: 'rgba(99, 102, 241, 0.15)',
                    }}
                  >
                    {copiedCreds ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCreds ? 'Copied!' : 'Copy Credentials'}</span>
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--gray)', marginBottom: '4px' }}>LOGIN USER</div>
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#38bdf8' }}>{project.credentials.user}</code>
                  </div>
                  <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--gray)', marginBottom: '4px' }}>PASSWORD</div>
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#38bdf8' }}>{project.credentials.pass}</code>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Right Column (Sidebar): Tech Arsenal, Metrics, Creator Card ── */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Tech Stack Arsenal Card */}
            <div
              style={{
                padding: '24px',
                borderRadius: '14px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-dark)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Cpu className="w-4 h-4" style={{ color: project.color }} />
                <h3
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--white)',
                    margin: 0,
                  }}
                >
                  Technical Arsenal
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {project.stack.map(tech => (
                  <div
                    key={tech}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-dark)',
                    }}
                  >
                    <TechIcon name={tech} size={18} />
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        color: 'var(--white)',
                        fontWeight: 500,
                      }}
                    >
                      {tech}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Specs Matrix */}
            <div
              style={{
                padding: '24px',
                borderRadius: '14px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-dark)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Terminal className="w-4 h-4" style={{ color: project.color }} />
                <h3
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--white)',
                    margin: 0,
                  }}
                >
                  Project Telemetry
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--gray)' }}>DOMAIN</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--white)', fontWeight: 600 }}>{project.venue}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--gray)' }}>YEAR RELEASED</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--white)', fontWeight: 600 }}>{project.date}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--gray)' }}>SYSTEM ID</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: project.color, fontWeight: 700 }}>{project.label}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--gray)' }}>AUTHOR / DEV</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--white)' }}>CJ Baldonado</span>
                </div>
              </div>
            </div>

            {/* Quick Next Project Navigator Card */}
            <div
              onClick={() => onSelectProject(nextProject)}
              className="interactive-card"
              style={{
                cursor: 'pointer',
                padding: '20px',
                borderRadius: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-dark)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = nextProject.color;
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border-dark)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--gray)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  NEXT CASE STUDY →
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: nextProject.color, fontWeight: 700 }}>
                  {nextProject.label}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={nextProject.image}
                  alt={nextProject.title}
                  style={{ width: '64px', height: '44px', objectFit: 'cover', borderRadius: '6px' }}
                />
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.95rem', color: 'var(--white)' }}>
                    {nextProject.title}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--gray)' }}>
                    {nextProject.venue}
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* ── Footer Navigation ── */}
        <div
          style={{
            marginTop: '60px',
            paddingTop: '32px',
            borderTop: '1px solid var(--border-dark)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <button
            onClick={onBack}
            className="btn-cta-red"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.78rem',
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Portfolio</span>
          </button>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => onSelectProject(prevProject)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--gray-light)',
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid var(--border-dark)',
                background: 'rgba(255, 255, 255, 0.03)',
              }}
            >
              ← {prevProject.title}
            </button>
            <button
              onClick={() => onSelectProject(nextProject)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--white)',
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid var(--border-dark)',
                background: 'rgba(255, 255, 255, 0.05)',
              }}
            >
              {nextProject.title} →
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

      {/* ── Lightbox Zoom Modal ── */}
      {lightboxOpen && (
        <div
          onClick={() => setLightboxOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 250,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            cursor: 'zoom-out',
          }}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            aria-label="Close image zoom"
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              all: 'unset',
              cursor: 'pointer',
              color: 'var(--white)',
              padding: '8px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
            }}
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={activeImage.image}
            alt={activeImage.caption}
            style={{
              maxWidth: '94vw',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ProjectDetailPage;
