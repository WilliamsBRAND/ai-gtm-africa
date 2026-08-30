import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ChevronLeft, ChevronRight, Menu, X, Mic, Armchair, Map, Lightbulb, Network} from 'lucide-react';
import './styles.css';
import TomidePage from './TomidePage';

const focusAreas = [
  {title:'AI',image:'/images/hero-conference.png',position:'center 44%',points:['Find the AI use cases that create real business value.','Automate repetitive work and remove operational bottlenecks.','Use AI to improve research, analysis and decision-making.','Build useful AI workflows across the business.','Choose the right tools without chasing every new platform.','Move from experiments to practical adoption.']},
  {title:'GO-TO-MARKET',image:'/images/audience.jpg',position:'center 38%',points:['Define the market and customers you want to reach.','Sharpen your positioning and make the value clear.','Build a practical route from attention to revenue.','Create demand before and after launch.','Align marketing, sales and customer experience.','Identify which channels are actually working.']},
  {title:'MARKETING',image:'/images/workshop.jpg',position:'center 42%',points:['Understand what your audience cares about.','Create stronger campaigns in less time.','Build repeatable content and distribution systems.','Use AI to research, plan and personalize messaging.','Turn customer insights into better marketing decisions.','Measure performance and improve what works.']},
  {title:'CUSTOMER ACQUISITION',image:'/images/hall.jpg',position:'center 44%',points:['Identify and reach more of the right customers.','Choose acquisition channels that fit your business.','Improve lead capture, qualification and follow-up.','Turn attention and enquiries into paying customers.','Build a consistent acquisition system.','Reduce wasted effort across the customer journey.']},
  {title:'SCALING',image:'/images/panel.jpg',position:'center 40%',points:['Turn working tactics into repeatable systems.','Document the processes that keep the business moving.','Remove the bottlenecks that slow growth down.',"Use technology to increase the team's capacity.",'Build operating rhythms that support expansion.','Scale what works without adding unnecessary complexity.']},
  {title:'EXECUTION',image:'/images/speaker.jpg',position:'center 34%',points:['Choose the priorities that matter now.','Turn ideas from the event into an action plan.','Assign clear owners, timelines and next steps.','Test ideas quickly before investing heavily.','Measure progress and learn from the results.','Leave ready to put something into practice.']}
];
const programme = [
  ['PRACTICAL SESSIONS','Hear from people working through the realities of building and growing businesses today. The sessions focus on how AI and technology are changing marketing, customer acquisition, go-to-market and the way businesses work.'],
  ['BUSINESS HOT SEATS','Bring a challenge you are currently facing in your business. Get practical perspectives from experienced founders, business leaders and operators, and hear how they would approach the problem.'],
  ['AI GTM BLUEPRINT','Take the key lessons from the day and turn them into a practical plan. Look at your business across AI, go-to-market and growth, decide what needs attention and identify what you can start doing differently.'],
  ['REAL-WORLD INSIGHTS','Learn from people who are doing the work, not simply talking about it. Hear what they are trying, what is working, what is not and how they are using AI and better go-to-market strategies in their businesses.'],
  ['NETWORKING','Meet founders, marketers, business leaders and operators from different industries and markets. Build useful relationships, exchange ideas, find potential collaborators and meet people you can continue to learn from and work with after the event.']
];
const audienceRoles=['FOUNDERS','BUSINESS OWNERS','MARKETING LEADERS','SALES & COMMERCIAL LEADERS','PRODUCT LEADERS','GROWTH TEAMS','STARTUP TEAMS','BUSINESS DEVELOPMENT LEADERS','OPERATORS','CONSULTANTS & SERVICE BUSINESSES','ENTREPRENEURS','PEOPLE BUILDING WITH AI'];
const whyAttend=['Learn where AI can actually save you time and improve how your business works.','Find better ways to reach, attract and win customers.','Learn how other businesses are applying AI to marketing, sales, operations and growth.','Find opportunities to reduce repetitive work and get more done with the team you already have.','Improve how you take products, services and ideas to market.','Build more consistent ways to generate demand and acquire customers.','Understand which parts of your current growth process are worth improving, automating or replacing.','Learn from the experiences, mistakes and results of people doing the work.','Work through a real problem in your business instead of only listening to presentations.','Meet founders, operators and business leaders you can learn from, collaborate with or do business with.','Leave with ideas you can test immediately.'];
const takeaways=[
  'A clearer understanding of where AI can be useful in your business and where it probably cannot.',
  'Practical ways to improve how you market, sell and reach customers.',
  'A clearer view of what is slowing down growth in your business.',
  'Ideas for using AI to reduce repetitive work and improve how your team operates.',
  'New approaches to customer acquisition, demand generation and go-to-market.',
  'A practical plan for what to test, change or build next.',
  'Examples and lessons from people applying these ideas in real businesses.',
  'Useful relationships with founders, marketers, operators and business leaders.',
  'Questions and perspectives that help you make better growth decisions.',
  'A stronger sense of what to prioritise when you return to work.'
];
const cities = [
  ['NAIROBI','03 OCTOBER 2026','/images/audience.jpg','center 38%'],
  ['KIGALI','10 OCTOBER 2026','/images/hall.jpg','center 22%'],
  ['LAGOS','21 NOVEMBER 2026','/images/hero-conference.png','center 50%'],
  ['COTONOU','19 DECEMBER 2026','/images/speaker.jpg','center 30%'],
  ['ACCRA','29 DECEMBER 2026','/images/workshop.jpg','center 44%']
];
const fiveCities = [
  ['NAIROBI','Kenya','/images/cities/nairobi.jpg'],
  ['KIGALI','Rwanda','/images/cities/kigali.jpg'],
  ['LAGOS','Nigeria','/images/cities/lagos.jpg'],
  ['COTONOU','Benin','/images/cities/cotonou.jpg'],
  ['ACCRA','Ghana','/images/cities/accra.jpg']
];
const nav = [['The Event','#event'],['Focus','#focus'],['Why Attend','#why'],['About','#about'],['Cities','#cities']];

