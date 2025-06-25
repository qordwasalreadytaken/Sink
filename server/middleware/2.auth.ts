export default eventHandler((event) => {
  // ✅ Skip auth for preflight OPTIONS requests
  if (getMethod(event) === 'OPTIONS') {
    return
  }

  const token = getHeader(event, 'Authorization')?.replace(/^Bearer\s+/, '')

  if (event.path.startsWith('/api/') && !event.path.startsWith('/api/_') && token !== useRuntimeConfig(event).siteToken) {
    throw createError({
      status: 401,
      statusText: 'Unauthorized',
    })
  }

  if (token && token.length < 8) {
    throw createError({
      status: 401,
      statusText: 'Token is too short',
    })
  }
})
