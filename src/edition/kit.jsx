import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Menu, X } from 'lucide-react';
import fullGallery from '../kigaliGallery.json';
import '../nairobi.css';

// Shared building blocks for the city edition pages (Kigali, Nairobi), so every edition looks and behaves the same.

// Absolute so links still reach the main site from the city subdomains
export const MAIN_SITE = 'https://www.aigtm.africa';
export const KIGALI_RECAP_URL = 'https://lnkd.in/p/dqSqn8hf';
export const EDITION_IMG = '/images/kigali-event/';
export const FULL_GALLERY_IMG = '/images/kigali-gallery/';
export const WHATSAPP_NUMBER = '2349025631654';
export { fullGallery };

const FONTS_URL = 'https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Instrument+Serif:ital@1&family=JetBrains+Mono:wght@400;500&display=swap';

export const initials = (name) => name.replace(/^Dr\s+/, '').split(/\s+/).slice(0, 2).map((p) => p[0]).join('');

export function Arrow() {
  return <ArrowRight size={18} aria-hidden="true" />;
}

// Loads the fonts, tracks scrolling for the nav shadow and runs the scroll reveal
export function useEditionPage() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    if (!document.querySelector(`link[href="${FONTS_URL}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = FONTS_URL;
      document.head.appendChild(link);
    }
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add('is-in'), io.unobserve(e.target))),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    document.querySelectorAll('.nb [data-reveal]').forEach((el) => io.observe(el));
    return () => {
      window.removeEventListener('scroll', onScroll);
      io.disconnect();
    };
  }, []);
  return scrolled;
}

// Locks page scroll and closes on Escape while an overlay is open
export function useOverlay(open, onClose) {
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);
}

export function Portrait({ name, photo, className = '' }) {
  return (
    <span className={`nb-portrait ${className}`} aria-hidden="true">
      {photo ? <img src={photo} alt="" loading="lazy" /> : <span>{initials(name)}</span>}
    </span>
  );
}

// Floating pill navigation. `action` is the button or link on the right (Register, or a link to the next edition).
export function EditionNav({ city, links, scrolled, action }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className={`nb-nav${scrolled ? ' is-scrolled' : ''}`}>
      <div className="nb-nav-bar">
        <a href={MAIN_SITE} className="nb-logo" aria-label="AI GTM Africa home">
          AI GTM Africa <span className="nb-logo-chip">{city.toUpperCase()}</span>
        </a>
        <nav className="nb-nav-links" aria-label="Page sections">
          {links.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </nav>
        <div className="nb-nav-actions" onClickCapture={() => setMenuOpen(false)}>
          {action}
          <button type="button" className="nb-menu-btn" aria-expanded={menuOpen} aria-controls="nb-sheet" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}>
            {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>
      {menuOpen ? (
        <nav id="nb-sheet" className="nb-sheet" aria-label="Page sections">
          {links.map(([href, label]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
          <a href={MAIN_SITE} onClick={() => setMenuOpen(false)}>All cities</a>
        </nav>
      ) : null}
    </header>
  );
}

export function EditionFooter({ city, links }) {
  return (
    <footer className="nb-footer">
      <div className="nb-wrap nb-footer-inner">
        <p>© 2026 AI GTM Africa · {city} edition</p>
        <nav className="nb-footer-links" aria-label="AI GTM Africa">
          {links.map(([href, label, external]) => (
            <a key={href} href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{label}</a>
          ))}
        </nav>
      </div>
    </footer>
  );
}

// Every Kigali photo from Emma's gallery, with a swipeable full-size viewer
export function FullGallery({ open, onClose }) {
  const [active, setActive] = useState(null);
  const closeRef = useRef(null);
  const touchX = useRef(null);
  const total = fullGallery.length;

  const closeAll = useCallback(() => {
    if (active !== null) setActive(null);
    else onClose();
  }, [active, onClose]);
  useOverlay(open, closeAll);

  useEffect(() => {
    if (open) setTimeout(() => closeRef.current?.focus(), 50);
    else setActive(null);
  }, [open]);

  useEffect(() => {
    if (active === null) return undefined;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') setActive((i) => (i + 1) % total);
      if (e.key === 'ArrowLeft') setActive((i) => (i - 1 + total) % total);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [active, total]);

  if (!open) return null;
  const photo = active !== null ? fullGallery[active] : null;

  return (
    <div className="nb-viewer" role="dialog" aria-modal="true" aria-label={`AI GTM Africa Kigali gallery, ${total} photos`}>
      <div className="nb-viewer-bar">
        <p><strong>Kigali edition</strong> <span>{total} photos by Emma</span></p>
        <button ref={closeRef} type="button" className="nb-icon-btn" onClick={onClose} aria-label="Close gallery">
          <X size={20} aria-hidden="true" />
        </button>
      </div>
      <div className="nb-viewer-grid">
        {fullGallery.map((p, i) => (
          <button key={p.n} type="button" className="nb-viewer-thumb" style={{ aspectRatio: `${p.w} / ${p.h}` }} onClick={() => setActive(i)} aria-label={`Open photo ${i + 1} of ${total}`}>
            <img src={`${FULL_GALLERY_IMG}thumb/${p.n}.jpg`} alt="" loading="lazy" decoding="async" />
          </button>
        ))}
      </div>

      {photo ? (
        <div
          className="nb-lightbox"
          role="dialog"
          aria-label={`Photo ${active + 1} of ${total}`}
          onClick={(e) => e.target === e.currentTarget && setActive(null)}
          onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) setActive((i) => (dx < 0 ? (i + 1) % total : (i - 1 + total) % total));
            touchX.current = null;
          }}
        >
          <img key={photo.n} src={`${FULL_GALLERY_IMG}${photo.n}.jpg`} alt={`AI GTM Africa Kigali, photo ${active + 1} of ${total}`} width={photo.w} height={photo.h} />
          <button type="button" className="nb-icon-btn nb-lb-close" onClick={() => setActive(null)} aria-label="Back to all photos"><X size={20} aria-hidden="true" /></button>
          <button type="button" className="nb-icon-btn nb-lb-prev" onClick={() => setActive((i) => (i - 1 + total) % total)} aria-label="Previous photo"><ArrowLeft size={20} aria-hidden="true" /></button>
          <button type="button" className="nb-icon-btn nb-lb-next" onClick={() => setActive((i) => (i + 1) % total)} aria-label="Next photo"><ArrowRight size={20} aria-hidden="true" /></button>
          <p className="nb-lb-count">{active + 1} / {total}</p>
        </div>
      ) : null}
    </div>
  );
}

// Curated Kigali photos in three columns, hand-balanced by photo shape so no column runs short
export const kigaliGalleryColumns = [
  [
    { src: `${EDITION_IMG}flag-group-wide.jpg`, w: 1024, h: 768, alt: 'The full group at the American Center Kigali, with the U.S. and Rwandan flags' },
    { src: `${EDITION_IMG}keynote-speaker.jpg`, w: 1050, h: 1400, alt: 'A keynote speaker addressing the room in Kigali' },
    { src: `${EDITION_IMG}check-in.jpg`, w: 1050, h: 1400, alt: 'Guests checking in at the American Center Kigali' },
    { src: `${EDITION_IMG}roundtable.jpg`, w: 1400, h: 1050, alt: 'Founders talking at the roundtable after the Kigali sessions' },
  ],
  [
    { src: `${EDITION_IMG}panel.jpg`, w: 1400, h: 1050, alt: 'Panellists at AI GTM Africa Kigali' },
    { src: `${EDITION_IMG}audience-flags.jpg`, w: 1050, h: 1400, alt: 'Guests listening during a session in Kigali' },
    { src: `${EDITION_IMG}convener.jpg`, w: 1400, h: 1050, alt: 'Tomide Williams speaking at AI GTM Africa Kigali' },
    { src: `${FULL_GALLERY_IMG}130.jpg`, w: 1024, h: 768, alt: 'Guests and speakers at the American Center Kigali' },
    { src: `${EDITION_IMG}roundtable-table.jpg`, w: 1400, h: 1050, alt: 'Guests at the founder roundtable after the sessions' },
  ],
  [
    { src: `${EDITION_IMG}room-wide.jpg`, w: 1050, h: 1400, alt: 'A full room for a keynote in Kigali' },
    { src: `${EDITION_IMG}keynote-stage.jpg`, w: 1050, h: 1400, alt: 'A speaker on stage in Kigali' },
    { src: `${EDITION_IMG}panelist-question.jpg`, w: 1400, h: 1050, alt: 'A panellist answering a question in Kigali' },
    { src: `${EDITION_IMG}roundtable-guest.jpg`, w: 1400, h: 1050, alt: 'A guest at the founder roundtable in Kigali' },
  ],
];

export function KigaliGallery({ onOpenFull }) {
  return (
    <>
      <div className="nb-gallery">
        {kigaliGalleryColumns.map((col, c) => (
          <div key={c} className="nb-gallery-col">
            {col.map((g) => (
              <figure key={g.src} data-reveal style={{ '--d': `${c * 80}ms` }}>
                <img src={g.src} alt={g.alt} width={g.w} height={g.h} loading="lazy" decoding="async" />
              </figure>
            ))}
          </div>
        ))}
      </div>
      <div className="nb-gallery-foot">
        <button type="button" className="nb-btn nb-btn-dark" onClick={onOpenFull}>
          View full gallery · {fullGallery.length} photos
        </button>
        <a href={KIGALI_RECAP_URL} target="_blank" rel="noopener noreferrer" className="nb-btn nb-btn-ghost">See the Kigali recap <ArrowRight size={18} aria-hidden="true" /></a>
        <p>Photos by Emma.</p>
      </div>
    </>
  );
}
