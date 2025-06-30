import { LinkSchema } from '@@/schemas/link';
import { createShortLink } from '~/server/utils/createLink';

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
              expiration: {
                type: 'number',
              },
            },
          },
        },
      },
    },
  },
});

const allowedOrigins = [
  'https://qordwasalreadytaken.github.io',
  'https://build.pathofdiablo.com',
];

const addCors = (event: any) => {
  const origin = getHeader(event, 'origin');

  if (origin && allowedOrigins.includes(origin)) {
    setHeader(event, 'Access-Control-Allow-Origin', origin);
  }

  setHeader(event, 'Access-Control-Allow-Methods', 'POST, OPTIONS');
  setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

export default eventHandler(async (event) => {
  // ✅ Handle preflight
  if (getMethod(event) === 'OPTIONS') {
    addCors(event);
    return '';
  }

  addCors(event);

  const link = await readValidatedBody(event, LinkSchema.parse);
  const { caseSensitive } = useRuntimeConfig(event);

  if (!caseSensitive) {
    link.slug = link.slug.toLowerCase();
  }

  const { cloudflare } = event.context;
  const { KV } = cloudflare.env;

  return await createShortLink(event, KV, link);
});
