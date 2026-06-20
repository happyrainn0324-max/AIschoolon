const { getStore } = require('@netlify/blobs');

exports.handler = async () => {
  try {
    const store = getStore('counters');
    const current = parseInt((await store.get('visits')) || '0', 10);
    const count = current + 1;
    await store.set('visits', String(count));
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ count })
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
