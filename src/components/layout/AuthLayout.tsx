import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguageContext } from '../../contexts';
import { Card } from '../ui';
import '../../pages/LoginPage.css'; // Reuse existing styles

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footerText: string;
  footerLinkText: string;
  footerLinkTo: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkTo,
}) => {
  const { translations } = useLanguageContext();

  return (
    <div className="auth-container">
      <div className="auth-background"></div>
      <div className="auth-content">
        <div className="auth-form-container">
          <div className="auth-brand">
            <div className="auth-brand-icon">💰</div>
            <h1 className="auth-brand-title">{translations.app.title}</h1>
          </div>

          <div className="auth-header">
            <h2 className="auth-title">{title}</h2>
            <p className="auth-subtitle">{subtitle}</p>
          </div>

          <Card className="auth-card">
            {children}

            <div className="auth-footer">
              <p className="auth-switch">
                {footerText}{' '}
                <Link to={footerLinkTo} className="auth-link">
                  {footerLinkText}
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
