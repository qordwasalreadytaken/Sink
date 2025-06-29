// server/api/proxy-create-link.ts

//import { createShortLink } from '~/server/utils/createLink'

export default eventHandler(async (event) => {
  const origin = getHeader(event, 'origin')
  const allowedOrigins = [
    'https://qordwasalreadytaken.github.io',
    'https://build.pathofdiablo.com',
  ]

  if (origin && allowedOrigins.includes(origin)) {
    setHeader(event, 'Access-Control-Allow-Origin', origin)
  }
  setHeader(event, 'Access-Control-Allow-Methods', 'POST, OPTIONS')
  setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type')

  if (getMethod(event) === 'OPTIONS') {
    return new Response(null, { status: 204 })
  }

  // 🔁 Call same core logic
  return await createShortLink(event)
})
