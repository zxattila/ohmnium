# Ohmnium

A modern, component-based static website built with Astro, Alpine.js, and TailwindCSS that fetches dynamic content from WordPress via the REST API v2.

## 📋 Table of Contents

- [🚀 Project Overview](#-project-overview)
- [🧩 Tech Stack](#-tech-stack)
- [💻 Component Architecture](#-component-architecture)
- [🔧 Configuration](#-configuration)
- [🎯 SEO & Search Engine Optimization](#-seo--search-engine-optimization)
- [Tailwind Snippets](#tailwind-snippets)
- [📏 Tailwind Sizing Pattern](#-tailwind-sizing-pattern)
- [🖼️ Image Optimization & Browser Compatibility](#️-image-optimization--browser-compatibility)
- [🔍 SEO Components](#-seo-components-headmetas--headseo)
- [📦 Installation](#-installation)
- [🏃‍♂️ Getting Started](#️-getting-started)
- [📚 Additional Resources](#-additional-resources)

## 🚀 Project Overview

Ohmnium is a performant frontend that combines the benefits of static site generation with dynamic content from a headless WordPress backend. The site features a clean, responsive design with interactive components powered by Alpine.js and styled using TailwindCSS with DaisyUI.

Key features:
- Static site generation with Astro
- Dynamic content via WordPress REST API v2
- Interactive UI with Alpine.js
- Modern styling with TailwindCSS and DaisyUI
- AI-powered contact form using OpenAI integration

## 🧩 Tech Stack

- **Astro** v5.2.5: Core framework for component-based architecture
- **Alpine.js** v3.13.3: Lightweight JS framework for interactivity
- **TailwindCSS** v3.4.0: Utility-first CSS framework
- **DaisyUI** v4.6.1: Component library for Tailwind
- **WordPress REST API v2**: Backend content management
- **OpenAI API**: AI-powered contact bot
- **Font Awesome**: Icon library
- **SASS**: CSS preprocessing

## 💻 Component Architecture

The project is organized into reusable, modular components that can be easily maintained and extended.

### Dynamic/Mapped Components

Several components in this project dynamically fetch and display content from the WordPress API:

#### 1. PostSlider Component

Fetches and displays the latest blog posts in a responsive slider:

```astro
// src/components/PostSlider.astro
async function fetchWithRetry(url, maxRetries = 3) {
  // ... implementation
}

let posts = [];
try {
  posts = await fetchWithRetry(`${WP_API_URL}/posts?per_page=${postCount}&order=desc&orderby=date`);
} catch (error) {
  console.error("Failed to fetch blog posts:", error);
}
```

The slider uses Alpine.js to handle responsive behavior and navigation:

```javascript
x-data={`{
  currentGroup: 0,
  visiblePosts: 1, // Default for mobile
  
  init() {
    this.updateVisiblePosts();
    window.addEventListener('resize', () => this.updateVisiblePosts());
  },
  
  // ... additional methods
}`}
```

#### 2. Blog Post Pagination with Title Truncation

The Pagination component features a title truncation function that limits the length of post titles in navigation:

```astro
// src/components/Pagination.astro
function truncateTitle(title, maxLength = 30) {
  if (!title) return "";
  
  // Remove HTML tags for accurate character count
  const textOnly = title.replace(/<\/?[^>]+(>|$)/g, "");
  
  if (textOnly.length <= maxLength) return title;
  return textOnly.substring(0, maxLength) + "...";
}
```

Usage in the component:
```astro
<span set:html={truncateTitle(prevPost?.title?.rendered) || "Previous"} />
```

To disable title truncation, you can:

1. **Remove the function call** and directly use the title:
```astro
<span set:html={prevPost?.title?.rendered || "Previous"} />
```

2. **Set a very large maxLength** to effectively disable truncation:
```astro
function truncateTitle(title, maxLength = 1000) {
  // ... rest of function
}
```

3. **Remove the entire function** from the component if you don't need truncation anywhere.

#### 3. AI-Powered Contact Bot

Integrates with OpenAI API to provide intelligent responses to user inquiries:

```astro
// src/components/ContactBot.astro
<div x-data="contactBot" class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
  <!-- User input -->
  <textarea x-model="prompt"></textarea>
  
  <!-- Submit button -->
  <button @click="submitPrompt">Submit</button>
  
  <!-- Response display -->
  <div x-show="response">
    <p x-text="response"></p>
  </div>
</div>
```

#### 4. RatingWidget Component with Google Places API Integration

The RatingWidget component displays customer ratings and reviews from Google Business. It's designed to be easily integrated with the Google Places API for dynamic data fetching.

**Current Implementation** (`src/components/RatingWidget.astro`):

```astro
---
// Default values - will be replaced by Google Places API data in the future
const rating = 5.0;
const userRatingsTotal = 47;
const googleBusinessUrl = "https://www.google.com/maps/place/Ohmnium/@51.6637177,-0.0816725,13z/data=!3m1!4b1!4m6!3m5!1s0x6da422e7cebb863:0x9be5391c3058c133!8m2!3d51.6637177!4d-0.0816725!16s%2Fg%2F11x1ctjxjv?entry=ttu&g_ep=EgoyMDI1MDUyOC4wIKXMDSoASAFQAw%3D%3D";

// Calculate how many full stars to show (rounded to nearest whole number)
const fullStars = Math.round(rating);
---

<section class="py-6">
  <div class="container mx-auto text-center sm:text-left">
    <div class="flex flex-col items-center sm:items-start space-y-2">
      <!-- Rating Stars -->
      <div class="flex space-x-1">
        {Array.from({ length: 5 }, (_, index) => (
          <div 
            class={`mask mask-star-2 w-5 h-5 ${index < fullStars ? '' : 'opacity-30'}`}
            style="background-color: #FFCB45;"
          ></div>
        ))}
      </div>
      
      <!-- Review Text -->
      <p class="text-gray-700 font-medium">
        Proud to have great feedback from our {userRatingsTotal} customers on 
        <a href={googleBusinessUrl} target="_blank" rel="noopener noreferrer" class="inline-flex items-center hover:underline">
          <i class="fa-brands fa-google text-blue-500 mx-1"></i>
          Google Business!
        </a>
      </p>
    </div>
  </div>
</section>
```

**Google Places API Integration (Future)**:

The component is structured to easily integrate with Google Places API data. The expected API response format:

```javascript
{
  "result": {
    "name": "Your Business Name",
    "rating": 4.7,
    "user_ratings_total": 50,
    "reviews": [
      {
        "author_name": "John Doe",
        "profile_photo_url": "https://...",
        "rating": 5,
        "text": "Great service!",
        "time": 1700000000
      }
    ]
  }
}
```

**Future API Integration Example**:

```astro
---
// Google Places API integration
const GOOGLE_PLACES_API_KEY = import.meta.env.GOOGLE_PLACES_API_KEY;
const PLACE_ID = import.meta.env.GOOGLE_PLACE_ID;

let rating = 5.0; // Default fallback
let userRatingsTotal = 47; // Default fallback
const googleBusinessUrl = "https://maps.app.goo.gl/FKFfpkgCduE4a2R76";

try {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=name,rating,user_ratings_total&key=${GOOGLE_PLACES_API_KEY}`
  );
  const data = await response.json();
  
  if (data.result) {
    rating = data.result.rating || rating;
    userRatingsTotal = data.result.user_ratings_total || userRatingsTotal;
  }
} catch (error) {
  console.error("Failed to fetch Google Places data:", error);
  // Fallback to default values
}

const fullStars = Math.round(rating);
---
```

**Required Environment Variables for Google Places API**:

```env
# Google Places API Configuration
GOOGLE_PLACES_API_KEY=your_google_places_api_key
GOOGLE_PLACE_ID=your_google_business_place_id
```

**Features**:
- **Static fallback values** for reliable display when API is unavailable
- **Dynamic star rendering** that supports decimal ratings (4.7 shows 5 stars, 3.2 shows 3 stars)
- **Responsive design** with center alignment on mobile, left alignment on desktop
- **Clickable Google Business link** with proper security attributes
- **Custom brand colors** using your defined `#FFCB45` star color
- **Future-ready architecture** for seamless API integration

**Star Logic**:
- Uses `Math.round(rating)` to determine filled stars
- Stars beyond the rating count get `opacity-30` (dimmed effect)
- Supports any rating from 0-5 with proper visual feedback

#### 5. Contact Page (Future Implementation)

**Note**: This contact page will be added at a later date once the AI setup is fully configured and tested.

The contact page provides a dedicated interface for users to interact with the AI-powered contact bot:

```astro
// src/pages/contact.astro (To be implemented)
---
import Layout from "../layouts/Layout.astro";
import PageHeader from "../components/PageHeader.astro";
import ContactBot from "../components/ContactBot.astro";
---

<Layout>
  <PageHeader
    title="Contact Us"
    description="Get in touch with our AI assistant"
    useNoise={true}
  />

  <div class="max-w-2xl mx-auto sm:px-4 pb-10">
    <ContactBot />
  </div>
</Layout>
```

This page features:
- Clean, centered layout optimized for the contact bot interface
- Page header with noise texture background for visual consistency
- Responsive design that works across all device sizes
- Integration with the AI-powered ContactBot component

## 🔧 Configuration

The project uses environment variables to manage configuration:

### Contact Form with Resend Email API

The contact form uses React Email templates for flexible email design and the Resend API for reliable email delivery.

#### Required Dependencies

The contact form uses HTML email templates and the Resend API for reliable email delivery.

**No additional dependencies required** - the templates use pure HTML with inline CSS.

#### Environment Variables

Set these in your `.env` file and Netlify environment variables:

```env
# WordPress Configuration
WP_SITE=https://techcrunch.com
OPENAI_API_KEY=your_openai_api_key_here

# Contact Form Configuration (Required for netlify/functions/contact.js)
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=info@yourdomain.com
BUSINESS_EMAIL=info@yourdomain.com  
BUSINESS_NAME=Your Business Name
DOMAIN=yourdomain.com
SITE_URL=https://yourdomain.com

# Optional: Flowise Configuration 
FLOWISE_API_KEY=your_flowise_api_key
FLOWISE_URL=https://your-flowise-instance.com/api/v1/prediction/flow-id
```

#### Netlify Configuration

1. **Add environment variables** in your Netlify dashboard under Site Settings > Environment Variables
2. **Deploy your functions** - Netlify will automatically detect functions in the `netlify/functions/` directory
3. **Test the contact form** - The form endpoint will be available at `/.netlify/functions/contact`

#### Email Templates

The contact form sends two emails using HTML email templates:

- **Customer Email** (`/netlify/functions/templates/customer.js`) - Confirmation email sent to the customer
- **Business Email** (`/netlify/functions/templates/business.js`) - Notification email sent to your business

Templates include:
- Responsive HTML design matching your brand
- Custom fonts (Francois One & Source Sans 3)
- Dark mode support for better accessibility
- Spam detection warnings
- Rate limiting protection
- Mobile-optimized layout

#### Required Image Assets

Add these image files to your `/public` folder:

- **`/public/logo.png`** - Company logo (140px width recommended, PNG with transparent background) ✅ **COMPLETED**
- **`/public/welcome.jpg`** - Welcome image for customer emails (600px max width, optimized for email, under 500KB recommended) ✅ **COMPLETED**

Both images should be optimized for web and email delivery.

**Status**: ✅ **HTML email templates are fully configured and ready for production use**

Image assets ready:
- Logo copied from assets to public folder ✅
- Welcome image (electrician-abstract-01.jpg) ready for emails ✅

Template features:
- Professional HTML email design with inline CSS ✅
- Custom Francois One and Source Sans 3 fonts ✅
- Dark mode support with CSS media queries ✅
- Responsive mobile-optimized layout ✅
- Logo and welcome image integration ✅
- Proper security with HTML escaping ✅

## Tailwind Snippets

Custom utility classes for common design patterns:

### First Child Spacing
Adds consistent bottom margin to all direct child elements:

```css
.first-child-spacing > * {
  @apply mb-5;
}
```

Usage example:
```astro
<div class="first-child-spacing">
  <!-- All direct children will have mb-5 applied -->
  <p>This paragraph gets mb-5</p>
  <h2>This heading gets mb-5</h2>
  <ul>This list gets mb-5</ul>
</div>
```

This utility is particularly useful for WordPress content areas where you need consistent spacing between all elements without targeting specific HTML tags.

## 📏 Tailwind Sizing Pattern

Tailwind CSS follows a systematic pattern for all its sizing classes based on a **4px unit system**. Understanding this pattern helps you make consistent spacing decisions across your project.

### Base System
- Each increment = **0.25rem = 4px**
- Class numbers multiply by the base unit
- Same pattern applies to: `w-`, `h-`, `min-h-`, `max-h-`, `p-`, `m-`, `gap-`, `space-`, `top-`, `left-`, etc.

### Common Height Classes
```
min-h-0   = 0rem     (0px)
min-h-1   = 0.25rem  (4px)
min-h-2   = 0.5rem   (8px)
min-h-3   = 0.75rem  (12px)
min-h-4   = 1rem     (16px)
min-h-5   = 1.25rem  (20px)
min-h-6   = 1.5rem   (24px)
min-h-8   = 2rem     (32px)
min-h-10  = 2.5rem   (40px)
min-h-12  = 3rem     (48px)
min-h-14  = 3.5rem   (56px)
min-h-16  = 4rem     (64px)
min-h-20  = 5rem     (80px)
min-h-24  = 6rem     (96px)
min-h-28  = 7rem     (112px)
min-h-32  = 8rem     (128px)
min-h-36  = 9rem     (144px)
min-h-40  = 10rem    (160px)
min-h-44  = 11rem    (176px)
min-h-48  = 12rem    (192px)
min-h-52  = 13rem    (208px)
min-h-56  = 14rem    (224px)
min-h-60  = 15rem    (240px)
min-h-64  = 16rem    (256px)
min-h-72  = 18rem    (288px)
min-h-80  = 20rem    (320px)
min-h-96  = 24rem    (384px)
```

### Fractional Values
For fine-tuned control:
```
min-h-0.5 = 0.125rem (2px)
min-h-1.5 = 0.375rem (6px)
min-h-2.5 = 0.625rem (10px)
min-h-3.5 = 0.875rem (14px)
```

### Pattern Logic
- **1-12**: Every increment available (continuous 4px steps)
- **14-96**: Larger increments with some gaps for practical use
- **Fractional**: .5 increments for precise adjustments

### Practical Usage
```astro
<!-- Card with consistent minimum height -->
<div class="min-h-32 bg-surface-card">
  <!-- Content that needs at least 128px height -->
</div>

<!-- Spacing that follows the same pattern -->
<div class="p-4 m-2 gap-6">
  <!-- 16px padding, 8px margin, 24px gap -->
</div>
```

This systematic approach ensures visual consistency and makes it easier to maintain proportional relationships throughout your design.

## 🖼️ Image Optimization & Browser Compatibility

This section covers comprehensive image optimization strategies, including the Dynamic Image Component, PageHeader optimizations, API preloading, and browser compatibility fixes.

### Dynamic Image Component

The project includes an optimized Image component that wraps Astro's built-in image optimization with Sharp, providing automatic format conversion, responsive images, and lazy loading.

#### Features

- ✅ **Automatic format conversion** (AVIF, WebP with fallbacks)
- ✅ **Responsive images** with custom breakpoints
- ✅ **Lazy loading** by default
- ✅ **Auto-detected dimensions** from source images
- ✅ **Sharp integration** for optimal compression
- ✅ **TypeScript support** with full type safety

#### Basic Usage

```astro
---
import Image from "../components/Image.astro";
import inspectionImg from "../assets/inspection.png";
---

<!-- Simple usage with auto-detected dimensions -->
<Image src={inspectionImg} alt="Inspection & Testing" />

<!-- Custom sizes and breakpoints -->
<Image
  src={inspectionImg}
  alt="Inspection & Testing"
  widths={[480, 768, 1024, 1280]}
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

#### Props Reference

| Prop         | Type                      | Default                        | Description                               |
| ------------ | ------------------------- | ------------------------------ | ----------------------------------------- |
| `src`        | `ImageMetadata \| string` | required                       | Image source (import from assets)         |
| `alt`        | `string`                  | required                       | Alt text for accessibility                |
| `usePicture` | `boolean`                 | `true`                         | Use picture element for responsive images |
| `lazy`       | `boolean`                 | `true`                         | Enable lazy loading                       |
| `widths`     | `number[]`                | `[640, 768, 1024, 1280, 1536]` | Responsive breakpoint widths              |
| `sizes`      | `string`                  | Tailwind responsive            | CSS sizes attribute                       |
| `formats`    | `string[]`                | `['avif', 'webp']`             | Output formats (with fallback)            |
| `quality`    | `number`                  | `80`                           | Image quality (1-100)                     |
| `class`      | `string`                  | `""`                           | CSS classes                               |

#### Performance Impact

- **File size reduction**: ~75% smaller with WebP/AVIF
- **Responsive loading**: Only loads appropriate size
- **Lazy loading**: Improves initial page load
- **Format negotiation**: Browser gets best supported format

### PageHeader Component Optimization

The PageHeader component supports dynamic background images with full performance optimization:

#### Usage Examples

```astro
---
import PageHeader from "../components/PageHeader.astro";
import electricianImage from "../assets/electrician-abstract.jpg";
import inspectionImage from "../assets/inspection.png";
---

<!-- Using local asset images (best performance) -->
<PageHeader
  title="Services"
  description="Professional electrical solutions"
  backgroundImage={inspectionImage}
/>

<!-- Using noise background (existing pattern) -->
<PageHeader
  title="Services"
  description="Electrical solutions"
  useNoise={true}
/>
```

#### Performance Benefits

- **Responsive Images**: Multiple sizes (400px to 2000px) for different screens
- **Modern Formats**: WebP and AVIF for 60-80% smaller file sizes
- **Smart Loading**: No lazy loading for above-the-fold content
- **Quality Optimization**: Balanced quality (80%) for fast loading

### API Optimization Methods

#### Preload Tags for Critical Assets

The project implements strategic preloading for performance optimization:

```astro
---
// Layout.astro - Critical asset preloading
import heroImage from "../assets/electrician-abstract.jpg";
import { WP_SITE } from "astro:env/server";
---

<head>
  <!-- Critical fonts -->
  <link
    rel="preload"
    href="/fonts/FrancoisOne-Regular.ttf"
    as="font"
    type="font/ttf"
    crossorigin
  />
  <link
    rel="preload"
    href="/fonts/SourceSans3-Regular.ttf"
    as="font"
    type="font/ttf"
    crossorigin
  />
  
  <!-- Hero image for above-the-fold content -->
  <link
    rel="preload"
    href={heroImage.src}
    as="image"
    type="image/jpeg"
  />
  
  <!-- DNS prefetch for WordPress API -->
  {WP_SITE && (
    <link rel="dns-prefetch" href={new URL(WP_SITE).origin} />
  )}
</head>
```

#### WordPress API Optimization

```astro
---
// Optimize API calls with caching and preloading
const wpApiUrl = `${import.meta.env.WP_SITE}/wp-json/wp/v2`;

// Preload critical API endpoints
const criticalEndpoints = [
  `${wpApiUrl}/posts?per_page=5`,
  `${wpApiUrl}/pages`,
  `${wpApiUrl}/media`
];
---

<!-- Preload critical API endpoints -->
{criticalEndpoints.map(endpoint => (
  <link rel="preload" href={endpoint} as="fetch" crossorigin />
))}
```

### Safari-Specific Fixes

Safari can have rendering inconsistencies with SVG images and CSS sizing. Here are proven solutions:

#### CSS Properties for Safari Stability

```css
/* Safari-specific fixes for images */
.safari-optimized-image {
  /* Force hardware acceleration */
  transform: translateZ(0);
  backface-visibility: hidden;
  
  /* Prevent layout thrashing */
  contain: layout;
  
  /* Ensure consistent sizing */
  box-sizing: border-box;
  
  /* For SVGs specifically */
  shape-rendering: geometricPrecision;
}
```

#### Inline Style Implementation

```astro
<img 
  src={brand.src} 
  alt={brand.alt}
  class="h-[30px] lg:h-[40px] w-auto object-contain"
  style="transform: translateZ(0); backface-visibility: hidden;"
/>
```

### Image Format Comparison

#### SVG (Scalable Vector Graphics)

**Pros:**
- ✅ **Scalable**: Perfect quality at any size
- ✅ **Small file size**: Efficient for simple graphics
- ✅ **Editable**: Can be styled with CSS
- ✅ **Accessible**: Screen readers can parse SVG content
- ✅ **Interactive**: Can include animations and interactions

**Cons:**
- ❌ **Browser inconsistencies**: Safari can be problematic
- ❌ **Complex graphics**: Large file sizes for detailed images
- ❌ **Limited browser support**: Older browsers may struggle
- ❌ **Rendering issues**: Occasional layout problems

**Best for:** Icons, logos, simple illustrations, graphics that need to scale

#### PNG/JPG with Optimization

**Pros:**
- ✅ **Universal support**: Works reliably across all browsers
- ✅ **Transparency**: PNG supports alpha channel
- ✅ **Consistent rendering**: Predictable display across devices
- ✅ **Sharp integration**: Automatic WebP/AVIF conversion
- ✅ **Responsive**: Multiple sizes generated automatically

**Cons:**
- ❌ **Larger base size**: Without optimization
- ❌ **Not scalable**: Pixelation when resized beyond original

**Best for:** Photos, complex images, hero backgrounds (when using Image component)

### Best Practices Summary

1. **Use the Image component** for all photos and complex images
2. **Import images from `/src/assets/`** for optimization benefits
3. **Apply Safari-specific CSS** for critical SVG elements
4. **Implement preload tags** for critical assets (fonts, hero images)
5. **Use DNS prefetch** for external API endpoints
6. **Set appropriate loading strategies** (eager for above-fold, lazy for below-fold)
7. **Add explicit alt text** for accessibility
8. **Test across browsers** especially Safari on mobile devices

### Migration Guide

#### Before (Performance Issues)

```astro
<img
  src="/_astro/inspection.OwM58V36.png"
  alt="Inspection"
  class="w-full h-full object-cover"
/>
```

#### After (Optimized)

```astro
---
import Image from "../components/Image.astro";
import inspectionImg from "../assets/inspection.png";
---

<Image
  src={inspectionImg}
  alt="Inspection & Testing"
  class="w-full h-full object-cover"
/>
```

This comprehensive approach ensures optimal image performance, browser compatibility, and user experience across all devices and browsers.

## 🔍 SEO Components: HeadMetas & HeadSeo

The project includes two specialized components for comprehensive SEO optimization: `HeadMetas.astro` for meta tags and `HeadSeo.astro` for structured data. These components work together to provide complete SEO coverage while maintaining clean separation of concerns.

### HeadMetas Component

Handles all meta tags including Open Graph, Twitter Cards, and basic meta information.

**Usage:**
```astro
<HeadMetas 
  title="Page Title"
  description="Page description for meta tags"
  type="website"
  image="/path/to/image.jpg"
  imageWidth={1200}
  imageHeight={630}
  twitterHandle="@yourbusiness"
/>
```

**Props:**
- `title` (string): Page title for meta tags
- `description` (string): Meta description
- `type` (string): Open Graph type - 'website', 'article', 'product', etc.
- `image` (string, optional): Social media image URL
- `imageWidth` (number, optional): Image width for Open Graph
- `imageHeight` (number, optional): Image height for Open Graph  
- `twitterHandle` (string, optional): Twitter handle for Twitter Cards

**Generated Meta Tags:**
- Basic meta tags (title, description, viewport)
- Open Graph tags for Facebook sharing
- Twitter Card tags for Twitter sharing
- Canonical URL for SEO

### HeadSeo Component

Generates JSON-LD structured data for search engines with support for multiple schema types.

**Supported Schema Types:**
- `WebPage` - Standard web pages
- `ContactPage` - Contact/form pages
- `AboutPage` - About/company pages
- `Organization` - Business/company data
- `Blog` - Blog listing pages
- `BlogPosting` - Individual blog posts
- `FAQPage` - Pages with FAQ sections

**Basic Usage:**
```astro
<HeadSeo 
  title="Page Title"
  description="Page description"
  schemaType="WebPage"
/>
```

**Blog Post Usage:**
```astro
<HeadSeo 
  title="Blog Post Title"
  description="Blog post description"
  schemaType="BlogPosting"
  datePublished="2025-01-15"
  dateModified="2025-01-16"
  author="Author Name"
/>
```

**FAQ Page Usage:**
```astro
---
import { defaultElectricalFaqItems } from "../components/Faq.astro";
---
<HeadSeo 
  title="FAQ - Electrical Services"
  description="Frequently asked questions about our electrical services"
  schemaType="FAQPage"
  faqItems={defaultElectricalFaqItems}
/>
```

**Custom FAQ Usage:**
```astro
---
const customFaqItems = [
  {
    title: "What services do you offer?",
    content: "We offer comprehensive electrical services including..."
  },
  {
    title: "How much do you charge?",
    content: "Our pricing depends on the scope of work..."
  }
];
---
<HeadSeo 
  title="Service FAQ"
  description="Common questions about our services"
  schemaType="FAQPage"
  faqItems={customFaqItems}
/>
```

### Integration with Layout Component

Both components are automatically integrated into the main `Layout.astro` component:

```astro
---
// src/layouts/Layout.astro
import HeadMetas from "../components/HeadMetas.astro";
import HeadSeo from "../components/HeadSeo.astro";
import type { AccordionItem } from "../components/Faq.astro";

export interface Props {
  title?: string;
  description?: string;
  pageType?: "default" | "blog" | "contact" | "about";
  type?: 'website' | 'article' | 'product';
  schemaType?: "WebPage" | "ContactPage" | "AboutPage" | "Organization" | "Blog" | "BlogPosting" | "FAQPage";
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  twitterHandle?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  faqItems?: AccordionItem[];
}
---

<html lang="en">
  <head>
    <!-- Meta Tags Component -->
    <HeadMetas 
      title={title}
      description={description}
      type={type}
      image={image}
      imageWidth={imageWidth}
      imageHeight={imageHeight}
      twitterHandle={twitterHandle}
    />
    
    <!-- SEO Schema Component -->
    <HeadSeo 
      title={title}
      description={description}
      schemaType={schemaType}
      datePublished={datePublished}
      dateModified={dateModified}
      author={author}
      faqItems={faqItems}
    />
  </head>
  <!-- ... -->
</html>
```

### Page Implementation Examples

**Standard Page:**
```astro
---
// src/pages/services.astro
import Layout from "../layouts/Layout.astro";
---
<Layout 
  title="Electrical Services - Inspections, Rewiring & Repairs"
  description="Professional electrical services including inspections, fault finding, rewiring, and consumer unit upgrades."
  pageType="default"
  schemaType="WebPage"
>
  <!-- Page content -->
</Layout>
```

**Contact Page:**
```astro
---
// src/pages/contact.astro
import Layout from "../layouts/Layout.astro";
---
<Layout 
  title="Contact Ohmnium Electricians - Get Your Free Quote"
  description="Contact our qualified electricians for a free quote on electrical work in Staffordshire."
  pageType="contact"
  schemaType="ContactPage"
>
  <!-- Contact form and content -->
</Layout>
```

**FAQ Page with Schema:**
```astro
---
// src/pages/index.astro
import Layout from "../layouts/Layout.astro";
import { defaultElectricalFaqItems } from "../components/Faq.astro";
---
<Layout 
  title="Ohmnium Electricians - Professional Electrical Services"
  description="Professional electrical services in Staffordshire. Qualified electricians for inspections, fault finding, rewiring."
  pageType="default"
  schemaType="FAQPage"
  faqItems={defaultElectricalFaqItems}
>
  <!-- Page content including FAQ component -->
</Layout>
```

**Blog Post:**
```astro
---
// src/pages/blog/[slug].astro
import Layout from "../../layouts/Layout.astro";

// Get blog post data...
const { title, content, date, author } = post;
---
<Layout 
  title={title}
  description={excerpt}
  pageType="blog"
  type="article"
  schemaType="BlogPosting"
  datePublished={date}
  author={author}
>
  <!-- Blog post content -->
</Layout>
```

### FAQ Schema Architecture

The FAQ schema implementation follows a clean, reusable pattern:

1. **FAQ data is defined once** in `Faq.astro` component
2. **Interface is exported** for type safety across components
3. **Schema requires explicit FAQ data** - no hidden fallbacks
4. **Easy to extend** for different FAQ sets on different pages

**Creating Custom FAQ Sets:**
```astro
---
// For a services page with specific FAQ
import type { AccordionItem } from "../components/Faq.astro";

const servicesFaqItems: AccordionItem[] = [
  {
    title: "Do you offer emergency repairs?",
    content: "Yes, we provide 24/7 emergency electrical repair services..."
  },
  {
    title: "Are your electricians certified?",
    content: "All our electricians are fully qualified and NICEIC registered..."
  }
];
---
<Layout 
  schemaType="FAQPage"
  faqItems={servicesFaqItems}
>
```

### SEO Benefits

**Search Engine Optimization:**
- Proper meta tags for search result snippets
- Open Graph for social media sharing
- Structured data for rich snippets
- FAQ schema for FAQ rich results
- LocalBusiness schema for business information and star ratings
- Organization schema for business information

**Rich Results Potential:**
- FAQ sections may appear as expandable results in Google
- Blog posts get proper article markup
- Business information appears in knowledge panels with star ratings
- LocalBusiness schema enables rich snippets with reviews and ratings
- Social shares display proper previews

### LocalBusiness Schema Implementation

The project includes a comprehensive LocalBusiness schema implementation that enables star ratings and rich business information to appear in search engine results pages (SERPs).

#### Key Features:

**Star Ratings in Search Results:**
- Aggregate rating calculation (5.0 average from reviews)
- Individual review schema with author details
- Professional service categorization for electrical services
- Google Places API compatible review structure

**Business Information Schema:**
- Complete business contact details (name, phone, email)
- Service area definition (geographic targeting)
- Business hours and availability
- Professional service categories
- Location and address information

#### Usage Example:

```astro
---
// src/pages/index.astro
import Layout from '../layouts/Layout.astro';
import { reviews, getAverageRating, getTotalReviews } from '../data/reviews';

const businessDetails = {
  schemaType: "LocalBusiness" as const,
  businessName: "Ohmnium Electrical Services",
  businessType: "ElectricalContractor",
  reviews: reviews,
  address: {
    streetAddress: "123 Electric Avenue",
    addressLocality: "Stafford",
    addressRegion: "Staffordshire",
    postalCode: "ST16 1AB",
    addressCountry: "GB"
  },
  phoneNumber: "+44 1785 123456",
  email: "info@ohmnium.co.uk"
};
---

<Layout {...businessDetails}>
  <!-- Page content -->
</Layout>
```

#### Review Data Structure:

The project uses centralized review data in `/src/data/reviews.ts`:

```typescript
export interface Review {
  author: string;
  rating: number;
  text: string;
  datePublished: string;
}

export const reviews: Review[] = [
  {
    author: "Sarah Johnson",
    rating: 5,
    text: "Outstanding electrical work! Professional, punctual, and reasonably priced.",
    datePublished: "2024-01-15"
  },
  // ... more reviews
];

export function getAverageRating(): number;
export function getTotalReviews(): number;
```

This implementation ensures that search engines can display:
- ⭐⭐⭐⭐⭐ 5.0 star rating in search results
- Business name, phone, and service area
- Individual customer reviews
- Professional service categorization

### Error Handling

The components include proper error handling:

```astro
// HeadSeo.astro - FAQ schema validation
if (schemaType === "FAQPage") {
  if (!faqItems || faqItems.length === 0) {
    throw new Error("FAQPage schema requires faqItems to be provided");
  }
  // Generate FAQ schema...
}
```

This ensures that FAQ schema is only generated when proper FAQ data is provided, preventing empty or malformed structured data.

## 🔧 Configuration

### Config.ts and Environment Variables

The project uses a centralized configuration system via `/src/config.ts` that interfaces with environment variables:

```typescript
// src/config.ts
export const WP_SITE = import.meta.env.WP_SITE || "https://techcrunch.com";
export const WP_API_URL = `${WP_SITE}/wp-json/wp/v2`;
```

**Purpose of config.ts:**
- **Centralized Configuration**: Single source of truth for all site-wide settings
- **Environment Variable Processing**: Safely handles environment variables with fallbacks
- **API URL Construction**: Automatically builds WordPress REST API endpoints
- **Type Safety**: Provides TypeScript support for configuration values
- **Default Values**: Ensures the site works even without environment variables set

**Relationship to .env Files:**
- Environment variables are accessed via `import.meta.env` (Astro's environment variable system)
- Variables prefixed with `WP_` are available in the browser (public variables)
- Other variables like `OPENAI_API_KEY` are server-side only for security
- The config.ts file processes these variables and provides sensible defaults

**Key Environment Variables:**

## Environment variables can be set in a `.env` file at the root of the project:

```env
# WordPress Configuration
WP_SITE=https://techcrunch.com
OPENAI_API_KEY=your_openai_api_key_here

# Contact Form Configuration (Required for netlify/functions/contact.js)
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=noreply@yourdomain.com
BUSINESS_EMAIL=contact@yourdomain.com
BUSINESS_NAME=Your Business Name
DOMAIN=yourdomain.com
SITE_URL=https://yourdomain.com
NODE_ENV=production
```

## 🎯 SEO & Search Engine Optimization

This project includes comprehensive SEO optimization with automated sitemap generation and search engine crawler guidance.

### 🗺️ Sitemap

**URL:** `https://ohmnium.co.uk/sitemap.xml`

The sitemap automatically includes:
- **Static Pages**: Homepage, About, Services, Contact, Blog Index
- **Dynamic Blog Posts**: All WordPress posts via REST API (up to 100 posts)
- **SEO Metadata**: Last modified dates, change frequency, and priority values
- **Real-time Updates**: Fetches latest WordPress content on each request
- **Caching**: 1-hour cache for optimal performance

#### Sitemap Structure:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://ohmnium.co.uk</loc>
    <lastmod>2025-06-06T00:00:00.000Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Static pages + Dynamic WordPress blog posts -->
</urlset>
```

### 🤖 Robots.txt

**URL:** `https://ohmnium.co.uk/robots.txt`

Provides comprehensive crawler guidance:
- **Allow**: All main content pages (`/`, `/about`, `/services`, `/contact`, `/blog/*`)
- **Disallow**: API endpoints, admin areas, build files (`/api/`, `/.netlify/`, `/_astro/`)
- **Sitemap Reference**: Points to the dynamic sitemap
- **Crawl Delay**: Respectful 1-second delay between requests
- **Bot Management**: Specific rules for Google, Bing, Yahoo, and blocks SEO crawlers

#### Key Features:
- ✅ **Search Engine Friendly**: Explicit guidance for major search engines
- ✅ **Performance Optimized**: Prevents crawling of unnecessary files
- ✅ **Security**: Blocks access to admin and private areas
- ✅ **Bad Bot Protection**: Blocks known SEO tool crawlers

### 📊 Google Search Console Setup

1. **Verify Domain**: Add `https://ohmnium.co.uk` to Google Search Console
2. **Submit Sitemap**: Navigate to Sitemaps → Add `https://ohmnium.co.uk/sitemap.xml`
3. **Monitor**: Check indexing status and any crawl errors
4. **Test**: Use robots.txt tester to verify crawler access

### 🔧 Static SEO File Generation

The project includes an optional script for generating static SEO files when needed:

```bash
# Generate static sitemap.xml and robots.txt files
npm run generate:seo

# Build project with SEO files generation
npm run build:seo
```

#### When to Use Static Generation:

**Use `npm run generate:seo` when:**
- **Pre-deployment testing**: Generate files locally to preview exact sitemap content
- **Build pipeline integration**: Some hosting providers require static files during build
- **CDN caching**: Create static files for better caching on content delivery networks
- **Backup/redundancy**: Generate fallback files if dynamic endpoints fail
- **WordPress API down**: Ensure sitemap exists even if WordPress API is temporarily unavailable

**Don't use static generation if:**
- **Blog updates frequently**: Dynamic endpoints automatically include new posts
- **Real-time accuracy needed**: Static files become outdated quickly
- **Hosting supports dynamic routes**: Netlify/Vercel handle dynamic endpoints natively
- **WordPress content changes often**: Static files won't reflect latest content

#### Static vs Dynamic Files:

| Feature | Dynamic Endpoints | Static Files |
|---------|------------------|--------------|
| **Content Updates** | ✅ Real-time WordPress posts | ❌ Requires regeneration |
| **Performance** | ✅ Cached (1 hour) | ✅ Instant serving |
| **Accuracy** | ✅ Always current | ❌ Can become outdated |
| **Reliability** | ⚠️ Depends on WordPress API | ✅ Always available |
| **Maintenance** | ✅ Zero maintenance | ❌ Manual updates needed |

**Recommendation**: Use dynamic endpoints by default. Only generate static files for specific deployment requirements or as backup files.

## 📦 Installation

## 🏃‍♂️ Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Create a `.env` file with required environment variables
4. Run the development server with `npm run dev`
5. Build for production with `npm run build`

## 📚 Additional Resources

- [Astro Documentation](https://docs.astro.build)
- [Alpine.js Documentation](https://alpinejs.dev/start-here)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [WordPress REST API Documentation](https://developer.wordpress.org/rest-api/)
