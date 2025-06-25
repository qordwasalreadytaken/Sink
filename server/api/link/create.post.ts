console.log('🔥 Handler reached:', getMethod(event))
import { LinkSchema } from '@@/schemas/link'

defineRouteMeta({
  openAPI: {
    description: 'Create a new short link',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['url'],
            properties: {
              url: {
                type: 'string',
                description: 'The URL to shorten',
              },
            },
          },
        },
      },
    },
  },
})

// ✅ CORS helper
const addCors = (event: any) => {
  setHeader(event, 'Access-Control-Allow-Origin', 'https://qordwasalreadytaken.github.io') // <-- your site
  setHeader(event, 'Access-Control-Allow-Methods', 'POST, OPTIONS')
  setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

export default eventHandler(async (event) => {
  // ✅ Handle preflight
  if (getMethod(event) === 'OPTIONS') {
    console.log('⚙️ Handling preflight OPTIONS request')
    addCors(event)
    return '' // empty 204 response
  }

  addCors(event)

  const link = await readValidatedBody(event, LinkSchema.parse)
  const { caseSensitive } = useRuntimeConfig(event)

  if (!caseSensitive) {
    link.slug = link.slug.toLowerCase()
  }

  const { cloudflare } = event.context
  const { KV } = cloudflare.env
  const existingLink = await KV.get(`link:${link.slug}`)
  if (existingLink) {
    console.log('⚠️ Link already exists:', link.slug)    
    throw createError({
      status: 409, // Conflict
      statusText: 'Link already exists',
    })
  } else {
    const expiration = getExpiration(event, link.expiration)

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
    return { link, shortLink }
  }
})
console.log('✅ Link created successfully:', link.slug)
