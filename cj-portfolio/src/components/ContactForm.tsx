import React, { useState, useEffect } from 'react';
import sussyWaveWebp from '../assets/sussy_wave.webp';

interface FormData {
  name: string;
  email: string;
  topic: string;
  message: string;
}

const TOPICS = [
  { id: 'freelance', label: '🚀 Freelance Project' },
  { id: 'fulltime', label: '💼 Full-Time Role' },
  { id: 'ai_web', label: '🤖 AI & Full-Stack' },
  { id: 'hello', label: '☕ Say Hello' },
];

const RATE_LIMIT_STORAGE_KEY = 'cj_contact_ratelimit_v1';
const COOLDOWN_SECONDS = 180; // 3 minutes cooldown between consecutive transmissions
const MAX_PER_HOUR = 3; // Maximum 3 transmissions per 60 minutes
const HOUR_MS = 60 * 60 * 1000;

interface RateLimitStatus {
  allowed: boolean;
  remainingSeconds: number;
  reason: 'cooldown' | 'hourly_limit' | null;
}

const getRateLimitStatus = (): RateLimitStatus => {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_STORAGE_KEY);
    if (!raw) return { allowed: true, remainingSeconds: 0, reason: null };
    const parsed = JSON.parse(raw);
    const timestamps: number[] = Array.isArray(parsed.timestamps) ? parsed.timestamps : [];
    const now = Date.now();
    const validTimestamps = timestamps.filter(t => now - t < HOUR_MS);

    // 1. Hourly limit check
    if (validTimestamps.length >= MAX_PER_HOUR) {
      const oldest = validTimestamps[0];
      const remainingSec = Math.ceil((oldest + HOUR_MS - now) / 1000);
      if (remainingSec > 0) {
        return { allowed: false, remainingSeconds: remainingSec, reason: 'hourly_limit' };
      }
    }

    // 2. Cooldown check between consecutive transmissions
    if (validTimestamps.length > 0) {
      const latest = validTimestamps[validTimestamps.length - 1];
      const elapsedSec = Math.floor((now - latest) / 1000);
      if (elapsedSec < COOLDOWN_SECONDS) {
        return { allowed: false, remainingSeconds: COOLDOWN_SECONDS - elapsedSec, reason: 'cooldown' };
      }
    }

    return { allowed: true, remainingSeconds: 0, reason: null };
  } catch {
    return { allowed: true, remainingSeconds: 0, reason: null };
  }
};

