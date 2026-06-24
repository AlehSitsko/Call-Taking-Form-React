import { useState, useMemo } from 'react';
import { getCalls, setCalls, getUnits, setUnits, getEmployees, SERVICE_LEVEL_BADGE, UNIT_STATUS_LABELS, UNIT_STATUS_BADGE } from '../data/demoData';
import DetailsDrawer from '../components/ui/DetailsDrawer';
import EmptyState from '../components/ui/EmptyState';

const TODAY = new Date().toISOString().slice(0, 10);

function empName(employees, id) {
  const e = employees.find(e => e.id === Number(id));
  return e ? `${e.firstName} ${e.lastName[0]}.` : '—';
}

export default function DispatchPreviewPage() {
  const [date, setDate] = useState(TODAY);
  const [calls, setCallState] = useState(getCalls());
  const [units, setUnitState] = useState(getUnits());
  const employees = getEmployees();
  const [selectedCall, setSelectedCall] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);

  function saveCalls(list) { setCalls(list); setCallState(list); }
  function saveUnits(list) { setUnits(list); setUnitState(list); }

  const dayCalls = useMemo(() => calls.filter(c => c.tripDate === date || c.dateOfCall === date).sort((a, b) => (a.pickupTime || '').localeCompare(b.pickupTime || '')), [calls, date]);
  const dayUnits = useMemo(() => units.filter(u => u.shiftDate === date), [units, date]);

  const unassigned = dayCalls.filter(c => c.status === 'new');
  const assigned   = dayCalls.filter(c => c.status === 'assigned');
  const completed  = dayCalls.filter(c => c.status === 'completed');

  function assignCall(callId, unitId) {
    const updatedCalls = calls.map(c => c.id === callId ? { ...c, status: 'assigned' } : c);
    const updatedUnits = units.map(u => u.id === unitId ? { ...u, assignedCallIds: [...(u.assignedCallIds || []), callId] } : u);
    saveCalls(updatedCalls);
    saveUnits(updatedUnits);
    setSelectedCall(null);
  }

  function unassignCall(callId) {
    const updatedCalls = calls.map(c => c.id === callId ? { ...c, status: 'new' } : c);
    const updatedUnits = units.map(u => ({ ...u, assignedCallIds: (u.assignedCallIds || []).filter(id => id !== callId) }));
    saveCalls(updatedCalls);
    saveUnits(updatedUnits);
  }

  function completeCall(callId) {
    saveCalls(calls.map(c => c.id === callId ? { ...c, status: 'completed' } : c));
  }

  function updateUnitStatus(unitId, status) {
    saveUnits(units.map(u => u.id === unitId ? { ...u, status } : u));
    setSelectedUnit(prev => prev?.id === unitId ? { ...prev, status } : prev);
  }

  const unitCallMap = useMemo(() => {
    const map = {};
    dayUnits.forEach(u => {
      map[u.id] = (u.assignedCallIds || []).map(cid => calls.find(c => c.id === cid)).filter(Boolean);
    });
    return map;
  }, [dayUnits, calls]);

  const callSvc = (c) => SERVICE_LEVEL_BADGE[c.serviceLevel] || 'badge-neutral';

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dispatch Preview</div>
          <div className="page-subtitle">Unit assignments · read-only view with manual assign</div>
        </div>
        <input type="date" className="form-control" style={{ width: 160 }} value={date} onChange={e => setDate(e.target.value)} />
      </div>

      {/* Stats bar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        {[['Unassigned', unassigned.length, 'var(--ems-muted)'], ['Assigned', assigned.length, 'var(--ems-primary)'], ['Completed', completed.length, 'var(--ems-success)'], ['Units', dayUnits.length, 'var(--ems-text)']].map(([l, v, color]) => (
          <div key={l} style={{ background: 'var(--ems-surface)', border: '1px solid var(--ems-border)', borderRadius: 8, padding: '8px 14px' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color }}>{v}</div>
            <div style={{ fontSize: 11, color: 'var(--ems-muted)' }}>{l}</div>
          </div>
        ))}
      </div>

      <div className="board-layout" style={{ height: 'auto', minHeight: 400 }}>
        {/* Left: Unassigned calls */}
        <div className="board-col">
          <div className="board-col-header">
            Unassigned Calls
            <span className="badge-ems badge-neutral" style={{ fontSize: 11 }}>{unassigned.length}</span>
          </div>
          <div className="board-col-body">
            {unassigned.length === 0 ? (
              <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--ems-muted)', fontSize: 13 }}>No unassigned calls</div>
            ) : unassigned.map(c => (
              <div key={c.id} className="call-card" onClick={() => setSelectedCall(c)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <div className="call-time">{c.pickupTime || '—:—'}</div>
                  <span className={`badge-ems ${callSvc(c)}`} style={{ fontSize: 10 }}>{c.serviceLevel}</span>
                </div>
                <div className="call-name">{c.patientName || 'Unknown'}</div>
                <div className="call-route">{c.pickupAddress?.split(',')[0]} → {c.dropoffAddress?.split(',')[0]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Units */}
        <div className="board-col">
          <div className="board-col-header">
            Units on Shift
            <span className="badge-ems badge-neutral" style={{ fontSize: 11 }}>{dayUnits.length}</span>
          </div>
          <div className="board-col-body">
            {dayUnits.length === 0 ? (
              <EmptyState icon="🚑" title="No units scheduled" description="Add units in Crew Planner." />
            ) : dayUnits.map(unit => {
              const unitCalls = unitCallMap[unit.id] || [];
              return (
                <div key={unit.id} className="unit-card" onClick={() => setSelectedUnit(unit)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="unit-truck">🚑 {unit.truckNumber || 'No #'}</div>
                      <span className={`badge-ems ${unit.unitType === 'ALS' ? 'badge-als' : 'badge-bls'}`}>{unit.unitType}</span>
                    </div>
                    <span className={`badge-ems ${UNIT_STATUS_BADGE[unit.status] || 'badge-neutral'}`} style={{ fontSize: 10 }}>
                      {UNIT_STATUS_LABELS[unit.status] || unit.status}
                    </span>
                  </div>
                  <div className="unit-meta">
                    {empName(employees, unit.driverId)} / {empName(employees, unit.medicalId)}
                  </div>
                  {unitCalls.length > 0 && (
                    <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {unitCalls.map(c => (
                        <div key={c.id} style={{ background: 'var(--ems-surface-3)', borderRadius: 4, padding: '5px 8px', fontSize: 12 }}>
                          <span style={{ color: 'var(--ems-primary)', fontWeight: 600 }}>{c.pickupTime || '—'}</span>
                          <span style={{ marginLeft: 6 }}>{c.patientName}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Assign call drawer */}
      <DetailsDrawer
        open={!!selectedCall}
        onClose={() => setSelectedCall(null)}
        title={selectedCall?.patientName || 'Call'}
        subtitle={selectedCall ? `${selectedCall.pickupTime || '—'} · ${selectedCall.serviceLevel}` : ''}
      >
        {selectedCall && (
          <div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: 'var(--ems-muted)' }}>Pickup</div>
              <div style={{ fontSize: 13 }}>{selectedCall.pickupAddress || '—'}</div>
              <div style={{ fontSize: 12, color: 'var(--ems-muted)', marginTop: 8 }}>Dropoff</div>
              <div style={{ fontSize: 13 }}>{selectedCall.dropoffAddress || '—'}</div>
            </div>
            <div className="section-label">Assign to Unit</div>
            {dayUnits.filter(u => u.status !== 'out_of_service').map(unit => (
              <div key={unit.id} className="ems-card clickable" style={{ marginBottom: 8 }} onClick={() => assignCall(selectedCall.id, unit.id)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontWeight: 600 }}>🚑 {unit.truckNumber}</span>
                    <span className={`badge-ems ${unit.unitType === 'ALS' ? 'badge-als' : 'badge-bls'} ms-2`} style={{ marginLeft: 8 }}>{unit.unitType}</span>
                  </div>
                  <span className={`badge-ems ${UNIT_STATUS_BADGE[unit.status] || 'badge-neutral'}`} style={{ fontSize: 10 }}>{UNIT_STATUS_LABELS[unit.status]}</span>
                </div>
              </div>
            ))}
            {dayUnits.length === 0 && <div style={{ color: 'var(--ems-muted)', fontSize: 13 }}>No units available for this date.</div>}
          </div>
        )}
      </DetailsDrawer>

      {/* Unit detail drawer */}
      <DetailsDrawer
        open={!!selectedUnit}
        onClose={() => setSelectedUnit(null)}
        title={selectedUnit ? `🚑 ${selectedUnit.truckNumber}` : ''}
        subtitle={selectedUnit ? `${selectedUnit.unitType} · Start: ${selectedUnit.startTime || '—'}` : ''}
      >
        {selectedUnit && (
          <div>
            <div className="section-label">Status</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
              {Object.entries(UNIT_STATUS_LABELS).map(([k, l]) => (
                <button
                  key={k}
                  className={`btn-ems btn-sm ${selectedUnit.status === k ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => updateUnitStatus(selectedUnit.id, k)}
                >
                  {l}
                </button>
              ))}
            </div>

            <div className="section-label">Crew</div>
            {[['Driver', selectedUnit.driverId], ['Medical', selectedUnit.medicalId], ['Assist 1', selectedUnit.assist1Id], ['Assist 2', selectedUnit.assist2Id]].map(([l, id]) => id ? (
              <div key={l} style={{ padding: '6px 0', borderBottom: '1px solid var(--ems-border)', display: 'flex', gap: 8 }}>
                <div style={{ width: 80, fontSize: 12, color: 'var(--ems-muted)' }}>{l}</div>
                <div style={{ fontSize: 13 }}>{empName(employees, id)}</div>
              </div>
            ) : null)}

            <div className="section-label" style={{ marginTop: 14 }}>Assigned Calls</div>
            {(unitCallMap[selectedUnit.id] || []).length === 0 ? (
              <div style={{ color: 'var(--ems-muted)', fontSize: 13 }}>No calls assigned.</div>
            ) : (unitCallMap[selectedUnit.id] || []).map(c => (
              <div key={c.id} style={{ background: 'var(--ems-surface-2)', borderRadius: 6, padding: '8px 12px', marginBottom: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 600 }}>{c.patientName}</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn-ems btn-success btn-sm" onClick={() => completeCall(c.id)}>Done</button>
                    <button className="btn-ems btn-ghost btn-sm" onClick={() => unassignCall(c.id)}>Unassign</button>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--ems-muted)', marginTop: 2 }}>{c.pickupTime} · {c.pickupAddress?.split(',')[0]}</div>
              </div>
            ))}
          </div>
        )}
      </DetailsDrawer>
    </div>
  );
}
