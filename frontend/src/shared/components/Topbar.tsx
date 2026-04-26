import React from 'react';
import { Icon } from './Icon';
import { useThemeStore } from '@stores/themeStore';

interface TopbarProps {
  crumbs: string[];
}

export const Topbar: React.FC<TopbarProps> = ({ crumbs }) => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="flex items-center justify-between py-4 px-8 border-b-2 border-border-1 bg-bg-0 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <div className="font-pixel text-2xs tracking-wider text-fg-muted uppercase">
          {crumbs.map((c, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="text-fg-muted opacity-40 mx-2">/</span>}
              <span className={i === crumbs.length - 1 ? 'text-fg-1' : ''}>{c}</span>
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-2 font-mono text-md text-fg-muted">
          <span className="w-2.5 h-2.5 border-2 border-earth-950 bg-[#7a9a4a] animate-pulse" />
          APR · 2026
        </div>
        <button
          className={`w-9 h-9 border-2 cursor-pointer grid place-items-center transition-all duration-fast ${
            theme === 'dark'
              ? 'bg-accent text-paper border-earth-950 shadow-[2px_2px_0_#1a0f08]'
              : 'bg-bg-1 border-border-2 text-fg-2 hover:text-accent hover:border-accent'
          }`}
          title="Theme"
          onClick={toggleTheme}
        >
          <Icon name={theme === 'dark' ? 'moon' : 'sun'} size={16} />
        </button>
      </div>
    </div>
  );
};
