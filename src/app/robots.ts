import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/admin/',
      },
      {
        // OpenAI / ChatGPT bots
        userAgent: ['GPTBot', 'ChatGPT-User', 'OAI-SearchBot'],
        allow: '/',
        disallow: '/admin/',
      },
      {
        // Google AI / Gemini bots
        userAgent: 'Google-Extended',
        allow: '/',
      },
      {
        // Anthropic / Claude bots
        userAgent: ['anthropic-ai', 'ClaudeBot'],
        allow: '/',
        disallow: '/admin/',
      },
      {
        // Perplexity AI bot
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: '/admin/',
      },
    ],
    sitemap: 'https://www.primepickentertainment.com/sitemap.xml',
  };
}
