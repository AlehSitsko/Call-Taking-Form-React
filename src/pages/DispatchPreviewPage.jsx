import { useState, useMemo } from 'react';
import { MdAirportShuttle, MdWarning, MdCheck, MdClose, MdInfoOutline, MdArrowForward, MdRefresh, MdAdd } from 'react-icons/md';
import { getCalls, setCalls, getUnits, setUnits, getEmployees } from '../data/demoData';
import { useNavigate } from 'react-router-dom';

// ── Constants (mirror production values exactly) ────────────────
const STATUS_COLORS = {
  available:     '#75b798',
  en_route:      '#6ea8fe',
  on_scene:      '#ffda6a',
  transporting:  '#c29ffa',
  at_destination:'#6edff6',
  out_of_service:'#ea868f',
};
const STATUS_BG = {
  available:      '#166534',
  en_route:       '#1d4ed8',
  on_scene:       '#854d0e',
  transporting:   '#5b21b6',
  at_destination: '#155e75',
  out_of_service: '#991b1b',
};
const STATUS_ORDER = ['available','en_route','on_scene','transporting','at_destination','out_of_service'];
const STATUS_LABELS = {
  available: 'Available', en_route: 'En Route', on_scene: 'On Scene',
  transporting: 'Transporting', at_destination: 'At Dest', out_of_service: 'Out of Service',
};

const TODAY = new Date().toISOString().slice(0, 10);

// ── Helpers ─────────────────────────────────────────────────────
function timeToMinutes(t) {
  if (!t) return 99999;
  const m = t.match(/(\d+):(\d+)/);
  return m ? parseInt(m[1]) * 60 + parseInt(m[2]) : 99999;
}

function empShortName(employees, id) {
  const e = employees.find(e => e.id === Number(id));
  return e ? `${e.firstName} ${e.lastName[0]}.` : null;
}

// ── Sub-components ───────────────────────────────────────────────

function StatusPill({ status, size = 'md' }) {
  const bg   = STATUS_BG[status]     || '#374151';
  const text = STATUS_COLORS[status] || '#e5e7eb';
  return (
    <span style={{
      display: 'inline-block',
      padding: size === 'sm' ? '1px 7px' : '3px 10px',
      borderRadius: 20,
      fontWeight: 700,
      fontSize: size === 'sm' ? 10 : 12,
      background: bg,
      color: text,
      border: `1px solid ${text}44`,
      whiteSpace: 'nowrap',
    }}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

function UnitTypeBadge({ unitType }) {
  const als = (unitType || '').toUpperCase() === 'ALS';
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: 6,
      fontWeight: 700,
      fontSize: 13,
      letterSpacing: 1,
      background: als ? 'rgba(29,78,216,0.15)' : 'rgba(22,101,52,0.15)',
      color: als ? '#1d4ed8' : '#166534',
      border: `1px solid ${als ? 'rgba(29,78,216,0.5)' : 'rgba(22,101,52,0.5)'}`,
    }}>
      {unitType || '—'}
    </span>
  );
}

