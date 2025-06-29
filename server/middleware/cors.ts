export default defineEventHandler((event) => {
  const origin = getHeader(event, 'origin')
  const allowedOrigins = [
   'https://qordwasalreadytaken.github.io',
   'https://build.pathofdiablo.com',
   'https://sink.actuallyiamqord.workers.dev'
  ]

  if (origin && allowedOrigins.includes(origin)) {
    setHeader(event, 'Access-Control-Allow-Origin', origin)
  }

  setHeader(event, 'Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Handle preflight OPTIONS requests globally
  if (getMethod(event) === 'OPTIONS') {
    event.node.res.statusCode = 204
    event.node.res.end()
  }
})

