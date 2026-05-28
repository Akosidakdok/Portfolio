import React from 'react';

// Film strip cell component
const FilmCell: React.FC<{ label: string }> = ({ label }) => (
  <div
    style={{
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '72px',
      height: '52px',
      borderLeft: '3px solid rgba(0,0,0,0.4)',
      borderRight: '3px solid rgba(0,0,0,0.4)',
      flexShrink: 0,
    }}
  >
    <span
      style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: '0.7rem',
        fontWeight: 500,
        color: 'rgba(255,255,255,0.85)',
        letterSpacing: '0.05em',
      }}
    >
      {label}
    </span>
  </div>
);

// Sprocket holes on top and bottom
const SprocketRow: React.FC<{ count?: number }> = ({ count = 30 }) => (
  <div style={{ display: 'flex', alignItems: 'center', height: '14px', gap: 0 }}>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        style={{
          width: '18px',
          height: '10px',
          borderRadius: '3px',
          background: 'rgba(0,0,0,0.55)',
          marginRight: '6px',
          flexShrink: 0,
        }}
      />
    ))}
  </div>
);

const CELLS = [
  '</>', 'CJ', '</>', 'CJ', '</>', 'CJ', '</>', 'CJ',
  '</>', 'CJ', '</>', 'CJ', '</>', 'CJ', '</>', 'CJ',
  '</>', 'CJ', '</>', 'CJ', '</>', 'CJ', '</>', 'CJ',
  '</>', 'CJ', '</>', 'CJ', '</>', 'CJ', '</>', 'CJ',
];

const FilmStrip: React.FC = () => {
  // Duplicate for seamless looping
  const doubled = [...CELLS, ...CELLS];

  return (
    <div
      style={{
        width: '100%',
        overflow: 'hidden',
        background: '#E31E24',
        position: 'relative',
        zIndex: 20,
        userSelect: 'none',
      }}
    >
      {/* Top sprocket row */}
      <div style={{ overflow: 'hidden', paddingLeft: '8px' }}>
        <SprocketRow count={60} />
      </div>

      {/* Cells — scrolling */}
      <div className="film-strip-inner">
        {doubled.map((label, i) => (
          <FilmCell key={i} label={label} />
        ))}
      </div>

      {/* Bottom sprocket row */}
      <div style={{ overflow: 'hidden', paddingLeft: '8px' }}>
        <SprocketRow count={60} />
      </div>
    </div>
  );
};

export default FilmStrip;
