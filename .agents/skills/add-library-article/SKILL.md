---
name: add-library-article
description: >
  Analyzes a new article page.tsx in the Library webapp, extracts all metadata
  (title, description, tags, accent color, cover pattern, reading time, etc.),
  and registers it as a card in the homepage registry. Use this skill whenever
  the user provides a new page and asks it to appear on the homepage.
metadata:
  author: library-system
  version: "1.0.0"
---

# Add Library Article Skill

When the user gives you a new page (or a path to one), follow every step below
in order. Do not skip steps.

---

## Step 1 — Understand the Codebase Context

Before touching anything, read these two files to understand what already
exists:

- **Registry**: `webapp/app/lib/registry.ts`  
  This is the single source of truth. Every article shown on the homepage lives
  here as an entry in the `ARTICLES` array.
- **Homepage**: `webapp/app/page.tsx`  
  Cards are rendered automatically from `ARTICLES` — no changes needed here
  unless you add a new `CoverPattern` type.

Key types you must respect (from `registry.ts`):

```ts
type Category     = "ai" | "uiux";
type CoverPattern = "circles" | "terminal" | "nodes" | "dims" | "flow";
```

---

## Step 2 — Analyze the Article Page

Read the full `page.tsx` (even if it is very long). You are looking for:

| Signal | Where to find it |
|---|---|
| **Topic / Subject** | File path, page title, `<h1>`, page-level constants, component names |
| **Interactive features** | State variables, canvas elements, animation hooks, tabs/views |
| **Data depth** | Size of data arrays, number of items covered (e.g. "20 color systems") |
| **Complexity** | Number of components, lines of code, distinct views |
| **Visual vocabulary** | What kind of shapes/charts/patterns dominate the UI |
| **Domain** | Is it AI research? Design systems? Color science? Typography? |
| **Palette** | Any palette constants at the top (e.g. `const P = { amber: "#B45309" }`) |

> **Tip**: Search for `const` blocks near the top — they often name the domain
> and reveal accent colors used throughout the page.

---

## Step 3 — Determine Each Metadata Field

Fill in all fields below. Guidelines for each:

### `id`
- Kebab-case, unique, descriptive.  
- Derive from the page title or file path.  
- Example: `"color-encyclopedia"`, `"typography-mini-book"`.

### `title`
- The article's real human-readable title.  
- Look for the first `<h1>` or a prominent heading constant.  
- Keep it short (≤ 60 chars).

### `subtitle`
- A one-liner describing the *format and scope*, not the topic.  
- Pattern: `"[Format] · [Scale]"`  
- Examples: `"Interactive Color Reference · 20 Systems"`, `"Research Survey · 80+ Papers"`

### `path`
- The Next.js route path for this page.  
- Derived from the file path: `webapp/app/X/Y/page.tsx` → `"/X/Y"`.

### `category`
- `"ai"` — anything about LLMs, agents, benchmarks, research, ML.  
- `"uiux"` — anything about design systems, color, typography, visual design.

### `subcategory`
- A short human label for the topic cluster within the category.  
- Examples: `"AGI"`, `"Coding Agents"`, `"Color Science"`, `"Typography"`.

### `description`
- 2–3 sentences. Must answer: *What does this page cover, and what makes it
  interactive?*  
- Mention key data points (number of systems, tools, papers, brands, etc.).
- Mention the interactive formats (tabs, live sliders, canvas, quizzes, etc.).
- Aim for 200–280 characters.

### `tags` (array of 3 strings)
- Short, scannable labels shown on the card as chips.  
- Focus on *what the reader gets*: data scale, key features, standout tool.  
- Examples: `["20 Systems", "Color Science", "CSS Level 4"]`

### `date`
- The month and year the article was created or last substantially updated.  
- If unknown, use the current month/year: `"March 2026"`.

### `readingTime`
- Estimate based on page complexity:
  - < 500 lines of content: `"10 min"`
  - 500–1000 lines: `"15 min"`
  - 1000–1500 lines: `"20 min"`
  - 1500–2000 lines: `"25 min"`
  - 2000–2500 lines: `"30 min"`
  - \> 2500 lines: `"35 min"`

### `accent` (hex color)
- The dominant brand/accent color of the page.  
- **First choice**: look for a palette constant like `const P = { amber: "#B45309" }` or a named CSS variable.  
- **Second choice**: look for the most-used non-neutral hex in the file.  
- **Third choice**: pick from the table below based on domain:

