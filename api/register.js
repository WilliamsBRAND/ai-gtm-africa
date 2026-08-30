const SPREADSHEET_ID = '1Ydfb1xoTXM45MDNA3OQf5PGgS8kTjnZF7JnNC3HLT_0';
const SHEET_RANGE = 'Responses!A:J';
const REQUIRED_FIELDS = ['name', 'email', 'phone', 'city', 'role', 'industry', 'heard', 'sponsor'];
const WORKLOAD_PROVIDER = 'projects/487026309723/locations/global/workloadIdentityPools/vercel/providers/ai-gtm-africa';
const SERVICE_ACCOUNT = 'ai-gtm-registration@tomide-workspace-cli.iam.gserviceaccount.com';

async function getAccessToken(oidcToken) {
  const exchange = await fetch('https://sts.googleapis.com/v1/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
      audience: `//iam.googleapis.com/${WORKLOAD_PROVIDER}`,
      scope: 'https://www.googleapis.com/auth/cloud-platform',
      requested_token_type: 'urn:ietf:params:oauth:token-type:access_token',
      subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
      subject_token: oidcToken,
    }),
  });
  if (!exchange.ok) {
    console.error('Google token exchange failed:', await exchange.text());
    throw new Error('Could not authenticate with Google.');
  }
  const federatedToken = (await exchange.json()).access_token;
  const impersonation = await fetch(
    `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${SERVICE_ACCOUNT}:generateAccessToken`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${federatedToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ delegates: [], scope: ['https://www.googleapis.com/auth/spreadsheets'], lifetime: '900s' }),
    },
  );
  if (!impersonation.ok) {
    console.error('Service account impersonation failed:', await impersonation.text());
    throw new Error('Could not authenticate with Google Sheets.');
  }
  return (await impersonation.json()).accessToken;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed.' });
  }

  try {
    const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!data || REQUIRED_FIELDS.some((field) => !String(data[field] || '').trim())) {
      return res.status(400).json({ ok: false, error: 'Please complete all required fields.' });
    }

    const oidcToken = req.headers['x-vercel-oidc-token'];
    if (!oidcToken) throw new Error('Vercel OIDC token is unavailable.');
    const accessToken = await getAccessToken(oidcToken);
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(SHEET_RANGE)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values: [[
          new Date().toISOString(),
          String(data.name).trim(),
          String(data.email).trim(),
          String(data.phone).trim(),
          String(data.city).trim(),
          String(data.role).trim(),
          String(data.industry).trim(),
          String(data.heard).trim(),
          String(data.sponsor).trim(),
          'New',
        ]] }),
      },
    );

    if (!response.ok) {
      console.error('Google Sheets append failed:', await response.text());
      throw new Error('Could not save registration.');
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ ok: false, error: 'Registration could not be submitted. Please try again.' });
  }
};
