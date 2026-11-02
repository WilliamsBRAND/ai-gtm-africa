const test = require('node:test');
const assert = require('node:assert/strict');
const { encodeSubject } = require('../lib/mail-headers.cjs');

function decodeSubject(header) {
  return header.split(/\r\n /).map(word => {
    const encoded = /^=\?UTF-8\?B\?(.+)\?=$/.exec(word);
    return encoded ? Buffer.from(encoded[1], 'base64').toString('utf8') : word;
  }).join('');
}

test('registration alert subjects preserve styled names, accents and non-Latin scripts', () => {
  for (const name of ['𝐸𝑣𝑎 𝑊𝑎𝑚𝑏𝑢𝑖 𝑁𝑦𝑎𝑤𝑖𝑟𝑎', 'Håvar Bauck', 'Ngũgĩ', '你好', '👩🏾‍💻'.repeat(20)]) {
    const subject = `[New Registration] ${name} - NAIROBI (+254700000000)`;
    const encoded = encodeSubject(subject);
    assert.equal(decodeSubject(encoded), subject);
    assert.ok(/^[\x00-\x7f]*$/.test(encoded));
    for (const word of encoded.split(/\r\n /)) assert.ok(word.length <= 75);
  }
});

test('ASCII subjects remain readable and input cannot inject email headers', () => {
  assert.equal(encodeSubject('[New Registration] Eva Nyawira - NAIROBI'), '[New Registration] Eva Nyawira - NAIROBI');
  assert.equal(encodeSubject('Eva\r\nBcc: other@example.invalid'), 'Eva Bcc: other@example.invalid');
});

test('the registration handler preserves Unicode names in the sheet and alert subject without sending mail', async () => {
  const handler = require('../api/register.js');
  const previousFetch = global.fetch;
  const previousCredentials = process.env.GOOGLE_WORKSPACE_CLI_CREDENTIALS_JSON;
  process.env.GOOGLE_WORKSPACE_CLI_CREDENTIALS_JSON = JSON.stringify({client_id:'test',client_secret:'test',refresh_token:'test'});
  const messages = [];
  let savedRow;
  global.fetch = async (url, options) => {
    if (url === 'https://oauth2.googleapis.com/token') return Response.json({access_token:'test-token'});
    if (url.startsWith('https://sheets.googleapis.com/')) {
      savedRow = JSON.parse(options.body).values[0];
      return Response.json({updates:{updatedRows:1}});
    }
    if (url === 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send') {
      messages.push(Buffer.from(JSON.parse(options.body).raw, 'base64url').toString('utf8'));
      return Response.json({id:'mock-message'});
    }
    throw new Error('Unexpected network request: ' + url);
  };
  try {
    const name = '𝐸𝑣𝑎 𝑊𝑎𝑚𝑏𝑢𝑖 𝑁𝑦𝑎𝑤𝑖𝑟𝑎';
    const res = {status(code){this.code=code;return this;},json(body){this.body=body;return this;}};
    await handler({method:'POST',headers:{},body:{name,email:'test@example.invalid',phone:'+254700000000',city:'NAIROBI',role:'Founder',industry:'Technology',heard:'Friend',sponsor:'No'}},res);
    assert.equal(res.code,200);
    assert.equal(savedRow[1],name);
    // Nairobi is over capacity: saved as Waitlist, team alert only, no attendee email.
    assert.equal(savedRow[9],'Waitlist');
    assert.equal(res.body.waitlisted,true);
    assert.equal(messages.length,1);
    assert.ok(!messages.some(message=>message.includes('has been received')));
    const alert=messages.find(message=>message.includes('AI GTM Africa Team Alert'));
    const header=/^Subject: (.*(?:\r\n[ \t].*)*)/m.exec(alert)[1];
    assert.equal(decodeSubject(header),`[New Registration] ${name} - NAIROBI (+254700000000)`);
    assert.ok(alert.includes(name));

    messages.length = 0;
    const other = {status(code){this.code=code;return this;},json(body){this.body=body;return this;}};
    await handler({method:'POST',headers:{},body:{name:'Ada',email:'ada@example.invalid',phone:'+2348000000000',city:'Lagos',role:'Founder',industry:'Technology',heard:'Friend',sponsor:'No'}},other);
    assert.equal(other.code,200);
    assert.equal(savedRow[9],'New');
    assert.equal(other.body.waitlisted,false);
    assert.equal(messages.length,2);
  } finally {
    global.fetch = previousFetch;
    if(previousCredentials===undefined)delete process.env.GOOGLE_WORKSPACE_CLI_CREDENTIALS_JSON;
    else process.env.GOOGLE_WORKSPACE_CLI_CREDENTIALS_JSON=previousCredentials;
  }
});
