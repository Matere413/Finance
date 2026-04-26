import React, { useState, useEffect } from 'react';
import { Icon } from '@components/Icon';
import { Card } from '@components/Card';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { useAuthStore } from '@stores/authStore';
import { useThemeStore } from '@stores/themeStore';
import { api } from '@api/axios';
import { useToastStore } from '@stores/toastStore';

export const ProfilePage: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const { addToast } = useToastStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.full_name || '',
        email: user.email || '',
      });
      setIsLoading(false);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await api.patch('/auth/me', {
        full_name: formData.fullName,
        email: formData.email,
      });
      setUser(response.data);
      addToast('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      return;
    }
    try {
      await api.delete('/auth/me');
      useAuthStore.getState().logout();
      window.location.href = '/login';
    } catch (err) {
      addToast('Failed to delete account');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="font-pixel text-lg animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-end mb-7 gap-6">
        <div>
          <div className="font-pixel text-xs tracking-widest text-accent uppercase mb-2.5">
            Account
          </div>
          <h1 className="font-display font-bold text-4xl text-fg-1 tracking-tight">
            Your settings.
          </h1>
          <p className="font-serif text-base text-fg-2 mt-2 italic">
            Simple, warm, yours.
          </p>
        </div>
      </div>

      {/* Profile Content */}
      <div className="grid grid-cols-2 gap-5">
        {/* Left Column - Profile Info */}
        <Card variant="paper">
          <div className="flex gap-4 items-center mb-5">
            <div
              className="w-18 h-18 bg-accent border-[3px] border-earth-950 grid place-items-center font-pixel text-3xl text-paper"
              style={{ width: '72px', height: '72px' }}
            >
              {formData.fullName.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <div className="font-serif italic font-semibold text-3xl text-earth-900">
                {formData.fullName || 'User'}
              </div>
              <div className="font-mono text-lg text-earth-700">
                {formData.email}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            {error && (
              <div className="bg-danger/10 border-2 border-danger p-3 text-danger font-mono text-sm">
                {error}
              </div>
            )}

            <Input
              label="Display name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="bg-paper-2 text-ink"
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-paper-2 text-ink"
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="self-start mt-1"
            >
              {isSubmitting ? 'Saving...' : 'Save changes'}
            </Button>
          </form>
        </Card>

        {/* Right Column */}
        <div className="flex flex-col gap-5">
          {/* Appearance Card */}
          <Card>
            <div className="font-pixel text-2xs tracking-wider text-accent uppercase mb-2 flex items-center gap-2">
              <Icon name="sun" size={10} /> Appearance
            </div>
            <div className="font-display font-bold text-xl tracking-tight">
              Theme
            </div>
            <div className="flex gap-0 border-[2.5px] border-border-2 w-fit mt-3.5">
              <button
                className={`px-4 py-2.5 font-pixel text-xs tracking-widest uppercase cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-accent text-paper'
                    : 'bg-bg-1 text-fg-2 hover:text-fg-1'
                }`}
                onClick={() => setTheme('dark')}
              >
                ● Dark
              </button>
              <button
                className={`px-4 py-2.5 font-pixel text-xs tracking-widest uppercase cursor-pointer ${
                  theme === 'paper'
                    ? 'bg-accent text-paper'
                    : 'bg-bg-1 text-fg-2 hover:text-fg-1'
                }`}
                onClick={() => setTheme('paper')}
              >
                ○ Paper
              </button>
            </div>
            <p className="font-serif italic text-base text-fg-2 mt-4">
              Dark is the hero direction. Paper is warm cream — for long ledger reading.
            </p>
          </Card>

          {/* Preferences Card */}
          <Card>
            <div className="font-pixel text-2xs tracking-wider text-accent uppercase mb-2 flex items-center gap-2">
              <Icon name="settings" size={10} /> Preferences
            </div>
            <div className="flex flex-col gap-2.5 mt-3.5 font-body text-sm text-fg-2">
              <label className="flex justify-between py-2 border-b border-dashed border-border-1">
                <span>Default currency</span>
                <b className="text-accent">USD</b>
              </label>
              <label className="flex justify-between py-2 border-b border-dashed border-border-1">
                <span>First day of month</span>
                <b className="text-fg-1">1st</b>
              </label>
              <label className="flex justify-between py-2 border-b border-dashed border-border-1">
                <span>Notifications</span>
                <b className="text-sage-500">Email only</b>
              </label>
              <label className="flex justify-between py-2">
                <span>Data export</span>
                <span className="text-accent cursor-pointer hover:text-accent-hover">
                  Download all (CSV)
                </span>
              </label>
            </div>
          </Card>

          {/* Delete Account */}
          <Button
            variant="ghost"
            className="text-danger border-danger self-start hover:bg-danger/10"
            icon="close"
            onClick={handleDeleteAccount}
          >
            Delete account
          </Button>
        </div>
      </div>
    </div>
  );
};
