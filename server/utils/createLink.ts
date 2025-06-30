import {
  H3Event,
  createError,
  getRequestHost,
  getRequestProtocol,
  setResponseStatus,
} from 'h3';

export async function createShortLink(event: H3Event, KV: any, link: any) {
  const existingLink = await KV.get(`link:${link.slug}`);
  if (existingLink) {
    throw createError({
      status: 409,
      statusText: 'Link already exists',
    });
  }

  const expiration = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;

  await KV.put(`link:${link.slug}`, JSON.stringify({ url: link.url }), { expiration });

  setResponseStatus(event, 201);

  const shortLink = `${getRequestProtocol(event)}://${getRequestHost(event)}/${link.slug}`;

  return { link, shortLink };
}
