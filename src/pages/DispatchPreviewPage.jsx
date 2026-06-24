import { useState, useMemo } from 'react';
import {
  MdAirportShuttle, MdWarning, MdCheck, MdClose, MdInfoOutline,
  MdArrowForward, MdRefresh,
} from 'react-icons/md';
import {
  getCalls, setCalls, getUnits, setUnits, getEmployees,
  SERVICE_LEVEL_BADGE, UNIT_STATUS_LABELS, UNIT_STATUS_BADGE,
} from '../data/demoData';
import DetailsDrawer from '../components/ui/DetailsDrawer';
import EmptyState from '../components/ui/EmptyState';

const TODAY = new Date().toISOString().slice(0, 10);

/* ── helpers ──────────────────────────────────────────────────── */

function empName(employees, id) {
  const e = employees.find(e => e.id === Number(id));
  return e ? `${e.firstName} ${e.lastName[0]}.` : null;
}

const STATUS_BORDER = {
  available:     '#3fb950',
  en_route:      '#4493f8',
  on_scene:      '#d29922',
  transporting:  '#4493f8',
  at_destination:'#3fb950',
  out_of_service:'#f85149',
};

const STATUS_ORDER = ['available','en_route','on_scene','transporting','at_destination','out_of_service'];

/* ── Sub-components ───────────────────────────────────────────── */

