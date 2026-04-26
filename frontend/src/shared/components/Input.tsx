import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: 'default' | 'money';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  variant = 'default',
  className = '',
  ...props
}) => {
  const baseStyles = 'bg-bg-0 border-[2.5px] border-border-2 text-fg-1 py-2.5 px-3.5 font-body text-base outline-none transition-colors duration-fast focus:border-accent w-full';
  const moneyStyles = variant === 'money' ? 'font-display font-bold text-2xl tracking-tight' : '';

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="font-pixel text-2xs tracking-wide text-fg-2 uppercase">
          {label}
        </label>
      )}
      <input
        className={`${baseStyles} ${moneyStyles} ${error ? 'border-danger' : ''} ${className}`}
        {...props}
      />
      {error && (
        <span className="text-danger font-mono text-sm">{error}</span>
      )}
    </div>
  );
};
