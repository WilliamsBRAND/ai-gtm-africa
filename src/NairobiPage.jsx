import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Calendar, Clock, MapPin, X } from 'lucide-react';
import { NAIROBI_WHATSAPP_GROUP_URL } from './registration';
import {
  Arrow, EDITION_IMG as EDITION, EditionFooter, EditionNav, FullGallery, KigaliGallery, MAIN_SITE, Portrait, SpeakerCarousel, WHATSAPP_NUMBER, useEditionPage, useOverlay,
} from './edition/kit';

const VENUE_NAME = 'iHub (CcHub)';
const VENUE_ADDRESS = 'Jahazi Building, 154 James Gichuru Road, Lavington, Nairobi';
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('iHub Jahazi Building 154 James Gichuru Road Nairobi')}`;
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Williams, I'd like to partner with you for AI GTM Africa Nairobi.")}`;

// Add a headshot path (for example '/images/speakers/esther-ndungu.jpg') to show a photo instead of initials
const speakers = [
  { n: '01', time: '9:30 AM', topic: 'Building Market-Relevant AI-Powered Products', name: 'Esther Ndungu', role: 'Microsoft', photo: '/images/speakers/esther-ndungu.jpg' },
  { n: '02', time: '10:00 AM', topic: 'Using AI to Win Customers and Grow Revenue', name: 'Håvar Bauck', role: 'Co-founder, HotelOnline', photo: '/images/speakers/havar-bauck.jpg' },
  { n: '03', time: '11:15 AM', topic: 'Managing Risk, Trust, and Control in Africa’s Business Landscape', name: 'Dr Liz Ankrah', role: 'Microsoft Research', photo: '/images/speakers/liz-ankrah.jpg' },
  { n: '04', time: '11:45 AM', topic: 'Becoming a Business Leader the Market Can’t Ignore in the Age of AI', name: 'Ms. Muthoni Njoroge', role: '5X Award-winning Personal Branding & LinkedIn Expert for Leaders.', photo: '/images/speakers/muthoni-njoroge.jpeg', portraitClass: 'is-muthoni-headshot' },
];

const panelists = [
  { name: 'Jasmine Gathoga', role: 'Brand Strategist and Designer, That Canva Girl', photo: '/images/speakers/jasmine-gathoga.jpg' },
  { name: 'Peter Maina Njoroge', role: 'Product and Growth Strategist, WildMango', photo: '/images/speakers/peter-maina-njoroge.jpeg', portraitClass: 'is-peter-headshot' },
  { name: 'Michael Simba', role: 'Founding Growth & GTM Marketing Lead, Helicode', photo: '/images/speakers/michael-simba.webp', portraitClass: 'is-simba-headshot' },
];

const programme = [
  { time: '8:00 AM', title: 'Arrival and check-in', kind: 'Doors open' },
  { time: '8:30 AM', title: 'Red carpet', kind: 'Red carpet' },
  { time: '9:00 AM', title: 'Event kickoff and welcome address', who: 'Tomide Williams', kind: 'Welcome' },
  { time: '9:30 AM', title: 'Building Market-Relevant AI-Powered Products', who: 'Esther Ndungu, Microsoft', kind: 'Keynote · 30 mins', key: true },
  { time: '10:00 AM', title: 'Using AI to Win Customers and Grow Revenue', who: 'Håvar Bauck, HotelOnline', kind: 'Keynote · 30 mins', key: true },
  { time: '10:30 AM', title: 'Building Go-to-Market Strategies for African Markets with AI', who: 'Tomide Williams', kind: 'Fireside chat · 20 mins', key: true },
  { time: '10:50 AM', title: 'When AI Can Do Almost Everything, What Makes You Stand Out?', who: 'Jasmine Gathoga, Peter Maina Njoroge, Michael Simba · Moderator: Raphail John, Co-founder, Investspring', kind: 'Panel · 25 mins', key: true },
  { time: '11:15 AM', title: 'Managing Risk, Trust, and Control in Africa’s Business Landscape', who: 'Dr Liz Ankrah, Microsoft Research', kind: 'Keynote · 30 mins', key: true },
  { time: '11:45 AM', title: 'Becoming a Business Leader the Market Can’t Ignore in the Age of AI', who: 'Ms. Muthoni Njoroge', kind: 'Keynote · 30 mins', key: true },
  { time: '12:15 PM', title: 'Vote of thanks', who: 'Tomide Williams', kind: 'Closing remarks · 5 mins' },
  { time: '12:20 PM', title: 'Group photos and networking', kind: 'Networking' },
];

