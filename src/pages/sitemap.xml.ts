import type { APIRoute } from "astro";
import { WP_API_URL } from "../config";

// Define your site URL - should match your actual domain
const SITE_URL = "https://ohmnium.co.uk"; // Updated to match your actual domain

// WordPress post interface for sitemap data
interface WordPressPost {
  id: number;
  slug: string;
  date: string;
  modified: string;
}

// Static pages configuration
const staticPages = [
  {
    url: "",
    changefreq: "weekly",
    priority: "1.0",
    lastmod: new Date().toISOString(),
  },
  {
    url: "/about",
    changefreq: "monthly",
    priority: "0.6",
    lastmod: new Date().toISOString(),
  },
  {
    url: "/services",
    changefreq: "monthly",
    priority: "0.9",
    lastmod: new Date().toISOString(),
  },
  {
    url: "/contact",
    changefreq: "monthly",
    priority: "0.7",
    lastmod: new Date().toISOString(),
  },
  {
    url: "/blog",
    changefreq: "weekly",
    priority: "0.8",
    lastmod: new Date().toISOString(),
  },
];

// Function to fetch WordPress blog posts
async function fetchWordPressPosts(): Promise<
  Array<{
    url: string;
    changefreq: string;
    priority: string;
    lastmod: string;
  }>
> {
  try {
    const response = await fetch(
      `${WP_API_URL}/posts?per_page=100&orderby=modified&order=desc`,
    );
    if (!response.ok) {
      console.warn(`WordPress API error: ${response.status}`);
      return [];
    }

    const posts: WordPressPost[] = await response.json();

    return posts.map((post) => ({
      url: `/blog/${post.slug}`,
      changefreq: "weekly",
      priority: "0.8",
      lastmod: new Date(post.modified || post.date).toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching WordPress posts for sitemap:", error);
    return [];
  }
}
// Function to generate XML sitemap
function generateSitemap(
  pages: Array<{
    url: string;
    changefreq: string;
    priority: string;
    lastmod: string;
  }>,
): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;
}

export const GET: APIRoute = async () => {
  try {
    // Fetch WordPress blog posts
    const blogPosts = await fetchWordPressPosts();

    // Combine static pages with dynamic blog posts
    const allPages = [...staticPages, ...blogPosts];

    const sitemap = generateSitemap(allPages);

    return new Response(sitemap, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new Response("Error generating sitemap", {
      status: 500,
    });
  }
};
