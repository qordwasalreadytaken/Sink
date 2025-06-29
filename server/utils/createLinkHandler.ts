// server/utils/createLinkHandler.ts
//import { getExpiration } from '~/utils/getExpiration';
import { getRequestHost, getRequestProtocol, readValidatedBody, setResponseStatus } from 'h3';
import { LinkSchema } from "@@/schemas/link";

export async function createLinkHandler(event: any) {
  const link = await readValidatedBody(event, LinkSchema.parse);
  const { caseSensitive } = useRuntimeConfig(event);

  if (!caseSensitive) {
    link.slug = link.slug.toLowerCase();
  }

  const { cloudflare } = event.context;
  const { KV } = cloudflare.env;
  const existingLink = await KV.get(`link:${link.slug}`);

  if (existingLink) {
    throw createError({
      status: 409,
      statusText: 'Link already exists',
    });
  }

  const expiration = link.expiration ?? Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // 7 days default

  await KV.put(`link:${link.slug}`, JSON.stringify({ url: link.url }), { expiration });

  setResponseStatus(event, 201);
  const shortLink = `${getRequestProtocol(event)}://${getRequestHost(event)}/${link.slug}`;
  return { link, shortLink };
}
