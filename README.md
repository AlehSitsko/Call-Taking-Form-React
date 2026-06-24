# EMS Workflow System — Demo

A fully client-side showcase of the **EMS Workflow System** — a production application for managing emergency medical transport operations.

**Live Demo:** https://alehsitsko.github.io/Call-Taking-Form-React/

---

## What This Is

This repository is a public portfolio demo of the [ems-workflow-system](https://github.com/AlehSitsko/ems-workflow-system) — a full-stack production application. All demo data is stored in the browser's `localStorage`. No server, no database, no login required.

---

## Features

| Module | Description |
|---|---|
| **Dashboard** | Key metrics, demo data controls, quick navigation |
| **Call Intake** | Guided 3-step wizard + Classic mode, patient search, quality score, return ride |
| **Patients** | Search, create with duplicate detection, edit, details drawer |
| **Calls History** | Filter by date/status/search, quality score badges, delete |
| **Dispatch Preview** | Unit assignment board, manual assign/unassign, unit status updates |
| **Employees** | Staff cards, certification tracking (CPR/EVOC/EMT/Paramedic), expiry alerts |
| **Crew Planner** | Daily unit rosters with cert validation warnings |
| **User Manual** | Interactive accordion documentation |

---

## Call Quality Score

Each saved call receives a quality score (0–100) based on field completeness:

- **−12 pts** per missing critical field (patient, addresses, dates, service level, caller type)
- **−4 pts** per missing optional field (phone, appointment time, notes)

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI | React 19 + Vite 7 |
| Routing | react-router-dom v7 (HashRouter for GitHub Pages) |
| Icons | react-icons (Material Design) |
| Styling | CSS Custom Properties design system (no UI framework) |
| Storage | localStorage (no backend) |
| Deploy | gh-pages |

---

## Production System

The full backend system (`ems-workflow-system`) includes:

- **Flask + SQLAlchemy + PostgreSQL** REST API
- **17 database indexes** + N+1 query elimination via `joinedload()`
- **~184 req/s** throughput, P95 latency 171ms
- **Alembic** migrations
- **Audit logging**, notification events, per-user settings
- **Role-based access control**

---

## Run Locally

```bash
git clone https://github.com/AlehSitsko/Call-Taking-Form-React.git
cd Call-Taking-Form-React
npm install
npm run dev
```

## Deploy to GitHub Pages

```bash
npm run deploy
```

---

## Demo Data

Click **Load Demo Data** on the Dashboard to populate the app with:

- 6 employees (EMTs, Paramedics, Drivers) with varied certifications
- 5 patients with insurance and address info
- 4 calls across today/yesterday/tomorrow
- 2 units for today's shift

Data can be reset or cleared at any time from the Dashboard.
