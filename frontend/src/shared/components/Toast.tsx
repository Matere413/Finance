import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  onDone: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, onDone, duration = 2400 }) => {
  useEffect(() => {
    const timer = setTimeout(onDone, duration);
    return () => clearTimeout(timer);
  }, [onDone, duration]);

  return (
    <div className="bg-earth-950 text-earth-50 border-[2.5px] border-accent shadow-[3px_3px_0_#7a2e15] py-3 px-4 font-mono text-base flex items-center gap-2.5 animate-toast-in">
      <span className="text-sage-300 font-bold">✓</span> {message}
    </div>
  );
};

interface ToastContainerProps {
  toasts: Array<{ id: string; message: string }>;
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] flex flex-col gap-2.5">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          onDone={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
};