const reasons = [
  'How to build AI-powered products that solve real customer problems.',
  'How to use AI to understand your market and reach the right customers.',
  'What still makes your business stand out when everyone has the same AI tools.',
  'How to manage risk, trust and control as you bring AI into your business.',
  'Practical ways to use AI to win customers and grow revenue.',
  'New connections with founders and operators in Nairobi.',
];

const marquee = [
  ['Esther Ndungu', 'Microsoft'],
  ['Håvar Bauck', 'HotelOnline'],
  ['Tomide Williams', 'Founder, AI GTM Africa'],
  ['Dr Liz Ankrah', 'Microsoft Research'],
  ['Ms. Muthoni Njoroge', 'Personal Branding & LinkedIn Expert'],
  ['Raphail John', 'Co-founder, Investspring · Panel moderator'],
  ['Jasmine Gathoga', 'That Canva Girl'],
  ['Peter Maina Njoroge', 'WildMango'],
  ['Michael Simba', 'Helicode'],
];

const WHAT_YOU_DO = ['Founder', 'Business Owner', 'Executive', 'Professional', 'Consultant', 'Investor', 'Creator', 'Student', 'Researcher', 'Community Builder', 'Other'];
const BUSINESS_TYPES = ['Technology', 'Finance', 'Banking', 'Healthcare', 'Education', 'Agriculture', 'Energy', 'Professional Services', 'Consulting', 'Media & Entertainment', 'Retail & Consumer', 'Real Estate', 'Manufacturing', 'Logistics', 'Government & Public Sector', 'Nonprofit', 'Other'];
const HEAR_OPTIONS = ['Tomide', 'Referral', 'Friend or Colleague', 'LinkedIn', 'WhatsApp', 'Event', 'Social Media', 'Other'];



