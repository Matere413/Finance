import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'raised' | 'accent' | 'paper';
  padding?: 'sm' | 'md';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
}) => {
  const baseStyles = 'border-[3px] border-earth-950 shadow-2';
  
  const variantStyles = {
    default: 'bg-bg-1',
    raised: 'bg-bg-2',
    accent: 'bg-accent text-paper',
    paper: 'bg-paper text-ink border-earth-700 shadow-[4px_4px_0_#5a2e15]',
  };

  const paddingStyles = {
    sm: 'p-3',
    md: 'p-5',
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}>
      {children}
    </div>
  );
};

interface CardEyebrowProps {
  children: React.ReactNode;
  icon?: string;
}

export const CardEyebrow: React.FC<CardEyebrowProps> = ({ children, icon }) => {
  return (
    <div className="font-pixel text-2xs tracking-wide text-accent uppercase mb-2.5 flex items-center gap-2">
      {icon && <span>{icon}</span>}
      {children}
    </div>
  );
};

interface CardTitleProps {
  children: React.ReactNode;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children }) => {
  return (
    <h3 className="font-display font-bold text-xl tracking-wide m-0">
      {children}
    </h3>
  );
};
