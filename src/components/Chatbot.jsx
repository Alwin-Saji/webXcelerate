import { useState } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import s from './Chatbot.module.css';

const suggestions = [
  'Show busiest routes',
  'Air quality status',
  'Energy usage today',
  'Waste bin alerts',
  'Traffic congestion',
];

const botResponses = {
  'show busiest routes': 'The busiest routes today are:\n• R5 University Route (5,100 riders)\n• R1 Downtown Express (4,200 riders)\n• R3 Suburban Loop (3,500 riders)',
  'air quality status': 'Air Quality:\n• Central Park area: AQI 42 (Good)\n• City Hall area: AQI 78 (Moderate)\n\nOverall city average: AQI 55 — Moderate',
  'energy usage today': 'Current energy load: 3,840 MW of 5,200 MW capacity (73.8%)\n\nRenewable mix: 42%\n• Solar: 28%\n• Wind: 14%\n\nPeak hour today: 14:00',
  'waste bin alerts': '⚠️ 2 bins need immediate attention:\n• Bin #6 Riverside: 95% full (8h since collection)\n• Bin #3 Main Street: 92% full (6h since collection)',
  'traffic congestion': 'Current density: 72%\n\nHot spots:\n• I-495 Eastbound: Heavy (12 mph avg)\n• Broadway & 5th: Moderate\n• Downtown: Light',
};

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hello! I\'m your Smart City assistant. Ask me about routes, air quality, energy, waste, or traffic.' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (text) => {
    const query = (text || input).trim();
    if (!query) return;
    
    setMessages(prev => [...prev, { from: 'user', text: query }]);
    setInput('');

    setTimeout(() => {
      const key = query.toLowerCase();
      const match = Object.keys(botResponses).find(k => key.includes(k) || k.includes(key));
      const response = match
        ? botResponses[match]
        : "I can help with: busiest routes, air quality, energy usage, waste alerts, and traffic congestion. Try asking about one of those!";
      setMessages(prev => [...prev, { from: 'bot', text: response }]);
    }, 600);
  };

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(!open)}
        className={`${s.fab} ${open ? s.fabOpen : s.fabClosed}`}
      >
        {open
          ? <X style={{ width: '1.5rem', height: '1.5rem', color: 'var(--dark-heading)' }} />
          : <MessageCircle style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
        }
      </button>

      {/* Chat Window */}
      {open && (
        <div className={s.chatWindow}>
          {/* Header */}
          <div className={s.chatHeader}>
            <Bot style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
            <div>
              <p className={s.chatHeaderTitle}>City Assistant</p>
              <p className={s.chatHeaderSub}>Always online</p>
            </div>
          </div>

          {/* Messages */}
          <div className={s.messages}>
            {messages.map((msg, i) => (
              <div key={i} className={`${s.msgRow} ${msg.from === 'user' ? s.msgRowUser : s.msgRowBot}`}>
                <div className={`${s.msgBubble} ${msg.from === 'user' ? s.msgBubbleUser : s.msgBubbleBot}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick suggestions */}
          <div className={s.suggestions}>
            {suggestions.map(sg => (
              <button key={sg} onClick={() => handleSend(sg)} className={s.suggestionBtn}>
                {sg}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className={s.inputArea}>
            <div className={s.inputRow}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about city systems…"
                className={s.chatInput}
              />
              <button onClick={() => handleSend()} className={s.sendBtn}>
                <Send style={{ width: '1rem', height: '1rem' }} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
