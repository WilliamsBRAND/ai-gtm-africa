/**
 * AI GTM AFRICA — Automated Registration Confirmation Email
 * Attached to Google Sheet: AI GTM Africa - Registrations (ID: 1Ydfb1xoTXM45MDNA3OQf5PGgS8kTjnZF7JnNC3HLT_0)
 * 
 * Strategy:
 * When a new registration is appended to the "Responses" tab by the website,
 * this script sends the branded HTML confirmation email using the approved copy
 * and dynamically populates the attendee's name, city, and event date.
 */

var TAB_NAME = 'Responses';

var CITY_DATES = {
  'Kigali': '8 October 2026',
  'Nairobi': '7 November 2026',
  'Lagos': '28 November 2026',
  'Cotonou': '19 December 2026',
  'Accra': '29 December 2026',
  'KIGALI': '8 October 2026',
  'NAIROBI': '7 November 2026',
  'LAGOS': '28 November 2026',
  'COTONOU': '19 December 2026',
  'ACCRA': '29 December 2026'
};

var TEAM_ALERT_RECIPIENTS = ['awodiranprecious@gmail.com', 'sodunketomide@gmail.com'];

/**
 * Trigger function: runs on sheet change or periodic timer (e.g. every minute)
 */
function sendPendingRegistrationEmails() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(TAB_NAME);
  if (!sheet) {
    Logger.log('Sheet tab "' + TAB_NAME + '" not found.');
    return;
  }

  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return; // Only header exists

  // Headers: Timestamp | Full Name | Email Address | Phone Number | City | What Do You Do? | Business / Industry | How Did You Hear About Us? | Sponsor Interest | Status
  var statusColIndex = 9; // Column J (0-indexed)

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var rowNumber = i + 1;
    var rowData = {
      timestamp: row[0],
      name: (row[1] || '').toString().trim(),
      email: (row[2] || '').toString().trim(),
      phone: (row[3] || '').toString().trim(),
      city: (row[4] || '').toString().trim(),
      role: (row[5] || '').toString().trim(),
      industry: (row[6] || '').toString().trim(),
      heard: (row[7] || '').toString().trim(),
      sponsor: (row[8] || '').toString().trim()
    };
    var status = (row[statusColIndex] || '').toString().trim();

    // Only process rows marked as "New"
    if (rowData.name && rowData.email && status === 'New') {
      try {
        var firstName = rowData.name.split(' ')[0] || rowData.name;
        var eventDate = CITY_DATES[rowData.city] || '2026 Tour';
        
        // 1. Send confirmation to attendee
        var subject = 'Your registration for AI GTM Africa (' + rowData.city + ') has been received';
        var htmlBody = buildHtmlEmail(firstName, rowData.city, eventDate);

        MailApp.sendEmail({
          to: rowData.email,
          subject: subject,
          htmlBody: htmlBody,
          name: 'Tomide Williams | AI GTM Africa'
        });

        // 2. Send instant alert to team (Precious & Tomide)
        var adminSubject = '[New Registration] ' + rowData.name + ' - ' + rowData.city + ' (' + rowData.phone + ')';
        var adminHtml = buildAdminNotificationHtml(rowData, eventDate);
        MailApp.sendEmail({
          to: TEAM_ALERT_RECIPIENTS.join(','),
          subject: adminSubject,
          htmlBody: adminHtml,
          name: 'AI GTM Africa Team Alert'
        });

        // Mark as Sent with timestamp
        var sentTimestamp = Utilities.formatDate(new Date(), 'GMT+1', 'yyyy-MM-dd HH:mm');
        sheet.getRange(rowNumber, statusColIndex + 1).setValue('Sent (' + sentTimestamp + ')');
        Logger.log('Successfully sent confirmation and team alert for: ' + rowData.email + ' (Row ' + rowNumber + ')');
      } catch (err) {
        Logger.log('Error sending to ' + rowData.email + ': ' + err.toString());
        sheet.getRange(rowNumber, statusColIndex + 1).setValue('Error: ' + err.message);
      }
    }
  }
}

