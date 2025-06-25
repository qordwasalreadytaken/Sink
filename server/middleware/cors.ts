export default defineEventHandler((event) => {
  setHeader(event, 'Access-Control-Allow-Origin', 'https://qordwasalreadytaken.github.io')
  setHeader(event, 'Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Handle preflight OPTIONS requests globally
  if (getMethod(event) === 'OPTIONS') {
    event.node.res.statusCode = 204
    event.node.res.end()
  }
})
