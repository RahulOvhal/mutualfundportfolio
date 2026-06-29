# Portfolio Dashboard

A modern React + TypeScript + Vite application for viewing investor portfolio summaries, tracking scheme-level holdings, and exporting reports.

## Overview

This project is a client-side portfolio dashboard that uses a local JSON data source to display investor portfolios with summary metrics and detail views.

Key capabilities include:

- Demo authentication with protected routes
- Investor portfolio overview with XIRR, gain/loss, and current value
- Investor detail pages with charts and scheme-level holdings
- PDF report export for portfolio summaries
- Error boundary handling for graceful UI recovery

## Demo Login

Use the following credentials to access the application:

- Email: `demo@portfolio.com`
- Password: `Portfolio@123`

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the app in your browser at:

```text
http://localhost:5173
```

## Available Scripts

- `npm run dev` � Start Vite development server
- `npm run build` � Build production assets
- `npm run preview` � Preview production build locally
- `npm run lint` � Run ESLint on `.ts` and `.tsx` files
- `npm run test` � Run Vitest
- `npm run test:coverage` � Run tests with coverage

## Project Structure

- `src/main.tsx` � Entry point and root render
- `src/App.tsx` � Provider wrapping, routes, and app shell
- `src/pages/Login/Login.tsx` � Demo login experience
- `src/pages/Dashboard/Dashboard.tsx` � Portfolio overview
- `src/pages/InvestorDetails/InvestorDetails.tsx` � Investor-level analytics
- `src/features/portfolio/portfolioSlice.ts` � Portfolio state and data normalization
- `src/features/auth/authSlice.ts` � Authentication state
- `src/store` � Redux store configuration
- `src/data/portfolio.json` � Local portfolio dataset

## Data and Behavior

The application loads local portfolio data from `src/data/portfolio.json` and computes:

- invested amount
- current portfolio value
- absolute gain/loss
- XIRR
- scheme holdings per investor

## Tech Stack

- React
- TypeScript
- Vite
- Redux Toolkit
- React Router DOM
- Tailwind CSS
- Recharts
- jsPDF + jsPDF AutoTable
- React Hook Form
- Zod
- Sonner

## Notes

- Authentication is simulated via hard-coded demo credentials.
- The app is designed for prototype and internal review purposes.
- Data is loaded from a local JSON file rather than a production API.
