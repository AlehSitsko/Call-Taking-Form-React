# ✅ Call Taking Form — TODO

## ✅ Frontend

- [x] Implement full Call Form
- [x] Price Calculator component
- [x] Return Ride support (tripTotal = total × 2)
- [x] Clear All Fields button
- [x] PatientsPage component with search
- [x] Toggle button between form and patients view
- [x] Field validation (First Name, Last Name, Pickup Address)
- [x] Auto-clear form after Print/Email
- [x] Bootstrap layout for main UI
- [ ] Improve visual layout of Service Level (cosmetic)
- [ ] Unify styling, spacing, fonts

## 🟡 Backend (Flask)

- [x] Initialize Flask app
- [x] Setup SQLAlchemy, CORS
- [x] Create Patient model
- [x] Init SQLite DB
- [ ] GET /api/patients (with filtering)
- [ ] POST /api/patient
- [ ] PUT /api/patient/:id
- [ ] Connect frontend to backend (patients fetch)

## 📨 Export / Email (optional)

- [x] Print support (styled output)
- [ ] Email trip data via `mailto:` or SMTP
- [ ] Export to PDF
- [ ] SMTP setup (optional)

## 🔒 Authentication & Access Control

- [ ] Add login / auth layer (JWT or basic)
- [ ] Role-based access (admin / dispatcher)
- [ ] Edit lock for non-authorized users

## 🧱 Platform Support

- [x] GitHub Pages setup (`gh-pages`)
- [x] Manual deploy via `npm run deploy`
- [ ] Support for offline mode / PWA / Electron (planned)
