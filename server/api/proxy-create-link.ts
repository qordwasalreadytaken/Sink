import { createShortLink } from '~/server/utils/createLink';

export default eventHandler(async (event) => {
  if (getMethod(event) === 'OPTIONS') {
    // set CORS headers...
    return '';
  }

  const body = await readBody(event);
  const { cloudflare } = event.context;

  return await createShortLink(event, cloudflare.env.KV, body);
});
