# joshfinnie.com

Personal homepage and blog of Josh Finnie built with Astro 5.

[![Netlify Status](https://api.netlify.com/api/v1/badges/0b679cee-412d-4608-b2ad-f132f2e5d7ad/deploy-status)](https://app.netlify.com/sites/awesome-tereshkova-b52194/deploys)
[![CI](https://github.com/joshfinnie/joshfinnie.com/actions/workflows/ci.yml/badge.svg)](https://github.com/joshfinnie/joshfinnie.com/actions/workflows/ci.yml)

## Tech Stack

- **Framework**: [Astro 5](https://astro.build/) with React, MDX, and Alpine.js
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Images**: [Cloudinary](https://cloudinary.com/) for CDN and automatic optimization
- **Linting/Formatting**: [Biome](https://biomejs.dev/)
- **Type Checking**: TypeScript (strict mode)
- **Deployment**: [Netlify](https://netlify.com/)
- **CI/CD**: GitHub Actions

## Setup & Development

### Prerequisites

- Node.js 24+
- pnpm 10.8.1+

### Installation

```bash
# Clone the repository
git clone https://github.com/joshfinnie/joshfinnie.com.git
cd joshfinnie.com

# Install dependencies
pnpm install
```

### Development

```bash
# Start dev server (http://localhost:3333)
pnpm dev

# Run linting and formatting checks
pnpm format:check

# Auto-fix linting and formatting issues
pnpm format

# Type check
pnpm check

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Working with Images

This site uses Cloudinary for all images. Images are automatically optimized (format, quality, and size) by Cloudinary's CDN.

### Adding New Images

1. **Upload to Cloudinary:**
   ```bash
   # Place your image in src/assets/ (temporarily)
   # Example: src/assets/blog/my-new-image.jpg

   # Run the upload script
   pnpm cloudinary:upload
   ```

2. **Reference in Content:**

   For blog post hero images, use the Cloudinary public ID in frontmatter:
   ```yaml
   ---
   title: "My Post"
   heroImage: "blog/my-new-image"  # No extension, just the public ID
   ---
   ```

3. **Inline Images in MDX:**
   ```html
   <!-- Use direct Cloudinary URLs -->
   <img
     src="https://res.cloudinary.com/dgd9cw3gu/image/upload/f_auto,q_auto/blog/my-image"
     alt="Description"
   />
   ```

4. **Using the CloudinaryImage Component:**
   ```astro
   ---
   import CloudinaryImage from '@components/CloudinaryImage.astro';
   ---

   <CloudinaryImage
     publicId="blog/my-image"
     alt="Description"
     width={1024}
   />
   ```

### Image Optimization

Cloudinary automatically applies:
- **Format optimization** (`f_auto`): Serves WebP/AVIF to supported browsers
- **Quality optimization** (`q_auto`): Adjusts quality based on content
- **Responsive images**: CloudinaryImage component generates srcset automatically

## Creating Blog Posts

Blog posts are located in `src/collections/blog/` and support both `.md` and `.mdx` formats.

### Post Template

```markdown
---
title: "Your Post Title"
date: "2024-01-01"
description: "A concise SEO-friendly description (max 160 characters)"
tags:
  - "tag1"
  - "tag2"
slug: "custom-url-slug"  # Optional
heroImage: "blog/hero-image"  # Optional, Cloudinary public ID
unsplash: "Photographer Name"  # Optional, if using Unsplash
unsplashURL: "photographer-handle"  # Optional
draft: false  # Optional, set to true to hide from production
---

Your content here...
```

### Required Fields

- `title`: Post title
- `date`: Publication date (YYYY-MM-DD format)
- `description`: SEO meta description (keep under 160 characters)
- `tags`: Array of relevant tags

### Optional Fields

- `slug`: Custom URL (defaults to filename)
- `heroImage`: Cloudinary public ID for hero image
- `unsplash`/`unsplashURL`: Credit for Unsplash photos
- `draft`: Hide from production if true
- `expires`: Mark as time-sensitive content

## Code Quality

### Git Hooks

This project uses Husky for git hooks:

- **Pre-commit**: Runs Biome formatting and linting checks
- Commits are blocked if code quality checks fail

### CI/CD Pipeline

GitHub Actions runs on every push and PR:

1. **Linting & Formatting**: Biome checks
2. **Type Checking**: TypeScript validation
3. **Build**: Production build verification

### Formatting

```bash
# Check formatting and linting
pnpm format:check

# Auto-fix issues
pnpm format

# Lint only
pnpm lint
```

## Project Structure

```
joshfinnie.com/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI
├── src/
│   ├── collections/
│   │   ├── blog/              # Blog posts (.md, .mdx)
│   │   ├── projects/          # Project pages
│   │   └── talks/             # Speaking engagements
│   ├── components/            # Reusable Astro components
│   │   └── CloudinaryImage.astro
│   ├── layouts/               # Page layouts
│   ├── lib/
│   │   └── cloudinary.ts      # Cloudinary helper functions
│   ├── pages/                 # Route pages
│   └── content.config.ts      # Content collections schema
├── scripts/
│   ├── upload_to_cloudinary.js  # Image upload script
│   └── migrate_frontmatter.js   # Migration utilities
├── astro.config.mjs           # Astro configuration
├── biome.json                 # Biome linter/formatter config
├── tailwind.config.mjs        # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

## Environment Variables

Required for local development:

```bash
# .env
CLOUDINARY_CLOUD_NAME=dgd9cw3gu
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> **Note**: The cloud name has a fallback in code, but API credentials are required for uploading images.

## Deployment

The site automatically deploys to Netlify on pushes to `main`:

- **Build Command**: `pnpm build`
- **Publish Directory**: `dist`
- **Environment Variables**: Set `CLOUDINARY_CLOUD_NAME` in Netlify settings (optional, has fallback)

## Contributing

1. Create a feature branch
2. Make your changes
3. Ensure all checks pass: `pnpm format:check && pnpm check && pnpm build`
4. Commit (pre-commit hooks will run automatically)
5. Push and create a PR

## License

Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License

## Contact

- Website: [joshfinnie.com](https://www.joshfinnie.com)
- GitHub: [@joshfinnie](https://github.com/joshfinnie)
