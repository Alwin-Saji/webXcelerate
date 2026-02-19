import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  AreaChart, Area, LineChart, Line, PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import {
  Zap, Sun, Wind, Gauge, Leaf, TrendingDown, Battery, Activity
} from 'lucide-react';
import { gridData, hourlyEnergy, carbonData, energyData } from '../data/mockData';
import s from './Energy.module.css';

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
          {p.name}: {p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

function CarbonCalculator() {
  const [transport, setTransport] = useState(30);
  const [electricity, setElectricity] = useState(50);
  const [waste, setWaste] = useState(20);
  const total = ((transport * 0.12) + (electricity * 0.08) + (waste * 0.04)).toFixed(1);
  const rating = total < 5 ? 'Excellent' : total < 8 ? 'Good' : total < 12 ? 'Fair' : 'Needs Improvement';
  const ratingColor = total < 5 ? '#4ade80' : total < 8 ? '#22c55e' : total < 12 ? '#eab308' : '#ef4444';

  return (
    <div className={s.card}>
      <h3 className={s.cardHeader}>
        <Leaf style={{ width: '1rem', height: '1rem', color: 'var(--success)' }} /> Carbon Footprint Calculator
      </h3>
      <div className={s.calcSliders}>
        {[
          { label: 'Daily Commute (km)', value: transport, set: setTransport, max: 100, icon: '🚗' },
          { label: 'Electricity Usage (kWh)', value: electricity, set: setElectricity, max: 100, icon: '⚡' },
          { label: 'Waste Generated (kg)', value: waste, set: setWaste, max: 50, icon: '🗑️' },
        ].map((item, i) => (
          <div key={i}>
            <div className={s.sliderHeader}>
              <label className={s.sliderLabel}>{item.icon} {item.label}</label>
              <span className={s.sliderValue}>{item.value}</span>
            </div>
            <input
              type="range" min="0" max={item.max} value={item.value}
              onChange={(e) => item.set(parseInt(e.target.value))}
              className={s.calcSlider}
            />
          </div>
        ))}
        <div className={s.calcResult}>
          <p className={s.calcResultLabel}>Estimated Daily CO₂</p>
          <p className={s.calcResultValue}>{total} <span className={s.calcResultUnit}>kg</span></p>
          <p className={s.calcRating} style={{ color: ratingColor }}>{rating}</p>
        </div>
      </div>
    </div>
  );
}

export default function Energy() {
  const { theme } = useTheme();
  const gridStroke = theme === 'light' ? '#d4e8d4' : '#1c1c1c';
  const tickFill = theme === 'light' ? '#3d5a42' : '#a1a1aa';
  const loadPercent = Math.round((gridData.currentLoad / gridData.totalCapacity) * 100);

  const stats = [
    { label: 'Grid Load', value: `${loadPercent}%`, icon: Gauge, iconColor: loadPercent > 85 ? '#ef4444' : loadPercent > 70 ? '#eab308' : '#4ade80' },
    { label: 'Renewable Mix', value: `${gridData.renewable}%`, icon: Sun, iconColor: '#eab308' },
    { label: 'Current Load', value: `${(gridData.currentLoad / 1000).toFixed(1)} GW`, icon: Zap, iconColor: '#22c55e' },
    { label: 'Peak Hour', value: gridData.peakHour, icon: Activity, iconColor: '#10b981' },
  ];

  return (
    <div className={s.page}>
      <div>
        <h2 className={s.pageTitle}>Energy & Sustainability</h2>
        <p className={s.pageSubtitle}>Grid monitoring, renewable tracking & carbon footprint analysis</p>
      </div>

      {/* Grid Stats */}
      <div className={s.statsGrid}>
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={`${s.statCard} animate-fade-in-up`} style={{ animationDelay: `${i * 80}ms` }}>
              <Icon style={{ width: '1.25rem', height: '1.25rem', color: stat.iconColor, marginBottom: '0.5rem' }} />
              <p className={s.statValue}>{stat.value}</p>
              <p className={s.statLabel}>{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Demand/Supply + Energy Sources */}
      <div className={s.rowThirds}>
        <div className={s.card}>
          <h3 className={s.cardHeader}>
            <Zap style={{ width: '1rem', height: '1rem', color: 'var(--primary)' }} /> Hourly Energy Demand vs Supply
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={hourlyEnergy}>
              <defs>
                <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSupply" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="hour" tick={{ fill: tickFill, fontSize: 10 }} interval={2} />
              <YAxis tick={{ fill: tickFill, fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Area type="monotone" dataKey="demand" name="Demand (MW)" stroke="#ef4444" fill="url(#colorDemand)" strokeWidth={2} />
              <Area type="monotone" dataKey="supply" name="Supply (MW)" stroke="#22c55e" fill="url(#colorSupply)" strokeWidth={2} />
              <Area type="monotone" dataKey="solar" name="Solar (MW)" stroke="#f59e0b" fill="url(#colorSolar)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Energy Sources Pie */}
        <div className={s.card}>
          <h3 className={s.cardHeader}>Energy Sources</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={gridData.sources} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3}>
                {gridData.sources.map((src, i) => <Cell key={i} fill={src.color} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className={s.sourcesList}>
            {gridData.sources.map((src, i) => (
              <div key={i} className={s.sourceRow}>
                <div className={s.sourceInfo}>
                  <div className={s.sourceDot} style={{ backgroundColor: src.color }} />
                  <span className={s.sourceName}>{src.name}</span>
                </div>
                <span className={s.sourceValue}>{src.value}%</span>
              </div>
            ))}
          </div>

          {/* Grid Health Bar */}
          <div className={s.gridHealth}>
            <div className={s.gridHealthHeader}>
              <span className={s.gridHealthLabel}><Battery style={{ width: '0.75rem', height: '0.75rem' }} /> Grid Load</span>
              <span style={{ color: loadPercent > 85 ? '#ef4444' : loadPercent > 70 ? '#eab308' : '#4ade80' }}>{loadPercent}%</span>
            </div>
            <div className={s.gridHealthBar}>
              <div className={s.gridHealthFill} style={{ width: `${loadPercent}%`, background: loadPercent > 85 ? '#ef4444' : loadPercent > 70 ? '#f59e0b' : '#22c55e' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Carbon + Calculator */}
      <div className={s.rowThirds}>
        <div className={s.card}>
          <h3 className={s.cardHeader}>
            <TrendingDown style={{ width: '1rem', height: '1rem', color: 'var(--success)' }} /> Carbon Emissions Trend (6 months)
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={carbonData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="month" tick={{ fill: tickFill, fontSize: 11 }} />
              <YAxis tick={{ fill: tickFill, fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="emissions" name="Emissions (tons)" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="offset" name="Offset (tons)" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Line dataKey="target" name="Target" stroke="#f59e0b" strokeWidth={2} dot={false} type="monotone" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <CarbonCalculator />
      </div>
    </div>
  );
}
