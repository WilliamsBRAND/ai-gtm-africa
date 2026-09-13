import React, { useEffect, useState, useRef } from 'react';
import {
  Clock,
  MapPin,
  Calendar,
  Users,
  Mic,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Shield,
  Layers,
  TrendingUp,
  Target,
  Share2,
  X,
  Menu
} from 'lucide-react';

const schedule = [
  {
    time: '9:00 AM',
    duration: '5 min',
    type: 'WELCOME',
    title: 'Opening and Welcome',
    description: 'Welcome address, setting the context for AI GTM Africa Kigali and an introduction to the morning’s flow.',
    points: ['Welcome remarks and event objectives', 'Setting the stage for practical AI & GTM adoption', 'Overview of the morning agenda']
  },
  {
    time: '9:05 AM',
    duration: '20 min',
    type: 'KEYNOTE 1',
    title: 'Building a Go to Market Engine',
    description: 'A practical session on building the system that takes a product or service from market understanding to customer acquisition and sustainable growth.',
    points: [
      'Understanding the market and identifying the right customers',
      'Developing positioning, messaging and value propositions',
      'Building demand and reaching potential customers',
      'Connecting marketing, sales and customer acquisition',
      'Turning acquisition into activation, retention and growth',
      'Identifying bottlenecks and deciding what to improve next'
    ]
  },
  {
    time: '9:25 AM',
    duration: '20 min',
    type: 'KEYNOTE 2',
    title: 'Using AI to Build Grow and Scale a Business',
    description: 'A practical exploration of where AI can create meaningful business value and how teams can move beyond isolated tools toward useful applications across the business.',
    points: [
      'Customer, market and competitive research',
      'Marketing, content and customer acquisition',
      'Sales prospecting, qualification and follow-up',
      'Business analysis and decision-making',
      'Automation of repetitive operational workflows',
      'AI-enabled products, internal tools and systems',
      'Choosing what to automate and where human judgment remains essential'
    ]
  },
  {
    time: '9:45 AM',
    duration: '20 min',
    type: 'KEYNOTE 3',
    title: 'What Makes an AI Powered Product Powerful',
    description: 'A focused session on the qualities that make an AI-powered product useful, credible and valuable to the people and businesses it serves.',
    points: [
      'Solving a clear and meaningful user problem',
      'Using AI where it creates genuine product value',
      'Designing for trust, usability and responsible adoption',
      'Combining automation with appropriate human oversight',
      'Learning from user feedback and improving the product over time'
    ]
  },
  {
    time: '10:05 AM',
    duration: '25 min',
    type: 'FOUNDER PANEL',
    title: 'How Founders Are Seeing and Leveraging AI in Their Businesses',
    description: 'A candid conversation with founders about current AI adoption, practical experiments, lessons and challenges rather than predictions about AI.',
    points: [
      'Where founders are using AI in their businesses today',
      'How AI is changing product development, marketing, sales, customer service and operations',
      'What founders have automated and what they deliberately keep human',
      'Experiments that have worked, failed or produced unexpected results',
      'Challenges involved in introducing AI into existing teams and workflows',
      'How founders judge whether an AI use case creates real business value',
      'Opportunities for African businesses to leverage AI more effectively'
    ]
  },
  {
    time: '10:30 AM',
    duration: '15 min',
    type: 'INTERACTIVE Q&A',
    title: 'Open Question and Answer Session',
    description: 'Participants will have direct access to the speakers and panelists to raise practical questions about go-to-market strategy, customer acquisition, marketing, sales, AI implementation, operations and business growth.',
    points: [
      'Direct troubleshooting of real business hurdles',
      'GTM and marketing teardowns from stage practitioners',
      'Actionable advice for immediate implementation'
    ]
  },
  {
    time: '10:45 AM',
    duration: '15 min',
    type: 'NETWORKING',
    title: 'Closing Group Photograph and Networking',
    description: 'The event will conclude with key takeaways, closing remarks, a group photograph and structured networking among participants, speakers and founders.',
    points: [
      'Official AI GTM Africa Kigali group photograph',
      'High-level peer connection and collaboration exchange',
      'Next steps and community continuity'
    ]
  }
];

