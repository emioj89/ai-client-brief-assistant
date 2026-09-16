import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBriefs } from '../hooks/useBriefs';
import { ErrorState } from '../components/ui/ErrorState';

const MAX_CHAR_LIMIT = 12000;

export const NewBriefPage: React.FC = () => {
  const navigate = useNavigate();
  const { analyzeBrief } = useBriefs();

  const [projectTitle, setProjectTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [rawRequest, setRawRequest] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const charCount = rawRequest.length;
  const isOverLimit = charCount > MAX_CHAR_LIMIT;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!projectTitle.trim()) {
      setError('Please provide a project title.');
      return;
    }

    if (!rawRequest.trim()) {
      setError('Please paste the client project request.');
      return;
    }

    if (isOverLimit) {
      setError(`Client request exceeds the maximum allowed limit of ${MAX_CHAR_LIMIT.toLocaleString()} characters.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const createdBrief = await analyzeBrief({
        project_title: projectTitle.trim(),
        client_name: clientName.trim(),
        raw_request: rawRequest.trim(),
      });

      navigate(`/briefs/${createdBrief.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to analyze the brief right now. Please try again.';
      setError(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container page-container--narrow">
      <div className="page-header">
        <div>
          <h2 className="page-title">Analyze New Client Brief</h2>
          <p className="page-subtitle">
            Paste an raw client email, message, or spec to extract structured technical requirements.
          </p>
        </div>
      </div>

      {error && (
        <ErrorState
          title="Analysis Failed"
          message={error}
          onRetry={() => setError(null)}
        />
      )}

      <div className="form-card">
        <form onSubmit={handleSubmit} className="contact-form" noValidate>
          <div className="form-group">
            <label htmlFor="project_title" className="form-label">
              Project Title <span className="required-asterisk">*</span>
            </label>
            <input
              id="project_title"
              type="text"
              className="form-control"
              placeholder="e.g. E-Commerce Platform Redesign"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="client_name" className="form-label">
              Client Name / Organization
            </label>
            <input
              id="client_name"
              type="text"
              className="form-control"
              placeholder="e.g. Acme Retail Ltd"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="raw_request" className="form-label">
                Raw Client Request <span className="required-asterisk">*</span>
              </label>
              <span className={`char-counter ${isOverLimit ? 'char-counter--over' : ''}`}>
                {charCount.toLocaleString()} / {MAX_CHAR_LIMIT.toLocaleString()} chars
              </span>
            </div>
            <textarea
              id="raw_request"
              rows={12}
              className={`form-control ${isOverLimit ? 'form-control--error' : ''}`}
              placeholder="Paste the raw client email, message, Slack thread, or requirement notes here..."
              value={rawRequest}
              onChange={(e) => setRawRequest(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn--outline"
              onClick={() => navigate('/dashboard')}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={isSubmitting || isOverLimit}
            >
              {isSubmitting ? '🤖 Analyzing Brief...' : '✨ Analyze Brief'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

