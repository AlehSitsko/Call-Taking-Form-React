import { useState } from 'react';
import { MdSearch, MdExpandMore, MdExpandLess } from 'react-icons/md';

const SECTIONS = [
  {
    id: 'overview', title: 'System Overview',
    content: (
      <div>
        <p>The EMS Workflow System is a web application for managing emergency medical transport operations. It covers call intake, patient management, crew planning, dispatch coordination, and documentation.</p>
        <p><strong>Key principles:</strong></p>
        <ul>
          <li>All calls are recorded with a quality score to ensure complete documentation.</li>
          <li>Patients are stored with deduplication to prevent duplicate records.</li>
          <li>Crew rosters are built per-shift and checked against certification requirements.</li>
          <li>The dispatch board gives a real-time view of unit assignments.</li>
        </ul>
        <p style={{ background: 'var(--ems-primary-soft)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 6, padding: '10px 14px', color: '#7dd3fc', fontSize: 13 }}>
          ℹ This demo stores all data in your browser&apos;s localStorage. The production system uses PostgreSQL, Flask, and WebSocket notifications.
        </p>
      </div>
    ),
  },
  {
    id: 'dashboard', title: 'Dashboard',
    content: (
      <div>
        <p>The Dashboard is the starting point. It shows key metrics and provides quick navigation to all modules.</p>
        <ul>
          <li><strong>Load Demo Data</strong> — populates the app with sample records (6 employees, 5 patients, 4 calls, 2 units).</li>
          <li><strong>Reset Demo</strong> — restores the original seed data, overwriting any changes.</li>
          <li><strong>Clear All</strong> — removes all data from localStorage.</li>
          <li><strong>Start Call Intake</strong> — the primary action button for dispatchers.</li>
        </ul>
        <p>Stats are calculated live from localStorage and update immediately when data changes.</p>
      </div>
    ),
  },
  {
    id: 'call-intake', title: 'Call Intake',
    content: (
      <div>
        <p>The Call Intake module creates new transport call records. It operates in two modes:</p>
        <h4 style={{ color: 'var(--ems-primary)', fontSize: 13, marginTop: 12 }}>Guided Mode (default)</h4>
        <p>Three-step wizard:</p>
        <ol>
          <li><strong>Patient</strong> — search existing patients or create a new one. Duplicate detection prevents double entries.</li>
          <li><strong>Trip Details</strong> — pickup/dropoff addresses, dates, times, service level, call type, return ride toggle.</li>
          <li><strong>Review</strong> — quality score preview, missing field warnings, estimated price calculator.</li>
        </ol>
        <h4 style={{ color: 'var(--ems-primary)', fontSize: 13, marginTop: 12 }}>Classic Mode</h4>
        <p>All fields on a single page for experienced dispatchers who prefer one-pass entry.</p>
        <h4 style={{ color: 'var(--ems-primary)', fontSize: 13, marginTop: 12 }}>Quality Score</h4>
        <p>Automatically calculated based on field completeness: 100 points, −12 per missing critical field (patient name, addresses, dates, service level), −4 per missing optional field.</p>
        <h4 style={{ color: 'var(--ems-primary)', fontSize: 13, marginTop: 12 }}>Service Levels</h4>
        <ul>
          <li><strong>BLS</strong> — Basic Life Support</li>
          <li><strong>ALS</strong> — Advanced Life Support (requires Paramedic)</li>
          <li><strong>Stretcher</strong> — Non-emergency stretcher transport</li>
          <li><strong>Wheelchair</strong> — Wheelchair-accessible vehicle</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'patients', title: 'Patients',
    content: (
      <div>
        <p>The Patients module manages the patient database. Each patient has a persistent record that can be referenced by multiple calls.</p>
        <ul>
          <li><strong>Search</strong> — filter by name, date of birth, or phone number.</li>
          <li><strong>Duplicate prevention</strong> — the system checks first name, last name, and DOB before creating a new record.</li>
          <li><strong>Default service level</strong> — sets a patient-level default that auto-fills the Call Intake form.</li>
          <li><strong>Start Call</strong> — navigates directly to Call Intake (patient can be selected from there).</li>
        </ul>
        <p>All fields are editable after creation. Deletion is permanent and removes the patient from localStorage.</p>
      </div>
    ),
  },
  {
    id: 'calls-history', title: 'Calls History',
    content: (
      <div>
        <p>Calls History shows all saved call records with full filtering capabilities.</p>
        <h4 style={{ color: 'var(--ems-primary)', fontSize: 13, marginTop: 12 }}>Filters</h4>
        <ul>
          <li><strong>Date</strong> — All, Today, Yesterday, or custom date picker.</li>
          <li><strong>Status</strong> — New, Assigned, Completed, Cancelled.</li>
          <li><strong>Search</strong> — patient name, address, dispatcher.</li>
        </ul>
        <h4 style={{ color: 'var(--ems-primary)', fontSize: 13, marginTop: 12 }}>Quality Score</h4>
        <p>The circular badge on each row shows the call&apos;s score: <span style={{ color: 'var(--ems-success)' }}>green ≥85</span>, <span style={{ color: 'var(--ems-warning)' }}>yellow 60–84</span>, <span style={{ color: 'var(--ems-danger)' }}>red &lt;60</span>.</p>
      </div>
    ),
  },
  {
    id: 'dispatch', title: 'Dispatch Preview',
    content: (
      <div>
        <p>The Dispatch Preview shows the real-time state of units and call assignments for a selected date.</p>
        <h4 style={{ color: 'var(--ems-primary)', fontSize: 13, marginTop: 12 }}>Layout</h4>
        <ul>
          <li><strong>Left column</strong> — unassigned calls (status: New). Click a call to assign it to a unit.</li>
          <li><strong>Right column</strong> — units on shift. Shows crew, status, and assigned calls.</li>
        </ul>
        <h4 style={{ color: 'var(--ems-primary)', fontSize: 13, marginTop: 12 }}>Actions</h4>
        <ul>
          <li>Click an unassigned call → select a unit to assign it.</li>
          <li>Click a unit → view crew, update unit status, mark calls complete, or unassign.</li>
        </ul>
        <h4 style={{ color: 'var(--ems-primary)', fontSize: 13, marginTop: 12 }}>Unit Statuses</h4>
        <p>Available → En Route → On Scene → Transporting → At Destination. These map to lifecycle timestamps in the production system.</p>
      </div>
    ),
  },
  {
    id: 'employees', title: 'Employees',
    content: (
      <div>
        <p>The Employees module manages staff records and certifications.</p>
        <h4 style={{ color: 'var(--ems-primary)', fontSize: 13, marginTop: 12 }}>Certifications Tracked</h4>
        <ul>
          <li><strong>CPR</strong> — required for all crew</li>
          <li><strong>EVOC</strong> — required for drivers</li>
          <li><strong>EMT</strong> — required for BLS medical crew</li>
          <li><strong>Paramedic</strong> — required for ALS medical crew</li>
        </ul>
        <h4 style={{ color: 'var(--ems-primary)', fontSize: 13, marginTop: 12 }}>Cert Status Colors</h4>
        <ul>
          <li><span style={{ color: 'var(--ems-success)' }}>Green</span> — valid</li>
          <li><span style={{ color: 'var(--ems-warning)' }}>Yellow</span> — expiring within 30 days</li>
          <li><span style={{ color: 'var(--ems-danger)' }}>Red</span> — expired</li>
        </ul>
        <p>The Crew Planner uses these certifications to show warnings when an employee is assigned to a unit type they are not certified for.</p>
      </div>
    ),
  },
  {
    id: 'crew-planner', title: 'Crew Planner',
    content: (
      <div>
        <p>The Crew Planner builds daily unit rosters by assigning employees to vehicle roles.</p>
        <ul>
          <li>Select a date to view or build the roster for that shift.</li>
          <li>Add units with truck number, unit type (BLS/ALS), and start time.</li>
          <li>Assign Driver, Medical, and up to 2 Assist positions per unit.</li>
          <li>Certification warnings appear when an employee lacks required certs for the assigned unit type.</li>
        </ul>
        <p>Units created here are immediately available in the Dispatch Preview for the same date.</p>
      </div>
    ),
  },
  {
    id: 'data', title: 'Demo Data & Storage',
    content: (
      <div>
        <p>All data in this demo is stored in <code style={{ background: 'var(--ems-surface-2)', padding: '1px 5px', borderRadius: 3 }}>localStorage</code> under these keys:</p>
        <ul>
          <li><code>ems_employees</code></li>
          <li><code>ems_patients</code></li>
          <li><code>ems_calls</code></li>
          <li><code>ems_units</code></li>
        </ul>
        <p>Data persists across browser sessions until you click <strong>Clear All</strong> on the Dashboard or clear localStorage manually in DevTools.</p>
        <p><strong>Production system:</strong> uses PostgreSQL with 17 performance indexes, Alembic migrations, SQLAlchemy ORM with joinedload() for N+1 elimination, and a Flask REST API serving ~184 req/s under load.</p>
      </div>
    ),
  },
];

function Section({ section, open, onToggle }) {
  return (
    <div style={{ background: 'var(--ems-surface)', border: '1px solid var(--ems-border)', borderRadius: 8, marginBottom: 8, overflow: 'hidden' }}>
      <button
        onClick={onToggle}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ems-text)', textAlign: 'left' }}
      >
        <span style={{ fontWeight: 600, fontSize: 14 }}>{section.title}</span>
        {open ? <MdExpandLess style={{ color: 'var(--ems-muted)', flexShrink: 0 }} /> : <MdExpandMore style={{ color: 'var(--ems-muted)', flexShrink: 0 }} />}
      </button>
      {open && (
        <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--ems-border)', fontSize: 13, color: 'var(--ems-muted)', lineHeight: 1.7 }}>
          <div style={{ paddingTop: 12 }}>{section.content}</div>
        </div>
      )}
    </div>
  );
}

export default function UserManualPage() {
  const [open, setOpen] = useState(new Set(['overview']));
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? SECTIONS.filter(s => s.title.toLowerCase().includes(query.toLowerCase()))
    : SECTIONS;

  function toggleSection(id) {
    setOpen(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div style={{ maxWidth: 760 }}>
      <div className="page-header">
        <div>
          <div className="page-title">User Manual</div>
          <div className="page-subtitle">Interactive documentation for all modules</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-ems btn-ghost btn-sm" onClick={() => setOpen(new Set(SECTIONS.map(s => s.id)))}>Expand All</button>
          <button className="btn-ems btn-ghost btn-sm" onClick={() => setOpen(new Set())}>Collapse All</button>
        </div>
      </div>

      <div style={{ position: 'relative', marginBottom: 16 }}>
        <MdSearch style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--ems-muted)' }} />
        <input className="form-control" style={{ paddingLeft: 32 }} placeholder="Filter sections…" value={query} onChange={e => setQuery(e.target.value)} />
      </div>

      {filtered.length === 0
        ? <div style={{ color: 'var(--ems-muted)', fontSize: 13, padding: '24px 0', textAlign: 'center' }}>No sections match "{query}"</div>
        : filtered.map(s => (
          <Section key={s.id} section={s} open={open.has(s.id)} onToggle={() => toggleSection(s.id)} />
        ))
      }
    </div>
  );
}
