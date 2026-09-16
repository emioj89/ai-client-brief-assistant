import { describe, it, expect } from 'vitest';
import { cleanAndParseJSON } from './analysisParser';

describe('analysisParser', () => {
  it('parses valid AI JSON response correctly', () => {
    const validJson = JSON.stringify({
      summary: 'Project summary text',
      objectives: ['Goal 1'],
      functionalRequirements: ['Feature A'],
      nonFunctionalRequirements: ['Fast load'],
      missingQuestions: ['Q1'],
      technicalTasks: ['Task 1'],
      risksAndAssumptions: ['Risk A'],
      complexity: { level: 'high', reasoning: 'Complex architecture' },
      phases: [{ title: 'Phase 1', description: 'Desc', deliverables: ['Del 1'] }],
      clientResponseDraft: 'Hello client',
    });

    const result = cleanAndParseJSON(validJson);
    expect(result.summary).toBe('Project summary text');
    expect(result.complexity.level).toBe('high');
    expect(result.phases).toHaveLength(1);
    expect(result.clientResponseDraft).toBe('Hello client');
  });

  it('handles markdown JSON fences ```json ... ``` correctly', () => {
    const markdownWrapped = `\`\`\`json
{
  "summary": "Wrapped summary",
  "complexity": { "level": "low", "reasoning": "Simple" }
}
\`\`\``;

    const result = cleanAndParseJSON(markdownWrapped);
    expect(result.summary).toBe('Wrapped summary');
    expect(result.complexity.level).toBe('low');
  });

  it('throws a clean error on invalid JSON text', () => {
    expect(() => cleanAndParseJSON('invalid json string')).toThrow(
      'Invalid JSON format returned by AI provider.'
    );
  });

  it('normalizes invalid or unknown complexity levels to "medium"', () => {
    const invalidComplexity = JSON.stringify({
      summary: 'Summary',
      complexity: { level: 'super-hard', reasoning: 'Unknown' },
    });

    const result = cleanAndParseJSON(invalidComplexity);
    expect(result.complexity.level).toBe('medium');
  });

  it('provides fallback defaults for missing required fields', () => {
    const missingFields = JSON.stringify({});

    const result = cleanAndParseJSON(missingFields);
    expect(result.summary).toBe('No summary provided.');
    expect(result.complexity.level).toBe('medium');
    expect(result.objectives).toEqual([]);
    expect(result.phases).toEqual([]);
  });

  it('normalizes malformed non-array field inputs', () => {
    const malformedArrays = JSON.stringify({
      summary: 'Test',
      objectives: 'not-an-array',
      functionalRequirements: null,
    });

    const result = cleanAndParseJSON(malformedArrays);
    expect(result.objectives).toEqual([]);
    expect(result.functionalRequirements).toEqual([]);
  });

  it('safely normalizes malformed phases structure', () => {
    const malformedPhases = JSON.stringify({
      summary: 'Test',
      phases: [
        { title: null, description: 123, deliverables: 'invalid' },
        null,
      ],
    });

    const result = cleanAndParseJSON(malformedPhases);
    expect(result.phases).toHaveLength(2);
    expect(result.phases[0].title).toBe('Phase');
    expect(result.phases[0].deliverables).toEqual([]);
  });
});

