export default eventHandler(async (event) => {
  const { url } = await readBody(event)

  if (!url || typeof url !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing or invalid URL',
    })
  }

  const response = await fetch('https://sink.actuallyiamqord.workers.dev/api/link/create', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SHORTLINK_API_TOKEN ?? 'TacoToken'}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  })

  const json = await response.json()

  if (!response.ok) {
    throw createError({
      statusCode: response.status,
      statusMessage: json.message || 'Error from shortlink API',
    })
  }

  return json
})
