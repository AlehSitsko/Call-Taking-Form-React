import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import CallFormPage from './pages/CallFormPage';
import PatientsPage from './pages/PatientsPage';
import UserManualPage from './pages/UserManualPage';
import EmployeesPage from './pages/EmployeesPage';
import CrewPlannerPage from './pages/CrewPlannerPage';

function App() {
  const getNavLinkClass = ({ isActive }) =>
    `nav-link${isActive ? ' active fw-semibold' : ''}`;

  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid px-3">
          <span className="navbar-brand fw-bold">Call Taking Form</span>

          <div className="navbar-nav ms-3">
            <NavLink to="/" end className={getNavLinkClass}>
              Call Form
            </NavLink>

            <NavLink to="/patients" className={getNavLinkClass}>
              Patients
            </NavLink>

            <NavLink to="/manual" className={getNavLinkClass}>
              User Manual
            </NavLink>

            <NavLink to="/employees" className={getNavLinkClass}>
              Employees
            </NavLink>

            <NavLink to="/crew-planner" className={getNavLinkClass}>
              Crew Planner
            </NavLink>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<CallFormPage />} />
        <Route path="/patients" element={<PatientsPage />} />
        <Route path="/manual" element={<UserManualPage />} />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/crew-planner" element={<CrewPlannerPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;