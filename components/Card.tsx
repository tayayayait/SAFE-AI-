import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, subtitle, children, className = '', actions }) => {
  return (
    <div className={`bg-bg-surface rounded-md shadow-sm border border-border-default p-4 flex flex-col ${className}`}>
      {(title || actions) && (
        <div className="flex justify-between items-start mb-4">
          <div>
            {title && <h3 className="text-base font-bold text-text-primary">{title}</h3>}
            {subtitle && <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, unit, icon }) => {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-text-secondary">{label}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-text-primary">{value}</span>
            {unit && <span className="text-xs text-text-secondary">{unit}</span>}
          </div>
        </div>
        {icon && <div className="text-primary opacity-80">{icon}</div>}
      </div>
    </Card>
  );
};