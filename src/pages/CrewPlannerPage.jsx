import { useState, useMemo } from 'react';
import { MdAdd, MdDeleteOutline, MdWarning } from 'react-icons/md';
import { getUnits, setUnits, getEmployees, newId, certStatus } from '../data/demoData';
import ConfirmModal from '../components/ui/ConfirmModal';
import EmptyState from '../components/ui/EmptyState';

const TODAY = new Date().toISOString().slice(0, 10);

function empName(emp) {
  if (!emp) return '';
  return `${emp.firstName} ${emp.lastName[0]}.`;
}

function isMissingCert(emp, unitType) {
  if (!emp) return false;
  const isBLS = unitType === 'BLS';
  const isALS = unitType === 'ALS';
  const cprOk = emp.cpr?.hasLicense && certStatus(emp.cpr.expirationDate) !== 'expired';
  if (!cprOk) return true;
  if (isBLS && emp.isMedical && !(emp.emt?.hasLicense && certStatus(emp.emt.expirationDate) !== 'expired')) return true;
  if (isALS && emp.isMedical && !(emp.paramedic?.hasLicense && certStatus(emp.paramedic.expirationDate) !== 'expired')) return true;
  if (emp.isDriver && !(emp.evoc?.hasLicense && certStatus(emp.evoc.expirationDate) !== 'expired')) return true;
  return false;
}

function EmpSelect({ value, onChange, employees, label, optional = false }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}{!optional && <span className="required"> *</span>}</label>
      <select className="form-control" value={value || ''} onChange={e => onChange(e.target.value ? Number(e.target.value) : null)}>
        <option value="">— unassigned —</option>
        {employees.map(e => (
          <option key={e.id} value={e.id}>{e.firstName} {e.lastName} ({e.role})</option>
        ))}
      </select>
    </div>
  );
}

