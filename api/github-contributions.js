const GITHUB_USERNAME = 'Akosidakdok';

const CONTRIBUTION_LEVELS = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

function toDays(calendar) {
  return calendar.weeks.flatMap((week) =>
    week.contributionDays.map((day) => ({
      date: day.date,
      count: day.contributionCount,
      level: CONTRIBUTION_LEVELS[day.contributionLevel] ?? 0,
    })),
  );
}

export async function getGitHubContributions(token, now = new Date()) {
  const year = now.getUTCFullYear();
  const yearFrom = new Date(Date.UTC(year, 0, 1));
  const yearTo = new Date(Date.UTC(year, 11, 31, 23, 59, 59));
  const lastYearFrom = new Date(now);
  lastYearFrom.setUTCDate(lastYearFrom.getUTCDate() - 364);
  lastYearFrom.setUTCHours(0, 0, 0, 0);
  const lastYearTo = new Date(now);
  lastYearTo.setUTCHours(23, 59, 59, 999);

  const query = `
    query ContributionCalendars(
      $login: String!
      $yearFrom: DateTime!
      $yearTo: DateTime!
      $lastYearFrom: DateTime!
      $lastYearTo: DateTime!
    ) {
      user(login: $login) {
        yearly: contributionsCollection(from: $yearFrom, to: $yearTo) {
          contributionCalendar {
            totalContributions
            weeks { contributionDays { date contributionCount contributionLevel } }
          }
        }
        rolling: contributionsCollection(from: $lastYearFrom, to: $lastYearTo) {
          contributionCalendar {
            totalContributions
            weeks { contributionDays { date contributionCount contributionLevel } }
          }
        }
      }
    }
  `;

  const githubResponse = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'portfolio-contribution-calendar',
    },
    body: JSON.stringify({
      query,
      variables: {
        login: GITHUB_USERNAME,
        yearFrom: yearFrom.toISOString(),
        yearTo: yearTo.toISOString(),
        lastYearFrom: lastYearFrom.toISOString(),
        lastYearTo: lastYearTo.toISOString(),
      },
    }),
  });

  const payload = await githubResponse.json();
  const user = payload.data?.user;
  if (!githubResponse.ok || payload.errors?.length || !user) {
    throw new Error(`GitHub contribution GraphQL request failed (${githubResponse.status})`);
  }

  const yearlyCalendar = user.yearly.contributionCalendar;
  const rollingCalendar = user.rolling.contributionCalendar;
  return {
    total: {
      [String(year)]: yearlyCalendar.totalContributions,
      lastYear: rollingCalendar.totalContributions,
    },
    allContributions: toDays(yearlyCalendar),
    lastYearContributions: toDays(rollingCalendar),
  };
}

export default async function handler(request) {
  if (request.method !== 'GET') {
    return Response.json({ error: 'Method not allowed' }, { status: 405, headers: { Allow: 'GET' } });
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return Response.json({ error: 'GitHub contribution token is not configured' }, { status: 503 });
  }

  try {
    const data = await getGitHubContributions(token);
    return Response.json(data, {
      headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' },
    });
  } catch (error) {
    console.error('GitHub contribution endpoint failed', error);
    return Response.json({ error: 'Could not retrieve GitHub contributions' }, { status: 502 });
  }
}
