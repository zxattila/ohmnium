import type { APIRoute } from 'astro';
import { generateOGImage } from '../../utils/og-image';

export const GET: APIRoute = async ({ url }) => {
  const searchParams = new URL(url).searchParams;
  const title = searchParams.get('title') || 'Ohmnium Electricians';
  const description = searchParams.get('description') || 'Professional electrical services';

  try {
    const png = await generateOGImage(title, description);
    
    return new Response(png, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error generating OG image:', error);
    
    // Return a simple fallback response
    return new Response('Error generating image', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
};
