import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdPhone, MdPeople, MdHistory, MdAirportShuttle, MdGroups,
  MdCalendarMonth, MdMenuBook, MdRefresh, MdDeleteOutline,
  MdOpenInNew, MdStorage, MdSpeed, MdSecurity, MdNotifications,
  MdCalculate, MdArrowForward,
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

const PRICE_BASE = { BLS: 450, ALS: 750, Stretcher: 380, Wheelchair: 200 };
const MILEAGE_RATE = 12;  // $ per mile over 10 base miles
const BASE_MILES = 10;

function PriceCalculator() {
  const [svc, setSvc]    = useState('BLS');
  const [miles, setMiles] = useState(10);
  const [ret, setRet]    = useState(false);
  const [wait, setWait]  = useState(0);  // extra wait hours

  const base     = PRICE_BASE[svc] || 450;
  const mileage  = Math.max(0, miles - BASE_MILES) * MILEAGE_RATE;
  const waitFee  = wait * 35;
  const subtotal = base + mileage + waitFee;
  const total    = ret ? subtotal * 2 : subtotal;

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
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ems-text)' }}>Trip Price Calculator</span>
        <span style={{ fontSize: 11, color: 'var(--ems-muted)', marginLeft: 4 }}>Demo rates — for illustration only</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Service level */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ems-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Service Level</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {Object.keys(PRICE_BASE).map(k => (
                <button
                  key={k}
                  onClick={() => setSvc(k)}
                  style={{
                    padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.12s',
                    background: svc === k ? 'var(--ems-primary)' : 'var(--ems-surface-2)',
                    color: svc === k ? '#fff' : 'var(--ems-muted)',
                    border: svc === k ? '1px solid var(--ems-primary)' : '1px solid var(--ems-border)',
                  }}
                >{k}</button>
              ))}
            </div>
          </div>

          {/* Miles */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ems-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Distance</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ems-text)' }}>{miles} mi</span>
            </div>
            <input
              type="range" min={1} max={60} value={miles}
              onChange={e => setMiles(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--ems-primary)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--ems-subtle)', marginTop: 2 }}>
              <span>1 mi</span><span>60 mi</span>
            </div>
          </div>

          {/* Wait time */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ems-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Wait time</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ems-text)' }}>{wait}h</span>
            </div>
            <input
              type="range" min={0} max={4} step={0.5} value={wait}
              onChange={e => setWait(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--ems-primary)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--ems-subtle)', marginTop: 2 }}>
              <span>0h</span><span>4h</span>
            </div>
          </div>

          {/* Return ride toggle */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '8px 12px', background: ret ? 'var(--ems-primary-soft)' : 'var(--ems-surface-2)', border: `1px solid ${ret ? 'var(--ems-primary)' : 'var(--ems-border)'}`, borderRadius: 8, transition: 'all 0.12s' }}>
            <input type="checkbox" checked={ret} onChange={e => setRet(e.target.checked)} style={{ accentColor: 'var(--ems-primary)', width: 15, height: 15 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ems-text)' }}>Return ride</div>
              <div style={{ fontSize: 11, color: 'var(--ems-muted)' }}>Round trip — charges subtotal twice</div>
            </div>
          </label>
        </div>

        {/* Price breakdown */}
        <div style={{ background: 'var(--ems-surface-2)', border: '1px solid var(--ems-border)', borderRadius: 8, padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ems-muted)', marginBottom: 10 }}>Price Breakdown</div>
            {row(`Base rate (${svc})`, `$${base.toFixed(2)}`)}
            {row(`Mileage (${Math.max(0, miles - BASE_MILES)} mi × $${MILEAGE_RATE})`, `$${mileage.toFixed(2)}`, mileage === 0)}
            {row(`Wait fee (${wait}h × $35)`, `$${waitFee.toFixed(2)}`, waitFee === 0)}
            {ret && row('Return ride (×2)', `$${subtotal.toFixed(2)}`, true)}
          </div>

          <div style={{ marginTop: 14, paddingTop: 14, borderTop: '2px solid var(--ems-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ems-text)' }}>Total estimate</span>
              <span style={{ fontSize: 26, fontWeight: 800, color: 'var(--ems-primary)', fontVariantNumeric: 'tabular-nums' }}>
                ${total.toFixed(2)}
              </span>
            </div>
            {ret && (
              <div style={{ fontSize: 11, color: 'var(--ems-muted)', marginTop: 4 }}>
                ${subtotal.toFixed(2)} × 2 legs
              </div>
            )}
          </div>
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
