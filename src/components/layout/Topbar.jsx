import { MdLightMode, MdDarkMode } from 'react-icons/md';
import { useTheme } from '../../hooks/useTheme';

export default function Topbar() {
  const { isDark, toggle } = useTheme();

  return (
    <header className="topbar">
      {/* Brand matches main project style */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: 'linear-gradient(135deg, #0d6efd, #0a58ca)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, flexShrink: 0,
          boxShadow: '0 4px 12px rgba(13,110,253,0.35)',
        }}>
          🚑
        </div>
        <div>
          <div className="topbar-brand">
            EMS Workflow <span style={{ color: 'var(--ems-primary)', fontWeight: 400, fontSize: 12 }}>Demo</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--ems-muted)', lineHeight: 1, marginTop: 1 }}>
            Portfolio showcase
          </div>
        </div>
      </div>

      <div className="topbar-spacer" />

      <span className="topbar-badge">localStorage · No backend</span>

      {/* Theme toggle */}
      <button
        onClick={toggle}
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        style={{
          background: 'var(--ems-surface)',
          border: '1px solid var(--ems-border)',
          borderRadius: 8,
          cursor: 'pointer',
          padding: '6px 8px',
          color: 'var(--ems-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.15s',
          boxShadow: '0 1px 3px var(--ems-shadow)',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--ems-text)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--ems-muted)'; }}
      >
        {isDark
          ? <MdLightMode style={{ fontSize: 17 }} />
          : <MdDarkMode  style={{ fontSize: 17 }} />
        }
      </button>
    </header>
  );
}
