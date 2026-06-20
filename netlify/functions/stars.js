const { getStore } = require('@netlify/blobs');

function sanitizeKey(k) {
  return String(k || '').trim().replace(/[^a-zA-Z0-9가-힣_-]/g, '_').slice(0, 200);
}

exports.handler = async (event) => {
  try {
    const store = getStore('stars');

    if (event.httpMethod === 'GET') {
      const key = sanitizeKey(event.queryStringParameters && event.queryStringParameters.key);
      if (!key) {
        return { statusCode: 400, body: JSON.stringify({ error: 'key required' }) };
      }
      const stars = parseInt((await store.get(key)) || '0', 10);
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ stars })
      };
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const key = sanitizeKey(body.key);
      if (!key) {
        return { statusCode: 400, body: JSON.stringify({ error: 'key required' }) };
      }
      const stars = parseInt((await store.get(key)) || '0', 10) + 1;
      await store.set(key, String(stars));
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ stars })
      };
    }

    return { statusCode: 405, body: 'Method Not Allowed' };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