// WhatsApp for "Become a Partner" (click-to-chat). Number in international digits.
const WHATSAPP_NUMBER='2349025631654';
const WHATSAPP_MESSAGE="Hi Williams, I'd like to partner with you for AI GTM Africa.";
const WHATSAPP_URL=`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
const MEDIA_MESSAGE="Hi Williams, I'd like to help cover AI GTM Africa through photography and media.";
const MEDIA_WHATSAPP_URL=`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MEDIA_MESSAGE)}`;

const CITY_NAMES=fiveCities.map(([n])=>n);
const WHAT_YOU_DO=['Founder','Business Owner','Executive','Professional','Consultant','Investor','Creator','Student','Researcher','Community Builder','Other'];
const BUSINESS_TYPES=['Technology','Finance','Banking','Healthcare','Education','Agriculture','Energy','Professional Services','Consulting','Media & Entertainment','Retail & Consumer','Real Estate','Manufacturing','Logistics','Government & Public Sector','Nonprofit','Other'];
const HEAR_OPTIONS=['Tomide','Referral','Friend or Colleague','LinkedIn','WhatsApp','Event','Social Media','Other'];

// CTAs render as buttons that open the application form; "Become a Partner"
// opens WhatsApp. If an href is given, render an anchor instead.
function CTA({children='Get Your Seat', dark=false, onClick=null, href=null}) {
  const cls=`cta ${dark?'cta-dark':''}`;
  if(href) return <a className={cls} href={href} target="_blank" rel="noopener noreferrer">{children}<span aria-hidden="true" className="cta-arrow"/></a>;
  return <button type="button" className={cls} onClick={onClick}>{children}<span aria-hidden="true" className="cta-arrow"/></button>;
}

function ApplicationForm({form, onClose}){
  const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [phone,setPhone]=useState('');
  const [role,setRole]=useState(''); const [btype,setBtype]=useState('');
  const [city,setCity]=useState(''); const [sponsor,setSponsor]=useState(''); const [heard,setHeard]=useState('');
  const [done,setDone]=useState(false); const [err,setErr]=useState(''); const [submitting,setSubmitting]=useState(false);
  const firstRef=useRef(null);
  const onCloseRef=useRef(onClose); onCloseRef.current=onClose;
  const preset=form!=null&&form.city!=null?form.city:null;
  const presetName=preset!=null?CITY_NAMES[preset]:'';
  const cityIndex=city!==''?CITY_NAMES.indexOf(city):-1;
  const cityDate=cityIndex>=0?(cities[cityIndex]?.[1]||''):'';

  useEffect(()=>{
    if(form==null)return;
    const prev=document.body.style.overflow;document.body.style.overflow='hidden';
    setName('');setEmail('');setPhone('');setRole('');setBtype('');setSponsor('');setHeard('');
    setCity(preset==null?'':presetName);setDone(false);setErr('');setSubmitting(false);
    const t=setTimeout(()=>firstRef.current?.focus(),60);
    const onKey=ev=>{if(ev.key==='Escape')onCloseRef.current()};
    document.addEventListener('keydown',onKey);
    return()=>{document.body.style.overflow=prev;document.removeEventListener('keydown',onKey);clearTimeout(t)};
  },[form,preset,presetName]);

  if(form==null)return null;
  const submit=async ev=>{ev.preventDefault();setErr('');
    if(!name.trim()||!email.trim()||!phone.trim()||!role||!btype||!city||!heard||!sponsor){setErr('Please fill in all required fields.');return}
    setSubmitting(true);
    try{
      const response=await fetch('/api/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email,phone,city,role,industry:btype,heard,sponsor})});
      const result=await response.json().catch(()=>({}));
      if(!response.ok||!result.ok)throw new Error(result.error||'Registration could not be submitted.');
      setDone(true);
    }catch(error){setErr(error.message||'Registration could not be submitted. Please try again.')}finally{setSubmitting(false)}
  };
  const field=(label,req,children)=><label className="form-field"><span className="form-label">{label}{req&&<em> *</em>}</span>{children}</label>;

  return <div className="form-overlay" role="dialog" aria-modal="true" aria-label="AI GTM Africa application"
    onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
    <div className="form-panel">
      <button type="button" className="form-close" aria-label="Close application form" onClick={onClose}><X/></button>
      {done?(
        <div className="form-done">
          <p className="kicker">AI GTM AFRICA</p>
          <h3>REGISTRATION RECEIVED</h3>
          <p className="form-done-text">Thank you for registering your interest in AI GTM Africa.</p>
          {cityDate&&<p className="form-done-date">{city} · {cityDate}</p>}
          <p className="form-done-note">Due to the fact that we are taking only 20 to 30 people per city, we will definitely reach out to you to let you know if you make the cut.</p>
          <p className="form-done-note">Your registration has been received and our team will review the details. <strong>If your registration is selected, we’ll contact you directly with your confirmation and the event details.</strong></p>
          <p className="form-done-note">We look forward to connecting with you.</p>
          <p className="form-signoff">AI GTM AFRICA</p>
          <button type="button" className="cta form-back" onClick={onClose}>Back to Website <span aria-hidden="true" className="cta-arrow"/></button>
        </div>
      ):(
        <form onSubmit={submit} noValidate>
          <p className="kicker">AI GTM AFRICA</p>
          <h3>REGISTRATION</h3>
          {presetName&&<div className="form-preset">You are applying for the <b>{presetName}</b> session{cityDate?` · ${cityDate}`:''}.</div>}
          {cityDate&&<div className="form-note">The venue and full details for {city} will be communicated via email to those who make it onto the attendee list.</div>}
          {field('Full Name',true,<input ref={firstRef} type="text" value={name} onChange={e=>setName(e.target.value)} autoComplete="name" placeholder="Your name" required/>)}
          {field('Email Address',true,<input type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" inputMode="email" placeholder="Your email" required/>)}
          {field('Phone Number',true,<input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} autoComplete="tel" inputMode="tel" placeholder="Your phone number" required/>)}
          {field('City',true,<select value={city} onChange={e=>setCity(e.target.value)} required><option value="" disabled>Select city</option>{CITY_NAMES.map(n=><option key={n} value={n}>{n}</option>)}</select>)}
          {field('What Do You Do?',true,<select value={role} onChange={e=>setRole(e.target.value)} required><option value="" disabled>Select an option</option>{WHAT_YOU_DO.map(o=><option key={o} value={o}>{o}</option>)}</select>)}
          {field('Business / Industry',true,<select value={btype} onChange={e=>setBtype(e.target.value)} required><option value="" disabled>Select your industry</option>{BUSINESS_TYPES.map(o=><option key={o} value={o}>{o}</option>)}</select>)}
          {field('How Did You Hear About Us?',true,<select value={heard} onChange={e=>setHeard(e.target.value)} required><option value="" disabled>Select an option</option>{HEAR_OPTIONS.map(o=><option key={o} value={o}>{o}</option>)}</select>)}
          <div className="form-field"><span className="form-label">Would You Like to Sponsor AI GTM Africa?<em> *</em></span>
            <div className="form-choice">{['Yes','No'].map(v=><label key={v} className={sponsor===v?'chosen':''}><input type="radio" name="sponsor" value={v} checked={sponsor===v} onChange={()=>setSponsor(v)}/>{v}</label>)}</div>
          </div>
          {err&&<p className="form-error">{err}</p>}
          <button type="submit" className="cta" disabled={submitting}>{submitting?'Submitting...':'Submit Registration'} <span aria-hidden="true" className="cta-arrow"/></button>
        </form>
      )}
    </div>
  </div>;
}


function AnimatedStat({from=0,to,rangeEnd,label}){
  const ref=useRef(null); const [value,setValue]=useState(from); const [endValue,setEndValue]=useState(from);
  const final=rangeEnd!=null?`${to}–${rangeEnd}`:to;
  useEffect(()=>{const node=ref.current;if(!node)return;const observer=new IntersectionObserver(([entry])=>{if(!entry.isIntersecting)return;observer.disconnect();if(matchMedia('(prefers-reduced-motion: reduce)').matches){setValue(to);setEndValue(rangeEnd??to);return}const start=performance.now(),duration=1100;const tick=now=>{const progress=Math.min((now-start)/duration,1),eased=1-Math.pow(1-progress,3);setValue(Math.round(from+(to-from)*eased));setEndValue(Math.round(from+((rangeEnd??to)-from)*eased));if(progress<1)requestAnimationFrame(tick)};requestAnimationFrame(tick)},{threshold:.45});observer.observe(node);return()=>observer.disconnect()},[from,to,rangeEnd]);
  return <div ref={ref} className="event-stat"><span className="event-stat-number" aria-label={`${to} ${label}`}>{rangeEnd!=null?`${value}–${endValue}`:value}</span><span className="event-stat-label">{label}</span><span aria-hidden="true" className="event-stat-line"/></div>
}

function Header({onRegister}){
  const [open,setOpen]=useState(false);
  const [scrolled,setScrolled]=useState(false);
  const navRef=useRef(null);
  useEffect(()=>{
    if(!open)return;
    const prevOverflow=document.body.style.overflow;
    document.body.style.overflow='hidden';
    const onKey=ev=>{if(ev.key==='Escape')setOpen(false)};
    document.addEventListener('keydown',onKey);
    return()=>{document.body.style.overflow=prevOverflow;document.removeEventListener('keydown',onKey)};
  },[open]);
  useEffect(()=>{const onScroll=()=>setScrolled(window.scrollY>10);onScroll();window.addEventListener('scroll',onScroll,{passive:true});return()=>window.removeEventListener('scroll',onScroll)},[]);
  return <header id="top" className={`nav${scrolled?' scrolled':''}`}><a href="#top" className="brand" onClick={()=>setOpen(false)}>AI GTM <b>AFRICA</b></a>
    <nav ref={navRef} id="menu" className={open?'open':''} aria-label="Main navigation">{nav.map(([n,h])=><a key={n} href={h} onClick={()=>setOpen(false)}>{n}</a>)}<CTA onClick={()=>{setOpen(false);onRegister()}}/></nav>
    <button className="menu" aria-expanded={open} aria-controls="menu" aria-label={open?'Close menu':'Open menu'} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
  </header>
}

function App(){
  const [focus,setFocus]=useState(0); const [city,setCity]=useState(0);
  const [form,setForm]=useState(null);
  const [loading,setLoading]=useState(true);
  const programmeRef=useRef(null); const fiveCitiesRef=useRef(null);
  const [prog,setProg]=useState(0); const [fcIdx,setFcIdx]=useState(0);
  const dotRefs=useRef([]);

  useEffect(()=>{const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('visible')),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>io.observe(el));return()=>io.disconnect()},[]);

  useEffect(()=>{
    const t=setTimeout(()=>{setLoading(false);document.body.classList.add('loaded')},950);
    return()=>{clearTimeout(t);document.body.classList.remove('loaded')};
  },[]);


  // Focus tabs: arrow/Home/End keyboard with roving tabindex
  const onFocusKey=(e)=>{
    const count=focusAreas.length;
    const move=n=>{const next=n<0?0:n>=count?count-1:n;setFocus(next);dotRefs.current[next]?.focus()};
    if(e.key==='ArrowRight'||e.key==='ArrowDown'){e.preventDefault();move(focus+1)}
    else if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();move(focus-1)}
    else if(e.key==='Home'){e.preventDefault();move(0)}
    else if(e.key==='End'){e.preventDefault();move(count-1)}
  };

  // Programme slider progress + endpoints
  const onProgrammeScroll=()=>{const el=programmeRef.current;if(!el)return;const max=el.scrollWidth-el.clientWidth;const p=max>0?(el.scrollLeft/max):0;const idx=Math.round(p*(programme.length-1));setProg(Math.min(Math.max(idx,0),programme.length-1))};
  const slideProgramme=direction=>{const el=programmeRef.current;if(!el)return;el.scrollBy({left:direction*el.clientWidth*.72,behavior:'smooth'})};

  // Room slider (horizontal, appears as a strip on small screens)

  // Five Cities slider: scroll progress + endpoint disabled states
  const onFiveCitiesScroll=()=>{const el=fiveCitiesRef.current;if(!el)return;const max=el.scrollWidth-el.clientWidth;const idx=max>0?Math.round((el.scrollLeft/max)*(fiveCities.length-1)):0;setFcIdx(Math.min(Math.max(idx,0),fiveCities.length-1))};
  const slideFiveCities=direction=>{const el=fiveCitiesRef.current;if(!el)return;el.scrollBy({left:direction*el.clientWidth*.75,behavior:'smooth'})};

  // Auto-slide Five Cities
  useEffect(()=>{
    const el=fiveCitiesRef.current;if(!el)return;
    let hovered=false;
    const onEnter=()=>{hovered=true};const onLeave=()=>{hovered=false};
    el.addEventListener('mouseenter',onEnter);el.addEventListener('mouseleave',onLeave);
    const timer=setInterval(()=>{
      if(hovered)return;
      const max=el.scrollWidth-el.clientWidth;
      if(max<=5)return;
      if(el.scrollLeft>=max-20){el.scrollTo({left:0,behavior:'smooth'})}
      else{el.scrollBy({left:el.clientWidth*.75,behavior:'smooth'})}
    },3800);
    return()=>{clearInterval(timer);el.removeEventListener('mouseenter',onEnter);el.removeEventListener('mouseleave',onLeave)};
  },[]);

  // Auto-slide Programme (What You Should Expect)
  useEffect(()=>{
    const el=programmeRef.current;if(!el)return;
    let hovered=false;
    const onEnter=()=>{hovered=true};const onLeave=()=>{hovered=false};
    el.addEventListener('mouseenter',onEnter);el.addEventListener('mouseleave',onLeave);
    const timer=setInterval(()=>{
      if(hovered)return;
      const max=el.scrollWidth-el.clientWidth;
      if(max<=5)return;
      if(el.scrollLeft>=max-20){el.scrollTo({left:0,behavior:'smooth'})}
      else{el.scrollBy({left:el.clientWidth*.72,behavior:'smooth'})}
    },4200);
    return()=>{clearInterval(timer);el.removeEventListener('mouseenter',onEnter);el.removeEventListener('mouseleave',onLeave)};
  },[]);

  const openRegistration=(cityIndex=null)=>setForm({city:cityIndex});

  return <><Header onRegister={()=>openRegistration()}/>{loading&&<div className="loader" aria-hidden="true"><span>AI GTM AFRICA<i/></span></div>}<main>
    <section id="top" className="hero dark">
      <div className="hero-visual">
        <div className="hero-img"><img src="/images/hero-conference.png" alt="African technology leaders at a conference"/></div>
        <div className="aperture a1"/><div className="aperture a2"/>
      </div>
      <div className="hero-copy">
        <p className="kicker hero-1">AI. GO-TO-MARKET. GROWTH.</p>
        <h1 className="hero-2">USE AI TO BUILD,<br/>GROW AND SCALE.</h1>
        <div className="intro hero-3"><p>Spend a day with founders, marketers, business leaders and operators learning how to use AI to build better businesses, reach more customers and scale what works.</p></div>
        <div className="hero-cta hero-4"><CTA onClick={()=>openRegistration()}/></div>
      </div>
    </section>

    <section id="five-cities" className="five-cities light">
      <div className="section-heading reveal"><p className="kicker">2026 TOUR</p><h2>FIVE CITIES.<br/>ONE EXPERIENCE.</h2><div className="slider-controls"><div className="slider-progress" aria-hidden="true"><span>{String(fcIdx+1).padStart(2,'0')}</span><em>/ {String(fiveCities.length).padStart(2,'0')}</em></div><button aria-label="Previous city" disabled={fcIdx===0} onClick={()=>slideFiveCities(-1)}><ChevronLeft/></button><button aria-label="Next city" disabled={fcIdx===fiveCities.length-1} onClick={()=>slideFiveCities(1)}><ChevronRight/></button></div></div>
      <div className="five-cities-track reveal" ref={fiveCitiesRef} onScroll={onFiveCitiesScroll} tabIndex="0" aria-label="Five event cities, horizontal slider">{fiveCities.map(([name,country,img],i)=><figure key={name} className="five-city"><img src={img} alt={`${name}, ${country} skyline`}/><figcaption><span className="five-city-index">0{i+1}</span><div><span className="five-city-name">{name}</span><span className="five-city-country">{country}</span></div><a href="#cities" className="five-city-see">See Cities &amp; Dates <span aria-hidden="true" className="cta-arrow"/></a></figcaption></figure>)}</div>
    </section>

    <section id="event" className="event-intro dark section">
      <div className="event-heading reveal"><p className="kicker">EVENT FORMAT</p><h2>ONE DAY. A FOCUSED ROOM.</h2></div>
      <div className="event-stats reveal" role="list"><AnimatedStat to={6} label="HOURS"/><AnimatedStat to={20} rangeEnd={30} label="PEOPLE"/><AnimatedStat to={5} label="CITIES"/></div>
    </section>

    <section id="focus" className="focus section light">
      <div className="section-heading reveal"><p className="kicker">SIX KEY FOCUS AREAS</p><h2>OUR CORE FOCUS AREAS</h2></div>
      <div className="focus-stage reveal">
        <div className="focus-list" role="tablist" aria-label="Six key focus areas" onKeyDown={onFocusKey}>{focusAreas.map((item,i)=><button key={item.title} id={`focus-tab-${i}`} ref={el=>dotRefs.current[i]=el} className={focus===i?'active':''} tabIndex={focus===i?0:-1} onClick={()=>setFocus(i)} role="tab" aria-selected={focus===i} aria-controls={`focus-panel-${i}`}><span>0{i+1}</span>{item.title}</button>)}</div>
        <div className="focus-panel" id={`focus-panel-${focus}`} role="tabpanel" aria-labelledby={`focus-tab-${focus}`} key={`panel-${focus}`}>
          <div className="focus-detail"><div className="focus-points">{focusAreas[focus].points.map((point,i)=><p key={point}><span className="point-arrow" aria-hidden="true"/>{point}</p>)}</div></div>
        </div>
      </div>
    </section>

    <section className="room-editorial dark section">
      <div className="room-editorial-heading reveal"><p className="kicker">WHO IT'S FOR</p><h2>THE PEOPLE IN THE ROOM</h2></div>
      <div className="room-editorial-layout">
        <div className="room-editorial-list">
          {audienceRoles.map((role,i)=><p className="reveal" style={{transitionDelay:`${(i%6)*70}ms`}} key={role}><span>{String(i+1).padStart(2,'0')}</span>{role}</p>)}
        </div>
        <div className="room-editorial-image reveal"><img src="/images/panel.jpg" alt="African business leaders in conversation at a technology event"/><span>AI GTM AFRICA / 2026</span></div>
      </div>
    </section>

    <section className="programme section light"><div className="section-heading reveal"><p className="kicker">EVENT STRUCTURE</p><h2>WHAT YOU SHOULD EXPECT</h2><div className="slider-controls"><div className="slider-progress" aria-hidden="true"><span>{String(prog+1).padStart(2,'0')}</span><em>/ {String(programme.length).padStart(2,'0')}</em></div><button aria-label="Previous programme item" disabled={prog===0} onClick={()=>slideProgramme(-1)}><ChevronLeft/></button><button aria-label="Next programme item" disabled={prog===programme.length-1} onClick={()=>slideProgramme(1)}><ChevronRight/></button></div></div><div className="programme-grid reveal" ref={programmeRef} onScroll={onProgrammeScroll} tabIndex="0" aria-label="Horizontal programme list">{programme.map((p,i)=><article key={p[0]}><span>{String(i+1).padStart(2,'0')}</span>{i===0?<Mic aria-hidden="true"/>:i===1?<Armchair aria-hidden="true"/>:i===2?<Map aria-hidden="true"/>:i===3?<Lightbulb aria-hidden="true"/>:<Network aria-hidden="true"/>}<h3>{p[0]}</h3><p>{p[1]}</p></article>)}</div></section>

    <section id="why" className="why dark section"><div className="why-heading reveal"><p className="kicker">WHY ATTEND</p><h2>WHY YOU SHOULD BE HERE</h2></div><div className="why-layout"><div className="why-image reveal"><img src="/images/audience.jpg" alt="Business leaders exchanging ideas at an event"/><span>AI GTM AFRICA / 2026</span></div><div className="change-lines">{whyAttend.map((item,i)=><p className="reveal" style={{transitionDelay:`${(i%6)*70}ms`}} key={item}><span>{String(i+1).padStart(2,'0')}</span>{item}</p>)}</div></div></section>

    <section className="outcomes section light"><div className="section-heading reveal"><p className="kicker">WHAT YOU LEAVE WITH</p><h2>YOU WILL LEAVE WITH</h2></div><div className="outcome-layout"><div className="outcome-image reveal"><img src="/images/workshop.jpg" alt="Business leaders working through a practical session"/></div><div className="outcome-grid">{takeaways.map((item,i)=><p className="reveal" style={{transitionDelay:`${(i%6)*70}ms`}} key={item}><span>{String(i+1).padStart(2,'0')}</span>{item}</p>)}</div></div></section>

    <section className="vision dark section"><div className="section-heading reveal"><p className="kicker">OUR PURPOSE</p><h2>WHY AI GTM AFRICA EXISTS.</h2></div><div className="vision-layout"><div className="vision-block reveal" style={{transitionDelay:'80ms'}}><p className="kicker">OUR VISION</p><p className="vision-copy">A future where African businesses are not simply adopting AI, but using it to build better products and services, reach more customers, operate more effectively and compete in markets anywhere in the world.</p></div><div className="vision-block reveal" style={{transitionDelay:'180ms'}}><p className="kicker">OUR MISSION</p><p className="vision-copy">We bring founders, marketers, business leaders and operators together to learn how AI can be applied to real business problems, share what is working and build the knowledge, systems and relationships they need to grow.</p></div></div></section>

    <section id="about" className="about light"><div className="section-heading reveal"><p className="kicker">MEET TOMIDE</p><h2>CONVENER, AI GTM AFRICA</h2></div><div className="about-frame reveal"><div className="about-photo reveal" style={{transitionDelay:'100ms'}}><img src="/images/tomide-williams.jpg" alt="Tomide Williams, convener of AI GTM Africa"/><span>CONVENER, AI GTM AFRICA</span></div><div className="about-copy"><h3 className="reveal" style={{transitionDelay:'120ms'}}>TOMIDE WILLIAMS</h3><p className="about-lead reveal" style={{transitionDelay:'160ms'}}>Product marketing leader, AI and go-to-market practitioner, product builder and two-time TEDx speaker.</p><div className="about-bio reveal" style={{transitionDelay:'200ms'}}><p>Tomide has led launches that generated 3,000 qualified leads, 100 enrolments and 60x ROAS, and helped take an AI product to its first 1,000 users in three months.</p><p>His work brings together customer insight, positioning, acquisition and AI-powered systems to help businesses reach more customers and grow.</p></div><div className="reveal" style={{transitionDelay:'240ms'}}><a className="cta cta-dark" href="/tomide-williams">Explore Tomide's Work <span aria-hidden="true" className="cta-arrow"/></a></div></div></div></section>

    <section id="cities" className="cities dark"><div className="cities-bg" key={`bg-${city}`}><img src={cities[city][2]} style={{objectPosition:cities[city][3]}} alt={`${cities[city][0]} conference`}/></div><div className="cities-content reveal"><p className="kicker reveal">2026 CITIES &amp; DATES</p><h2 className="reveal" style={{transitionDelay:'60ms'}}>FIVE CITIES.<br/>ONE GROWING COMMUNITY.</h2><div className="city-switcher reveal" style={{transitionDelay:'120ms'}}><button aria-label="Previous city" disabled={city===0} onClick={()=>setCity((city+4)%5)}><ChevronLeft/></button><div><span>0{city+1} / 05</span><h3>{cities[city][0]}</h3><p>{cities[city][1]}</p></div><button aria-label="Next city" disabled={city===4} onClick={()=>setCity((city+1)%5)}><ChevronRight/></button></div><div className="reveal" style={{transitionDelay:'180ms'}}><CTA onClick={()=>openRegistration(city)}>Register Interest in {cities[city][0]}</CTA></div></div></section>

    <section className="final-cta light"><div className="reveal"><p className="kicker reveal">JOIN US</p><h2 className="reveal" style={{transitionDelay:'60ms'}}>BUILD. GROW. SCALE.</h2><p className="reveal" style={{transitionDelay:'120ms'}}>If you are building, marketing, launching, growing or scaling a business, come be part of the conversation.</p><div className="reveal" style={{transitionDelay:'180ms'}}><CTA dark onClick={()=>openRegistration()}>Register Your Interest</CTA><CTA dark href={WHATSAPP_URL}>Become a Partner</CTA></div></div></section>

  </main><footer id="footer" className="footer dark"><div className="footer-brand reveal"><a className="brand" href="#top">AI GTM <b>AFRICA</b></a><p>AI. GO-TO-MARKET. GROWTH.</p></div><div className="footer-group reveal" style={{transitionDelay:'70ms'}}><p className="footer-label">EXPLORE</p>{nav.map(([n,h])=><a key={n} href={h}>{n}</a>)}</div><div className="footer-group reveal" style={{transitionDelay:'140ms'}}><p className="footer-label">ATTEND &amp; PARTNER</p><button type="button" className="footer-link" onClick={()=>openRegistration()}>Register Your Interest <span aria-hidden="true">→</span></button><a className="footer-link" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Become a Partner <span aria-hidden="true">↗</span></a><a className="footer-link" href={MEDIA_WHATSAPP_URL} target="_blank" rel="noreferrer">Photography / Media Partnership <span aria-hidden="true">↗</span></a></div><div className="footer-group reveal" style={{transitionDelay:'210ms'}}><p className="footer-label">FOLLOW</p><a className="footer-link" href="https://www.linkedin.com/in/tomidewill/" target="_blank" rel="noreferrer">LinkedIn <span aria-hidden="true">↗</span></a><a className="footer-link" href="https://www.instagram.com/tomidewilliams.ai/" target="_blank" rel="noreferrer">Instagram <span aria-hidden="true">↗</span></a><a className="footer-link" href="https://x.com/tomidewilliams" target="_blank" rel="noreferrer">X <span aria-hidden="true">↗</span></a></div><p className="footer-copyright reveal" style={{transitionDelay:'280ms'}}>© 2026 AI GTM Africa</p></footer><ApplicationForm form={form} onClose={()=>setForm(null)}/></>
}
const isTomidePage = window.location.pathname.replace(/\/$/, '') === '/tomide-williams';

document.title = isTomidePage ? 'Tomide Williams | AI GTM Africa' : 'AI GTM Africa 2026';

createRoot(document.getElementById('root')).render(isTomidePage ? <TomidePage /> : <App />);
