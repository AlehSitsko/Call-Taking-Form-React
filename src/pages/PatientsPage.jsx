import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdSearch, MdAdd, MdPhone } from 'react-icons/md';
import { getPatients, setPatients, newId, isDuplicatePatient } from '../data/demoData';
import DetailsDrawer from '../components/ui/DetailsDrawer';
import ConfirmModal from '../components/ui/ConfirmModal';
import EmptyState from '../components/ui/EmptyState';

const EMPTY_PT = { firstName: '', lastName: '', dob: '', phone: '', address: '', insurance: '', memberId: '', defaultServiceLevel: 'BLS', notes: '' };

function PatientForm({ value, onChange }) {
  const f = (k) => (e) => onChange({ ...value, [k]: e.target.value });
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
          <label className="form-label">Date of Birth <span className="required">*</span></label>
          <input type="date" className="form-control" value={value.dob} onChange={f('dob')} />
        </div>
        <div className="form-group">
          <label className="form-label">Phone</label>
          <input className="form-control" value={value.phone} onChange={f('phone')} placeholder="215-555-0000" />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Address</label>
        <input className="form-control" value={value.address} onChange={f('address')} />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Insurance</label>
          <input className="form-control" value={value.insurance} onChange={f('insurance')} />
        </div>
        <div className="form-group">
          <label className="form-label">Member ID</label>
          <input className="form-control" value={value.memberId} onChange={f('memberId')} />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Default Service Level</label>
        <select className="form-control" value={value.defaultServiceLevel} onChange={f('defaultServiceLevel')}>
          {['BLS', 'ALS', 'Stretcher', 'Wheelchair'].map(v => <option key={v}>{v}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Notes</label>
        <textarea className="form-control" rows={3} value={value.notes} onChange={f('notes')} style={{ resize: 'vertical' }} />
      </div>
    </>
  );
}

export default function PatientsPage() {
  const navigate = useNavigate();
  const [patients, setPatientState] = useState(getPatients());
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [newPt, setNewPt] = useState({ ...EMPTY_PT });
  const [dupWarn, setDupWarn] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const save = (list) => { setPatients(list); setPatientState(list); };

  const filtered = useMemo(() => {
    if (!query.trim()) return patients;
    const q = query.toLowerCase();
    return patients.filter(p =>
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
      (p.dob || '').includes(q) ||
      (p.phone || '').includes(q) ||
      (p.address || '').toLowerCase().includes(q)
    );
  }, [patients, query]);

  function handleCreate() {
    if (!newPt.firstName.trim() || !newPt.lastName.trim() || !newPt.dob) {
      alert('First name, last name and DOB are required.');
      return;
    }
    if (isDuplicatePatient(newPt.firstName, newPt.lastName, newPt.dob)) {
      setDupWarn(true);
      return;
    }
    const pt = { ...newPt, id: newId(), createdAt: new Date().toISOString() };
    const list = [...patients, pt];
    save(list);
    setCreating(false);
    setNewPt({ ...EMPTY_PT });
    setDupWarn(false);
  }

  function handleUpdate() {
    const list = patients.map(p => p.id === editing.id ? editing : p);
    save(list);
    setSelected(editing);
    setEditing(null);
  }

  function handleDelete() {
    const list = patients.filter(p => p.id !== deleteTarget);
    save(list);
    if (selected?.id === deleteTarget) setSelected(null);
    setDeleteTarget(null);
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Patients</div>
          <div className="page-subtitle">{patients.length} patient{patients.length !== 1 ? 's' : ''} registered</div>
        </div>
        <button className="btn-ems btn-primary" onClick={() => { setCreating(true); setNewPt({ ...EMPTY_PT }); }}>
          <MdAdd /> New Patient
        </button>
      </div>

      <div style={{ position: 'relative', marginBottom: 14 }}>
        <MdSearch style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--ems-muted)' }} />
        <input className="form-control" style={{ paddingLeft: 32 }} placeholder="Search by name, DOB, or phone…" value={query} onChange={e => setQuery(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="👥"
          title={query ? 'No patients match your search' : 'No patients yet'}
          description={query ? 'Try a different search term.' : 'Add your first patient record to get started.'}
          action={!query && <button className="btn-ems btn-primary" onClick={() => setCreating(true)}><MdAdd /> Add Patient</button>}
        />
      ) : filtered.map(p => (
        <div key={p.id} className="ems-card clickable" onClick={() => { setSelected(p); setEditing(null); }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="ems-card-title">{p.firstName} {p.lastName}</div>
              <div className="ems-card-meta">
                DOB: {p.dob || '—'} · {p.phone || 'No phone'} · {p.insurance || 'No insurance'}
              </div>
              {p.address && <div style={{ fontSize: 12, color: 'var(--ems-muted)', marginTop: 2 }}>{p.address}</div>}
            </div>
            <span className={`badge-ems ${p.defaultServiceLevel === 'ALS' ? 'badge-als' : 'badge-bls'}`} style={{ marginTop: 2 }}>
              {p.defaultServiceLevel}
            </span>
          </div>
        </div>
      ))}

      <DetailsDrawer
        open={creating}
        onClose={() => { setCreating(false); setDupWarn(false); }}
        title="New Patient"
        subtitle="Fill in the details below"
        footer={
          <>
            <button className="btn-ems btn-ghost" onClick={() => { setCreating(false); setDupWarn(false); }}>Cancel</button>
            <button className="btn-ems btn-primary" onClick={handleCreate}>Create Patient</button>
          </>
        }
      >
        {dupWarn && <div className="callout callout-warning" style={{ marginBottom: 12 }}>A patient with this name and DOB already exists.</div>}
        <PatientForm value={newPt} onChange={setNewPt} />
      </DetailsDrawer>

      <DetailsDrawer
        open={!!selected && !creating}
        onClose={() => { setSelected(null); setEditing(null); }}
        title={selected ? `${selected.firstName} ${selected.lastName}` : ''}
        subtitle={selected?.dob ? `DOB: ${selected.dob}` : ''}
        footer={
          editing ? (
            <>
              <button className="btn-ems btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
              <button className="btn-ems btn-primary" onClick={handleUpdate}>Save Changes</button>
            </>
          ) : (
            <>
              <button className="btn-ems btn-danger btn-sm" onClick={() => setDeleteTarget(selected?.id)}>Delete</button>
              <button className="btn-ems btn-ghost" onClick={() => setEditing({ ...selected })}>Edit</button>
              <button className="btn-ems btn-success" onClick={() => navigate('/call-intake')}>
                <MdPhone /> Start Call
              </button>
            </>
          )
        }
      >
        {editing ? (
          <PatientForm value={editing} onChange={setEditing} />
        ) : selected && (
          <div>
            {[
              ['First Name', selected.firstName],
              ['Last Name', selected.lastName],
              ['Date of Birth', selected.dob || '—'],
              ['Phone', selected.phone || '—'],
              ['Address', selected.address || '—'],
              ['Insurance', selected.insurance || '—'],
              ['Member ID', selected.memberId || '—'],
              ['Default Service Level', selected.defaultServiceLevel],
              ['Notes', selected.notes || '—'],
            ].map(([label, value]) => (
              <div key={label} style={{ borderBottom: '1px solid var(--ems-border)', padding: '8px 0', display: 'flex', gap: 8 }}>
                <div style={{ width: 160, flexShrink: 0, fontSize: 12, color: 'var(--ems-muted)' }}>{label}</div>
                <div style={{ fontSize: 13, color: 'var(--ems-text)' }}>{value}</div>
              </div>
            ))}
          </div>
        )}
      </DetailsDrawer>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Patient"
        message={`Delete this patient record? This cannot be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
