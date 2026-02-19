import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import {
  Trash2, Recycle, Truck, MapPin, Award, TrendingUp, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { wasteBinData, recyclingStats } from '../data/mockData';
import s from './Waste.module.css';

const iconColorMap = {
  primary: '#22c55e', accent: '#10b981', success: '#4ade80', danger: '#ef4444', warning: '#eab308',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={s.tooltip}>
      <p className={s.tooltipLabel}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} className={s.tooltipValue} style={{ color: p.color }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
        </p>
      ))}
    </div>
  );
};

const getBinColor = (fill) => fill > 80 ? '#ef4444' : fill >= 50 ? '#f59e0b' : '#22c55e';

function RecyclingChallenge() {
  const [reported, setReported] = useState([]);
  const points = reported.length * 10;
  const items = [
    { id: 1, label: 'Illegal Dumping', emoji: '🚫', desc: 'Report unauthorized waste' },
    { id: 2, label: 'Full Bin', emoji: '🗑️', desc: 'Report overflowing bin' },
    { id: 3, label: 'Recycling Issue', emoji: '♻️', desc: 'Wrong items in recycling' },
    { id: 4, label: 'Street Litter', emoji: '🧹', desc: 'Report litter in area' },
  ];

  return (
    <div className={s.card}>
      <div className={s.challengeHeader}>
        <h3 className={s.cardHeader} style={{ marginBottom: 0 }}>
          <Award style={{ width: '1rem', height: '1rem', color: 'var(--warning)' }} /> Community Reporting
        </h3>
        <div className={s.pointsBadge}>{points} pts</div>
      </div>
      <div className={s.challengeGrid}>
        {items.map(item => {
          const isReported = reported.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => !isReported && setReported(prev => [...prev, item.id])}
              className={`${s.challengeBtn} ${isReported ? s.challengeBtnReported : ''}`}
            >
              <div className={s.challengeEmoji}>{item.emoji}</div>
              <p className={s.challengeLabel}>{item.label}</p>
              <p className={s.challengeDesc}>{isReported ? '✓ Reported!' : item.desc}</p>
            </button>
          );
        })}
      </div>
      {points >= 30 && (
        <div className={s.badgeUnlock}>🏆 Eco Champion Badge Unlocked!</div>
      )}
    </div>
  );
}

function RoutePlanner() {
  const [route, setRoute] = useState(
    wasteBinData.filter(b => b.fill > 60).sort((a, b) => b.fill - a.fill)
  );

  const moveUp = (index) => {
    if (index === 0) return;
    const newRoute = [...route];
    [newRoute[index - 1], newRoute[index]] = [newRoute[index], newRoute[index - 1]];
    setRoute(newRoute);
  };

  const moveDown = (index) => {
    if (index === route.length - 1) return;
    const newRoute = [...route];
    [newRoute[index + 1], newRoute[index]] = [newRoute[index], newRoute[index + 1]];
    setRoute(newRoute);
  };

  return (
    <div className={s.card}>
      <h3 className={s.cardHeader}>
        <Truck style={{ width: '1rem', height: '1rem', color: 'var(--primary)' }} /> Collection Route Planner
      </h3>
      <p style={{ fontSize: '0.75rem', color: 'var(--dark-text)', marginBottom: '0.75rem' }}>Reorder stops by priority — click arrows to rearrange</p>
      <div className={s.routeList}>
        {route.map((bin, i) => (
          <div key={bin.id} className={s.routeItem}>
            <div className={s.routeArrows}>
              <button onClick={() => moveUp(i)} className={s.routeArrowBtn} disabled={i === 0}>▲</button>
              <button onClick={() => moveDown(i)} className={s.routeArrowBtn} disabled={i === route.length - 1}>▼</button>
            </div>
            <div className={s.routeNum} style={{ backgroundColor: getBinColor(bin.fill) }}>{i + 1}</div>
            <div className={s.routeInfo}>
              <p className={s.routeInfoName}>{bin.location}</p>
              <p className={s.routeInfoMeta}>{bin.type} • Last: {bin.lastCollected}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: getBinColor(bin.fill) }}>{bin.fill}%</span>
            </div>
          </div>
        ))}
      </div>
      <div className={s.routeFooter}>
        <span>Est. route time: ~{route.length * 12} min</span>
        <span>{route.length} stops</span>
      </div>
    </div>
  );
}

