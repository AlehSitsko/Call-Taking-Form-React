# Call Taking Form (React)

This is a React-based web application for taking and managing non-emergency medical transport calls.

## 🌐 Live Demo
Hosted on GitHub Pages:  
👉 [https://alehsitsko.github.io/Call-Taking-Form-React/]

## 📦 Tech Stack
- **Frontend**: React, Bootstrap
- **Bundler**: Vite
- **Backend**: (Planned) Python + Flask
- **Deployment**: GitHub Pages

## 🚀 Features
- Call-taking form with fields for date, pickup time, patient info, etc.
- Price calculator with base price, per-mile rate, and crew multiplier
- Return ride logic
- Optional fixed price override
- Print-friendly output with clean styling
- Bootstrap layout for responsiveness
- Clear all fields button
- Field validation (required: First Name, Last Name, Pickup Address)
- Deployment via `gh-pages`

## 📂 Project Structure
call-taking-form-react/
├── backend/ # Flask backend (coming soon)
├── public/
├── src/
│ ├── components/ # React components
│ ├── App.jsx
│ └── main.jsx
├── dist/ # Production build
├── index.html
├── vite.config.js
├── package.json
└── README.md

graphql
Copy
Edit

## 🛠 Setup & Development

```bash
npm install
npm run dev        # Start dev server
npm run build      # Build for production
npm run deploy     # Deploy to GitHub Pages
📌 Notes
Project is under active development.

Backend functionality (patients DB, call history) is in planning stage.

pgsql
Copy
Edit

---

### ✅ `TODO.md`
```markdown
# TODO — Call Taking Form (React)

## ✅ Completed

- [x] Rewrite frontend using React
- [x] Migrate calculator to reusable component
- [x] Add Return Ride logic (Yes / No / Will Call)
- [x] Add Fixed Price override
- [x] Add validation (First Name, Last Name, Pickup Address)
- [x] Add Clear All Fields button
- [x] Auto-clear after Print / Email
- [x] Print-friendly styling
- [x] Bootstrap styling & layout
- [x] Deploy to GitHub Pages

## 🟡 In Progress

- [ ] Final design polish (minimal priority)
- [ ] Add Ride Date field
- [ ] Left/right column rebalancing for wide screens

## ⏳ Planned (Post-MVP)

- [ ] Flask backend for patient records
- [ ] Page: `patients.html` (search, edit, notes)
- [ ] Export call info to PDF / JSON
- [ ] Send email from server (SMTP)
- [ ] Add login + roles (admin, dispatcher)
- [ ] Add offline / Electron support
- [ ] Distance calculator via Google/Mapbox API