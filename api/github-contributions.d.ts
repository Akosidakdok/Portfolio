export interface GitHubContributionDay {
  date: string;
  count: number;
  level: number;
}

export interface GitHubContributionData {
  total: Record<string, number>;
  allContributions: GitHubContributionDay[];
  lastYearContributions: GitHubContributionDay[];
}

export function getGitHubContributions(
  token: string,
  now?: Date,
): Promise<GitHubContributionData>;
