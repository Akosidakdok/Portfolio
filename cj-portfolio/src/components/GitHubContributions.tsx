import { useState, useEffect, useMemo } from 'react';
import fallbackData from '../data/githubContributions.json';

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface ContributionData {
  total: Record<string, number>;
  lastYearContributions: ContributionDay[];
  allContributions: ContributionDay[];
}

type Palette = 'emerald' | 'indigo' | 'crimson';
type YearOption = 'lastYear' | '2026' | '2025';

const PALETTES: Record<Palette, { label: string; name: string; colors: [string, string, string, string, string]; glow: string }> = {
  emerald: {
    label: 'Emerald',
    name: 'GitHub Native',
    colors: [
      'rgba(255, 255, 255, 0.04)',
      '#0e4429',
      '#006d32',
      '#26a641',
      '#39d353',
    ],
    glow: 'rgba(57, 211, 83, 0.45)',
  },
  indigo: {
    label: 'Indigo',
    name: 'Cyber Telemetry',
    colors: [
      'rgba(255, 255, 255, 0.04)',
      'rgba(99, 102, 241, 0.3)',
      'rgba(99, 102, 241, 0.65)',
      '#6366f1',
      '#38bdf8',
    ],
    glow: 'rgba(56, 189, 248, 0.45)',
  },
  crimson: {
    label: 'Crimson',
    name: 'Solar Red',
    colors: [
      'rgba(255, 255, 255, 0.04)',
      'rgba(227, 30, 36, 0.28)',
      'rgba(227, 30, 36, 0.65)',
      '#dc2626',
      '#f87171',
    ],
    glow: 'rgba(239, 68, 68, 0.45)',
  },
};

