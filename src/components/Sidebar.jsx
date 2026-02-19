import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Map, Bus, Trash2, Zap, Users, Bell, ChevronLeft,
  ChevronRight, Settings, LogOut, Shield, Menu, X, Home
} from 'lucide-react';
import SettingsModal from './SettingsModal';
import styles from './Sidebar.module.css';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/dashboard/map', icon: Map, label: 'City Map' },
  { path: '/dashboard/transport', icon: Bus, label: 'Transport' },
  { path: '/dashboard/waste', icon: Trash2, label: 'Waste' },
  { path: '/dashboard/energy', icon: Zap, label: 'Energy' },
  { path: '/dashboard/citizens', icon: Users, label: 'Citizens' },
];

export default function Sidebar({ collapsed, setCollapsed, unreadCount }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const sidebarContent = (
    <div className={styles.sidebarContent}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <Shield style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
        </div>
        {!collapsed && (
          <div className={styles.logoText}>
            <h1>SmartCity</h1>
            <p>Control Center</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
            >
              {isActive && <div className={styles.activeIndicator} />}
              <Icon className={`${styles.navIcon} ${isActive ? styles.navIconActive : ''}`} />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.label === 'Dashboard' && unreadCount > 0 && (
                <span className={styles.badge}>{unreadCount}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={styles.footer}>
        <button className={styles.footerBtn} onClick={() => navigate('/')}>
          <Home className={styles.footerIcon} />
          {!collapsed && <span>Home</span>}
        </button>
        <button className={styles.footerBtn} onClick={() => setSettingsOpen(true)}>
          <Settings className={styles.footerIcon} />
          {!collapsed && <span>Settings</span>}
        </button>
        <button className={`${styles.footerBtn} ${styles.logoutBtn}`}>
          <LogOut className={styles.footerIcon} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse toggle (desktop) */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={styles.collapseToggle}
      >
        {collapsed ? <ChevronRight style={{ width: '1rem', height: '1rem' }} /> : <ChevronLeft style={{ width: '1rem', height: '1rem' }} />}
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button onClick={() => setMobileOpen(true)} className={styles.hamburger}>
        <Menu style={{ width: '1.25rem', height: '1.25rem' }} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className={styles.overlay} onClick={() => setMobileOpen(false)}>
          <div className={styles.mobileDrawer} onClick={e => e.stopPropagation()}>
            <button onClick={() => setMobileOpen(false)} className={styles.closeBtn}>
              <X style={{ width: '1.25rem', height: '1.25rem' }} />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className={`${styles.desktop} ${collapsed ? styles.desktopCollapsed : styles.desktopExpanded}`}>
        {sidebarContent}
      </aside>

      {/* Settings Modal */}
      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </>
  );
}
