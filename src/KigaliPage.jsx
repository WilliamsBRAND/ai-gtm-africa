import React, { useCallback, useState } from 'react';
import { ArrowUpRight, Calendar, Images, MapPin, Utensils } from 'lucide-react';
import {
  Arrow, EDITION_IMG, EditionFooter, EditionNav, FullGallery, KIGALI_RECAP_URL, KigaliGallery, MAIN_SITE, Portrait, SpeakerCarousel, WHATSAPP_NUMBER, fullGallery, useEditionPage,
} from './edition/kit';

// AI GTM Africa Kigali, 8 October 2026: the first edition, shown as a recap in the same design as the Nairobi page.
const NAIROBI_URL = `${MAIN_SITE}/nairobi`;
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Williams, I'd like to partner with you for AI GTM Africa.")}`;

// Add a headshot path to show a photo instead of initials
const keynoteSpeakers = [
  { name: 'Omolara Osiyemi', role: 'The Product Muse', photo: '/images/kigali-gallery/040.jpg' },
  { name: 'Anuoluwa Adepoju', role: 'Cloudboosta', photo: '/images/kigali-gallery/116.jpg' },
  { name: 'Ugwu Somto', role: 'DigitPay Finance', photo: '/images/kigali-gallery/074.jpg' },
];

const panelists = [
  { name: 'Mugisha Nehemie', role: 'Cyberstream', photo: '/images/kigali-gallery/088.jpg' },
  { name: 'Ntirushwa JeanMarc', role: 'CircuitNotion', photo: '/images/kigali-gallery/089.jpg' },
];

const team = [
  { name: 'Chibuzor Scholastica', role: 'Panel moderator', photo: '/images/kigali-gallery/084.jpg' },
  { name: 'Ishimwe Ben', role: 'Event moderator', photo: '/images/kigali-gallery/030.jpg' },
  { name: 'Tomide Williams', role: 'Founder, closing remarks', photo: '/images/kigali-gallery/094.jpg' },
];

const keynoteTopics = [
  { title: 'Building a Go to Market Engine', text: 'How a product or service goes from market understanding to customer acquisition and sustainable growth.' },
  { title: 'Using AI to Build, Grow and Scale a Business', text: 'Where AI creates real business value, from research and marketing to sales and operations.' },
  { title: 'What Makes an AI Powered Product Powerful', text: 'The qualities that make an AI product useful, credible and valuable to the people it serves.' },
];

const day = [
  { time: '9:00 AM', title: 'Welcome and opening', who: 'Ishimwe Ben, event moderator', kind: 'Opening' },
  { time: 'Morning', title: 'Three keynotes on AI, go-to-market and growth', who: 'Omolara Osiyemi, Anuoluwa Adepoju, Ugwu Somto', kind: 'Keynotes', key: true },
  { time: 'Morning', title: 'How Founders Are Using and Leveraging AI in Their Businesses', who: 'Mugisha Nehemie, Ntirushwa JeanMarc · moderated by Chibuzor Scholastica', kind: 'Founder panel', key: true },
  { time: 'Morning', title: 'Open questions, closing remarks and group photo', who: 'Tomide Williams', kind: 'Close' },
  { time: '1:00 PM', title: 'Lunch Conversation at Kozo Kigali', who: '1:00 PM to 4:00 PM', kind: 'Afternoon', key: true },
];

const marquee = [...keynoteSpeakers, ...panelists].map((p) => [p.name, p.role]);

