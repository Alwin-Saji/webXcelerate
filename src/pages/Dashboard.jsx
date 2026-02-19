import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  Activity, Clock, Play, Pause, MapPin, Star, Calendar, Bus,
  AlertTriangle, CheckCircle, Circle, Route, Ticket
} from 'lucide-react';
import KpiCard from '../components/KpiCard';
import {
  kpiData, trafficFlowData, energyData, wasteBinData, notifications,
  adminKpiData, citizenKpiData, visitorKpiData,
  citizenTransitSchedule, citizenReports, communityEvents,
  touristAttractions, visitorItineraries, visitorEvents
} from '../data/mockData';
import s from './Dashboard.module.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={s.tooltip}>
      <p className={s.tooltipLabel}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} className={s.tooltipValue} style={{ color: p.color }}>
          {p.name}: {p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

const alertColors = {
  danger: { border: 'rgba(239,68,68,0.3)', bg: 'rgba(239,68,68,0.05)', dot: '#ef4444' },
  warning: { border: 'rgba(234,179,8,0.3)', bg: 'rgba(234,179,8,0.05)', dot: '#eab308' },
  info: { border: 'rgba(34,197,94,0.3)', bg: 'rgba(34,197,94,0.05)', dot: '#22c55e' },
  success: { border: 'rgba(74,222,128,0.3)', bg: 'rgba(74,222,128,0.05)', dot: '#4ade80' },
};

const statusIcon = {
  open: <Circle size={14} style={{ color: '#eab308' }} />,
  'in-progress': <AlertTriangle size={14} style={{ color: '#3b82f6' }} />,
  resolved: <CheckCircle size={14} style={{ color: '#22c55e' }} />,
};

/* ─── ADMIN VIEW ─── */
function AdminDashboard() {
  const { theme } = useTheme();
  const gridStroke = theme === 'light' ? '#d4e8d4' : '#1c1c1c';
  const tickFill = theme === 'light' ? '#3d5a42' : '#a1a1aa';
  const [animating, setAnimating] = useState(false);
  const [visibleHours, setVisibleHours] = useState(24);
  const unreadAlerts = notifications.filter(n => !n.read);

  const animateChart = () => {
    setAnimating(true); setVisibleHours(0);
    let h = 0;
    const iv = setInterval(() => { h++; setVisibleHours(h); if (h >= 24) { clearInterval(iv); setAnimating(false); } }, 100);
  };

  const binsByStatus = [
    { name: 'Critical (>80%)', value: wasteBinData.filter(b => b.fill > 80).length, color: '#ef4444' },
    { name: 'Medium (50-80%)', value: wasteBinData.filter(b => b.fill >= 50 && b.fill <= 80).length, color: '#f59e0b' },
    { name: 'Low (<50%)', value: wasteBinData.filter(b => b.fill < 50).length, color: '#22c55e' },
  ];

  return (
    <>
      <div className={s.kpiGrid}>
        {adminKpiData.map((kpi, i) => <KpiCard key={kpi.title} {...kpi} delay={i * 80} />)}
      </div>

      <div className={s.chartRowThirds}>
        <div className={s.card}>
          <div className={s.cardHeader}>
            <div className={s.cardTitle}>
              <Activity size={16} style={{ color: 'var(--primary)' }} /> Traffic Flow (24h)
            </div>
            <button onClick={animateChart} disabled={animating} className={s.animateBtn}>
              {animating ? <Pause size={12} /> : <Play size={12} />}
              {animating ? 'Playing…' : 'Animate'}
            </button>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={trafficFlowData.slice(0, visibleHours)}>
              <defs>
                <linearGradient id="colorVehicles" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="hour" tick={{ fill: tickFill, fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fill: tickFill, fontSize: 11 }} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
              <Area type="monotone" dataKey="vehicles" name="Vehicles" stroke="#22c55e" fill="url(#colorVehicles)" strokeWidth={2} />
              <Area type="monotone" dataKey="avgSpeed" name="Avg Speed (mph)" stroke="#10b981" fill="url(#colorSpeed)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className={s.card}>
          <h3 className={s.cardTitle} style={{ marginBottom: '1rem' }}>Waste Bin Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={binsByStatus} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={4} animationDuration={1000}>
                {binsByStatus.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
            {binsByStatus.map((st, i) => (
              <div key={i} className={s.legendRow}>
                <div className={s.legendDot}>
                  <div className={s.legendDotCircle} style={{ backgroundColor: st.color }} />
                  <span className={s.legendLabel}>{st.name}</span>
                </div>
                <span className={s.legendValue}>{st.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={s.chartRowHalves}>
        <div className={s.card}>
          <h3 className={s.cardTitle} style={{ marginBottom: '1rem' }}>Energy Sources (Weekly)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={energyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="day" tick={{ fill: tickFill, fontSize: 11 }} />
              <YAxis tick={{ fill: tickFill, fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="solar" name="Solar" fill="#eab308" radius={[2, 2, 0, 0]} stackId="stack" />
              <Bar dataKey="wind" name="Wind" fill="#22c55e" radius={[2, 2, 0, 0]} stackId="stack" />
              <Bar dataKey="grid" name="Grid" fill={theme === 'light' ? '#9ca3af' : '#3f3f46'} radius={[2, 2, 0, 0]} stackId="stack" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={s.card}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>Recent Alerts</h3>
            <span className={s.alertsBadge}>{unreadAlerts.length} unread</span>
          </div>
          <div className={s.alertsList}>
            {notifications.map(n => {
              const ac = alertColors[n.type] || alertColors.info;
              return (
                <div key={n.id} className={s.alertItem} style={{ borderColor: ac.border, backgroundColor: ac.bg }}>
                  <div className={s.alertInner}>
                    <div className={s.alertDot} style={{ backgroundColor: ac.dot }} />
                    <div className={s.alertContent}>
                      <div className={s.alertTop}>
                        <p className={s.alertTitle}>{n.title}</p>
                        <div className={s.alertTime}>
                          <Clock size={12} />
                          <span className={s.alertTimeText}>{n.time}</span>
                        </div>
                      </div>
                      <p className={s.alertMessage}>{n.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── CITIZEN VIEW ─── */
function CitizenDashboard() {
  return (
    <>
      <div className={s.kpiGrid}>
        {citizenKpiData.map((kpi, i) => <KpiCard key={kpi.title} {...kpi} delay={i * 80} />)}
      </div>

      <div className={s.chartRowHalves}>
        {/* Transit Schedule */}
        <div className={s.card}>
          <h3 className={s.cardTitle} style={{ marginBottom: '1rem' }}>
            <Bus size={16} style={{ color: 'var(--primary)' }} /> My Transit Schedule
          </h3>
          <div className={s.transitList}>
            {citizenTransitSchedule.map((t, i) => (
              <div key={i} className={s.transitItem}>
                <div className={s.transitRoute}>
                  <Route size={14} style={{ color: '#22c55e' }} />
                  <span className={s.transitName}>{t.route}</span>
                </div>
                <div className={s.transitMeta}>
                  <span className={s.transitStop}>{t.stop}</span>
                  <span className={s.transitEta}>{t.eta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Reports */}
        <div className={s.card}>
          <h3 className={s.cardTitle} style={{ marginBottom: '1rem' }}>
            <AlertTriangle size={16} style={{ color: '#eab308' }} /> My Reports
          </h3>
          <div className={s.reportsList}>
            {citizenReports.map(r => (
              <div key={r.id} className={s.reportItem}>
                <div className={s.reportHeader}>
                  {statusIcon[r.status]}
                  <span className={s.reportTitle}>{r.title}</span>
                </div>
                <div className={s.reportMeta}>
                  <span className={`${s.reportStatus} ${s['status_' + r.status.replace('-', '')]}`}>{r.status}</span>
                  <span className={s.reportDate}>{r.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Community Events */}
      <div className={s.card}>
        <h3 className={s.cardTitle} style={{ marginBottom: '1rem' }}>
          <Calendar size={16} style={{ color: 'var(--primary)' }} /> Community Events
        </h3>
        <div className={s.eventsGrid}>
          {communityEvents.slice(0, 4).map(e => (
            <div key={e.id} className={s.eventCard}>
              <div className={s.eventDate}>{new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
              <h4 className={s.eventTitle}>{e.title}</h4>
              <p className={s.eventMeta}>{e.time} · {e.location}</p>
              <span className={s.eventBadge}>{e.category}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ─── VISITOR VIEW ─── */
function VisitorDashboard() {
  const [filter, setFilter] = useState('All');
  const categories = ['All', ...new Set(touristAttractions.map(a => a.category))];
  const filtered = filter === 'All' ? touristAttractions : touristAttractions.filter(a => a.category === filter);

  return (
    <>
      <div className={s.kpiGrid}>
        {visitorKpiData.map((kpi, i) => <KpiCard key={kpi.title} {...kpi} delay={i * 80} />)}
      </div>

      {/* Tourist Attractions */}
      <div className={s.card}>
        <div className={s.cardHeader}>
          <h3 className={s.cardTitle}>
            <MapPin size={16} style={{ color: 'var(--primary)' }} /> Tourist Attractions
          </h3>
          <div className={s.filterBar}>
            {categories.map(c => (
              <button key={c} className={`${s.filterBtn} ${filter === c ? s.filterActive : ''}`} onClick={() => setFilter(c)}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className={s.attractionsGrid}>
          {filtered.map(a => (
            <div key={a.id} className={s.attractionCard}>
              <div className={s.attractionEmoji}>{a.image}</div>
              <div className={s.attractionBody}>
                <h4 className={s.attractionName}>{a.name}</h4>
                <p className={s.attractionDesc}>{a.description}</p>
                <div className={s.attractionMeta}>
                  <span className={s.attractionRating}><Star size={12} style={{ color: '#eab308' }} /> {a.rating}</span>
                  <span className={s.attractionVisitors}>{a.visitors}</span>
                </div>
                <div className={s.attractionInfo}>
                  <span>{a.hours}</span>
                  <span className={s.attractionAdmission}>{a.admission}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={s.chartRowHalves}>
        {/* Suggested Itineraries */}
        <div className={s.card}>
          <h3 className={s.cardTitle} style={{ marginBottom: '1rem' }}>
            <Route size={16} style={{ color: 'var(--primary)' }} /> Suggested Itineraries
          </h3>
          <div className={s.itineraryList}>
            {visitorItineraries.map(it => (
              <div key={it.id} className={s.itineraryCard}>
                <div className={s.itineraryHeader}>
                  <h4>{it.name}</h4>
                  <span className={s.itineraryDuration}>{it.duration}</span>
                </div>
                <div className={s.itineraryStops}>
                  {it.stops.map((stop, i) => (
                    <span key={i} className={s.itineraryStop}>
                      {i > 0 && <span className={s.itineraryArrow}>→</span>}
                      {stop}
                    </span>
                  ))}
                </div>
                <span className={`${s.itineraryDifficulty} ${s['diff_' + it.difficulty.toLowerCase()]}`}>{it.difficulty}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className={s.card}>
          <h3 className={s.cardTitle} style={{ marginBottom: '1rem' }}>
            <Ticket size={16} style={{ color: 'var(--primary)' }} /> Upcoming Events
          </h3>
          <div className={s.visitorEventsList}>
            {visitorEvents.map(e => (
              <div key={e.id} className={s.visitorEventItem}>
                <div className={s.visitorEventDate}>
                  {new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className={s.visitorEventBody}>
                  <h4>{e.title}</h4>
                  <p>{e.time} · {e.location}</p>
                </div>
                <span className={`${s.visitorEventBadge} ${e.free ? s.badgeFree : s.badgePaid}`}>
                  {e.free ? 'Free' : 'Paid'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── MAIN DASHBOARD ─── */
const roleConfig = {
  admin: { title: 'Admin Dashboard', subtitle: 'Full system overview & analytics', component: AdminDashboard },
  citizen: { title: 'My Neighborhood', subtitle: 'Personal city services & local info', component: CitizenDashboard },
  visitor: { title: 'Explore the City', subtitle: 'Attractions, events & getting around', component: VisitorDashboard },
};

export default function Dashboard({ currentRole = 'admin' }) {
  const config = roleConfig[currentRole] || roleConfig.admin;
  const RoleView = config.component;

  return (
    <div className={s.page}>
      <div>
        <h2 className={s.pageTitle}>{config.title}</h2>
        <p className={s.pageSubtitle}>{config.subtitle}</p>
      </div>
      <RoleView />
    </div>
  );
}
