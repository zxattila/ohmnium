## Breadcrumbs Component (Astro + DaisyUI + Tailwind)

This component displays navigational breadcrumbs using DaisyUI + Heroicons mini (Home). It accepts an array of `{ name: string, url: string }` and:

- Renders accessible semantic HTML (`<nav>` with `aria-label="Breadcrumb"`)
- Highlights the current page with `aria-current="page"`
- Adds structured `BreadcrumbList` JSON-LD for SEO in a `<script>` tag
- Supports automatic generation of paths via `generateBreadcrumbs()` from `Astro.url.pathname`
- Label overrides are supported for slug-to-pretty-name mapping

This is especially useful in single-level navigation setups without dropdown menus.

Component depends on:

- Tailwind CSS + DaisyUI
- Heroicons mini (`Home` icon inline SVG)
- Optionally Alpine.js (for dropdowns later, but not required here)

Place the component near the top of each `.astro` page or layout.

Example:

```astro
---
import Breadcrumbs from "../components/Breadcrumbs.astro";
import { generateBreadcrumbs } from "../utils/generateBreadcrumbs";

const breadcrumbs = generateBreadcrumbs(Astro.url.pathname);
---

<Breadcrumbs items={breadcrumbs} />
```

## Import from utils

To use the `generateBreadcrumbs` function, import it from your utility file. This function takes a URL path and returns an array of breadcrumb items. Here's how you can import and use it in your `.astro` files:

```ts
import { generateBreadcrumbs } from "../utils/generateBreadcrumbs";
const breadcrumbs = generateBreadcrumbs(Astro.url.pathname);
```
