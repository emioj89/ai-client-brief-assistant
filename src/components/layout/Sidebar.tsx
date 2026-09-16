import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} aria-hidden="true" />}
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__brand">
          <span className="brand-icon">🤖</span>
          <span className="brand-name">BriefAssistant</span>
        </div>

        <nav className="sidebar__nav" aria-label="Main Navigation">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `nav-item ${isActive ? 'nav-item--active' : ''}`}
            onClick={onClose}
          >
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/briefs/new"
            className={({ isActive }) => `nav-item ${isActive ? 'nav-item--active' : ''}`}
            onClick={onClose}
          >
            <span className="nav-icon">✨</span>
            <span>Analyze New Brief</span>
          </NavLink>
        </nav>

        <div className="sidebar__footer">
          <span className="version-tag">AI Assistant v1.0</span>
        </div>
      </aside>
    </>
  );
};