function CallCard({ call, isSelected, onClick }) {
  const als = (call.serviceLevel || '').toUpperCase() === 'ALS';
  const isReturn = (call.callType || '').toLowerCase() === 'return';
  const accentColor = isReturn ? '#6ea8fe' : als ? '#1d4ed8' : 'var(--ems-board-tab-inactive)';

  return (
    <div
      onClick={onClick}
      style={{
        borderLeft: `3px solid ${isSelected ? 'var(--ems-primary)' : accentColor}`,
        background: isSelected ? 'rgba(13,110,253,0.12)' : 'var(--ems-board-bg-card)',
        borderRadius: 7,
        cursor: 'pointer',
        padding: '9px 10px 8px',
        marginBottom: 5,
        outline: isSelected ? '1px solid rgba(13,110,253,0.3)' : 'none',
        transition: 'all 0.12s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 4, marginBottom: 4 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ems-board-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 140 }}>
          {call.patientName || `Call #${call.id}`}
        </div>
        <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
          {isReturn && <span style={{ fontSize: 9, color: '#6ea8fe', background: 'rgba(13,110,253,0.15)', padding: '1px 5px', borderRadius: 3, fontWeight: 700 }}>RETURN</span>}
          <span style={{ fontSize: 9, color: als ? '#1d4ed8' : '#166534', background: als ? 'rgba(29,78,216,0.12)' : 'rgba(22,101,52,0.12)', border: `1px solid ${als ? 'rgba(29,78,216,0.4)' : 'rgba(22,101,52,0.4)'}`, borderRadius: 4, padding: '1px 5px', fontWeight: 700 }}>
            {als ? 'ALS' : 'BLS'}
          </span>
        </div>
      </div>
      {call.pickupTime && (
        <div style={{ fontSize: 11, color: 'var(--ems-board-text-muted)', marginBottom: 3 }}>
          🕐 {call.pickupTime}
        </div>
      )}
      {call.pickupAddress && (
        <div style={{ fontSize: 10, color: 'var(--ems-board-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {call.pickupAddress.split(',')[0]} <MdArrowForward style={{ fontSize: 9, verticalAlign: 'middle' }} /> {call.dropoffAddress?.split(',')[0]}
        </div>
      )}
    </div>
  );
}

function AssignedCallInline({ call, onComplete, onUnassign, unitStatus }) {
  const als = (call.serviceLevel || '').toUpperCase() === 'ALS';
  const isReturn = (call.callType || '').toLowerCase() === 'return';
  const borderColor = isReturn ? '#6ea8fe' : '#495057';

  return (
    <div style={{ background: 'var(--ems-board-bg)', borderRadius: 6, borderLeft: `3px solid ${borderColor}`, padding: '8px 10px', marginBottom: 4 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 2 }}>
            <span style={{ fontWeight: 700, color: 'var(--ems-board-text)', fontSize: 13 }}>
              {call.patientName || `Call #${call.id}`}
            </span>
            <span style={{ fontSize: 10, color: isReturn ? '#6ea8fe' : '#adb5bd', background: isReturn ? 'rgba(13,110,253,0.15)' : 'var(--ems-board-border)', padding: '1px 6px', borderRadius: 4 }}>
              {isReturn ? 'RETURN' : 'OUTBOUND'}
            </span>
            {als && (
              <span style={{ fontSize: 10, color: '#1d4ed8', background: 'rgba(29,78,216,0.12)', border: '1px solid rgba(29,78,216,0.4)', padding: '1px 5px', borderRadius: 4, fontWeight: 700 }}>ALS</span>
            )}
            {unitStatus && <StatusPill status={unitStatus} size="sm" />}
          </div>
          {call.pickupTime && (
            <div style={{ fontSize: 11, color: 'var(--ems-board-text-muted)' }}>🕐 {call.pickupTime}</div>
          )}
          {call.pickupAddress && (
            <div style={{ fontSize: 11, color: 'var(--ems-board-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {call.pickupAddress} → {call.dropoffAddress}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
          <button
            onClick={e => { e.stopPropagation(); onComplete(call.id); }}
            style={{ fontSize: 10, padding: '2px 8px', background: 'rgba(25,135,84,0.15)', color: '#75b798', border: '1px solid #75b79855', borderRadius: 5, cursor: 'pointer', fontWeight: 600 }}
          >✓ Done</button>
          <button
            onClick={e => { e.stopPropagation(); onUnassign(call.id); }}
            style={{ fontSize: 10, padding: '2px 8px', background: 'rgba(108,117,125,0.12)', color: 'var(--ems-board-text-muted)', border: '1px solid #49505755', borderRadius: 5, cursor: 'pointer' }}
          >Unassign</button>
        </div>
      </div>
    </div>
  );
}

function CompletedCallBadge({ call }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: 'var(--ems-board-bg-badge)', color: 'var(--ems-board-text-muted)',
      fontSize: 11, fontWeight: 600,
      border: '1px solid var(--ems-board-border)',
      borderRadius: 4, padding: '1px 6px',
      textDecoration: 'line-through', opacity: 0.6,
    }}>
      {call.patientName || `#${call.id}`}
    </span>
  );
}

// ── Main page ────────────────────────────────────────────────────

export default function DispatchPreviewPage() {
  const navigate = useNavigate();
  const [date, setDate]       = useState(TODAY);
  const [calls, setCallState] = useState(getCalls());
  const [units, setUnitState] = useState(getUnits());
  const employees             = getEmployees();
  const [pendingCall, setPendingCall] = useState(null);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [leftTab, setLeftTab] = useState('calls');

  function saveCalls(list) { setCalls(list); setCallState(list); }
  function saveUnits(list) { setUnits(list); setUnitState(list); }
  function refresh()       { setCallState(getCalls()); setUnitState(getUnits()); }

  const dayCalls = useMemo(() =>
    calls
      .filter(c => c.tripDate === date || c.dateOfCall === date)
      .sort((a, b) => timeToMinutes(a.pickupTime) - timeToMinutes(b.pickupTime)),
    [calls, date]);

  const dayUnits = useMemo(() =>
    units
      .filter(u => u.shiftDate === date)
      .sort((a, b) => (a.truckNumber || '').localeCompare(b.truckNumber || '')),
    [units, date]);

  const openCalls      = dayCalls.filter(c => c.status === 'new');
  const completedCalls = dayCalls.filter(c => c.status === 'completed');
  const activeCalls    = dayCalls.filter(c => c.status === 'assigned');

  const unitCallMap = useMemo(() => {
    const map = {};
    dayUnits.forEach(u => {
      const assigned = (u.assignedCallIds || []).map(id => calls.find(c => c.id === id)).filter(Boolean);
      map[u.id] = {
        active: assigned.filter(c => c.status !== 'completed'),
        done:   assigned.filter(c => c.status === 'completed'),
      };
    });
    return map;
  }, [dayUnits, calls]);

  function handleAssign(callId, unitId) {
    saveCalls(calls.map(c => c.id === callId ? { ...c, status: 'assigned' } : c));
    saveUnits(units.map(u =>
      u.id === unitId
        ? { ...u, assignedCallIds: [...new Set([...(u.assignedCallIds || []), callId])] }
        : u
    ));
    setPendingCall(null);
  }

  function handleUnassign(callId) {
    saveCalls(calls.map(c => c.id === callId ? { ...c, status: 'new' } : c));
    saveUnits(units.map(u => ({ ...u, assignedCallIds: (u.assignedCallIds || []).filter(id => id !== callId) })));
  }

  function handleComplete(callId) {
    saveCalls(calls.map(c => c.id === callId ? { ...c, status: 'completed' } : c));
  }

  function handleStatusChange(unitId, status) {
    saveUnits(units.map(u => u.id === unitId ? { ...u, status } : u));
  }

  function handleUnitRowClick(unit) {
    if (pendingCall) {
      handleAssign(pendingCall.id, unit.id);
    } else {
      setSelectedUnitId(prev => prev === unit.id ? null : unit.id);
    }
  }

  const hasAlsOnBls = (unit) => {
    const assigned = unitCallMap[unit.id]?.active || [];
    return unit.unitType === 'BLS' && assigned.some(c => (c.serviceLevel || '').toUpperCase() === 'ALS');
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: 'calc(100vh - var(--topbar-height))',
      overflow: 'hidden',
      background: 'var(--ems-board-bg)',
      margin: '-24px',
    }}>

      {/* Board header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
        padding: '10px 16px',
        background: 'var(--ems-board-bg-header)',
        borderBottom: '1px solid var(--ems-board-border)',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ems-board-text)' }}>Dispatch Board</span>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 6, marginLeft: 4 }}>
          {[
            { label: 'Queue',  value: openCalls.length,      color: openCalls.length > 0 ? '#ffda6a' : 'var(--ems-board-tab-inactive)' },
            { label: 'Active', value: activeCalls.length,    color: '#6ea8fe' },
            { label: 'Done',   value: completedCalls.length, color: '#75b798' },
            { label: 'Units',  value: dayUnits.length,       color: 'var(--ems-board-text-muted)' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'var(--ems-board-bg-badge)', border: '1px solid var(--ems-board-border)',
              borderRadius: 8, padding: '3px 10px', textAlign: 'center', minWidth: 52,
            }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: s.color, lineHeight: 1.2 }}>{s.value}</div>
              <div style={{ fontSize: 9, color: 'var(--ems-board-tab-inactive)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{
              background: 'var(--ems-board-bg-input)', border: '1px solid var(--ems-board-border)',
              borderRadius: 6, color: 'var(--ems-board-text)', fontSize: 12, padding: '4px 8px',
            }}
          />
          <button
            onClick={() => navigate('/call-intake')}
            style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, padding: '5px 12px', background: 'rgba(13,110,253,0.18)', color: '#6ea8fe', border: '1px solid #6ea8fe55', borderRadius: 6, cursor: 'pointer' }}
          >
            <MdAdd style={{ fontSize: 14 }} /> New Call
          </button>
          <button onClick={refresh} title="Refresh"
            style={{ background: 'transparent', border: '1px solid var(--ems-board-border)', borderRadius: 6, color: 'var(--ems-board-text-muted)', cursor: 'pointer', padding: '5px 7px', display: 'flex', alignItems: 'center' }}
          >
            <MdRefresh style={{ fontSize: 15 }} />
          </button>
        </div>
      </div>

      {/* Demo notice */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 8, padding: '7px 16px',
        background: 'rgba(13,110,253,0.08)', borderBottom: '1px solid rgba(13,110,253,0.18)',
        fontSize: 12, color: '#6ea8fe', flexShrink: 0,
      }}>
        <MdInfoOutline style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }} />
        <span>
          <strong>Demo mode:</strong> click a call to select it, then click a unit row to assign.
          Production adds <strong>drag-and-drop</strong>, <strong>WebSocket live updates</strong>,
          per-unit call priority reordering, overdue alerts, and lifecycle timestamps (dispatched → on scene → transporting).
        </span>
      </div>

      {/* Pending call banner */}
      {pendingCall && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '7px 16px',
          background: 'rgba(13,110,253,0.15)', borderBottom: '1px solid rgba(13,110,253,0.3)',
          fontSize: 13, flexShrink: 0,
        }}>
          <MdAirportShuttle style={{ color: '#6ea8fe', fontSize: 16 }} />
          <span style={{ fontWeight: 700, color: '#6ea8fe' }}>{pendingCall.pickupTime} · {pendingCall.patientName}</span>
          <span style={{ color: 'var(--ems-board-text-muted)' }}>— click a unit row to assign</span>
          <button
            onClick={() => setPendingCall(null)}
            style={{ marginLeft: 'auto', background: 'transparent', border: '1px solid #2a3347', borderRadius: 5, color: 'var(--ems-board-text-muted)', cursor: 'pointer', padding: '2px 10px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <MdClose /> Cancel
          </button>
        </div>
      )}

      {/* Main body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Left: call queue */}
        <div style={{
          width: 270, flexShrink: 0,
          background: 'var(--ems-board-bg-left)',
          borderRight: '1px solid var(--ems-board-border)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          {/* Tab toggle */}
          <div style={{ padding: '10px 10px 0', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 3, background: 'var(--ems-board-bg)', borderRadius: 8, padding: 3, marginBottom: 8 }}>
              {[
                { key: 'calls',     label: 'Queue', count: openCalls.length },
                { key: 'completed', label: 'Done',  count: completedCalls.length },
              ].map(({ key, label, count }) => (
                <button key={key} onClick={() => setLeftTab(key)} style={{
                  flex: 1, padding: '4px 2px', fontSize: 11, fontWeight: 700, letterSpacing: 0.3,
                  border: 'none', borderRadius: 6, cursor: 'pointer',
                  background: leftTab === key ? 'var(--ems-board-bg-badge)' : 'transparent',
                  color: leftTab === key ? 'var(--ems-board-text)' : 'var(--ems-board-tab-inactive)',
                  transition: 'all 0.15s',
                }}>
                  {label}
                  <span style={{ marginLeft: 4, background: 'var(--ems-board-bg-badge)', color: '#475569', borderRadius: 8, padding: '0 5px', fontSize: 9 }}>{count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '4px 8px 8px' }}>
            {leftTab === 'calls' && (
              openCalls.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 8px', color: 'var(--ems-board-tab-inactive)' }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>✓</div>
                  <div style={{ fontSize: 11 }}>All calls assigned</div>
                </div>
              ) : openCalls.map(c => (
                <CallCard
                  key={c.id}
                  call={c}
                  isSelected={pendingCall?.id === c.id}
                  onClick={() => setPendingCall(prev => prev?.id === c.id ? null : c)}
                />
              ))
            )}
            {leftTab === 'completed' && (
              completedCalls.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 8px', color: 'var(--ems-board-tab-inactive)', fontSize: 11 }}>No completed calls today</div>
              ) : completedCalls.map(c => (
                <div key={c.id} style={{ opacity: 0.5, marginBottom: 5 }}>
                  <div style={{ borderLeft: '3px solid #495057', background: 'var(--ems-board-bg-card)', borderRadius: 7, padding: '8px 10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 600, color: 'var(--ems-board-text-muted)', fontSize: 13, textDecoration: 'line-through' }}>
                        {c.patientName || `Call #${c.id}`}
                      </span>
                      <span style={{ fontSize: 10, color: 'var(--ems-board-text-muted)', background: 'var(--ems-board-border)', padding: '1px 6px', borderRadius: 4 }}>COMPLETED</span>
                      {c.pickupTime && <span style={{ color: 'var(--ems-board-text-muted)', fontSize: 11 }}>🕐 {c.pickupTime}</span>}
                    </div>
                    {c.pickupAddress && (
                      <div style={{ fontSize: 10, color: 'var(--ems-board-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>
                        {c.pickupAddress} → {c.dropoffAddress}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: units table */}
        <div style={{ flex: 1, overflow: 'auto', background: 'var(--ems-board-bg)' }}>
          {dayUnits.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 24px', color: 'var(--ems-board-tab-inactive)' }}>
              <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.3 }}>🚑</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ems-board-text-muted)', marginBottom: 6 }}>No units scheduled for {date}</div>
              <div style={{ fontSize: 12 }}>Go to Crew Planner to add units and assign crew.</div>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead style={{ position: 'sticky', top: 0, background: 'var(--ems-board-bg-header)', zIndex: 1 }}>
                <tr>
                  {['Unit', 'Type', 'Status', 'Crew', 'Assigned Calls', ''].map((h, i) => (
                    <th key={i} style={{
                      padding: '10px 12px', textAlign: 'left',
                      color: 'var(--ems-board-text)', fontWeight: 600, fontSize: 11,
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                      borderBottom: '1px solid var(--ems-board-border)',
                      width: i === 0 ? 80 : i === 1 ? 110 : i === 2 ? 160 : i === 3 ? 200 : i === 5 ? 90 : undefined,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dayUnits.map(unit => {
                  const isSelected   = selectedUnitId === unit.id;
                  const { active: assignedActive, done: assignedDone } = unitCallMap[unit.id] || { active: [], done: [] };
                  const driver       = empShortName(employees, unit.driverId);
                  const medical      = empShortName(employees, unit.medicalId);
                  const als          = (unit.unitType || '').toUpperCase() === 'ALS';
                  const alsOnBls     = hasAlsOnBls(unit);

                  return (
                    <tbody key={unit.id}>
                      {/* Unit row */}
                      <tr
                        onClick={() => handleUnitRowClick(unit)}
                        title={pendingCall ? 'Click to assign selected call' : 'Click to expand/select'}
                        style={{
                          cursor: 'pointer',
                          background: isSelected ? 'rgba(13,110,253,0.10)' : 'var(--ems-board-bg)',
                          borderLeft: isSelected ? '3px solid #6ea8fe' : '3px solid transparent',
                          transition: 'background 0.12s',
                        }}
                      >
                        <td style={{ padding: '12px 12px', fontWeight: 700, color: 'var(--ems-board-text)', fontSize: 15, borderBottom: '1px solid var(--ems-board-border-light)' }}>
                          {unit.truckNumber || '—'}
                        </td>
                        <td style={{ padding: '12px 12px', borderBottom: '1px solid var(--ems-board-border-light)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <UnitTypeBadge unitType={unit.unitType} />
                            {alsOnBls && (
                              <span style={{ fontSize: 9, color: '#ffda6a', background: 'rgba(255,218,106,0.15)', border: '1px solid rgba(255,218,106,0.3)', borderRadius: 4, padding: '1px 5px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2 }}>
                                <MdWarning style={{ fontSize: 9 }} />ALS
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '12px 12px', borderBottom: '1px solid var(--ems-board-border-light)' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <StatusPill status={unit.status || 'available'} />
                            {pendingCall && !isSelected && (
                              <span style={{ fontSize: 9, color: '#ffc107', background: 'rgba(255,193,7,0.12)', padding: '1px 6px', borderRadius: 4, width: 'fit-content' }}>
                                ← assign here
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '12px 12px', borderBottom: '1px solid var(--ems-board-border-light)' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {driver  && <span style={{ fontSize: 11, color: 'var(--ems-board-text)', lineHeight: 1.3 }}><span style={{ fontSize: 10, color: 'var(--ems-board-text-muted)', marginRight: 3 }}>DRV</span>{driver}</span>}
                            {medical && <span style={{ fontSize: 11, color: 'var(--ems-board-text)', lineHeight: 1.3 }}><span style={{ fontSize: 10, color: 'var(--ems-board-text-muted)', marginRight: 3 }}>{als ? 'MED' : 'EMT'}</span>{medical}</span>}
                            {!driver && !medical && <span style={{ fontSize: 11, color: 'var(--ems-board-tab-inactive)' }}>No crew</span>}
                            {unit.startTime && <span style={{ fontSize: 10, color: 'var(--ems-board-tab-inactive)' }}>Shift: {unit.startTime}</span>}
                          </div>
                        </td>
                        <td style={{ padding: '12px 12px', borderBottom: '1px solid var(--ems-board-border-light)' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
                            {assignedActive.map(c => (
                              <span key={c.id} style={{ fontSize: 11, fontWeight: 600, background: 'var(--ems-board-bg-badge)', color: 'var(--ems-board-text)', border: '1px solid var(--ems-board-border)', borderRadius: 4, padding: '1px 7px' }}>
                                {c.patientName || `#${c.id}`}
                                {c.pickupTime && <span style={{ color: 'var(--ems-board-text-muted)', marginLeft: 4 }}>🕐{c.pickupTime}</span>}
                              </span>
                            ))}
                            {assignedDone.map(c => <CompletedCallBadge key={c.id} call={c} />)}
                            {assignedActive.length === 0 && assignedDone.length === 0 && (
                              <span style={{ fontSize: 11, color: 'var(--ems-board-tab-inactive)' }}>—</span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '12px 8px', borderBottom: '1px solid var(--ems-board-border-light)' }}>
                          <select
                            value={unit.status || 'available'}
                            onChange={e => { e.stopPropagation(); handleStatusChange(unit.id, e.target.value); }}
                            onClick={e => e.stopPropagation()}
                            style={{
                              background: 'var(--ems-board-bg-input)', border: '1px solid var(--ems-board-border)',
                              borderRadius: 6, color: 'var(--ems-board-text-muted)', fontSize: 11, padding: '3px 6px', cursor: 'pointer', width: 90,
                            }}
                          >
                            {STATUS_ORDER.map(k => <option key={k} value={k}>{STATUS_LABELS[k]}</option>)}
                          </select>
                        </td>
                      </tr>

                      {/* Expanded sub-rows when unit selected */}
                      {isSelected && assignedActive.length > 0 && (
                        <tr style={{ background: 'var(--ems-board-bg-card-alt)' }}>
                          <td colSpan={6} style={{ padding: '0 12px 12px 32px', borderBottom: '1px solid var(--ems-board-border)' }}>
                            <div style={{ paddingTop: 8, maxWidth: 640 }}>
                              {assignedActive.map(c => (
                                <AssignedCallInline
                                  key={c.id}
                                  call={c}
                                  unitStatus={unit.status}
                                  onComplete={handleComplete}
                                  onUnassign={handleUnassign}
                                />
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}

                      {/* Assign confirm row when pending call + unit selected */}
                      {isSelected && pendingCall && (
                        <tr style={{ background: 'rgba(13,110,253,0.06)' }}>
                          <td colSpan={6} style={{ padding: '8px 12px 10px 32px', borderBottom: '1px solid var(--ems-board-border)' }}>
                            <button
                              onClick={() => handleAssign(pendingCall.id, unit.id)}
                              style={{ fontSize: 12, fontWeight: 700, padding: '6px 20px', background: 'rgba(13,110,253,0.2)', color: '#6ea8fe', border: '1px solid #6ea8fe55', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                            >
                              <MdCheck /> Assign {pendingCall.patientName} to {unit.truckNumber}
                            </button>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
