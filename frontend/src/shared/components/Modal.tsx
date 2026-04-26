import React, { useEffect } from 'react';
import { Icon } from './Icon';

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  title,
  isOpen,
  onClose,
  children,
  footer,
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-[rgba(26,15,8,0.75)] z-[200] grid place-items-center p-6 animate-fade-in theme-paper:[--tw-bg-opacity:0.75]"
      onClick={onClose}
    >
      <div
        className="bg-bg-1 border-[3px] border-earth-950 shadow-[8px_8px_0_#1a0f08] max-w-[520px] w-full max-h-[90vh] overflow-y-auto theme-paper:bg-paper-2 theme-paper:border-earth-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 pb-3 border-b-2 border-border-1 flex justify-between items-center">
          <h3 className="font-display font-bold text-2xl tracking-tight m-0 text-fg-1">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="bg-none border-none cursor-pointer text-fg-muted hover:text-accent p-1"
          >
            <Icon name="close" size={14} />
          </button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          {children}
        </div>
        {footer && (
          <div className="px-5 py-4 border-t-2 border-border-1 flex justify-end gap-2.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
