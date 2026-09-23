import React, { useState, useEffect } from 'react';
import sussyWaveWebp from '../assets/sussy_wave.webp';

const DEVELOPER_JSON_LINES = [
  '{',
  '  "developer": "Christian James Baldonado",',
  '  "callsign": "CJ",',
  '  "status": "AVAILABLE_FOR_CONTRACTS",',
  '  "roles": [',
  '    "Freelance Full-Stack Developer",',
  '    "Front-End Specialist",',
  '    "AI Systems Integrator"',
  '  ],',
  '  "location": {',
  '    "city": "Valenzuela City",',
  '    "country": "Philippines",',
  '    "timezone": "Asia/Manila (UTC+8)"',
  '  },',
  '  "coreStack": [',
  '    "React.js", "TypeScript", "Node.js",',
  '    "Supabase", "Gemini AI", "Tailwind CSS"',
  '  ],',
  '  "featuredBuilds": [',
  '    "FEASIFY (AI Feasibility System)",',
  '    "Camp-Navi (PNP Camp Crame GIS Navigation)",',
  '    "PNP-Assignment-Survey (HR Portal & Matrix)",',
  '    "P-IDTMS (PNP-ITMS Attendance & DTR)",',
  '    "PAIS 2.0 (Enterprise Personnel System)",',
  '    "Mang Delfin\'s Web Platform"',
  '  ],',
  '  "directSignal": "cjbaldonado11@gmail.com",',
  '  "turnaround": "< 24 hours"',
  '}'
];

