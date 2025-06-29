// server/api/link/proxy-create-link.post.ts
export default eventHandler(async (event) => {
  const allowedOrigins = [
    'https://qordwasalreadytaken.github.io',
    'https://build.pathofdiablo.com',
  ];
  const origin = getHeader(event, 'origin');

  if (origin && allowedOrigins.includes(origin)) {
    setHeader(event, 'Access-Control-Allow-Origin', origin);
  }
  setHeader(event, 'Access-Control-Allow-Methods', 'POST, OPTIONS');
  setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS
  if (getMethod(event) === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }

  const body = await readBody(event);
  const { siteToken } = useRuntimeConfig();

  try {
    const result = await $fetch('https://sink.actuallyiamqord.workers.dev/api/link/create', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer TacoToken', // 👈 Hardcoded test
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
    });

    return result;
  } catch (err: any) {
    console.error('Proxy error:', err?.data || err?.message || err);
    return sendError(event, createError({ statusCode: 500, message: 'Proxy request failed' }));
  }
});
