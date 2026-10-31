// RFC 2047 encoded words keep Unicode subjects intact across mail providers.
// Each word stays below 75 characters; never split a UTF-8 code point.
function encodeSubject(value) {
  const subject = String(value).replace(/[\r\n]+/g, ' ');
  if (/^[\x20-\x7e]*$/.test(subject)) return subject;
  const chunks = [];
  let chunk = '';
  for (const character of subject) {
    if (Buffer.byteLength(chunk + character, 'utf8') > 42) {
      chunks.push(chunk);
      chunk = '';
    }
    chunk += character;
  }
  if (chunk) chunks.push(chunk);
  return chunks.map(part => `=?UTF-8?B?${Buffer.from(part, 'utf8').toString('base64')}?=`).join('\r\n ');
}

module.exports = { encodeSubject };
