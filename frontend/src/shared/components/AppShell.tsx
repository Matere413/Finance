import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Group } from '@types';
import { api } from '@api/axios';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const location = useLocation();
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    // Fetch user's groups
    const fetchGroups = async () => {
      try {
        const response = await api.get<Group[]>('/groups');
        setGroups(response.data);
      } catch (error) {
        console.error('Failed to fetch groups:', error);
      }
    };
    fetchGroups();
  }, []);

  // Get breadcrumb from current path
  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/') return ['Personal', 'Dashboard'];
    if (path === '/transactions') return ['Personal', 'Transactions'];
    if (path === '/categories') return ['Personal', 'Categories'];
    if (path === '/groups') return ['Shared', 'All groups'];
    if (path === '/profile') return ['Account', 'Profile'];
    return ['Personal'];
  };

  return (
    <div className="grid grid-cols-[240px_1fr] h-screen w-screen">
      <Sidebar groups={groups} />
      <main className="overflow-y-auto overflow-x-hidden flex flex-col relative bg-bg-0">
        <Topbar crumbs={getBreadcrumbs()} />
        <div className="p-8 flex-1 max-w-[1400px] w-full">
          {children}
        </div>
      </main>
    </div>
  );
};
