# GitHub Copilot Instructions

Do not make any changes until you have 95% confidence that you know what to build ask me follow up questions until you have the confidence to make the changes

# If you are not sure about the changes, ask me to clarify

## Project Goal

This is a component-based Astro project that uses best practices to render a modern, performant frontend. The project fetches dynamic content from a WordPress backend via the WordPress REST API v2. The WordPress site URL is set using the `WP_SITE` environment variable and accessed within Astro through environment variables prefixed with `WP_`.

Fetched data is mapped to Astro components to render the UI. The frontend makes extensive use of TailwindCSS utility classes, with DaisyUI components, and interactive behavior is powered by Alpine.js. The project also uses SASS for preprocessing and Prettier for code formatting.

An important feature of the site is an AI-integrated form that leverages the OpenAI API. The API is accessed securely using the `OPENAI_API_KEY` environment variable.

## Tech Stack

- **Astro** v5.2.5
- **Alpine.js** v3.13.3 (integrated via `@astrojs/alpinejs`)
- **TailwindCSS** v3.4.0
- **DaisyUI** v4.6.1
- **WordPress REST API v2** (via `WP_SITE` environment variable)
- **OpenAI API** integration (via `OPENAI_API_KEY` environment variable)
- **SASS** for CSS preprocessing
- **Prettier** with `prettier-plugin-astro` for code formatting
