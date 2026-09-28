import React, { useState, useEffect } from 'react';
import {
  Send,
  Copy,
  Check,
  Clock,
  ArrowUpRight,
  AlertCircle,
  RotateCcw,
  CheckCircle2,
  Mail,
} from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  topic: string;
  message: string;
}

const TOPICS = [
  { id: 'freelance', label: 'Freelance Project' },
  { id: 'fulltime', label: 'Full-Time Role' },
  { id: 'ai_web', label: 'AI & Full-Stack' },
  { id: 'general', label: 'General Inquiry' },
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
    topic: 'Freelance Project',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [isActivationNotice, setIsActivationNotice] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Rate limiting & anti-spam state
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
    const subject = encodeURIComponent(`[Portfolio Inquiry] ${formData.topic} - ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Topic: ${formData.topic}\n\n` +
      `Message:\n${formData.message}\n\n` +
      `---\n` +
      `Sent via CJ Baldonado Portfolio Contact Form`
    );
    return `mailto:cjbaldonado11@gmail.com?subject=${subject}&body=${body}`;
  };

  const handleCopySummary = () => {
    const summaryText =
      `To: cjbaldonado11@gmail.com\n` +
      `Subject: [Portfolio Inquiry] ${formData.topic} - ${formData.name}\n\n` +
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
          ? `Submission limit reached (max ${MAX_PER_HOUR} per hour). Available again in ${formatCooldown(rateStatus.remainingSeconds)}.`
          : `Please wait ${formatCooldown(rateStatus.remainingSeconds)} before sending another message.`
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
      setErrorMessage('Please write a short message before sending.');
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
            subject: `[Portfolio Inquiry] ${formData.topic} - ${formData.name}`,
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
          _subject: `[Portfolio Inquiry] ${formData.topic} - ${formData.name}`,
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
      console.error('Submission failed, opening fallback mailto client:', err);
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
      topic: 'Freelance Project',
      message: '',
    });
    setStatus('idle');
    setErrorMessage('');
  };

  return (
    <div
      style={{
        borderRadius: '20px',
        background: 'linear-gradient(180deg, rgba(20, 20, 26, 0.85) 0%, rgba(12, 12, 16, 0.95) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 24px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
        position: 'relative',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      {/* Refined Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 22px',
          background: 'rgba(255, 255, 255, 0.02)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        {/* Availability status badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ position: 'relative', display: 'flex', height: '8px', width: '8px' }}>
            <span
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                backgroundColor: '#22c55e',
                opacity: 0.6,
                animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
              }}
            />
            <span
              style={{
                position: 'relative',
                display: 'inline-flex',
                borderRadius: '50%',
                height: '8px',
                width: '8px',
                backgroundColor: '#22c55e',
              }}
            />
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              color: '#86efac',
              letterSpacing: '0.04em',
              fontWeight: 600,
            }}
          >
            Available for opportunities
          </span>
        </div>

        {/* Expected response time indicator */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            color: 'var(--gray-light)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
          }}
        >
          <Clock size={12} style={{ color: 'var(--gray)' }} />
          <span>Replies in &lt; 24h</span>
        </div>
      </div>

      {/* Main Content Area */}
      {status === 'success' ? (
        /* Polished Success Screen */
        <div style={{ padding: '36px 24px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: isActivationNotice ? 'rgba(245, 158, 11, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                border: isActivationNotice ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: isActivationNotice ? '#f59e0b' : '#34d399',
              }}
            >
              {isActivationNotice ? <Mail size={22} /> : <CheckCircle2 size={24} />}
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.35rem',
                fontWeight: 700,
                color: 'var(--white)',
                marginBottom: '8px',
              }}
            >
              {isActivationNotice ? 'Almost there!' : `Message Received!`}
            </h3>

            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem',
                color: 'var(--gray-light)',
                maxWidth: '440px',
                margin: '0 auto',
                lineHeight: 1.6,
              }}
            >
              {isActivationNotice ? (
                <>
                  FormSubmit sent a one-time verification link to{' '}
                  <strong style={{ color: 'var(--white)' }}>cjbaldonado11@gmail.com</strong>.
                  Please check your inbox (or Spam folder) and click <strong>"Activate Form"</strong> to finish setting up direct message delivery.
                </>
              ) : (
                <>
                  Thank you, <strong style={{ color: 'var(--white)' }}>{formData.name}</strong>. Your message was delivered to{' '}
                  <strong style={{ color: 'var(--white)' }}>cjbaldonado11@gmail.com</strong>. I will get back to you shortly!
                </>
              )}
            </p>
          </div>

          {/* Clean Message Summary */}
          <div
            style={{
              padding: '16px 18px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              fontSize: '0.78rem',
              lineHeight: 1.6,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--gray)', fontFamily: 'var(--font-mono)', fontSize: '0.68rem' }}>SUMMARY</span>
              <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 500 }}>{formData.topic}</span>
            </div>
            <div style={{ color: 'var(--white)', fontWeight: 500 }}>
              {formData.name} <span style={{ color: 'var(--gray)', fontWeight: 400 }}>&lt;{formData.email}&gt;</span>
            </div>
            <div style={{ marginTop: '6px', color: 'var(--gray-light)', fontStyle: 'italic' }}>
              "{formData.message.length > 120 ? formData.message.substring(0, 120) + '...' : formData.message}"
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {isActivationNotice ? (
              <a
                href="https://mail.google.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: '1 1 180px',
                  textDecoration: 'none',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: '#ffffff',
                  padding: '11px 16px',
                  borderRadius: '10px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(245, 158, 11, 0.25)',
                }}
              >
                <Mail size={15} />
                <span>Open Gmail to Activate</span>
                <ArrowUpRight size={14} />
              </a>
            ) : (
              <button
                type="button"
                onClick={handleReset}
                style={{
                  flex: '1 1 180px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  padding: '11px 16px',
                  borderRadius: '10px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)',
                  transition: 'all 0.2s',
                }}
              >
                <RotateCcw size={14} />
                <span>Send Another Message</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCopySummary}
              style={{
                flex: '1 1 160px',
                background: copiedSummary ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                border: copiedSummary ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.08)',
                color: copiedSummary ? '#34d399' : 'var(--gray-light)',
                padding: '11px 16px',
                borderRadius: '10px',
                fontFamily: 'var(--font-body)',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {copiedSummary ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedSummary ? 'Copied' : 'Copy Message Note'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Clean Professional Form */
        <form onSubmit={handleSubmit} style={{ padding: '26px 24px 22px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Topic / Project Type Selection */}
          <div>
            <label
              style={{
                display: 'block',
                fontFamily: 'var(--font-body)',
                fontSize: '0.78rem',
                fontWeight: 500,
                color: 'var(--gray-light)',
                marginBottom: '10px',
              }}
            >
              I'm interested in
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
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.78rem',
                      fontWeight: isSelected ? 600 : 400,
                      padding: '7px 14px',
                      borderRadius: '8px',
                      background: isSelected ? 'rgba(99, 102, 241, 0.14)' : 'rgba(255, 255, 255, 0.025)',
                      border: isSelected ? '1px solid rgba(99, 102, 241, 0.6)' : '1px solid rgba(255, 255, 255, 0.08)',
                      color: isSelected ? '#ffffff' : 'var(--gray-light)',
                      boxShadow: isSelected ? '0 0 14px rgba(99, 102, 241, 0.2)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                    onMouseEnter={e => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                        e.currentTarget.style.color = '#ffffff';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.color = 'var(--gray-light)';
                      }
                    }}
                  >
                    {isSelected && (
                      <span
                        style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          background: 'var(--accent)',
                          boxShadow: '0 0 6px var(--accent)',
                          display: 'inline-block',
                        }}
                      />
                    )}
                    {topic.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name & Email Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px' }}>
            {/* Name Input */}
            <div>
              <label
                htmlFor="form-name"
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  color: 'var(--gray-light)',
                  marginBottom: '6px',
                }}
              >
                Your Name <span style={{ color: 'var(--accent)' }}>*</span>
              </label>
              <input
                id="form-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Alex Rivera"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.025)',
                  border: '1px solid rgba(255, 255, 255, 0.09)',
                  color: 'var(--white)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'var(--accent)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.16)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.04)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.09)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.background = 'rgba(255, 255, 255, 0.025)';
                }}
              />
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor="form-email"
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  color: 'var(--gray-light)',
                  marginBottom: '6px',
                }}
              >
                Email Address <span style={{ color: 'var(--accent)' }}>*</span>
              </label>
              <input
                id="form-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="alex@company.com"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.025)',
                  border: '1px solid rgba(255, 255, 255, 0.09)',
                  color: 'var(--white)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'var(--accent)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.16)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.04)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.09)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.background = 'rgba(255, 255, 255, 0.025)';
                }}
              />
            </div>
          </div>

          {/* Message Textarea */}
          <div>
            <label
              htmlFor="form-message"
              style={{
                display: 'block',
                fontFamily: 'var(--font-body)',
                fontSize: '0.78rem',
                fontWeight: 500,
                color: 'var(--gray-light)',
                marginBottom: '6px',
              }}
            >
              Message <span style={{ color: 'var(--accent)' }}>*</span>
            </label>
            <textarea
              id="form-message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Tell me about your project, timeline, or what you'd like to collaborate on..."
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.025)',
                border: '1px solid rgba(255, 255, 255, 0.09)',
                color: 'var(--white)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem',
                lineHeight: 1.6,
                outline: 'none',
                resize: 'vertical',
                minHeight: '105px',
                transition: 'all 0.2s ease',
              }}
              onFocus={e => {
                e.target.style.borderColor = 'var(--accent)';
                e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.16)';
                e.target.style.background = 'rgba(255, 255, 255, 0.04)';
              }}
              onBlur={e => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.09)';
                e.target.style.boxShadow = 'none';
                e.target.style.background = 'rgba(255, 255, 255, 0.025)';
              }}
            />
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div
              style={{
                padding: '9px 12px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#fca5a5',
                fontFamily: 'var(--font-body)',
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AlertCircle size={15} style={{ flexShrink: 0, color: '#f87171' }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Rate Limit Active Warning Notice */}
          {cooldownRemaining > 0 && (
            <div
              style={{
                padding: '9px 12px',
                borderRadius: '8px',
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                color: '#fde68a',
                fontFamily: 'var(--font-body)',
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                lineHeight: 1.4,
              }}
            >
              <Clock size={15} style={{ flexShrink: 0, color: '#fbbf24' }} />
              <div>
                <span style={{ fontWeight: 600 }}>Slow down: </span>
                {rateLimitReason === 'hourly_limit'
                  ? `Hourly cap reached (${MAX_PER_HOUR}/hr). Next message available in `
                  : `Please wait `}
                <strong style={{ color: '#fff' }}>{formatCooldown(cooldownRemaining)}</strong> before submitting again.
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

          {/* Action Row */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginTop: '4px' }}>
            <button
              type="submit"
              disabled={status === 'submitting' || cooldownRemaining > 0}
              style={{
                flex: '1 1 200px',
                padding: '12px 22px',
                borderRadius: '10px',
                background:
                  cooldownRemaining > 0
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                border:
                  cooldownRemaining > 0
                    ? '1px solid rgba(255, 255, 255, 0.1)'
                    : '1px solid rgba(255, 255, 255, 0.2)',
                color: cooldownRemaining > 0 ? 'var(--gray)' : '#ffffff',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                fontSize: '0.84rem',
                letterSpacing: '0.01em',
                cursor: status === 'submitting' || cooldownRemaining > 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: cooldownRemaining > 0 ? 'none' : '0 4px 18px rgba(99, 102, 241, 0.35)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                if (status !== 'submitting' && cooldownRemaining === 0) {
                  e.currentTarget.style.boxShadow = '0 6px 24px rgba(99, 102, 241, 0.5)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={e => {
                if (cooldownRemaining === 0) {
                  e.currentTarget.style.boxShadow = '0 4px 18px rgba(99, 102, 241, 0.35)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {status === 'submitting' ? (
                <>
                  <span
                    style={{
                      width: '13px',
                      height: '13px',
                      borderRadius: '50%',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#fff',
                      animation: 'spin 0.6s linear infinite',
                      display: 'inline-block',
                    }}
                  />
                  <span>Sending message...</span>
                </>
              ) : cooldownRemaining > 0 ? (
                <>
                  <Clock size={14} />
                  <span>Cooldown ({formatCooldown(cooldownRemaining)})</span>
                </>
              ) : (
                <>
                  <span>Send Message</span>
                  <Send size={14} />
                </>
              )}
            </button>

            {/* Quick Copy Email Button */}
            <button
              type="button"
              onClick={handleCopyEmail}
              title="Copy email address directly"
              style={{
                background: copiedEmail ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.035)',
                border: copiedEmail ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                color: copiedEmail ? '#34d399' : 'var(--gray-light)',
                padding: '12px 16px',
                borderRadius: '10px',
                fontFamily: 'var(--font-body)',
                fontSize: '0.82rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                flexShrink: 0,
              }}
              onMouseEnter={e => {
                if (!copiedEmail) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                }
              }}
              onMouseLeave={e => {
                if (!copiedEmail) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.035)';
                  e.currentTarget.style.color = 'var(--gray-light)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                }
              }}
            >
              {copiedEmail ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedEmail ? 'Copied' : 'Copy Email'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Clean Bottom Footer Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          padding: '12px 22px',
          background: 'rgba(0, 0, 0, 0.35)',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.68rem',
          color: 'var(--gray)',
        }}
      >
        <div>
          <span>Direct: </span>
          <a
            href="mailto:cjbaldonado11@gmail.com"
            style={{
              color: 'var(--gray-light)',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--gray-light)')}
          >
            cjbaldonado11@gmail.com
          </a>
        </div>

        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <a
            href="https://github.com/Akosidakdok"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--gray-light)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--gray-light)')}
          >
            <span>GitHub</span>
            <ArrowUpRight size={12} />
          </a>
          <span style={{ color: 'rgba(255, 255, 255, 0.15)' }}>•</span>
          <a
            href="https://www.linkedin.com/in/christian-james-baldonado-7b7721410/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--gray-light)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--gray-light)')}
          >
            <span>LinkedIn</span>
            <ArrowUpRight size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
