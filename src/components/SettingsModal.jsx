import { useState } from 'react';
import {
  X, Bell, Monitor, Globe, Shield, Moon, Sun, Volume2, VolumeX,
  Eye, EyeOff, MapPin, ToggleLeft, ToggleRight
} from 'lucide-react';
import styles from './SettingsModal.module.css';

const tabs = [
  { key: 'general', label: 'General', icon: Monitor },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'privacy', label: 'Privacy', icon: Shield },
  { key: 'display', label: 'Display', icon: Eye },
];

function Toggle({ enabled, onToggle }) {
  return (
    <button className={`${styles.toggle} ${enabled ? styles.toggleOn : ''}`} onClick={onToggle}>
      {enabled
        ? <ToggleRight size={24} className={styles.toggleIcon} />
        : <ToggleLeft size={24} className={styles.toggleIcon} />
      }
    </button>
  );
}

export default function SettingsModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('general');

  // General
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('auto');
  const [units, setUnits] = useState('metric');

  // Notifications
  const [pushAlerts, setPushAlerts] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [criticalOnly, setCriticalOnly] = useState(false);

  // Privacy
  const [shareLocation, setShareLocation] = useState(true);
  const [analyticsOptIn, setAnalyticsOptIn] = useState(true);
  const [publicProfile, setPublicProfile] = useState(false);

  // Display
  const [darkMode, setDarkMode] = useState(true);
  const [compactView, setCompactView] = useState(false);
  const [animationsOn, setAnimationsOn] = useState(true);
  const [mapLabels, setMapLabels] = useState(true);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2>Settings</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.body}>
          {/* Tab sidebar */}
          <div className={styles.tabs}>
            {tabs.map(t => (
              <button
                key={t.key}
                className={`${styles.tabBtn} ${activeTab === t.key ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(t.key)}
              >
                <t.icon size={16} />
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className={styles.content}>
            {activeTab === 'general' && (
              <div className={styles.section}>
                <h3>General Settings</h3>

                <div className={styles.field}>
                  <label>Language</label>
                  <select value={language} onChange={e => setLanguage(e.target.value)}>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="zh">中文</option>
                  </select>
                </div>

                <div className={styles.field}>
                  <label>Timezone</label>
                  <select value={timezone} onChange={e => setTimezone(e.target.value)}>
                    <option value="auto">Auto-detect</option>
                    <option value="utc">UTC</option>
                    <option value="est">Eastern (EST)</option>
                    <option value="pst">Pacific (PST)</option>
                    <option value="cet">Central European (CET)</option>
                    <option value="ist">India (IST)</option>
                  </select>
                </div>

                <div className={styles.field}>
                  <label>Units</label>
                  <div className={styles.btnGroup}>
                    {['metric', 'imperial'].map(u => (
                      <button key={u} className={`${styles.segBtn} ${units === u ? styles.segActive : ''}`} onClick={() => setUnits(u)}>
                        {u.charAt(0).toUpperCase() + u.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className={styles.section}>
                <h3>Notification Preferences</h3>

                <div className={styles.row}>
                  <div className={styles.rowInfo}>
                    <Bell size={16} />
                    <div>
                      <p className={styles.rowTitle}>Push Alerts</p>
                      <p className={styles.rowDesc}>Receive real-time alerts for city events</p>
                    </div>
                  </div>
                  <Toggle enabled={pushAlerts} onToggle={() => setPushAlerts(!pushAlerts)} />
                </div>

                <div className={styles.row}>
                  <div className={styles.rowInfo}>
                    <Globe size={16} />
                    <div>
                      <p className={styles.rowTitle}>Email Digest</p>
                      <p className={styles.rowDesc}>Daily summary of city metrics</p>
                    </div>
                  </div>
                  <Toggle enabled={emailDigest} onToggle={() => setEmailDigest(!emailDigest)} />
                </div>

                <div className={styles.row}>
                  <div className={styles.rowInfo}>
                    {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                    <div>
                      <p className={styles.rowTitle}>Sound Effects</p>
                      <p className={styles.rowDesc}>Play sounds for critical alerts</p>
                    </div>
                  </div>
                  <Toggle enabled={soundEnabled} onToggle={() => setSoundEnabled(!soundEnabled)} />
                </div>

                <div className={styles.row}>
                  <div className={styles.rowInfo}>
                    <Shield size={16} />
                    <div>
                      <p className={styles.rowTitle}>Critical Only</p>
                      <p className={styles.rowDesc}>Only show danger-level alerts</p>
                    </div>
                  </div>
                  <Toggle enabled={criticalOnly} onToggle={() => setCriticalOnly(!criticalOnly)} />
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className={styles.section}>
                <h3>Privacy & Data</h3>

                <div className={styles.row}>
                  <div className={styles.rowInfo}>
                    <MapPin size={16} />
                    <div>
                      <p className={styles.rowTitle}>Share Location</p>
                      <p className={styles.rowDesc}>Allow the platform to use your location for local data</p>
                    </div>
                  </div>
                  <Toggle enabled={shareLocation} onToggle={() => setShareLocation(!shareLocation)} />
                </div>

                <div className={styles.row}>
                  <div className={styles.rowInfo}>
                    <Eye size={16} />
                    <div>
                      <p className={styles.rowTitle}>Analytics Opt-in</p>
                      <p className={styles.rowDesc}>Help improve the platform with anonymous usage data</p>
                    </div>
                  </div>
                  <Toggle enabled={analyticsOptIn} onToggle={() => setAnalyticsOptIn(!analyticsOptIn)} />
                </div>

                <div className={styles.row}>
                  <div className={styles.rowInfo}>
                    {publicProfile ? <Eye size={16} /> : <EyeOff size={16} />}
                    <div>
                      <p className={styles.rowTitle}>Public Profile</p>
                      <p className={styles.rowDesc}>Make your citizen profile visible to others</p>
                    </div>
                  </div>
                  <Toggle enabled={publicProfile} onToggle={() => setPublicProfile(!publicProfile)} />
                </div>

                <div className={styles.dangerZone}>
                  <h4>Danger Zone</h4>
                  <button className={styles.dangerBtn}>Clear All Local Data</button>
                  <button className={styles.dangerBtn}>Request Data Export</button>
                </div>
              </div>
            )}

            {activeTab === 'display' && (
              <div className={styles.section}>
                <h3>Display Settings</h3>

                <div className={styles.row}>
                  <div className={styles.rowInfo}>
                    {darkMode ? <Moon size={16} /> : <Sun size={16} />}
                    <div>
                      <p className={styles.rowTitle}>Dark Mode</p>
                      <p className={styles.rowDesc}>Use dark theme across the dashboard</p>
                    </div>
                  </div>
                  <Toggle enabled={darkMode} onToggle={() => setDarkMode(!darkMode)} />
                </div>

                <div className={styles.row}>
                  <div className={styles.rowInfo}>
                    <Monitor size={16} />
                    <div>
                      <p className={styles.rowTitle}>Compact View</p>
                      <p className={styles.rowDesc}>Reduce spacing for more data on screen</p>
                    </div>
                  </div>
                  <Toggle enabled={compactView} onToggle={() => setCompactView(!compactView)} />
                </div>

                <div className={styles.row}>
                  <div className={styles.rowInfo}>
                    <Eye size={16} />
                    <div>
                      <p className={styles.rowTitle}>Animations</p>
                      <p className={styles.rowDesc}>Enable chart and transition animations</p>
                    </div>
                  </div>
                  <Toggle enabled={animationsOn} onToggle={() => setAnimationsOn(!animationsOn)} />
                </div>

                <div className={styles.row}>
                  <div className={styles.rowInfo}>
                    <MapPin size={16} />
                    <div>
                      <p className={styles.rowTitle}>Map Labels</p>
                      <p className={styles.rowDesc}>Show location labels on city map</p>
                    </div>
                  </div>
                  <Toggle enabled={mapLabels} onToggle={() => setMapLabels(!mapLabels)} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.saveBtn} onClick={onClose}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}
