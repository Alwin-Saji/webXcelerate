import { useState } from 'react';
import {
  Users, MessageSquare, AlertCircle, Calendar, MapPin, Clock,
  Send, ChevronRight, Heart, Star, Shield
} from 'lucide-react';
import { communityEvents } from '../data/mockData';
import s from './Citizens.module.css';

const iconColorMap = {
  primary: '#22c55e', accent: '#10b981', success: '#4ade80', danger: '#ef4444', warning: '#eab308',
};

const catColorMap = {
  governance: { bg: 'rgba(34,197,94,0.15)', color: '#22c55e', border: 'rgba(34,197,94,0.2)' },
  sustainability: { bg: 'rgba(74,222,128,0.15)', color: '#4ade80', border: 'rgba(74,222,128,0.2)' },
  environment: { bg: 'rgba(74,222,128,0.15)', color: '#4ade80', border: 'rgba(74,222,128,0.2)' },
  transport: { bg: 'rgba(16,185,129,0.15)', color: '#10b981', border: 'rgba(16,185,129,0.2)' },
  safety: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444', border: 'rgba(239,68,68,0.2)' },
};

function FeedbackForm() {
  const [category, setCategory] = useState('general');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setMessage('');
        setRating(0);
        setCategory('general');
      }, 3000);
    }
  };

  if (submitted) {
    return (
      <div className={s.successCard}>
        <div className={s.successIcon} style={{ background: 'rgba(74,222,128,0.15)' }}>
          <Heart style={{ width: '2rem', height: '2rem', color: 'var(--success)' }} />
        </div>
        <h3 className={s.successTitle}>Thank You!</h3>
        <p className={s.successMsg}>Your feedback has been submitted and will be reviewed by city officials.</p>
      </div>
    );
  }

  return (
    <div className={s.card}>
      <h3 className={s.cardHeader}>
        <MessageSquare style={{ width: '1rem', height: '1rem', color: 'var(--primary)' }} /> Submit Feedback
      </h3>
      <form onSubmit={handleSubmit} className={s.formGroup}>
        <div>
          <label className={s.formLabel}>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={s.formSelect}>
            <option value="general">General Feedback</option>
            <option value="transport">Transport Issue</option>
            <option value="waste">Waste Management</option>
            <option value="energy">Energy & Utilities</option>
            <option value="safety">Public Safety</option>
            <option value="infrastructure">Infrastructure</option>
          </select>
        </div>

        <div>
          <label className={s.formLabel}>Your Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="Describe your feedback, suggestion, or report..."
            className={s.formTextarea}
          />
        </div>

        <div>
          <label className={s.formLabel}>Rate City Services</label>
          <div className={s.starRow}>
            {[1, 2, 3, 4, 5].map(star => (
              <button key={star} type="button" onClick={() => setRating(star)} className={s.starBtn}>
                <Star style={{ width: '1.25rem', height: '1.25rem', color: star <= rating ? '#eab308' : 'var(--dark-border)', fill: star <= rating ? '#eab308' : 'none' }} />
              </button>
            ))}
          </div>
        </div>

        <button type="submit" disabled={!message.trim()} className={s.submitBtn}>
          <Send style={{ width: '1rem', height: '1rem' }} /> Submit Feedback
        </button>
      </form>
    </div>
  );
}

