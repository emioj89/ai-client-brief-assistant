import { describe, it, expect } from 'vitest';
import { calculateBriefStats } from './briefStats';
import type { Brief } from '../types/brief';

const mockBriefs: Brief[] = [
  {
    id: 'b1',
    user_id: 'u1',
    project_title: 'P1',
    client_name: null,
    raw_request: 'Req 1',
    complexity: 'low',
    analysis: {} as any,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'b2',
    user_id: 'u1',
    project_title: 'P2',
    client_name: null,
    raw_request: 'Req 2',
    complexity: 'medium',
    analysis: {} as any,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'b3',
    user_id: 'u1',
    project_title: 'P3',
    client_name: null,
    raw_request: 'Req 3',
    complexity: 'high',
    analysis: {} as any,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'b4',
    user_id: 'u1',
    project_title: 'P4',
    client_name: null,
    raw_request: 'Req 4',
    complexity: 'high',
    analysis: {} as any,
    created_at: '',
    updated_at: '',
  },
];

describe('briefStats', () => {
  describe('calculateBriefStats', () => {
    it('calculates total briefs and complexity counts accurately', () => {
      const stats = calculateBriefStats(mockBriefs);
      expect(stats.totalBriefs).toBe(4);
      expect(stats.lowComplexityCount).toBe(1);
      expect(stats.mediumComplexityCount).toBe(1);
      expect(stats.highComplexityCount).toBe(2);
    });

    it('returns zero values for empty dataset or undefined', () => {
      const emptyStats = calculateBriefStats([]);
      expect(emptyStats).toEqual({
        totalBriefs: 0,
        lowComplexityCount: 0,
        mediumComplexityCount: 0,
        highComplexityCount: 0,
      });

      // @ts-expect-error testing null defensive check
      const nullStats = calculateBriefStats(null);
      expect(nullStats).toEqual({
        totalBriefs: 0,
        lowComplexityCount: 0,
        mediumComplexityCount: 0,
        highComplexityCount: 0,
      });
    });
  });
});

