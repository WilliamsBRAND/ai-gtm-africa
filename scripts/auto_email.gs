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
  'Nairobi': '03 October 2026',
  'Kigali': '10 October 2026',
  'Lagos': '21 November 2026',
  'Cotonou': '19 December 2026',
  'Accra': '29 December 2026'
};

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
    var name = (row[1] || '').toString().trim();
    var email = (row[2] || '').toString().trim();
    var city = (row[4] || '').toString().trim();
    var status = (row[statusColIndex] || '').toString().trim();

    // Only process rows marked as "New"
    if (name && email && status === 'New') {
      try {
        var firstName = name.split(' ')[0] || name;
        var eventDate = CITY_DATES[city] || '2026 Tour';
        
        var subject = 'Your registration for AI GTM Africa (' + city + ') has been received';
        var htmlBody = buildHtmlEmail(firstName, city, eventDate);

        MailApp.sendEmail({
          to: email,
          subject: subject,
          htmlBody: htmlBody,
          name: 'Tomide Williams | AI GTM Africa'
        });

        // Mark as Sent with timestamp
        var sentTimestamp = Utilities.formatDate(new Date(), 'GMT+1', 'yyyy-MM-dd HH:mm');
        sheet.getRange(rowNumber, statusColIndex + 1).setValue('Sent (' + sentTimestamp + ')');
        Logger.log('Successfully sent confirmation email to: ' + email + ' (Row ' + rowNumber + ')');
      } catch (err) {
        Logger.log('Error sending to ' + email + ': ' + err.toString());
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
 * Menu item to manually trigger from Google Sheets UI
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('AI GTM Africa')
    .addItem('Send Pending Emails Now', 'sendPendingRegistrationEmails')
    .addToUi();
}
