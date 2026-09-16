import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { briefsService } from '../services/briefsService';
import type { Brief } from '../types/brief';
import { formatDate, capitalize } from '../utils/formatters';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';

export const BriefDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [brief, setBrief] = useState<Brief | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchBrief = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await briefsService.getBriefById(id);
      setBrief(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to load brief details.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBrief();
  }, [fetchBrief]);

  const handleDelete = async () => {
    if (!id || !brief) return;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${brief.project_title}"? This action cannot be undone.`
    );
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      await briefsService.deleteBrief(id);
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete brief.';
      alert(msg);
      setIsDeleting(false);
    }
  };

  const handleCopyClientResponse = async () => {
    if (!brief?.analysis?.clientResponseDraft) return;
    try {
      await navigator.clipboard.writeText(brief.analysis.clientResponseDraft);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert('Unable to copy text to clipboard.');
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading project brief specification..." />;
  }

  if (error || !brief) {
    return (
      <ErrorState
        title="Brief not found"
        message={error || 'The requested brief does not exist or was deleted.'}
        onRetry={fetchBrief}
      />
    );
  }

  const { analysis } = brief;

  return (
    <div className="page-container">
      <div className="detail-navigation">
        <Link to="/dashboard" className="back-link">
          ← Back to Dashboard
        </Link>
      </div>

      {/* Brief Header */}
      <div className="detail-card">
        <div className="detail-card__header">
          <div>
            <div className="detail-title-group">
              <h2 className="detail-name">{brief.project_title}</h2>
              <span className={`badge badge--complexity-${brief.complexity}`}>
                {capitalize(brief.complexity)} Complexity
              </span>
            </div>
            {brief.client_name && <p className="detail-company">👤 Client: {brief.client_name}</p>}
            <p className="text-muted text-xs margin-top-xs">Created on {formatDate(brief.created_at)}</p>
          </div>

          <div className="detail-actions">
            <button
              type="button"
              className="btn btn--danger"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : '🗑️ Delete Brief'}
            </button>
          </div>
        </div>

        {/* Executive Summary */}
        <section className="brief-section">
          <h3 className="brief-section-title">📋 Executive Summary</h3>
          <p className="brief-section-text">{analysis.summary}</p>
        </section>

        {/* Complexity Assessment */}
        <section className="brief-section">
          <h3 className="brief-section-title">📊 Complexity & Reasoning</h3>
          <div className="complexity-box">
            <span className={`badge badge--complexity-${analysis.complexity.level}`}>
              {capitalize(analysis.complexity.level)} Level
            </span>
            <p className="complexity-reasoning">{analysis.complexity.reasoning}</p>
          </div>
        </section>

        {/* Primary Objectives */}
        {analysis.objectives && analysis.objectives.length > 0 && (
          <section className="brief-section">
            <h3 className="brief-section-title">🎯 Primary Objectives</h3>
            <ul className="styled-list">
              {analysis.objectives.map((obj, i) => (
                <li key={i}>{obj}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Functional Requirements */}
        {analysis.functionalRequirements && analysis.functionalRequirements.length > 0 && (
          <section className="brief-section">
            <h3 className="brief-section-title">⚙️ Functional Requirements</h3>
            <ul className="styled-list">
              {analysis.functionalRequirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Non-Functional Requirements */}
        {analysis.nonFunctionalRequirements && analysis.nonFunctionalRequirements.length > 0 && (
          <section className="brief-section">
            <h3 className="brief-section-title">🛡️ Non-Functional Requirements</h3>
            <ul className="styled-list">
              {analysis.nonFunctionalRequirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Questions to Clarify */}
        {analysis.missingQuestions && analysis.missingQuestions.length > 0 && (
          <section className="brief-section brief-section--highlight">
            <h3 className="brief-section-title">❓ Missing Questions to Clarify Before Budgeting</h3>
            <ul className="styled-list styled-list--warning">
              {analysis.missingQuestions.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Technical Tasks */}
        {analysis.technicalTasks && analysis.technicalTasks.length > 0 && (
          <section className="brief-section">
            <h3 className="brief-section-title">🛠️ Engineering Tasks</h3>
            <ul className="styled-list">
              {analysis.technicalTasks.map((task, i) => (
                <li key={i}>{task}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Risks & Assumptions */}
        {analysis.risksAndAssumptions && analysis.risksAndAssumptions.length > 0 && (
          <section className="brief-section">
            <h3 className="brief-section-title">⚠️ Risks & Technical Assumptions</h3>
            <ul className="styled-list">
              {analysis.risksAndAssumptions.map((risk, i) => (
                <li key={i}>{risk}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Project Phases */}
        {analysis.phases && analysis.phases.length > 0 && (
          <section className="brief-section">
            <h3 className="brief-section-title">🚀 Project Phases & Deliverables</h3>
            <div className="phases-grid">
              {analysis.phases.map((phase, i) => (
                <div key={i} className="phase-card">
                  <h4 className="phase-title">
                    Phase {i + 1}: {phase.title}
                  </h4>
                  {phase.description && <p className="phase-desc">{phase.description}</p>}
                  {phase.deliverables && phase.deliverables.length > 0 && (
                    <div className="phase-deliverables">
                      <span className="deliverable-label">Deliverables:</span>
                      <ul>
                        {phase.deliverables.map((del, dIdx) => (
                          <li key={dIdx}>{del}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Client Response Draft */}
        {analysis.clientResponseDraft && (
          <section className="brief-section brief-section--response">
            <div className="section-header-row">
              <h3 className="brief-section-title">✉️ Proposed Client Response Draft</h3>
              <button
                type="button"
                className={`btn btn--sm ${copied ? 'btn--success' : 'btn--outline'}`}
                onClick={handleCopyClientResponse}
              >
                {copied ? '✓ Copied' : '📋 Copy Response'}
              </button>
            </div>
            <div className="response-draft-box">{analysis.clientResponseDraft}</div>
          </section>
        )}

        {/* Original Raw Request */}
        <section className="brief-section brief-section--raw">
          <h3 className="brief-section-title">📄 Original Client Request</h3>
          <div className="raw-request-box">{brief.raw_request}</div>
        </section>
      </div>
    </div>
  );
};

