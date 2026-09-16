import React from 'react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No briefs found',
  message = 'There are no project briefs to display matching your criteria.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="state-container state-container--empty">
      <div className="state-icon">📝</div>
      <h3 className="state-title">{title}</h3>
      <p className="state-message">{message}</p>
      {actionLabel && onAction && (
        <button type="button" className="btn btn--primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

