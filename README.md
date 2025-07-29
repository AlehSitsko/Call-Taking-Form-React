# Call Taking Form (React)

A simple, modular call intake application designed for EMS dispatch scenarios. Built with React for improved state management, maintainability, and scalability.

---

## 📦 Features

- Dynamic call-taking form with editable fields  
- Modular price calculator based on crew size and mileage  
- Clean UI separation and easy-to-extend structure  
- Ready for printing and email-based export (planned)  
- Clear All functionality across modules

---

## 🧱 Project Structure

src/
├── App.jsx # Root app layout
├── components/
│ ├── CallForm.jsx # Call data entry form
│ ├── PriceCalculator.jsx # Cost calculation logic
│ └── [ExportButtons.jsx] # Export (email/print) - coming soon
├── index.js # App entry point
├── index.css # Global styles
└── print.css # Print-only styles


---

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/call-taking-form.git

2. Install dependencies:

    npm install

3. Run the development server:
    npm start

4. Open in browser: http://localhost:3000

🧩 Components Overview
CallForm.jsx
Fields:

First Name, Last Name, Phone Number

Pick-Up & Drop-Off Address

Additional Information (textarea)

Controlled via useState

Accepts clear signals to reset

PriceCalculator.jsx
Inputs:

Base Price

Crew Size (2/4/6 → 1x, 2x, 3x)

Mileage and Rate per Mile

Formula: Total = Base × Multiplier + Mileage × Rate
Reactively updates total cost

🖨️ Printing
Inputs and textareas are styled to show values

Interactive controls are hidden on print

Styles handled in print.css

📧 Planned Features
Email export via mailto:

PDF and JSON export (offline-ready)

Optional backend storage (Flask/SQLite)

Role-based access (future)

✅ Status
 Core form complete

 Price calculator implemented

 Print-ready styles

 Clear all fields across modules

 Email button (in progress)

 Required field validation

 Export features (future)

 Patient database module (separate)

🔒 Disclaimer
This is a prototype. No real patient data should be entered. Use with mock data only.

📄 License
MIT — Free to use and modify with attribution.