import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@stores/authStore';
import { useThemeStore } from '@stores/themeStore';
import { LandingPage } from '@features/auth/LandingPage';
import { LoginPage } from '@features/auth/LoginPage';
import { RegisterPage } from '@features/auth/RegisterPage';
import { DashboardPage } from '@features/dashboard/DashboardPage';
import { TransactionsPage } from '@features/transactions/TransactionsPage';
import { CategoriesPage } from '@features/categories/CategoriesPage';
import { GroupsPage } from '@features/groups/GroupsPage';
import { ProfilePage } from '@features/profile/ProfilePage';
import { AppShell } from '@components/AppShell';
import { ProtectedRoute } from '@components/ProtectedRoute';
import { ToastContainer } from '@components/Toast';
import { useToastStore } from '@stores/toastStore';

function App() {
  const { isAuthenticated, fetchUser } = useAuthStore();
  const { theme } = useThemeStore();
  const { toasts, removeToast } = useToastStore();
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Check if user is already authenticated on mount
    const init = async () => {
      if (useAuthStore.getState().accessToken) {
        try {
          await fetchUser();
        } catch {
          // User not authenticated
        }
      }
      setIsLoading(false);
    };
    init();
  }, [fetchUser]);

  // Apply theme to body
  useEffect(() => {
    document.body.classList.toggle('theme-paper', theme === 'paper');
    document.body.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-0 text-fg-1">
        <div className="font-pixel text-lg animate-pulse">Loading...</div>
      </div>
    );
  }

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className={`min-h-screen ${isAuthPage || !isAuthenticated ? '' : 'app-shell'}`}>
      <Routes>
        {/* Public routes - redirect / to login when not authenticated */}
        <Route path="/" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        } />
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
        } />
        <Route path="/register" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />
        } />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <AppShell><DashboardPage /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="/transactions" element={
          <ProtectedRoute>
            <AppShell><TransactionsPage /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="/categories" element={
          <ProtectedRoute>
            <AppShell><CategoriesPage /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="/groups" element={
          <ProtectedRoute>
            <AppShell><GroupsPage /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <AppShell><ProfilePage /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default App;
