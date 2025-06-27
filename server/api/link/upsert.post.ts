import { LinkSchema } from '@@/schemas/link'


const allowedOrigins = [
  'https://qordwasalreadytaken.github.io',
  'https://build.pathofdiablo.com'
]

const addCors = (event: any) => {
  const origin = getHeader(event, 'origin')

  if (origin && allowedOrigins.includes(origin)) {
    setHeader(event, 'Access-Control-Allow-Origin', origin)
  }

  setHeader(event, 'Access-Control-Allow-Methods', 'POST, OPTIONS')
  setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

export default eventHandler(async (event) => {
  if (getMethod(event) === 'OPTIONS') {
    addCors(event)
    return ''
  }

  addCors(event)

  const link = await readValidatedBody(event, LinkSchema.parse)
  const { caseSensitive } = useRuntimeConfig(event)

  if (!caseSensitive) {
    link.slug = link.slug.toLowerCase()
  }

  const { cloudflare } = event.context
  const { KV } = cloudflare.env

  const existingLink = await KV.get(`link:${link.slug}`, { type: 'json' })

  if (existingLink) {
    const shortLink = `${getRequestProtocol(event)}://${getRequestHost(event)}/${link.slug}`
    return { link: existingLink, shortLink, status: 'existing' }
  }

//  const expiration = getExpiration(event, link.expiration)
    const expiration = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 // 7 days from now


  await KV.put(`link:${link.slug}`, JSON.stringify(link), {
    expiration,
    metadata: {
      expiration,
      url: link.url,
      comment: link.comment,
    },
  })

  setResponseStatus(event, 201)
  const shortLink = `${getRequestProtocol(event)}://${getRequestHost(event)}/${link.slug}`
  return { link, shortLink, status: 'created' }
})
