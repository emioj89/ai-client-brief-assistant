import React from 'react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, signOut } = useAuth();

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          type="button"
          className="sidebar-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>
        <h1 className="header-title">AI Brief Assistant</h1>
      </div>

      <div className="header-right">
        {user && (
          <div className="user-profile">
            <span className="user-email" title={user.email || undefined}>
              {user.email}
            </span>
            <button
              type="button"
              className="btn btn--outline btn--sm"
              onClick={signOut}
              aria-label="Sign out of your account"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