/**
 * Builds the signature TW branded HTML email
 */
function buildHtmlEmail(firstName, city, eventDate) {
  return '<!DOCTYPE html>' +
  '<html>' +
  '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>' +
  '<body style="margin: 0; padding: 0; background-color: #050505; color: #f5f5f2; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; line-height: 1.65;">' +
  '<table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #050505; width: 100%; margin: 0; padding: 40px 16px;">' +
  '<tr><td align="center">' +
  '<table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #0d0d0d; border: 1px solid rgba(255, 255, 255, 0.12);">' +
  '<tr><td height="4" style="background-color: #7A0A15; font-size: 0; line-height: 0;">&nbsp;</td></tr>' +
  '<tr><td style="padding: 34px 38px 22px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">' +
  '<table width="100%" border="0" cellpadding="0" cellspacing="0"><tr>' +
  '<td><span style="font-family: Georgia, serif; font-size: 19px; font-weight: 700; letter-spacing: 2px; color: #ffffff; text-transform: uppercase;">AI GTM AFRICA</span></td>' +
  '<td align="right"><span style="font-family: monospace; font-size: 10px; color: #a0a0a0; letter-spacing: 1.5px; text-transform: uppercase;">2026 TOUR</span></td>' +
  '</tr></table>' +
  '</td></tr>' +
  '<tr><td style="padding: 36px 38px 28px;">' +
  '<p style="font-size: 16px; line-height: 1.7; color: #ffffff; margin: 0 0 20px;">Hi ' + firstName + ',</p>' +
  '<p style="font-size: 15px; line-height: 1.75; color: rgba(255, 255, 255, 0.88); margin: 0 0 20px;">Thank you for registering for <strong>AI GTM Africa ' + city + '</strong>. I’m really glad you’re interested in joining us.</p>' +
  '<p style="font-size: 15px; line-height: 1.75; color: rgba(255, 255, 255, 0.88); margin: 0 0 20px;">I’m putting this tour together to bring founders, business owners and growth people into the same room to have practical conversations about <strong>how we can use AI to build and grow better businesses across Africa</strong>.</p>' +
  '<table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #141414; border-left: 4px solid #7A0A15; border-top: 1px solid rgba(255,255,255,0.08); border-right: 1px solid rgba(255,255,255,0.08); border-bottom: 1px solid rgba(255,255,255,0.08); margin: 24px 0;">' +
  '<tr><td style="padding: 16px 20px;">' +
  '<div style="font-family: monospace; font-size: 10px; color: #a0a0a0; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">YOUR SELECTED SESSION</div>' +
  '<div style="font-size: 16px; font-weight: 700; color: #ffffff;">' + city + ' &middot; ' + eventDate + '</div>' +
  '<div style="font-size: 12px; color: rgba(255, 255, 255, 0.6); margin-top: 4px;">Small room of about 20 to 30 people</div>' +
  '</td></tr></table>' +
  '<p style="font-size: 15px; line-height: 1.75; color: rgba(255, 255, 255, 0.88); margin: 0 0 20px;">The ' + city + ' session will be a small room of about <strong>20 to 30 people</strong>, which gives us enough space to actually talk, ask questions and work through real business problems together.</p>' +
  '<p style="font-size: 15px; line-height: 1.75; color: rgba(255, 255, 255, 0.88); margin: 0 0 20px;">We’ll spend the day looking at how AI can be applied across customer acquisition, marketing, sales and operations. We’ll break down practical GTM systems, look at what is actually working, and work through some of the growth challenges businesses in the room are dealing with.</p>' +
  '<p style="font-size: 15px; line-height: 1.75; color: rgba(255, 255, 255, 0.88); margin: 0 0 24px;">My goal is that you leave with a clearer idea of <strong>where AI can create leverage in your business, what you should prioritise, and what you can actually start implementing</strong>.</p>' +
  '<p style="font-size: 15px; line-height: 1.75; color: rgba(255, 255, 255, 0.88); margin: 0 0 24px;">We’ve received your registration for <strong>' + city + ' on ' + eventDate + '</strong>. We’ll send you another email soon with your confirmation and the rest of the details.</p>' +
  '<p style="font-size: 15px; line-height: 1.75; color: rgba(255, 255, 255, 0.88); margin: 0 0 32px;">Looking forward to having you join us.</p>' +
  '<p style="font-size: 15px; line-height: 1.5; color: #ffffff; font-weight: 700; margin: 0;">Tomide Williams<br>' +
  '<span style="font-size: 12px; font-weight: 400; color: #a0a0a0;">Convener, AI GTM Africa</span></p>' +
  '</td></tr>' +
  '<tr><td style="padding: 22px 38px; background-color: #080808; border-top: 1px solid rgba(255, 255, 255, 0.08); font-family: monospace; font-size: 10px; color: #666666;">' +
  '<table width="100%" border="0" cellpadding="0" cellspacing="0"><tr>' +
  '<td>&copy; 2026 AI GTM Africa &middot; 5 Cities &middot; One Experience</td>' +
  '<td align="right"><a href="https://www.aigtmafrica.xyz" style="color: #a0a0a0; text-decoration: none;">aigtmafrica.xyz</a></td>' +
  '</tr></table>' +
  '</td></tr>' +
  '</table>' +
  '</td></tr>' +
  '</table>' +
  '</body></html>';
}

