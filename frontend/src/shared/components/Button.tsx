import React, { ButtonHTMLAttributes } from 'react';
import { Icon } from './Icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
  icon?: string;
  iconSize?: number;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconSize = 12,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-pixel text-2xs tracking-wide uppercase px-4 py-3 border-[3px] border-earth-950 cursor-pointer inline-flex items-center gap-2 no-underline transition-transform duration-fast';
  
  const variantStyles = {
    primary: 'bg-accent text-paper shadow-2 hover:bg-accent-hover hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-3 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none',
    ghost: 'bg-transparent border-border-2 shadow-none hover:border-accent hover:text-accent hover:transform-none',
    danger: 'bg-danger text-paper border-earth-950 shadow-2 hover:opacity-90',
  };

  const sizeStyles = {
    sm: 'py-1.5 px-3 text-2xs shadow-1 border-2 hover:shadow-[3px_3px_0_#1a0f08]',
    md: '',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full justify-center' : ''} ${className}`}
      {...props}
    >
      {icon && <Icon name={icon} size={iconSize} />}
      {children}
    </button>
  );
};
