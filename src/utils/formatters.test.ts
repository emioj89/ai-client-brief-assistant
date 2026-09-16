import { describe, it, expect } from 'vitest';
import { formatDate, capitalize } from './formatters';

describe('formatters', () => {
  describe('formatDate', () => {
    it('formats ISO date string to Month, Day, Year representation', () => {
      expect(formatDate('2026-03-15T10:00:00Z')).toBe('Mar 15, 2026');
    });

    it('returns dash fallback for invalid or empty dates', () => {
      expect(formatDate('')).toBe('—');
      expect(formatDate('invalid-date')).toBe('—');
    });
  });

  describe('capitalize', () => {
    it('capitalizes the first character of a string', () => {
      expect(capitalize('medium')).toBe('Medium');
      expect(capitalize('HIGH')).toBe('High');
      expect(capitalize('')).toBe('');
    });
  });
});

