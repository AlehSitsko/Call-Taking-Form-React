

# ✅ TODO.md (UPDATED)

```markdown
# TODO — Call Taking Form (React)

---

## ✅ Completed

### Core UI
- [x] React rewrite of application
- [x] Bootstrap styling
- [x] Navigation via React Router

---

### Call Form
- [x] Structured call intake form
- [x] Return Ride logic
- [x] Fixed Price override
- [x] Validation (required fields)
- [x] Clear All Fields
- [x] Print-friendly layout

---

### Employee Module
- [x] Add employee
- [x] Edit employee
- [x] Delete employee
- [x] Store employees in localStorage
- [x] License tracking (EVOC / EMT / Paramedic)
- [x] License expiration logic
- [x] Automatic role detection

---

### Crew Planner (Phase 1)
- [x] Load employees from localStorage
- [x] Display employee cards
- [x] Assign employees to roles
- [x] Filter employees by role eligibility
- [x] Prevent duplicate assignments
- [x] Show license warnings

---

## 🟡 In Progress

- [ ] UI polish (layout improvements)
- [ ] Improve mobile usability

---

## 🚧 Next Step — Crew System Upgrade

### Replace current role system with Crew Types

- [ ] Add Crew Type selector:
  - ASSIST
  - BLS
  - ALS

- [ ] Dynamically generate crew slots based on type

---

### Crew Logic Rules

#### ASSIST
- Driver (EVOC required)
- Assist x2

#### BLS
- Driver (EVOC required)
- Clinical (EMT or Paramedic)
- Assist x2

#### ALS
- Driver (EVOC required)
- Paramedic (required)
- Assist x2

---

### Behavior

- [ ] Filter employees based on slot requirements
- [ ] Show warnings for expired licenses
- [ ] Allow override (still assign if needed)
- [ ] Display role type dynamically (EMT vs Paramedic)

---

## 🔄 Future Improvements

### Data & Backend
- [ ] Replace localStorage with Flask backend
- [ ] Create API for employees
- [ ] Persist crew assignments
- [ ] Add authentication (admin only)

---

### Scheduling
- [ ] Daily crew planner
- [ ] Weekly schedule view
- [ ] Shift assignment logic

---

### Patients Module
- [ ] Patient database page
- [ ] Search by name / DOB
- [ ] Link calls to patients

---

### Export & Reporting
- [ ] Export crew plans (PDF / JSON)
- [ ] Export call data
- [ ] Generate daily reports

---

### Advanced
- [ ] Role-based access
- [ ] Multi-user support
- [ ] Offline mode (PWA / Electron)

---

## 🧠 Notes

This project is evolving from:
> simple call intake form

into:
> full operational EMS support system

Focus remains on:
- real usability
- speed
- reliability under pressure