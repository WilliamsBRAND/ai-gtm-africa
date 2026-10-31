const options = require('../src/volunteer-options.json');
const getGoogleToken = require('../lib/volunteer-google-auth.cjs');
const SHEET = '1Ydfb1xoTXM45MDNA3OQf5PGgS8kTjnZF7JnNC3HLT_0';
const clean = value => String(value ?? '').trim();
// RAW writes plus a prefix prevent formula execution when exporting as CSV.
const cell = value => /^[=+\-@\t\r]/.test(value) ? "'" + value : value;
module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow','POST'); return res.status(405).json({ok:false,error:'Method not allowed.'}); }
  try {
    let input;
    try { input = typeof req.body === 'string' ? JSON.parse(req.body) : req.body; } catch { return res.status(400).json({ok:false,error:'Check your application and try again.'}); }
    if (!input || typeof input !== 'object' || Array.isArray(input)) return res.status(400).json({ok:false,error:'Check your application and try again.'});
    if (input.website) return res.status(200).json({ok:true});
    const data = Object.fromEntries(['name','email','phone','location','edition','role','availability','experience','consent'].map(key=>[key,clean(input[key])]));
    if (!data.name || data.name.length>120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || data.email.length>254 || !/^[+\d() .-]{7,40}$/.test(data.phone) || !data.location || data.location.length>160 || !options.editions.includes(data.edition) || !options.roles.includes(data.role) || !options.availability.includes(data.availability) || !data.experience || data.experience.length>2000 || data.consent!=='yes') return res.status(400).json({ok:false,error:'Please complete the required fields with valid details.'});
    const token=await getGoogleToken(req);
    const response=await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET}/values/Volunteers!A:K:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({values:[[new Date().toISOString(),data.name,data.email.toLowerCase(),data.phone,data.location,data.edition,data.role,data.availability,data.experience,'Contact consent given','New'].map(cell)]}),signal:AbortSignal.timeout(12000)});
    if(!response.ok) throw new Error('Save failed');
    return res.status(200).json({ok:true});
  } catch { return res.status(503).json({ok:false,error:'We couldn’t save your application. Please try again shortly.'}); }
};
