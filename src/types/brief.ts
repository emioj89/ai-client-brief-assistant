export type ComplexityLevel = 'low' | 'medium' | 'high';

export interface ProjectPhase {
  title: string;
  description: string;
  deliverables: string[];
}

export interface ComplexityInfo {
  level: ComplexityLevel;
  reasoning: string;
}

export interface BriefAnalysis {
  summary: string;
  objectives: string[];
  functionalRequirements: string[];
  nonFunctionalRequirements: string[];
  missingQuestions: string[];
  technicalTasks: string[];
  risksAndAssumptions: string[];
  complexity: ComplexityInfo;
  phases: ProjectPhase[];
  clientResponseDraft: string;
}

export interface Brief {
  id: string;
  user_id: string;
  project_title: string;
  client_name: string | null;
  raw_request: string;
  analysis: BriefAnalysis;
  complexity: ComplexityLevel;
  created_at: string;
  updated_at: string;
}

export interface CreateBriefFormData {
  project_title: string;
  client_name: string;
  raw_request: string;
}

export interface BriefStats {
  totalBriefs: number;
  lowComplexityCount: number;
  mediumComplexityCount: number;
  highComplexityCount: number;
}

export type SortField = 'newest' | 'oldest' | 'title-asc' | 'complexity';

