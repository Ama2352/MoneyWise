import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './AppLayout.css';
import AppHeader from './AppHeader';

const AppLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="app-layout">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="app-layout__overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`app-layout__sidebar ${mobileMenuOpen ? 'app-layout__sidebar--mobile-open' : ''}`}
      >
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggle={handleSidebarToggle}
        />
      </div>

      {/* Main content area */}
      <div
        className={`app-layout__main ${sidebarCollapsed ? 'app-layout__main--expanded' : ''}`}
      >
        {' '}
        <AppHeader
          onMobileMenuToggle={handleMobileMenuToggle}
          sidebarCollapsed={sidebarCollapsed}
        />
        <main className="app-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
