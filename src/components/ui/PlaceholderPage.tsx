import React from 'react';
import './PlaceholderPage.css';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  comingSoon?: boolean;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  description,
  icon: Icon,
  comingSoon = false,
}) => {
  return (
    <div className="placeholder-page">
      <div className="placeholder-content">
        <div className="placeholder-icon">
          <Icon size={64} />
        </div>
        <h1 className="placeholder-title">{title}</h1>
        <p className="placeholder-description">{description}</p>
        {comingSoon && <div className="placeholder-badge">Coming Soon</div>}
      </div>
    </div>
  );
};

export default PlaceholderPage;
