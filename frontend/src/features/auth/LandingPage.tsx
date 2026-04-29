import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@components/Button';
import { Icon } from '@components/Icon';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen grid grid-cols-2">
      {/* Poster Side */}
      <div className="bg-accent text-paper p-16 flex flex-col justify-between border-r-4 border-earth-950 relative overflow-hidden">
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
        
        {/* CTA Buttons on poster side */}
        <div className="flex flex-col gap-4 max-w-xs">
          <Link to="/login">
            <Button variant="primary" fullWidth size="lg" icon="arrow_right">
              Iniciar Sesión
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="ghost" fullWidth size="lg">
              Crear Cuenta
            </Button>
          </Link>
        </div>
        
        <div className="flex items-center gap-2.5 font-mono text-lg text-paper">
          <span className="w-2.5 h-2.5 border-2 border-earth-950 bg-[#7a9a4a] animate-pulse" />
          <span>Secure · JWT · Self-hosted</span>
        </div>
        
        {/* Decorative SVG */}
        <svg
          className="absolute -right-10 -bottom-10 w-80 h-80 opacity-[0.18]"
          viewBox="0 0 16 16"
          shapeRendering="crispEdges"
          fill="#1a0f08"
        >
          <path d="M7 2 H9 V3 H11 V4 H12 V5 H13 V7 H14 V9 H13 V11 H12 V12 H11 V13 H9 V14 H7 V13 H5 V12 H4 V11 H3 V9 H2 V7 H3 V5 H4 V4 H5 V3 H7 Z M7 4 V5 H5 V7 H4 V9 H5 V11 H7 V12 H9 V11 H11 V9 H12 V7 H11 V5 H9 V4 Z" />
        </svg>
      </div>

      {/* Right Side - Features */}
      <div className="bg-bg-0 p-16 flex flex-col justify-center">
        <h2 className="font-display font-bold text-3xl text-fg-1 mb-8">
          ¿Qué podés hacer?
        </h2>
        
        <div className="grid gap-6">
          <div className="flex items-start gap-4 p-4 border-2 border-border-1 bg-bg-1">
            <div className="w-10 h-10 bg-accent flex items-center justify-center">
              <Icon name="book" size={20} color="#f2e4c9" />
            </div>
            <div>
              <h3 className="font-pixel text-sm text-fg-1 mb-1">Registrar transacciones</h3>
              <p className="font-sans text-sm text-fg-2">Ingresos y gastos con categorías y presupuestos.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 border-2 border-border-1 bg-bg-1">
            <div className="w-10 h-10 bg-wheat-500 flex items-center justify-center">
              <Icon name="folder" size={20} color="#1a0f08" />
            </div>
            <div>
              <h3 className="font-pixel text-sm text-fg-1 mb-1">Organizar categorías</h3>
              <p className="font-sans text-sm text-fg-2">Personalizá tus categorías con iconos y presupuestos.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 border-2 border-border-1 bg-bg-1">
            <div className="w-10 h-10 bg-sage-500 flex items-center justify-center">
              <Icon name="user" size={20} color="#f2e4c9" />
            </div>
            <div>
              <h3 className="font-pixel text-sm text-fg-1 mb-1">Grupos familiares</h3>
              <p className="font-sans text-sm text-fg-2">Compartí gastos con tu familia o roommates.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 border-2 border-border-1 bg-bg-1">
            <div className="w-10 h-10 bg-ember-500 flex items-center justify-center">
              <Icon name="terminal" size={20} color="#f2e4c9" />
            </div>
            <div>
              <h3 className="font-pixel text-sm text-fg-1 mb-1">Dashboard completo</h3>
              <p className="font-sans text-sm text-fg-2">Visualizá tu balance, gastos por categoría y más.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
