import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { RefreshCw, ArrowUpRight } from 'lucide-react';
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

const STORAGE_KEY = 'cj_github_contributions_cache_v5';

// Canonical GitHub green scale
const GITHUB_COLORS: [string, string, string, string, string] = [
  'rgba(255, 255, 255, 0.035)',
  '#0e4429',
  '#006d32',
  '#26a641',
  '#39d353',
];

export default function GitHubContributions() {
  // Initialize from cache or fallback data
  const [data, setData] = useState<ContributionData>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.data) {
          return parsed.data;
        }
      }
    } catch (err) {
      console.debug('Error reading cache:', err);
    }
    return fallbackData as unknown as ContributionData;
  });

  const [selectedYear, setSelectedYear] = useState<string>('lastYear');
  const [hoveredCell, setHoveredCell] = useState<{ day: ContributionDay; x: number; y: number } | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const lastSyncTimeRef = useRef<number>(0);

  // Dynamic available years from dataset
  const availableYears = useMemo(() => {
    const years = Object.keys(data.total || {})
      .filter((k) => k !== 'lastYear' && /^\d{4}$/.test(k))
      .sort((a, b) => b.localeCompare(a));
    return ['lastYear', ...years];
  }, [data.total]);

  // Live Sync: merges live GitHub feed on top of verified baseline
  const syncContributions = useCallback(async (isManual = false) => {
    try {
      setIsSyncing(true);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      let liveDays: ContributionDay[] = [];
      let liveTotals: Record<string, number> = {};

      try {
        // Primary: jogruber API
        const [allRes, lastRes] = await Promise.all([
          fetch('https://github-contributions-api.jogruber.de/v4/Akosidakdok', {
            cache: 'no-cache',
            signal: controller.signal,
          }),
          fetch('https://github-contributions-api.jogruber.de/v4/Akosidakdok?y=last', {
            cache: 'no-cache',
            signal: controller.signal,
          }),
        ]);

        if (allRes.ok && lastRes.ok) {
          const allD = await allRes.json();
          const lastD = await lastRes.json();
          liveDays = lastD.contributions || [];
          liveTotals = { ...allD.total, ...lastD.total };
        }
      } catch {
        // Fallback: vercel API
        try {
          const backupRes = await fetch('https://github-contributions.vercel.app/api/v1/Akosidakdok', {
            cache: 'no-cache',
            signal: controller.signal,
          });
          if (backupRes.ok) {
            const backupD = await backupRes.json();
            const rawList: { date: string; count: number }[] = backupD.contributions || [];
            liveDays = rawList.map((d) => ({
              date: d.date,
              count: d.count,
              level: d.count === 0 ? 0 : d.count <= 3 ? 1 : d.count <= 6 ? 2 : d.count <= 12 ? 3 : 4,
            }));
            if (Array.isArray(backupD.years)) {
              backupD.years.forEach((y: { year: string; total: number }) => {
                liveTotals[y.year] = y.total;
              });
            }
          }
        } catch (backupErr) {
          console.debug('Secondary contributions API error:', backupErr);
        }
      } finally {
        clearTimeout(timeoutId);
      }

      if (liveDays.length > 0) {
        const liveMap = new Map<string, ContributionDay>();
        liveDays.forEach((d) => liveMap.set(d.date, d));

        const baseTyped = fallbackData as unknown as ContributionData;

        // 1. Merge rolling last-year contributions
        const mergedLastYear: ContributionDay[] = (baseTyped.lastYearContributions || []).map((baseDay) => {
          const liveDay = liveMap.get(baseDay.date);
          if (!liveDay) return baseDay;
          const count = Math.max(baseDay.count, liveDay.count);
          const level = Math.max(baseDay.level, liveDay.level);
          return { date: baseDay.date, count, level };
        });

        // Append any new days from live API beyond baseline
        const existingLastDates = new Set(mergedLastYear.map((d) => d.date));
        liveDays.forEach((liveDay) => {
          if (!existingLastDates.has(liveDay.date)) {
            mergedLastYear.push(liveDay);
          }
        });

        // 2. Merge all contributions
        const mergedAll: ContributionDay[] = (baseTyped.allContributions || []).map((baseDay) => {
          const liveDay = liveMap.get(baseDay.date);
          if (!liveDay) return baseDay;
          const count = Math.max(baseDay.count, liveDay.count);
          const level = Math.max(baseDay.level, liveDay.level);
          return { date: baseDay.date, count, level };
        });

        const existingAllDates = new Set(mergedAll.map((d) => d.date));
        liveDays.forEach((liveDay) => {
          if (!existingAllDates.has(liveDay.date)) {
            mergedAll.push(liveDay);
          }
        });

        // 3. Compute dynamic totals
        const sumLastYear = mergedLastYear.reduce((acc, d) => acc + d.count, 0);
        const sum2026 = mergedAll.filter((d) => d.date.startsWith('2026')).reduce((acc, d) => acc + d.count, 0);
        const sum2025 = mergedAll.filter((d) => d.date.startsWith('2025')).reduce((acc, d) => acc + d.count, 0);

        const freshData: ContributionData = {
          total: {
            ...liveTotals,
            ...baseTyped.total,
            '2025': Math.max(baseTyped.total?.['2025'] || 30, sum2025),
            '2026': Math.max(baseTyped.total?.['2026'] || 228, sum2026),
            lastYear: Math.max(baseTyped.total?.lastYear || 256, sumLastYear),
          },
          lastYearContributions: mergedLastYear,
          allContributions: mergedAll,
        };

        setData(freshData);
        setIsLive(true);
        lastSyncTimeRef.current = Date.now();

        try {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ data: freshData, timestamp: Date.now() })
          );
        } catch (storageErr) {
          console.debug('Storage error:', storageErr);
        }
      }
    } catch (err) {
      if (isManual) {
        console.error('Failed to sync contributions:', err);
      }
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Auto-sync: on mount (deferred for React 19 purity)
  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(() => {
      if (isMounted) {
        syncContributions();
      }
    }, 0);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [syncContributions]);

  // Auto-sync: on window focus (e.g. user pushes commits in terminal or other tab)
  useEffect(() => {
    const handleFocus = () => {
      if (Date.now() - lastSyncTimeRef.current > 2 * 60 * 1000) {
        syncContributions();
      }
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [syncContributions]);

  // Auto-sync: periodic poll every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      syncContributions();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [syncContributions]);

  // Filter contributions by selected view
  const activeDaysList = useMemo(() => {
    if (selectedYear === 'lastYear') {
      return data.lastYearContributions || [];
    }
    return (data.allContributions || []).filter((d) => d.date.startsWith(selectedYear));
  }, [data, selectedYear]);

  // Compute live metrics
  const stats = useMemo(() => {
    let total = 0;
    let activeDays = 0;
    let longestStreak = 0;
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

    const yearTotal = data.total?.[selectedYear] ?? total;

    return {
      total: yearTotal || total,
      activeDays,
      longestStreak,
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

    // Determine month labels positioned at week column indices
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
      {/* Refined Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 22px',
          background: 'rgba(255, 255, 255, 0.02)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {/* Left: GitHub Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--white)' }}>
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.92rem', fontWeight: 700, color: 'var(--white)' }}>
              GitHub Activity
            </span>
            <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>•</span>
            <a
              href="https://github.com/Akosidakdok"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--gray-light)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--gray-light)')}
            >
              @Akosidakdok <ArrowUpRight size={11} />
            </a>
          </div>
        </div>

        {/* Right: Auto-sync Status & Manual Refresh */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ position: 'relative', display: 'flex', height: '7px', width: '7px' }}>
              <span
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  backgroundColor: isLive ? '#22c55e' : '#6366f1',
                  opacity: 0.6,
                  animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
                }}
              />
              <span
                style={{
                  position: 'relative',
                  display: 'inline-flex',
                  borderRadius: '50%',
                  height: '7px',
                  width: '7px',
                  backgroundColor: isLive ? '#22c55e' : '#6366f1',
                }}
              />
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                color: isLive ? '#86efac' : '#a5b4fc',
                letterSpacing: '0.04em',
                fontWeight: 500,
              }}
            >
              {isSyncing ? 'Syncing...' : isLive ? 'Live Sync' : 'Synced'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => syncContributions(true)}
            disabled={isSyncing}
            title="Sync latest GitHub commits now"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 11px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: 'var(--gray-light)',
              cursor: isSyncing ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: '0.72rem',
              fontWeight: 500,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!isSyncing) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.16)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSyncing) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                e.currentTarget.style.color = 'var(--gray-light)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              }
            }}
          >
            <RefreshCw
              size={12}
              style={{
                animation: isSyncing ? 'spin 0.8s linear infinite' : 'none',
              }}
            />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* 4 Clean Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
          {/* Total Contributions */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.025)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--gray)', fontWeight: 500, marginBottom: '4px' }}>
              Total Contributions
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--white)', fontWeight: 700, lineHeight: 1.2 }}>
              {stats.total.toLocaleString()}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.64rem', color: '#86efac', marginTop: '4px' }}>
              {selectedYear === 'lastYear' ? 'Last 365 days' : `Year ${selectedYear}`}
            </div>
          </div>

          {/* Active Days */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.025)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--gray)', fontWeight: 500, marginBottom: '4px' }}>
              Active Dev Days
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--white)', fontWeight: 700, lineHeight: 1.2 }}>
              {stats.activeDays} <span style={{ fontSize: '0.75rem', color: 'var(--gray)', fontWeight: 400 }}>days</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.64rem', color: '#38bdf8', marginTop: '4px' }}>
              {stats.activeDays} active days
            </div>
          </div>

          {/* Longest Streak */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.025)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--gray)', fontWeight: 500, marginBottom: '4px' }}>
              Longest Streak
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--white)', fontWeight: 700, lineHeight: 1.2 }}>
              {stats.longestStreak} <span style={{ fontSize: '0.75rem', color: 'var(--gray)', fontWeight: 400 }}>days</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.64rem', color: '#f59e0b', marginTop: '4px' }}>
              Peak momentum
            </div>
          </div>

          {/* Peak Day Activity */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.025)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--gray)', fontWeight: 500, marginBottom: '4px' }}>
              Most Productive Day
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--white)', fontWeight: 700, lineHeight: 1.2 }}>
              {stats.maxDay.count} <span style={{ fontSize: '0.75rem', color: 'var(--gray)', fontWeight: 400 }}>commits</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.64rem', color: '#a5b4fc', marginTop: '4px' }}>
              {stats.maxDay.date ? formatDateLabel(stats.maxDay.date).split(',').slice(0, 2).join(',') : 'Recorded'}
            </div>
          </div>
        </div>

        {/* Toolbar: Dynamic Year Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            paddingBottom: '14px',
          }}
        >
          {/* Year Range Tabs */}
          <div style={{ display: 'inline-flex', gap: '6px', background: 'rgba(0, 0, 0, 0.3)', padding: '3px', borderRadius: '8px' }}>
            {availableYears.map((yearKey) => {
              const active = selectedYear === yearKey;
              const label = yearKey === 'lastYear' ? 'Last 12 Months' : yearKey;
              return (
                <button
                  key={yearKey}
                  type="button"
                  onClick={() => setSelectedYear(yearKey)}
                  style={{
                    background: active ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    color: active ? 'var(--white)' : 'var(--gray)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.72rem',
                    padding: '5px 12px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    fontWeight: active ? 600 : 400,
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.color = 'var(--gray-light)';
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.color = 'var(--gray)';
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Activity Tag */}
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--gray-light)' }}>
            <span style={{ color: '#86efac', fontWeight: 600 }}>{stats.total}</span> contributions in{' '}
            {selectedYear === 'lastYear' ? 'the last year' : selectedYear}
          </div>
        </div>

        {/* Heatmap Grid with sleek custom scrollbar */}
        <div style={{ position: 'relative' }}>
          <div className="heatmap-scroll-container" style={{ paddingBottom: '8px' }}>
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

              {/* Heatmap 7 rows */}
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

                        const cellColor = GITHUB_COLORS[cell.level] || GITHUB_COLORS[0];

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

          {/* Floating Hover Tooltip */}
          {hoveredCell && (
            <div
              style={{
                position: 'fixed',
                left: `${hoveredCell.x}px`,
                top: `${hoveredCell.y - 42}px`,
                transform: 'translateX(-50%)',
                background: 'rgba(15, 15, 20, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
                padding: '5px 11px',
                borderRadius: '7px',
                pointerEvents: 'none',
                zIndex: 9999,
                whiteSpace: 'nowrap',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '2px',
                  background: GITHUB_COLORS[hoveredCell.day.level] || GITHUB_COLORS[0],
                }}
              />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.74rem', color: '#fff', fontWeight: 500 }}>
                {hoveredCell.day.count > 0 ? (
                  <>
                    <strong>{hoveredCell.day.count} {hoveredCell.day.count === 1 ? 'contribution' : 'contributions'}</strong> on {formatDateLabel(hoveredCell.day.date)}
                  </>
                ) : (
                  <>No contributions on {formatDateLabel(hoveredCell.day.date)}</>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Live Hover Info Bar & Legend (Restored as requested) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            padding: '12px 18px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.025)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          {/* Active Hover Inspection */}
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--gray-light)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {hoveredCell ? (
              <>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '2px',
                    background: GITHUB_COLORS[hoveredCell.day.level] || GITHUB_COLORS[0],
                    display: 'inline-block',
                  }}
                />
                <span>
                  <strong style={{ color: '#fff' }}>
                    {hoveredCell.day.count} {hoveredCell.day.count === 1 ? 'contribution' : 'contributions'}
                  </strong>{' '}
                  recorded on {formatDateLabel(hoveredCell.day.date)}
                </span>
              </>
            ) : (
              <>
                <span style={{ color: 'var(--gray)' }}>✦</span>
                <span>Hover over any calendar cell to inspect commit timeline</span>
              </>
            )}
          </div>

          {/* Color Scale Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--gray)' }}>Less</span>
            <div style={{ display: 'flex', gap: '3px' }}>
              {GITHUB_COLORS.map((col, idx) => (
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
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--gray)' }}>More</span>
          </div>
        </div>
      </div>

      {/* Clean Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 22px',
          background: 'rgba(0, 0, 0, 0.35)',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.68rem',
          color: 'var(--gray)',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div>
          <span>Live GitHub activity for </span>
          <a
            href="https://github.com/Akosidakdok"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--gray-light)', textDecoration: 'none' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--gray-light)')}
          >
            @Akosidakdok
          </a>
        </div>

        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <a
            href="https://github.com/Akosidakdok?tab=repositories"
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
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--gray-light)')}
          >
            <span>Repositories</span>
            <ArrowUpRight size={12} />
          </a>
          <span style={{ color: 'rgba(255, 255, 255, 0.15)' }}>•</span>
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
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--gray-light)')}
          >
            <span>Profile</span>
            <ArrowUpRight size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
