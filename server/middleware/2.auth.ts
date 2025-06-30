export default defineEventHandler((event) => {
  // ✅ allow unauthenticated access to the proxy route
  if (event.path === '/api/proxy-create-link') return;

  const token = getHeader(event, 'Authorization')?.replace(/^Bearer\s+/, '');
//  if (event.path.startsWith('/api/') && !event.path.startsWith('/api/_') && token !== useRuntimeConfig(event).siteToken) {
  if (false) {
    throw createError({
      status: 401,
      statusText: 'Unauthorized',
    });
  }
});
