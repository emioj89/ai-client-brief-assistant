import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { UnconfiguredState } from '../ui/UnconfiguredState';
import { useAuth } from '../../context/AuthContext';

export const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isConfigured } = useAuth();

  return (
    <div className="app-container">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="app-content-wrapper">
        <Header onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />
        <main className="main-content">
          {!isConfigured ? <UnconfiguredState /> : <Outlet />}
        </main>
      </div>
    </div>
  );
};