export default function Waste() {
  const { theme } = useTheme();
  const gridStroke = theme === 'light' ? '#d4e8d4' : '#1c1c1c';
  const tickFill = theme === 'light' ? '#3d5a42' : '#a1a1aa';
  const totalCollected = recyclingStats.reduce((sum, r) => sum + r.collected, 0);
  const totalRecycled = recyclingStats.reduce((sum, r) => sum + r.recycled, 0);
  const overallRate = Math.round((totalRecycled / totalCollected) * 100);

  const pieData = recyclingStats.map(r => ({ name: r.material, value: r.collected }));
  const COLORS = ['#22c55e', '#10b981', '#4ade80', '#eab308', '#ef4444'];

  const stats = [
    { label: 'Total Bins', value: wasteBinData.length, icon: Trash2, iconColor: 'primary' },
    { label: 'Critical Bins', value: wasteBinData.filter(b => b.fill > 80).length, icon: AlertTriangle, iconColor: 'danger' },
    { label: 'Recycling Rate', value: `${overallRate}%`, icon: Recycle, iconColor: 'success' },
    { label: 'Collected Today', value: `${(totalCollected / 1000).toFixed(1)}K kg`, icon: CheckCircle2, iconColor: 'accent' },
  ];

  return (
    <div className={s.page}>
      <div>
        <h2 className={s.pageTitle}>Waste Management</h2>
        <p className={s.pageSubtitle}>Bin monitoring, collection routes & recycling analytics</p>
      </div>

      {/* Summary Stats */}
      <div className={s.statsGrid}>
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={`${s.statCard} animate-fade-in-up`} style={{ animationDelay: `${i * 80}ms` }}>
              <Icon style={{ width: '1.25rem', height: '1.25rem', color: iconColorMap[stat.iconColor], marginBottom: '0.5rem' }} />
              <p className={s.statValue}>{stat.value}</p>
              <p className={s.statLabel}>{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Map + Route Planner */}
      <div className={s.rowThirds}>
        <div className={s.mapCard}>
          <div className={s.mapCardHeader}>
            <MapPin style={{ width: '1rem', height: '1rem', color: 'var(--primary)' }} /> Bin Status Map
          </div>
          <div className={s.mapWrap}>
            <MapContainer center={[40.7549, -73.9840]} zoom={12} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
              {wasteBinData.map(bin => (
                <CircleMarker
                  key={bin.id}
                  center={[bin.lat, bin.lng]}
                  radius={8 + bin.fill / 12}
                  fillColor={getBinColor(bin.fill)}
                  fillOpacity={0.6 + (bin.fill / 250)}
                  stroke={true}
                  color={getBinColor(bin.fill)}
                  weight={2}
                >
                  <Popup>
                    <div className={s.popupContent}>
                      <p className={s.popupTitle}>🗑️ {bin.location}</p>
                      <div style={{ width: '100%', background: 'rgba(0,0,0,0.3)', borderRadius: '9999px', height: '0.5rem', marginTop: '0.5rem' }}>
                        <div style={{ width: `${bin.fill}%`, backgroundColor: getBinColor(bin.fill), height: '0.5rem', borderRadius: '9999px' }} />
                      </div>
                      <div className={s.popupRow} style={{ marginTop: '0.25rem' }}>
                        <span style={{ textTransform: 'capitalize' }}>{bin.type}</span>
                        <span style={{ color: getBinColor(bin.fill) }}>{bin.fill}%</span>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        </div>
        <RoutePlanner />
      </div>

      {/* Recycling charts + Gamification */}
      <div className={s.rowTriple}>
        {/* Recycling Bar */}
        <div className={s.card}>
          <h3 className={s.cardHeader}>
            <TrendingUp style={{ width: '1rem', height: '1rem', color: 'var(--primary)' }} /> Recycling by Material
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={recyclingStats} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis type="number" tick={{ fill: tickFill, fontSize: 10 }} />
              <YAxis type="category" dataKey="material" tick={{ fill: tickFill, fontSize: 11 }} width={60} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="collected" name="Collected (kg)" fill="#22c55e" radius={[0, 4, 4, 0]} />
              <Bar dataKey="recycled" name="Recycled (kg)" fill="#22c55e" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie */}
        <div className={s.card}>
          <h3 className={s.cardHeader}>Waste Composition</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className={s.legendGrid}>
            {pieData.map((entry, i) => (
              <div key={i} className={s.legendItem}>
                <div className={s.legendDot} style={{ backgroundColor: COLORS[i] }} />
                <span className={s.legendText}>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        <RecyclingChallenge />
      </div>
    </div>
  );
}
