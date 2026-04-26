import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, TokenResponse, LoginCredentials, RegisterCredentials } from '@types';
import { api } from '@api/axios';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setAccessToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setAccessToken: (token) => {
        set({ accessToken: token, isAuthenticated: !!token });
      },

      setUser: (user) => {
        set({ user });
      },

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const formData = new URLSearchParams();
          formData.append('username', credentials.email);
          formData.append('password', credentials.password);

          const response = await api.post<TokenResponse>('/auth/login', formData, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          });

          set({
            accessToken: response.data.access_token,
            isAuthenticated: true,
            isLoading: false,
          });

          // Fetch user info
          await get().fetchUser();
        } catch (error) {
          set({
            error: 'Invalid credentials. Please try again.',
            isLoading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      register: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<User>('/auth/register', credentials);
          set({ user: response.data, isLoading: false });
          // After registration, login
          await get().login({
            email: credentials.email,
            password: credentials.password,
          });
        } catch (error) {
          set({
            error: 'Registration failed. Email may already be in use.',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
        } finally {
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      fetchUser: async () => {
        try {
          const response = await api.get<User>('/auth/me');
          set({ user: response.data });
        } catch (error) {
          // If fetching user fails, we're not authenticated
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
