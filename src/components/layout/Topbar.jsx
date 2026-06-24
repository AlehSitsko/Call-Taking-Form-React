import { MdLightMode, MdDarkMode } from 'react-icons/md';
import { useTheme } from '../../hooks/useTheme';

export default function Topbar() {
  const { isDark, toggle } = useTheme();

  return (
    <header className="topbar">
      <span className="topbar-brand">
        EMS<span style={{ color: 'var(--ems-primary)' }}>·</span>Workflow{' '}
        <span style={{ fontWeight: 400, color: 'var(--ems-muted)', fontSize: 13 }}>Demo</span>
      </span>
      <div className="topbar-spacer" />
      <span className="topbar-badge">localStorage · No backend</span>
      <button
        onClick={toggle}
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        style={{
          background: 'none',
          border: '1px solid var(--ems-border)',
          borderRadius: 6,
          cursor: 'pointer',
          padding: '5px 7px',
          color: 'var(--ems-muted)',
          display: 'flex',
          alignItems: 'center',
          transition: 'all 0.15s',
          marginLeft: 8,
        }}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--ems-text)'; e.currentTarget.style.borderColor = '#475569'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--ems-muted)'; e.currentTarget.style.borderColor = 'var(--ems-border)'; }}
      >
        {isDark
          ? <MdLightMode style={{ fontSize: 17 }} />
          : <MdDarkMode  style={{ fontSize: 17 }} />
        }
      </button>
    </header>
  );
}
