import { useState, useMemo } from 'react';
import { MdSearch, MdDeleteOutline, MdFilterList } from 'react-icons/md';
import { getCalls, setCalls, SERVICE_LEVEL_BADGE } from '../data/demoData';
import DetailsDrawer from '../components/ui/DetailsDrawer';
import ConfirmModal from '../components/ui/ConfirmModal';
import EmptyState from '../components/ui/EmptyState';

function ScoreBadge({ score }) {
  const cls = score >= 85 ? 'score-high' : score >= 60 ? 'score-medium' : 'score-low';
  return <div className={`score-badge ${cls}`} style={{ width: 30, height: 30, fontSize: 11 }}>{score}</div>;
}

function StatusBadge({ status }) {
  const map = { new: ['badge-neutral', 'New'], assigned: ['badge-primary', 'Assigned'], completed: ['badge-success', 'Completed'], cancelled: ['badge-danger', 'Cancelled'] };
  const [cls, label] = map[status] || ['badge-neutral', status];
  return <span className={`badge-ems ${cls}`}>{label}</span>;
}

const TODAY = new Date().toISOString().slice(0, 10);
const YESTERDAY = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

export default function CallsHistoryPage() {
  const [calls, setCallState] = useState(getCalls());
  const [query, setQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all'); // 'all' | 'today' | 'yesterday' | custom
  const [customDate, setCustomDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const save = (list) => { setCalls(list); setCallState(list); };

  const filtered = useMemo(() => {
    let list = [...calls].sort((a, b) => new Date(b.receivedAt || 0) - new Date(a.receivedAt || 0));

    if (dateFilter === 'today')     list = list.filter(c => c.tripDate === TODAY || c.dateOfCall === TODAY);
    else if (dateFilter === 'yesterday') list = list.filter(c => c.tripDate === YESTERDAY || c.dateOfCall === YESTERDAY);
    else if (dateFilter === 'custom' && customDate) list = list.filter(c => c.tripDate === customDate || c.dateOfCall === customDate);

    if (statusFilter !== 'all') list = list.filter(c => c.status === statusFilter);

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(c =>
        (c.patientName || '').toLowerCase().includes(q) ||
        (c.pickupAddress || '').toLowerCase().includes(q) ||
        (c.dropoffAddress || '').toLowerCase().includes(q) ||
        (c.dispatcher || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [calls, query, dateFilter, customDate, statusFilter]);

  function handleDelete() {
    const list = calls.filter(c => c.id !== deleteTarget);
    save(list);
    if (selected?.id === deleteTarget) setSelected(null);
    setDeleteTarget(null);
  }

  function fmt(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Calls History</div>
          <div className="page-subtitle">{filtered.length} of {calls.length} calls</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 200px' }}>
          <MdSearch style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--ems-muted)' }} />
          <input className="form-control" style={{ paddingLeft: 32 }} placeholder="Search patient, address…" value={query} onChange={e => setQuery(e.target.value)} />
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          {[['all','All'], ['today','Today'], ['yesterday','Yesterday']].map(([v, l]) => (
            <button key={v} className={`btn-ems btn-sm ${dateFilter === v ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setDateFilter(v)}>{l}</button>
          ))}
          <input type="date" className="form-control" style={{ width: 140, fontSize: 12, padding: '4px 8px' }} value={customDate} onChange={e => { setCustomDate(e.target.value); setDateFilter('custom'); }} />
        </div>

        <select className="form-control" style={{ width: 130 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="assigned">Assigned</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState icon="📁" title="No calls found" description="Try adjusting your filters." />
      ) : filtered.map(c => (
        <div key={c.id} className="ems-card clickable" onClick={() => setSelected(c)}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <ScoreBadge score={c.qualityScore ?? 0} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <div className="ems-card-title">{c.patientName || 'Unknown Patient'}</div>
                <StatusBadge status={c.status} />
                {c.serviceLevel && <span className={`badge-ems ${SERVICE_LEVEL_BADGE[c.serviceLevel] || 'badge-neutral'}`}>{c.serviceLevel}</span>}
                {c.returnRide && <span className="badge-ems badge-warning">↩ Return</span>}
              </div>
              <div className="ems-card-meta">
                {c.pickupAddress || '—'} → {c.dropoffAddress || '—'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--ems-muted)', marginTop: 2 }}>
                {c.tripDate ? `Trip: ${c.tripDate}` : ''} {c.pickupTime ? `at ${c.pickupTime}` : ''} · Received: {fmt(c.receivedAt)}
              </div>
            </div>
            <button
              className="btn-ems btn-danger btn-sm"
              style={{ flexShrink: 0 }}
              onClick={e => { e.stopPropagation(); setDeleteTarget(c.id); }}
            >
              <MdDeleteOutline />
            </button>
          </div>
        </div>
      ))}

      {/* Detail drawer */}
      <DetailsDrawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.patientName || 'Call Details'}
        subtitle={selected?.tripDate ? `Trip: ${selected.tripDate} ${selected.pickupTime ? 'at ' + selected.pickupTime : ''}` : ''}
        footer={
          <button className="btn-ems btn-danger" onClick={() => setDeleteTarget(selected?.id)}>
            <MdDeleteOutline /> Delete Call
          </button>
        }
      >
        {selected && (
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              <StatusBadge status={selected.status} />
              {selected.serviceLevel && <span className={`badge-ems ${SERVICE_LEVEL_BADGE[selected.serviceLevel] || 'badge-neutral'}`}>{selected.serviceLevel}</span>}
              {selected.returnRide && <span className="badge-ems badge-warning">Return Ride</span>}
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                <ScoreBadge score={selected.qualityScore ?? 0} />
                <span style={{ fontSize: 12, color: 'var(--ems-muted)' }}>Quality</span>
              </div>
            </div>

            {selected.missingCritical?.length > 0 && (
              <div className="callout callout-danger" style={{ marginBottom: 10 }}>
                Missing critical: {selected.missingCritical.join(', ')}
              </div>
            )}

            {[
              ['Patient', selected.patientName],
              ['Caller Type', selected.callerType],
              ['Caller Phone', selected.callerPhone || '—'],
              ['Pickup Address', selected.pickupAddress || '—'],
              ['Dropoff Address', selected.dropoffAddress || '—'],
              ['Trip Date', selected.tripDate || '—'],
              ['Pickup Time', selected.pickupTime || '—'],
              ['Appointment Time', selected.appointmentTime || '—'],
              ['Return Pickup', selected.returnRide ? (selected.returnPickupTime || 'TBD') : 'No'],
              ['Call Type', selected.callType || '—'],
              ['Dispatcher', selected.dispatcher || '—'],
              ['Received At', fmt(selected.receivedAt)],
              ['Notes', selected.notes || '—'],
            ].map(([label, value]) => (
              <div key={label} style={{ borderBottom: '1px solid var(--ems-border)', padding: '7px 0', display: 'flex', gap: 8 }}>
                <div style={{ width: 150, flexShrink: 0, fontSize: 12, color: 'var(--ems-muted)' }}>{label}</div>
                <div style={{ fontSize: 13, wordBreak: 'break-word' }}>{value}</div>
              </div>
            ))}
          </div>
        )}
      </DetailsDrawer>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Call"
        message="Delete this call record? This cannot be undone."
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
