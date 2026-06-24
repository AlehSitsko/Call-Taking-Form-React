export default function Topbar() {
  return (
    <header className="topbar">
      <span className="topbar-brand">
        EMS<span>·</span>Workflow <span style={{ fontWeight: 400, color: 'var(--ems-muted)', fontSize: 13 }}>Demo</span>
      </span>
      <div className="topbar-spacer" />
      <span className="topbar-badge">localStorage · No backend</span>
    </header>
  );
}
