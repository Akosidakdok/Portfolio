import React from 'react';
import {
  Code2,
  Cpu,
  Globe,
  Database,
  Sparkles,
  ShieldCheck,
  Flame,
  Layers,
  Zap,
  GitBranch,
  MapPin,
  Activity,
  Award,
  CheckCircle2,
  Server,
  Boxes,
  Radio,
} from 'lucide-react';

export interface TechTickerProps {
  variant?: 'tech' | 'philosophy';
  direction?: 'left' | 'right';
  speed?: number; // duration in seconds
  className?: string;
}

interface TickerItem {
  id: string;
  type: 'tech' | 'telemetry' | 'status' | 'highlight';
  label: string;
  badge?: string;
  icon?: React.ReactNode;
  accentColor?: string;
}

const TECH_ITEMS: TickerItem[] = [
  {
    id: 'status-live',
    type: 'status',
    label: 'AVAILABLE FOR HIRE 2026',
    accentColor: '#10B981',
  },
  {
    id: 'react',
    type: 'tech',
    label: 'React 19',
    badge: 'FRONTEND',
    icon: <Code2 className="w-3.5 h-3.5 text-[#61DAFB]" />,
    accentColor: '#61DAFB',
  },
  {
    id: 'ts',
    type: 'tech',
    label: 'TypeScript',
    badge: 'LANG',
    icon: <Code2 className="w-3.5 h-3.5 text-[#3178C6]" />,
    accentColor: '#3178C6',
  },
  {
    id: 'py',
    type: 'tech',
    label: 'Python',
    badge: 'LANG',
    icon: <Cpu className="w-3.5 h-3.5 text-[#3776AB]" />,
    accentColor: '#3776AB',
  },
  {
    id: 'telemetry-sys',
    type: 'telemetry',
    label: 'SYS: OPERATIONAL',
    icon: <Activity className="w-3.5 h-3.5 text-[#10B981]" />,
    accentColor: '#10B981',
  },
  {
    id: 'node',
    type: 'tech',
    label: 'Node.js',
    badge: 'RUNTIME',
    icon: <Server className="w-3.5 h-3.5 text-[#68A063]" />,
    accentColor: '#68A063',
  },
  {
    id: 'supabase',
    type: 'tech',
    label: 'Supabase',
    badge: 'BAAS / DB',
    icon: <Zap className="w-3.5 h-3.5 text-[#3ECF8E]" />,
    accentColor: '#3ECF8E',
  },
  {
    id: 'firebase',
    type: 'tech',
    label: 'Firebase',
    badge: 'CLOUD',
    icon: <Flame className="w-3.5 h-3.5 text-[#FFA611]" />,
    accentColor: '#FFA611',
  },
  {
    id: 'gemini',
    type: 'tech',
    label: 'Google Gemini AI',
    badge: 'GEN AI',
    icon: <Sparkles className="w-3.5 h-3.5 text-[#9B72CF]" />,
    accentColor: '#9B72CF',
  },
  {
    id: 'telemetry-fcc',
    type: 'telemetry',
    label: '600+ HRS FCC CERTIFIED',
    icon: <Award className="w-3.5 h-3.5 text-[#F59E0B]" />,
    accentColor: '#F59E0B',
  },
  {
    id: 'express',
    type: 'tech',
    label: 'Express.js',
    badge: 'BACKEND',
    icon: <Server className="w-3.5 h-3.5 text-neutral-300" />,
    accentColor: '#ffffff',
  },
  {
    id: 'leaflet',
    type: 'tech',
    label: 'Leaflet GIS',
    badge: 'MAPPING',
    icon: <MapPin className="w-3.5 h-3.5 text-[#48BB78]" />,
    accentColor: '#48BB78',
  },
  {
    id: 'postgres',
    type: 'tech',
    label: 'PostgreSQL',
    badge: 'SQL DB',
    icon: <Database className="w-3.5 h-3.5 text-[#336791]" />,
    accentColor: '#336791',
  },
  {
    id: 'tailwind',
    type: 'tech',
    label: 'Tailwind CSS',
    badge: 'STYLING',
    icon: <Layers className="w-3.5 h-3.5 text-[#38BDF8]" />,
    accentColor: '#38BDF8',
  },
  {
    id: 'telemetry-loc',
    type: 'telemetry',
    label: 'MANILA, PH (UTC+8)',
    icon: <Globe className="w-3.5 h-3.5 text-neutral-400" />,
    accentColor: '#ffffff',
  },
  {
    id: 'git',
    type: 'tech',
    label: 'Git & GitHub',
    badge: 'VCS',
    icon: <GitBranch className="w-3.5 h-3.5 text-[#F05032]" />,
    accentColor: '#F05032',
  },
  {
    id: 'telemetry-lat',
    type: 'telemetry',
    label: 'LATENCY: < 12MS',
    icon: <Radio className="w-3.5 h-3.5 text-[#6366f1]" />,
    accentColor: '#6366f1',
  },
];