export default function KigaliPage() {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const scrolled = useEditionPage();
  const openGallery = () => setGalleryOpen(true);
  const closeGallery = useCallback(() => setGalleryOpen(false), []);

  const navLinks = [
    ['#speakers', 'Speakers'],
    ['#day', 'The day'],
    ['#gallery', 'Gallery'],
    ['#next', 'Nairobi'],
  ];

  return (
    <div className="nb">
      <EditionNav
        city="Kigali"
        links={navLinks}
        scrolled={scrolled}
        action={<a href={NAIROBI_URL} className="nb-btn nb-btn-primary">Nairobi · 5 Nov</a>}
      />

      <main>
        <section className="nb-hero">
          <div className="nb-wrap">
            <div className="nb-hero-top">
              <p className="nb-eyebrow" data-reveal>AI GTM Africa · Kigali edition · Past event</p>
              <h1 className="nb-h1" data-reveal style={{ '--d': '80ms' }}>
                Where it all <em>started.</em>
              </h1>
            </div>
            <div className="nb-hero-bottom">
              <p className="nb-lead" data-reveal style={{ '--d': '160ms' }}>
                Our first edition. Founders and operators met at the U.S. Embassy Kigali for three keynotes and a founder panel on AI, go-to-market and growth, then carried the conversation into lunch at Kozo Kigali.
              </p>
              <div className="nb-hero-ctas" data-reveal style={{ '--d': '220ms' }}>
                <button type="button" className="nb-btn nb-btn-dark" onClick={openGallery}><Images size={18} aria-hidden="true" /> See all photos</button>
                <a href={NAIROBI_URL} className="nb-btn nb-btn-primary">Join us in Nairobi <Arrow /></a>
              </div>
            </div>

            <dl className="nb-facts" data-reveal style={{ '--d': '280ms' }}>
              <div className="nb-fact">
                <span className="nb-fact-icon"><Calendar size={20} aria-hidden="true" /></span>
                <div><dt>Date</dt><dd>Thursday, 8 October 2026</dd></div>
              </div>
              <div className="nb-fact">
                <span className="nb-fact-icon"><MapPin size={20} aria-hidden="true" /></span>
                <div><dt>Morning</dt><dd>American Center, U.S. Embassy Kigali</dd></div>
              </div>
              <div className="nb-fact">
                <span className="nb-fact-icon"><Utensils size={20} aria-hidden="true" /></span>
                <div><dt>Afternoon</dt><dd>Lunch Conversation at Kozo Kigali, 1:00 PM to 4:00 PM</dd></div>
              </div>
            </dl>

            <div className="nb-hero-photos" data-reveal style={{ '--d': '340ms' }}>
              <figure className="is-side"><img src={`${EDITION_IMG}keynote-stage.jpg`} alt="A speaker on stage at AI GTM Africa Kigali" width="1050" height="1400" /></figure>
              <figure className="is-main"><img src={`${EDITION_IMG}flag-group.jpg`} alt="Guests and speakers at AI GTM Africa Kigali, between the U.S. and Rwandan flags" width="1024" height="768" /></figure>
              <figure className="is-side"><img src={`${EDITION_IMG}check-in.jpg`} alt="Guests checking in at the American Center Kigali" width="1050" height="1400" /></figure>
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

        <section className="nb-section" aria-labelledby="kg-numbers">
          <div className="nb-wrap">
            <p className="nb-eyebrow" data-reveal>The first edition</p>
            <h2 id="kg-numbers" className="nb-h2" data-reveal>One closed room. <em>Real conversations.</em></h2>
            <div className="nb-bento">
              <div className="nb-stat is-dark" data-reveal><span className="nb-stat-num">3</span><span className="nb-stat-label">Keynotes on AI, go-to-market and growth</span></div>
              <div className="nb-stat" data-reveal style={{ '--d': '80ms' }}><span className="nb-stat-num">1</span><span className="nb-stat-label">Founder panel on using AI in real businesses</span></div>
              <div className="nb-stat is-accent" data-reveal style={{ '--d': '160ms' }}><span className="nb-stat-num">~30</span><span className="nb-stat-label">About 25 to 30 selected founders and operators in a closed session</span></div>
              <div className="nb-stat" data-reveal style={{ '--d': '240ms' }}><span className="nb-stat-num">{fullGallery.length}</span><span className="nb-stat-label">Photos from the day, all in the gallery below</span></div>
            </div>
          </div>
        </section>

        <section id="speakers" className="nb-section nb-grey" aria-labelledby="kg-speakers-title">
          <div className="nb-wrap">
            <div className="nb-section-head">
              <div>
                <p className="nb-eyebrow" data-reveal>Speakers</p>
                <h2 id="kg-speakers-title" className="nb-h2" data-reveal>Who <em>took the stage.</em></h2>
              </div>
              <p className="nb-lead" data-reveal>Three keynote speakers and two founders on the panel, with our moderators and team.</p>
            </div>

            <SpeakerCarousel label="Kigali keynote speakers">
              {keynoteSpeakers.map((s) => (
                <article key={s.name} className="nb-sp" role="listitem">
                  <div className="nb-sp-photo">
                    <Portrait name={s.name} photo={s.photo} />
                  </div>
                  <div className="nb-sp-body">
                    <p className="nb-sp-kind">Keynote speaker</p>
                    <div className="nb-sp-who" style={{ marginTop: 0, paddingTop: 0, borderTop: 0 }}>
                      <p className="nb-sp-name" style={{ fontSize: 21 }}>{s.name}</p>
                      <p className="nb-sp-role">{s.role}</p>
                    </div>
                  </div>
                </article>
              ))}
            </SpeakerCarousel>

            <article className="nb-panel" data-reveal>
              <div className="nb-panel-head">
                <p className="nb-sp-kind">Founder panel</p>
                <h3 className="nb-panel-title">How Founders Are Using and Leveraging AI in <em>Their Businesses</em></h3>
              </div>
              <ul className="nb-panelists">
                {panelists.map((p) => (
                  <li key={p.name}>
                    <Portrait name={p.name} photo={p.photo} className="is-round" />
                    <div>
                      <p className="nb-sp-name">{p.name}</p>
                      <p className="nb-sp-role">{p.role}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </article>

            <ul className="kg-team" data-reveal>
              {team.map((p) => (
                <li key={p.name}>
                  <Portrait name={p.name} photo={p.photo} className="is-round" />
                  <div>
                    <p className="nb-sp-name">{p.name}</p>
                    <p className="nb-sp-role">{p.role}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="day" className="nb-section nb-dark" aria-labelledby="kg-day-title">
          <div className="nb-wrap nb-programme">
            <div className="nb-programme-side">
              <p className="nb-eyebrow" data-reveal>Thursday 8 October 2026</p>
              <h2 id="kg-day-title" className="nb-h2" data-reveal>How the day <em>went.</em></h2>
              <p className="nb-lead" style={{ marginTop: 18 }} data-reveal>A closed morning session at the U.S. Embassy Kigali, then an afternoon lunch conversation at Kozo Kigali.</p>
              <button type="button" className="nb-btn nb-btn-primary" onClick={openGallery} data-reveal><Images size={18} aria-hidden="true" /> See all photos</button>
            </div>
            <ol className="nb-timeline">
              {day.map((p) => (
                <li key={p.title} data-reveal>
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

        <section className="nb-section" aria-labelledby="kg-topics-title">
          <div className="nb-wrap">
            <p className="nb-eyebrow" data-reveal>What we covered</p>
            <h2 id="kg-topics-title" className="nb-h2" data-reveal>Three keynotes, <em>one thread.</em></h2>
            <ol className="nb-why">
              {keynoteTopics.map((t, i) => (
                <li key={t.title} data-reveal style={{ '--d': `${i * 80}ms` }}>
                  <span className="nb-why-num">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <p>{t.title}</p>
                    <p className="kg-topic-text">{t.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="gallery" className="nb-section" style={{ paddingTop: 0 }} aria-labelledby="kg-gallery-title">
          <div className="nb-wrap">
            <div className="nb-section-head">
              <div>
                <p className="nb-eyebrow" data-reveal>Gallery</p>
                <h2 id="kg-gallery-title" className="nb-h2" data-reveal>The day <em>in pictures.</em></h2>
              </div>
              <p className="nb-lead" data-reveal>From check-in at the American Center to the group photo and lunch at Kozo Kigali.</p>
            </div>
            <KigaliGallery onOpenFull={openGallery} />
          </div>
        </section>

        <section id="next" className="nb-final" aria-labelledby="kg-next-title">
          <div className="nb-wrap">
            <div className="nb-final-card" data-reveal>
              <p className="nb-eyebrow">Next stop · Thursday 5 November 2026</p>
              <h2 id="kg-next-title" className="nb-final-title">See you in <em>Nairobi.</em></h2>
              <p className="nb-lead" style={{ color: 'var(--nb-on-dark-soft)' }}>Four keynotes and a panel at iHub (CcHub), Lavington, from 9:00 AM to 12:00 PM.</p>
              <div className="nb-final-ctas">
                <a href={NAIROBI_URL} className="nb-btn nb-btn-primary">See the Nairobi programme <Arrow /></a>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="nb-btn nb-btn-outline-light">Become a partner <ArrowUpRight size={18} aria-hidden="true" /></a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <EditionFooter
        city="Kigali"
        links={[[MAIN_SITE, 'All cities'], [NAIROBI_URL, 'Nairobi edition'], [KIGALI_RECAP_URL, 'Kigali recap', true], [`${MAIN_SITE}/tomide-williams`, 'About Tomide']]}
      />

      <FullGallery open={galleryOpen} onClose={closeGallery} />
    </div>
  );
}
