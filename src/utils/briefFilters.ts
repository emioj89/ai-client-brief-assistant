import type { Brief, SortField } from '../types/brief';

export function filterBriefs(
  briefs: Brief[],
  searchQuery: string,
  complexityFilter: string
): Brief[] {
  const query = searchQuery.trim().toLowerCase();

  return briefs.filter((brief) => {
    // Complexity filter
    if (complexityFilter && complexityFilter !== 'all' && brief.complexity !== complexityFilter) {
      return false;
    }

    // Search query match (project title, client name)
    if (query) {
      const matchTitle = brief.project_title.toLowerCase().includes(query);
      const matchClient = brief.client_name ? brief.client_name.toLowerCase().includes(query) : false;

      if (!matchTitle && !matchClient) {
        return false;
      }
    }

    return true;
  });
}

export function sortBriefs(briefs: Brief[], sortBy: SortField): Brief[] {
  const sorted = [...briefs];

  const complexityWeight = { high: 3, medium: 2, low: 1 };

  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    case 'title-asc':
      return sorted.sort((a, b) => a.project_title.localeCompare(b.project_title));
    case 'complexity':
      return sorted.sort((a, b) => complexityWeight[b.complexity] - complexityWeight[a.complexity]);
    default:
      return sorted;
  }
}