function RegisterDialog({ open, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: '', industry: '', heard: '', sponsor: '' });
  const [state, setState] = useState('idle');
  const [error, setError] = useState('');
  const firstRef = useRef(null);
  useOverlay(open, onClose);

  useEffect(() => {
    if (!open) return undefined;
    setForm({ name: '', email: '', phone: '', role: '', industry: '', heard: '', sponsor: '' });
    setState('idle');
    setError('');
    const focusTimer = setTimeout(() => firstRef.current?.focus(), 60);
    return () => clearTimeout(focusTimer);
  }, [open]);

  if (!open) return null;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (Object.values(form).some((v) => !String(v).trim())) {
      setError('Please fill in every field.');
      return;
    }
    setState('sending');
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, city: 'NAIROBI' }),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok || !result.ok) throw new Error(result.error || 'We could not send your registration.');
      setState('done');
      window.location.assign(NAIROBI_WHATSAPP_GROUP_URL);
    } catch (err) {
      setState('idle');
      setError(err.message || 'We could not send your registration. Please try again.');
    }
  };

  const field = (label, control) => (
    <label className="nb-field">
      <span>{label}</span>
      {control}
    </label>
  );

  return (
    <div className="nb-modal" role="dialog" aria-modal="true" aria-labelledby="nb-register-title" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="nb-modal-panel">
        <button type="button" className="nb-modal-close" onClick={onClose} aria-label="Close">
          <X size={20} aria-hidden="true" />
        </button>
        <p className="nb-eyebrow">Thursday 5 November 2026</p>
        {state === 'done' ? (
          <>
            <h2 id="nb-register-title">You’re registered.</h2>
            <div className="nb-done">
              <p>Thanks for registering for AI GTM Africa Nairobi at {VENUE_NAME}.</p>
              <p>We’ll email you to confirm your place.</p>
              <button type="button" className="nb-btn nb-btn-dark" onClick={onClose}>Back to the page</button>
            </div>
          </>
        ) : (
          <>
            <h2 id="nb-register-title">Register for Nairobi</h2>
            <p className="nb-modal-sub">8:00 AM to 12:00 PM at {VENUE_NAME}, Lavington.</p>
            <form className="nb-form" onSubmit={submit} noValidate>
              {field('Full name', <input ref={firstRef} type="text" value={form.name} onChange={set('name')} autoComplete="name" required />)}
              {field('Email', <input type="email" value={form.email} onChange={set('email')} autoComplete="email" inputMode="email" required />)}
              {field('Phone (WhatsApp preferred)', <input type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" inputMode="tel" placeholder="+254" required />)}
              {field('What do you do?', (
                <select value={form.role} onChange={set('role')} required>
                  <option value="" disabled>Choose one</option>
                  {WHAT_YOU_DO.map((o) => <option key={o}>{o}</option>)}
                </select>
              ))}
              {field('Industry', (
                <select value={form.industry} onChange={set('industry')} required>
                  <option value="" disabled>Choose one</option>
                  {BUSINESS_TYPES.map((o) => <option key={o}>{o}</option>)}
                </select>
              ))}
              {field('How did you hear about us?', (
                <select value={form.heard} onChange={set('heard')} required>
                  <option value="" disabled>Choose one</option>
                  {HEAR_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
              ))}
              <fieldset className="nb-field" style={{ border: 0, padding: 0, margin: 0 }}>
                <span>Interested in sponsoring?</span>
                <div className="nb-choice">
                  {['Yes', 'No'].map((v) => (
                    <label key={v} className={form.sponsor === v ? 'is-on' : ''}>
                      <input type="radio" name="sponsor" value={v} checked={form.sponsor === v} onChange={set('sponsor')} />
                      {v}
                    </label>
                  ))}
                </div>
              </fieldset>
              {error ? <p className="nb-form-error" role="alert">{error}</p> : null}
              <button type="submit" className="nb-btn nb-btn-primary" disabled={state === 'sending'}>
                {state === 'sending' ? 'Sending…' : 'Register'} {state === 'sending' ? null : <Arrow />}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function NairobiPage() {
  const [registerOpen, setRegisterOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const scrolled = useEditionPage();

  const openRegister = () => setRegisterOpen(true);
  const closeRegister = useCallback(() => setRegisterOpen(false), []);
  const closeGallery = useCallback(() => setGalleryOpen(false), []);

  const navLinks = [
    ['#speakers', 'Speakers'],
    ['#programme', 'Programme'],
    ['#kigali', 'Gallery'],
    ['#venue', 'Venue'],
  ];

  return (
    <div className="nb">
      <EditionNav city="Nairobi" links={navLinks} scrolled={scrolled} action={<button type="button" className="nb-btn nb-btn-primary" onClick={openRegister}>Register</button>} />

      <main>
        <section className="nb-hero">
          <div className="nb-wrap">
            <div className="nb-hero-top">
              <p className="nb-eyebrow" data-reveal>AI GTM Africa · Nairobi edition</p>
              <h1 className="nb-h1" data-reveal style={{ '--d': '80ms' }}>
                Build, sell and grow <em>with AI.</em>
              </h1>
            </div>
            <div className="nb-hero-bottom">
              <p className="nb-lead" data-reveal style={{ '--d': '160ms' }}>
                A focused morning for founders, business owners and technology professionals. Four keynotes, a panel and a fireside chat on building AI products, reaching customers and growing revenue.
              </p>
              <div className="nb-hero-ctas" data-reveal style={{ '--d': '220ms' }}>
                <button type="button" className="nb-btn nb-btn-primary" onClick={openRegister}>Register now <Arrow /></button>
                <a href="#programme" className="nb-btn nb-btn-ghost">See the programme</a>
              </div>
            </div>

            <dl className="nb-facts" data-reveal style={{ '--d': '280ms' }}>
              <div className="nb-fact">
                <span className="nb-fact-icon"><Calendar size={20} aria-hidden="true" /></span>
                <div><dt>Date</dt><dd>Thursday, 5 November 2026</dd></div>
              </div>
              <div className="nb-fact">
                <span className="nb-fact-icon"><Clock size={20} aria-hidden="true" /></span>
                <div><dt>Time</dt><dd>8:00 AM to 12:00 PM (EAT)</dd></div>
              </div>
              <div className="nb-fact">
                <span className="nb-fact-icon"><MapPin size={20} aria-hidden="true" /></span>
                <div><dt>Venue</dt><dd>{VENUE_NAME}, 154 James Gichuru Road, Lavington</dd></div>
              </div>
            </dl>

            <div className="nb-collaboration" data-reveal style={{ '--d': '320ms' }}>
              <p>In collaboration with</p>
              <img src="/images/partners/ihub.png" alt="iHub — a CcHUB Company" width="1753" height="523" />
            </div>

            <div className="nb-hero-photos" data-reveal style={{ '--d': '340ms' }}>
              <figure className="is-side"><img src={`${EDITION}keynote-speaker.jpg`} alt="A keynote speaker at AI GTM Africa Kigali" width="1050" height="1400" /></figure>
              <figure className="is-main">
                <img src={`${EDITION}flag-group.jpg`} alt="Guests and speakers at AI GTM Africa Kigali, between the U.S. and Rwandan flags" width="1024" height="768" />
              </figure>
              <figure className="is-side"><img src={`${EDITION}audience-flags.jpg`} alt="Guests listening during a session in Kigali" width="1050" height="1400" /></figure>
            </div>
          </div>
        </section>

        <div className="nb-marquee" aria-label="Speakers">
          <div className="nb-marquee-track">
            {[0, 1].map((copy) => (
              <div key={copy} style={{ display: 'flex' }} aria-hidden={copy === 1 ? 'true' : undefined}>
                {marquee.map(([name, org]) => (
                  <span key={name + copy} className="nb-marquee-item">
                    {name} <em>{org}</em> <span className="nb-marquee-dot" aria-hidden="true" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <section className="nb-section" aria-labelledby="nb-format">
          <div className="nb-wrap">
            <p className="nb-eyebrow" data-reveal>The format</p>
            <h2 id="nb-format" className="nb-h2" data-reveal>Short talks. <em>Real questions.</em></h2>
            <div className="nb-bento">
              <div className="nb-stat is-dark" data-reveal><span className="nb-stat-num">4</span><span className="nb-stat-label">Keynotes of 30 minutes each, including Q&amp;A</span></div>
              <div className="nb-stat" data-reveal style={{ '--d': '80ms' }}><span className="nb-stat-num">2</span><span className="nb-stat-label">A 25-minute panel and a separate 20-minute fireside chat</span></div>
              <div className="nb-stat is-accent" data-reveal style={{ '--d': '160ms' }}><span className="nb-stat-num">50–100</span><span className="nb-stat-label">Founders, operators and technology professionals</span></div>
              <div className="nb-stat" data-reveal style={{ '--d': '240ms' }}><span className="nb-stat-num">4h</span><span className="nb-stat-label">One focused morning, 8:00 AM to 12:00 PM</span></div>
            </div>
          </div>
        </section>

        <section id="speakers" className="nb-section nb-grey" aria-labelledby="nb-speakers-title">
          <div className="nb-wrap">
            <div className="nb-section-head">
              <div>
                <p className="nb-eyebrow" data-reveal>Speakers</p>
                <h2 id="nb-speakers-title" className="nb-h2" data-reveal>Who you’ll <em>learn from.</em></h2>
              </div>
            </div>

            {/* Revealed as one row: on phones the later cards sit off-screen to the side and would never trigger */}
            <SpeakerCarousel label="Speakers and panelists">
              {[...speakers.slice(0, 2), { name: 'Tomide Williams', role: 'Founder, AI GTM Africa', photo: '/images/speakers/tomide-williams.jpg', kind: 'Fireside chat', topic: 'Building Go-to-Market Strategies for African Markets with AI' }, ...speakers.slice(2), { name: 'Raphail John', role: 'Co-founder, Investspring', photo: '/images/speakers/raphail-john.jpg', portraitClass: 'is-raphail-headshot', kind: 'Panel moderator', topic: 'When AI Can Do Almost Everything, What Makes You Stand Out?' }, ...panelists.map(p => ({ ...p, kind: 'Panelist', topic: 'When AI Can Do Almost Everything, What Makes You Stand Out?' }))].map((s) => (
                <article key={s.name} className="nb-sp" role="listitem">
                  <div className="nb-sp-photo">
                    {s.confirmed === false ? (
                      <div className="nb-sp-pending" aria-label="Speaker yet to be confirmed">
                        <span>Speaker</span>
                        <strong>Yet to be confirmed</strong>
                      </div>
                    ) : <Portrait name={s.name} photo={s.photo} position={s.position} className={s.portraitClass} />}
                  </div>
                  <div className="nb-sp-body">
                    <p className="nb-sp-kind">{s.kind === 'Fireside chat' ? 'Fireside chat · 20 mins' : s.kind ? `${s.kind} · 25 mins` : `Keynote ${s.n} · 30 mins`}</p>
                    <h3 className="nb-sp-topic">{s.topic}</h3>
                    <div className="nb-sp-who">
                      <p className="nb-sp-name">{s.confirmed === false ? 'Yet to be confirmed' : s.name}</p>
                      {s.confirmed === false ? null : <p className="nb-sp-role">{s.role}</p>}
                    </div>
                  </div>
                </article>
              ))}
            </SpeakerCarousel>


          </div>
        </section>

        <section id="programme" className="nb-section nb-dark" aria-labelledby="nb-programme-title">
          <div className="nb-wrap nb-programme">
            <div className="nb-programme-side">
              <p className="nb-eyebrow" data-reveal>Programme · Thursday 5 November</p>
              <h2 id="nb-programme-title" className="nb-h2" data-reveal>The morning, <em>hour by hour.</em></h2>
              <p className="nb-lead" style={{ marginTop: 18 }} data-reveal>Arrivals and check-in open at 8:00 AM, followed by the red carpet at 8:30 AM. The event kicks off at 9:00 AM, with the first keynote at 9:30 AM.</p>
              <button type="button" className="nb-btn nb-btn-primary" onClick={openRegister} data-reveal>Save your seat <Arrow /></button>
            </div>
            <ol className="nb-timeline">
              {programme.map((p) => (
                <li key={p.time} data-reveal>
                  <span className="nb-time">{p.time}</span>
                  <div>
                    <p className="nb-row-title">{p.title}</p>
                    <div className="nb-row-meta">
                      <span className={`nb-row-kind${p.key ? ' is-key' : ''}`}>{p.kind}</span>
                      {p.who ? <span>{p.who}</span> : null}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="nb-section" aria-labelledby="nb-why-title">
          <div className="nb-wrap">
            <p className="nb-eyebrow" data-reveal>Why attend</p>
            <h2 id="nb-why-title" className="nb-h2" data-reveal>What you’ll <em>leave with.</em></h2>
            <ol className="nb-why">
              {reasons.map((r, i) => (
                <li key={r} data-reveal style={{ '--d': `${(i % 3) * 80}ms` }}>
                  <span className="nb-why-num">{String(i + 1).padStart(2, '0')}</span>
                  <p>{r}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="kigali" className="nb-section" style={{ paddingTop: 0 }} aria-labelledby="nb-kigali-title">
          <div className="nb-wrap">
            <div className="nb-section-head">
              <div>
                <p className="nb-eyebrow" data-reveal>Where it started</p>
                <h2 id="nb-kigali-title" className="nb-h2" data-reveal>Kigali, <em>8 October 2026.</em></h2>
              </div>
              <p className="nb-lead" data-reveal>Our first edition brought founders and operators together at the American Center at the U.S. Embassy in Kigali. Nairobi is next.</p>
            </div>
            <KigaliGallery onOpenFull={() => setGalleryOpen(true)} />
          </div>
        </section>

        <section id="venue" className="nb-section" style={{ paddingTop: 0 }} aria-labelledby="nb-venue-title">
          <div className="nb-wrap">
            <p className="nb-eyebrow" data-reveal>Venue</p>
            <h2 id="nb-venue-title" className="nb-h2" data-reveal>See you at <em>iHub.</em></h2>
            <div className="nb-venue">
              <div className="nb-venue-card" data-reveal>
                <div>
                  <p className="nb-venue-name">{VENUE_NAME}</p>
                  <p className="nb-venue-address">{VENUE_ADDRESS}</p>
                </div>
                <dl className="nb-venue-list">
                  <div><dt>Date</dt><dd>Thursday, 5 November 2026</dd></div>
                  <div><dt>Time</dt><dd>8:00 AM to 12:00 PM (EAT)</dd></div>
                  <div><dt>Arrive</dt><dd>Check-in from 8:00 AM. Red carpet at 8:30 AM. Event kickoff at 9:00 AM.</dd></div>
                  <div><dt>Seats</dt><dd>50–100 guests. Registration required.</dd></div>
                </dl>
                <div className="nb-venue-actions nb-paired-actions">
                  <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="nb-btn nb-btn-ghost">View in Google Maps <ArrowUpRight size={18} aria-hidden="true" /></a>
                  <button type="button" className="nb-btn nb-btn-dark" onClick={openRegister}>Register <Arrow /></button>
                </div>
              </div>
              <figure className="nb-venue-photo" data-reveal style={{ '--d': '100ms' }}>
                <img src="/images/venue/ihub-jahazi.jpg" alt="iHub at the Jahazi Building on James Gichuru Road, Nairobi" loading="lazy" />
              </figure>
            </div>
          </div>
        </section>

        <section className="nb-final" aria-labelledby="nb-final-title">
          <div className="nb-wrap">
            <div className="nb-final-card" data-reveal>
              <p className="nb-eyebrow">5 November 2026 · Nairobi</p>
              <h2 id="nb-final-title" className="nb-final-title">Save your <em>seat.</em></h2>
              <p className="nb-lead" style={{ color: 'var(--nb-on-dark-soft)' }}>Space for 50–100 guests. Register now and we’ll email you to confirm your place.</p>
              <div className="nb-final-ctas">
                <button type="button" className="nb-btn nb-btn-primary" onClick={openRegister}>Register now <Arrow /></button>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="nb-btn nb-btn-outline-light">Become a partner <ArrowUpRight size={18} aria-hidden="true" /></a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <EditionFooter city="Nairobi" links={[[MAIN_SITE, 'All cities'], [`${MAIN_SITE}/kigali`, 'Kigali edition'], [`${MAIN_SITE}/tomide-williams`, 'About Tomide'], [WHATSAPP_URL, 'Partner with us', true]]} />

      <RegisterDialog open={registerOpen} onClose={closeRegister} />
      <FullGallery open={galleryOpen} onClose={closeGallery} />
    </div>
  );
}