const objectives = [
  {
    num: '01',
    title: 'GTM Engine Mastery',
    desc: 'Build participants’ understanding of how product, positioning, marketing, sales, customer acquisition and growth connect within a unified go-to-market engine.'
  },
  {
    num: '02',
    title: 'Practical AI Leverage',
    desc: 'Explore practical ways AI can improve market research, customer reach, execution, decision-making and business operations.'
  },
  {
    num: '03',
    title: 'Direct Founder Insights',
    desc: 'Give founders and business leaders direct insight into how other founders are actively adopting, testing, and applying AI in their businesses.'
  },
  {
    num: '04',
    title: 'Live Growth Problem-Solving',
    desc: 'Create open space for participants to ask practical questions and work through their own GTM, growth and AI challenges.'
  },
  {
    num: '05',
    title: 'High-Calibre Kigali Network',
    desc: 'Facilitate meaningful connections among founders, business leaders, marketers and operators in Kigali.'
  }
];

const audienceProfiles = [
  'Founders, Co-Founders & Business Owners',
  'Marketing, Growth & Commercial Leaders',
  'Product & Business Development Leaders',
  'Startup Teams & Operational Leaders',
  'Consultants & B2B Service Businesses',
  'Entrepreneurs & Builders Implementing AI'
];

const takeaways = [
  'A clearer understanding of how to build and improve a repeatable go-to-market engine.',
  'Practical ideas for applying AI to real business problems and operational workflows.',
  'First-hand examples of how founders are already leveraging AI across African markets.',
  'A stronger understanding of what to improve, automate or test next in your company.',
  'Useful perspectives on customer acquisition, marketing, sales, operations and growth.',
  'New relationships with founders, business leaders, marketers and operators in Kigali.'
];

const eventPlanItems = [
  { area: 'Programme', detail: 'Three keynote speakers, one moderated founder panel, an open Q&A session, closing remarks, group photograph and networking.' },
  { area: 'Speakers', detail: 'Three speakers with complementary expertise in go-to-market, practical AI adoption and AI-powered product development.' },
  { area: 'Panel', detail: 'Curated founders sharing direct examples, real experiments, lessons learned, and implementation hurdles.' },
  { area: 'Audience', detail: 'Curated room of 20 to 30 founders, business leaders, marketers, commercial teams and operators in Kigali.' },
  { area: 'Venue', detail: 'U.S. Embassy Kigali — with seating, stage area, projection, microphones and dedicated networking space.' },
  { area: 'Registration', detail: 'Attendance confirmed in advance; guest check-in completed prior to the prompt 9:00 AM start.' },
  { area: 'Event Delivery', detail: 'Strict timekeeping ensuring all sessions, questions, and networking conclude seamlessly by 11:00 AM.' }
];

const WHAT_YOU_DO = [
  'Founder',
  'Business Owner',
  'Executive',
  'Professional',
  'Consultant',
  'Investor',
  'Creator',
  'Student',
  'Researcher',
  'Community Builder',
  'Other'
];

const BUSINESS_TYPES = [
  'Technology',
  'Finance',
  'Banking',
  'Healthcare',
  'Education',
  'Agriculture',
  'Energy',
  'Professional Services',
  'Consulting',
  'Media & Entertainment',
  'Retail & Consumer',
  'Real Estate',
  'Manufacturing',
  'Logistics',
  'Government & Public Sector',
  'Nonprofit',
  'Other'
];

const HEAR_OPTIONS = [
  'Tomide',
  'Referral',
  'Friend or Colleague',
  'LinkedIn',
  'WhatsApp',
  'Event',
  'Social Media',
  'Other'
];

