import { useState, useRef, useEffect } from 'react';
import { Bell, Search, User, ChevronDown, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { notifications as defaultNotifs } from '../data/mockData';
import styles from './Header.module.css';

const typeColorMap = {
  danger: 'var(--danger)',
  warning: 'var(--warning)',
  info: 'var(--primary)',
  success: 'var(--success)',
};

export default function Header({ currentRole, setCurrentRole }) {
  const { theme, toggleTheme } = useTheme();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifs, setNotifs] = useState(defaultNotifs);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const unreadCount = notifs.filter(n => !n.read).length;

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markRead = (id) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        {/* Search */}
        <div className={styles.searchWrapper}>
          <div className={styles.searchInner}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search city systems…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className={styles.clearBtn}>
                <X style={{ width: '1rem', height: '1rem' }} />
              </button>
            )}
          </div>
        </div>

        <div className={styles.rightSection}>
          {/* Theme toggle */}
          <button className={styles.themeToggle} onClick={toggleTheme} aria-label="Toggle theme">
            <span className={styles.themeIconSpin} key={theme}>
              {theme === 'dark' ? <Moon size={15} /> : <Sun size={15} />}
            </span>
          </button>

          {/* Live indicator */}
          <div className={styles.liveIndicator}>
            <div className={styles.liveDot} />
            <span className={styles.liveText}>Live</span>
          </div>

          {/* Notifications */}
          <div className={styles.notifBtnWrapper} ref={notifRef}>
            <button onClick={() => setShowNotifs(!showNotifs)} className={styles.notifBtn}>
              <Bell style={{ width: '1.25rem', height: '1.25rem' }} />
              {unreadCount > 0 && (
                <span className={styles.notifBadge}>{unreadCount}</span>
              )}
            </button>

            {showNotifs && (
              <div className={styles.notifDropdown}>
                <div className={styles.notifHeader}>
                  <h3 className={styles.notifTitle}>Notifications</h3>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className={styles.markAllBtn}>Mark all read</button>
                  )}
                </div>
                <div className={styles.notifList}>
                  {notifs.map(n => (
                    <div
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className={`${styles.notifItem} ${!n.read ? styles.notifItemUnread : ''}`}
                    >
                      <div className={styles.notifItemInner}>
                        <div className={styles.notifDot} style={{ backgroundColor: typeColorMap[n.type] }} />
                        <div className={styles.notifContent}>
                          <div className={styles.notifContentHeader}>
                            <p className={styles.notifContentTitle}>{n.title}</p>
                            {!n.read && <div className={styles.unreadDot} />}
                          </div>
                          <p className={styles.notifMessage}>{n.message}</p>
                          <p className={styles.notifTime}>{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile / Role Switcher */}
          <div className={styles.profileWrapper} ref={profileRef}>
            <button onClick={() => setShowProfile(!showProfile)} className={styles.profileBtn}>
              <div className={styles.profileAvatar}>
                <User style={{ width: '1rem', height: '1rem', color: 'white' }} />
              </div>
              <div className={styles.profileInfo}>
                <p className={styles.profileName}>{currentRole}</p>
                <p className={styles.profileSub}>Smart City</p>
              </div>
              <ChevronDown className={styles.chevron} />
            </button>

            {showProfile && (
              <div className={styles.profileDropdown}>
                <div className={styles.profileDropdownHeader}>
                  <p className={styles.profileDropdownLabel}>Switch Role</p>
                </div>
                {['admin', 'citizen', 'visitor'].map(role => (
                  <button
                    key={role}
                    onClick={() => { setCurrentRole(role); setShowProfile(false); }}
                    className={`${styles.roleBtn} ${currentRole === role ? styles.roleBtnActive : ''}`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
