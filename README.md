# Finance App

Web app de manejo financiero personal y familiar.

## Stack

- **Backend**: FastAPI (Python) — arquitectura hexagonal, feature-first
- **Frontend**: React (TypeScript) — feature-first, Atomic Design
- **Base de datos**: PostgreSQL
- **Auth**: JWT (access token en memoria + refresh token httpOnly cookie)

## Desarrollo

```bash
# Backend
cd backend
uv sync
uv run fastapi dev src/main.py

# Frontend
cd frontend
pnpm install
pnpm dev
```

## Arquitectura

Proyecto estructurado con **SDD (Spec-Driven Development)** — cada feature parte de una especificación antes de escribir una línea de código.
