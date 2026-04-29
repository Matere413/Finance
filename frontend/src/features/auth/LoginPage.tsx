import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { useAuthStore } from '@stores/authStore';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, error, clearError } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setIsLoading(true);

    try {
      await login({
        email: formData.email,
        password: formData.password,
      });
      navigate('/');
    } catch {
      // Error is handled by the store
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-2">
      {/* Poster Side */}
      <div
        className="bg-accent text-paper p-16 flex flex-col justify-between border-r-4 border-earth-950 relative overflow-hidden crt grain"
      >
        <div>
          <div className="flex items-center gap-3 mb-10">
            <img
              src="/matere-mark.svg"
              className="w-10 h-10 pixelated brightness-0 invert"
              alt="Matere"
            />
            <span className="font-pixel text-base tracking-widest text-paper">
              MATERE · FIN
            </span>
          </div>
          <div className="font-pixel text-xs tracking-widest text-paper opacity-80 mb-6">
            — V 0.1 · APRIL 2026
          </div>
          <h1 className="font-display font-bold text-7xl leading-[0.95] tracking-tight text-paper">
            Dinero<br />con alma<br />retro.
          </h1>
          <p className="font-serif italic text-xl mt-6 opacity-92 max-w-md leading-relaxed">
            Registra gastos personales y presupuestos familiares. Hecho un píxel a la vez, con cuidado por el detalle.
          </p>
        </div>
        <div className="flex items-center gap-2.5 font-mono text-lg text-paper">
          <span className="w-2.5 h-2.5 border-2 border-earth-950 bg-[#7a9a4a] animate-pulse" />
          <span>Secure · JWT · Self-hosted</span>
        </div>
        <svg
          className="absolute -right-10 -bottom-10 w-80 h-80 opacity-[0.18]"
          viewBox="0 0 16 16"
          shapeRendering="crispEdges"
          fill="#1a0f08"
        >
          <path d="M7 2 H9 V3 H11 V4 H12 V5 H13 V7 H14 V9 H13 V11 H12 V12 H11 V13 H9 V14 H7 V13 H5 V12 H4 V11 H3 V9 H2 V7 H3 V5 H4 V4 H5 V3 H7 Z M7 4 V5 H5 V7 H4 V9 H5 V11 H7 V12 H9 V11 H11 V9 H12 V7 H11 V5 H9 V4 Z" />
        </svg>
      </div>

      {/* Form Side */}
      <div className="grid place-items-center p-12 bg-bg-0">
        <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-5">
          <h2 className="font-display font-bold text-4xl text-fg-1 tracking-tight mb-1">
            Welcome back.
          </h2>
          <p className="font-serif text-base text-fg-2 italic mb-5">
            Sign in to pick up where you left off.
          </p>

        {/* Auth mode switcher - matching handoff design */}
        <div className="flex border-2 border-border-2 mb-4">
          <Link
            to="/login"
            className="flex-1 py-3 bg-accent text-paper font-pixel text-xs tracking-widest uppercase cursor-pointer text-center border-r-2 border-border-2 hover:bg-accent-hover transition-colors"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="flex-1 py-3 bg-bg-1 font-pixel text-xs tracking-widest uppercase text-fg-2 cursor-pointer text-center hover:bg-bg-2 hover:text-fg-1 transition-colors"
          >
            Sign up
          </Link>
        </div>

          {error && (
            <div className="bg-danger/10 border-2 border-danger p-3 text-danger font-mono text-sm">
              {error}
            </div>
          )}

          <Input
            label="Email"
            type="email"
            placeholder="you@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

      <div className="flex items-center font-mono text-sm text-fg-muted">
        <label className="cursor-pointer flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.rememberMe}
            onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
            className="accent-accent"
          />
          Remember me
        </label>
      </div>

      <Button type="submit" fullWidth disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>
        </form>
      </div>
    </div>
  );
};
