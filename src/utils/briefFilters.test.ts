import { describe, it, expect } from 'vitest';
import { filterBriefs, sortBriefs } from './briefFilters';
import type { Brief } from '../types/brief';

const mockBriefs: Brief[] = [
  {
    id: 'b1',
    user_id: 'u1',
    project_title: 'E-Commerce Website',
    client_name: 'Acme Store',
    raw_request: 'Build an online shop',
    complexity: 'medium',
    analysis: {
      summary: 'Summary 1',
      objectives: [],
      functionalRequirements: [],
      nonFunctionalRequirements: [],
      missingQuestions: [],
      technicalTasks: [],
      risksAndAssumptions: [],
      complexity: { level: 'medium', reasoning: 'Standard shop' },
      phases: [],
      clientResponseDraft: '',
    },
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 'b2',
    user_id: 'u1',
    project_title: 'Mobile Fitness App',
    client_name: 'FitStudio',
    raw_request: 'iOS app for tracking workouts',
    complexity: 'high',
    analysis: {
      summary: 'Summary 2',
      objectives: [],
      functionalRequirements: [],
      nonFunctionalRequirements: [],
      missingQuestions: [],
      technicalTasks: [],
      risksAndAssumptions: [],
      complexity: { level: 'high', reasoning: 'Complex sync' },
      phases: [],
      clientResponseDraft: '',
    },
    created_at: '2026-02-15T14:30:00Z',
    updated_at: '2026-02-15T14:30:00Z',
  },
  {
    id: 'b3',
    user_id: 'u1',
    project_title: 'Landing Page',
    client_name: 'Beta Agency',
    raw_request: 'Single page site',
    complexity: 'low',
    analysis: {
      summary: 'Summary 3',
      objectives: [],
      functionalRequirements: [],
      nonFunctionalRequirements: [],
      missingQuestions: [],
      technicalTasks: [],
      risksAndAssumptions: [],
      complexity: { level: 'low', reasoning: 'Static site' },
      phases: [],
      clientResponseDraft: '',
    },
    created_at: '2026-03-01T09:15:00Z',
    updated_at: '2026-03-01T09:15:00Z',
  },
];

describe('briefFilters', () => {
  describe('filterBriefs', () => {
    it('filters briefs by project title query (case-insensitive)', () => {
      const result = filterBriefs(mockBriefs, 'e-commerce', 'all');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('b1');
    });

    it('filters briefs by client name query (case-insensitive)', () => {
      const result = filterBriefs(mockBriefs, 'fitstudio', 'all');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('b2');
    });

    it('filters briefs by complexity dropdown selection', () => {
      const result = filterBriefs(mockBriefs, '', 'low');
      expect(result).toHaveLength(1);
      expect(result[0].complexity).toBe('low');
    });

    it('combines text search and complexity filter', () => {
      const result = filterBriefs(mockBriefs, 'Mobile', 'high');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('b2');

      const noMatch = filterBriefs(mockBriefs, 'Mobile', 'low');
      expect(noMatch).toHaveLength(0);
    });
  });

  describe('sortBriefs', () => {
    it('sorts by newest created_at date', () => {
      const result = sortBriefs(mockBriefs, 'newest');
      expect(result.map((b) => b.id)).toEqual(['b3', 'b2', 'b1']);
    });

    it('sorts by oldest created_at date', () => {
      const result = sortBriefs(mockBriefs, 'oldest');
      expect(result.map((b) => b.id)).toEqual(['b1', 'b2', 'b3']);
    });

    it('sorts by project title A-Z', () => {
      const result = sortBriefs(mockBriefs, 'title-asc');
      expect(result.map((b) => b.project_title)).toEqual([
        'E-Commerce Website',
        'Landing Page',
        'Mobile Fitness App',
      ]);
    });

    it('sorts by complexity (High to Low)', () => {
      const result = sortBriefs(mockBriefs, 'complexity');
      expect(result.map((b) => b.complexity)).toEqual(['high', 'medium', 'low']);
    });
  });
});