function UnitCard({ unit, employees, onSave, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ ...unit });

  const empMap = useMemo(() => Object.fromEntries(employees.map(e => [e.id, e])), [employees]);
  const driver  = empMap[unit.driverId];
  const medical = empMap[unit.medicalId];
  const assist1 = empMap[unit.assist1Id];
  const assist2 = empMap[unit.assist2Id];

  const crewWarnings = [driver, medical, assist1, assist2].filter(Boolean).filter(e => isMissingCert(e, unit.unitType));

  const activeDrivers  = employees.filter(e => e.status === 'active' && e.isDriver);
  const activeMedicals = employees.filter(e => e.status === 'active' && e.isMedical);
  const activeAssists  = employees.filter(e => e.status === 'active');

  function handleSave() {
    onSave(draft);
    setEditing(false);
  }

  return (
    <div style={{ background: 'var(--ems-surface)', border: `1px solid ${crewWarnings.length ? 'rgba(245,158,11,0.4)' : 'var(--ems-border)'}`, borderRadius: 8, padding: 14, marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>🚑 {unit.truckNumber}</div>
          <span className={`badge-ems ${unit.unitType === 'ALS' ? 'badge-als' : 'badge-bls'}`}>{unit.unitType}</span>
          {crewWarnings.length > 0 && (
            <span className="badge-ems badge-warning" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <MdWarning style={{ fontSize: 12 }} /> {crewWarnings.length} cert issue{crewWarnings.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn-ems btn-ghost btn-sm" onClick={() => { setDraft({ ...unit }); setEditing(v => !v); }}>
            {editing ? 'Cancel' : 'Edit'}
          </button>
          <button className="btn-ems btn-danger btn-sm" onClick={onDelete}><MdDeleteOutline /></button>
        </div>
      </div>

      {!editing ? (
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 13 }}>
          {[['Driver', driver], ['Medical', medical], ['Assist 1', assist1], ['Assist 2', assist2]].map(([l, e]) => (
            e ? (
              <div key={l}>
                <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--ems-muted)', marginBottom: 2 }}>{l}</div>
                <div style={{ color: isMissingCert(e, unit.unitType) ? 'var(--ems-warning)' : 'var(--ems-text)' }}>
                  {empName(e)} {isMissingCert(e, unit.unitType) && '⚠'}
                </div>
              </div>
            ) : null
          ))}
          {!driver && !medical && <div style={{ color: 'var(--ems-muted)', fontSize: 13 }}>No crew assigned</div>}
        </div>
      ) : (
        <div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Truck # <span className="required">*</span></label>
              <input className="form-control" value={draft.truckNumber} onChange={e => setDraft(d => ({ ...d, truckNumber: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Unit Type</label>
              <select className="form-control" value={draft.unitType} onChange={e => setDraft(d => ({ ...d, unitType: e.target.value }))}>
                <option>BLS</option><option>ALS</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Start Time</label>
              <input type="time" className="form-control" value={draft.startTime || ''} onChange={e => setDraft(d => ({ ...d, startTime: e.target.value }))} />
            </div>
          </div>
          <div className="form-row">
            <EmpSelect label="Driver"   value={draft.driverId}  onChange={v => setDraft(d => ({ ...d, driverId:  v }))} employees={activeDrivers} />
            <EmpSelect label="Medical"  value={draft.medicalId} onChange={v => setDraft(d => ({ ...d, medicalId: v }))} employees={activeMedicals} />
          </div>
          <div className="form-row">
            <EmpSelect label="Assist 1" value={draft.assist1Id} onChange={v => setDraft(d => ({ ...d, assist1Id: v }))} employees={activeAssists} optional />
            <EmpSelect label="Assist 2" value={draft.assist2Id} onChange={v => setDraft(d => ({ ...d, assist2Id: v }))} employees={activeAssists} optional />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
            <button className="btn-ems btn-ghost btn-sm" onClick={() => setEditing(false)}>Cancel</button>
            <button className="btn-ems btn-primary btn-sm" onClick={handleSave}>Save Unit</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CrewPlannerPage() {
  const [date, setDate] = useState(TODAY);
  const [allUnits, setAllUnits] = useState(getUnits());
  const employees = getEmployees();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const saveAll = (list) => { setUnits(list); setAllUnits(list); };

  const dayUnits = useMemo(() => allUnits.filter(u => u.shiftDate === date), [allUnits, date]);

  function addUnit() {
    const unit = { id: newId(), shiftDate: date, unitType: 'BLS', truckNumber: '', startTime: '07:00', driverId: null, medicalId: null, assist1Id: null, assist2Id: null, status: 'available', assignedCallIds: [] };
    saveAll([...allUnits, unit]);
  }

  function handleSave(updated) {
    saveAll(allUnits.map(u => u.id === updated.id ? updated : u));
  }

  function handleDelete() {
    saveAll(allUnits.filter(u => u.id !== deleteTarget));
    setDeleteTarget(null);
  }

  const warnings = dayUnits.reduce((acc, unit) => {
    const empMap = Object.fromEntries(employees.map(e => [e.id, e]));
    [unit.driverId, unit.medicalId, unit.assist1Id, unit.assist2Id].forEach(id => {
      const e = empMap[id];
      if (e && isMissingCert(e, unit.unitType)) acc++;
    });
    return acc;
  }, 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Crew Planner</div>
          <div className="page-subtitle">Build daily unit rosters</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="date" className="form-control" style={{ width: 160 }} value={date} onChange={e => setDate(e.target.value)} />
          <button className="btn-ems btn-primary" onClick={addUnit}><MdAdd /> Add Unit</button>
        </div>
      </div>

      {warnings > 0 && (
        <div className="callout callout-warning" style={{ marginBottom: 14 }}>
          <MdWarning />
          <span>{warnings} crew member{warnings > 1 ? 's have' : ' has'} expired or missing certifications for {date}.</span>
        </div>
      )}

      <div style={{ marginBottom: 6, fontSize: 13, color: 'var(--ems-muted)' }}>
        {dayUnits.length === 0 ? 'No units scheduled.' : `${dayUnits.length} unit${dayUnits.length !== 1 ? 's' : ''} scheduled for ${date}.`}
      </div>

      {dayUnits.length === 0 ? (
        <EmptyState
          icon="🚑"
          title="No units for this date"
          description="Add a unit to start building the crew roster."
          action={<button className="btn-ems btn-primary" onClick={addUnit}><MdAdd /> Add Unit</button>}
        />
      ) : dayUnits.map(unit => (
        <UnitCard
          key={unit.id}
          unit={unit}
          employees={employees}
          onSave={handleSave}
          onDelete={() => setDeleteTarget(unit.id)}
        />
      ))}

      <ConfirmModal
        open={!!deleteTarget}
        title="Remove Unit"
        message="Remove this unit from the roster? This cannot be undone."
        confirmLabel="Remove"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
