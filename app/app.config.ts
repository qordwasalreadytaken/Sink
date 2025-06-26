export default defineAppConfig({
//  title: 'Sink',
//  email: 'sink.cool@miantiao.me',
//  github: 'https://github.com/ccbikai/sink',
//  twitter: 'https://sink.cool/kai',
//  telegram: 'https://sink.cool/telegram',
//  mastodon: 'https://sink.cool/mastodon',
//  blog: 'https://sink.cool/blog',
//  description: 'A Simple / Speedy / Secure Link Shortener with Analytics, 100% run on Cloudflare.',
  title: 'PoD Planner Links',
  email: 'actuallyiamqord@gmail.com',
//  github: 'https://github.com/ccbikai/sink',
//  twitter: 'https://sink.cool/kai',
//  telegram: 'https://sink.cool/telegram',
//  mastodon: 'https://sink.cool/mastodon',
//  blog: 'https://sink.cool/blog',
  description: 'Link shortening service for PoD Build Planner links, powered by sink.',
  image: 'https://sink.cool/banner.png',
  previewTTL: 300, // 5 minutes
  slugRegex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/i,
  reserveSlug: [
    'dashboard',
  ],
})
