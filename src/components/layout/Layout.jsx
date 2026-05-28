import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Users, CalendarDays, UserCog, FileText,
  Pill, BellRing, ShieldCheck, ChevronLeft, ChevronRight,
  LogOut, Settings, Activity,
} from 'lucide-react';
import styles from './Layout.module.css';

const NAV_ITEMS = [
  { to: '/',             icon: LayoutDashboard, label: 'Dashboard'    },
  { to: '/pacientes',    icon: Users,            label: 'Pacientes'    },
  { to: '/citas',        icon: CalendarDays,     label: 'Citas'        },
  { to: '/doctores',     icon: UserCog,          label: 'Doctores'     },
  { to: '/expedientes',  icon: FileText,         label: 'Expedientes'  },
  { to: '/recetas',      icon: Pill,             label: 'Recetas'      },
  { to: '/notificaciones',icon: BellRing,        label: 'Notificaciones'},
  { to: '/usuarios',     icon: ShieldCheck,      label: 'Usuarios'     },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className={styles.root}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
        {/* Logo */}
        <div className={styles.logo}>
          <div className={styles.logoIcon}><Activity size={20} /></div>
          {!collapsed && <span className={styles.logoText}>ClinicApp</span>}
        </div>

        {/* Nav */}
        <nav className={styles.nav}>
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navActive : ''}`
              }
              title={collapsed ? label : undefined}
            >
              <Icon size={18} className={styles.navIcon} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className={styles.sidebarBottom}>
          {!collapsed && user && (
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>{user.nickname?.[0]?.toUpperCase() || 'U'}</div>
              <div className={styles.userMeta}>
                <p className={styles.userName}>{user.nickname}</p>
                <p className={styles.userRole}>{user.role?.name || 'Usuario'}</p>
              </div>
            </div>
          )}
          <div className={styles.sidebarActions}>
            <NavLink to="/configuracion" className={styles.iconBtn} title="Configuración">
              <Settings size={16} />
            </NavLink>
            <button className={styles.iconBtn} onClick={handleLogout} title="Cerrar sesión">
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Collapse toggle */}
        <button className={styles.collapseBtn} onClick={() => setCollapsed((p) => !p)}>
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}
