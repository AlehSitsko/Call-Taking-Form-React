import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdPhone, MdPeople, MdHistory, MdAirportShuttle, MdGroups,
  MdCalendarMonth, MdMenuBook, MdRefresh, MdDeleteOutline,
  MdOpenInNew, MdStorage, MdSpeed, MdSecurity, MdNotifications,
  MdCalculate,
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

function PriceCalculator() {
  const [basePrice, setBasePrice] = useState('');
  const [crewSize, setCrewSize]   = useState('2');
  const [mileage, setMileage]     = useState('');
  const [ratePerMile, setRatePerMile] = useState('');
  const [ret, setRet]             = useState(false);
  const [result, setResult]       = useState(null);

  function calculate() {
    const base  = parseFloat(basePrice)    || 0;
    const miles = parseFloat(mileage)      || 0;
    const rate  = parseFloat(ratePerMile)  || 0;
    const crew  = parseInt(crewSize)       || 2;

    const mileageFee  = miles * rate;
    const crewSurcharge = crew > 2 ? (crew - 2) * 50 : 0;
    const subtotal    = base + mileageFee + crewSurcharge;
    const total       = ret ? subtotal * 2 : subtotal;
    setResult({ base, mileageFee, crewSurcharge, subtotal, total, miles, rate, crew });
  }

  const field = (label, value, setter, placeholder, type = 'number') => (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ems-text)', marginBottom: 6 }}>{label}</label>
      <input
        type={type}
        min="0"
        value={value}
        onChange={e => { setter(e.target.value); setResult(null); }}
        placeholder={placeholder}
        className="form-control"
      />
    </div>
  );

  const row = (label, val, muted) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid var(--ems-border)' }}>
      <span style={{ fontSize: 13, color: muted ? 'var(--ems-muted)' : 'var(--ems-text)' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: muted ? 400 : 600, color: muted ? 'var(--ems-muted)' : 'var(--ems-text)', fontVariantNumeric: 'tabular-nums' }}>{val}</span>
    </div>
  );

  return (
    <div style={{ background: 'var(--ems-surface)', border: '1px solid var(--ems-border)', borderRadius: 8, padding: '18px 20px', marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <MdCalculate style={{ fontSize: 18, color: 'var(--ems-primary)' }} />
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ems-text)' }}>Price Calculator</span>
        <span style={{ fontSize: 11, color: 'var(--ems-muted)', marginLeft: 4 }}>Demo rates — for illustration only</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {field('Base Price ($)', basePrice, setBasePrice, 'e.g. 450')}

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ems-text)', marginBottom: 6 }}>Crew Size</label>
            <select
              className="form-control"
              value={crewSize}
              onChange={e => { setCrewSize(e.target.value); setResult(null); }}
            >
              {[1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          {field('Mileage (miles)', mileage, setMileage, 'e.g. 15')}
          {field('Rate per Mile ($)', ratePerMile, setRatePerMile, 'e.g. 12')}

          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={ret}
              onChange={e => { setRet(e.target.checked); setResult(null); }}
              style={{ accentColor: 'var(--ems-primary)', width: 15, height: 15 }}
            />
            <span style={{ fontSize: 13, color: 'var(--ems-text)' }}>Return Ride (Round-Trip)</span>
          </label>

          <button className="btn-ems btn-primary" onClick={calculate} style={{ alignSelf: 'flex-start' }}>
            <MdCalculate /> Calculate Price
          </button>
        </div>

        {/* Result */}
        <div style={{ background: 'var(--ems-surface-2)', border: '1px solid var(--ems-border)', borderRadius: 8, padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: result ? 'space-between' : 'center', minHeight: 220 }}>
          {!result ? (
            <div style={{ textAlign: 'center', color: 'var(--ems-subtle)', fontSize: 13 }}>
              <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.3 }}>🧮</div>
              Fill in the fields and click<br /><strong style={{ color: 'var(--ems-muted)' }}>Calculate Price</strong>
            </div>
          ) : (
            <>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ems-muted)', marginBottom: 10 }}>Price Breakdown</div>
                {row('Base price', `$${result.base.toFixed(2)}`)}
                {row(`Mileage (${result.miles} mi × $${result.rate})`, `$${result.mileageFee.toFixed(2)}`, result.mileageFee === 0)}
                {result.crewSurcharge > 0 && row(`Extra crew (${result.crew - 2} × $50)`, `$${result.crewSurcharge.toFixed(2)}`)}
                {ret && row('Return ride (×2)', `$${result.subtotal.toFixed(2)}`, true)}
              </div>
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: '2px solid var(--ems-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ems-text)' }}>Total estimate</span>
                  <span style={{ fontSize: 26, fontWeight: 800, color: 'var(--ems-primary)', fontVariantNumeric: 'tabular-nums' }}>
                    ${result.total.toFixed(2)}
                  </span>
                </div>
                {ret && <div style={{ fontSize: 11, color: 'var(--ems-muted)', marginTop: 4 }}>${result.subtotal.toFixed(2)} × 2 legs</div>}
              </div>
            </>
          )}
        </div>
      </div>
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

      {/* Price calculator */}
      <PriceCalculator />

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