export default function TelemetryConsole() {
  const [activeTab, setActiveTab] = useState<'telemetry' | 'json'>('telemetry');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [timeStr, setTimeStr] = useState('');

  // Live Philippine Clock (UTC+8)
  useEffect(() => {
    const updateTime = () => {
      try {
        const formatted = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Manila',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(new Date());
        setTimeStr(formatted);
      } catch {
        const d = new Date();
        setTimeStr(d.toTimeString().split(' ')[0]);
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText('cjbaldonado11@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2400);
  };

  const handleCopyJson = () => {
    const rawJson = DEVELOPER_JSON_LINES.join('\n');
    navigator.clipboard.writeText(rawJson);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2400);
  };

  // Syntax highlighting helper for JSON lines
  const renderJsonLine = (line: string) => {
    const keyMatch = line.match(/^(\s*)(".*?")(:)(.*)$/);
    if (keyMatch) {
      const [, indent, key, colon, rest] = keyMatch;
      const stringMatch = rest.match(/^(\s*)(".*?")([,\]}]*)$/);
      if (stringMatch) {
        const [, space, strVal, trailing] = stringMatch;
        return (
          <span>
            {indent}
            <span style={{ color: '#38bdf8' }}>{key}</span>
            <span style={{ color: '#94a3b8' }}>{colon}</span>
            {space}
            <span style={{ color: '#34d399' }}>{strVal}</span>
            <span style={{ color: '#94a3b8' }}>{trailing}</span>
          </span>
        );
      }
      return (
        <span>
          {indent}
          <span style={{ color: '#38bdf8' }}>{key}</span>
          <span style={{ color: '#94a3b8' }}>{colon}</span>
          <span style={{ color: '#a5b4fc' }}>{rest}</span>
        </span>
      );
    }
    const arrStrMatch = line.match(/^(\s*)(".*?")([,\]}]*)$/);
    if (arrStrMatch) {
      const [, indent, strVal, trailing] = arrStrMatch;
      return (
        <span>
          {indent}
          <span style={{ color: '#a5b4fc' }}>{strVal}</span>
          <span style={{ color: '#94a3b8' }}>{trailing}</span>
        </span>
      );
    }
    return <span style={{ color: '#94a3b8' }}>{line}</span>;
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
            sys-telemetry@baldonado:~
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

      {/* Tabs Header */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          background: 'rgba(0, 0, 0, 0.2)',
          padding: '0 8px',
        }}
      >
        <button
          onClick={() => setActiveTab('telemetry')}
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'telemetry' ? '2px solid #6366f1' : '2px solid transparent',
            color: activeTab === 'telemetry' ? 'var(--white)' : 'var(--gray)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            letterSpacing: '0.08em',
            padding: '10px 16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s',
          }}
        >
          <span>⚡</span> STATUS &amp; TELEMETRY
        </button>

        <button
          onClick={() => setActiveTab('json')}
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'json' ? '2px solid #6366f1' : '2px solid transparent',
            color: activeTab === 'json' ? 'var(--white)' : 'var(--gray)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            letterSpacing: '0.08em',
            padding: '10px 16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s',
          }}
        >
          <span>{'{ }'}</span> PROFILE.JSON
        </button>
      </div>

      {/* Tab 1: Telemetry & Status Hub */}
      {activeTab === 'telemetry' && (
        <div style={{ padding: '22px 20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Real-time Location & Clock Banner */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '12px',
              background: 'rgba(99, 102, 241, 0.04)',
              border: '1px solid rgba(99, 102, 241, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.58rem',
                  color: 'var(--gray)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '4px',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#38bdf8' }}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                LOCATION &amp; TIMEZONE
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--white)', fontWeight: 500 }}>
                Valenzuela City, Philippines
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--gray)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>
                LOCAL TIME (PHT • UTC+8)
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: '#38bdf8',
                  textShadow: '0 0 12px rgba(56, 189, 248, 0.3)',
                }}
              >
                {timeStr || '16:00:00'}
              </div>
            </div>
          </div>

          {/* 4 Telemetry Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <div
              style={{
                padding: '12px 14px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--gray)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
                RESPONSE TIME
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--white)', letterSpacing: '0.02em' }}>
                &lt; 24 Hours
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#10b981', marginTop: '2px' }}>
                ⚡ Fast turnaround
              </div>
            </div>

            <div
              style={{
                padding: '12px 14px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--gray)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
                WORK DOMAIN
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--white)', letterSpacing: '0.02em' }}>
                Full-Stack + AI
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#818cf8', marginTop: '2px' }}>
                Web apps &amp; systems
              </div>
            </div>

            <div
              style={{
                padding: '12px 14px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--gray)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
                WORK MODALITY
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--white)', letterSpacing: '0.02em' }}>
                Remote / Contract
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#38bdf8', marginTop: '2px' }}>
                Global collaboration
              </div>
            </div>

            <div
              style={{
                padding: '12px 14px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--gray)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
                SECURITY &amp; RBAC
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--white)', letterSpacing: '0.02em' }}>
                Enterprise Ready
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#34d399', marginTop: '2px' }}>
                Validated at PNP ITMS
              </div>
            </div>
          </div>

          {/* Quick Copy Email Hub */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--gray)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2px' }}>
                DIRECT TRANSMISSION LINE
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  color: 'var(--white)',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
              >
                cjbaldonado11@gmail.com
              </div>
            </div>

            <button
              onClick={handleCopyEmail}
              style={{
                background: copiedEmail ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.15)',
                border: copiedEmail ? '1px solid #10b981' : '1px solid rgba(99, 102, 241, 0.35)',
                color: copiedEmail ? '#34d399' : 'var(--white)',
                padding: '7px 14px',
                borderRadius: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                flexShrink: 0,
              }}
            >
              {copiedEmail ? (
                <>
                  <span>✓</span> Copied!
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copy Email
                </>
              )}
            </button>
          </div>

          {/* Sussy Astronaut Callout */}
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
              style={{ width: '36px', height: '36px', objectFit: 'contain', flexShrink: 0 }}
            />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--gray-light)', lineHeight: 1.4 }}>
              <span style={{ color: '#38bdf8', fontWeight: 600 }}>Sussy (System Pilot): </span>
              "Signal clear! Ready to collaborate on your next breakthrough project."
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Interactive Dev Console / JSON */}
      {activeTab === 'json' && (
        <div style={{ position: 'relative' }}>
          {/* Copy JSON Button */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '16px',
              zIndex: 10,
            }}
          >
            <button
              onClick={handleCopyJson}
              style={{
                background: copiedJson ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                border: copiedJson ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.12)',
                color: copiedJson ? '#34d399' : 'var(--gray-light)',
                padding: '5px 10px',
                borderRadius: '6px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              {copiedJson ? '✓ Copied' : '📋 Copy JSON'}
            </button>
          </div>

          {/* Code Window */}
          <div
            style={{
              padding: '18px 16px',
              maxHeight: '340px',
              overflowY: 'auto',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              lineHeight: 1.6,
              background: 'rgba(0, 0, 0, 0.35)',
            }}
          >
            {DEVELOPER_JSON_LINES.map((line, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '14px' }}>
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.2)',
                    userSelect: 'none',
                    width: '20px',
                    textAlign: 'right',
                    flexShrink: 0,
                  }}
                >
                  {idx + 1}
                </span>
                <span style={{ whiteSpace: 'pre', overflowX: 'auto' }}>
                  {renderJsonLine(line)}
                </span>
              </div>
            ))}
          </div>
        </div>
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
