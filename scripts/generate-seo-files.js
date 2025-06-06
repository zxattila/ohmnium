#!/usr/bin/env node

/**
 * Generate static sitemap.xml and robots.txt files
 * Run with: node scripts/generate-seo-files.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SITE_URL = "https://ohmnium.co.uk";
const WP_SITE = process.env.WP_SITE || "https://cms.ohmnium.co.uk";
const WP_API_URL = `${WP_SITE}/wp-json/wp/v2`;

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

// Fetch WordPress posts
async function fetchWordPressPosts() {
  try {
    console.log("Fetching WordPress posts from:", WP_API_URL);
    const response = await fetch(
      `${WP_API_URL}/posts?per_page=100&orderby=modified&order=desc`,
    );

    if (!response.ok) {
      console.warn(`WordPress API error: ${response.status}`);
      return [];
    }

    const posts = await response.json();
    console.log(`Fetched ${posts.length} WordPress posts`);

    return posts.map((post) => ({
      url: `/blog/${post.slug}`,
      changefreq: "weekly",
      priority: "0.8",
      lastmod: new Date(post.modified || post.date).toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching WordPress posts:", error);
    return [];
  }
}

// Generate sitemap XML
function generateSitemap(pages) {
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

// Generate robots.txt
function generateRobots() {
  return `# Robots.txt for Ohmnium - Electrical Services
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
Disallow: /`;
}

// Main function
async function generateSEOFiles() {
  try {
    console.log("🚀 Starting SEO file generation...");
    console.log("WP_API_URL:", WP_API_URL);

    // Fetch WordPress posts
    const blogPosts = await fetchWordPressPosts();
    console.log("Blog posts fetched:", blogPosts.length);

    // Combine static pages with dynamic blog posts
    const allPages = [...staticPages, ...blogPosts];
    console.log("Total pages:", allPages.length);

    // Generate sitemap
    const sitemap = generateSitemap(allPages);
    const robots = generateRobots();

    // Ensure public directory exists
    const publicDir = path.join(__dirname, "..", "public");
    console.log("Public directory:", publicDir);

    if (!fs.existsSync(publicDir)) {
      console.log("Creating public directory...");
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Write files
    const sitemapPath = path.join(publicDir, "sitemap.xml");
    const robotsPath = path.join(publicDir, "robots.txt");

    console.log("Writing sitemap to:", sitemapPath);
    fs.writeFileSync(sitemapPath, sitemap);

    console.log("Writing robots.txt to:", robotsPath);
    fs.writeFileSync(robotsPath, robots);

    console.log("✅ Generated sitemap.xml with", allPages.length, "URLs");
    console.log("✅ Generated robots.txt");
    console.log("📁 Files saved to public/ directory");
  } catch (error) {
    console.error("❌ Error generating SEO files:", error);
    console.error("Stack trace:", error.stack);
    process.exit(1);
  }
}

// Run the script
generateSEOFiles();
