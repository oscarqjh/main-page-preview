# LMMS-Lab Website

A modern research blog built with Next.js 14, featuring a brutalist/sci-fi design system with auto-generated thumbnails and randoma11y-compliant color palette.

## Design System

### Color Palette (randoma11y)

| Role | Color | Hex |
|------|-------|-----|
| Background | Deep Teal | `#0369a1` |
| Foreground | Warm Cream | `#fed7aa` |

APCA Contrast: -62.729 (passes Lc 60 for body text)

### Visual Style

- Brutalist/sci-fi aesthetic
- Procedurally generated thumbnails
- Halftone and circuit patterns
- Animated SVG elements

## Getting Started

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build
npm run build
```

## Adding a New Blog Post

### 1. Create the MDX File

Create a new `.mdx` file in `content/posts/`:

```bash
content/posts/your-post-slug.mdx
```

The filename becomes the URL slug: `/posts/your-post-slug`

### 2. Add Frontmatter

```yaml
---
title: "Your Post Title"
description: "Brief description for SEO (50-160 characters)"
publishDate: "2025-02-01"
mainTags: ["research", "llm"]
tags: ["research", "llm", "multimodal"]
authors:
  - name: "Author Name"
    url: "https://author-website.com"
    main: true
  - name: "Co-Author Name"
bibtex: |
  @article{yourpaper2025,
    title={Your Paper Title},
    author={Author, Name},
    journal={arXiv preprint},
    year={2025}
  }
---

Your markdown content here...
```

### 3. Frontmatter Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Post title (max 60 chars recommended) |
| `description` | string | Yes | SEO description (50-160 chars) |
| `publishDate` | string | Yes | ISO date format (YYYY-MM-DD) |
| `mainTags` | string[] | Yes | Primary categories (1-2 tags) |
| `tags` | string[] | No | All tags including mainTags |
| `authors` | object[] | No | List of authors with name, url, main |
| `bibtex` | string | No | BibTeX citation block |
| `thumbnail` | string | No | Custom thumbnail URL (overrides auto-generation) |

## Auto-Generated Thumbnails

When no `thumbnail` is specified in frontmatter, the system automatically generates a sci-fi themed thumbnail based on the post title.

### How It Works

The `PostThumbnail` component (`components/blog/PostThumbnail.tsx`) generates SVG patterns procedurally:

1. **Hash Generation**: Title is hashed to a deterministic number
2. **Pattern Selection**: Hash selects one of 5 pattern variants
3. **Element Generation**: Pattern elements are generated with seeded randomness
4. **Animation**: CSS animations with staggered delays

### Pattern Variants

| Variant | Description | Visual Style |
|---------|-------------|--------------|
| `HalftonePortrait` | Dithered figure silhouette | Dot matrix portrait |
| `CircuitGrid` | Grid nodes with circuit traces | Tech/hardware aesthetic |
| `DataBlocks` | Rectangular data visualization | Dashboard/analytics |
| `WaveformDisplay` | Audio waveforms + spectrum bars | Signal processing |
| `AbstractFigure` | Radial rings with particles | Cosmic/abstract |

### Customizing Thumbnail Generation

To force a specific pattern variant, modify the component usage:

```tsx
// In your page component
<PostThumbnail 
  title={post.title} 
  seed={post.slug}  // Change seed to get different pattern
/>
```

The pattern is determined by: `hash(seed || title) % 5`

To get a specific pattern for a post, you can:
1. Adjust the post slug
2. Or modify the seed parameter

### Pattern-to-Hash Mapping

| Hash % 5 | Pattern |
|----------|---------|
| 0 | HalftonePortrait |
| 1 | CircuitGrid |
| 2 | DataBlocks |
| 3 | WaveformDisplay |
| 4 | AbstractFigure |

### Using Custom Thumbnails

To use a custom image instead of auto-generation:

```yaml
---
title: "Your Post"
thumbnail: "/images/custom-thumbnail.jpg"
# or external URL
thumbnail: "https://example.com/image.jpg"
---
```

### Animation Details

All thumbnails include subtle CSS animations:

| Element | Animation | Duration |
|---------|-----------|----------|
| Circles | Pulse opacity | 3s |
| Rectangles | Float up/down | 4s |
| Lines | Pulse opacity | 2.5s |
| Polylines | Wave side-to-side | 6s |
| Paths | Draw effect | 3s |

Animations respect `prefers-reduced-motion` for accessibility.

## Project Structure

```
├── app/                    # Next.js app router
│   ├── page.tsx           # Homepage
│   ├── posts/
│   │   └── [slug]/        # Dynamic blog post pages
│   └── layout.tsx         # Root layout
├── components/
│   ├── blog/
│   │   ├── PostThumbnail.tsx   # Auto-generated thumbnails
│   │   ├── TableOfContents.tsx # Sticky TOC
│   │   └── ReadingProgress.tsx # Reading progress bar
│   └── decorative/
│       ├── DitherPattern.tsx   # Background textures
│       ├── ConcentricOverlay.tsx
│       └── GrainOverlay.tsx
├── content/
│   └── posts/             # MDX blog posts
├── lib/
│   ├── posts.ts           # Post loading utilities
│   └── toc.ts             # Table of contents extraction
└── styles/
    └── globals.css        # Design system + animations
```

## Styling Guide

### CSS Variables

```css
:root {
  --background: #0369a1;
  --foreground: #fed7aa;
  --font-sans: system-ui, -apple-system, sans-serif;
  --font-mono: ui-monospace, monospace;
}
```

### Utility Classes

| Class | Effect |
|-------|--------|
| `.card-lift` | Hover lift with shadow |
| `.link-underline` | Animated underline on hover |
| `.fade-in-up` | Fade in from below |
| `.interactive` | Brightness on hover |

## Development

```bash
# Run development server
npm run dev

# Type check
npx tsc --noEmit

# Build for production
npm run build

# Preview production build
npm run start
```

## Adding New Thumbnail Patterns

To add a new pattern variant:

1. Create the pattern function in `components/blog/PostThumbnail.tsx`:

```tsx
function NewPattern({ hash }: { hash: number }) {
  const elements = useMemo(() => {
    const items: JSX.Element[] = [];
    // Generate SVG elements using seededRandom(hash + offset)
    return items;
  }, [hash]);

  return (
    <svg className="post-thumbnail-v2-svg" viewBox="0 0 100 100">
      {elements}
    </svg>
  );
}
```

2. Add to the variant list and switch statement:

```tsx
const variants = ["concentric", "scanlines", ..., "newpattern"];

// In renderPattern switch:
case "newpattern":
  return <NewPattern hash={hash} />;
```

3. Update the total variant count for hash distribution.

## License

MIT
