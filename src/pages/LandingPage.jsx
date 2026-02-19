import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bus, Trash2, Zap, Shield, Users, ChevronDown, ChevronUp,
  ArrowRight, Wifi, Brain, Heart, MapPin, TreePine, Clock,
  Smartphone, MonitorSmartphone, Globe, Mail, Sparkles,
  TrendingDown, Recycle, Activity, Home, Menu, X, Sun, Moon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import styles from './LandingPage.module.css';

/* ─── helpers ─── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function CountUp({ end, duration = 2000, suffix = '' }) {
  const [val, setVal] = useState(0);
  const [ref, visible] = useInView(0.3);
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = end / (duration / 16);
    const id = setInterval(() => {
      start += step;
      if (start >= end) { setVal(end); clearInterval(id); }
      else setVal(Math.round(start));
    }, 16);
    return () => clearInterval(id);
  }, [visible, end, duration]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ─── data ─── */
const snapshotCards = [
  { icon: Bus, label: 'Real-time transport insights', stat: 342, suffix: '+', sub: 'Active buses tracked' },
  { icon: Recycle, label: 'Smart waste collection routes', stat: 98, suffix: '%', sub: 'Route efficiency' },
  { icon: Zap, label: 'Energy optimization & sustainability', stat: 40, suffix: '%', sub: 'Emission reduction' },
  { icon: Activity, label: 'Citizen engagement metrics', stat: 12000, suffix: '+', sub: 'Monthly interactions' },
];

const problems = [
  'Traffic congestion costing commuters 54+ hours per year',
  'Overflowing waste bins leading to health hazards',
  'Unoptimized energy grids driving higher emissions',
  'Delayed emergency response due to poor data flow',
];

const solutions = [
  'IoT sensor networks feeding real-time data to dashboards',
  'AI-optimized collection routes cutting waste overflow by 90%',
  'Smart grid balancing renewable sources automatically',
  'Predictive analytics enabling 3× faster incident response',
];

const features = [
  { icon: Bus, title: 'Transport', desc: 'Live bus tracking, route optimization, and predictive delay warnings powered by real-time data.', tag: 'Live data', link: '/dashboard/transport' },
  { icon: Trash2, title: 'Waste Management', desc: 'Smart bin sensors, dynamic route planning, and recycling analytics reduce overflow events.', tag: 'AI-optimized', link: '/dashboard/waste' },
  { icon: Zap, title: 'Energy', desc: 'Solar, wind, and grid balancing dashboards with consumption forecasts and savings insights.', tag: 'Real-time', link: '/dashboard/energy' },
  { icon: Shield, title: 'Public Safety', desc: 'Integrated alert system, hazard mapping, and automated incident escalation workflows.', tag: 'Automated', link: '/dashboard/map' },
  { icon: Users, title: 'Citizen Services', desc: 'Report issues, view local events, access transit schedules, and participate in community polls.', tag: 'Citizen-first', link: '/dashboard/citizens' },
];

const dashboardTabs = [
  { key: 'admin', label: 'Admin', desc: 'Full KPI overview, sensor health monitoring, system-wide analytics, and control panel access.', visual: '📊' },
  { key: 'citizen', label: 'Citizen', desc: 'Personalized transit info, next bus arrival, waste pickup schedules, and issue reporting.', visual: '🏠' },
  { key: 'visitor', label: 'Visitor', desc: 'Interactive city tour planner, attraction finder, real-time transit maps, and event discovery.', visual: '🗺️' },
];

const testimonials = [
  { name: 'Maria Chen', role: 'City Official', quote: 'Decision-making has become 10× faster. Real-time data changed how we govern.', avatar: '👩‍💼' },
  { name: 'James Okafor', role: 'Resident', quote: 'I never miss a bus anymore. The citizen view is genuinely life-changing.', avatar: '👨‍💻' },
  { name: 'Priya Sharma', role: 'Business Owner', quote: 'Cleaner streets and better transit brought 30% more foot traffic to my store.', avatar: '👩‍🍳' },
  { name: 'Luca Bianchi', role: 'Visitor', quote: 'The tour planner helped me explore the city like a local. Incredible experience!', avatar: '🧳' },
];

