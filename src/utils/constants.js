export const APP = {
  Name: 'Videso',
  URL: 'https://videso.xyz',
  EMBED_URL: 'https://embed.videos.xyz',
  API_URL: 'https://api.videos.xyz',
  Description: 'Videso is a decentralized video-sharing social media platform built with DeSo.',
  Twitter: 'VidesoApp',
  PublicKeyBase58Check: 'BC1YLiHYuaqQc1r5UFvJ3G8eMYawk693wVGiTHmBQtr9DK8NQXt14oJ',
  Meta: {
    image: `/meta.png`,
    type: 'website',
  }
}

export const DEFAULT_SEO = {
  title: "Videso",
  description: "Videso is a decentralized video-sharing social media platform built with DeSo.",
  canonical: "https://videso.xyz",
  openGraph: {
    type: 'website',
    locale: 'en_IE',
    url: 'https://videso.xyz',
    siteName: 'Videso',
    title: "Videso",
    description: "Videso is a decentralized video-sharing social media platform built with DeSo.",
    images: [
      {
        url: 'https://videso.xyz/meta.png',
        width: 1200,
        height: 630,
        alt: 'Videso',
      },
    ],
  },
  twitter: {
    handle: '@VidesoApp',
    site: '@VidesoApp',
    cardType: 'summary_large_image',
    title: "Videso",
    description: "Videso is a decentralized video-sharing social media platform built with DeSo.",
    images: [
      {
        url: 'https://videso.xyz/meta.png',
        width: 1200,
        height: 630,
        alt: 'Videso',
      },
    ],
  },
};

export const BASE_URI = process.env.NEXT_PUBLIC_NODE_API_URL || 'https://diamondapp.com/api/v0'; //'https://node.deso.org/api/v0';

export const DESO_CONFIG = {
  nodeUri: BASE_URI
}