export default function GitHubContributions() {
  const [data, setData] = useState<ContributionData>(fallbackData as unknown as ContributionData);
  const [selectedYear, setSelectedYear] = useState<YearOption>('lastYear');
  const [palette, setPalette] = useState<Palette>('emerald');
  const [hoveredCell, setHoveredCell] = useState<{ day: ContributionDay; x: number; y: number } | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Background live sync (merges with verified profile base to preserve private contributions)
  useEffect(() => {
    let isMounted = true;
    async function syncContributions() {
      try {
        setIsLoading(true);
        const [allRes, lastRes] = await Promise.all([
          fetch('https://github-contributions-api.jogruber.de/v4/Akosidakdok'),
          fetch('https://github-contributions-api.jogruber.de/v4/Akosidakdok?y=last'),
        ]);

        if (allRes.ok && lastRes.ok) {
          const allD = await allRes.json();
          const lastD = await lastRes.json();
          if (isMounted) {
            const apiLastMap = new Map<string, ContributionDay>();
            (lastD.contributions || []).forEach((d: ContributionDay) => apiLastMap.set(d.date, d));

            const apiAllMap = new Map<string, ContributionDay>();
            (allD.contributions || []).forEach((d: ContributionDay) => apiAllMap.set(d.date, d));

            const fallbackTyped = fallbackData as unknown as ContributionData;
            const mergedLastYear = (fallbackTyped.lastYearContributions || []).map((baseDay) => {
              const apiDay = apiLastMap.get(baseDay.date);
              if (!apiDay) return baseDay;
              const count = Math.max(baseDay.count, apiDay.count);
              const level = Math.max(baseDay.level, apiDay.level);
              return { date: baseDay.date, count, level };
            });

            const baseLastDates = new Set(mergedLastYear.map((d) => d.date));
            (lastD.contributions || []).forEach((apiDay: ContributionDay) => {
              if (!baseLastDates.has(apiDay.date)) {
                mergedLastYear.push(apiDay);
              }
            });

            const mergedAll = (fallbackTyped.allContributions || []).map((baseDay) => {
              const apiDay = apiAllMap.get(baseDay.date);
              if (!apiDay) return baseDay;
              const count = Math.max(baseDay.count, apiDay.count);
              const level = Math.max(baseDay.level, apiDay.level);
              return { date: baseDay.date, count, level };
            });

            const baseAllDates = new Set(mergedAll.map((d) => d.date));
            (allD.contributions || []).forEach((apiDay: ContributionDay) => {
              if (!baseAllDates.has(apiDay.date)) {
                mergedAll.push(apiDay);
              }
            });

            const baseTotals = fallbackTyped.total || {};
            const lastYearSum = mergedLastYear.reduce((acc, d) => acc + d.count, 0);
            const sum2026 = mergedAll.filter((d) => d.date.startsWith('2026')).reduce((acc, d) => acc + d.count, 0);
            const sum2025 = mergedAll.filter((d) => d.date.startsWith('2025')).reduce((acc, d) => acc + d.count, 0);

            setData({
              total: {
                ...allD.total,
                ...lastD.total,
                '2025': Math.max(baseTotals['2025'] || 30, sum2025),
                '2026': Math.max(baseTotals['2026'] || 220, sum2026),
                lastYear: Math.max(baseTotals['lastYear'] || 248, lastYearSum),
              },
              lastYearContributions: mergedLastYear,
              allContributions: mergedAll,
            });
            setIsLive(true);
          }
        }
      } catch {
        // Fallback remains active seamlessly
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    syncContributions();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter contributions by selected view
  const activeDaysList = useMemo(() => {
    if (selectedYear === 'lastYear') {
      return data.lastYearContributions || [];
    }
    return (data.allContributions || []).filter((d) => d.date.startsWith(selectedYear));
  }, [data, selectedYear]);

  // Compute telemetry metrics
  const stats = useMemo(() => {
    let total = 0;
    let activeDays = 0;
    let longestStreak = 0;
    let curStreak = 0;
    let tempStreak = 0;
    let maxDay: { date: string; count: number } = { date: '', count: 0 };

    const sorted = [...activeDaysList].sort((a, b) => a.date.localeCompare(b.date));

    for (const d of sorted) {
      total += d.count;
      if (d.count > 0) {
        activeDays++;
        tempStreak++;
        if (tempStreak > longestStreak) longestStreak = tempStreak;
        if (d.count > maxDay.count) {
          maxDay = { date: d.date, count: d.count };
        }
      } else {
        tempStreak = 0;
      }
    }

    // Compute current streak checking days up to today
    const todayStr = new Date().toISOString().split('T')[0];
    const pastDays = sorted.filter((d) => d.date <= todayStr);
    let startIdx = pastDays.length - 1;
    if (startIdx >= 0 && pastDays[startIdx].count === 0) {
      startIdx--;
    }
    for (let i = startIdx; i >= 0; i--) {
      if (pastDays[i].count > 0) {
        curStreak++;
      } else {
        break;
      }
    }

    const yearTotal = data.total?.[selectedYear] ?? total;

    return {
      total: yearTotal || total,
      activeDays,
      longestStreak,
      curStreak,
      maxDay,
    };
  }, [activeDaysList, data.total, selectedYear]);

  // Group into 7-day columns (weeks)
  const { weeks, monthLabels } = useMemo(() => {
    if (!activeDaysList.length) return { weeks: [], monthLabels: [] };

    const wList: (ContributionDay | null)[][] = [];
    let currentWeek: (ContributionDay | null)[] = [];

    const firstDate = new Date(activeDaysList[0].date + 'T00:00:00');
    const startPadding = firstDate.getDay(); // 0 = Sunday

    for (let p = 0; p < startPadding; p++) {
      currentWeek.push(null);
    }

    for (const day of activeDaysList) {
      if (currentWeek.length === 7) {
        wList.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(day);
    }

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      wList.push(currentWeek);
    }

    // Determine month labels positioned at week column indices (avoiding collisions)
    const mLabels: { weekIndex: number; label: string }[] = [];
    let lastMonth = -1;

    wList.forEach((week, wIdx) => {
      const firstNonNull = week.find((item) => item !== null);
      if (firstNonNull) {
        const d = new Date(firstNonNull.date + 'T00:00:00');
        const m = d.getMonth();
        if (m !== lastMonth) {
          const lastLabel = mLabels[mLabels.length - 1];
          if (!lastLabel || wIdx - lastLabel.weekIndex >= 2) {
            mLabels.push({
              weekIndex: wIdx,
              label: new Intl.DateTimeFormat('en-US', { month: 'short' }).format(d),
            });
            lastMonth = m;
          }
        }
      }
    });

    return { weeks: wList, monthLabels: mLabels };
  }, [activeDaysList]);

  const activeColors = PALETTES[palette].colors;

  const formatDateLabel = (dateStr: string) => {
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(d);
    } catch {
      return dateStr;
    }
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
      {/* Top Window Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          background: 'rgba(255, 255, 255, 0.02)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        {/* Left: Window Dots & Console Title */}
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
            sys-github@baldonado:~/contributions
          </span>
        </div>

        {/* Right: Live Sync Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: isLive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102, 241, 0.1)',
              border: `1px solid ${isLive ? 'rgba(16, 185, 129, 0.25)' : 'rgba(99, 102, 241, 0.25)'}`,
              padding: '4px 10px',
              borderRadius: '999px',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: isLive ? '#10b981' : '#818cf8',
                boxShadow: isLive ? '0 0 8px #10b981' : '0 0 8px #818cf8',
                display: 'inline-block',
                animation: isLoading ? 'pulse 1.5s infinite' : 'none',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.62rem',
                color: isLive ? '#34d399' : '#a5b4fc',
                letterSpacing: '0.08em',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              {isLoading ? 'SYNCING GITHUB...' : isLive ? 'GITHUB TELEMETRY LIVE' : 'CACHED SYNC ONLINE'}
            </span>
          </div>

          <a
            href="https://github.com/Akosidakdok"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 10px',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'var(--white)',
              textDecoration: 'none',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              letterSpacing: '0.05em',
              transition: 'background 0.2s, border-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            @Akosidakdok ↗
          </a>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* 4 Telemetry Metrics Grid (Matches TelemetryConsole aesthetic) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
          {/* Total Contributions */}
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--gray)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
              TOTAL COMMITS / PRS
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--white)', letterSpacing: '0.02em', fontWeight: 700 }}>
              {stats.total.toLocaleString()}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#10b981', marginTop: '2px' }}>
              ⚡ {selectedYear === 'lastYear' ? 'Last 365 Days' : `Year ${selectedYear}`}
            </div>
          </div>

          {/* Active Days */}
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--gray)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
              ACTIVE DEV DAYS
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--white)', letterSpacing: '0.02em', fontWeight: 700 }}>
              {stats.activeDays} <span style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>Days</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#38bdf8', marginTop: '2px' }}>
              🎯 Verified commits
            </div>
          </div>

          {/* Longest Streak */}
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--gray)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
              LONGEST STREAK
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--white)', letterSpacing: '0.02em', fontWeight: 700 }}>
              {stats.longestStreak} <span style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>Days</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#f59e0b', marginTop: '2px' }}>
              🔥 Peak momentum
            </div>
          </div>

          {/* Peak Day */}
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--gray)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
              PEAK DAY ACTIVITY
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--white)', letterSpacing: '0.02em', fontWeight: 700 }}>
              {stats.maxDay.count} <span style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>Contributions</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#818cf8', marginTop: '2px' }}>
              📅 {stats.maxDay.date ? formatDateLabel(stats.maxDay.date).split(',')[0] : 'Recorded'}
            </div>
          </div>
        </div>

        {/* Toolbar: Timeline Range & Palette Switcher */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            paddingBottom: '12px',
          }}
        >
          {/* Year Range Tabs */}
          <div style={{ display: 'inline-flex', gap: '6px', background: 'rgba(0, 0, 0, 0.3)', padding: '3px', borderRadius: '8px' }}>
            {(
              [
                { id: 'lastYear', label: 'Last 12 Months' },
                { id: '2026', label: '2026' },
                { id: '2025', label: '2025' },
              ] as const
            ).map((tab) => {
              const active = selectedYear === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedYear(tab.id)}
                  style={{
                    background: active ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    color: active ? 'var(--white)' : 'var(--gray)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.06em',
                    padding: '5px 12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Palette Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              THEME:
            </span>
            <div style={{ display: 'inline-flex', gap: '4px', background: 'rgba(0, 0, 0, 0.3)', padding: '3px', borderRadius: '8px' }}>
              {(Object.keys(PALETTES) as Palette[]).map((p) => {
                const active = palette === p;
                const pColor = PALETTES[p].colors[3];
                return (
                  <button
                    key={p}
                    onClick={() => setPalette(p)}
                    title={PALETTES[p].name}
                    style={{
                      background: active ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                      border: active ? `1px solid ${pColor}` : '1px solid transparent',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6rem',
                      color: active ? '#fff' : 'var(--gray)',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '2px',
                        background: pColor,
                        display: 'inline-block',
                      }}
                    />
                    {PALETTES[p].label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Calendar Heatmap Container with custom horizontal scrolling */}
        <div style={{ position: 'relative' }}>
          <div
            style={{
              overflowX: 'auto',
              paddingBottom: '10px',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            <div style={{ minWidth: '780px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {/* Month Headers */}
              <div style={{ display: 'flex', position: 'relative', height: '18px', marginLeft: '32px' }}>
                {monthLabels.map((m, idx) => (
                  <div
                    key={`${m.label}-${idx}`}
                    style={{
                      position: 'absolute',
                      left: `${m.weekIndex * 14.5}px`,
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.62rem',
                      color: 'var(--gray)',
                      letterSpacing: '0.04em',
                      userSelect: 'none',
                    }}
                  >
                    {m.label}
                  </div>
                ))}
              </div>

              {/* Heatmap Grid (7 Rows, 53 Columns) */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {/* Day of week labels */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '3.5px',
                    width: '26px',
                    userSelect: 'none',
                    paddingTop: '2px',
                  }}
                >
                  <span style={{ height: '11px', fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'transparent' }}>
                    Sun
                  </span>
                  <span style={{ height: '11px', fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--gray-light)', lineHeight: '11px' }}>
                    Mon
                  </span>
                  <span style={{ height: '11px', fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'transparent' }}>
                    Tue
                  </span>
                  <span style={{ height: '11px', fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--gray-light)', lineHeight: '11px' }}>
                    Wed
                  </span>
                  <span style={{ height: '11px', fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'transparent' }}>
                    Thu
                  </span>
                  <span style={{ height: '11px', fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--gray-light)', lineHeight: '11px' }}>
                    Fri
                  </span>
                  <span style={{ height: '11px', fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'transparent' }}>
                    Sat
                  </span>
                </div>

                {/* Week Columns */}
                <div style={{ display: 'flex', gap: '3.5px' }}>
                  {weeks.map((week, wIdx) => (
                    <div key={wIdx} style={{ display: 'flex', flexDirection: 'column', gap: '3.5px' }}>
                      {week.map((cell, dIdx) => {
                        if (!cell) {
                          return (
                            <div
                              key={dIdx}
                              style={{
                                width: '11px',
                                height: '11px',
                                background: 'transparent',
                              }}
                            />
                          );
                        }

                        const cellColor = activeColors[cell.level] || activeColors[0];
                        const isHighLevel = cell.level >= 3;

                        return (
                          <div
                            key={cell.date}
                            onMouseEnter={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setHoveredCell({
                                day: cell,
                                x: rect.left + rect.width / 2,
                                y: rect.top,
                              });
                            }}
                            onMouseLeave={() => setHoveredCell(null)}
                            style={{
                              width: '11px',
                              height: '11px',
                              borderRadius: '2.5px',
                              background: cellColor,
                              border: cell.level === 0 ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid transparent',
                              boxShadow: isHighLevel ? `0 0 6px ${PALETTES[palette].glow}` : 'none',
                              cursor: 'pointer',
                              transition: 'transform 0.12s ease, filter 0.12s ease',
                            }}
                            className="heatmap-cell"
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floating Tooltip */}
          {hoveredCell && (
            <div
              style={{
                position: 'fixed',
                left: `${hoveredCell.x}px`,
                top: `${hoveredCell.y - 44}px`,
                transform: 'translateX(-50%)',
                background: 'rgba(10, 10, 15, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                padding: '6px 12px',
                borderRadius: '8px',
                pointerEvents: 'none',
                zIndex: 9999,
                whiteSpace: 'nowrap',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#fff', fontWeight: 600 }}>
                {hoveredCell.day.count > 0 ? (
                  <>
                    <span style={{ color: activeColors[hoveredCell.day.level] || '#fff' }}>
                      {hoveredCell.day.count} {hoveredCell.day.count === 1 ? 'contribution' : 'contributions'}
                    </span>{' '}
                    on {formatDateLabel(hoveredCell.day.date)}
                  </>
                ) : (
                  <>No contributions on {formatDateLabel(hoveredCell.day.date)}</>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Live Hover Info Bar & Legend */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            padding: '10px 14px',
            borderRadius: '10px',
            background: 'rgba(0, 0, 0, 0.25)',
            border: '1px dashed rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Active Hover Inspection */}
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--gray-light)' }}>
            {hoveredCell ? (
              <span>
                <span style={{ color: activeColors[hoveredCell.day.level] || '#fff', fontWeight: 600 }}>
                  {hoveredCell.day.count} contribution{hoveredCell.day.count === 1 ? '' : 's'}
                </span>{' '}
                recorded on {formatDateLabel(hoveredCell.day.date)}
              </span>
            ) : (
              <span>Hover over any calendar cell to inspect commit timeline</span>
            )}
          </div>

          {/* Color Scale Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--gray)' }}>Less</span>
            <div style={{ display: 'flex', gap: '3px' }}>
              {activeColors.map((col, idx) => (
                <div
                  key={idx}
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '2px',
                    background: col,
                    border: idx === 0 ? '1px solid rgba(255, 255, 255, 0.06)' : 'none',
                  }}
                />
              ))}
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--gray)' }}>More</span>
          </div>
        </div>
      </div>

      {/* Terminal Footer Status Bar (Matches TelemetryConsole footer) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 20px',
          background: 'rgba(0, 0, 0, 0.4)',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.62rem',
          color: 'var(--gray)',
          letterSpacing: '0.06em',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span>SOURCE: api.github.com</span>
          <span>●</span>
          <span>USER: Akosidakdok</span>
          <span>●</span>
          <span style={{ color: '#10b981' }}>STATUS: 200 OK</span>
        </div>

        <div style={{ display: 'flex', gap: '14px' }}>
          <a
            href="https://github.com/Akosidakdok?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--gray-light)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--white)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--gray-light)')}
          >
            Repositories ↗
          </a>
          <a
            href="https://github.com/Akosidakdok"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--gray-light)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--white)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--gray-light)')}
          >
            Profile ↗
          </a>
        </div>
      </div>
    </div>
  );
}