function KigaliRegistrationModal({ isOpen, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [btype, setBtype] = useState('');
  const [sponsor, setSponsor] = useState('');
  const [heard, setHeard] = useState('');
  const [done, setDone] = useState(false);
  const [err, setErr] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const firstRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    setName('');
    setEmail('');
    setPhone('');
    setRole('');
    setBtype('');
    setSponsor('');
    setHeard('');
    setDone(false);
    setErr('');
    setSubmitting(false);

    const t = setTimeout(() => firstRef.current?.focus(), 60);
    const onKey = (ev) => {
      if (ev.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
      clearTimeout(t);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const submit = async (ev) => {
    ev.preventDefault();
    setErr('');
    if (!name.trim() || !email.trim() || !phone.trim() || !role || !btype || !heard || !sponsor) {
      setErr('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          city: 'KIGALI',
          role,
          industry: btype,
          heard,
          sponsor
        })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Registration could not be submitted.');
      }
      setDone(true);
    } catch (error) {
      setErr(error.message || 'Registration could not be submitted. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const field = (label, req, children) => (
    <label className="form-field">
      <span className="form-label">
        {label}
        {req && <em> *</em>}
      </span>
      {children}
    </label>
  );

  return (
    <div
      className="form-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="AI GTM Africa Kigali Registration"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="form-panel">
        <button type="button" className="form-close" aria-label="Close application form" onClick={onClose}>
          <X />
        </button>
        {done ? (
          <div className="form-done">
            <p className="kicker">AI GTM AFRICA · KIGALI</p>
            <h3>REGISTRATION RECEIVED</h3>
            <p className="form-done-text">Thank you for registering for AI GTM Africa Kigali.</p>
            <p className="form-done-date">Kigali · 08 October 2026 · U.S. Embassy Kigali</p>
            <p className="form-done-note">
              Due to the fact that we are taking only 20 to 30 people for this focused session, our team will review the applications and reach out to let you know if you make the attendee list.
            </p>
            <p className="form-done-note">
              <strong>We will send you a confirmation email with venue check-in requirements and session materials.</strong>
            </p>
            <p className="form-signoff">AI GTM AFRICA</p>
            <button type="button" className="cta form-back" onClick={onClose}>
              Back to Kigali Page <span aria-hidden="true" className="cta-arrow" />
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <p className="kicker">AI GTM AFRICA · 08 OCTOBER 2026</p>
            <h3>APPLY FOR KIGALI</h3>
            <div className="form-preset">
              You are applying for the <b>Kigali</b> session · <b>08 October 2026</b> (9:00 AM – 11:00 AM) at the <b>U.S. Embassy Kigali</b>.
            </div>
            {field('Full Name', true, (
              <input
                ref={firstRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                placeholder="Your full name"
                required
              />
            ))}
            {field('Email Address', true, (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                inputMode="email"
                placeholder="you@company.com"
                required
              />
            ))}
            {field('Phone Number (WhatsApp preferred)', true, (
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                inputMode="tel"
                placeholder="+250 ..."
                required
              />
            ))}
            {field('What Do You Do?', true, (
              <select value={role} onChange={(e) => setRole(e.target.value)} required>
                <option value="" disabled>Select your role</option>
                {WHAT_YOU_DO.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            ))}
            {field('Business / Industry', true, (
              <select value={btype} onChange={(e) => setBtype(e.target.value)} required>
                <option value="" disabled>Select your industry</option>
                {BUSINESS_TYPES.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            ))}
            {field('How Did You Hear About Us?', true, (
              <select value={heard} onChange={(e) => setHeard(e.target.value)} required>
                <option value="" disabled>Select an option</option>
                {HEAR_OPTIONS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            ))}
            <div className="form-field">
              <span className="form-label">
                Would You Like to Sponsor AI GTM Africa Kigali?<em> *</em>
              </span>
              <div className="form-choice">
                {['Yes', 'No'].map((v) => (
                  <label key={v} className={sponsor === v ? 'chosen' : ''}>
                    <input
                      type="radio"
                      name="sponsor"
                      value={v}
                      checked={sponsor === v}
                      onChange={() => setSponsor(v)}
                    />
                    {v}
                  </label>
                ))}
              </div>
            </div>
            {err && <p className="form-error">{err}</p>}
            <button type="submit" className="cta" disabled={submitting}>
              {submitting ? 'Submitting Application...' : 'Submit Application for Kigali'}{' '}
              <span aria-hidden="true" className="cta-arrow" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function KigaliPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [expandedSchedule, setExpandedSchedule] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

    return () => {
      window.removeEventListener('scroll', onScroll);
      io.disconnect();
    };
  }, []);

  const toggleSchedule = (idx) => {
    setExpandedSchedule(expandedSchedule === idx ? null : idx);
  };

  const WHATSAPP_URL = `https://wa.me/2349025631654?text=${encodeURIComponent(
    "Hi Williams, I'd like to partner with you for AI GTM Africa Kigali."
  )}`;

  return (
    <div className="kigali-page dark">
      {/* Navigation */}
      <header className={`kigali-nav nav${scrolled ? ' scrolled' : ''}`}>
        <a href="/" className="brand">
          AI GTM <b>AFRICA</b> <span className="city-pill">KIGALI</span>
        </a>
        <nav className={navOpen ? 'open' : ''} aria-label="Kigali event navigation">
          <a href="#overview" onClick={() => setNavOpen(false)}>Overview</a>
          <a href="#objectives" onClick={() => setNavOpen(false)}>Objectives</a>
          <a href="#programme" onClick={() => setNavOpen(false)}>Programme</a>
          <a href="#keynotes" onClick={() => setNavOpen(false)}>Sessions</a>
          <a href="#venue" onClick={() => setNavOpen(false)}>Venue</a>
          <a href="/" onClick={() => setNavOpen(false)} className="nav-subtle">All Cities</a>
          <button type="button" className="cta" onClick={() => { setNavOpen(false); setModalOpen(true); }}>
            Apply for Seat <span aria-hidden="true" className="cta-arrow" />
          </button>
        </nav>
        <button
          className="menu"
          aria-expanded={navOpen}
          aria-label={navOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setNavOpen(!navOpen)}
        >
          {navOpen ? <X /> : <Menu />}
        </button>
      </header>

      <main>
        {/* Hero Section */}
        <section className="kigali-hero dark">
          <div className="kigali-hero-bg">
            <img src="/images/cities/kigali.jpg" alt="Kigali Rwanda Skyline" />
            <div className="kigali-hero-overlay" />
          </div>

          <div className="kigali-hero-content">
            <div className="kigali-badge-row reveal">
              <span className="event-kicker-tag">CONCEPT NOTE &amp; EVENT GUIDE</span>
              <span className="event-kicker-city">08 OCTOBER 2026 · KIGALI, RWANDA</span>
            </div>

            <h1 className="reveal" style={{ transitionDelay: '80ms' }}>
              AI. GO-TO-MARKET.<br />GROWTH.
            </h1>

            <p className="kigali-hero-lead reveal" style={{ transitionDelay: '140ms' }}>
              A focused two-hour executive business event for founders, business leaders, marketers and operators. Hosted at the <strong>U.S. Embassy Kigali</strong>.
            </p>

            <div className="kigali-meta-ribbon reveal" style={{ transitionDelay: '200ms' }}>
              <div className="meta-card">
                <Calendar size={18} className="meta-icon" />
                <div>
                  <label>DATE</label>
                  <strong>08 October 2026</strong>
                </div>
              </div>

              <div className="meta-card">
                <Clock size={18} className="meta-icon" />
                <div>
                  <label>TIME</label>
                  <strong>9:00 AM – 11:00 AM (CAT)</strong>
                </div>
              </div>

              <div className="meta-card">
                <MapPin size={18} className="meta-icon" />
                <div>
                  <label>VENUE</label>
                  <strong>U.S. Embassy Kigali</strong>
                </div>
              </div>

              <div className="meta-card">
                <Users size={18} className="meta-icon" />
                <div>
                  <label>CAPACITY</label>
                  <strong>20 – 30 Selected Attendees</strong>
                </div>
              </div>
            </div>

            <div className="kigali-hero-cta reveal" style={{ transitionDelay: '260ms' }}>
              <button type="button" className="cta" onClick={() => setModalOpen(true)}>
                Apply to Attend in Kigali <span aria-hidden="true" className="cta-arrow" />
              </button>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="cta cta-dark">
                Become a Partner <span aria-hidden="true" className="cta-arrow" />
              </a>
            </div>
          </div>
        </section>

        {/* Format Numbers Strip */}
        <section className="kigali-stats-strip dark">
          <div className="stats-grid reveal">
            <div className="stat-box">
              <span className="stat-val">3</span>
              <span className="stat-lbl">Keynote Speakers</span>
            </div>
            <div className="stat-box">
              <span className="stat-val">1</span>
              <span className="stat-lbl">Founder Panel</span>
            </div>
            <div className="stat-box">
              <span className="stat-val">1</span>
              <span className="stat-lbl">Open Q&amp;A Session</span>
            </div>
            <div className="stat-box">
              <span className="stat-val">2 HRS</span>
              <span className="stat-lbl">Total Focused Duration</span>
            </div>
          </div>
        </section>

        {/* Event Overview Section */}
        <section id="overview" className="kigali-overview light section">
          <div className="kigali-section-header reveal">
            <p className="kicker">EVENT OVERVIEW</p>
            <h2>PRACTICAL AI ADOPTION &amp;<br />STRONGER GTM EXECUTION.</h2>
          </div>

          <div className="overview-layout">
            <div className="overview-text reveal">
              <p className="lead-paragraph">
                <strong>AI GTM Africa Kigali</strong> is a focused business event bringing together founders, business leaders, marketers and operators to explore how businesses can build stronger go-to-market systems and use artificial intelligence to build, grow and scale.
              </p>
              <p>
                The event is designed around practical application. Through three keynote sessions, a founder panel and an open question and answer session, participants will examine how businesses move from product to market, build repeatable systems for reaching and winning customers, and apply AI across research, marketing, sales, operations and decision-making.
              </p>
              <div className="overview-quote">
                <blockquote>
                  “The goal is not simply to talk about AI, but to understand where it creates actual commercial leverage and how we can apply it to build better businesses across Africa.”
                </blockquote>
                <cite>— Tomide Williams, Convener, AI GTM Africa</cite>
              </div>
            </div>

            <div className="overview-visual reveal">
              {/* Kigali Event Photo Showcase / Image Placeholder */}
              <div className="image-frame">
                <img src="/images/hall.jpg" alt="Conference hall session" />
                <div className="image-caption">
                  <span>AI GTM AFRICA · KIGALI 2026</span>
                  <label>U.S. EMBASSY KIGALI</label>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Event Objectives */}
        <section id="objectives" className="kigali-objectives dark section">
          <div className="kigali-section-header reveal">
            <p className="kicker">WHAT WE ARE SOLVING</p>
            <h2>EVENT OBJECTIVES</h2>
          </div>

          <div className="objectives-grid">
            {objectives.map((obj, i) => (
              <div
                key={obj.num}
                className="objective-card reveal"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="objective-num">{obj.num}</div>
                <h3>{obj.title}</h3>
                <p>{obj.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Who Should Attend */}
        <section className="kigali-audience light section">
          <div className="kigali-section-header reveal">
            <p className="kicker">CURATED ATTENDANCE</p>
            <h2>WHO SHOULD ATTEND</h2>
          </div>

          <div className="audience-layout">
            <div className="audience-list">
              {audienceProfiles.map((item, idx) => (
                <div
                  key={item}
                  className="audience-item reveal"
                  style={{ transitionDelay: `${idx * 60}ms` }}
                >
                  <span className="audience-index">0{idx + 1}</span>
                  <p>{item}</p>
                </div>
              ))}
            </div>

            <div className="audience-sidebar reveal">
              <div className="audience-notice-box">
                <Shield size={28} className="notice-icon" />
                <h3>INTIMATE &amp; HIGH SIGNAL</h3>
                <p>
                  To ensure deep discussion, real problem-solving, and high-value networking, attendance in Kigali is strictly limited to <strong>20 to 30 selected participants</strong>.
                </p>
                <button type="button" className="cta cta-dark" onClick={() => setModalOpen(true)}>
                  Reserve Your Seat <span aria-hidden="true" className="cta-arrow" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Programme Timetable */}
        <section id="programme" className="kigali-programme dark section">
          <div className="kigali-section-header reveal">
            <p className="kicker">TIMETABLE &amp; STRUCTURE</p>
            <h2>PROGRAMME SCHEDULE</h2>
            <p className="section-subtext">9:00 AM to 11:00 AM · Fast-paced, high-density agenda</p>
          </div>

          <div className="schedule-timeline">
            {schedule.map((item, idx) => {
              const isExpanded = expandedSchedule === idx;
              return (
                <div
                  key={item.time + item.title}
                  className={`schedule-row reveal ${isExpanded ? 'expanded' : ''}`}
                  onClick={() => toggleSchedule(idx)}
                >
                  <div className="schedule-time">
                    <span className="clock-time">{item.time}</span>
                    <span className="duration-pill">{item.duration}</span>
                  </div>

                  <div className="schedule-body">
                    <div className="schedule-tag">{item.type}</div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>

                    {item.points && (
                      <div className={`schedule-bullets ${isExpanded ? 'show' : ''}`}>
                        <ul>
                          {item.points.map((pt, pIdx) => (
                            <li key={pIdx}>{pt}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="schedule-action">
                    <button type="button" className="expand-btn" aria-label="Toggle details">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Session Focus / Keynote Deep-Dives */}
        <section id="keynotes" className="kigali-keynotes light section">
          <div className="kigali-section-header reveal">
            <p className="kicker">DEEP-DIVE SESSIONS</p>
            <h2>SESSION FOCUS AREAS</h2>
          </div>

          <div className="keynotes-grid">
            <article className="keynote-card reveal">
              <div className="card-kicker">KEYNOTE 01 · 9:05 AM</div>
              <h3>Building a Go to Market Engine</h3>
              <p className="card-lead">
                A practical session on building the system that takes a product or service from market understanding to customer acquisition and sustainable growth.
              </p>
              <ul className="keynote-point-list">
                <li>Understanding the market and identifying the right customers</li>
                <li>Developing positioning, messaging and value propositions</li>
                <li>Building demand and reaching potential customers</li>
                <li>Connecting marketing, sales and customer acquisition</li>
                <li>Turning acquisition into activation, retention and growth</li>
                <li>Identifying bottlenecks and deciding what to improve next</li>
              </ul>
            </article>

            <article className="keynote-card reveal" style={{ transitionDelay: '100ms' }}>
              <div className="card-kicker">KEYNOTE 02 · 9:25 AM</div>
              <h3>Using AI to Build Grow and Scale a Business</h3>
              <p className="card-lead">
                A practical exploration of where AI can create meaningful business value and how teams move beyond isolated tools toward useful applications across the business.
              </p>
              <ul className="keynote-point-list">
                <li>Customer, market and competitive research</li>
                <li>Marketing, content and customer acquisition</li>
                <li>Sales prospecting, qualification and follow-up</li>
                <li>Business analysis and decision-making</li>
                <li>Automation of repetitive operational workflows</li>
                <li>AI-enabled products, internal tools and systems</li>
                <li>Choosing what to automate vs. where human judgment remains essential</li>
              </ul>
            </article>

            <article className="keynote-card reveal" style={{ transitionDelay: '150ms' }}>
              <div className="card-kicker">KEYNOTE 03 · 9:45 AM</div>
              <h3>What Makes an AI Powered Product Powerful</h3>
              <p className="card-lead">
                A focused session on the qualities that make an AI-powered product useful, credible and valuable to the people and businesses it serves.
              </p>
              <ul className="keynote-point-list">
                <li>Solving a clear and meaningful user problem</li>
                <li>Using AI where it creates genuine product value</li>
                <li>Designing for trust, usability and responsible adoption</li>
                <li>Combining automation with appropriate human oversight</li>
                <li>Learning from user feedback and improving the product over time</li>
              </ul>
            </article>

            <article className="keynote-card panel-card reveal" style={{ transitionDelay: '200ms' }}>
              <div className="card-kicker">FOUNDER PANEL · 10:05 AM</div>
              <h3>How Founders Are Seeing and Leveraging AI in Their Businesses</h3>
              <p className="card-lead">
                A candid conversation with founders about current AI adoption, practical experiments, lessons and challenges rather than speculative predictions.
              </p>
              <ul className="keynote-point-list">
                <li>Where founders are using AI in their businesses today</li>
                <li>How AI is changing product development, marketing, sales, customer service and operations</li>
                <li>What founders have automated and what they deliberately keep human</li>
                <li>Experiments that have worked, failed or produced unexpected results</li>
                <li>Challenges involved in introducing AI into existing teams and workflows</li>
                <li>How founders judge whether an AI use case creates real business value</li>
                <li>Opportunities for African businesses to leverage AI more effectively</li>
              </ul>
            </article>
          </div>
        </section>

        {/* Expected Value For Participants */}
        <section className="kigali-value dark section">
          <div className="kigali-section-header reveal">
            <p className="kicker">TANGIBLE OUTCOMES</p>
            <h2>EXPECTED VALUE FOR PARTICIPANTS</h2>
          </div>

          <div className="value-layout">
            <div className="value-grid">
              {takeaways.map((item, i) => (
                <div key={i} className="value-item reveal" style={{ transitionDelay: `${i * 70}ms` }}>
                  <CheckCircle2 size={20} className="check-icon" />
                  <p>{item}</p>
                </div>
              ))}
            </div>

            <div className="value-visual reveal">
              <div className="image-frame-dark">
                <img src="/images/speaker.jpg" alt="Speaker at AI GTM session" />
                <div className="image-caption">
                  <span>FOUNDER-TO-FOUNDER INSIGHTS</span>
                  <label>PRACTICAL · ACTIONABLE · UNFILTERED</label>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Venue & Event Logistics */}
        <section id="venue" className="kigali-venue light section">
          <div className="kigali-section-header reveal">
            <p className="kicker">LOCATION &amp; LOGISTICS</p>
            <h2>EVENT DELIVERY &amp; VENUE</h2>
          </div>

          <div className="venue-layout">
            <div className="venue-details-card reveal">
              <div className="venue-title-row">
                <MapPin size={24} className="pin-icon" />
                <div>
                  <h3>U.S. Embassy Kigali</h3>
                  <p>Kigali, Rwanda</p>
                </div>
              </div>

              <div className="venue-table">
                {eventPlanItems.map((row) => (
                  <div key={row.area} className="venue-row">
                    <span className="v-area">{row.area}</span>
                    <span className="v-detail">{row.detail}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="venue-photo-card reveal">
              <div className="image-frame">
                <img src="/images/cities/kigali.jpg" alt="Kigali Rwanda" />
                <div className="image-caption">
                  <span>KIGALI, RWANDA</span>
                  <label>U.S. EMBASSY KIGALI</label>
                </div>
              </div>
              <div className="venue-security-note">
                <strong>Important Notice:</strong> Guest check-in begins prior to 9:00 AM. Please arrive on time with valid identification for venue entry.
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="kigali-final-cta dark section">
          <div className="final-cta-inner reveal">
            <p className="kicker">OCTOBER 08, 2026 · KIGALI</p>
            <h2>JOIN US AT AI GTM AFRICA KIGALI.</h2>
            <p className="final-desc">
              If you are building, marketing, launching, growing or scaling a business in Kigali, come be part of this high-impact room.
            </p>
            <div className="final-btn-group">
              <button type="button" className="cta" onClick={() => setModalOpen(true)}>
                Apply for Your Kigali Seat <span aria-hidden="true" className="cta-arrow" />
              </button>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="cta cta-dark">
                Become a Partner <span aria-hidden="true" className="cta-arrow" />
              </a>
              <a href="/" className="cta cta-outline">
                View Full 5-City Tour <span aria-hidden="true" className="cta-arrow" />
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer dark">
        <div className="footer-brand reveal">
          <a className="brand" href="/">AI GTM <b>AFRICA</b></a>
          <p>AI. GO-TO-MARKET. GROWTH.</p>
        </div>
        <div className="footer-group reveal">
          <p className="footer-label">KIGALI EVENT</p>
          <a href="#overview">Overview</a>
          <a href="#objectives">Objectives</a>
          <a href="#programme">Timetable</a>
          <a href="#venue">Venue Logistics</a>
        </div>
        <div className="footer-group reveal">
          <p className="footer-label">2026 TOUR</p>
          <a href="/#cities">All 5 Cities</a>
          <a href="/tomide-williams">Convener Profile</a>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">Partner With Us</a>
        </div>
        <p className="footer-copyright reveal">
          &copy; 2026 AI GTM Africa &middot; Kigali Edition
        </p>
      </footer>

      {/* Registration Modal */}
      <KigaliRegistrationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
