export default eventHandler(async (event) => {
  const allowedOrigins = [
    'https://qordwasalreadytaken.github.io',
    'https://build.pathofdiablo.com'
  ];

  const origin = getHeader(event, 'origin');
  const runtimeConfig = useRuntimeConfig(event);

  // ✅ Add CORS headers
  if (origin && allowedOrigins.includes(origin)) {
    setHeader(event, 'Access-Control-Allow-Origin', origin);
  }
  setHeader(event, 'Access-Control-Allow-Methods', 'POST, OPTIONS');
  setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type');

  // ✅ Handle preflight
  if (getMethod(event) === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }

  // ✅ Parse body
  let body;
  try {
    body = await readBody(event);
  } catch (err) {
    return sendError(event, createError({ statusCode: 400, message: 'Invalid JSON' }));
  }

  // ✅ Forward to internal secure API with Authorization
  const response = await $fetch(`${runtimeConfig.public.siteUrl}/api/link/create`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${runtimeConfig.siteToken}`,
      'Content-Type': 'application/json',
    },
    body,
  }).catch((err) => {
    console.error('Proxy error:', err);
    return sendError(event, createError({ statusCode: 500, message: 'Upstream failure' }));
  });

  return response;
});
