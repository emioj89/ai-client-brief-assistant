import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBriefs } from '../hooks/useBriefs';
import { calculateBriefStats } from '../utils/briefStats';
import { filterBriefs, sortBriefs } from '../utils/briefFilters';
import type { SortField } from '../types/brief';
import { formatDate, capitalize } from '../utils/formatters';
import { KpiCard } from '../components/ui/KpiCard';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { briefs, isLoading, error, refetch } = useBriefs();

  const [searchQuery, setSearchQuery] = useState('');
  const [complexityFilter, setComplexityFilter] = useState('all');
  const [sortBy, setSortBy] = useState<SortField>('newest');

  const stats = useMemo(() => {
    return calculateBriefStats(briefs);
  }, [briefs]);

  const filteredBriefs = useMemo(() => {
    const filtered = filterBriefs(briefs, searchQuery, complexityFilter);
    return sortBriefs(filtered, sortBy);
  }, [briefs, searchQuery, complexityFilter, sortBy]);

  const hasActiveFilters = Boolean(searchQuery.trim() || complexityFilter !== 'all' || sortBy !== 'newest');

  const handleResetFilters = () => {
    setSearchQuery('');
    setComplexityFilter('all');
    setSortBy('newest');
  };

  if (isLoading) {
    return <LoadingState message="Fetching your project briefs..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to load dashboard briefs"
        message={error}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Briefs Dashboard</h2>
          <p className="page-subtitle">
            Overview of AI-analyzed client requests, project complexities, and specs.
          </p>
        </div>
        <Link to="/briefs/new" className="btn btn--primary">
          ✨ Analyze New Brief
        </Link>
      </div>

      {/* KPI Section */}
      <section className="kpi-grid" aria-label="Key Performance Indicators">
        <KpiCard
          title="Total Briefs"
          value={stats.totalBriefs}
          icon="📄"
          subtext="Analyzed client requests"
          badgeType="default"
        />
        <KpiCard
          title="Low Complexity"
          value={stats.lowComplexityCount}
          icon="🟢"
          subtext="Straightforward projects"
          badgeType="success"
        />
        <KpiCard
          title="Medium Complexity"
          value={stats.mediumComplexityCount}
          icon="🟡"
          subtext="Standard scope projects"
          badgeType="warning"
        />
        <KpiCard
          title="High Complexity"
          value={stats.highComplexityCount}
          icon="🔴"
          subtext="Multi-phase / architecturally heavy"
          badgeType="danger"
        />
      </section>

      {/* History & Controls Section */}
      <section className="dashboard-section">
        <div className="section-header">
          <div>
            <h3 className="section-title">Briefs History</h3>
            <p className="section-subtitle">Search, filter, and review analyzed briefs</p>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="filters-bar">
          <div className="filter-group search-group">
            <label htmlFor="brief-search" className="sr-only">
              Search briefs
            </label>
            <div className="search-input-wrapper">
              <span className="search-icon" aria-hidden="true">
                🔍
              </span>
              <input
                id="brief-search"
                type="text"
                className="form-control search-input"
                placeholder="Search by project title or client name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search input"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="filter-group-row">
            <div className="filter-group">
              <label htmlFor="complexity-filter" className="filter-label">
                Complexity
              </label>
              <select
                id="complexity-filter"
                className="form-select"
                value={complexityFilter}
                onChange={(e) => setComplexityFilter(e.target.value)}
              >
                <option value="all">All complexities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="sort-by" className="filter-label">
                Sort by
              </label>
              <select
                id="sort-by"
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortField)}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="title-asc">Project Title A-Z</option>
                <option value="complexity">Complexity (High to Low)</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                className="btn btn--outline btn--sm reset-filters-btn"
                onClick={handleResetFilters}
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Content list */}
        {briefs.length === 0 ? (
          <EmptyState
            title="No briefs analyzed yet"
            message="Paste your first client request to generate an AI-powered project brief."
            actionLabel="Analyze First Brief"
            onAction={() => navigate('/briefs/new')}
          />
        ) : filteredBriefs.length === 0 ? (
          <EmptyState
            title="No matching briefs"
            message="No briefs match your search and complexity filters. Try adjusting your filters."
            actionLabel="Reset Filters"
            onAction={handleResetFilters}
          />
        ) : (
          <div className="table-responsive">
            <table className="contacts-table">
              <thead>
                <tr>
                  <th scope="col">Project Title</th>
                  <th scope="col">Client</th>
                  <th scope="col">Complexity</th>
                  <th scope="col">Summary</th>
                  <th scope="col">Created Date</th>
                  <th scope="col" className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBriefs.map((brief) => (
                  <tr key={brief.id}>
                    <td className="font-semibold">
                      <Link to={`/briefs/${brief.id}`} className="contact-name-link">
                        {brief.project_title}
                      </Link>
                    </td>
                    <td>{brief.client_name || '—'}</td>
                    <td>
                      <span className={`badge badge--complexity-${brief.complexity}`}>
                        {capitalize(brief.complexity)}
                      </span>
                    </td>
                    <td className="text-muted truncate max-w-xs">
                      {brief.analysis.summary}
                    </td>
                    <td className="text-muted">{formatDate(brief.created_at)}</td>
                    <td className="text-right">
                      <Link to={`/briefs/${brief.id}`} className="btn btn--outline btn--sm">
                        View Brief
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

