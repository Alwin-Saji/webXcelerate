import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import {
  Bus, Clock, Users, TrendingUp, Navigation, AlertTriangle, Gauge,
  MapPin, ArrowRight
} from 'lucide-react';
import { busRoutes, vehiclePositions, trafficFlowData } from '../data/mockData';
import s from './Transport.module.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const createIcon = (emoji, size = 28) =>
  L.divIcon({
    html: `<div style="font-size:${size}px;line-height:1;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5))">${emoji}</div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });

const iconColorMap = {
  primary: '#22c55e',
  accent: '#10b981',
  success: '#4ade80',
  danger: '#ef4444',
  warning: '#eab308',
};

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

function TrafficSimulator() {
  const [volume, setVolume] = useState(50);
  const congestion = volume > 75 ? 'Heavy' : volume > 40 ? 'Moderate' : 'Light';
  const avgSpeed = Math.round(55 - (volume / 100) * 40);
  const conColor = volume > 75 ? '#ef4444' : volume > 40 ? '#eab308' : '#4ade80';

  return (
    <div className={s.card}>
      <h3 className={s.cardHeader}>
        <Gauge style={{ width: '1rem', height: '1rem', color: 'var(--primary)' }} /> Traffic Simulator
      </h3>
      <div className={s.spaceY3}>
        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--dark-text)', display: 'block', marginBottom: '0.5rem' }}>Traffic Volume: {volume}%</label>
          <input
            type="range" min="0" max="100" value={volume}
            onChange={(e) => setVolume(parseInt(e.target.value))}
            className={s.simSlider}
          />
          <div className={s.simTicks}>
            <span>Low</span><span>Medium</span><span>High</span>
          </div>
        </div>
        <div className={s.simGrid}>
          <div className={s.simBox}>
            <p className={s.simBoxLabel}>Congestion</p>
            <p className={s.simBoxValue} style={{ color: conColor }}>{congestion}</p>
          </div>
          <div className={s.simBox}>
            <p className={s.simBoxLabel}>Avg Speed</p>
            <p className={s.simBoxValue} style={{ color: 'var(--dark-heading)' }}>{avgSpeed} mph</p>
          </div>
        </div>
        <div className={s.simBox} style={{ textAlign: 'left' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--dark-text)', marginBottom: '0.5rem' }}>Impact Prediction</p>
          <div className={s.impactBar}>
            <div className={s.impactFill} style={{ width: `${volume}%`, background: volume > 75 ? '#ef4444' : volume > 40 ? '#f59e0b' : '#22c55e' }} />
          </div>
          <p className={s.impactHint}>
            {volume > 75 ? '⚠️ Consider rerouting traffic through alternative lanes' : volume > 40 ? '🔄 Traffic moving with moderate delays' : '✅ Roads clear — optimal flow conditions'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Transport() {
  const { theme } = useTheme();
  const gridStroke = theme === 'light' ? '#d4e8d4' : '#1c1c1c';
  const tickFill = theme === 'light' ? '#3d5a42' : '#a1a1aa';
  const [selectedRoute, setSelectedRoute] = useState(null);

  const stats = [
    { label: 'Active Vehicles', value: vehiclePositions.length, icon: Bus, iconColor: 'primary' },
    { label: 'Total Ridership', value: '20.7K', icon: Users, iconColor: 'accent' },
    { label: 'On-Time Rate', value: '67%', icon: Clock, iconColor: 'success' },
    { label: 'Delayed Routes', value: '2', icon: AlertTriangle, iconColor: 'danger' },
  ];

  return (
    <div className={s.page}>
      <div>
        <h2 className={s.pageTitle}>Transport Module</h2>
        <p className={s.pageSubtitle}>Real-time vehicle tracking, route optimization & predictive ETAs</p>
      </div>

      {/* Quick Stats */}
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

      <div className={s.rowThirds}>
        {/* Vehicle Map */}
        <div className={s.mapCard}>
          <div className={s.mapCardHeader}>
            <Navigation style={{ width: '1rem', height: '1rem', color: 'var(--primary)' }} /> Live Vehicle Tracking
          </div>
          <div className={s.mapWrap}>
            <MapContainer center={[40.7549, -73.9840]} zoom={12} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
              {vehiclePositions.map(v => (
                <Marker key={v.id} position={[v.lat, v.lng]} icon={createIcon(v.type === 'bus' ? '🚌' : '🚊', 24)}>
                  <Popup>
                    <div className={s.popupContent}>
                      <p className={s.popupTitle}>{v.id} — Route {v.route}</p>
                      <p className={s.popupSub}>Speed: {v.speed} mph | Heading: {v.heading}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        <TrafficSimulator />
      </div>

      {/* Route Table + Traffic Chart */}
      <div className={s.rowHalves}>
        {/* Bus Routes */}
        <div className={s.card}>
          <h3 className={s.cardHeader}>
            <MapPin style={{ width: '1rem', height: '1rem', color: 'var(--primary)' }} /> Bus Routes & Schedules
          </h3>
          <div className={s.routeList}>
            {busRoutes.map(route => (
              <div
                key={route.id}
                onClick={() => setSelectedRoute(selectedRoute === route.id ? null : route.id)}
                className={`${s.routeItem} ${selectedRoute === route.id ? s.routeItemActive : ''}`}
              >
                <div className={s.routeRow}>
                  <div className={s.routeInfo}>
                    <div className={`${s.routeBadge} ${route.status === 'on-time' ? s.routeBadgeOnTime : s.routeBadgeDelayed}`}>
                      {route.id}
                    </div>
                    <div>
                      <p className={s.routeName}>{route.name}</p>
                      <p className={s.routeMeta}>{route.stops} stops • {route.ridership.toLocaleString()} riders/day</p>
                    </div>
                  </div>
                  <div>
                    <span className={`${s.routeStatus} ${route.status === 'on-time' ? s.statusOnTime : s.statusDelayed}`}>
                      {route.status === 'on-time' ? '✓ On Time' : `⚠ +${route.avgDelay}`}
                    </span>
                  </div>
                </div>
                {selectedRoute === route.id && (
                  <div className={s.routeDetail}>
                    <span className={s.etaBadge}>ETA: ~{parseInt(route.avgDelay) + 12} min</span>
                    <ArrowRight style={{ width: '0.75rem', height: '0.75rem' }} />
                    <span>Next departure in {Math.floor(Math.random() * 10) + 2} min</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Chart */}
        <div className={s.card}>
          <h3 className={s.cardHeader}>
            <TrendingUp style={{ width: '1rem', height: '1rem', color: 'var(--primary)' }} /> Hourly Traffic & Speed
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trafficFlowData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="hour" tick={{ fill: tickFill, fontSize: 10 }} interval={2} />
              <YAxis tick={{ fill: tickFill, fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Line type="monotone" dataKey="vehicles" name="Vehicles" stroke="#22c55e" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="avgSpeed" name="Avg Speed" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
