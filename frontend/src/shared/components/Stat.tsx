import React from 'react';
import { Icon } from './Icon';
import { Card } from './Card';

interface StatProps {
  eyebrow: React.ReactNode;
  value: string;
  currency?: string;
  delta?: string;
  deltaDir?: 'up' | 'down';
  variant?: 'default' | 'success' | 'danger' | 'ember';
  hideMoney?: boolean;
}

export const Stat: React.FC<StatProps> = ({
  eyebrow,
  value,
  currency = '$',
  delta,
  deltaDir = 'up',
  variant = 'default',
  hideMoney = false,
}) => {
  const valueColor = {
    default: 'text-fg-1',
    success: 'text-sage-500 dark:text-sage-500',
    danger: 'text-danger',
    ember: 'text-accent',
  }[variant];

  const deltaColor = deltaDir === 'up' ? 'text-sage-500' : 'text-danger';
  const deltaIcon = deltaDir === 'up' ? '▲' : '▼';

  return (
    <Card>
      <div className="font-pixel text-2xs tracking-wide text-fg-muted uppercase flex items-center gap-2 mb-3.5">
        {eyebrow}
      </div>
      <div className={`font-display font-bold text-4xl leading-none tracking-tight flex items-baseline gap-1.5 ${valueColor}`}>
        <span className="text-xl text-fg-muted font-normal">{currency}</span>
        <span className={hideMoney ? 'money-hidden' : ''}>{value}</span>
      </div>
      {delta && (
        <div className={`mt-2.5 font-mono text-md ${deltaColor}`}>
          <span>{deltaIcon} {delta}</span>
        </div>
      )}
    </Card>
  );
};
