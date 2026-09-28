import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.resolve(__dirname, '../src/data/githubContributions.json');

if (!fs.existsSync(jsonPath)) {
  process.exit(0);
}

try {
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  const today = new Date();
  const year = today.getFullYear().toString();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  function getLevel(count) {
    if (count <= 0) return 0;
    if (count <= 3) return 1;
    if (count <= 6) return 2;
    if (count <= 12) return 3;
    return 4;
  }

  // 1. Update rolling last-year contributions
  let lastYearDay = (data.lastYearContributions || []).find((d) => d.date === todayStr);
  if (lastYearDay) {
    lastYearDay.count += 1;
    lastYearDay.level = getLevel(lastYearDay.count);
  } else {
    data.lastYearContributions = data.lastYearContributions || [];
    data.lastYearContributions.push({
      date: todayStr,
      count: 1,
      level: 1,
    });
    if (data.lastYearContributions.length > 366) {
      data.lastYearContributions = data.lastYearContributions.slice(-366);
    }
  }

  // 2. Update all contributions
  let allDay = (data.allContributions || []).find((d) => d.date === todayStr);
  if (allDay) {
    allDay.count += 1;
    allDay.level = getLevel(allDay.count);
  } else {
    data.allContributions = data.allContributions || [];
    data.allContributions.push({
      date: todayStr,
      count: 1,
      level: 1,
    });
  }

  // 3. Compute dynamic totals
  data.total = data.total || {};
  data.total.lastYear = (data.lastYearContributions || []).reduce((sum, d) => sum + d.count, 0);
  data.total[year] = (data.allContributions || []).filter((d) => d.date.startsWith(year)).reduce((sum, d) => sum + d.count, 0);

  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

  // Stage the updated dataset for the commit
  try {
    execSync(`git add "${jsonPath}"`);
  } catch {
    // Git add fallback
  }

  console.log(`[Contributions Hook] Logged commit for ${todayStr}. Total last year: ${data.total.lastYear}`);
} catch (e) {
  console.warn('[Contributions Hook] Could not auto-record commit:', e.message);
}