const PHILOSOPHY_ITEMS: TickerItem[] = [
  {
    id: 'phil-alerto',
    type: 'highlight',
    label: 'REAL-TIME GIS & DISASTER RESPONSE',
    badge: 'ALERTOPH',
    icon: <MapPin className="w-3.5 h-3.5 text-[#38bdf8]" />,
    accentColor: '#38bdf8',
  },
  {
    id: 'phil-pnp',
    type: 'highlight',
    label: 'SECURE GOV DIGITAL ARCHIVES',
    badge: 'P-IDTMS',
    icon: <ShieldCheck className="w-3.5 h-3.5 text-[#3B82F6]" />,
    accentColor: '#3B82F6',
  },
  {
    id: 'phil-pais',
    type: 'highlight',
    label: 'AUTOMATED AGRICULTURAL AI',
    badge: 'PAIS 2.0',
    icon: <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />,
    accentColor: '#10B981',
  },
  {
    id: 'phil-fcc',
    type: 'highlight',
    label: '600+ HRS CERTIFIED DEVELOPER',
    badge: 'FREECODECAMP',
    icon: <Award className="w-3.5 h-3.5 text-[#F59E0B]" />,
    accentColor: '#F59E0B',
  },
  {
    id: 'phil-arch',
    type: 'highlight',
    label: 'MODERN FULL-STACK ARCHITECTURE',
    badge: 'SCALABLE',
    icon: <Layers className="w-3.5 h-3.5 text-[#00BCEB]" />,
    accentColor: '#00BCEB',
  },
  {
    id: 'phil-cloud',
    type: 'highlight',
    label: 'SCALABLE CLOUD ARCHITECTURES',
    badge: 'SUPABASE & FIREBASE',
    icon: <Database className="w-3.5 h-3.5 text-[#3ECF8E]" />,
    accentColor: '#3ECF8E',
  },
  {
    id: 'phil-ui',
    type: 'highlight',
    label: 'HIGH-PERFORMANCE REACT & TS',
    badge: 'FRONTEND',
    icon: <Boxes className="w-3.5 h-3.5 text-[#6366f1]" />,
    accentColor: '#6366f1',
  },
  {
    id: 'phil-uptime',
    type: 'highlight',
    label: 'ZERO-DOWNTIME MENTALITY',
    badge: 'UPTIME 99.9%',
    icon: <Activity className="w-3.5 h-3.5 text-[#10B981]" />,
    accentColor: '#10B981',
  },
  {
    id: 'phil-perf',
    type: 'highlight',
    label: 'FAST LOAD & RESPONSIVE UI',
    badge: 'OPTIMIZED',
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#3B82F6]" />,
    accentColor: '#3B82F6',
  },
];

export const TechTicker: React.FC<TechTickerProps> = ({
  variant = 'tech',
  direction,
  speed = 34,
  className = '',
}) => {
  const items = variant === 'philosophy' ? PHILOSOPHY_ITEMS : TECH_ITEMS;
  // Duplicate array for seamless infinite looping
  const doubled = [...items, ...items];

  // Default direction: tech scrolls left, philosophy scrolls right
  const scrollDirection = direction || (variant === 'philosophy' ? 'right' : 'left');
  const animationClass = scrollDirection === 'right' ? 'ticker-track-right' : 'ticker-track-left';

  return (
    <div
      className={`ticker-container relative w-full overflow-hidden select-none z-20 ${className}`}
      style={{
        background: 'linear-gradient(180deg, #09090b 0%, #030304 100%)',
        borderTop: '1px solid rgba(255, 255, 255, 0.07)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
        padding: '10px 0',
      }}
    >
      {/* Subtle ambient indigo background glow in the center */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(99, 102, 241, 0.15), transparent 75%)',
        }}
      />

      {/* Edge gradient masks to smoothly fade items in and out */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
        }}
      >
        <div
          className={animationClass}
          style={{
            animationDuration: `${speed}s`,
            gap: '12px',
            paddingLeft: '12px',
          }}
        >
          {doubled.map((item, idx) => {
            if (item.type === 'status') {
              return (
                <div
                  key={`${item.id}-${idx}`}
                  className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-semibold tracking-wider shrink-0 transition-all duration-300 hover:border-emerald-400 hover:bg-emerald-900/40"
                  style={{ textShadow: '0 0 12px rgba(16, 185, 129, 0.4)' }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>{item.label}</span>
                </div>
              );
            }

            if (item.type === 'telemetry') {
              return (
                <div
                  key={`${item.id}-${idx}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/[0.02] border border-white/10 text-neutral-300 font-mono text-xs tracking-wider shrink-0 transition-all duration-300 hover:border-indigo-500/50 hover:text-white hover:bg-indigo-950/20"
                >
                  {item.icon}
                  <span className="text-[11px] font-medium">{item.label}</span>
                </div>
              );
            }

            if (item.type === 'highlight') {
              return (
                <div
                  key={`${item.id}-${idx}`}
                  className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-neutral-900/80 border border-neutral-800 text-neutral-200 font-mono text-xs tracking-wide shrink-0 transition-all duration-300 hover:border-indigo-500 hover:bg-indigo-950/30 hover:text-white"
                >
                  {item.icon}
                  <span className="font-semibold text-xs text-white">{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                      {item.badge}
                    </span>
                  )}
                </div>
              );
            }

            // Standard Tech Pill
            return (
              <div
                key={`${item.id}-${idx}`}
                className="ticker-badge inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-950/60 border border-neutral-800 text-neutral-200 font-mono text-xs tracking-wide shrink-0 transition-all duration-300 hover:border-indigo-500/80 hover:bg-indigo-950/20 hover:text-white"
              >
                {item.icon}
                <span className="font-medium text-xs text-neutral-200">{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono tracking-wider bg-white/5 text-neutral-400 border border-white/10">
                    {item.badge}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Default export for drop-in replacement of <FilmStrip /> in App.tsx
export default TechTicker;