| Domain | Suggested Accent |
|---|---|
| AI / Research | `#993C1D` (rust) or `#0F6E56` (emerald) |
| Design Systems | `#1D4ED8` (blue) or `#7B3FA0` (purple) |
| Color Science | `#B45309` (amber) |
| Typography | `#374151` (ink grey) or `#713F12` (brown) |
| Data / Charts | `#0F6E56` (green) or `#1D4ED8` (blue) |

### `accentLight` (hex color)
- A very light tint of `accent` used for card backgrounds.  
- Should be high-lightness (L > 90%) — nearly white with a color cast.  
- Examples: `accent: "#B45309"` → `accentLight: "#FEF3C7"`.

### `coverPattern`
Pick the pattern that best matches the page's *dominant visual metaphor*:

| Pattern | Use when the page is about… |
|---|---|
| `"circles"` | Concentric rings, targets, radial data, benchmarks, research depth |
| `"terminal"` | Code, CLI, technical grids, dot matrices, engineering |
| `"nodes"` | Connected systems, networks, mind maps, force graphs, encyclopedias |
| `"dims"` | Sliders, axes, dimensions, spectrums, multi-variable explorers |
| `"flow"` | Learning paths, token chains, timelines, journeys, step-by-step tools |

### `visualTags` (array of 3 strings)
- The 3 most distinctive *interactive features or visual tools* inside the page.
- Examples: `["Color Lab", "Timeline 1931–2025", "8 Interactive Views"]`
- These appear on the expanded hero card. Be specific and intriguing.

### `featured`
- `true` only for the single most important article in the whole library.  
- Only one article should be `featured: true` at any time.  
- Leave this field out (defaults to `false`) for all normal articles.

---

## Step 4 — Write the Registry Entry

Open `webapp/app/lib/registry.ts` and append your new entry **before** the
closing `];` of the `ARTICLES` array.

Use this exact shape:

```ts
  {
    id: "your-article-id",
    title: "Article Title Here",
    subtitle: "Format Description · Scale",
    path: "/category/subcategory/page-slug",
    category: "uiux",           // or "ai"
    subcategory: "Color Science",
    description:
      "Two to three sentences describing what the article covers and " +
      "what interactive features it contains.",
    tags: ["Tag One", "Tag Two", "Tag Three"],
    date: "March 2026",
    readingTime: "20 min",
    accent: "#B45309",
    accentLight: "#FEF3C7",
    coverPattern: "nodes",
    visualTags: ["Feature One", "Feature Two", "Feature Three"],
  },
```

---

## Step 5 — Handle TypeScript Build Errors

If the article page has never been built before, run:

```bash
pnpm build
```
(run from `webapp/` directory)

Fix **every** TypeScript error reported. Common patterns in these pages:

| Error | Fix |
|---|---|
| `Property 'X' is missing` | The prop is required but never passed — either add it at the call site or make it optional with `X?: type` in the function signature |
| `Object literal has duplicate property` | Inline style objects with two `border:` or `background:` keys — remove the redundant one |
| Unused prop in destructuring causes required-prop error at call site | Remove the prop from the function signature destructuring |
| `"use client"` + `export const metadata` | Server-only export in a client component — remove the `metadata` export |

After fixing, run `pnpm build` again until the output shows:
```
✓ Compiled successfully
✓ Finished TypeScript
✓ Generating static pages
```

---

## Step 6 — Verify the Card Appears

After a clean build, check `localhost:3000` (if dev server is running) or
confirm the route appears in the build output route table:

```
Route (app)
├ ○ /
├ ○ /uiux
└ ○ /uiux/your-new-path     ← must appear here
```

The card will automatically show in:
- The homepage grid (filtered by category)
- The `/ai` or `/uiux` category page article list
- The nav article count badge

---

## Quick Summary Checklist

```
[ ] Read registry.ts and page.tsx fully
[ ] Determine: id, title, subtitle, path, category, subcategory
[ ] Determine: description (2-3 sentences, mentions interactivity)
[ ] Determine: tags (3 short chips)
[ ] Determine: accent + accentLight hex colors
[ ] Determine: coverPattern (one of 5 options)
[ ] Determine: visualTags (3 specific interactive feature names)
[ ] Determine: readingTime (estimate from page length)
[ ] Append entry to ARTICLES array in registry.ts
[ ] Run pnpm build — fix all TypeScript errors
[ ] Confirm route appears in build output
```
