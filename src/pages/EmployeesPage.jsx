import { useState, useMemo } from 'react';
import { MdSearch, MdAdd } from 'react-icons/md';
import { getEmployees, setEmployees, newId, certStatus, certBadgeClass } from '../data/demoData';
import DetailsDrawer from '../components/ui/DetailsDrawer';
import ConfirmModal from '../components/ui/ConfirmModal';
import EmptyState from '../components/ui/EmptyState';

const EMPTY_EMP = {
  firstName: '', lastName: '', phone: '', employeeNumber: '',
  status: 'active', role: 'EMT',
  isDriver: false, isMedical: false, isAssist: false,
  notes: '',
  cpr:      { hasLicense: false, expirationDate: '' },
  evoc:     { hasLicense: false, expirationDate: '' },
  emt:      { hasLicense: false, expirationDate: '' },
  paramedic:{ hasLicense: false, expirationDate: '' },
};

function CertRow({ label, cert }) {
  const st = cert.hasLicense ? certStatus(cert.expirationDate) : 'none';
  const cls = certBadgeClass(st);
  const label2 = { ok: 'Valid', expiring: 'Expiring Soon', expired: 'Expired', none: 'None' }[st];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid var(--ems-border)' }}>
      <div style={{ width: 100, fontSize: 12, color: 'var(--ems-muted)' }}>{label}</div>
      <span className={`badge-ems ${cls}`}>{label2}</span>
      {cert.hasLicense && cert.expirationDate && (
        <span style={{ fontSize: 12, color: 'var(--ems-muted)', marginLeft: 'auto' }}>Exp: {cert.expirationDate}</span>
      )}
    </div>
  );
}

function EmpForm({ value, onChange }) {
  const f = (k) => (e) => onChange({ ...value, [k]: e.target.value });
  const fc = (cert, k) => (e) => onChange({ ...value, [cert]: { ...value[cert], [k]: k === 'hasLicense' ? e.target.checked : e.target.value } });
  return (
    <>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">First Name <span className="required">*</span></label>
          <input className="form-control" value={value.firstName} onChange={f('firstName')} />
        </div>
        <div className="form-group">
          <label className="form-label">Last Name <span className="required">*</span></label>
          <input className="form-control" value={value.lastName} onChange={f('lastName')} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Employee #</label>
          <input className="form-control" value={value.employeeNumber} onChange={f('employeeNumber')} />
        </div>
        <div className="form-group">
          <label className="form-label">Phone</label>
          <input className="form-control" value={value.phone} onChange={f('phone')} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Role</label>
          <select className="form-control" value={value.role} onChange={f('role')}>
            {['EMT', 'Paramedic', 'Driver', 'Supervisor', 'Other'].map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-control" value={value.status} onChange={f('status')}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
        {[['isDriver','Driver'],['isMedical','Medical'],['isAssist','Assist']].map(([k, l]) => (
          <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13 }}>
            <input type="checkbox" checked={!!value[k]} onChange={e => onChange({ ...value, [k]: e.target.checked })} style={{ accentColor: 'var(--ems-primary)' }} />
            {l}
          </label>
        ))}
      </div>
      <div className="section-label">Certifications</div>
      {[['cpr','CPR'],['evoc','EVOC'],['emt','EMT'],['paramedic','Paramedic']].map(([k, l]) => (
        <div key={k} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, width: 110, cursor: 'pointer', fontSize: 13 }}>
            <input type="checkbox" checked={!!value[k].hasLicense} onChange={fc(k, 'hasLicense')} style={{ accentColor: 'var(--ems-primary)' }} />
            {l}
          </label>
          {value[k].hasLicense && (
            <input type="date" className="form-control" style={{ flex: 1 }} value={value[k].expirationDate} onChange={fc(k, 'expirationDate')} />
          )}
        </div>
      ))}
      <div className="form-group" style={{ marginTop: 8 }}>
        <label className="form-label">Notes</label>
        <textarea className="form-control" rows={2} value={value.notes} onChange={f('notes')} style={{ resize: 'vertical' }} />
      </div>
    </>
  );
}

