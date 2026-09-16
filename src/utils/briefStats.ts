import type { Brief, BriefStats } from '../types/brief';

export function calculateBriefStats(briefs: Brief[]): BriefStats {
  if (!briefs || briefs.length === 0) {
    return {
      totalBriefs: 0,
      lowComplexityCount: 0,
      mediumComplexityCount: 0,
      highComplexityCount: 0,
    };
  }

  let lowComplexityCount = 0;
  let mediumComplexityCount = 0;
  let highComplexityCount = 0;

  for (const brief of briefs) {
    if (brief.complexity === 'low') {
      lowComplexityCount += 1;
    } else if (brief.complexity === 'medium') {
      mediumComplexityCount += 1;
    } else if (brief.complexity === 'high') {
      highComplexityCount += 1;
    }
  }

  return {
    totalBriefs: briefs.length,
    lowComplexityCount,
    mediumComplexityCount,
    highComplexityCount,
  };
}

