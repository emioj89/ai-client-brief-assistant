import React from 'react';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: string;
  subtext?: string;
  badgeType?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  icon,
  subtext,
  badgeType = 'default',
}) => {
  return (
    <div className={`kpi-card kpi-card--${badgeType}`}>
      <div className="kpi-card__header">
        <span className="kpi-card__title">{title}</span>
        <span className="kpi-card__icon" aria-hidden="true">
          {icon}
        </span>
      </div>
      <div className="kpi-card__value">{value}</div>
      {subtext && <div className="kpi-card__subtext">{subtext}</div>}
    </div>
  );
};

