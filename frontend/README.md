# Matere Finance - Frontend

A personal finance tracking application with retro pixel aesthetics, built with React, TypeScript, Vite, and Tailwind CSS.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS
- **Zustand** - State management
- **Axios** - HTTP client with JWT interceptors
- **React Router 6** - Client-side routing
- **Vitest** - Testing framework

## Design System

### Retro Pixel Aesthetic
- **Backgrounds**: #e8d5af (paper), #f2e4c9 (lighter), #1a0f08 (ink)
- **Accent**: #b8491f (ember), #c79828 (wheat)
- **Fonts**: Silkscreen (headers), Pixelify Sans (UI), VT323 (monospace data), Newsreader (serif), Geist (modern sans)

### Components
All components use pixel-perfect styling with hard-offset shadows for a retro feel.

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Project Structure

```
frontend/
├── public/
│   ├── fonts/          # Custom web fonts
│   └── matere-mark.svg # App logo
├── src/
│   ├── api/
│   │   └── axios.ts    # Axios with JWT interceptors
│   ├── features/
│   │   ├── auth/       # Login, Register pages
│   │   ├── dashboard/  # Dashboard page
│   │   ├── transactions/
│   │   ├── categories/
│   │   ├── groups/
│   │   └── profile/
│   ├── shared/
│   │   └── components/ # Shared UI components
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── themeStore.ts
│   │   └── toastStore.ts
│   ├── types/
│   │   └── index.ts    # TypeScript interfaces
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css       # Global styles
```

## Features

- **Authentication**: JWT-based with httpOnly cookie refresh tokens
- **Dark/Paper Theme**: Toggle between warm dark and paper themes
- **Responsive Design**: Sidebar collapses on mobile
- **Protected Routes**: Auth guards for authenticated pages
- **Toast Notifications**: Success/error feedback

## Backend API

The frontend expects a FastAPI backend running on `http://localhost:8000`.