const benefits = [
  { icon: MapPin, title: 'Walkable Localities', desc: 'Pedestrian-first zones with live crowd data' },
  { icon: TrendingDown, title: 'Reduced Congestion', desc: 'AI-driven traffic signal optimization' },
  { icon: TreePine, title: 'Cleaner Environment', desc: 'Real-time air & noise quality monitoring' },
  { icon: Clock, title: 'Faster Services', desc: 'Automated workflows cut response times' },
  { icon: Wifi, title: 'Full Connectivity', desc: 'City-wide IoT mesh + public Wi-Fi' },
  { icon: Brain, title: 'Predictive Intelligence', desc: 'ML models forecasting demand & incidents' },
];

const faqs = [
  { q: 'How is my data protected?', a: 'All citizen data is encrypted end-to-end and stored in compliance with GDPR and local privacy regulations. We use zero-knowledge architecture wherever possible.' },
  { q: 'Do I need to sign up to use the citizen view?', a: 'No. Basic transit, waste, and energy dashboards are publicly accessible. Signing up unlocks personalized alerts, issue reporting, and community features.' },
  { q: 'What devices are supported?', a: 'The dashboard is fully responsive and works on desktops, tablets, and smartphones. We support all modern browsers including Chrome, Firefox, Safari, and Edge.' },
  { q: 'Can I integrate my own IoT devices?', a: 'Yes. Our open API allows third-party sensor integration. Documentation and SDKs are available in the developer portal.' },
];

