# Progress and Decisions

## Decision Log

- Initialized monorepo-style project with `frontend/`, `backend/`, `database/`, `docs/`, and `scripts/`.
- Chose custom Tailwind components instead of shadcn setup for the smallest safe runnable start.
- Used sample data in both frontend fallback and backend services.
- Deferred auth, ML, ETL, exports, and full CRUD.
- Used an npm `overrides.postcss` pin so the fresh Next.js install passes `npm audit`.

## Why Vercel + Railway

Vercel gives a simple deployment path for Next.js. Railway can host the FastAPI backend and PostgreSQL database with minimal infrastructure overhead.

## Why FastAPI

FastAPI is Python-native, typed with Pydantic, fast to develop, and keeps a clear path toward future analytics and data engineering work.

## Why Next.js

Next.js gives a production-friendly React structure, TypeScript support, routing, and an easy Vercel deployment path.

## Why No ML Initially

The initial product needs clean sales, stock, and product data first. Rule-based recommendations are a better first step until enough real transaction history exists.

## Why Auth Is Deferred

Auth adds security and product complexity. The starter implementation focuses on making the core data flow and UI direction runnable first.

## Why Sample Data

Sample data makes the dashboard useful early while keeping the backend and database integration simple and safe.
