import React from 'react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="state-container" aria-live="polite">
      <div className="spinner" role="status">
        <span className="sr-only">Loading</span>
      </div>
      <p className="state-message">{message}</p>
    </div>
  );
};

