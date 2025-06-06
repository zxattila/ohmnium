import type { APIRoute } from "astro";

const SITE_URL = "https://ohmnium.co.uk"; // Updated to match your actual domain from .env

const robotsTxt = `
# Robots.txt for Ohmnium - Electrical Services
# Last updated: ${new Date().toISOString().split("T")[0]}

# Allow all crawlers to index the site
User-agent: *
Allow: /

# Explicitly allow important pages
Allow: /about
Allow: /services
Allow: /contact
Allow: /blog
Allow: /blog/*

# Disallow private/admin areas
Disallow: /api/
Disallow: /.netlify/
Disallow: /netlify/
Disallow: /_astro/
Disallow: /admin/
Disallow: /wp-admin/
Disallow: /wp-content/

# Disallow common unwanted paths
Disallow: /*?*
Disallow: /search
Disallow: /404
Disallow: /error

# Crawl delay (optional - be respectful to server)
Crawl-delay: 1

# Sitemap location
Sitemap: ${SITE_URL}/sitemap.xml

# Additional directives for major search engines
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 1

# Block known bad bots (optional)
User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /
`.trim();

export const GET: APIRoute = () => {
  return new Response(robotsTxt, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400", // Cache for 24 hours
    },
  });
};
