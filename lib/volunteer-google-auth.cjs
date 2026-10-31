function getGwsCredentials() {
  if (!process.env.GOOGLE_WORKSPACE_CLI_CREDENTIALS_JSON) {
    return null;
  }
  try {
    return JSON.parse(process.env.GOOGLE_WORKSPACE_CLI_CREDENTIALS_JSON);
  } catch (err) {
    console.error('Failed to parse GOOGLE_WORKSPACE_CLI_CREDENTIALS_JSON:', err);
    return null;
  }
}

async function getAccessTokenFromGws(credentials) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: credentials.client_id,
      client_secret: credentials.client_secret,
      refresh_token: credentials.refresh_token,
      grant_type: 'refresh_token',
    }),
  });

  const data = await response.json();
  if (!response.ok || !data.access_token) {
    throw new Error('Google OAuth token refresh failed: ' + JSON.stringify(data));
  }
  return data.access_token;
}

// Fallback to Workload Identity Federation (Service Account) if needed for Sheet append
const WORKLOAD_PROVIDER = 'projects/487026309723/locations/global/workloadIdentityPools/vercel/providers/ai-gtm-africa';
const SERVICE_ACCOUNT = 'ai-gtm-registration@tomide-workspace-cli.iam.gserviceaccount.com';

async function getAccessTokenFromOidc(oidcToken) {
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
    throw new Error('Google token exchange failed: ' + await exchange.text());
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
    throw new Error('Service account impersonation failed: ' + await impersonation.text());
  }
  return (await impersonation.json()).accessToken;
}


module.exports = async function(req) { const creds=getGwsCredentials(); if(creds?.refresh_token) { try { return await getAccessTokenFromGws(creds); } catch {} } const token=req.headers['x-vercel-oidc-token']; if(token)return getAccessTokenFromOidc(token); throw new Error('Google authentication unavailable'); };
