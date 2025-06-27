# Ohmnium

A modern, component-based static website built with Astro, Alpine.js, and TailwindCSS that fetches dynamic content from WordPress via the REST API v2.

## 📋 Table of Contents

- [🚀 Project Overview](#-project-overview)
- [🧩 Tech Stack](#-tech-stack)
- [💻 Component Architecture](#-component-architecture)
- [🔧 Configuration](#-configuration)
- [🎯 SEO & Search Engine Optimization](#-seo--search-engine-optimization)
- [🧭 Breadcrumbs Navigation](#-breadcrumbs-navigation)
- [Tailwind Snippets](#tailwind-snippets)
- [📏 Tailwind Sizing Pattern](#-tailwind-sizing-pattern)
- [🖼️ Image Optimization & Browser Compatibility](#️-image-optimization--browser-compatibility)
- [🔍 SEO Components](#-seo-components-headmetas--headseo)
- [🔧 Font Optimization & Performance](#-font-optimization--performance)
- [📦 Installation](#-installation)
- [🏃‍♂️ Getting Started](#️-getting-started)
- [� URL Parameters for Testing & Cache-Busting](#-url-parameters-for-testing--cache-busting)
- [�📚 Additional Resources](#-additional-resources)

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

## 🧭 Breadcrumbs Navigation

The Breadcrumbs component provides semantic, accessible navigation using DaisyUI + Tailwind styling with SEO-optimized structured data.

### Component Overview

The Breadcrumbs component (`src/components/Breadcrumbs.astro`) displays navigational breadcrumbs that:

- Render accessible semantic HTML (`<nav>` with `aria-label="Breadcrumb"`)
- Highlight the current page with `aria-current="page"`
- Add structured `BreadcrumbList` JSON-LD for SEO
- Support automatic path generation via `generateBreadcrumbs()` utility
- Include a home icon using Heroicons mini inline SVG

### Parameters

The component accepts a single prop:

#### `items` (required)
**Type:** `Array<{ name: string, url: string }>`

An array of breadcrumb objects, each containing:
- `name`: Display text for the breadcrumb
- `url`: Navigation URL for the breadcrumb

**Example:**
```typescript
const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Services", url: "/services" },
  { name: "EV Charging", url: "/services/ev-charging" }
];
```

### Usage Examples

#### Basic Usage
```astro
---
import Breadcrumbs from "../components/Breadcrumbs.astro";

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "About", url: "/about" }
];
---

<Breadcrumbs items={breadcrumbs} />
```

#### Automatic Generation (Recommended)
```astro
---
import Breadcrumbs from "../components/Breadcrumbs.astro";
import { generateBreadcrumbs } from "../utils/generateBreadcrumbs";

const breadcrumbs = generateBreadcrumbs(Astro.url.pathname);
---

<Breadcrumbs items={breadcrumbs} />
```

### Automatic Breadcrumb Generation

The `generateBreadcrumbs()` utility (`src/utils/generateBreadcrumbs.ts`) automatically creates breadcrumbs from URL paths:

#### Parameters
- `pathname` (string): The URL pathname (e.g., from `Astro.url.pathname`)

#### Features
- **Automatic Home Link**: Always includes "Home" as the first breadcrumb
- **Slug Transformation**: Converts URL slugs to readable names (e.g., `"ev-charging"` → `"Ev Charging"`)
- **Label Overrides**: Custom mappings for specific slugs via `labelOverrides` object

#### Label Overrides
Customize how specific URL segments appear in breadcrumbs:

```typescript
const labelOverrides: Record<string, string> = {
  "ev-charging": "EV Charging",
  "about": "About Us",
  "contact": "Contact",
  // Add more overrides as needed
};
```

#### Example Transformations
| URL Path | Generated Breadcrumbs |
|----------|----------------------|
| `/` | Home |
| `/about` | Home → About Us |
| `/services` | Home → Services |
| `/services/ev-charging` | Home → Services → EV Charging |
| `/blog/latest-news` | Home → Blog → Latest News |

### SEO Features

The component automatically generates structured data for search engines:

#### JSON-LD Schema
- **Type**: `BreadcrumbList`
- **Position**: Sequential numbering for each breadcrumb
- **Item**: Full URL for each breadcrumb step

#### Accessibility
- Semantic `<nav>` element with `aria-label="Breadcrumb"`
- Current page marked with `aria-current="page"`
- Keyboard navigation support
- Screen reader friendly

### Styling & Design

#### Default Styling
- Uses DaisyUI `.breadcrumbs` base class
- Text size: `text-sm`
- Margin bottom: `mb-4`
- Flex layout with gap: `gap-2`

#### Visual Elements
- **Home Icon**: Heroicons mini house icon for first breadcrumb
- **Current Page**: Bold text (`font-semibold`) in gray (`text-gray-800`)
- **Links**: Blue color (`text-blue-600`) with hover underline
- **Separators**: Handled automatically by flex layout and gaps

#### Responsive Behavior
- Wraps on small screens (`flex-wrap`)
- Maintains consistent spacing across breakpoints

### Implementation in Layouts

Add breadcrumbs to your page layouts for consistent navigation:

#### Layout.astro Example
```astro
---
import Breadcrumbs from "../components/Breadcrumbs.astro";
import { generateBreadcrumbs } from "../utils/generateBreadcrumbs";

interface Props {
  title: string;
  // ... other props
}

const { title } = Astro.props;
const breadcrumbs = generateBreadcrumbs(Astro.url.pathname);
---

<html>
  <head>
    <!-- ... head content -->
  </head>
  <body>
    <Navigation />
    <main>
      <Breadcrumbs items={breadcrumbs} />
      <slot />
    </main>
  </body>
</html>
```

#### Page-Specific Implementation
```astro
---
// src/pages/services/ev-charging.astro
import Layout from "../../layouts/Layout.astro";
import Breadcrumbs from "../../components/Breadcrumbs.astro";
import { generateBreadcrumbs } from "../../utils/generateBreadcrumbs";

const breadcrumbs = generateBreadcrumbs(Astro.url.pathname);
// Results in: Home → Services → EV Charging
---

<Layout title="EV Charging Services">
  <Breadcrumbs items={breadcrumbs} />
  <!-- Page content -->
</Layout>
```

### Testing & Debugging

#### Testing Breadcrumb Generation
```javascript
// Test in browser console or development
import { generateBreadcrumbs } from "./src/utils/generateBreadcrumbs";

console.log(generateBreadcrumbs("/services/ev-charging"));
// Output: [
//   { name: "Home", url: "/" },
//   { name: "Services", url: "/services" },
//   { name: "EV Charging", url: "/services/ev-charging" }
// ]
```

#### Verifying SEO Output
1. View page source in browser
2. Look for JSON-LD script tag:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [...]
}
</script>
```

#### Testing Accessibility
- Use screen reader to verify navigation announcements
- Test keyboard navigation (Tab key)
- Verify ARIA attributes in browser developer tools

### Performance Considerations

- **Static Generation**: Breadcrumbs are generated at build time
- **No JavaScript**: Pure HTML/CSS implementation (no client-side JS)
- **Minimal Bundle Impact**: Component adds ~1KB to page size
- **SEO Optimized**: Structured data improves search engine understanding

### Best Practices

1. **Consistent Placement**: Add breadcrumbs to the same location on all pages
2. **Label Overrides**: Use descriptive names for technical slugs
3. **URL Structure**: Design URL hierarchy to create logical breadcrumb paths
4. **Testing**: Verify breadcrumbs work correctly across all page types
5. **Accessibility**: Always include in layout templates for consistent UX

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
| `widths`     | `number[]`                | `[412, 640, 768, 1024, 1280, 1536]` | Mobile-first responsive breakpoint widths |
| `sizes`      | `string`                  | Tailwind responsive            | CSS sizes attribute                       |
| `formats`    | `string[]`                | `['avif', 'webp']`             | Output formats (with fallback)            |
| `quality`    | `number`                  | `80`                           | Image quality (1-100)                     |
| `class`      | `string`                  | `""`                           | CSS classes                               |

#### Detailed Attribute Guide

**`src` - Image Source (Required)**
```astro
import heroImage from "../assets/hero.jpg";
<Image src={heroImage} alt="Hero" />
```
- **Use ImageMetadata imports** from `/src/assets/` for optimization
- **Avoid string URLs** unless absolutely necessary (no optimization)
- **Astro processes imports** automatically with Sharp for best performance

**`alt` - Alternative Text (Required)**
```astro
<Image src={heroImage} alt="Professional electrician working on circuit board" />
```
- **Be descriptive and specific** - helps screen readers and SEO
- **Avoid "image of" or "picture of"** - screen readers already announce it's an image
- **Empty alt=""** only for decorative images that add no content value

**`usePicture` - Picture Element (Default: true)**
```astro
<!-- Uses <picture> with multiple sources -->
<Image src={heroImage} alt="Hero" usePicture={true} />

<!-- Uses single <img> tag -->
<Image src={heroImage} alt="Hero" usePicture={false} />
```
- **True (recommended)**: Creates `<picture>` element with multiple format sources
- **False**: Single `<img>` tag, still optimized but less browser compatibility
- **Best practice**: Keep default `true` for maximum compatibility

**`lazy` - Lazy Loading (Default: true)**
```astro
<!-- Lazy load (below-the-fold images) -->
<Image src={heroImage} alt="Hero" lazy={true} />

<!-- Eager load (above-the-fold images) -->
<Image src={heroImage} alt="Hero" lazy={false} />
```
- **True**: Loads when image enters viewport (saves bandwidth)
- **False**: Loads immediately (use for above-the-fold/hero images)
- **Mobile tip**: Always use `lazy={false}` for LCP (Largest Contentful Paint) images

**`widths` - Responsive Breakpoints (Default: [412, 640, 768, 1024, 1280, 1536])**
```astro
<!-- Mobile-first optimization (recommended) -->
<Image 
  src={heroImage} 
  alt="Hero"
  widths={[412, 640, 768, 1024, 1280]} 
/>

<!-- Card/component optimization -->
<Image 
  src={cardImage} 
  alt="Service"
  widths={[480, 640, 800, 1024]} 
/>
```
- **What it does**: Tells Astro to **generate** these specific image variants
- **Astro automatically creates**: `image_412w.webp`, `image_640w.webp`, etc.
- **Mobile-first approach**: Start with 412px (PageSpeed Insights optimal width)
- **Sharp processing**: Each variant is optimized with different compression settings
- **Build-time generation**: All variants created during `astro build`
- **Performance tip**: More widths = better optimization but longer build times
- **Rule of thumb**: 4-6 breakpoints cover most use cases efficiently

**`sizes` - CSS Sizes Attribute (Mobile-First)**
```astro
<!-- Mobile-first responsive (recommended) -->
<Image 
  src={heroImage} 
  alt="Hero"
  sizes="(max-width: 639px) 480px, (max-width: 767px) 640px, 1024px" 
/>

<!-- Card component sizing -->
<Image 
  src={cardImage} 
  alt="Service"
  sizes="(max-width: 639px) 480px, (max-width: 1023px) 320px, 280px" 
/>
```
- **What it does**: Tells the **browser** which image variant to download
- **Mobile-first logic**: Use `max-width` for intuitive, safe fallbacks
- **How it works together with widths**:
  1. `widths` generates the variants at build time
  2. `sizes` tells browser which variant to use at runtime
  3. Browser picks first matching condition, downloads that variant
- **Performance impact**: Wrong sizes = downloading oversized images
- **Common patterns**:
  - Full width mobile: `(max-width: 768px) 100vw, 50vw`
  - Card grids: `(max-width: 639px) 480px, (max-width: 1023px) 320px, 280px`
  - Hero sections: `(max-width: 767px) 100vw, 1200px`

**`formats` - Output Formats (Default: ['avif', 'webp'])**
```astro
<!-- Modern formats with fallback -->
<Image 
  src={heroImage} 
  alt="Hero"
  formats={['avif', 'webp']} 
/>

<!-- Conservative approach -->
<Image 
  src={heroImage} 
  alt="Hero"
  formats={['webp']} 
/>
```
- **AVIF**: Best compression (~50% smaller than JPEG), newer browser support
- **WebP**: Good compression (~30% smaller than JPEG), wide browser support
- **Automatic fallback**: Original format (JPEG/PNG) always included
- **Order matters**: Most preferred format first

**`quality` - Image Quality (Default: 80)**
```astro
<!-- High quality for hero images -->
<Image src={heroImage} alt="Hero" quality={90} />

<!-- Optimized for mobile/texture -->
<Image src={textureImg} alt="" quality={65} />

<!-- Aggressive compression for thumbnails -->
<Image src={thumbnailImg} alt="Thumbnail" quality={50} />
```
- **Range**: 1-100 (higher = better quality, larger file size)
- **Recommendations**:
  - **90-95**: Hero images, critical visuals
  - **80-85**: Standard photos, marketing images
  - **65-75**: Background textures, patterns
  - **50-65**: Thumbnails, small images
- **Mobile consideration**: Lower quality acceptable due to smaller screens

**`class` - CSS Classes**
```astro
<!-- Tailwind utility classes -->
<Image 
  src={heroImage} 
  alt="Hero"
  class="w-full h-64 object-cover rounded-lg shadow-md" 
/>

<!-- Custom component styling -->
<Image 
  src={heroImage} 
  alt="Hero"
  class="hero-image fade-in" 
/>
```
- **Standard CSS classes** - works like any other HTML element
- **Tailwind CSS**: Responsive utilities, object-fit, aspect ratios
- **Custom classes**: Define in your stylesheets for reusable styles

#### Performance Impact

- **File size reduction**: ~75% smaller with WebP/AVIF
- **Responsive loading**: Only loads appropriate size
- **Lazy loading**: Improves initial page load
- **Format negotiation**: Browser gets best supported format

#### 🔧 How Astro Generates Images

**Build-Time Process:**
```bash
# During astro build, Sharp processes images
Input:  hero.jpg (2400×1600px, 1.2MB)
Output: hero_412w.webp (412×275px, 45KB)
        hero_640w.webp (640×427px, 72KB)  
        hero_768w.webp (768×512px, 89KB)
        hero_1024w.webp (1024×683px, 125KB)
        hero_1280w.webp (1280×853px, 165KB)
        hero_1536w.webp (1536×1024px, 210KB)
```

**Format Generation:**
```astro
formats={['avif', 'webp']}
<!-- Generates both formats for each width -->
hero_412w.avif   (smallest file, newest browsers)
hero_412w.webp   (fallback, wide support)
hero_412w.jpg    (final fallback, original format)
```

**Runtime Behavior:**
```html
<!-- Browser receives optimized HTML -->
<picture>
  <source srcset="hero_412w.avif 412w, hero_640w.avif 640w..." type="image/avif">
  <source srcset="hero_412w.webp 412w, hero_640w.webp 640w..." type="image/webp">
  <img src="hero_1536w.jpg" 
       srcset="hero_412w.jpg 412w, hero_640w.jpg 640w..."
       sizes="(max-width: 639px) 412px, (max-width: 767px) 640px, 1024px">
</picture>
```

#### ⚡ Mobile-First Best Practices

**Why Mobile-First?**
```astro
<!-- ✅ Mobile-first: Safe fallbacks -->
sizes="(max-width: 639px) 480px, (max-width: 767px) 640px, 1024px"
<!-- Logic: Small screens get small images, unknown large screens get medium images -->

<!-- ❌ Desktop-first: Risky fallbacks -->  
sizes="(min-width: 1024px) 280px, (min-width: 640px) 640px, 1200px"
<!-- Logic: Large screens get small images, unknown small screens get huge images -->
```

**Performance Benefits:**
- **PageSpeed Insights**: 412px optimized for mobile testing viewport
- **Data savings**: Mobile users get appropriately sized images
- **Safe fallbacks**: Unknown devices err on smaller, faster images
- **Consistent with Tailwind**: Matches `sm:`, `md:`, `lg:` breakpoint logic

**Tailwind Breakpoint Alignment:**
```astro
<!-- Matches Tailwind's mobile-first approach -->
widths={[412, 640, 768, 1024, 1280]}        // sm, md, lg, xl
sizes="(max-width: 639px) 412px,            // below sm:
       (max-width: 767px) 640px,            // sm: to md:
       (max-width: 1023px) 768px,           // md: to lg:
       1024px"                              // lg: and above
```

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

- **Responsive Images**: Multiple sizes (412px to 1536px) for different screens
- **Modern Formats**: WebP and AVIF for 60-80% smaller file sizes
- **Smart Loading**: No lazy loading for above-the-fold content
- **Quality Optimization**: Balanced quality (65-85%) for fast loading

#### Components Using Image.astro

The optimized Image component is used throughout the site for consistent performance:

**🏠 Hero Components:**
- **`Hero.astro`** - Homepage hero background (noisier texture)
  - Mobile-first: `[240, 320, 480, 640, 800]`
  - Quality: 65 (background texture)
  - Formats: `['webp', 'avif']`

- **`PageHeader.astro`** - Inner page headers (all service pages)
  - Mobile-first: `[412, 640, 768, 1024, 1280]`
  - Quality: 65 (consistent across backgrounds)
  - Formats: `['webp', 'avif']`

**🎴 Content Components:**
- **`Card.astro`** - Service cards with responsive images
  - Card-optimized: `[412, 500, 612]`
  - Quality: 85 (higher for content images)
  - Formats: `['webp', 'avif']`

- **`CardColumns.astro`** - Uses Card component for service grids
  - Inherits Card.astro image settings
  - Grid layout: `lg:grid-cols-4 sm:grid-cols-2`

**🔧 Utility Components:**
- **`ImageText.astro`** - Text/image layout combinations
- **`PostItem.astro`** - Blog post thumbnails (when available)

**📱 Mobile-First Optimization:**
All components now use consistent mobile-first approach:
```astro
// Standard mobile-first pattern
widths={[412, 640, 768, 1024, 1280]}
sizes="(max-width: 639px) 412px, (max-width: 767px) 640px, (max-width: 1023px) 768px, 1024px"
```

**🎯 PageSpeed Benefits:**
- **412px optimization**: Perfect for PageSpeed Insights mobile testing
- **Consistent breakpoints**: Aligned with Tailwind's mobile-first approach
- **Format consistency**: WebP-first for maximum browser compatibility

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

### Social Sharing Images

The HeadMetas component supports custom social sharing images for individual pages. When sharing your pages on social media platforms (Facebook, Twitter, LinkedIn, WhatsApp), you can specify custom images for better engagement.

**Adding Custom Social Images:**

1. **For Imported Assets (RECOMMENDED - Gets Optimized):**
   ```astro
   ---
   import Layout from "../layouts/Layout.astro";
   import customSocialImg from "../assets/my-social-image.jpg";
   ---
   <Layout
     title="Your Page Title"
     description="Your page description"
     image={customSocialImg}
     imageWidth={1200}
     imageHeight={630}
     // ...other props
   >
   ```

2. **For String Paths (Not Optimized):**
   ```astro
   ---
   import Layout from "../layouts/Layout.astro";
   ---
   <Layout
     title="Your Page Title"
     description="Your page description"
     image="/social/my-image.jpg"
     imageWidth={1200}
     imageHeight={630}
   >
     <!-- Page content -->
   </Layout>
   ```

3. **Example implementation:**
   ```astro
   ---
   // src/pages/about.astro
   import Layout from "../layouts/Layout.astro";
   import aboutSocialImg from "../assets/about-social.jpg";
   ---
   <Layout
     title="Our Story | Ohmnium Electricians"
     description="Meet the founder of Ohmnium Electricians and discover the values driving our trusted electrical services."
     pageType="about"
     schemaType="AboutPage"
     image={aboutSocialImg}
     imageWidth={1200}
     imageHeight={630}
   >
     <!-- Page content -->
   </Layout>
   ```

**Directory Structure for Social Images:**

```
src/
  assets/                    ← ADD YOUR IMAGES HERE (RECOMMENDED)
    fallback.jpg            ← Default social image (optimized)
    about-social.jpg        ← Custom social image for about page
    services-social.jpg     ← Custom social image for services page
    blog-social.jpg         ← Custom social image for blog
    your-custom-image.jpg   ← Your custom images
    
public/                     ← Alternative (not optimized)
  social/                   ← Optional directory for public images
    my-image.jpg           ← Public images (not optimized by Astro)
```

**Optimization Behavior:**

✅ **Imported from `/src/assets/`** (RECOMMENDED):
- **Automatically optimized** using Astro + Sharp
- **Format**: Converted to JPEG for social media compatibility
- **File size**: Optimized (typically 80-90% reduction)
- **Quality**: 85% (perfect balance for social media)
- **Dimensions**: Resized to specified width/height
- **Example**: `1137kB → 253kB` (77% reduction)

❌ **String paths** (like `"/social/my-image.jpg"`):
- **Not optimized** - used as-is
- **File size**: Original size (may be too large for WhatsApp)
- **Format**: Original format (may not be compatible)
- Use only for external URLs or when optimization isn't needed

**Image Specifications:**
- **Recommended size:** 1200x630px (optimal for all platforms including Facebook)
- **Format:** JPG or PNG (source) → automatically converted to JPEG for social media
- **File size:** Under 300KB for optimal social media loading (especially WhatsApp)
- **Fallback:** If no image is specified, automatically uses an optimized version of `/fallback.jpg`

**What happens automatically:**
- Custom images imported from assets are automatically optimized for social media
- Custom images are converted to JPEG format for maximum compatibility
- Falls back to an optimized JPEG version of the fallback image when no custom image is provided
- Fallback image is automatically compressed from 1.1MB to ~250KB using Astro's Sharp optimization
- Proper image dimensions (1200x630) are applied to meta tags
- JPEG format ensures maximum compatibility across all social media platforms
- Works reliably across Facebook, LinkedIn, Twitter, and WhatsApp

### Testing Social Media Sharing

After implementing custom social images, you'll need to test how they appear on different social media platforms. This section covers testing strategies and common troubleshooting methods.

#### Testing Methods

**1. Direct Platform Testing:**
- **WhatsApp**: Send the URL to yourself or a test contact
- **Facebook**: Create a test post (you can delete it afterward)
- **LinkedIn**: Share as a post or in a message
- **Twitter**: Create a tweet with the URL

**2. Online Testing Tools:**
- **Facebook Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/

#### Cache Issues & Solutions

Social media platforms aggressively cache link previews. If you see outdated information (like localhost URLs or old images), the platform likely has a cached version.

**🚨 Common Cache Problems:**
- Showing "localhost" instead of your domain
- Displaying old images after you've updated them
- Wrong titles or descriptions from previous versions

**✅ Cache Busting Solutions:**

**Method 1: URL Parameters (Recommended)**
Add any parameter to create a "new" URL that bypasses cache:

```
https://ohmnium.co.uk/?v=2025
https://ohmnium.co.uk/?test=1
https://ohmnium.co.uk/?refresh=true
https://ohmnium.co.uk/about/?updated=jan2025
```

**Why it works**: Social platforms cache based on the exact URL. Adding `?v=2025` makes it a completely new URL to their cache system, but doesn't affect your site.

**Method 2: Facebook Debugger Force Refresh**
1. Go to: https://developers.facebook.com/tools/debug/
2. Enter your URL: `https://ohmnium.co.uk`
3. Click "Debug"
4. Click "Scrape Again" to force refresh
5. This also updates WhatsApp's cache (same system)

**Method 3: Test Different Pages**
If the homepage is cached, try subpages:
```
https://ohmnium.co.uk/about/
https://ohmnium.co.uk/services/
https://ohmnium.co.uk/contact/
```

**Method 4: Wait for Natural Expiry**
Cache typically expires in 24-48 hours, but this isn't practical for testing.

#### Development vs Production Testing

**⚠️ Important**: Always test social sharing using your **production URL**, not localhost.

**Wrong**: 
```
❌ http://localhost:4321 → Will show "localhost" in previews
```

**Correct**:
```
✅ https://ohmnium.co.uk → Will show "ohmnium.co.uk" in previews
```

**Testing Workflow:**
1. Make changes to social images/meta tags
2. Build and deploy to production: `npm run build`
3. Test with production URL + cache-busting parameter
4. Example: `https://ohmnium.co.uk/?test=v2`

#### Troubleshooting Checklist

**If social previews aren't working:**

1. **Check the URL you're testing**
   - ✅ Using production URL (https://ohmnium.co.uk)
   - ❌ Using localhost (http://localhost:4321)

2. **Try cache busting**
   - Add `?v=2025` to your URL
   - Test with Facebook Debugger

3. **Verify meta tags in source**
   - View page source in browser
   - Look for `<meta property="og:image"` tags
   - Confirm URLs show production domain

4. **Check image accessibility**
   - Copy the `og:image` URL from meta tags
   - Paste it directly in browser to verify it loads
   - Should show optimized JPEG version

5. **Test different platforms**
   - WhatsApp (mobile app works best)
   - Facebook (desktop or mobile)
   - LinkedIn (desktop recommended)
   - Twitter (any platform)

#### Best Practices

**For Development:**
- Always test social sharing with production URLs
- Use the parameter trick (`?test=1`) during active development
- Keep Facebook Debugger bookmarked for quick testing

**For Production:**
- Test social sharing after every deployment
- Use different parameters for different updates: `?v=jan2025`, `?v=feb2025`
- Document which URLs you've tested to avoid confusion

**Pro Tips:**
- WhatsApp mobile app works better than WhatsApp Web for testing
- Facebook Debugger shows the most detailed preview information
- Cache issues are normal - don't panic, just use the solutions above
- If you're still seeing localhost, double-check you're testing the production URL

## 🔧 URL Parameters for Testing & Cache-Busting

This section documents the various URL parameters that can be used for testing social media sharing, forcing cache refreshes, and debugging purposes.

### Overview

URL parameters are query strings added to the end of URLs that don't affect the actual page content but can be used to bypass caches, track sources, or trigger specific behaviors in testing tools.

**Format**: `https://ohmnium.co.uk/page?parameter=value&another=value2`

### Cache-Busting Parameters

Use these parameters to force social media platforms to fetch fresh meta tags and images:

#### Version Parameters
**Purpose**: Mark different versions/updates of content
```
?v=2025          # Simple version number
?version=1.2     # Semantic versioning
?ver=jan2025     # Date-based versioning
?update=latest   # Update indicator
```

#### Testing Parameters
**Purpose**: Indicate testing/development context
```
?test=1          # Simple test flag
?testing=true    # Boolean test flag
?debug=social    # Debug specific feature
?preview=share   # Preview sharing
?dev=cache       # Development cache-bust
```

#### Timestamp Parameters
**Purpose**: Unique identifiers using time
```
?t=1704067200    # Unix timestamp
?ts=20250101     # Date timestamp (YYYYMMDD)
?time=now        # Current time indicator
?refresh=true    # Refresh indicator
```

### Platform-Specific Testing

Different social media platforms may cache content differently. Use specific parameters for targeted testing:

#### Facebook Testing
```
?fb=test         # Facebook-specific test
?facebook=debug  # Facebook debugging
?meta=refresh    # Meta platforms refresh
```

#### WhatsApp Testing
```
?wa=test         # WhatsApp-specific test
?whatsapp=1      # WhatsApp indicator
?mobile=share    # Mobile sharing test
```

#### LinkedIn Testing
```
?li=test         # LinkedIn-specific test
?linkedin=debug  # LinkedIn debugging
?business=share  # Business sharing test
```

#### Twitter/X Testing
```
?tw=test         # Twitter/X-specific test
?twitter=debug   # Twitter debugging
?x=share         # X platform test
```

### Development & Debugging Parameters

Use these parameters during development and debugging:

#### Environment Indicators
```
?env=dev         # Development environment
?stage=test      # Staging environment
?mode=debug      # Debug mode
?local=false     # Not local (production test)
```

#### Feature Testing
```
?feature=og      # Test Open Graph tags
?test_social=1   # Test social sharing
?meta_debug=1    # Debug meta tags
?seo_test=true   # SEO testing
```

#### Cache Control
```
?nocache=1       # No cache indicator
?fresh=true      # Fresh content request
?bust=cache      # Cache busting
?reload=force    # Force reload
```

### Real-World Testing Examples

#### After Updating Social Images
```bash
# Test with version parameter
https://ohmnium.co.uk/?v=2025

# Test specific page with update indicator
https://ohmnium.co.uk/about/?updated=jan2025

# Test with timestamp
https://ohmnium.co.uk/services/?t=1704067200
```

#### During Active Development
```bash
# Test development changes
https://ohmnium.co.uk/?dev=test&v=1

# Debug social sharing
https://ohmnium.co.uk/contact/?debug=social&test=1

# Preview new feature
https://ohmnium.co.uk/services/?preview=new&nocache=1
```

#### Platform-Specific Testing Workflow
```bash
# Facebook Debugger testing
https://ohmnium.co.uk/?fb=debug&v=2025

# WhatsApp mobile sharing
https://ohmnium.co.uk/about/?wa=test&mobile=1

# LinkedIn business sharing
https://ohmnium.co.uk/services/?li=debug&business=1
```

### Parameter Best Practices

#### Naming Conventions
- **Use descriptive names**: `?test=social` instead of `?t=1`
- **Be consistent**: Use same parameters across different pages
- **Keep it simple**: Avoid overly complex parameter combinations

#### Value Conventions
- **Dates**: Use ISO format or readable formats (`20250101`, `jan2025`)
- **Versions**: Use semantic versioning when possible (`1.2.3`)
- **Booleans**: Use `true/false` or `1/0` consistently
- **Flags**: Use simple names (`test`, `debug`, `preview`)

#### Documentation
- **Track what you test**: Document which parameters you've used
- **Share with team**: Ensure everyone uses consistent parameters
- **Clean up**: Remove old parameters after testing is complete

### Testing Workflow with Parameters

#### Step-by-Step Process

1. **Make your changes** (update images, meta tags, content)
2. **Build and deploy** to production
3. **Choose parameter strategy**:
   ```bash
   # For major updates
   ?v=2025
   
   # For specific features
   ?test=social&v=1
   
   # For debugging
   ?debug=og&refresh=true
   ```

4. **Test across platforms**:
   - Facebook Debugger: `https://developers.facebook.com/tools/debug/?q=https://ohmnium.co.uk/?v=2025`
   - WhatsApp: Share the URL with parameter in mobile app
   - LinkedIn: Post the URL with parameter
   - Twitter: Tweet the URL with parameter

5. **Verify results**:
   - Check that meta tags show production domain
   - Confirm images load correctly
   - Verify titles and descriptions are current

6. **Clean up**: Once testing is complete, the original URL (without parameters) will work normally

### Troubleshooting with Parameters

#### If Parameters Don't Work
1. **Check parameter format**: Ensure proper `?key=value` syntax
2. **Try different parameter names**: Some platforms may ignore certain parameters
3. **Use Facebook Debugger**: Most reliable way to force refresh
4. **Wait**: Sometimes caches take time to clear even with parameters

#### Common Issues
```bash
# ❌ Wrong format
https://ohmnium.co.uk/&test=1     # Should use ? not &

# ✅ Correct format  
https://ohmnium.co.uk/?test=1

# ❌ Multiple ? symbols
https://ohmnium.co.uk/?v=1?test=2 # Should use & for second parameter

# ✅ Correct multiple parameters
https://ohmnium.co.uk/?v=1&test=2
```

#### When Parameters Aren't Enough
If parameters don't work, try these alternatives:
1. **Facebook Debugger**: Force refresh through developer tools
2. **Different platforms**: Test on platforms that cache less aggressively
3. **Wait longer**: Some caches may take hours to clear
4. **Contact platform support**: For persistent issues

### Advanced Parameter Strategies

#### Conditional Testing
```bash
# Test different scenarios
?scenario=new_user     # New user experience
?scenario=returning    # Returning user test
?context=mobile        # Mobile context
?context=desktop       # Desktop context
```

#### A/B Testing Indicators
```bash
# Test different versions
?variant=a             # Version A
?variant=b             # Version B
?test_group=control    # Control group
?test_group=experiment # Experiment group
```

#### Analytics Tracking
```bash
# Track source of social sharing tests
?utm_source=test       # Testing source
?utm_medium=social     # Social medium
?utm_campaign=debug    # Debug campaign
?ref=cache_test        # Cache test reference
```

Remember: These parameters are tools for testing and development. In production, users will typically access the clean URLs without parameters, and the cached versions will eventually update naturally.
