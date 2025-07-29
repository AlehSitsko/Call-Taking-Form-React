# Call Taking Form — React + Flask

## 📋 Description

**Call Taking Form** is a custom-built application for logging and managing non-emergency medical transport (NEMT) calls. It is designed for dispatchers to record patient trip details quickly, calculate prices, and serve as a local backup in case of primary system failure.

## 🎯 Purpose

- Provide a reliable fallback when internet or main systems go down
- Speed up the intake process for dispatchers
- Record trip and patient information consistently
- Offer a lightweight, offline-friendly alternative to heavy EMS platforms

## 🛠 Tech Stack

- **Frontend**: React, Bootstrap, Vite
- **Backend**: Flask, SQLite (optional)
- **Deployment**: GitHub Pages (`gh-pages` branch)

## ✨ Key Features

- Fully functional dispatch call form
- Price calculator with crew size, mileage, and return trip logic
- Return Ride (round-trip) calculation
- Patients page with search functionality (React-based)
- Print and clear form functionality
- Optional backend with patient database
- Mobile responsive layout

## 📁 Project Structure

```
/src              → React components
/backend          → Flask backend (API, DB models)
/public           → Static files
/dist             → Build output
```

## 🚀 Deployment (Frontend only)

```bash
npm install
npm run build
npm run deploy
```

## ⚙️ Development

```bash
npm run dev
```

## 🧩 Backend (Optional)

```bash
cd backend
python app.py
```

## 📄 License

MIT License
