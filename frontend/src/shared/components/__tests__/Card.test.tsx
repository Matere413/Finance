import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card, CardEyebrow, CardTitle } from '../Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeTruthy();
  });

  it('renders with default variant', () => {
    render(<Card>Default card</Card>);
    const card = document.querySelector('.bg-bg-1');
    expect(card).toBeTruthy();
  });

  it('renders with paper variant', () => {
    render(<Card variant="paper">Paper card</Card>);
    expect(screen.getByText('Paper card')).toBeTruthy();
  });

  it('renders with accent variant', () => {
    render(<Card variant="accent">Accent card</Card>);
    expect(screen.getByText('Accent card')).toBeTruthy();
  });

  it('renders CardEyebrow with text', () => {
    render(<CardEyebrow>Eyebrow text</CardEyebrow>);
    expect(screen.getByText('Eyebrow text')).toBeTruthy();
  });

  it('renders CardTitle with text', () => {
    render(<CardTitle>Title text</CardTitle>);
    expect(screen.getByText('Title text')).toBeTruthy();
  });
});
