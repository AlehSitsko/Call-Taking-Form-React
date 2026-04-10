# Call Taking Form React

A React-based operational support tool designed for structured call intake and basic EMS workflow organization.

This project started as a call-taking form, but gradually expanded into a broader internal-use workflow tool. It now includes call intake, employee records, and unit planning features that support day-to-day operational coordination.

## Live Demo

GitHub Pages: https://alehsitsko.github.io/Call-Taking-Form-React/#/

## Purpose

The goal of this project is to reduce routine friction in EMS-related workflows by introducing structure, consistency, and basic validation into tasks that are often handled manually.

The application is intended as a lightweight support tool, not as a replacement for core dispatch software.

## Current Features

### Call Taking Form
- Structured call intake form
- Required field validation
- Print-friendly layout
- Clear all fields
- Return ride logic
- Fixed price override
- Price calculator support

### Patients Page
- Dedicated page for patient-related workflow expansion
- Supports project modularity and future backend integration

### User Manual
- Built-in user manual page for dispatcher guidance
- Step-by-step reference for using the form

### Employees Page
- Add and manage employee records
- Store employee phone number, status, and notes
- Track certifications and licenses:
  - CPR
  - EVOC
  - EMT
  - Paramedic
- Certification status display:
  - Active
  - Expiring Soon
  - Expired
  - No License
- CPR warning logic for compliance tracking
- Allowed position summary for each employee

### Unit Planner
- Create actual ambulance units instead of abstract crews
- Select unit type:
  - BLS
  - ALS
  - ASSIST
- Assign:
  - Driver
  - Medical slot (EMT or Paramedic depending on unit type)
  - Assist 1
  - Assist 2
- Set truck number
- Set unit start time
- Add required first patient
- Add optional next patients
- Save planned units in localStorage
- Edit existing units
- Delete units
- View compact list of unassigned active employees
- Warning if employee is already assigned to another unit
- Warning-only CPR compliance logic
- Warning for expired or expiring role-related certifications

## Routing / Deployment Notes

This project uses `HashRouter` for GitHub Pages compatibility.

This prevents 404 errors when refreshing direct routes such as:
- `/employees`
- `/crew-planner`
- `/patients`

Because GitHub Pages does not natively support client-side routing with `BrowserRouter`.

## Tech Stack

- React
- React Router
- JavaScript
- Bootstrap
- Vite
- localStorage

## Current Data Storage

At the current stage, the project uses browser `localStorage` for:
- employee records
- planned units

This is intentional for lightweight prototype behavior and frontend workflow testing.

## Project Structure

```bash
src/
  pages/
    CallFormPage.jsx
    PatientsPage.jsx
    UserManualPage.jsx
    EmployeesPage.jsx
    CrewPlannerPage.jsx
  App.jsx
  main.jsx

👤 Author

Aleh Sitsko
Philadelphia, PA
GitHub: https://github.com/AlehSitsko