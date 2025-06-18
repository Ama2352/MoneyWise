import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './DashboardLayout.css';
import DashboardHeader from './DashboardHeader';

const DashboardLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="dashboard-layout">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="dashboard-layout__overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`dashboard-layout__sidebar ${mobileMenuOpen ? 'dashboard-layout__sidebar--mobile-open' : ''}`}
      >
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggle={handleSidebarToggle}
        />
      </div>

      {/* Main content area */}
      <div
        className={`dashboard-layout__main ${sidebarCollapsed ? 'dashboard-layout__main--expanded' : ''}`}
      >
        <DashboardHeader
          onMobileMenuToggle={handleMobileMenuToggle}
          sidebarCollapsed={sidebarCollapsed}
        />

        <main className="dashboard-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
