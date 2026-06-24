import { HashRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import DashboardPage      from './pages/DashboardPage';
import CallIntakePage     from './pages/CallIntakePage';
import PatientsPage       from './pages/PatientsPage';
import CallsHistoryPage   from './pages/CallsHistoryPage';
import EmployeesPage      from './pages/EmployeesPage';
import CrewPlannerPage    from './pages/CrewPlannerPage';
import DispatchPreviewPage from './pages/DispatchPreviewPage';
import UserManualPage     from './pages/UserManualPage';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/"             element={<DashboardPage />} />
          <Route path="/call-intake"  element={<CallIntakePage />} />
          <Route path="/patients"     element={<PatientsPage />} />
          <Route path="/calls-history" element={<CallsHistoryPage />} />
          <Route path="/employees"    element={<EmployeesPage />} />
          <Route path="/crew-planner" element={<CrewPlannerPage />} />
          <Route path="/dispatch"     element={<DispatchPreviewPage />} />
          <Route path="/manual"       element={<UserManualPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