/**
 * Builds the instant team notification email for Precious & Tomide
 */
function buildAdminNotificationHtml(data, eventDate) {
  var cleanPhone = (data.phone || '').toString().replace(/[^0-9+]/g, '');
  if (cleanPhone && cleanPhone.charAt(0) === '0' && cleanPhone.length === 11) {
    cleanPhone = '234' + cleanPhone.slice(1);
  } else if (cleanPhone && cleanPhone.charAt(0) === '+') {
    cleanPhone = cleanPhone.slice(1);
  }

  var timestampStr = data.timestamp ? Utilities.formatDate(new Date(data.timestamp), 'GMT+1', 'yyyy-MM-dd HH:mm:ss') : Utilities.formatDate(new Date(), 'GMT+1', 'yyyy-MM-dd HH:mm:ss');

  return '<!DOCTYPE html>' +
  '<html><head><meta charset="utf-8"></head>' +
  '<body style="margin: 0; padding: 0; background-color: #050505; color: #f5f5f2; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6;">' +
  '<table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #050505; width: 100%; margin: 0; padding: 30px 12px;">' +
  '<tr><td align="center">' +
  '<table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #0d0d0d; border: 1px solid rgba(255, 255, 255, 0.12);">' +
  '<tr><td height="4" style="background-color: #7A0A15; font-size: 0; line-height: 0;">&nbsp;</td></tr>' +
  '<tr><td style="padding: 24px 30px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">' +
  '<table width="100%" border="0" cellpadding="0" cellspacing="0"><tr>' +
  '<td><span style="font-size: 17px; font-weight: 700; color: #ffffff; letter-spacing: 1.5px; text-transform: uppercase;">AI GTM AFRICA</span></td>' +
  '<td align="right"><span style="display: inline-block; background: #7A0A15; color: #ffffff; font-size: 10px; font-weight: 700; padding: 4px 10px; letter-spacing: 1px; text-transform: uppercase;">NEW REGISTRATION</span></td>' +
  '</tr></table>' +
  '</td></tr>' +
  '<tr><td style="padding: 30px;">' +
  '<p style="font-size: 15px; color: rgba(255,255,255,0.85); margin: 0 0 20px;">A new attendee has registered for <strong>AI GTM Africa (' + data.city + ')</strong>:</p>' +
  '<table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #141414; border: 1px solid rgba(255,255,255,0.08); margin-bottom: 24px;">' +
  '<tr><td style="padding: 13px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); width: 34%; color: #888888; font-size: 11px; font-family: monospace; text-transform: uppercase;">Full Name</td><td style="padding: 13px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 14px; font-weight: 700; color: #ffffff;">' + data.name + '</td></tr>' +
  '<tr><td style="padding: 13px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); color: #888888; font-size: 11px; font-family: monospace; text-transform: uppercase;">City & Date</td><td style="padding: 13px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 14px; font-weight: 700; color: #ffffff;">' + data.city + ' &middot; <span style="color: #c99398;">' + eventDate + '</span></td></tr>' +
  '<tr><td style="padding: 13px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); color: #888888; font-size: 11px; font-family: monospace; text-transform: uppercase;">Phone Number</td><td style="padding: 13px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 14px; color: #ffffff;"><a href="tel:' + data.phone + '" style="color: #ffffff; text-decoration: none; font-weight: 600;">' + data.phone + '</a>' + (cleanPhone ? ' &nbsp;&middot;&nbsp; <a href="https://wa.me/' + cleanPhone + '" target="_blank" style="color: #25D366; text-decoration: none; font-size: 12px; font-weight: 600;">WhatsApp &rarr;</a>' : '') + '</td></tr>' +
  '<tr><td style="padding: 13px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); color: #888888; font-size: 11px; font-family: monospace; text-transform: uppercase;">Email Address</td><td style="padding: 13px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 14px; color: #ffffff;"><a href="mailto:' + data.email + '" style="color: #c99398; text-decoration: none;">' + data.email + '</a></td></tr>' +
  '<tr><td style="padding: 13px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); color: #888888; font-size: 11px; font-family: monospace; text-transform: uppercase;">What They Do</td><td style="padding: 13px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 14px; color: #ffffff;">' + data.role + '</td></tr>' +
  '<tr><td style="padding: 13px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); color: #888888; font-size: 11px; font-family: monospace; text-transform: uppercase;">Business / Industry</td><td style="padding: 13px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 14px; color: #ffffff;">' + data.industry + '</td></tr>' +
  '<tr><td style="padding: 13px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); color: #888888; font-size: 11px; font-family: monospace; text-transform: uppercase;">How They Heard</td><td style="padding: 13px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 14px; color: #ffffff;">' + data.heard + '</td></tr>' +
  '<tr><td style="padding: 13px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); color: #888888; font-size: 11px; font-family: monospace; text-transform: uppercase;">Sponsor Interest</td><td style="padding: 13px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 14px; font-weight: 700; color: ' + (data.sponsor === 'Yes' ? '#25D366' : '#ffffff') + ';">' + data.sponsor + '</td></tr>' +
  '<tr><td style="padding: 13px 16px; color: #888888; font-size: 11px; font-family: monospace; text-transform: uppercase;">Timestamp (WAT)</td><td style="padding: 13px 16px; font-size: 13px; color: #a0a0a0;">' + timestampStr + '</td></tr>' +
  '</table>' +
  '<table width="100%" border="0" cellpadding="0" cellspacing="0"><tr><td align="center">' +
  '<a href="https://docs.google.com/spreadsheets/d/1Ydfb1xoTXM45MDNA3OQf5PGgS8kTjnZF7JnNC3HLT_0/edit" target="_blank" style="display: inline-block; background-color: #ffffff; color: #070707; font-size: 12px; font-weight: 700; padding: 12px 24px; text-decoration: none; letter-spacing: 0.5px; border-radius: 2px;">View in Google Sheet Tracker &rarr;</a>' +
  '</td></tr></table>' +
  '</td></tr>' +
  '<tr><td style="padding: 18px 30px; background-color: #080808; border-top: 1px solid rgba(255,255,255,0.08); font-size: 11px; color: #666666; font-family: monospace;">' +
  'AI GTM Africa &middot; Automated Team Alert' +
  '</td></tr>' +
  '</table>' +
  '</td></tr></table></body></html>';
}

/**
 * Menu item to manually trigger from Google Sheets UI
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('AI GTM Africa')
    .addItem('Send Pending Emails Now', 'sendPendingRegistrationEmails')
    .addToUi();
}
