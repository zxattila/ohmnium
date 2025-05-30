# Ohmnium

A modern, component-based static website built with Astro, Alpine.js, and TailwindCSS that fetches dynamic content from WordPress via the REST API v2.

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

- `WP_SITE`: The WordPress site URL (default: "https://techcrunch.com")
- `OPENAI_API_KEY`: API key for OpenAI integration

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
