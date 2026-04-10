# Call Taking Form (React)

This is a React-based web application for managing non-emergency medical transport workflows, including call intake, employee management, and crew planning.

## 🌐 Live Demo
👉 https://alehsitsko.github.io/Call-Taking-Form-React/

---

## 📦 Tech Stack

- **Frontend**: React, Bootstrap
- **Routing**: React Router
- **State Management**: React state + localStorage (temporary persistence)
- **Bundler**: Vite
- **Backend (Planned)**: Python + Flask
- **Deployment**: GitHub Pages

---

## 🚀 Features

### 📞 Call Taking Form
- Structured form for transport requests
- Date of call, trip date, pickup time
- Caller type, patient info, addresses
- Return ride logic (Yes / No / Will Call)
- Service level selection
- Validation for required fields
- Print-friendly output
- Clear All functionality

---

### 👥 Employee Management (NEW)
- Add, edit, delete employees
- Store employee data in localStorage
- Track licenses:
  - EVOC
  - EMT
  - Paramedic
- License expiration tracking:
  - Active
  - Expiring Soon
  - Expired
- Automatic role detection based on licenses:
  - Driver (requires EVOC)
  - EMT
  - Paramedic
  - Assist (default role)

---

### 🚑 Crew Planner (NEW)
- Loads employees from shared localStorage
- Assign employees into crew roles
- Role-based filtering:
  - Driver → EVOC required
  - EMT → EMT license
  - Paramedic → Paramedic license
  - Assist → any employee
- Prevents duplicate assignment across roles
- Displays warnings for:
  - Expired licenses
  - Expiring soon licenses

---

## 🧠 Current Architecture

This project now follows a basic modular structure:

- **Employees Page** → Data source (CRUD + persistence)
- **Crew Planner Page** → Data consumer (assignment logic)
- **Call Form Page** → Operational input UI

Data is currently shared using **localStorage**, acting as a temporary client-side database.

---

## ⚠️ Limitations (Current Stage)

- No backend (data stored only in browser)
- No multi-device sync
- No authentication yet
- Crew assignments are not persisted
- No scheduling system yet

---

## 🔮 Planned Features

### Crew System Upgrade
Introduce **crew types instead of fixed roles**:

- **ASSIST**
  - Driver
  - Assist x2

- **BLS**
  - Driver
  - Clinical (EMT or Paramedic)
  - Assist x2

- **ALS**
  - Driver
  - Paramedic (required)
  - Assist x2

Crew slots will be dynamically generated based on selected crew type.

---

### Backend (Flask)
- Replace localStorage with database
- API for:
  - Employees
  - Crews
  - Call history
- JWT authentication (admin only)

---

### Additional Features
- Patient database
- Call history tracking
- Export (PDF / JSON)
- Scheduling system (daily / weekly)
- Offline / Electron version

---

## 🛠 Setup & Development

```bash
npm install
npm run dev        # Start dev server
npm run build      # Build project
npm run deploy     # Deploy to GitHub Pages

📌 Notes

This project is designed as a real-world operational tool, not just a demo.

It focuses on:

workflow optimization
structured data input
reducing dispatcher errors
supporting real EMS operations
👤 Author

Aleh Sitsko
Philadelphia, PA
GitHub: https://github.com/AlehSitsko