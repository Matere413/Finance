# Matere Finance

Personal and family finance management web app with a retro pixel aesthetic.

## Features

- **Authentication**: JWT with httpOnly cookies and automatic token refresh
- **Dashboard**: Financial overview with spending by category, recent transactions, and balance
- **Transactions**: Income and expense tracking with categories and filtering
- **Categories**: Custom categories with budgets and icons
- **Groups**: Family/shared expense tracking with member invitations
- **Design**: Retro pixel + earthy/burnt sunset aesthetic

## Stack

**Backend**
- FastAPI + SQLAlchemy 2.0 + Alembic
- SQLite (async aiosqlite) — can upgrade to PostgreSQL
- JWT auth with bcrypt and token rotation
- Repository pattern with dependency injection

**Frontend**
- React 18 + TypeScript + Vite
- Tailwind CSS with custom design system
- Zustand for state management
- React Router 6
- Axios with interceptors

**Testing**
- Backend: pytest + pytest-asyncio (173 tests)
- Frontend: Vitest + React Testing Library (16 tests)

## Quick Start

```bash
# Clone
git clone https://github.com/Matere413/Finance.git
cd Finance

# Backend
cd backend
uv sync
uv run alembic upgrade head
uv run fastapi dev src/main.py

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
backend/
  src/features/     # auth, categories, transactions, groups, dashboard
  tests/            # unit + integration tests
  alembic/          # migrations

frontend/
  src/features/     # page components
  src/shared/       # UI components, stores, API
  src/stores/       # Zustand stores
```

## License

MIT