function CallQueueCard({ call, onClick, isSelected }) {
  const svcCls = SERVICE_LEVEL_BADGE[call.serviceLevel] || 'badge-neutral';
  return (
    <div
      onClick={onClick}
      style={{
        background: isSelected ? 'var(--ems-primary-soft)' : 'var(--ems-surface)',
        border: `1px solid ${isSelected ? 'var(--ems-primary)' : 'var(--ems-border)'}`,
        borderLeft: `3px solid ${isSelected ? 'var(--ems-primary)' : 'var(--ems-border)'}`,
        borderRadius: 8,
        padding: '10px 12px',
        cursor: 'pointer',
        marginBottom: 6,
        transition: 'all 0.13s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ems-primary)', fontVariantNumeric: 'tabular-nums' }}>
          {call.pickupTime || '—:—'}
        </span>
        <span className={`badge-ems ${svcCls}`} style={{ fontSize: 10 }}>{call.serviceLevel}</span>
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ems-text)', marginBottom: 3 }}>
        {call.patientName || 'Unknown Patient'}
      </div>
      <div style={{ fontSize: 11, color: 'var(--ems-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {call.pickupAddress?.split(',')[0]}
        </span>
        <MdArrowForward style={{ flexShrink: 0, fontSize: 10 }} />
        <span style={{ maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {call.dropoffAddress?.split(',')[0]}
        </span>
      </div>
      {call.returnRide && (
        <div style={{ marginTop: 4, fontSize: 10, color: 'var(--ems-warning)', fontWeight: 600 }}>↩ Return ride</div>
      )}
    </div>
  );
}

function UnitCard({ unit, calls, employees, onAssign, onUnassign, onComplete, onStatusChange, pendingCallId }) {
  const driver  = empName(employees, unit.driverId);
  const medical = empName(employees, unit.medicalId);
  const assist1 = empName(employees, unit.assist1Id);
  const assist2 = empName(employees, unit.assist2Id);
  const crew    = [driver, medical, assist1, assist2].filter(Boolean);

  const unitCalls = (unit.assignedCallIds || [])
    .map(cid => calls.find(c => c.id === cid))
    .filter(Boolean);

  const borderColor = STATUS_BORDER[unit.status] || 'var(--ems-border)';
  const isOOS = unit.status === 'out_of_service';
  const hasAlsOnBls = unit.unitType === 'BLS' && unitCalls.some(c => c.serviceLevel === 'ALS');

  return (
    <div style={{
      background: 'var(--ems-surface)',
      border: '1px solid var(--ems-border)',
      borderLeft: `4px solid ${borderColor}`,
      borderRadius: 10,
      marginBottom: 12,
      overflow: 'hidden',
      opacity: isOOS ? 0.6 : 1,
    }}>
      {/* Unit header */}
      <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--ems-border)', background: 'var(--ems-surface-2)' }}>
        <span style={{ fontSize: 20 }}>🚑</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ems-text)' }}>
              {unit.truckNumber || 'Unnamed'}
            </span>
            <span className={`badge-ems ${unit.unitType === 'ALS' ? 'badge-als' : 'badge-bls'}`}>
              {unit.unitType}
            </span>
            {hasAlsOnBls && (
              <span className="badge-ems badge-warning" style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <MdWarning style={{ fontSize: 11 }} /> ALS on BLS
              </span>
            )}
          </div>
          <div style={{ fontSize: 12, color: 'var(--ems-muted)', marginTop: 2 }}>
            {crew.length > 0 ? crew.join(' · ') : 'No crew assigned'}
            {unit.startTime && ` · Shift: ${unit.startTime}`}
          </div>
        </div>
        {/* Status selector */}
        <div style={{ position: 'relative' }}>
          <select
            value={unit.status || 'available'}
            onChange={e => onStatusChange(unit.id, e.target.value)}
            style={{
              background: 'var(--ems-surface)',
              border: `1px solid ${borderColor}`,
              borderRadius: 20,
              color: borderColor,
              fontSize: 11,
              fontWeight: 600,
              padding: '3px 22px 3px 8px',
              cursor: 'pointer',
              outline: 'none',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5'%3E%3Cpath d='M0 0l4 5 4-5z' fill='%238b949e'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 7px center',
            }}
          >
            {STATUS_ORDER.map(k => (
              <option key={k} value={k}>{UNIT_STATUS_LABELS[k]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Assigned calls */}
      <div style={{ padding: '10px 14px' }}>
        {unitCalls.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {pendingCallId ? (
              <button
                className="btn-ems btn-primary btn-sm"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => onAssign(pendingCallId, unit.id)}
                disabled={isOOS}
              >
                <MdCheck /> Assign selected call here
              </button>
            ) : (
              <div style={{ fontSize: 12, color: 'var(--ems-subtle)', width: '100%', textAlign: 'center', padding: '4px 0' }}>
                No calls assigned · {isOOS ? 'Out of service' : 'Available'}
              </div>
            )}
          </div>
        ) : (
          <>
            {unitCalls.map(c => (
              <div key={c.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 10px',
                marginBottom: 6,
                background: 'var(--ems-surface-2)',
                border: '1px solid var(--ems-border)',
                borderRadius: 7,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ems-primary)', fontVariantNumeric: 'tabular-nums' }}>
                      {c.pickupTime || '—:—'}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ems-text)' }}>{c.patientName}</span>
                    <span className={`badge-ems ${SERVICE_LEVEL_BADGE[c.serviceLevel] || 'badge-neutral'}`} style={{ fontSize: 10 }}>
                      {c.serviceLevel}
                    </span>
                    {c.returnRide && <span style={{ fontSize: 10, color: 'var(--ems-warning)' }}>↩</span>}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--ems-muted)' }}>
                    {c.pickupAddress?.split(',').slice(0, 2).join(',').trim()}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                  <button className="btn-ems btn-success btn-sm" onClick={() => onComplete(c.id)} title="Mark complete">
                    <MdCheck />
                  </button>
                  <button className="btn-ems btn-ghost btn-sm" onClick={() => onUnassign(c.id)} title="Unassign">
                    <MdClose />
                  </button>
                </div>
              </div>
            ))}
            {pendingCallId && !isOOS && (
              <button
                className="btn-ems btn-ghost btn-sm"
                style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}
                onClick={() => onAssign(pendingCallId, unit.id)}
              >
                + Add selected call
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ── Main page ────────────────────────────────────────────────── */

export default function DispatchPreviewPage() {
  const [date, setDate]       = useState(TODAY);
  const [calls, setCallState] = useState(getCalls());
  const [units, setUnitState] = useState(getUnits());
  const employees             = getEmployees();
  const [pendingCall, setPendingCall] = useState(null);  // call selected for assignment
  const [selectedUnit, setSelectedUnit] = useState(null);

  function saveCalls(list) { setCalls(list); setCallState(list); }
  function saveUnits(list) { setUnits(list); setUnitState(list); }
  function refresh()       { setCallState(getCalls()); setUnitState(getUnits()); }

  const dayCalls = useMemo(() =>
    calls
      .filter(c => c.tripDate === date || c.dateOfCall === date)
      .sort((a, b) => (a.pickupTime || '').localeCompare(b.pickupTime || '')),
    [calls, date]);

  const dayUnits = useMemo(() =>
    units
      .filter(u => u.shiftDate === date)
      .sort((a, b) => (a.truckNumber || '').localeCompare(b.truckNumber || '')),
    [units, date]);

  const unassigned = dayCalls.filter(c => c.status === 'new');
  const assigned   = dayCalls.filter(c => c.status === 'assigned');
  const completed  = dayCalls.filter(c => c.status === 'completed');

  const unitCallMap = useMemo(() => {
    const map = {};
    dayUnits.forEach(u => {
      map[u.id] = (u.assignedCallIds || [])
        .map(cid => calls.find(c => c.id === cid))
        .filter(Boolean);
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
    saveUnits(units.map(u => ({
      ...u,
      assignedCallIds: (u.assignedCallIds || []).filter(id => id !== callId),
    })));
  }

  function handleComplete(callId) {
    saveCalls(calls.map(c => c.id === callId ? { ...c, status: 'completed' } : c));
    saveUnits(units.map(u => ({
      ...u,
      assignedCallIds: (u.assignedCallIds || []).filter(id => id !== callId),
    })));
  }

  function handleStatusChange(unitId, status) {
    const updated = units.map(u => u.id === unitId ? { ...u, status } : u);
    saveUnits(updated);
    setSelectedUnit(prev => prev?.id === unitId ? { ...prev, status } : prev);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - var(--topbar-height) - 1px)', overflow: 'hidden', margin: '-24px', padding: '16px 20px 0' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap', flexShrink: 0 }}>
        <div style={{ flex: 1 }}>
          <div className="page-title" style={{ marginBottom: 0 }}>Dispatch Board</div>
          <div className="page-subtitle">Click a call to select it, then assign to a unit</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Stats */}
          {[
            { label: 'Queue',     value: unassigned.length, color: unassigned.length > 0 ? 'var(--ems-warning)' : 'var(--ems-muted)' },
            { label: 'Active',    value: assigned.length,   color: 'var(--ems-primary)' },
            { label: 'Done',      value: completed.length,  color: 'var(--ems-success)' },
            { label: 'Units',     value: dayUnits.length,   color: 'var(--ems-text)' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--ems-surface)', border: '1px solid var(--ems-border)', borderRadius: 8, padding: '5px 12px', textAlign: 'center', minWidth: 58 }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: s.color, lineHeight: 1.2 }}>{s.value}</div>
              <div style={{ fontSize: 10, color: 'var(--ems-muted)' }}>{s.label}</div>
            </div>
          ))}
          <input type="date" className="form-control" style={{ width: 148 }} value={date} onChange={e => setDate(e.target.value)} />
          <button className="btn-ems btn-ghost btn-sm" onClick={refresh} title="Refresh"><MdRefresh style={{ fontSize: 16 }} /></button>
        </div>
      </div>

      {/* Demo notice */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 12px',
        background: 'var(--ems-primary-soft)', border: '1px solid rgba(13,110,253,0.18)',
        borderRadius: 7, fontSize: 12, color: 'var(--ems-primary)', marginBottom: 12, flexShrink: 0,
      }}>
        <MdInfoOutline style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }} />
        <span>
          <strong>Demo mode:</strong> click a call in the queue to select it, then click a unit to assign.
          The production system supports <strong>drag-and-drop</strong>, <strong>WebSocket live updates</strong>,
          lifecycle timestamps (dispatched → on scene → transporting), and <strong>ALS-on-BLS alerts</strong>.
        </span>
      </div>

      {/* Board */}
      <div style={{ display: 'flex', gap: 14, flex: 1, overflow: 'hidden', paddingBottom: 16 }}>

        {/* Left: Call queue */}
        <div style={{
          width: 264, flexShrink: 0,
          background: 'var(--ems-surface)',
          border: '1px solid var(--ems-border)',
          borderRadius: 10, display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          <div style={{
            padding: '10px 12px', background: 'var(--ems-surface-2)',
            borderBottom: '1px solid var(--ems-border)', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ems-muted)' }}>
              Call Queue
            </span>
            <span className={`badge-ems ${unassigned.length > 0 ? 'badge-warning' : 'badge-neutral'}`} style={{ fontSize: 10 }}>
              {unassigned.length}
            </span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 10 }}>
            {unassigned.length === 0 ? (
              <div style={{ paddingTop: 32, textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.3 }}>✅</div>
                <div style={{ fontSize: 13, color: 'var(--ems-muted)' }}>All calls assigned</div>
              </div>
            ) : unassigned.map(c => (
              <CallQueueCard
                key={c.id}
                call={c}
                isSelected={pendingCall?.id === c.id}
                onClick={() => setPendingCall(prev => prev?.id === c.id ? null : c)}
              />
            ))}
          </div>

          {/* Completed section at bottom */}
          {completed.length > 0 && (
            <div style={{ borderTop: '1px solid var(--ems-border)', padding: '8px 10px', background: 'var(--ems-surface-2)' }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ems-muted)', marginBottom: 5 }}>
                Completed today — {completed.length}
              </div>
              {completed.map(c => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0', borderBottom: '1px solid var(--ems-border)' }}>
                  <MdCheck style={{ color: 'var(--ems-success)', fontSize: 13, flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: 'var(--ems-muted)' }}>{c.pickupTime || '—'} · {c.patientName}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Units */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {pendingCall && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
              background: 'linear-gradient(135deg, rgba(13,110,253,0.1), rgba(13,110,253,0.05))',
              border: '1px solid rgba(13,110,253,0.25)', borderRadius: 8, marginBottom: 12,
              fontSize: 13,
            }}>
              <MdAirportShuttle style={{ color: 'var(--ems-primary)', fontSize: 16 }} />
              <span style={{ fontWeight: 600, color: 'var(--ems-primary)' }}>
                {pendingCall.pickupTime} · {pendingCall.patientName}
              </span>
              <span style={{ color: 'var(--ems-muted)' }}>selected — click a unit card or button below to assign</span>
              <button className="btn-ems btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={() => setPendingCall(null)}>
                <MdClose /> Cancel
              </button>
            </div>
          )}

          {dayUnits.length === 0 ? (
            <EmptyState
              icon="🚑"
              title="No units scheduled for this date"
              description="Go to Crew Planner to add units and assign crew."
            />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 0 }}>
              {dayUnits.map(unit => (
                <UnitCard
                  key={unit.id}
                  unit={unit}
                  calls={unitCallMap[unit.id] || []}
                  employees={employees}
                  onAssign={handleAssign}
                  onUnassign={handleUnassign}
                  onComplete={handleComplete}
                  onStatusChange={handleStatusChange}
                  pendingCallId={pendingCall?.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
