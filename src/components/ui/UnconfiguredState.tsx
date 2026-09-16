import React from 'react';
import { isSupabaseConfigured } from '../../lib/supabase';

export const UnconfiguredState: React.FC = () => {
  if (isSupabaseConfigured) return null;

  return (
    <div className="state-container state-container--warning">
      <div className="state-icon">⚙️</div>
      <h3 className="state-title">Supabase is not configured</h3>
      <p className="state-message">
        Please configure your Supabase environment variables in <code>.env.local</code> to enable authentication and brief generation.
      </p>
      <div className="env-code-block">
        <code>VITE_SUPABASE_URL=https://your-project.supabase.co</code>
        <code>VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key</code>
      </div>
    </div>
  );
};

