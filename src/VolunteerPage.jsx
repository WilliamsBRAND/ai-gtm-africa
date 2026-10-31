import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle } from 'lucide-react';
import { useEditionPage, MAIN_SITE } from './edition/kit';
import options from './volunteer-options.json';
import './volunteer.css';
const VOLUNTEER_WHATSAPP = 'https://chat.whatsapp.com/B7b5Nzaxm8X0AYr9fjS1F2?s=cl&p=a&iam=2';

export default function VolunteerPage() {
  useEditionPage();
  const [state, setState] = useState('idle');
  const [error, setError] = useState('');
  async function submit(event) {
    event.preventDefault();
    if (state === 'sending') return;
    const data = Object.fromEntries(new FormData(event.currentTarget));
    setState('sending'); setError('');
    try {
      const response = await fetch('/api/volunteer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || 'We couldn’t submit your application. Please try again.');
      setState('done');
      window.location.assign(VOLUNTEER_WHATSAPP);
    } catch (e) { setError(e.message || 'Check your connection and try again.'); setState('idle'); }
  }
  return <div className="nb vol-page">
    <header className="vol-header"><a href={MAIN_SITE} className="vol-brand">AI GTM Africa <span>VOLUNTEERS</span></a><a href={MAIN_SITE} className="vol-back">Visit website <ArrowUpRight size={16} /></a></header>
    <main className="vol-main">
      <div className="vol-intro"><p className="nb-eyebrow">Join the team</p><h1>Help make it <em>happen.</em></h1><p>Bring your skills. Meet good people. Help us create a great AI GTM Africa experience.</p></div>
      {state === 'done' ? <section className="vol-success" role="status"><CheckCircle size={40} /><h2>Application received.</h2><p>Opening the volunteer WhatsApp group… If it doesn’t open, use the button below.</p><a href={VOLUNTEER_WHATSAPP} className="nb-btn nb-btn-dark">Join the WhatsApp group</a></section> : <form className="vol-form" onSubmit={submit}>
        <fieldset disabled={state === 'sending'}>
          <div className="vol-grid">
            <label>Full name<input name="name" autoComplete="name" required maxLength={120} /></label>
            <label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
            <label>WhatsApp number<input name="phone" type="tel" autoComplete="tel" required maxLength={40} placeholder="Include country code" /></label>
            <label>Where are you based?<input name="location" autoComplete="address-level2" required maxLength={160} placeholder="City, country" /></label>
            <label>Which edition?<select aria-label="Which edition?" name="edition" required defaultValue=""><option value="" disabled>Choose an edition</option>{options.editions.map(v=><option key={v}>{v}</option>)}</select><span className="vol-hint">Choose the city edition you’d like to support.</span></label>
            <label>Preferred volunteer role<select aria-label="Preferred volunteer role" name="role" required defaultValue=""><option value="" disabled>Choose a role</option>{options.roles.map(v=><option key={v}>{v}</option>)}</select></label>
          </div>
          <label>Availability<select aria-label="Availability" name="availability" required defaultValue=""><option value="" disabled>Choose your availability</option>{options.availability.map(v=><option key={v}>{v}</option>)}</select></label>
          <label>Why join us?<textarea name="experience" rows={3} required maxLength={2000} placeholder="Tell us why you’d like to volunteer and why we should consider you. Add a link to an event you’ve volunteered at, if you have one." /></label>
          <div className="vol-trap" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
          <label className="vol-consent"><input name="consent" type="checkbox" required value="yes" /><span>I agree to be contacted about my volunteer application.</span></label>
          <p className="vol-hint">Submitting this form doesn’t confirm a volunteer place. We’ll contact you after reviewing your application.</p>
          {error ? <p className="vol-error" role="alert">{error}</p> : null}
          <button className="nb-btn nb-btn-primary vol-submit" type="submit">{state === 'sending' ? 'Submitting…' : 'Apply to volunteer'}</button>
        </fieldset>
      </form>}
      <details className="vol-roles"><summary>See all volunteer roles</summary><ul>{options.roles.map(role=><li key={role}>{role}</li>)}</ul></details>
    </main><footer className="vol-footer">AI GTM Africa · Built together.</footer>
  </div>;
}
