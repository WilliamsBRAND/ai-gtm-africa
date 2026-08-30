const fs = require('node:fs');
const path = require('node:path');

const SPREADSHEET_ID = '1Ydfb1xoTXM45MDNA3OQf5PGgS8kTjnZF7JnNC3HLT_0';
const SHEET_RANGE = 'Responses!A:J';
const REQUIRED_FIELDS = ['name', 'email', 'phone', 'city', 'role', 'industry', 'heard', 'sponsor'];

const CITY_DATES = {
  'Nairobi': '03 October 2026',
  'Kigali': '10 October 2026',
  'Lagos': '21 November 2026',
  'Cotonou': '19 December 2026',
  'Accra': '29 December 2026',
};

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

function buildEmailHtml(firstName, city, eventDate) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI GTM Africa - Registration Received</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050505; color: #f5f5f2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; line-height: 1.65;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #050505; width: 100%; margin: 0; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #0d0d0d; border: 1px solid rgba(255, 255, 255, 0.12);">
          <tr>
            <td height="4" style="background-color: #7A0A15; font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding: 34px 38px 22px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-family: 'Cinzel', Georgia, serif; font-size: 19px; font-weight: 700; letter-spacing: 2px; color: #ffffff; text-transform: uppercase;">AI GTM AFRICA</span>
                  </td>
                  <td align="right">
                    <span style="font-family: 'Courier New', monospace; font-size: 10px; color: #a0a0a0; letter-spacing: 1.5px; text-transform: uppercase;">2026 TOUR</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 36px 38px 28px;">
              <p style="font-size: 16px; line-height: 1.7; color: #ffffff; margin: 0 0 20px;">
                Hi ${firstName},
              </p>
              <p style="font-size: 15px; line-height: 1.75; color: rgba(255, 255, 255, 0.88); margin: 0 0 20px;">
                Thank you for registering for <strong>AI GTM Africa ${city}</strong>. I’m really glad you’re interested in joining us.
              </p>
              <p style="font-size: 15px; line-height: 1.75; color: rgba(255, 255, 255, 0.88); margin: 0 0 20px;">
                I’m putting this tour together to bring founders, business owners and growth people into the same room to have practical conversations about <strong>how we can use AI to build and grow better businesses across Africa</strong>.
              </p>
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #141414; border-left: 4px solid #7A0A15; border-top: 1px solid rgba(255,255,255,0.08); border-right: 1px solid rgba(255,255,255,0.08); border-bottom: 1px solid rgba(255,255,255,0.08); margin: 24px 0 24px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <div style="font-family: 'Courier New', monospace; font-size: 10px; color: #a0a0a0; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">YOUR SELECTED SESSION</div>
                    <div style="font-size: 16px; font-weight: 700; color: #ffffff;">${city} &middot; ${eventDate}</div>
                    <div style="font-size: 12px; color: rgba(255, 255, 255, 0.6); margin-top: 4px;">Small room of about 20 to 30 people</div>
                  </td>
                </tr>
              </table>
              <p style="font-size: 15px; line-height: 1.75; color: rgba(255, 255, 255, 0.88); margin: 0 0 20px;">
                The ${city} session will be a small room of about <strong>20 to 30 people</strong>, which gives us enough space to actually talk, ask questions and work through real business problems together.
              </p>
              <p style="font-size: 15px; line-height: 1.75; color: rgba(255, 255, 255, 0.88); margin: 0 0 20px;">
                We’ll spend the day looking at how AI can be applied across customer acquisition, marketing, sales and operations. We’ll break down practical GTM systems, look at what is actually working, and work through some of the growth challenges businesses in the room are dealing with.
              </p>
              <p style="font-size: 15px; line-height: 1.75; color: rgba(255, 255, 255, 0.88); margin: 0 0 24px;">
                My goal is that you leave with a clearer idea of <strong>where AI can create leverage in your business, what you should prioritise, and what you can actually start implementing</strong>.
              </p>
              <p style="font-size: 15px; line-height: 1.75; color: rgba(255, 255, 255, 0.88); margin: 0 0 24px;">
                We’ve received your registration for <strong>${city} on ${eventDate}</strong>. We’ll send you another email soon with your confirmation and the rest of the details.
              </p>
              <p style="font-size: 15px; line-height: 1.75; color: rgba(255, 255, 255, 0.88); margin: 0 0 32px;">
                Looking forward to having you join us.
              </p>
              <p style="font-size: 15px; line-height: 1.5; color: #ffffff; font-weight: 700; margin: 0;">
                Tomide Williams<br>
                <span style="font-size: 12px; font-weight: 400; color: #a0a0a0;">Convener, AI GTM Africa</span>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 22px 38px; background-color: #080808; border-top: 1px solid rgba(255, 255, 255, 0.08); font-family: 'Courier New', monospace; font-size: 10px; color: #666666;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td>&copy; 2026 AI GTM Africa &middot; 5 Cities &middot; One Experience</td>
                  <td align="right"><a href="https://www.aigtmafrica.xyz" style="color: #a0a0a0; text-decoration: none;">aigtmafrica.xyz</a></td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

async function sendConfirmationEmail(accessToken, toEmail, fullName, city) {
  const firstName = fullName.split(' ')[0] || fullName;
  const eventDate = CITY_DATES[city] || '2026 Tour';
  const subject = `Your registration for AI GTM Africa (${city}) has been received`;
  const html = buildEmailHtml(firstName, city, eventDate);

  const rfc = [
    'From: "Tomide Williams | AI GTM Africa" <sodunketomide@gmail.com>',
    `To: ${toEmail}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    'Content-Transfer-Encoding: 8bit',
    '',
    html,
  ].join('\r\n');

  const b64 = Buffer.from(rfc, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: b64 }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('Gmail API send failed:', errText);
    throw new Error('Gmail send failed: ' + errText);
  }
  return await response.json();
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

    const gwsCredentials = getGwsCredentials();
    let sheetAccessToken = null;
    let gmailAccessToken = null;

    if (gwsCredentials) {
      try {
        const token = await getAccessTokenFromGws(gwsCredentials);
        sheetAccessToken = token;
        gmailAccessToken = token;
      } catch (tokenErr) {
        console.error('Error refreshing token from GWS credentials:', tokenErr);
      }
    }

    // Fallback for Sheets if GWS token wasn't available
    if (!sheetAccessToken) {
      const oidcToken = req.headers['x-vercel-oidc-token'];
      if (oidcToken) {
        sheetAccessToken = await getAccessTokenFromOidc(oidcToken);
      }
    }

    if (!sheetAccessToken) {
      throw new Error('Could not obtain authorization for Google services.');
    }

    // 1. Append Row to Google Sheet
    const sheetResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(SHEET_RANGE)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sheetAccessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [[
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
          ]],
        }),
      },
    );

    if (!sheetResponse.ok) {
      console.error('Google Sheets append failed:', await sheetResponse.text());
      throw new Error('Could not save registration.');
    }

    // 2. Send Automated Confirmation Email
    if (gmailAccessToken) {
      try {
        await sendConfirmationEmail(gmailAccessToken, String(data.email).trim(), String(data.name).trim(), String(data.city).trim());
        console.log(`Automated confirmation email successfully sent to ${data.email}`);
      } catch (emailErr) {
        console.error('Automated confirmation email failed:', emailErr.message);
        // Do not fail the registration response if email sending encountered an issue
      }
    } else {
      console.warn('Gmail access token was unavailable; email confirmation skipped.');
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ ok: false, error: 'Registration could not be submitted. Please try again.' });
  }
};
