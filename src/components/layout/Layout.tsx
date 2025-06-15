import React from 'react';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, header, className = '' }) => {
  return (
    <div className={`layout ${className}`.trim()}>
      {header && <div className="layout-header">{header}</div>}
      <main className="layout-main">
        {children}
      </main>
    </div>
  );
};

export default Layout;
