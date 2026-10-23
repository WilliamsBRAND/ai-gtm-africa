const fs = require('fs');
const path = require('path');
const pptxgen = require('pptxgenjs');

async function buildDeck() {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9'; // 10 x 5.625 in (or 13.33 x 7.5)
  pres.author = 'Tomide Williams';
  pres.company = 'AI GTM Africa';
  pres.title = 'AI GTM Africa Partnership Proposal — Put Your Fintech in an African Story';

  // Master Slide Setup
  const BG_COLOR = '050505';
  const CARD_BG = '0C0C0E';
  const CARD_HIGHLIGHT = '160609';
  const CRIMSON = '7A0A15';
  const CRIMSON_BRIGHT = 'DF263C';
  const GOLD = 'D4AF37';
  const TEXT_WHITE = 'FFFFFF';
  const TEXT_MUTED = '94949E';
  const FONT_DISPLAY = 'Georgia'; // Serif display for PPT compatibility
  const FONT_BODY = 'Arial'; // Clean body for cross-platform PPT rendering

  function addHeader(slide, category, programTitle = 'AI GTM AFRICA') {
    // Top Bar Category Pill
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8, y: 0.4, w: 2.2, h: 0.35,
      fill: { color: '1A080B' },
      line: { color: CRIMSON, width: 1 },
      rectRadius: 0.08
    });
    slide.addText(category.toUpperCase(), {
      x: 0.8, y: 0.4, w: 2.2, h: 0.35,
      fontFace: FONT_BODY, fontSize: 9, bold: true, color: CRIMSON_BRIGHT, align: 'center', valign: 'middle'
    });

    slide.addText(programTitle.toUpperCase(), {
      x: 3.2, y: 0.4, w: 4.0, h: 0.35,
      fontFace: FONT_BODY, fontSize: 10, color: TEXT_MUTED, align: 'left', valign: 'middle'
    });

    slide.addText('TOMIDE WILLIAMS', {
      x: 9.5, y: 0.4, w: 3.0, h: 0.35,
      fontFace: FONT_DISPLAY, fontSize: 11, bold: true, color: TEXT_WHITE, align: 'right', valign: 'middle'
    });

    // Divider line
    slide.addShape(pres.ShapeType.line, {
      x: 0.8, y: 0.85, w: 11.73, h: 0,
      line: { color: '222226', width: 1 }
    });
  }

  function addFooter(slide, slideNum, footerNote = 'AI GTM Africa Proposal') {
    slide.addShape(pres.ShapeType.line, {
      x: 0.8, y: 6.8, w: 11.73, h: 0,
      line: { color: '222226', width: 1 }
    });
    slide.addText(footerNote, {
      x: 0.8, y: 6.9, w: 6.0, h: 0.3,
      fontFace: FONT_BODY, fontSize: 9, color: '61616C', align: 'left'
    });
    slide.addText(`Slide ${slideNum} of 26`, {
      x: 8.5, y: 6.9, w: 4.0, h: 0.3,
      fontFace: FONT_BODY, fontSize: 9, color: '61616C', align: 'right'
    });
  }

  // ==========================================
  // SLIDE 1: COVER
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: BG_COLOR };
    addHeader(slide, 'Partnership Proposal', 'Executive Pitch Deck');

    slide.addText('AI GTM AFRICA TOUR 2026', {
      x: 0.8, y: 1.6, w: 10.0, h: 0.4,
      fontFace: FONT_BODY, fontSize: 13, bold: true, color: GOLD, charSpacing: 3
    });

    slide.addText([
      { text: 'Put Your Fintech in an ', options: { color: TEXT_WHITE } },
      { text: 'African Story', options: { color: CRIMSON_BRIGHT, bold: true } }
    ], {
      x: 0.8, y: 2.1, w: 11.5, h: 1.4,
      fontFace: FONT_DISPLAY, fontSize: 40, bold: true, lineSpacing: 44
    });

    slide.addText('A multi-city journey demonstrating cross-border payments, travel utility, and founder leverage across Africa’s fastest-growing tech ecosystems.', {
      x: 0.8, y: 3.6, w: 10.5, h: 0.8,
      fontFace: FONT_BODY, fontSize: 16, color: TEXT_MUTED, lineSpacing: 22
    });

    // Cities Pill Row
    const cities = ['Kigali • 08 Oct', 'Kampala', 'Nairobi • 05 Nov', 'Lagos • 28 Nov', 'Cotonou • 19 Dec', 'Accra • 29 Dec'];
    cities.forEach((c, idx) => {
      const xPos = 0.8 + idx * 1.95;
      slide.addShape(pres.ShapeType.roundRect, {
        x: xPos, y: 4.8, w: 1.8, h: 0.45,
        fill: { color: idx === 0 ? '2A080D' : '111114' },
        line: { color: idx === 0 ? CRIMSON : '25252A', width: 1 },
        rectRadius: 0.1
      });
      slide.addText(c, {
        x: xPos, y: 4.8, w: 1.8, h: 0.45,
        fontFace: FONT_BODY, fontSize: 10, bold: idx === 0, color: idx === 0 ? TEXT_WHITE : TEXT_MUTED, align: 'center', valign: 'middle'
      });
    });

    addFooter(slide, 1, 'Prepared by Tomide Williams • Founding GTM Lead & AI Practitioner');
    slide.addNotes('Opening slide. Set high prestige immediately. The angle is not asking for charity or standard sponsorship — it is positioning the fintech partner directly inside an unfolding, high-momentum Pan-African founder story across 6 major tech hubs.');
  }

  // ==========================================
  // SLIDE 2: THE IDEA
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: BG_COLOR };
    addHeader(slide, '01 • The Core Concept', 'Strategic Thesis');

    slide.addText([
      { text: 'Beyond Logo Placement: ', options: { color: TEXT_WHITE } },
      { text: 'Living Product Proof', options: { color: CRIMSON_BRIGHT, bold: true } }
    ], {
      x: 0.8, y: 1.1, w: 11.5, h: 0.6,
      fontFace: FONT_DISPLAY, fontSize: 24, bold: true
    });

    slide.addText('AI GTM Africa connects high-impact physical workshops with an organic, documented travel story across 6 African markets.', {
      x: 0.8, y: 1.7, w: 11.0, h: 0.5,
      fontFace: FONT_BODY, fontSize: 13, color: TEXT_MUTED
    });

    // Card 1
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8, y: 2.4, w: 5.6, h: 4.0,
      fill: { color: CARD_HIGHLIGHT },
      line: { color: CRIMSON, width: 1.5 },
      rectRadius: 0.1
    });
    slide.addText('PILLAR 01 • IN THE ROOM', {
      x: 1.1, y: 2.6, w: 5.0, h: 0.3,
      fontFace: FONT_BODY, fontSize: 10, bold: true, color: CRIMSON_BRIGHT
    });
    slide.addText('Physical Builder Workshops', {
      x: 1.1, y: 2.9, w: 5.0, h: 0.4,
      fontFace: FONT_DISPLAY, fontSize: 18, bold: true, color: TEXT_WHITE
    });
    slide.addText('Intensive 6-hour physical workshops in each city helping founders, growth leads, and business operators deploy AI across:\n\n• Marketing Systems\n• Sales Pipelines\n• Customer Acquisition\n• GTM Execution & Operations', {
      x: 1.1, y: 3.4, w: 5.0, h: 2.7,
      fontFace: FONT_BODY, fontSize: 12, color: TEXT_MUTED, lineSpacing: 20
    });

    // Card 2
    slide.addShape(pres.ShapeType.roundRect, {
      x: 6.8, y: 2.4, w: 5.6, h: 4.0,
      fill: { color: CARD_BG },
      line: { color: '25252A', width: 1 },
      rectRadius: 0.1
    });
    slide.addText('PILLAR 02 • ON THE ROAD', {
      x: 7.1, y: 2.6, w: 5.0, h: 0.3,
      fontFace: FONT_BODY, fontSize: 10, bold: true, color: GOLD
    });
    slide.addText('Documented African Journey', {
      x: 7.1, y: 2.9, w: 5.0, h: 0.4,
      fontFace: FONT_DISPLAY, fontSize: 18, bold: true, color: TEXT_WHITE
    });
    slide.addText('A continuous travel and lifestyle narrative showing how your fintech product powers real movement, meals, cross-border transfers, and business transactions in real time:\n\n• High-production YouTube Vlogs\n• Viral Shorts and Instagram Reels\n• Executive LinkedIn breakdowns & stories', {
      x: 7.1, y: 3.4, w: 5.0, h: 2.7,
      fontFace: FONT_BODY, fontSize: 12, color: TEXT_MUTED, lineSpacing: 20
    });

    addFooter(slide, 2);
    slide.addNotes('Explain the difference between passive ad banner placement and active product integration. Founders remember seeing a product solve a real problem on the road.');
  }

  // ==========================================
  // SLIDE 3: THE JOURNEY
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: BG_COLOR };
    addHeader(slide, '02 • Tour Timeline', 'Ecosystem Roadmap');

    slide.addText([
      { text: 'One Journey. ', options: { color: TEXT_WHITE } },
      { text: 'Six African Tech Capitals.', options: { color: CRIMSON_BRIGHT, bold: true } }
    ], {
      x: 0.8, y: 1.1, w: 11.5, h: 0.6,
      fontFace: FONT_DISPLAY, fontSize: 24, bold: true
    });

    slide.addText('The tour is already in motion with international flights and venue logistics confirmed. Target: 100 vetted founders per city.', {
      x: 0.8, y: 1.7, w: 11.0, h: 0.5,
      fontFace: FONT_BODY, fontSize: 13, color: TEXT_MUTED
    });

    const steps = [
      { num: 'STAGE 01', city: 'Kigali', date: '08 Oct 2026', badge: '70+ Registered', confirmed: true },
      { num: 'STAGE 02', city: 'Kampala', date: 'Transit Leg', badge: 'Bus Confirmed', confirmed: true },
      { num: 'STAGE 03', city: 'Nairobi', date: '05 Nov 2026', badge: 'Registrations Open', confirmed: false },
      { num: 'STAGE 04', city: 'Lagos', date: '28 Nov 2026', badge: 'West Africa Hub', confirmed: false },
      { num: 'STAGE 05', city: 'Accra', date: '29 Dec 2026', badge: 'Tour Finale', confirmed: false }
    ];

    steps.forEach((st, idx) => {
      const xPos = 0.8 + idx * 2.38;
      slide.addShape(pres.ShapeType.roundRect, {
        x: xPos, y: 2.5, w: 2.2, h: 3.2,
        fill: { color: st.confirmed ? '1A080C' : CARD_BG },
        line: { color: st.confirmed ? CRIMSON : '25252A', width: 1.5 },
        rectRadius: 0.1
      });

      slide.addText(st.num, {
        x: xPos, y: 2.7, w: 2.2, h: 0.3,
        fontFace: FONT_BODY, fontSize: 9, bold: true, color: st.confirmed ? CRIMSON_BRIGHT : TEXT_MUTED, align: 'center'
      });
      slide.addText(st.city, {
        x: xPos, y: 3.0, w: 2.2, h: 0.4,
        fontFace: FONT_DISPLAY, fontSize: 16, bold: true, color: TEXT_WHITE, align: 'center'
      });
      slide.addText(st.date, {
        x: xPos, y: 3.4, w: 2.2, h: 0.3,
        fontFace: FONT_BODY, fontSize: 10, color: GOLD, align: 'center'
      });

      slide.addShape(pres.ShapeType.roundRect, {
        x: xPos + 0.2, y: 4.9, w: 1.8, h: 0.4,
        fill: { color: st.confirmed ? CRIMSON : '1A1A20' },
        line: { color: st.confirmed ? CRIMSON_BRIGHT : '33333A', width: 1 },
        rectRadius: 0.08
      });
      slide.addText(st.badge, {
        x: xPos + 0.2, y: 4.9, w: 1.8, h: 0.4,
        fontFace: FONT_BODY, fontSize: 8, bold: true, color: TEXT_WHITE, align: 'center', valign: 'middle'
      });
    });

    slide.addText('• East Africa Core: Kigali (Flight/Stay Confirmed) → Kampala (Bus Confirmed) → Nairobi (05 Nov)\n• West Africa Core: Lagos (28 Nov) → Cotonou (19 Dec) → Accra (29 Dec)', {
      x: 0.8, y: 5.9, w: 11.5, h: 0.7,
      fontFace: FONT_BODY, fontSize: 11, color: TEXT_WHITE, lineSpacing: 18
    });

    addFooter(slide, 3);
    slide.addNotes('Emphasize that the tour is already funded and confirmed (flights, accommodations, bus tickets, 70+ registered in Kigali). The sponsor is joining a moving train.');
  }

  // ==========================================
  // SLIDE 4: THE OPPORTUNITY
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: BG_COLOR };
    addHeader(slide, '03 • Value Proposition', 'Product Utility');

    slide.addText([
      { text: 'Let People See Your Product ', options: { color: TEXT_WHITE } },
      { text: 'Working In Real Life', options: { color: CRIMSON_BRIGHT, bold: true } }
    ], {
      x: 0.8, y: 1.1, w: 11.5, h: 0.6,
      fontFace: FONT_DISPLAY, fontSize: 24, bold: true
    });

    slide.addText('Fintech adoption requires proof. Instead of synthetic ads, show your solution powering real cross-border commerce and travel.', {
      x: 0.8, y: 1.7, w: 11.0, h: 0.5,
      fontFace: FONT_BODY, fontSize: 13, color: TEXT_MUTED
    });

    const useCases = [
      { num: '01', title: 'Multi-Currency Conversion', desc: 'Instant FX switching between RWF, UGX, KES, NGN, XOF, and GHS on the move.' },
      { num: '02', title: 'Cross-Border Transport', desc: 'Paying for airport rides, interstate coaches, and city cabs friction-free.' },
      { num: '03', title: 'Hospitality & Dining', desc: 'Covering hotel reservations and local restaurant dining via virtual/physical cards.' },
      { num: '04', title: 'Peer & Vendor Transfers', desc: 'Direct instant settlements with local African suppliers, facilitators, and partners.' },
      { num: '05', title: 'Business Expense Tracking', desc: 'Managing multi-country tour operations in one clear digital dashboard.' },
      { num: '★', title: 'Native Integration', desc: 'Your product becomes the hero enabler of the journey, not an annoying pop-up.', highlight: true }
    ];

    useCases.forEach((uc, idx) => {
      const col = idx % 3;
      const row = Math.floor(idx / 3);
      const xPos = 0.8 + col * 3.95;
      const yPos = 2.4 + row * 2.05;

      slide.addShape(pres.ShapeType.roundRect, {
        x: xPos, y: yPos, w: 3.75, h: 1.85,
        fill: { color: uc.highlight ? CARD_HIGHLIGHT : CARD_BG },
        line: { color: uc.highlight ? CRIMSON : '25252A', width: uc.highlight ? 1.5 : 1 },
        rectRadius: 0.1
      });

      slide.addText(`USE CASE ${uc.num}`, {
        x: xPos + 0.2, y: yPos + 0.15, w: 3.3, h: 0.25,
        fontFace: FONT_BODY, fontSize: 9, bold: true, color: uc.highlight ? GOLD : CRIMSON_BRIGHT
      });
      slide.addText(uc.title, {
        x: xPos + 0.2, y: yPos + 0.4, w: 3.3, h: 0.35,
        fontFace: FONT_DISPLAY, fontSize: 13, bold: true, color: TEXT_WHITE
      });
      slide.addText(uc.desc, {
        x: xPos + 0.2, y: yPos + 0.8, w: 3.3, h: 0.9,
        fontFace: FONT_BODY, fontSize: 10.5, color: TEXT_MUTED, lineSpacing: 15
      });
    });

    addFooter(slide, 4);
    slide.addNotes('Fintech trust is built on visible utility. When founders watch someone navigate multi-currency borders without friction, adoption objections disappear.');
  }

  // ==========================================
  // SLIDE 5: THE VISIBILITY
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: BG_COLOR };
    addHeader(slide, '04 • Distribution Channels', 'Omnichannel Impact');

    slide.addText([
      { text: 'Two High-Impact ', options: { color: TEXT_WHITE } },
      { text: 'Visibility Engines', options: { color: CRIMSON_BRIGHT, bold: true } }
    ], {
      x: 0.8, y: 1.1, w: 11.5, h: 0.6,
      fontFace: FONT_DISPLAY, fontSize: 24, bold: true
    });

    slide.addText('Every partnership touchpoint is designed to maximize both high-touch physical engagement and wide digital reach.', {
      x: 0.8, y: 1.7, w: 11.0, h: 0.5,
      fontFace: FONT_BODY, fontSize: 13, color: TEXT_MUTED
    });

    // Left Card
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8, y: 2.4, w: 5.6, h: 4.0,
      fill: { color: CARD_BG },
      line: { color: '25252A', width: 1 },
      rectRadius: 0.1
    });
    slide.addText('ENGINE A • IN-PERSON EXPERIENCES', {
      x: 1.1, y: 2.6, w: 5.0, h: 0.3,
      fontFace: FONT_BODY, fontSize: 10, bold: true, color: CRIMSON_BRIGHT
    });
    slide.addText('Event-Floor Immersion', {
      x: 1.1, y: 2.9, w: 5.0, h: 0.4,
      fontFace: FONT_DISPLAY, fontSize: 18, bold: true, color: TEXT_WHITE
    });
    slide.addText('• Official Partner banner & pull-up display on stage\n• Live interactive product walkthrough during workshop\n• Branded attendee perks, referral QR codes & perks desk\n• Co-branded flyers, lanyards, and event materials\n• Direct executive introductions to high-value founders', {
      x: 1.1, y: 3.5, w: 5.0, h: 2.6,
      fontFace: FONT_BODY, fontSize: 12, color: TEXT_WHITE, lineSpacing: 22
    });

    // Right Card
    slide.addShape(pres.ShapeType.roundRect, {
      x: 6.8, y: 2.4, w: 5.6, h: 4.0,
      fill: { color: CARD_HIGHLIGHT },
      line: { color: CRIMSON, width: 1.5 },
      rectRadius: 0.1
    });
    slide.addText('ENGINE B • DIGITAL MULTIPLIER', {
      x: 7.1, y: 2.6, w: 5.0, h: 0.3,
      fontFace: FONT_BODY, fontSize: 10, bold: true, color: GOLD
    });
    slide.addText('Tour Content Pipeline', {
      x: 7.1, y: 2.9, w: 5.0, h: 0.4,
      fontFace: FONT_DISPLAY, fontSize: 18, bold: true, color: TEXT_WHITE
    });
    slide.addText('• High-production YouTube travel & business vlogs\n• Viral Shorts and Instagram Reels featuring live app use\n• Executive LinkedIn breakdowns distributed to 47k+ network\n• Dedicated WhatsApp founder broadcast announcements\n• High-resolution photography repository for partner reuse', {
      x: 7.1, y: 3.5, w: 5.0, h: 2.6,
      fontFace: FONT_BODY, fontSize: 12, color: TEXT_WHITE, lineSpacing: 22
    });

    addFooter(slide, 5);
    slide.addNotes('Contrast the dual distribution engines: physical event room exclusivity vs. viral digital distribution via YouTube, Reels, and LinkedIn.');
  }

  // ==========================================
  // SLIDE 6: WHY TOMIDE
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: BG_COLOR };
    addHeader(slide, '05 • Operator Credibility', 'Host Profile');

    slide.addText([
      { text: 'Founder-Led GTM, ', options: { color: TEXT_WHITE } },
      { text: 'Not Influencer Fluff', options: { color: CRIMSON_BRIGHT, bold: true } }
    ], {
      x: 0.8, y: 1.1, w: 11.5, h: 0.6,
      fontFace: FONT_DISPLAY, fontSize: 24, bold: true
    });

    slide.addText('Delivered by a proven product marketer, two-time TEDx speaker, and AI practitioner with direct access to African builders.', {
      x: 0.8, y: 1.7, w: 11.0, h: 0.5,
      fontFace: FONT_BODY, fontSize: 13, color: TEXT_MUTED
    });

    const metrics = [
      { num: '47K+', label: 'LinkedIn Community\n(Founders & Operators)', color: CRIMSON_BRIGHT },
      { num: '10K+', label: 'Active WhatsApp\nBroadcast & Groups', color: GOLD },
      { num: '$1M+', label: 'Revenue Generated\nfor Products & Clients', color: TEXT_WHITE },
      { num: '60×', label: 'ROAS Generated for\nStartup Growth Campaigns', color: CRIMSON_BRIGHT }
    ];

    metrics.forEach((m, idx) => {
      const xPos = 0.8 + idx * 2.98;
      slide.addShape(pres.ShapeType.roundRect, {
        x: xPos, y: 2.4, w: 2.75, h: 2.2,
        fill: { color: CARD_BG },
        line: { color: '25252A', width: 1 },
        rectRadius: 0.1
      });

      slide.addText(m.num, {
        x: xPos + 0.2, y: 2.6, w: 2.35, h: 0.8,
        fontFace: FONT_DISPLAY, fontSize: 32, bold: true, color: m.color
      });
      slide.addText(m.label, {
        x: xPos + 0.2, y: 3.5, w: 2.35, h: 0.9,
        fontFace: FONT_BODY, fontSize: 11, color: TEXT_MUTED, lineSpacing: 16
      });
    });

    // Execution Bottom Bar
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8, y: 4.9, w: 11.73, h: 1.5,
      fill: { color: CARD_HIGHLIGHT },
      line: { color: CRIMSON, width: 1.5 },
      rectRadius: 0.1
    });
    slide.addText('PROVEN GTM EXECUTION TRACK RECORD', {
      x: 1.1, y: 5.1, w: 8.0, h: 0.3,
      fontFace: FONT_BODY, fontSize: 10, bold: true, color: GOLD
    });
    slide.addText('• Acquired 200+ paying B2B customers for EdTech product\n• Scaled new venture product to its first 1,000 active users in 90 days\n• 2x TEDx Speaker & Convener of major professional gatherings across Nigeria', {
      x: 1.1, y: 5.4, w: 11.0, h: 0.9,
      fontFace: FONT_BODY, fontSize: 12, color: TEXT_WHITE, lineSpacing: 18
    });

    addFooter(slide, 6);
    slide.addNotes('Position Tomide as an operator who knows GTM, revenue, and product marketing — not a generic influencer who just poses for pictures.');
  }

  // ==========================================
  // SLIDES 7-26: REMAINING DECK SLIDES
  // ==========================================
  const remainingSlides = [
    {
      num: 7, cat: '06 • Track Record', title: 'LinkedIn Local Jos — 500 Attendees', sub: 'Role: Convener & Lead Organizer. High-density gathering of corporate leaders and tech builders.',
      cards: [
        { t: '500+ Attendees', d: 'Full-capacity auditorium gathering corporate and startup leadership.' },
        { t: '100% Venue Fill', d: 'Over-subscribed registration pipeline with seamless on-ground experience.' },
        { t: 'Multi-Brand Sponsorship', d: 'Successfully integrated enterprise and emerging corporate partners.' }
      ],
      notes: 'Visual proof of community mobilization. Show that Tomide fills rooms with high-calibre professionals and founders.'
    },
    {
      num: 8, cat: '06 • Track Record', title: 'JPI Youth Assembly — 500 Attendees', sub: 'Convener & Keynote Facilitator. Mobilizing ambitious youth leaders, creators, and digital entrepreneurs.',
      cards: [
        { t: 'Early Adopter Tech Base', d: 'High concentration of remote freelancers, builders, and creators needing FX tools.' },
        { t: '80%+ Retention Loop', d: 'Converted attendees into long-term active WhatsApp and digital community members.' }
      ],
      notes: 'Youth and builder mobilization. High engagement, young tech-savvy demographic that fintechs want to capture.'
    },
    {
      num: 9, cat: '06 • Track Record', title: 'LLN 25 — 2,000 Attendees', sub: 'Role: Team Lead, Marketing. Spearheaded digital acquisition, community outreach, and on-ground activations.',
      cards: [
        { t: '2,000 Delegates', d: 'Large-scale stadium/auditorium execution with seamless registration flows.' },
        { t: 'Campaign Architecture', d: 'End-to-end acquisition funnel across paid media, PR, and community outreach.' },
        { t: 'Sponsor ROI Delivery', d: 'Guaranteed measurable deliverables and massive brand recall for corporate partners.' }
      ],
      notes: 'Demonstrate ability to lead marketing for 2,000-person mega-gatherings.'
    },
    {
      num: 10, cat: '07 • Partnership Model', title: 'Tangible Line-Items, Not Arbitrary Fees', sub: 'Your company covers specific, pre-agreed operational expenses of the tour and receives guaranteed assets.',
      split: true,
      left: { title: 'WHAT YOUR COMPANY COVERS', items: ['Airport pick-up, drop-off & city transit', 'Cross-border interstate coach travel', 'Hotel / accommodation in tour cities', 'Featured restaurant dining experiences', 'Dedicated content videography crew'] },
      right: { title: 'WHAT YOUR COMPANY RECEIVES', items: ['Physical room branding & live demo time', 'Native app usage embedded in viral vlogs', 'Dedicated YouTube & LinkedIn co-branded assets', 'Consented attendee lead database & B2B intros', 'Post-event performance & analytics dossier'] },
      notes: 'Key negotiation slide. Sponsors hate writing blank cheques for "marketing fees". Instead, they cover real tangible travel/tour line-items and receive outsized media value in return.'
    },
    {
      num: 11, cat: '08 • Sponsorship Tiers', title: 'Choose the Part of the Journey You Want to Power', sub: 'Every package is tailored to match your target geographic markets, user acquisition KPIs, and budget.',
      cards: [
        { t: 'Plan 01 • City Partner', d: 'Support one specific city (e.g. Kigali, Nairobi, or Lagos) and activate your product directly inside that market.' },
        { t: 'Plan 02 • East Africa Partner', d: 'Own the complete Kigali → Kampala → Nairobi cross-border corridor as official regional fintech partner.', highlight: true },
        { t: 'Plan 03 • Full Tour Partner', d: 'Lead partner across all 6 African cities with category exclusivity and private team AI masterclass.' }
      ],
      notes: 'Overview of the three flexible tiers: Single City Partner, Regional East Africa Partner, or Lead Full Tour Partner.'
    },
    {
      num: 12, cat: '09 • Plan 1 Breakdown', title: 'Plan 1: City Partner Scope', sub: 'Select one tour city and support at least 3 agreed operational activities within that market.',
      cards: [
        { t: 'Kigali Logistics Status', d: 'Arrival flight and standard stay already locked in. Partner selects local transit, dining, or videography.' },
        { t: 'Commercial Advantage', d: 'Gain deep ground penetration in your priority market without the overhead of organizing a foreign event from scratch.', highlight: true }
      ],
      notes: 'Breakdown of Plan 1 (City Partner). Note that for Kigali, international flights and accommodations are already locked in by Tomide.'
    },
    {
      num: 13, cat: '10 • Deliverables', title: 'What the City Partner Receives', sub: 'Comprehensive deliverables across brand visibility, live product activation, media, and community data.',
      cards: [
        { t: '01 • Brand Visibility', d: 'Official City Partner status, logo on flyers, pull-up banner at venue, vlog mentions.' },
        { t: '02 • Product Activation', d: 'Live on-stage demo, native app use in vlogs, branded QR code & attendee perk.' },
        { t: '03 • Media & Content', d: '1 dedicated product video, 2+ Shorts/Reels, LinkedIn partnership post, photo pack.' },
        { t: '04 • Data & Leads', d: 'Consented attendee lead database, founder intros, post-event analytics dossier.', highlight: true }
      ],
      notes: 'All deliverables included in Plan 1 across Brand, Product, Content, and Community.'
    },
    {
      num: 14, cat: '11 • Narrative Blueprint', title: 'The Kigali Story Arc: “How I Moved & Paid with [Your Fintech]”', sub: 'A cohesive storyline showing seamless real-world utility at every step of Tomide’s visit.',
      cards: [
        { t: 'Scene 01 • Arrival', d: 'Landing at Kigali International Airport, paying for local transport & hotel check-in via partner card.' },
        { t: 'Scene 02 • Workshop', d: 'Presenting to 70+ builders at Norrsken Kigali, showing how AI businesses automate cross-border collections.' },
        { t: 'Scene 03 • Ecosystem', d: 'Hosting a dinner with top Rwandan tech founders, splitting the bill and paying in local currency.', highlight: true }
      ],
      notes: 'Walk the prospect through what a live Kigali vlog looks like from airport arrival to stage demo.'
    },
    {
      num: 15, cat: '12 • Regional Package', title: 'Plan 2: East Africa Regional Partner', sub: 'Power the complete multi-country corridor across Rwanda, Uganda, and Kenya.',
      cards: [
        { t: 'Corridor Coverage', d: 'Kigali, Kampala & Nairobi. Support selected transit and stay expenses across all 3 countries.' },
        { t: 'Headline Commitment', d: 'Cover the return flight from Nairobi or accommodation in Kenya to secure full regional category exclusivity.', highlight: true }
      ],
      notes: 'Plan 2 covers the entire East Africa corridor: Kigali -> Kampala -> Nairobi. High relevance for fintechs licensed in Kenya, Uganda, and Rwanda.'
    },
    {
      num: 16, cat: '13 • Regional Deliverables', title: 'East Africa Partner Benefits', sub: 'Everything in City Partner plan plus regional exclusivity, 3 vlogs, 6 shorts, and dual-city lead access.',
      cards: [
        { t: 'Regional Exclusivity', d: 'Sole fintech sponsor across Kigali, Kampala, and Nairobi tour marketing.', highlight: true },
        { t: 'Dedicated Media Series', d: '3 high-production vlogs + 6 short-form assets exploring cross-border money transfer.' },
        { t: 'Dual City Founder Leads', d: 'Consented attendee databases from both Kigali and Nairobi workshops (200+ vetted founders).' }
      ],
      notes: 'Category exclusivity in East Africa, 3 dedicated product videos, 6 shorts, and dual event floor presence.'
    },
    {
      num: 17, cat: '14 • Regional Story Arc', title: 'One Financial Product Across Three Countries', sub: 'Demonstrate real cross-border resilience as Tomide travels across East Africa.',
      cards: [
        { t: 'Border Transit Moments', d: 'Exchanging currency at the Rwanda-Uganda border, paying merchants in Kampala via app.' },
        { t: 'Solving Founder Pain', d: 'African founders struggle with cross-border payments. Seeing an operator solve it live builds instant trust.', highlight: true }
      ],
      notes: 'The narrative power of cross-border commerce: showing a user converting RWF to UGX to KES seamlessly without bank delays.'
    },
    {
      num: 18, cat: '15 • Flagship Package', title: 'Plan 3: Lead Full Tour Partner', sub: 'Power the complete 6-city Pan-African tour: Kigali, Kampala, Nairobi, Lagos, Cotonou, and Accra.',
      cards: [
        { t: 'Headline Commitment', d: 'Support Tomide’s Accra finale flight & stay, plus selected regional transit across the 6 ecosystems.', highlight: true },
        { t: 'Title Positioning', d: '“AI GTM Africa in Partnership with [Your Company]” top-tier billing on all marketing, stage, and press.' }
      ],
      notes: 'The flagship sponsorship tier: Lead Partner status across all 6 cities, full tour category exclusivity, and headline credit.'
    },
    {
      num: 19, cat: '16 • Full Tour Deliverables', title: 'Full Tour Partner Deliverables Matrix', sub: 'Pan-African title exclusivity, 5+ episodic vlogs, 12+ shorts, and the complete 500+ founder lead database.',
      cards: [
        { t: 'Pan-African Exclusivity', d: '100% category exclusivity across all 6 cities. No competing financial brands permitted.', highlight: true },
        { t: 'Docuseries Media Engine', d: '5+ dedicated YouTube vlogs + 12+ shorts distributed to 47k+ LinkedIn and 10k+ WhatsApp.' },
        { t: 'Full Tour Lead Vault', d: 'Consented database of 500+ top African founders, CEOs, and growth leaders across East & West Africa.' }
      ],
      notes: 'Summarize the complete suite of deliverables for the Lead Partner.'
    },
    {
      num: 20, cat: '17 • Exclusive Bonus', title: 'Private Executive Masterclass: AI & GTM Systems', sub: 'Exclusive value-add for Lead Tour Partner: A dedicated live masterclass for your growth, marketing, and sales team.',
      cards: [
        { t: 'Masterclass Topic', d: '“How to Use AI & GTM Systems to Scale Users & B2B Revenue” tailored to your Q4 2026 expansion roadmap.' },
        { t: 'Core Modules Covered', d: '• AI-powered lead qualification & outbound\n• High-converting GTM positioning for B2B\n• Community distribution & referral loops', highlight: true }
      ],
      notes: 'High-value sweetener: Tomide delivers a private masterclass for the partner\'s internal marketing/sales team on AI customer acquisition.'
    },
    {
      num: 21, cat: '18 • Evergreen Media', title: 'Content That Continues Delivering Long After Events', sub: 'Every piece of tour content is designed for long-term discovery, reuse, and paid ad amplification.',
      cards: [
        { t: 'City Travel Vlogs', d: 'High-production YouTube travel and ecosystem docuseries.' },
        { t: 'Short-Form Reels', d: 'Bite-sized tactical app use clips on IG & YouTube Shorts.' },
        { t: 'Executive Posts', d: 'Thought leadership breakdowns on LinkedIn (47k+ reach).' },
        { t: 'Ad Reuse Rights', d: 'Full rights for your team to run paid ads using tour assets.', highlight: true }
      ],
      notes: 'Highlight the evergreen nature of the content. These videos and case studies will continue generating signups for months after the tour ends.'
    },
    {
      num: 22, cat: '19 • Conversion Architecture', title: 'From Brand Impressions to Active Product Adoption', sub: 'Clear, friction-free conversion triggers built directly into both physical workshops and digital media.',
      cards: [
        { t: 'Branded QR Codes', d: 'On stage slides & attendee tables for instant mobile app downloads.' },
        { t: 'Exclusive Attendee Perks', d: 'Special fee discounts or welcome balances for verified attendees.' },
        { t: 'Direct Founder Intros', d: 'Direct warm introductions to high-volume cross-border businesses.' },
        { t: 'Consented Lead Vault', d: 'Full attendee database for post-event sales follow-up.', highlight: true }
      ],
      notes: 'Map out the concrete conversion funnel from impressions to active app users and B2B demos.'
    },
    {
      num: 23, cat: '20 • Accountability', title: 'Comprehensive Post-Activation Dossier', sub: 'Complete transparency on media performance, audience engagement, and lead attribution.',
      cards: [
        { t: 'Quantitative Metrics', d: '• Video views, watch hours & retention\n• LinkedIn post impressions & shares\n• QR code scans & referral link clicks\n• Verified workshop attendance numbers' },
        { t: 'Qualitative Insights', d: '• On-ground user feedback & objection notes\n• High-resolution photo asset repository\n• Strategic African market recommendations', highlight: true }
      ],
      notes: 'Transparency and reporting: what data the partner receives in their post-activation dossier.'
    },
    {
      num: 24, cat: '21 • Next Steps', title: 'Simple, Streamlined Onboarding', sub: 'Customize the exact parameters that align with your growth objectives in 3 easy steps:',
      cards: [
        { t: 'Step 01: Select Tier', d: 'Choose City Partner, East Africa Partner, or Lead Full Tour Partner based on priorities.' },
        { t: 'Step 02: Pick Expenses', d: 'Identify the specific transit, stay, or production items your company will cover.' },
        { t: 'Step 03: Define CTA', d: 'Provide your referral link, custom perk, or QR code destination for workshop attendees.', highlight: true }
      ],
      notes: 'Closing step: The sponsor selects their preferred tier, targets, and expenses. Fast contract execution.'
    },
    {
      num: 25, cat: '22 • Strategic Choice', title: 'Which Part of the Journey Will You Power?', sub: 'The tour begins October 8 in Kigali. Category exclusivity is strictly first-come, first-served.',
      cards: [
        { t: 'Option A: One City', d: 'Ground penetration and direct lead capture in one target African capital.' },
        { t: 'Option B: East Africa', d: 'Cross-border dominance across Kigali, Kampala & Nairobi.', highlight: true },
        { t: 'Option C: Full African Tour', d: 'Pan-African title sponsorship across all 6 tech ecosystems.' }
      ],
      notes: 'Strong closing summary. Remind them that Kigali is already in motion for October 8th, so slots must be finalized quickly.'
    },
    {
      num: 26, cat: '23 • Closing Lockup', title: 'AI GTM Africa × [Your Fintech]', sub: 'Kigali • Kampala • Nairobi • Lagos • Cotonou • Accra',
      closing: true,
      notes: 'Executive closing slide. Direct contact details and partnership lockup.'
    }
  ];

  remainingSlides.forEach(sData => {
    const slide = pres.addSlide();
    slide.background = { color: BG_COLOR };
    addHeader(slide, sData.cat, 'AI GTM AFRICA');

    slide.addText(sData.title, {
      x: 0.8, y: 1.1, w: 11.5, h: 0.6,
      fontFace: FONT_DISPLAY, fontSize: 24, bold: true, color: TEXT_WHITE
    });

    slide.addText(sData.sub, {
      x: 0.8, y: 1.7, w: 11.0, h: 0.5,
      fontFace: FONT_BODY, fontSize: 13, color: TEXT_MUTED
    });

    if (sData.closing) {
      slide.addShape(pres.ShapeType.roundRect, {
        x: 2.5, y: 2.6, w: 8.33, h: 3.5,
        fill: { color: CARD_HIGHLIGHT },
        line: { color: CRIMSON, width: 2 },
        rectRadius: 0.15
      });

      slide.addText('Tomide Williams', {
        x: 2.9, y: 3.0, w: 7.5, h: 0.5,
        fontFace: FONT_DISPLAY, fontSize: 24, bold: true, color: TEXT_WHITE
      });
      slide.addText('Founding GTM Lead & AI Practitioner', {
        x: 2.9, y: 3.5, w: 7.5, h: 0.3,
        fontFace: FONT_BODY, fontSize: 13, color: GOLD
      });

      slide.addText('📧 hello@tomidewilliams.com\n📱 +234 902 563 1654\n🌐 www.aigtmafrica.xyz', {
        x: 2.9, y: 4.1, w: 7.5, h: 1.5,
        fontFace: FONT_BODY, fontSize: 14, color: TEXT_WHITE, lineSpacing: 24
      });
    } else if (sData.split) {
      // Split 2-column layout
      slide.addShape(pres.ShapeType.roundRect, {
        x: 0.8, y: 2.4, w: 5.6, h: 4.0,
        fill: { color: CARD_BG },
        line: { color: '25252A', width: 1 },
        rectRadius: 0.1
      });
      slide.addText(sData.left.title, {
        x: 1.1, y: 2.6, w: 5.0, h: 0.3,
        fontFace: FONT_BODY, fontSize: 10, bold: true, color: CRIMSON_BRIGHT
      });
      slide.addText(sData.left.items.map(i => `✓ ${i}`).join('\n\n'), {
        x: 1.1, y: 3.0, w: 5.0, h: 3.0,
        fontFace: FONT_BODY, fontSize: 12, color: TEXT_WHITE, lineSpacing: 20
      });

      slide.addShape(pres.ShapeType.roundRect, {
        x: 6.8, y: 2.4, w: 5.6, h: 4.0,
        fill: { color: CARD_HIGHLIGHT },
        line: { color: CRIMSON, width: 1.5 },
        rectRadius: 0.1
      });
      slide.addText(sData.right.title, {
        x: 7.1, y: 2.6, w: 5.0, h: 0.3,
        fontFace: FONT_BODY, fontSize: 10, bold: true, color: GOLD
      });
      slide.addText(sData.right.items.map(i => `■ ${i}`).join('\n\n'), {
        x: 7.1, y: 3.0, w: 5.0, h: 3.0,
        fontFace: FONT_BODY, fontSize: 12, color: TEXT_WHITE, lineSpacing: 20
      });
    } else if (sData.cards) {
      const numCards = sData.cards.length;
      if (numCards === 2) {
        sData.cards.forEach((c, idx) => {
          const xPos = 0.8 + idx * 6.0;
          slide.addShape(pres.ShapeType.roundRect, {
            x: xPos, y: 2.4, w: 5.7, h: 4.0,
            fill: { color: c.highlight ? CARD_HIGHLIGHT : CARD_BG },
            line: { color: c.highlight ? CRIMSON : '25252A', width: c.highlight ? 1.5 : 1 },
            rectRadius: 0.1
          });
          slide.addText(c.t, {
            x: xPos + 0.3, y: 2.7, w: 5.1, h: 0.5,
            fontFace: FONT_DISPLAY, fontSize: 18, bold: true, color: TEXT_WHITE
          });
          slide.addText(c.d, {
            x: xPos + 0.3, y: 3.3, w: 5.1, h: 2.8,
            fontFace: FONT_BODY, fontSize: 13, color: TEXT_MUTED, lineSpacing: 22
          });
        });
      } else if (numCards === 3) {
        sData.cards.forEach((c, idx) => {
          const xPos = 0.8 + idx * 3.98;
          slide.addShape(pres.ShapeType.roundRect, {
            x: xPos, y: 2.4, w: 3.75, h: 4.0,
            fill: { color: c.highlight ? CARD_HIGHLIGHT : CARD_BG },
            line: { color: c.highlight ? CRIMSON : '25252A', width: c.highlight ? 1.5 : 1 },
            rectRadius: 0.1
          });
          slide.addText(c.t, {
            x: xPos + 0.25, y: 2.7, w: 3.25, h: 0.6,
            fontFace: FONT_DISPLAY, fontSize: 16, bold: true, color: TEXT_WHITE
          });
          slide.addText(c.d, {
            x: xPos + 0.25, y: 3.4, w: 3.25, h: 2.7,
            fontFace: FONT_BODY, fontSize: 12, color: TEXT_MUTED, lineSpacing: 18
          });
        });
      } else if (numCards === 4) {
        sData.cards.forEach((c, idx) => {
          const xPos = 0.8 + idx * 2.98;
          slide.addShape(pres.ShapeType.roundRect, {
            x: xPos, y: 2.4, w: 2.78, h: 4.0,
            fill: { color: c.highlight ? CARD_HIGHLIGHT : CARD_BG },
            line: { color: c.highlight ? CRIMSON : '25252A', width: c.highlight ? 1.5 : 1 },
            rectRadius: 0.1
          });
          slide.addText(c.t, {
            x: xPos + 0.2, y: 2.6, w: 2.38, h: 0.6,
            fontFace: FONT_DISPLAY, fontSize: 14, bold: true, color: TEXT_WHITE
          });
          slide.addText(c.d, {
            x: xPos + 0.2, y: 3.3, w: 2.38, h: 2.8,
            fontFace: FONT_BODY, fontSize: 11, color: TEXT_MUTED, lineSpacing: 16
          });
        });
      }
    }

    addFooter(slide, sData.num);
    if (sData.notes) slide.addNotes(sData.notes);
  });

  const outPath = path.join(__dirname, 'AI_GTM_Africa_Partnership_Proposal.pptx');
  await pres.writeFile({ fileName: outPath });
  console.log('SUCCESS: PowerPoint PPTX Deck created at:', outPath);
}

buildDeck().catch(e => {
  console.error('Build Deck Error:', e);
  process.exit(1);
});