function EmergencyReport() {
  const [selectedType, setSelectedType] = useState(null);
  const [reported, setReported] = useState(false);

  const types = [
    { id: 'fire', emoji: '🔥', label: 'Fire', desc: 'Report fire or smoke' },
    { id: 'flood', emoji: '🌊', label: 'Flooding', desc: 'Water overflow or damage' },
    { id: 'power', emoji: '⚡', label: 'Power Outage', desc: 'Electrical failure' },
    { id: 'accident', emoji: '🚨', label: 'Accident', desc: 'Traffic or street accident' },
    { id: 'gas', emoji: '💨', label: 'Gas Leak', desc: 'Suspected gas leak' },
    { id: 'infra', emoji: '🏗️', label: 'Infrastructure', desc: 'Damaged road or structure' },
  ];

  const handleReport = () => {
    if (selectedType) {
      setReported(true);
      setTimeout(() => {
        setReported(false);
        setSelectedType(null);
      }, 3000);
    }
  };

  if (reported) {
    return (
      <div className={s.emergencyCard}>
        <div className={s.successIcon} style={{ background: 'rgba(239,68,68,0.15)' }}>
          <Shield style={{ width: '2rem', height: '2rem', color: 'var(--danger)' }} />
        </div>
        <h3 className={s.successTitle}>Emergency Reported</h3>
        <p className={s.successMsg}>Emergency services have been notified. Help is on the way.</p>
      </div>
    );
  }

  return (
    <div className={s.card}>
      <h3 className={s.cardHeader}>
        <AlertCircle style={{ width: '1rem', height: '1rem', color: 'var(--danger)' }} /> Emergency Reporting
      </h3>
      <div className={s.emergencyGrid}>
        {types.map(t => (
          <button
            key={t.id}
            onClick={() => setSelectedType(t.id)}
            className={`${s.emergencyBtn} ${selectedType === t.id ? s.emergencyBtnSelected : ''}`}
          >
            <div className={s.emergencyEmoji}>{t.emoji}</div>
            <p className={s.emergencyLabel}>{t.label}</p>
            <p className={s.emergencyDesc}>{t.desc}</p>
          </button>
        ))}
      </div>
      <button onClick={handleReport} disabled={!selectedType} className={s.reportBtn}>
        🚨 Report Emergency
      </button>
    </div>
  );
}

export default function Citizens() {
  const [filter, setFilter] = useState('all');

  const filteredEvents = filter === 'all'
    ? communityEvents
    : communityEvents.filter(e => e.category === filter);

  const categories = ['all', ...new Set(communityEvents.map(e => e.category))];

  const stats = [
    { label: 'Active Citizens', value: '12.4K', icon: Users, iconColor: 'primary' },
    { label: 'Feedback Today', value: '47', icon: MessageSquare, iconColor: 'accent' },
    { label: 'Open Reports', value: '8', icon: AlertCircle, iconColor: 'danger' },
    { label: 'Events This Month', value: communityEvents.length.toString(), icon: Calendar, iconColor: 'success' },
  ];

  return (
    <div className={s.page}>
      <div>
        <h2 className={s.pageTitle}>Citizen Services</h2>
        <p className={s.pageSubtitle}>Community engagement, feedback & emergency reporting</p>
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

      {/* Main content */}
      <div className={s.mainGrid}>
        {/* Events */}
        <div className={s.card}>
          <h3 className={s.cardHeader}>
            <Calendar style={{ width: '1rem', height: '1rem', color: 'var(--primary)' }} /> Community Events
          </h3>

          <div className={s.filterRow}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`${s.filterBtn} ${filter === cat ? s.filterBtnActive : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className={s.eventsList}>
            {filteredEvents.map(event => {
              const cc = catColorMap[event.category] || { bg: 'transparent', color: 'var(--dark-text)', border: 'var(--dark-border)' };
              return (
                <div key={event.id} className={s.eventCard}>
                  <div className={s.eventRow}>
                    <div>
                      <p className={s.eventTitle}>{event.title}</p>
                      <span
                        className={s.eventBadge}
                        style={{ background: cc.bg, color: cc.color, border: `1px solid ${cc.border}` }}
                      >
                        {event.category}
                      </span>
                    </div>
                    <ChevronRight style={{ width: '1rem', height: '1rem', color: 'var(--dark-text)' }} />
                  </div>
                  <div className={s.eventMeta}>
                    <span className={s.eventMetaItem}><Calendar style={{ width: '0.75rem', height: '0.75rem' }} />{event.date}</span>
                    <span className={s.eventMetaItem}><Clock style={{ width: '0.75rem', height: '0.75rem' }} />{event.time}</span>
                  </div>
                  <div className={s.eventMeta}>
                    <span className={s.eventMetaItem}><MapPin style={{ width: '0.75rem', height: '0.75rem' }} />{event.location}</span>
                    <span className={s.eventMetaItem}><Users style={{ width: '0.75rem', height: '0.75rem' }} />{event.attendees}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <FeedbackForm />
        <EmergencyReport />
      </div>
    </div>
  );
}