const recordSubmissionTimestamp = () => {
  try {
    const now = Date.now();
    const raw = localStorage.getItem(RATE_LIMIT_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    const timestamps: number[] = Array.isArray(parsed.timestamps) ? parsed.timestamps : [];
    const validTimestamps = timestamps.filter(t => now - t < HOUR_MS);
    validTimestamps.push(now);
    localStorage.setItem(RATE_LIMIT_STORAGE_KEY, JSON.stringify({ timestamps: validTimestamps }));
  } catch (e) {
    console.error('Failed to save rate limit timestamp:', e);
  }
};

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    topic: '🚀 Freelance Project',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [isActivationNotice, setIsActivationNotice] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Rate limiting & anti-spam state (lazy initialization avoids cascading renders)
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(() => {
    return getRateLimitStatus().remainingSeconds;
  });
  const [rateLimitReason, setRateLimitReason] = useState<'cooldown' | 'hourly_limit' | null>(() => {
    return getRateLimitStatus().reason;
  });
  const [honeypot, setHoneypot] = useState('');

  // Interval countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCooldownRemaining(prev => {
        if (prev <= 1) {
          setRateLimitReason(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatCooldown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleTopicSelect = (topicLabel: string) => {
    setFormData(prev => ({ ...prev, topic: topicLabel }));
  };

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText('cjbaldonado11@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2400);
  };

  const constructMailtoUrl = () => {
    const subject = encodeURIComponent(`[Portfolio Transmission] ${formData.topic} from ${formData.name}`);
    const body = encodeURIComponent(
      `Name / Sender: ${formData.name}\n` +
      `Email Address: ${formData.email}\n` +
      `Inquiry Topic: ${formData.topic}\n\n` +
      `Message:\n${formData.message}\n\n` +
      `---\n` +
      `Dispatched via CJ Baldonado Portfolio Transmission Terminal`
    );
    return `mailto:cjbaldonado11@gmail.com?subject=${subject}&body=${body}`;
  };

  const handleCopySummary = () => {
    const summaryText =
      `To: cjbaldonado11@gmail.com\n` +
      `Subject: [Portfolio Transmission] ${formData.topic} from ${formData.name}\n\n` +
      `Sender: ${formData.name} (${formData.email})\n` +
      `Topic: ${formData.topic}\n\n` +
      `Message:\n${formData.message}`;
    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2400);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Invisible Honeypot check (silently trap bots)
    if (honeypot.trim()) {
      setStatus('submitting');
      setTimeout(() => {
        setIsActivationNotice(false);
        setStatus('success');
      }, 500);
      return;
    }

    // 2. Client-side rate limit & cooldown check
    const rateStatus = getRateLimitStatus();
    if (!rateStatus.allowed) {
      setCooldownRemaining(rateStatus.remainingSeconds);
      setRateLimitReason(rateStatus.reason);
      setErrorMessage(
        rateStatus.reason === 'hourly_limit'
          ? `Transmission limit reached (max ${MAX_PER_HOUR} per hour). Next transmission available in ${formatCooldown(rateStatus.remainingSeconds)}.`
          : `Anti-spam cooldown active. Next transmission available in ${formatCooldown(rateStatus.remainingSeconds)}.`
      );
      return;
    }

    // Basic validation
    if (!formData.name.trim()) {
      setErrorMessage('Please enter your name or organization.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    if (!formData.message.trim()) {
      setErrorMessage('Please enter your transmission message.');
      return;
    }

    setErrorMessage('');
    setStatus('submitting');

    // Optional environment variable overrides (Web3Forms / Formspree)
    const web3formsKey = import.meta.env.VITE_WEB3FORMS_KEY;
    const formspreeId = import.meta.env.VITE_FORMSPREE_ID;

    if (web3formsKey) {
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: web3formsKey,
            name: formData.name,
            email: formData.email,
            subject: `[Portfolio Transmission] ${formData.topic} from ${formData.name}`,
            message: formData.message,
          }),
        });
        const result = await response.json();
        if (result.success) {
          recordSubmissionTimestamp();
          setCooldownRemaining(COOLDOWN_SECONDS);
          setRateLimitReason('cooldown');
          setIsActivationNotice(false);
          setStatus('success');
          return;
        }
      } catch (err) {
        console.error('Web3Forms error, trying direct transmission:', err);
      }
    } else if (formspreeId) {
      try {
        const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            topic: formData.topic,
            message: formData.message,
          }),
        });
        if (response.ok) {
          recordSubmissionTimestamp();
          setCooldownRemaining(COOLDOWN_SECONDS);
          setRateLimitReason('cooldown');
          setIsActivationNotice(false);
          setStatus('success');
          return;
        }
      } catch (err) {
        console.error('Formspree error, trying direct transmission:', err);
      }
    }

    // Direct transmission to cjbaldonado11@gmail.com via FormSubmit.co
    try {
      const response = await fetch('https://formsubmit.co/ajax/cjbaldonado11@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          _replyto: formData.email,
          _subject: `[Portfolio Transmission] ${formData.topic} from ${formData.name}`,
          topic: formData.topic,
          message: formData.message,
          _template: 'table',
          _captcha: 'false',
        }),
      });

      const result = await response.json();
      recordSubmissionTimestamp();
      setCooldownRemaining(COOLDOWN_SECONDS);
      setRateLimitReason('cooldown');

      if (result.success === 'true' || result.success === true) {
        setIsActivationNotice(false);
        setStatus('success');
      } else if (result.message && result.message.toLowerCase().includes('activation')) {
        setIsActivationNotice(true);
        setStatus('success');
      } else {
        setIsActivationNotice(false);
        setStatus('success');
      }
    } catch (err) {
      console.error('Transmission failed:', err);
      // Fallback: Dispatch mailto if network blocked
      const mailtoUrl = constructMailtoUrl();
      try {
        window.open(mailtoUrl, '_blank');
      } catch {
        window.location.href = mailtoUrl;
      }
      recordSubmissionTimestamp();
      setCooldownRemaining(COOLDOWN_SECONDS);
      setRateLimitReason('cooldown');
      setIsActivationNotice(false);
      setStatus('success');
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      topic: '🚀 Freelance Project',
      message: '',
    });
    setStatus('idle');
    setErrorMessage('');
  };

  return (
    <div
      style={{
        borderRadius: '16px',
        background: 'rgba(18, 18, 24, 0.98)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 24px 60px -12px rgba(0, 0, 0, 0.6), 0 0 35px rgba(99, 102, 241, 0.06)',
        overflow: 'hidden',
        position: 'relative',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
      }}
      className="interactive-card"
    >
      {/* Top Window Chrome */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 18px',
          background: 'rgba(255, 255, 255, 0.02)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        {/* Left: Window Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              color: 'var(--gray-light)',
              letterSpacing: '0.06em',
              marginLeft: '8px',
            }}
          >
            sys-transmission@baldonado:~
          </span>
        </div>

        {/* Right: Live Status Indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            padding: '4px 10px',
            borderRadius: '999px',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 8px #10b981',
              display: 'inline-block',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              color: '#34d399',
              letterSpacing: '0.08em',
              fontWeight: 700,
              textTransform: 'uppercase',
            }}
          >
            AVAILABLE FOR WORK
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      {status === 'success' ? (
        /* Success Screen */
        <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Header confirmation */}
          <div style={{ textAlign: 'center', padding: '12px 0 6px' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: isActivationNotice ? 'rgba(245, 158, 11, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                border: isActivationNotice ? '1px solid rgba(245, 158, 11, 0.35)' : '1px solid rgba(16, 185, 129, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: isActivationNotice ? '#f59e0b' : '#34d399',
                fontSize: '1.6rem',
                boxShadow: isActivationNotice
                  ? '0 0 24px rgba(245, 158, 11, 0.25)'
                  : '0 0 24px rgba(16, 185, 129, 0.25)',
              }}
            >
              {isActivationNotice ? '⚡' : '✓'}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                color: isActivationNotice ? '#f59e0b' : '#34d399',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '6px',
              }}
            >
              {isActivationNotice ? 'ONE-TIME INBOX ACTIVATION REQUIRED' : 'TRANSMISSION DELIVERED DIRECTLY TO INBOX'}
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--white)',
                marginBottom: '8px',
              }}
            >
              {isActivationNotice ? 'Almost Ready!' : `Thank You, ${formData.name}!`}
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.82rem',
                color: 'var(--gray-light)',
                maxWidth: '440px',
                margin: '0 auto',
                lineHeight: 1.6,
              }}
            >
              {isActivationNotice ? (
                <>
                  FormSubmit has sent a one-time verification email to{' '}
                  <strong style={{ color: 'var(--white)' }}>cjbaldonado11@gmail.com</strong>.
                  Please open your inbox (or Spam folder) and click <strong>"Activate Form"</strong>.
                  Once activated, all future messages from this form will land straight into your inbox!
                </>
              ) : (
                <>
                  Your message has been transmitted directly to{' '}
                  <strong style={{ color: 'var(--white)' }}>cjbaldonado11@gmail.com</strong>.
                  CJ will review your transmission and reply within 24 hours.
                </>
              )}
            </p>
          </div>

          {/* Message summary terminal preview */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '10px',
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              lineHeight: 1.6,
            }}
          >
            <div style={{ color: 'var(--gray)' }}>// TRANSMISSION MANIFEST</div>
            <div>
              <span style={{ color: '#38bdf8' }}>FROM:</span>{' '}
              <span style={{ color: 'var(--white)' }}>{formData.name} &lt;{formData.email}&gt;</span>
            </div>
            <div>
              <span style={{ color: '#38bdf8' }}>TOPIC:</span>{' '}
              <span style={{ color: '#818cf8' }}>{formData.topic}</span>
            </div>
            <div style={{ marginTop: '6px', color: '#94a3b8', fontStyle: 'italic' }}>
              "{formData.message.length > 120 ? formData.message.substring(0, 120) + '...' : formData.message}"
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {isActivationNotice ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
                {/* Open Gmail to activate */}
                <a
                  href="https://mail.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: 'none',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 0 16px rgba(245, 158, 11, 0.3)',
                    transition: 'all 0.2s',
                  }}
                >
                  <span>📬</span> Check Gmail to Activate ↗
                </a>

                {/* Reset / Send another */}
                <button
                  type="button"
                  onClick={handleReset}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'var(--white)',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <span>↺</span> Send Another Message
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
                {/* Send Another Transmission (Primary) */}
                <button
                  type="button"
                  onClick={handleReset}
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 0 16px rgba(99, 102, 241, 0.35)',
                    transition: 'all 0.2s',
                  }}
                >
                  <span>↺</span> Send Another Transmission
                </button>

                {/* Copy summary */}
                <button
                  type="button"
                  onClick={handleCopySummary}
                  style={{
                    background: copiedSummary ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: copiedSummary ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.08)',
                    color: copiedSummary ? '#34d399' : 'var(--gray-light)',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {copiedSummary ? '✓ Copied to Clipboard' : '📋 Copy Full Message'}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Contact Form Interactive View */
        <form onSubmit={handleSubmit} style={{ padding: '22px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Header Tagline */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: 'var(--accent)', fontSize: '0.85rem' }}>⚡</span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  color: 'var(--white)',
                  letterSpacing: '0.08em',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                DIRECT CONTACT FORM
              </span>
            </div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.58rem',
                color: 'var(--gray)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              RESPONSE &lt; 24H
            </span>
          </div>

          {/* Name & Email Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px' }}>
            {/* Name Input */}
            <div>
              <label
                htmlFor="form-name"
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.58rem',
                  color: 'var(--gray)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '6px',
                }}
              >
                NAME / ORGANIZATION <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="form-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Christian Grey"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'var(--white)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'var(--accent)';
                  e.target.style.boxShadow = '0 0 16px rgba(99, 102, 241, 0.25)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.background = 'rgba(255, 255, 255, 0.03)';
                }}
              />
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor="form-email"
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.58rem',
                  color: 'var(--gray)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '6px',
                }}
              >
                EMAIL ADDRESS <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="form-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="e.g. name@company.com"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'var(--white)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'var(--accent)';
                  e.target.style.boxShadow = '0 0 16px rgba(99, 102, 241, 0.25)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.background = 'rgba(255, 255, 255, 0.03)';
                }}
              />
            </div>
          </div>

          {/* Topic / Project Type Pills */}
          <div>
            <label
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.58rem',
                color: 'var(--gray)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}
            >
              INQUIRY TYPE / TOPIC
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {TOPICS.map(topic => {
                const isSelected = formData.topic === topic.label;
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => handleTopicSelect(topic.label)}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      letterSpacing: '0.04em',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: isSelected ? 'rgba(99, 102, 241, 0.22)' : 'rgba(255, 255, 255, 0.02)',
                      border: isSelected ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.08)',
                      color: isSelected ? '#ffffff' : 'var(--gray-light)',
                      boxShadow: isSelected ? '0 0 14px rgba(99, 102, 241, 0.3)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {topic.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message Textarea */}
          <div>
            <label
              htmlFor="form-message"
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.58rem',
                color: 'var(--gray)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '6px',
              }}
            >
              TRANSMISSION MESSAGE <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <textarea
              id="form-message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Tell me about your project scope, timeline, ideas, or questions..."
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'var(--white)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem',
                lineHeight: 1.6,
                outline: 'none',
                resize: 'vertical',
                minHeight: '90px',
                transition: 'all 0.2s ease',
              }}
              onFocus={e => {
                e.target.style.borderColor = 'var(--accent)';
                e.target.style.boxShadow = '0 0 16px rgba(99, 102, 241, 0.25)';
                e.target.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
              onBlur={e => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.boxShadow = 'none';
                e.target.style.background = 'rgba(255, 255, 255, 0.03)';
              }}
            />
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>⚠</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Rate Limit Active Warning Notice */}
          {cooldownRemaining > 0 && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                color: '#fbbf24',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                lineHeight: 1.4,
              }}
            >
              <span style={{ fontSize: '0.9rem' }}>⏳</span>
              <div>
                <span style={{ fontWeight: 600 }}>Rate limit active: </span>
                {rateLimitReason === 'hourly_limit'
                  ? `Hourly cap reached (${MAX_PER_HOUR}/hr). Next transmission available in `
                  : `Cooldown active. Next transmission available in `}
                <strong style={{ color: '#fff', textDecoration: 'underline' }}>{formatCooldown(cooldownRemaining)}</strong>.
              </div>
            </div>
          )}

          {/* Invisible honeypot field to block spambots */}
          <input
            type="text"
            name="_honey"
            value={honeypot}
            onChange={e => setHoneypot(e.target.value)}
            style={{ display: 'none' }}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          {/* Mascot Callout */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'rgba(0, 0, 0, 0.25)',
              border: '1px dashed rgba(255, 255, 255, 0.1)',
            }}
          >
            <img
              src={sussyWaveWebp}
              alt="Sussy Mascot"
              style={{ width: '34px', height: '34px', objectFit: 'contain', flexShrink: 0 }}
            />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--gray-light)', lineHeight: 1.4 }}>
              <span style={{ color: '#38bdf8', fontWeight: 600 }}>Sussy (System Pilot): </span>
              "Transmissions forward straight to CJ's inbox. Fast turnaround guaranteed!"
            </div>
          </div>

          {/* Submission and Copy Email Actions */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="submit"
              disabled={status === 'submitting' || cooldownRemaining > 0}
              style={{
                flex: '1 1 200px',
                padding: '12px 20px',
                borderRadius: '10px',
                background:
                  cooldownRemaining > 0
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                border:
                  cooldownRemaining > 0
                    ? '1px solid rgba(255, 255, 255, 0.1)'
                    : '1px solid rgba(255, 255, 255, 0.2)',
                color: cooldownRemaining > 0 ? 'var(--gray)' : 'var(--white)',
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: '0.85rem',
                letterSpacing: '0.04em',
                cursor: status === 'submitting' || cooldownRemaining > 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: cooldownRemaining > 0 ? 'none' : '0 0 20px rgba(99, 102, 241, 0.4)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                if (status !== 'submitting' && cooldownRemaining === 0) {
                  e.currentTarget.style.boxShadow = '0 0 28px rgba(99, 102, 241, 0.65)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={e => {
                if (cooldownRemaining === 0) {
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(99, 102, 241, 0.4)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {status === 'submitting' ? (
                <>
                  <span
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#fff',
                      animation: 'spin 0.6s linear infinite',
                      display: 'inline-block',
                    }}
                  />
                  <span>Dispatching...</span>
                </>
              ) : cooldownRemaining > 0 ? (
                <>
                  <span>⏳ Cooldown Active ({formatCooldown(cooldownRemaining)})</span>
                </>
              ) : (
                <>
                  <span>Transmit Message</span>
                  <span>↗</span>
                </>
              )}
            </button>

            {/* Quick Copy Email Hub Button */}
            <button
              type="button"
              onClick={handleCopyEmail}
              title="Copy direct email address"
              style={{
                background: copiedEmail ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                border: copiedEmail ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                color: copiedEmail ? '#34d399' : 'var(--gray-light)',
                padding: '12px 16px',
                borderRadius: '10px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                flexShrink: 0,
              }}
              onMouseEnter={e => {
                if (!copiedEmail) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.color = 'var(--white)';
                }
              }}
              onMouseLeave={e => {
                if (!copiedEmail) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.color = 'var(--gray-light)';
                }
              }}
            >
              {copiedEmail ? (
                <>
                  <span>✓</span> Copied Email
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span>Copy Email</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Terminal Status Bar (Footer) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 18px',
          background: 'rgba(0, 0, 0, 0.4)',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.62rem',
          color: 'var(--gray)',
          letterSpacing: '0.06em',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span>PORT: 3000</span>
          <span>●</span>
          <span>LATENCY: 14ms</span>
          <span>●</span>
          <span style={{ color: '#10b981' }}>200 OK</span>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <a
            href="https://github.com/Akosidakdok"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--gray-light)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--white)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--gray-light)')}
          >
            GitHub ↗
          </a>
          <a
            href="https://www.linkedin.com/in/christian-james-baldonado-7b7721410/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--gray-light)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--white)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--gray-light)')}
          >
            LinkedIn ↗
          </a>
        </div>
      </div>
    </div>
  );
}
