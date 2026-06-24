import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdPhone, MdPeople, MdHistory, MdAirportShuttle, MdGroups,
  MdCalendarMonth, MdMenuBook, MdRefresh, MdDeleteOutline,
  MdOpenInNew, MdStorage, MdSpeed, MdSecurity, MdNotifications,
} from 'react-icons/md';
import { loadDemoData, resetDemoData, clearDemoData, isDemoLoaded, getCalls, getPatients, getEmployees, getUnits } from '../data/demoData';
import ConfirmModal from '../components/ui/ConfirmModal';

const MODULES = [
  { to: '/call-intake',    label: 'Call Intake',       Icon: MdPhone,          desc: 'Guided 3-step wizard + Classic mode',       primary: true },
  { to: '/patients',       label: 'Patients',          Icon: MdPeople,         desc: 'Search, duplicate detection, details drawer' },
  { to: '/calls-history',  label: 'Calls History',     Icon: MdHistory,        desc: 'Filter by date, status, quality score' },
  { to: '/dispatch',       label: 'Dispatch Preview',  Icon: MdAirportShuttle, desc: 'Assign calls to units, track status' },
  { to: '/employees',      label: 'Employees',         Icon: MdGroups,         desc: 'Staff records + cert expiry tracking' },
  { to: '/crew-planner',   label: 'Crew Planner',      Icon: MdCalendarMonth,  desc: 'Daily unit rosters with cert validation' },
  { to: '/manual',         label: 'User Manual',       Icon: MdMenuBook,       desc: 'Interactive accordion documentation' },
];

const PROD_FEATURES = [
  { Icon: MdStorage,       label: 'PostgreSQL + SQLAlchemy', desc: '17 performance indexes, Alembic migrations, joinedload() for N+1 elimination' },
  { Icon: MdSpeed,         label: '184 req/s throughput',    desc: 'P95 latency 171ms (−53% after optimization). Stress-tested with 500 patients / 300 calls.' },
  { Icon: MdSecurity,      label: 'Role-based access',       desc: 'Per-user settings, audit log for every action, full CRUD with validation at API boundary' },
  { Icon: MdNotifications, label: 'WebSocket notifications', desc: 'ALS-on-BLS alerts, cert expiry warnings, dispatch events pushed in real time' },
];

function StatPill({ label, value, variant = 'neutral' }) {
  return (
    <div style={{ background: 'var(--ems-surface-2)', border: '1px solid var(--ems-border)', borderRadius: 8, padding: '12px 16px', minWidth: 110 }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: `var(--ems-${variant === 'neutral' ? 'text' : variant})` }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--ems-muted)', marginTop: 2 }}>{label}</div>
    </div>
  );
}

function ProdFeatureCard({ Icon, label, desc }) {
  return (
    <div style={{ background: 'var(--ems-surface-2)', border: '1px solid var(--ems-border)', borderRadius: 8, padding: '14px 16px', display: 'flex', gap: 12 }}>
      <Icon style={{ fontSize: 20, color: 'var(--ems-primary)', flexShrink: 0, marginTop: 2 }} />
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ems-text)', marginBottom: 3 }}>{label}</div>
        <div style={{ fontSize: 12, color: 'var(--ems-muted)', lineHeight: 1.5 }}>{desc}</div>
      </div>
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

  function handleLoad() { loadDemoData(); setLoaded(true); }
  function handleReset() { resetDemoData(); setLoaded(true); setConfirm(null); }
  function handleClear() { clearDemoData(); setLoaded(false); setConfirm(null); }

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
            No data loaded. Click <strong>Load Demo Data</strong> to populate the app with sample
            patients, calls, employees and units — stored entirely in your browser&apos;s localStorage.
          </span>
        </div>
      )}

      {/* Stats */}
      {loaded && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          <StatPill label="Total calls"  value={calls.length}  variant="primary" />
          <StatPill label="Today"        value={todayCalls.length} />
          <StatPill label="Patients"     value={patients.length} />
          <StatPill label="Active staff" value={employees.filter(e => e.status === 'active').length} />
          <StatPill label="Units today"  value={units.filter(u => u.shiftDate === todayStr).length} />
          <StatPill label="Completed"    value={calls.filter(c => c.status === 'completed').length} variant="success" />
        </div>
      )}

      {/* CTA */}
      <div style={{ marginBottom: 20 }}>
        <button className="btn-ems btn-primary btn-lg" onClick={() => navigate('/call-intake')} style={{ gap: 10 }}>
          <MdPhone style={{ fontSize: 18 }} /> Start Call Intake
        </button>
      </div>

      {/* Modules */}
      <div className="section-label">Modules</div>
      <div className="module-grid" style={{ marginBottom: 28 }}>
        {MODULES.map(({ to, label, Icon, desc, primary }) => (
          <div
            key={to}
            className="module-tile"
            onClick={() => navigate(to)}
            style={primary ? { borderColor: 'var(--ems-primary)' } : {}}
          >
            <Icon className="module-tile-icon" />
            <div className="module-tile-name">{label}</div>
            <div className="module-tile-desc">{desc}</div>
          </div>
        ))}
      </div>

      {/* Production system banner */}
      <div style={{ background: 'var(--ems-surface)', border: '1px solid var(--ems-border)', borderRadius: 8, padding: '18px 20px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ems-text)', marginBottom: 4 }}>
              Production System
            </div>
            <div style={{ fontSize: 13, color: 'var(--ems-muted)', lineHeight: 1.6, maxWidth: 560 }}>
              This demo is a client-side showcase of the full <strong style={{ color: 'var(--ems-text)' }}>EMS Workflow System</strong> —
              a production application built with React, Flask, and PostgreSQL. The backend handles real-time
              dispatch coordination, audit logging, and role-based access for EMS operators.
            </div>
          </div>
          <a
            href="https://github.com/AlehSitsko/ems-workflow-system"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ems btn-ghost"
            style={{ flexShrink: 0, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <MdOpenInNew /> View on GitHub
          </a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
          {PROD_FEATURES.map(f => <ProdFeatureCard key={f.label} {...f} />)}
        </div>
      </div>

      {/* Tech stack */}
      <div style={{ background: 'var(--ems-surface)', border: '1px solid var(--ems-border)', borderRadius: 8, padding: '16px 20px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--ems-muted)', marginBottom: 12 }}>
          Tech Stack — This Demo
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            ['React 19', 'badge-primary'],
            ['Vite 7', 'badge-primary'],
            ['react-router-dom v7', 'badge-neutral'],
            ['react-icons', 'badge-neutral'],
            ['CSS Custom Properties', 'badge-neutral'],
            ['localStorage', 'badge-success'],
            ['HashRouter', 'badge-neutral'],
            ['GitHub Pages', 'badge-neutral'],
          ].map(([label, cls]) => (
            <span key={label} className={`badge-ems ${cls}`} style={{ fontSize: 12 }}>{label}</span>
          ))}
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--ems-muted)', marginBottom: 12, marginTop: 16 }}>
          Tech Stack — Production Backend
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            ['Flask', 'badge-warning'],
            ['SQLAlchemy ORM', 'badge-warning'],
            ['PostgreSQL', 'badge-warning'],
            ['Alembic', 'badge-neutral'],
            ['Gunicorn', 'badge-neutral'],
            ['WebSocket', 'badge-success'],
            ['17 DB indexes', 'badge-success'],
          ].map(([label, cls]) => (
            <span key={label} className={`badge-ems ${cls}`} style={{ fontSize: 12 }}>{label}</span>
          ))}
        </div>
      </div>

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
