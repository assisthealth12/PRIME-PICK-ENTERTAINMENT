import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        // Explicitly welcome OpenAI/ChatGPT bots
        userAgent: ['GPTBot', 'ChatGPT-User'],
        allow: '/',
      },
      {
        // Explicitly welcome Google's AI/Gemini bots
        userAgent: 'Google-Extended',
        allow: '/',
      },
      {
        // Explicitly welcome Anthropic/Claude bots
        userAgent: ['anthropic-ai', 'ClaudeBot'],
        allow: '/',
      }
    ],
    sitemap: 'https://www.primepickentertainment.com/sitemap.xml',
  };
}
