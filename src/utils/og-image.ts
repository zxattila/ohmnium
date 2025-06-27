import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

// You'll need to download a font file and place it in your assets
// For now, we'll use a system font fallback
export async function generateOGImage(title: string, description?: string) {
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1e40af',
          backgroundImage: 'linear-gradient(45deg, #1e40af 0%, #3b82f6 100%)',
          fontFamily: 'Arial, sans-serif',
          color: 'white',
          padding: '40px',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                fontSize: '60px',
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: '20px',
                lineHeight: '1.2',
                maxWidth: '1000px',
              },
              children: title,
            },
          },
          description && {
            type: 'div',
            props: {
              style: {
                fontSize: '32px',
                textAlign: 'center',
                opacity: 0.9,
                maxWidth: '800px',
                lineHeight: '1.4',
              },
              children: description,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: '40px',
                right: '40px',
                fontSize: '24px',
                opacity: 0.8,
              },
              children: 'Ohmnium Electricians',
            },
          },
        ].filter(Boolean),
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Arial',
          data: await fetch('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2').then(res => res.arrayBuffer()),
          style: 'normal',
        },
      ],
    }
  );

  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  return pngData.asPng();
}
