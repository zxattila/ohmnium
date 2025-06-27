# Open Graph Images for Social Media Sharing

This file contains guidelines and examples for using custom Open Graph images in your Astro project.

Add the opengraph images to the `/src/assets/social` folder

The URLs should point to images that are suitable for Open Graph sharing.

> Example snippet of how to use on pages:

```astro
---
// Example: How to use custom social media images in your pages
import Layout from "../layouts/Layout.astro";

// Method 1: Import from assets (RECOMMENDED - gets optimized)
// For this example, let's use an existing asset
import socialImage from "../assets/banner.jpg";

// Method 2: String path (NOT optimized, use only if necessary)
// const customSocialImagePath = "/my-image.jpg";
---

<Layout
  title="My Page Title"
  description="My page description"
  image={socialImage}
  imageWidth={1200}
  imageHeight={630}
>
  <!-- Your page content -->
  <h1>My Page</h1>
</Layout>
```
