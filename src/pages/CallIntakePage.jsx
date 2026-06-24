import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdSearch, MdCheck, MdArrowBack, MdArrowForward, MdSave, MdClear, MdAdd } from 'react-icons/md';
import { getCalls, setCalls, getPatients, setPatients, newId, calcQualityScore, isDuplicatePatient } from '../data/demoData';

const EMPTY_FORM = {
  callerType: 'Facility', callerName: '', callerPhone: '',
  patientId: null, patientName: '',
  pickupAddress: '', dropoffAddress: '',
  tripDate: new Date().toISOString().slice(0, 10),
  pickupTime: '', appointmentTime: '',
  serviceLevel: 'BLS', callType: 'Appointment',
  returnRide: false, returnPickupTime: '',
  notes: '',
};

const STEPS = ['Patient', 'Trip Details', 'Review'];

function ScoreBadge({ score }) {
  const cls = score >= 85 ? 'score-high' : score >= 60 ? 'score-medium' : 'score-low';
  return <div className={`score-badge ${cls}`}>{score}</div>;
}

function PatientSearchStep({ form, setForm }) {
  const [query, setQuery] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [newPt, setNewPt] = useState({ firstName: '', lastName: '', dob: '', phone: '', address: '', insurance: '', defaultServiceLevel: 'BLS', notes: '' });
  const [dupWarning, setDupWarning] = useState(false);

  const patients = getPatients();
  const filtered = useMemo(() => {
    if (!query.trim()) return patients;
    const q = query.toLowerCase();
    return patients.filter(p =>
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
      (p.dob || '').includes(q) ||
      (p.phone || '').includes(q)
    );
  }, [query, patients]);

  function selectPatient(p) {
    setForm(f => ({
      ...f,
      patientId: p.id,
      patientName: `${p.firstName} ${p.lastName}`,
      pickupAddress: p.address || f.pickupAddress,
      serviceLevel: p.defaultServiceLevel || f.serviceLevel,
    }));
  }

  function createAndSelect() {
    if (!newPt.firstName.trim() || !newPt.lastName.trim() || !newPt.dob) {
      alert('First name, last name, and date of birth are required.');
      return;
    }
    if (isDuplicatePatient(newPt.firstName, newPt.lastName, newPt.dob)) {
      setDupWarning(true);
      return;
    }
    const patient = { ...newPt, id: newId(), createdAt: new Date().toISOString() };
    const pts = getPatients();
    setPatients([...pts, patient]);
    selectPatient(patient);
    setShowNew(false);
    setDupWarning(false);
  }

  return (
    <div>
      <div className="section-label">Caller Information</div>
      <div className="form-row" style={{ marginBottom: 14 }}>
        <div className="form-group">
          <label className="form-label">Caller Type <span className="required">*</span></label>
          <select className="form-control" value={form.callerType} onChange={e => setForm(f => ({ ...f, callerType: e.target.value }))}>
            {['Facility', 'Family', 'Patient', 'Other'].map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Caller Phone</label>
          <input className="form-control" value={form.callerPhone} onChange={e => setForm(f => ({ ...f, callerPhone: e.target.value }))} placeholder="215-555-0000" />
        </div>
      </div>

      <div className="section-label" style={{ marginTop: 4 }}>Patient</div>

      {form.patientId ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--ems-success-soft)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, marginBottom: 14 }}>
          <MdCheck style={{ color: 'var(--ems-success)', fontSize: 18 }} />
          <span style={{ fontWeight: 600 }}>{form.patientName}</span>
          <button className="btn-ems btn-ghost btn-sm" onClick={() => setForm(f => ({ ...f, patientId: null, patientName: '' }))} style={{ marginLeft: 'auto' }}>Change</button>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <MdSearch style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--ems-muted)' }} />
              <input
                className="form-control"
                style={{ paddingLeft: 32 }}
                placeholder="Search by name, DOB, or phone…"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
            <button className="btn-ems btn-ghost" onClick={() => setShowNew(v => !v)}>
              <MdAdd /> New Patient
            </button>
          </div>

          {showNew && (
            <div style={{ background: 'var(--ems-surface-2)', border: '1px solid var(--ems-border)', borderRadius: 8, padding: 14, marginBottom: 12 }}>
              <div className="section-label">Create New Patient</div>
              {dupWarning && (
                <div className="callout callout-warning" style={{ marginBottom: 10 }}>
                  A patient with this name and date of birth already exists.
                </div>
              )}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name <span className="required">*</span></label>
                  <input className="form-control" value={newPt.firstName} onChange={e => setNewPt(p => ({ ...p, firstName: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name <span className="required">*</span></label>
                  <input className="form-control" value={newPt.lastName} onChange={e => setNewPt(p => ({ ...p, lastName: e.target.value }))} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Date of Birth <span className="required">*</span></label>
                  <input type="date" className="form-control" value={newPt.dob} onChange={e => setNewPt(p => ({ ...p, dob: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-control" value={newPt.phone} onChange={e => setNewPt(p => ({ ...p, phone: e.target.value }))} placeholder="215-555-0000" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <input className="form-control" value={newPt.address} onChange={e => setNewPt(p => ({ ...p, address: e.target.value }))} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Insurance</label>
                  <input className="form-control" value={newPt.insurance} onChange={e => setNewPt(p => ({ ...p, insurance: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Default Service Level</label>
                  <select className="form-control" value={newPt.defaultServiceLevel} onChange={e => setNewPt(p => ({ ...p, defaultServiceLevel: e.target.value }))}>
                    {['BLS', 'ALS', 'Stretcher', 'Wheelchair'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-ems btn-primary btn-sm" onClick={createAndSelect}>Create & Select</button>
                <button className="btn-ems btn-ghost btn-sm" onClick={() => { setShowNew(false); setDupWarning(false); }}>Cancel</button>
              </div>
            </div>
          )}

          <div style={{ maxHeight: 280, overflowY: 'auto' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--ems-muted)', fontSize: 13 }}>
                {query ? 'No patients match your search.' : 'No patients in database. Create one above.'}
              </div>
            ) : filtered.map(p => (
              <div
                key={p.id}
                className="ems-card clickable"
                style={{ marginBottom: 6 }}
                onClick={() => selectPatient(p)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{p.firstName} {p.lastName}</div>
                    <div style={{ fontSize: 12, color: 'var(--ems-muted)', marginTop: 2 }}>
                      DOB: {p.dob || '—'} · {p.phone || 'No phone'} · {p.insurance || 'No insurance'}
                    </div>
                  </div>
                  <span className={`badge-ems badge-${p.defaultServiceLevel === 'ALS' ? 'als' : 'bls'}`} style={{ fontSize: 10 }}>
                    {p.defaultServiceLevel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function TripDetailsStep({ form, setForm }) {
  return (
    <div>
      <div className="section-label">Addresses</div>
      <div className="form-group">
        <label className="form-label">Pickup Address <span className="required">*</span></label>
        <input className="form-control" value={form.pickupAddress} onChange={e => setForm(f => ({ ...f, pickupAddress: e.target.value }))} placeholder="Street, City, State ZIP" />
      </div>
      <div className="form-group">
        <label className="form-label">Dropoff Address <span className="required">*</span></label>
        <input className="form-control" value={form.dropoffAddress} onChange={e => setForm(f => ({ ...f, dropoffAddress: e.target.value }))} placeholder="Destination" />
      </div>

      <div className="section-label" style={{ marginTop: 4 }}>Schedule</div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Trip Date <span className="required">*</span></label>
          <input type="date" className="form-control" value={form.tripDate} onChange={e => setForm(f => ({ ...f, tripDate: e.target.value }))} />
        </div>
        <div className="form-group">
          <label className="form-label">Pickup Time <span className="required">*</span></label>
          <input type="time" className="form-control" value={form.pickupTime} onChange={e => setForm(f => ({ ...f, pickupTime: e.target.value }))} />
        </div>
        <div className="form-group">
          <label className="form-label">Appointment Time</label>
          <input type="time" className="form-control" value={form.appointmentTime} onChange={e => setForm(f => ({ ...f, appointmentTime: e.target.value }))} />
        </div>
      </div>

      <div className="section-label" style={{ marginTop: 4 }}>Service</div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Service Level <span className="required">*</span></label>
          <select className="form-control" value={form.serviceLevel} onChange={e => setForm(f => ({ ...f, serviceLevel: e.target.value }))}>
            {['BLS', 'ALS', 'Stretcher', 'Wheelchair'].map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Call Type</label>
          <select className="form-control" value={form.callType} onChange={e => setForm(f => ({ ...f, callType: e.target.value }))}>
            {['Appointment', 'Dialysis', 'Discharge', 'Transfer', 'Routine', 'Emergency', 'Other'].map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
      </div>

      <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={form.returnRide}
            onChange={e => setForm(f => ({ ...f, returnRide: e.target.checked }))}
            style={{ width: 16, height: 16, accentColor: 'var(--ems-primary)' }}
          />
          <span style={{ fontSize: 13 }}>Return Ride</span>
        </label>
        {form.returnRide && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label className="form-label" style={{ margin: 0 }}>Return pickup:</label>
            <input type="time" className="form-control" style={{ width: 130 }} value={form.returnPickupTime} onChange={e => setForm(f => ({ ...f, returnPickupTime: e.target.value }))} />
          </div>
        )}
      </div>

      <div className="form-group" style={{ marginTop: 14 }}>
        <label className="form-label">Notes</label>
        <textarea className="form-control" rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Special instructions, equipment needs, etc." style={{ resize: 'vertical' }} />
      </div>
    </div>
  );
}

function ReviewStep({ form }) {
  const { score, missing_critical, missing_optional } = calcQualityScore(form);
  const misestimates = calcPrice(form.serviceLevel, form.returnRide);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, padding: '12px 16px', background: 'var(--ems-surface-2)', borderRadius: 8, border: '1px solid var(--ems-border)' }}>
        <ScoreBadge score={score} />
        <div>
          <div style={{ fontWeight: 600 }}>Quality Score: {score}/100</div>
          <div style={{ fontSize: 12, color: 'var(--ems-muted)' }}>
            {score >= 85 ? 'All critical fields complete.' : score >= 60 ? 'Some optional fields missing.' : 'Critical fields are missing.'}
          </div>
        </div>
      </div>

      {missing_critical.length > 0 && (
        <div className="callout callout-danger" style={{ marginBottom: 12 }}>
          <span>⚠</span>
          <span>Missing critical fields: <strong>{missing_critical.join(', ')}</strong></span>
        </div>
      )}
      {missing_optional.length > 0 && (
        <div className="callout callout-warning" style={{ marginBottom: 12 }}>
          <span>ℹ</span>
          <span>Optional fields empty: {missing_optional.join(', ')}</span>
        </div>
      )}

      <div className="section-label">Summary</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <tbody>
          {[
            ['Patient', form.patientName || '—'],
            ['Caller', `${form.callerType}${form.callerPhone ? ' · ' + form.callerPhone : ''}`],
            ['Pickup', form.pickupAddress || '—'],
            ['Dropoff', form.dropoffAddress || '—'],
            ['Trip Date', form.tripDate || '—'],
            ['Pickup Time', form.pickupTime || '—'],
            ['Appt. Time', form.appointmentTime || '—'],
            ['Service Level', form.serviceLevel],
            ['Call Type', form.callType],
            ['Return Ride', form.returnRide ? `Yes — ${form.returnPickupTime || 'time TBD'}` : 'No'],
            ['Notes', form.notes || '—'],
          ].map(([label, value]) => (
            <tr key={label} style={{ borderBottom: '1px solid var(--ems-border)' }}>
              <td style={{ padding: '7px 4px', color: 'var(--ems-muted)', width: '36%' }}>{label}</td>
              <td style={{ padding: '7px 4px', color: 'var(--ems-text)' }}>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 14, padding: '10px 14px', background: 'var(--ems-surface-2)', borderRadius: 8, border: '1px solid var(--ems-border)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ems-muted)', marginBottom: 6 }}>Estimated Price</div>
        <div style={{ display: 'flex', gap: 16 }}>
          <div>
            <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--ems-primary)' }}>${misestimates.base}</span>
            <span style={{ fontSize: 12, color: 'var(--ems-muted)', marginLeft: 4 }}>base fare</span>
          </div>
          {form.returnRide && (
            <div>
              <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--ems-text)' }}>${misestimates.total}</span>
              <span style={{ fontSize: 12, color: 'var(--ems-muted)', marginLeft: 4 }}>with return</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function calcPrice(serviceLevel, returnRide) {
  const BASE = { BLS: 450, ALS: 750, Stretcher: 380, Wheelchair: 200 };
  const base = BASE[serviceLevel] || 450;
  const total = returnRide ? base * 2 : base;
  return { base, total };
}

export default function CallIntakePage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('guided'); // 'guided' | 'classic'
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saved, setSaved] = useState(false);

  function saveCall() {
    const { score, missing_critical, missing_optional } = calcQualityScore(form);
    const call = {
      ...form,
      id: newId(),
      receivedAt: new Date().toISOString(),
      dateOfCall: new Date().toISOString().slice(0, 10),
      dispatcher: 'Demo User',
      qualityScore: score,
      missingCritical: missing_critical,
      missingOptional: missing_optional,
      status: 'new',
    };
    const calls = getCalls();
    setCalls([...calls, call]);
    setSaved(true);
  }

  function reset() {
    setForm({ ...EMPTY_FORM });
    setStep(0);
    setSaved(false);
  }

  if (saved) {
    return (
      <div>
        <div style={{ maxWidth: 480, margin: '48px auto', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Call Saved</div>
          <div style={{ color: 'var(--ems-muted)', marginBottom: 24 }}>The call has been recorded in Calls History.</div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button className="btn-ems btn-primary" onClick={reset}>New Call</button>
            <button className="btn-ems btn-ghost" onClick={() => navigate('/calls-history')}>View Calls History</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 680 }}>
      <div className="page-header">
        <div>
          <div className="page-title">Call Intake</div>
          <div className="page-subtitle">Create a new transport call record</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--ems-muted)' }}>Mode:</span>
          {['guided', 'classic'].map(m => (
            <button key={m} className={`btn-ems btn-sm ${mode === m ? 'btn-primary' : 'btn-ghost'}`} onClick={() => { setMode(m); setStep(0); }}>
              {m === 'guided' ? '📋 Guided' : '📄 Classic'}
            </button>
          ))}
        </div>
      </div>

      {mode === 'guided' ? (
        <>
          {/* Step bar */}
          <div className="steps-bar">
            {STEPS.map((label, i) => (
              <div key={i} className="step-item" style={{ flex: i < STEPS.length - 1 ? 1 : 'none' }}>
                <div className={`step-num ${i < step ? 'done' : i === step ? 'active' : ''}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <div className={`step-label ${i < step ? 'done' : i === step ? 'active' : ''}`}>{label}</div>
                {i < STEPS.length - 1 && <div className="step-line" />}
              </div>
            ))}
          </div>

          {/* Step content */}
          <div style={{ background: 'var(--ems-surface)', border: '1px solid var(--ems-border)', borderRadius: 8, padding: 20, marginBottom: 16 }}>
            {step === 0 && <PatientSearchStep form={form} setForm={setForm} />}
            {step === 1 && <TripDetailsStep form={form} setForm={setForm} />}
            {step === 2 && <ReviewStep form={form} />}
          </div>

          {/* Nav */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn-ems btn-ghost" onClick={() => step > 0 ? setStep(s => s - 1) : navigate(-1)}>
              <MdArrowBack /> {step > 0 ? 'Back' : 'Cancel'}
            </button>
            <div style={{ display: 'flex', gap: 8 }}>
              {step < STEPS.length - 1 ? (
                <button className="btn-ems btn-primary" onClick={() => setStep(s => s + 1)}>
                  Next <MdArrowForward />
                </button>
              ) : (
                <button className="btn-ems btn-primary" onClick={saveCall}>
                  <MdSave /> Save Call
                </button>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Classic mode: all steps on one page */
        <>
          <div style={{ background: 'var(--ems-surface)', border: '1px solid var(--ems-border)', borderRadius: 8, padding: 20, marginBottom: 16 }}>
            <PatientSearchStep form={form} setForm={setForm} />
            <div style={{ borderTop: '1px solid var(--ems-border)', margin: '16px 0' }} />
            <TripDetailsStep form={form} setForm={setForm} />
            <div style={{ borderTop: '1px solid var(--ems-border)', margin: '16px 0' }} />
            <ReviewStep form={form} />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button className="btn-ems btn-ghost" onClick={reset}><MdClear /> Clear</button>
            <button className="btn-ems btn-primary" onClick={saveCall}><MdSave /> Save Call</button>
          </div>
        </>
      )}
    </div>
  );
}
