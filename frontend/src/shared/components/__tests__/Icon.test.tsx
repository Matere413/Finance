import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Icon } from '../Icon';

describe('Icon', () => {
  it('renders with correct name', () => {
    render(<Icon name="home" />);
    const svg = document.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('renders with custom size', () => {
    render(<Icon name="home" size={32} />);
    const svg = document.querySelector('svg');
    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('height', '32');
  });

  it('renders with custom color', () => {
    render(<Icon name="home" color="#ff0000" />);
    const svg = document.querySelector('svg');
    expect(svg).toHaveAttribute('fill', '#ff0000');
  });

  it('returns null for unknown icon', () => {
    const { container } = render(<Icon name="unknown" />);
    expect(container.firstChild).toBeNull();
  });
});