/* ─── Component ─── */
export default function LandingPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState('admin');
  const [openFaq, setOpenFaq] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timelineFill, setTimelineFill] = useState(0);
  const timelineRef = useRef(null);

  const handleMouse = useCallback((e) => {
    setMousePos({ x: (e.clientX / window.innerWidth - 0.5) * 20, y: (e.clientY / window.innerHeight - 0.5) * 20 });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, [handleMouse]);

  // Scroll progress bar + navbar bg + timeline fill
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
      setNavScrolled(scrollTop > 60);

      // Timeline fill
      if (timelineRef.current) {
        const rect = timelineRef.current.getBoundingClientRect();
        const windowH = window.innerHeight;
        if (rect.top < windowH && rect.bottom > 0) {
          const progress = Math.min(1, Math.max(0, (windowH - rect.top) / (rect.height + windowH * 0.4)));
          setTimelineFill(progress * 100);
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={styles.page}>
      {/* ═══════ SCROLL PROGRESS BAR ═══════ */}
      <div className={styles.scrollProgress}>
        <div className={styles.scrollFill} style={{ width: `${scrollProgress}%` }} />
      </div>

      {/* ═══════ NAVBAR ═══════ */}
      <nav className={`${styles.navbar} ${navScrolled ? styles.navScrolled : ''}`}>
        <div className={styles.navContainer}>
          <button className={styles.navBrand} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Shield size={20} className={styles.navBrandIcon} />
            <span>SmartCity</span>
          </button>
          <div className={`${styles.navLinks} ${mobileMenuOpen ? styles.navLinksOpen : ''}`}>
            <button onClick={() => scrollTo('snapshot')}>Metrics</button>
            <button onClick={() => scrollTo('features')}>Features</button>
            <button onClick={() => scrollTo('preview')}>Preview</button>
            <button onClick={() => scrollTo('testimonials')}>Testimonials</button>
            <button onClick={() => scrollTo('faq')}>FAQ</button>
            <button className={styles.themeToggle} onClick={toggleTheme} aria-label="Toggle theme">
              <span className={styles.themeIconSpin} key={theme}>
                {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
              </span>
            </button>
            <button className={styles.navCta} onClick={() => navigate('/dashboard')}>
              Open Dashboard <ArrowRight size={14} />
            </button>
          </div>
          <button className={styles.navHamburger} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* ═══════ HERO ═══════ */}
      <section className={styles.hero}>
        {/* animated grid bg */}
        <div className={styles.heroBg} style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}>
          <div className={styles.gridOverlay} />
          {/* floating particles */}
          {Array.from({ length: 30 }).map((_, i) => (
            <span key={i} className={styles.particle} style={{
              left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`, animationDuration: `${4 + Math.random() * 6}s`,
            }} />
          ))}
        </div>

        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <Sparkles size={14} /> Next-Gen Urban Platform
          </div>
          <h1 className={styles.heroTitle}>
            Experience the Future of Urban Life –<br />
            <span className={styles.heroGreen}>Smart, Connected, Sustainable.</span>
          </h1>
          <p className={styles.heroSub}>
            Data-driven transport, intelligent waste management, and optimized energy —
            all in one real-time dashboard built for citizens, officials, and visitors.
          </p>
          <div className={styles.heroCtas}>
            <button className={styles.ctaPrimary} onClick={() => navigate('/dashboard')}>
              Open Dashboard <ArrowRight size={18} />
            </button>
            <button className={styles.ctaSecondary} onClick={() => scrollTo('features')}>
              How It Works <ChevronDown size={18} />
            </button>
          </div>
          <div className={styles.trustCues}>
            <span><Wifi size={14} /> IoT-enabled</span>
            <span className={styles.dot} />
            <span><Brain size={14} /> AI-powered</span>
            <span className={styles.dot} />
            <span><Heart size={14} /> Citizen-first</span>
          </div>
        </div>

        {/* isometric city illustration placeholder */}
        <div className={styles.heroVisual} style={{ transform: `translate(${-mousePos.x * 0.5}px, ${-mousePos.y * 0.5}px)` }}>
          <div className={styles.cityscape}>
            {/* stylised buildings */}
            {[120, 180, 90, 150, 200, 110, 160, 80, 140, 190].map((h, i) => (
              <div key={i} className={styles.building} style={{ height: h, animationDelay: `${i * 0.15}s` }}>
                {Array.from({ length: Math.floor(h / 25) }).map((_, j) => (
                  <div key={j} className={styles.window} style={{ animationDelay: `${(i + j) * 0.3}s` }} />
                ))}
              </div>
            ))}
            <div className={styles.groundLine} />
          </div>
        </div>
      </section>

      {/* ═══════ SNAPSHOT STRIP ═══════ */}
      <section id="snapshot" className={styles.snapshot}>
        <div className={styles.container}>
          <div className={styles.snapGrid}>
            {snapshotCards.map((c, i) => {
              const [ref, vis] = useInView(0.2);
              return (
                <div key={i} ref={ref} className={`${styles.snapCard} ${vis ? styles.visible : ''}`} style={{ transitionDelay: `${i * 120}ms` }}>
                  <c.icon className={styles.snapIcon} size={28} />
                  <div className={styles.snapStat}>
                    {vis ? <CountUp end={c.stat} suffix={c.suffix} /> : <>0{c.suffix}</>}
                  </div>
                  <div className={styles.snapLabel}>{c.label}</div>
                  <div className={styles.snapSub}>{c.sub}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ PROBLEM → SOLUTION ═══════ */}
      <section className={styles.problemSolution}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            From <span className={styles.red}>Urban Chaos</span> to <span className={styles.green}>Smart Order</span>
          </h2>
          <div className={styles.psGrid}>
            <div className={styles.psCol}>
              <h3 className={styles.psHeading}>🚨 The Problem</h3>
              <ul className={styles.psList}>
                {problems.map((p, i) => {
                  const [ref, vis] = useInView(0.2);
                  return <li key={i} ref={ref} className={`${styles.psItem} ${styles.problemItem} ${vis ? styles.visible : ''}`} style={{ transitionDelay: `${i * 100}ms` }}>{p}</li>;
                })}
              </ul>
            </div>
            <div className={styles.psDivider} ref={timelineRef}>
              <div className={styles.psTimeline}>
                <div className={styles.psTimelineFill} style={{ height: `${timelineFill}%` }} />
              </div>
              <div className={styles.psArrow}><ArrowRight size={28} /></div>
            </div>
            <div className={styles.psCol}>
              <h3 className={styles.psHeading}>✅ The Solution</h3>
              <ul className={styles.psList}>
                {solutions.map((s, i) => {
                  const [ref, vis] = useInView(0.2);
                  return <li key={i} ref={ref} className={`${styles.psItem} ${styles.solutionItem} ${vis ? styles.visible : ''}`} style={{ transitionDelay: `${i * 100}ms` }}>{s}</li>;
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ FEATURES ═══════ */}
      <section id="features" className={styles.features}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Platform Modules</h2>
          <p className={styles.sectionSub}>Five integrated systems powering your smart city experience.</p>
          <div className={styles.featureGrid}>
            {features.map((f, i) => {
              const [ref, vis] = useInView(0.15);
              return (
                <div key={i} ref={ref} className={`${styles.featureCard} ${vis ? styles.visible : ''}`} style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className={styles.featureIcon}><f.icon size={28} /></div>
                  <span className={styles.featureTag}>{f.tag}</span>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                  <button className={styles.microCta} onClick={() => navigate(f.link)}>
                    View in Dashboard <ArrowRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ DASHBOARD PREVIEW ═══════ */}
      <section id="preview" className={styles.preview}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Dashboard Preview</h2>
          <p className={styles.sectionSub}>Explore the experience for every user role.</p>

          <div className={styles.tabBar}>
            {dashboardTabs.map(t => (
              <button key={t.key} className={`${styles.tab} ${activeTab === t.key ? styles.activeTab : ''}`} onClick={() => setActiveTab(t.key)}>
                {t.label}
              </button>
            ))}
          </div>

          {dashboardTabs.filter(t => t.key === activeTab).map(t => (
            <div key={t.key} className={styles.previewPane}>
              <div className={styles.previewVisual}>
                <div className={styles.mockScreen}>
                  <div className={styles.mockHeader}>
                    <div className={styles.mockDots}><span /><span /><span /></div>
                    <span className={styles.mockUrl}>smartcity.gov/dashboard/{t.key}</span>
                  </div>
                  <div className={styles.mockBody}>
                    <span className={styles.mockEmoji}>{t.visual}</span>
                    <span className={styles.mockRole}>{t.label} View</span>
                    {t.key === 'admin' && (
                      <div className={styles.mockKpis}>
                        <div className={styles.mockKpi}><span>Traffic</span><strong>72%</strong></div>
                        <div className={styles.mockKpi}><span>Energy</span><strong>4.8 GW</strong></div>
                        <div className={styles.mockKpi}><span>Waste</span><strong>847 T</strong></div>
                        <div className={styles.mockKpi}><span>AQI</span><strong>Good</strong></div>
                      </div>
                    )}
                    {t.key === 'citizen' && (
                      <div className={styles.mockCitizen}>
                        <div className={styles.mockBus}><Bus size={16} /> Next bus in <strong>3 min</strong></div>
                        <div className={styles.mockBus}><Trash2 size={16} /> Pickup <strong>Tomorrow 7 AM</strong></div>
                      </div>
                    )}
                    {t.key === 'visitor' && (
                      <div className={styles.mockVisitor}>
                        <div className={styles.mockBus}><MapPin size={16} /> Top attraction: <strong>Central Park</strong></div>
                        <div className={styles.mockBus}><Globe size={16} /> Event: <strong>Tech Festival</strong></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.previewText}>
                <h3>{t.label} Dashboard</h3>
                <p>{t.desc}</p>
                <button className={styles.ctaPrimary} onClick={() => navigate('/dashboard')}>
                  Go to Dashboard <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ TESTIMONIALS ═══════ */}
      <section id="testimonials" className={styles.testimonials}>
        <div className={styles.container}>
          <span className={styles.sectionBadge}><Heart size={14} /> Testimonials</span>
          <h2 className={styles.sectionTitle}>What People Are Saying</h2>
          <p className={styles.sectionSub}>Real feedback from the citizens, officials, and visitors using the platform every day.</p>
          <div className={styles.testiGrid}>
            {testimonials.map((t, i) => {
              const [ref, vis] = useInView(0.15);
              return (
                <div key={i} ref={ref} className={`${styles.testiCard} ${vis ? styles.visible : ''}`} style={{ transitionDelay: `${i * 120}ms` }}>
                  <div className={styles.testiQuoteMark}>&ldquo;</div>
                  <p className={styles.testiQuote}>{t.quote}</p>
                  <div className={styles.testiDivider} />
                  <div className={styles.testiAuthor}>
                    <div className={styles.testiAvatar}>{t.avatar}</div>
                    <div>
                      <div className={styles.testiName}>{t.name}</div>
                      <div className={styles.testiRole}>{t.role}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ BENEFITS GRID ═══════ */}
      <section className={styles.benefitsSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Why This City Is Smarter</h2>
          <div className={styles.benefitsGrid}>
            {benefits.map((b, i) => {
              const [ref, vis] = useInView(0.15);
              return (
                <div key={i} ref={ref} className={`${styles.benefitCard} ${vis ? styles.visible : ''}`} style={{ transitionDelay: `${i * 100}ms` }}>
                  <b.icon size={24} className={styles.benefitIcon} />
                  <h4>{b.title}</h4>
                  <p>{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ FAQ ═══════ */}
      <section id="faq" className={styles.faqSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            {faqs.map((f, i) => (
              <div key={i} className={`${styles.faqItem} ${openFaq === i ? styles.faqOpen : ''}`}>
                <button className={styles.faqQ} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{f.q}</span>
                  {openFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                <div className={styles.faqA} style={{ maxHeight: openFaq === i ? 200 : 0 }}>
                  <p>{f.a}</p>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.faqContact}>
            <Mail size={18} />
            <span>Have more questions? <a href="mailto:support@smartcity.gov">Contact the smart city team</a></span>
          </div>
        </div>
      </section>

      {/* ═══════ FINAL CTA ═══════ */}
      <section className={styles.finalCta}>
        <div className={styles.container}>
          <h2>Ready to explore the Smart City dashboard?</h2>
          <button className={styles.ctaBig} onClick={() => navigate('/dashboard')}>
            Open Dashboard <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerTop}>
            <div className={styles.footerBrand}>
              <h3><Globe size={20} className={styles.footerBrandIcon} /> SmartCity</h3>
              <p>Open-source urban intelligence platform built with real-time data, modern web technologies, and community-first design.</p>
              <div className={styles.footerSocials}>
                <a href="#" aria-label="GitHub"><Smartphone size={16} /></a>
                <a href="#" aria-label="Community"><Users size={16} /></a>
                <a href="mailto:support@smartcity.gov" aria-label="Email"><Mail size={16} /></a>
              </div>
            </div>
            <div className={styles.footerColumns}>
              <div className={styles.footerCol}>
                <h4>Platform</h4>
                <button onClick={() => scrollTo('features')}>Features</button>
                <button onClick={() => scrollTo('preview')}>Preview</button>
                <button onClick={() => navigate('/dashboard')}>Dashboard</button>
              </div>
              <div className={styles.footerCol}>
                <h4>Resources</h4>
                <button onClick={() => scrollTo('faq')}>FAQ</button>
                <a href="mailto:support@smartcity.gov">Support</a>
                <button onClick={() => scrollTo('testimonials')}>Community</button>
              </div>
              <div className={styles.footerCol}>
                <h4>Legal</h4>
                <button onClick={() => scrollTo('faq')}>Privacy Policy</button>
                <button onClick={() => scrollTo('faq')}>Terms of Service</button>
                <button onClick={() => scrollTo('faq')}>Data Policy</button>
              </div>
            </div>
          </div>
          <div className={styles.footerDivider} />
          <div className={styles.footerBottom}>
            <span>&copy; 2026 Smart City Platform</span>
            <span className={styles.footerMade}>Made with <Heart size={12} className={styles.footerHeart} /> for smarter cities</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
