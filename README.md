# MilkFlow AI

**AI Powered Manufacturing Intelligence** — a bottleneck-identification dashboard for a milk manufacturing plant.

Built with React 18, Vite, Tailwind CSS, React Router, Recharts, Framer Motion, and Axios.

## Features

- **Dashboard** — 8 KPI cards (production, efficiency, OEE, bottlenecks, etc.) plus production trend, machine utilization, workflow completion and delay-trend charts.
- **Workflow Monitoring** — connected stage cards from Milk Collection through Dispatch, each with expected/actual time, delay, queue time, machine and operator; click a stage for full detail.
- **Bottleneck Analysis** — a sortable table of every stage's delay and root cause, with delay/queue/machine-load charts and an AI-explanation modal per row.
- **AI Predictions** — next expected bottleneck, failure probability, predicted delay, confidence score and queue length, with gauge charts, a risk trend line and a prediction timeline.
- **Machine Health** — per-machine health %, temperature, pressure, running hours, maintenance due date and failure risk, with animated progress bars.
- **Production Analytics** — daily/weekly production, shift and operator performance, a utilization heatmap, a product-mix pie chart and stacked output.
- **Feedback Analysis** — sentiment pie chart, complaint categories, a word-cloud placeholder, an AI summary card, sentiment trend and a recent-feedback table.
- **Reports** — daily/weekly/monthly/machine/feedback report cards with CSV, Excel and PDF export.
- **AI Chatbot** — chat UI with typing animation and suggested questions, calling `POST /api/chat` (with a built-in offline fallback so it always responds).
- **Settings** — theme, notifications, language, profile and API endpoint configuration.
- Light/dark theme toggle, fully responsive layout, and Framer Motion animation throughout (page transitions, cards, tables, charts, sidebar, loading skeletons, hover effects).

All data is realistic mock data for a milk plant, stored as JSON in `src/data/`. Every data-fetching function in `src/services/api.js` calls the configured API first and gracefully falls back to this bundled JSON if no backend is reachable — so the dashboard works fully standalone.

## Project structure

```
src/
  components/   Reusable UI (Sidebar, Navbar, KpiCard, Modal, GaugeChart, skeletons, ...)
  pages/        One file per sidebar route
  layouts/      MainLayout (sidebar + navbar + page-transition shell)
  hooks/        useTheme, useFetchData
  services/     api.js (Axios client + mock-data fallback)
  data/         workflow.json, production.json, machines.json, feedback.json, predictions.json, reports.json
  utils/        formatters.js, exportUtils.js
```

## Getting started locally

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Environment variables

Copy `.env.example` to `.env` and point it at your backend if you have one:

```
VITE_API_BASE_URL=https://your-api.example.com/api
```

If this isn't set (or the backend isn't reachable), the app automatically uses the bundled mock JSON in `src/data/` — no configuration is required to try it out.

## Building

```bash
npm run build
```

Outputs a static build to `dist/`, which is what gets deployed.

## Deploying to Render

This repo is ready to deploy on Render **without any modification**.

### Option A — using `render.yaml` (Blueprint)

1. Push this project to a GitHub/GitLab repo.
2. In Render, click **New → Blueprint** and point it at the repo. Render will read `render.yaml` and configure:
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`
   - A SPA rewrite rule so client-side routing works on refresh/deep links.
3. Click **Apply** and Render will build and deploy automatically.

### Option B — manual Static Site setup

1. In Render, click **New → Static Site** and connect the repo.
2. Set:
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
3. Add a rewrite rule under **Redirects/Rewrites**: source `/*` → destination `/index.html` (Rewrite), so deep links like `/machine-health` work.
4. (Optional) Add the environment variable `VITE_API_BASE_URL` under **Environment** if you have a real backend.
5. Click **Create Static Site**.

That's it — no code changes needed either way.

## Notes

- The AI Chatbot's `POST /api/chat` endpoint is called via Axios; when no backend is configured it falls back to a small built-in response engine so the page is fully interactive out of the box.
- Excel/CSV/PDF export on the Reports page is dependency-free: CSV and Excel are generated client-side, and PDF uses the browser's native print-to-PDF dialog.
