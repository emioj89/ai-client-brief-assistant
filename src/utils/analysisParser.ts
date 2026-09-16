import type { BriefAnalysis, ProjectPhase } from '../types/brief';

export function cleanAndParseJSON(text: string): BriefAnalysis {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
  }

  let parsed: any;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error('Invalid JSON format returned by AI provider.');
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Malformed analysis object returned by AI provider.');
  }

  // Validate and normalize required fields
  const summary = typeof parsed.summary === 'string' && parsed.summary.trim()
    ? parsed.summary.trim()
    : 'No summary provided.';

  const objectives = Array.isArray(parsed.objectives) ? parsed.objectives.map(String) : [];
  const functionalRequirements = Array.isArray(parsed.functionalRequirements) ? parsed.functionalRequirements.map(String) : [];
  const nonFunctionalRequirements = Array.isArray(parsed.nonFunctionalRequirements) ? parsed.nonFunctionalRequirements.map(String) : [];
  const missingQuestions = Array.isArray(parsed.missingQuestions) ? parsed.missingQuestions.map(String) : [];
  const technicalTasks = Array.isArray(parsed.technicalTasks) ? parsed.technicalTasks.map(String) : [];
  const risksAndAssumptions = Array.isArray(parsed.risksAndAssumptions) ? parsed.risksAndAssumptions.map(String) : [];

  let complexityLevel: 'low' | 'medium' | 'high' = 'medium';
  let complexityReasoning = 'Standard complexity assessed.';

  if (parsed.complexity && typeof parsed.complexity === 'object') {
    const lvl = String(parsed.complexity.level || '').toLowerCase();
    if (lvl === 'low' || lvl === 'medium' || lvl === 'high') {
      complexityLevel = lvl;
    }
    if (typeof parsed.complexity.reasoning === 'string' && parsed.complexity.reasoning.trim()) {
      complexityReasoning = parsed.complexity.reasoning.trim();
    }
  }

  const phases: ProjectPhase[] = Array.isArray(parsed.phases)
    ? parsed.phases.map((p: any) => ({
        title: typeof p?.title === 'string' && p.title.trim() ? p.title.trim() : 'Phase',
        description: typeof p?.description === 'string' ? p.description.trim() : '',
        deliverables: Array.isArray(p?.deliverables) ? p.deliverables.map(String) : [],
      }))
    : [];

  const clientResponseDraft = typeof parsed.clientResponseDraft === 'string' && parsed.clientResponseDraft.trim()
    ? parsed.clientResponseDraft.trim()
    : 'Thank you for reaching out with your project details. We have reviewed your requirements and prepared our initial analysis.';

  return {
    summary,
    objectives,
    functionalRequirements,
    nonFunctionalRequirements,
    missingQuestions,
    technicalTasks,
    risksAndAssumptions,
    complexity: {
      level: complexityLevel,
      reasoning: complexityReasoning,
    },
    phases,
    clientResponseDraft,
  };
}

