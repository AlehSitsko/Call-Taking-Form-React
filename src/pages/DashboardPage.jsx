import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdPhone, MdPeople, MdHistory, MdAirportShuttle, MdGroups, MdCalendarMonth, MdMenuBook, MdRefresh, MdDeleteOutline } from 'react-icons/md';
import { loadDemoData, resetDemoData, clearDemoData, isDemoLoaded, getCalls, getPatients, getEmployees, getUnits } from '../data/demoData';
import ConfirmModal from '../components/ui/ConfirmModal';

const MODULES = [
  { to: '/call-intake',   label: 'Call Intake',      Icon: MdPhone,          desc: 'Create a new transport call record', primary: true },
  { to: '/patients',      label: 'Patients',         Icon: MdPeople,         desc: 'Search & manage patient profiles' },
  { to: '/calls-history', label: 'Calls History',    Icon: MdHistory,        desc: 'Browse & filter past call records' },
  { to: '/dispatch',      label: 'Dispatch Preview', Icon: MdAirportShuttle, desc: 'View unit assignments and status' },
  { to: '/employees',     label: 'Employees',        Icon: MdGroups,         desc: 'Manage staff & certifications' },
  { to: '/crew-planner',  label: 'Crew Planner',     Icon: MdCalendarMonth,  desc: 'Build daily unit crew rosters' },
  { to: '/manual',        label: 'User Manual',      Icon: MdMenuBook,       desc: 'Interactive system documentation' },
];

function StatPill({ label, value, variant = 'neutral' }) {
  return (
    <div style={{ background: 'var(--ems-surface-2)', border: '1px solid var(--ems-border)', borderRadius: 8, padding: '12px 16px', minWidth: 100 }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: `var(--ems-${variant === 'neutral' ? 'text' : variant})` }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--ems-muted)', marginTop: 2 }}>{label}</div>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(isDemoLoaded());
  const [confirm, setConfirm] = useState(null);

  const calls     = getCalls();
  const patients  = getPatients();
  const employees = getEmployees();
  const units     = getUnits();
  const todayStr  = new Date().toISOString().slice(0, 10);
  const todayCalls = calls.filter(c => c.tripDate === todayStr || c.dateOfCall === todayStr);

  function handleLoad() {
    loadDemoData();
    setLoaded(true);
  }

  function handleReset() {
    resetDemoData();
    setLoaded(true);
    setConfirm(null);
  }

  function handleClear() {
    clearDemoData();
    setLoaded(false);
    setConfirm(null);
  }

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-subtitle">EMS Workflow System — Portfolio Demo</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {!loaded ? (
            <button className="btn-ems btn-primary" onClick={handleLoad}>
              <MdRefresh /> Load Demo Data
            </button>
          ) : (
            <>
              <button className="btn-ems btn-ghost btn-sm" onClick={() => setConfirm('reset')}>
                <MdRefresh /> Reset Demo
              </button>
              <button className="btn-ems btn-danger btn-sm" onClick={() => setConfirm('clear')}>
                <MdDeleteOutline /> Clear All
              </button>
            </>
          )}
        </div>
      </div>

      {/* Demo banner */}
      {!loaded && (
        <div className="callout callout-info" style={{ marginBottom: 20 }}>
          <span style={{ fontSize: 16 }}>ℹ</span>
          <span>
            No data loaded yet. Click <strong>Load Demo Data</strong> to populate the app with sample patients, calls,
            employees and units — all stored in your browser&apos;s localStorage. No server required.
          </span>
        </div>
      )}

      {/* Stats row */}
      {loaded && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          <StatPill label="Total calls" value={calls.length} variant="primary" />
          <StatPill label="Today" value={todayCalls.length} />
          <StatPill label="Patients" value={patients.length} />
          <StatPill label="Staff" value={employees.filter(e => e.status === 'active').length} />
          <StatPill label="Units today" value={units.filter(u => u.shiftDate === todayStr).length} />
        </div>
      )}

      {/* Quick action */}
      <div style={{ marginBottom: 20 }}>
        <button
          className="btn-ems btn-primary btn-lg"
          onClick={() => navigate('/call-intake')}
          style={{ gap: 10 }}
        >
          <MdPhone style={{ fontSize: 18 }} />
          Start Call Intake
        </button>
      </div>

      {/* Module grid */}
      <div className="section-label">Modules</div>
      <div className="module-grid">
        {MODULES.map(({ to, label, Icon, desc, primary }) => (
          <div
            key={to}
            className={`module-tile${primary ? ' module-tile-primary' : ''}`}
            onClick={() => navigate(to)}
            style={primary ? { borderColor: 'var(--ems-primary)' } : {}}
          >
            <Icon className="module-tile-icon" />
            <div className="module-tile-name">{label}</div>
            <div className="module-tile-desc">{desc}</div>
          </div>
        ))}
      </div>

      {/* About */}
      <div style={{ marginTop: 24, padding: '14px 16px', background: 'var(--ems-surface)', border: '1px solid var(--ems-border)', borderRadius: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--ems-muted)', marginBottom: 8 }}>About this demo</div>
        <p style={{ color: 'var(--ems-muted)', fontSize: 13, margin: 0, lineHeight: 1.7 }}>
          This is a fully client-side showcase of the <strong style={{ color: 'var(--ems-text)' }}>EMS Workflow System</strong> —
          a production React + Flask + PostgreSQL application for managing emergency medical transport operations.
          All data lives in your browser&apos;s localStorage. The full backend system includes real-time dispatch,
          audit logging, notification events, performance indexes, and role-based access control.
        </p>
      </div>

      {/* Modals */}
      <ConfirmModal
        open={confirm === 'reset'}
        title="Reset Demo Data"
        message="This will overwrite all current data with the original seed dataset. Are you sure?"
        confirmLabel="Reset"
        onConfirm={handleReset}
        onCancel={() => setConfirm(null)}
      />
      <ConfirmModal
        open={confirm === 'clear'}
        title="Clear All Data"
        message="This will permanently remove all calls, patients, employees, and units from localStorage."
        confirmLabel="Clear All"
        danger
        onConfirm={handleClear}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
