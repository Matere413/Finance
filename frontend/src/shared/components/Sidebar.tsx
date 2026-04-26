import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from './Icon';
import { Avatar } from './Avatar';
import { useAuthStore } from '@stores/authStore';
import { Group } from '@types';

interface SidebarProps {
  groups: Group[];
}

export const Sidebar: React.FC<SidebarProps> = ({ groups }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [ctx, setCtx] = useState<'personal' | string>('personal');
  const currentPath = location.pathname;

  const personalItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'home', path: '/' },
    { id: 'transactions', label: 'Transactions', icon: 'book', path: '/transactions' },
    { id: 'categories', label: 'Categories', icon: 'folder', path: '/categories' },
  ];

  const sharedItems = [
    { id: 'groups', label: 'All groups', icon: 'folder', path: '/groups' },
    { id: 'profile', label: 'Profile', icon: 'user', path: '/profile' },
  ];

  const currentGroup = groups.find((g) => g.id.toString() === ctx);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getInitial = (name: string) => name.charAt(0).toUpperCase();

  return (
    <aside className="bg-bg-1 border-r-[3px] border-earth-950 flex flex-col relative z-[2] h-screen theme-paper:border-earth-700 theme-paper:bg-bg-2">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 py-4 pb-4 border-b-2 border-border-1">
        <img
          src="/matere-mark.svg"
          className="w-7 h-7 pixelated"
          alt="Matere"
        />
        <span className="font-pixel text-sm tracking-wider text-fg-1">
          MATERE · FIN
        </span>
        <span className="ml-auto font-pixel text-2xs tracking-wider text-accent px-1.5 py-1 border-2 border-accent">
          V0.1
        </span>
      </div>

      {/* Context Switcher */}
      <div className="p-4 border-b-2 border-border-1">
        <div className="font-pixel text-2xs tracking-wider text-fg-muted uppercase mb-2">
          Context
        </div>
        <div className="flex flex-col gap-1">
          <button
            className={`flex items-center gap-2.5 py-2.5 px-3 border-2 cursor-pointer font-pixel text-2xs tracking-wider text-fg-2 uppercase transition-all duration-fast hover:border-border-2 hover:text-fg-1 ${
              ctx === 'personal'
                ? 'bg-accent text-paper border-earth-950 shadow-[2px_2px_0_#1a0f08]'
                : 'bg-bg-2 border-border-1'
            }`}
            onClick={() => {
              setCtx('personal');
              navigate('/');
            }}
          >
            <span
              className="w-[18px] h-[18px] flex-shrink-0 border-[1.5px] border-earth-950"
              style={{ background: '#b8491f' }}
            />
            Personal
          </button>
          {groups.map((g) => (
            <button
              key={g.id}
              className={`flex items-center gap-2.5 py-2.5 px-3 border-2 cursor-pointer font-pixel text-2xs tracking-wider text-fg-2 uppercase transition-all duration-fast hover:border-border-2 hover:text-fg-1 ${
                ctx === g.id.toString()
                  ? 'bg-accent text-paper border-earth-950 shadow-[2px_2px_0_#1a0f08]'
                  : 'bg-bg-2 border-border-1'
              }`}
              onClick={() => {
                setCtx(g.id.toString());
                navigate('/');
              }}
            >
              <span
                className="w-[18px] h-[18px] flex-shrink-0 border-[1.5px] border-earth-950"
                style={{ background: g.color }}
              />
              <span className="truncate">{g.name}</span>
              <span className="ml-auto font-mono text-sm opacity-80">
                {g.member_count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="py-3 px-3 flex flex-col gap-0.5 flex-1">
        {ctx === 'personal' ? (
          <>
            <div className="font-pixel text-2xs tracking-wider text-fg-muted uppercase py-3 px-2.5 pb-1.5">
              Personal
            </div>
            {personalItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center gap-3 py-2.5 px-3 border-2 text-left transition-all duration-fast hover:text-fg-1 hover:bg-bg-2 ${
                  currentPath === item.path
                    ? 'bg-bg-2 border-earth-950 text-fg-1 shadow-[2px_2px_0_#1a0f08] -translate-x-px -translate-y-px before:content-[">"] before:text-accent before:font-pixel before:font-bold'
                    : 'bg-transparent border-transparent text-fg-2'
                }`}
              >
                <Icon name={item.icon} size={16} />
                <span className="font-pixel text-2xs tracking-wider uppercase">
                  {item.label}
                </span>
              </Link>
            ))}
          </>
        ) : (
          <>
            <div className="font-pixel text-2xs tracking-wider text-fg-muted uppercase py-3 px-2.5 pb-1.5">
              {currentGroup?.name}
            </div>
            <Link
              to="/"
              className={`flex items-center gap-3 py-2.5 px-3 border-2 text-left transition-all duration-fast hover:text-fg-1 hover:bg-bg-2 ${
                currentPath === '/'
                  ? 'bg-bg-2 border-earth-950 text-fg-1 shadow-[2px_2px_0_#1a0f08] -translate-x-px -translate-y-px before:content-[">"] before:text-accent before:font-pixel before:font-bold'
                  : 'bg-transparent border-transparent text-fg-2'
              }`}
            >
              <Icon name="home" size={16} />
              <span className="font-pixel text-2xs tracking-wider uppercase">
                Group dash
              </span>
            </Link>
          </>
        )}

        <div className="font-pixel text-2xs tracking-wider text-fg-muted uppercase py-3 px-2.5 pb-1.5 mt-3">
          General
        </div>
        {sharedItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`flex items-center gap-3 py-2.5 px-3 border-2 text-left transition-all duration-fast hover:text-fg-1 hover:bg-bg-2 ${
              currentPath === item.path
                ? 'bg-bg-2 border-earth-950 text-fg-1 shadow-[2px_2px_0_#1a0f08] -translate-x-px -translate-y-px before:content-[">"] before:text-accent before:font-pixel before:font-bold'
                : 'bg-transparent border-transparent text-fg-2'
            }`}
          >
            <Icon name={item.icon} size={16} />
            <span className="font-pixel text-2xs tracking-wider uppercase">
              {item.label}
            </span>
          </Link>
        ))}
      </nav>

      {/* User Footer */}
      <div
        className="py-3.5 px-4 border-t-2 border-border-1 flex items-center gap-2.5 cursor-pointer hover:bg-bg-2"
        onClick={() => navigate('/profile')}
      >
        <div className="w-8 h-8 bg-accent border-2 border-earth-950 pixelated grid place-items-center font-pixel text-xs text-paper">
          {user?.full_name ? getInitial(user.full_name) : 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display font-bold text-sm text-fg-1 truncate">
            {user?.full_name || 'User'}
          </div>
          <div className="font-mono text-sm text-fg-muted truncate">
            {user?.email}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleLogout();
          }}
          className="w-9 h-9 bg-bg-1 border-2 border-border-2 text-fg-2 cursor-pointer grid place-items-center transition-all duration-fast hover:text-accent hover:border-accent"
          title="Sign out"
        >
          <Icon name="external" size={14} color="#8a6a4a" />
        </button>
      </div>
    </aside>
  );
};
