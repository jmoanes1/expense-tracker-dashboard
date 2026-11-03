# FinTrack — Expense Tracker Dashboard

A modern, responsive expense tracking dashboard built with React, Tailwind CSS, Recharts, and Lucide icons.
Frontend-only: all data and preferences are persisted to `localStorage`.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (default `http://localhost:5173`).

## Features

- **Dashboard** — summary cards (balance, income, expenses, savings), monthly income vs expenses bar chart, category donut breakdown, recent transactions.
- **Transactions** — full CRUD with search, filters (type, category, payment method, date range), sorting, and pagination.
- **Expenses / Income** — focused views with category breakdown, monthly summaries, and budget tracking.
- **Reports** — yearly totals, savings trend chart, monthly summary table, top expenses, all-time category ranking.
- **Settings** — profile, light/dark theme, currency, opening balance, monthly budget, JSON export, sample data restore, clear all data.
- **Responsive** — sidebar collapses into a drawer menu on mobile; charts, cards, and tables adapt to small screens.
- **Dark mode** — toggle in the header or Settings; preference is remembered.

## Tech stack

| Purpose | Library |
| --- | --- |
| UI | React 18 (functional components + hooks) |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Icons | Lucide React |
| Routing | React Router |

## Project structure

```
src/
  components/
    charts/        Chart tooltip shared by all charts
    dashboard/     Summary cards, bar chart, donut, recent transactions
    layout/        App shell, sidebar, header
    transactions/  Form modal, filters, table, list view
    ui/            Reusable primitives (Button, Card, Modal, Field, Toast…)
  context/         Prefs + Transactions providers (localStorage persistence)
  hooks/           useTransactionManager (filters, pagination, CRUD state)
  lib/             categories, formatting, stats, seed data, storage
  pages/           Dashboard, Transactions, Expenses, Income, Reports, Settings
```

Data is seeded with ~7 months of realistic sample transactions on first launch.
