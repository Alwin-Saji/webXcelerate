import { TrendingUp, TrendingDown } from 'lucide-react';
import * as Icons from 'lucide-react';
import s from './KpiCard.module.css';

const colorValues = {
  primary: { base: '34,197,94', hex: '#22c55e' },
  warning: { base: '234,179,8', hex: '#eab308' },
  success: { base: '74,222,128', hex: '#4ade80' },
  accent: { base: '16,185,129', hex: '#10b981' },
  danger: { base: '239,68,68', hex: '#ef4444' },
};

export default function KpiCard({ title, value, change, icon, color, delay = 0 }) {
  const Icon = Icons[icon];
  const isPositive = change >= 0;
  const c = colorValues[color] || colorValues.primary;

  const cardStyle = {
    '--card-from': `rgba(${c.base}, 0.2)`,
    '--card-to': `rgba(${c.base}, 0.05)`,
    '--card-border': `rgba(${c.base}, 0.2)`,
    '--icon-bg': `rgba(${c.base}, 0.15)`,
    '--icon-color': c.hex,
    animationDelay: `${delay}ms`,
  };

  return (
    <div className={s.card} style={cardStyle}>
      <div className={s.cardTop}>
        <div>
          <p className={s.title}>{title}</p>
          <p className={s.value}>{value}</p>
        </div>
        <div className={s.iconBox}>
          {Icon && <Icon style={{ width: '1rem', height: '1rem' }} />}
        </div>
      </div>
      <div className={s.trend}>
        {isPositive ? (
          <TrendingUp className={`${s.trendIcon} ${s.trendPositive}`} />
        ) : (
          <TrendingDown className={`${s.trendIcon} ${s.trendNegative}`} />
        )}
        <span className={`${s.trendValue} ${isPositive ? s.trendPositive : s.trendNegative}`}>
          {isPositive ? '+' : ''}{change}%
        </span>
        <span className={s.trendLabel}>vs last week</span>
      </div>
    </div>
  );
}
