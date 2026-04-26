import React from 'react';
import { Icon } from './Icon';

interface ChipProps {
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  icon?: string;
  variant?: 'default' | 'income' | 'expense' | 'featured';
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  children,
  isActive = false,
  onClick,
  icon,
  variant = 'default',
  className = '',
}) => {
  const baseStyles = 'font-pixel text-2xs tracking-wide uppercase py-1.5 px-2.5 border-2 border-border-2 cursor-pointer inline-flex items-center gap-1.5';
  
  const variantStyles = {
    default: 'bg-bg-2 text-fg-2 hover:border-accent hover:text-fg-1',
    income: 'bg-sage-500 text-paper border-earth-950',
    expense: 'bg-earth-800 text-earth-200',
    featured: 'bg-wheat-500 text-earth-950 border-earth-950',
  };

  const activeStyles = isActive
    ? 'bg-accent text-paper border-earth-950'
    : variantStyles[variant];

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${activeStyles} ${className}`}
    >
      {icon && <Icon name={icon} size={10} />}
      {children}
    </button>
  );
};
