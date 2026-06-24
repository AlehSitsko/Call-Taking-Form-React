import { NavLink } from 'react-router-dom';
import { MdDashboard, MdPhone, MdPeople, MdHistory, MdAirportShuttle, MdGroups, MdCalendarMonth, MdMenuBook } from 'react-icons/md';

const NAV = [
  {
    group: 'Main',
    items: [
      { to: '/',          label: 'Dashboard',       Icon: MdDashboard,    end: true },
    ],
  },
  {
    group: 'Operations',
    items: [
      { to: '/call-intake',     label: 'Call Intake',     Icon: MdPhone },
      { to: '/patients',        label: 'Patients',        Icon: MdPeople },
      { to: '/calls-history',   label: 'Calls History',   Icon: MdHistory },
      { to: '/dispatch',        label: 'Dispatch Preview', Icon: MdAirportShuttle },
    ],
  },
  {
    group: 'Staff',
    items: [
      { to: '/employees',    label: 'Employees',    Icon: MdGroups },
      { to: '/crew-planner', label: 'Crew Planner', Icon: MdCalendarMonth },
    ],
  },
  {
    group: 'System',
    items: [
      { to: '/manual', label: 'User Manual', Icon: MdMenuBook },
    ],
  },
];

export default function Sidebar() {
  return (
    <nav className="sidebar">
      {NAV.map(({ group, items }) => (
        <div key={group} className="sidebar-group">
          <div className="sidebar-group-label">{group}</div>
          {items.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              <Icon className="sidebar-icon" />
              {label}
            </NavLink>
          ))}
        </div>
      ))}
    </nav>
  );
}