function EmpCard({ emp, onClick }) {
  const certCount = ['cpr','evoc','emt','paramedic'].filter(k => emp[k]?.hasLicense).length;
  const hasIssue = ['cpr','evoc','emt','paramedic'].some(k => {
    const st = certStatus(emp[k]?.expirationDate);
    return emp[k]?.hasLicense && (st === 'expired' || st === 'expiring');
  });
  const roles = [emp.isDriver && 'Driver', emp.isMedical && 'Medical', emp.isAssist && 'Assist'].filter(Boolean);
  return (
    <div className="ems-card clickable" onClick={onClick}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <div className="ems-card-title">{emp.firstName} {emp.lastName}</div>
            <span className={`badge-ems ${emp.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>
              {emp.status}
            </span>
            {hasIssue && <span className="badge-ems badge-warning">Cert Alert</span>}
          </div>
          <div className="ems-card-meta">
            {emp.employeeNumber} · {emp.role}
            {roles.length > 0 && ` · ${roles.join(' / ')}`}
          </div>
        </div>
        <div style={{ fontSize: 11, color: 'var(--ems-muted)', flexShrink: 0, textAlign: 'right' }}>
          {certCount} cert{certCount !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}

export default function EmployeesPage() {
  const [employees, setEmpState] = useState(getEmployees());
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [newEmp, setNewEmp] = useState({ ...EMPTY_EMP });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const save = (list) => { setEmployees(list); setEmpState(list); };

  const filtered = useMemo(() => {
    let list = employees;
    if (statusFilter !== 'all') list = list.filter(e => e.status === statusFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(e => `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) || (e.employeeNumber || '').toLowerCase().includes(q) || (e.role || '').toLowerCase().includes(q));
    }
    return list;
  }, [employees, query, statusFilter]);

  function handleCreate() {
    if (!newEmp.firstName.trim() || !newEmp.lastName.trim()) { alert('First and last name are required.'); return; }
    const emp = { ...newEmp, id: newId(), createdAt: new Date().toISOString() };
    save([...employees, emp]);
    setCreating(false);
    setNewEmp({ ...EMPTY_EMP });
  }

  function handleUpdate() {
    save(employees.map(e => e.id === editing.id ? editing : e));
    setSelected(editing);
    setEditing(null);
  }

  function handleDelete() {
    save(employees.filter(e => e.id !== deleteTarget));
    if (selected?.id === deleteTarget) setSelected(null);
    setDeleteTarget(null);
  }

  const active = employees.filter(e => e.status === 'active').length;

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Employees</div>
          <div className="page-subtitle">{active} active · {employees.length} total</div>
        </div>
        <button className="btn-ems btn-primary" onClick={() => { setCreating(true); setNewEmp({ ...EMPTY_EMP }); }}>
          <MdAdd /> Add Employee
        </button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <MdSearch style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--ems-muted)' }} />
          <input className="form-control" style={{ paddingLeft: 32 }} placeholder="Search by name, role…" value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        {['all','active','inactive'].map(v => (
          <button key={v} className={`btn-ems btn-sm ${statusFilter === v ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setStatusFilter(v)}>
            {v === 'all' ? 'All' : v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="👔" title="No employees found" description="Try adjusting your filters." />
      ) : filtered.map(e => (
        <EmpCard key={e.id} emp={e} onClick={() => { setSelected(e); setEditing(null); }} />
      ))}

      <DetailsDrawer
        open={creating}
        onClose={() => setCreating(false)}
        title="Add Employee"
        footer={
          <>
            <button className="btn-ems btn-ghost" onClick={() => setCreating(false)}>Cancel</button>
            <button className="btn-ems btn-primary" onClick={handleCreate}>Create</button>
          </>
        }
      >
        <EmpForm value={newEmp} onChange={setNewEmp} />
      </DetailsDrawer>

      <DetailsDrawer
        open={!!selected && !creating}
        onClose={() => { setSelected(null); setEditing(null); }}
        title={selected ? `${selected.firstName} ${selected.lastName}` : ''}
        subtitle={selected ? `${selected.employeeNumber} · ${selected.role}` : ''}
        footer={
          editing ? (
            <>
              <button className="btn-ems btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
              <button className="btn-ems btn-primary" onClick={handleUpdate}>Save</button>
            </>
          ) : (
            <>
              <button className="btn-ems btn-danger btn-sm" onClick={() => setDeleteTarget(selected?.id)}>Delete</button>
              <button className="btn-ems btn-ghost" onClick={() => setEditing({ ...selected })}>Edit</button>
            </>
          )
        }
      >
        {editing ? (
          <EmpForm value={editing} onChange={setEditing} />
        ) : selected && (
          <div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
              <span className={`badge-ems ${selected.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>{selected.status}</span>
              {selected.isDriver  && <span className="badge-ems badge-neutral">Driver</span>}
              {selected.isMedical && <span className="badge-ems badge-neutral">Medical</span>}
              {selected.isAssist  && <span className="badge-ems badge-neutral">Assist</span>}
            </div>

            {[['Phone', selected.phone || '—'], ['Notes', selected.notes || '—']].map(([l, v]) => (
              <div key={l} style={{ padding: '7px 0', borderBottom: '1px solid var(--ems-border)', display: 'flex', gap: 8 }}>
                <div style={{ width: 100, fontSize: 12, color: 'var(--ems-muted)' }}>{l}</div>
                <div style={{ fontSize: 13 }}>{v}</div>
              </div>
            ))}

            <div className="section-label" style={{ marginTop: 14 }}>Certifications</div>
            {[['cpr','CPR'],['evoc','EVOC'],['emt','EMT'],['paramedic','Paramedic']].map(([k, l]) => (
              <CertRow key={k} label={l} cert={selected[k]} />
            ))}
          </div>
        )}
      </DetailsDrawer>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Employee"
        message="Delete this employee record? This cannot be undone."
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
