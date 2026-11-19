# Chirag Chavda - Developer Portfolio

Chirag Chavda's personal portfolio, showcasing full-stack applications, frontend tools, Web3 projects, professional experience, skills, education, and contact details. Built with Next.js and React, the portfolio exports as a static site and does not require a backend or environment variables.

## Features

- Responsive, single-page layout with Work, Experience, About, and Contact sections.
- Nine project cards with technology tags, source-code links, and live demos where available.
- Projects with live demos appear first, followed by code-only projects. Each group retains its content order, including when filtering by category.
- Filters for All, Full-stack, Frontend, and Web3, with an accessible project count.
- Light and dark themes with saved preferences and opaque blue, amber, and plum project surfaces.
- A live construction sequence with eight named cursors that builds sections as you scroll, plus a **Skip Building** control.
- Keyboard navigation, visible focus states, a skip-to-projects link, and reduced-motion support.
- Locally hosted Manrope and Geist Mono fonts, with no external font requests.
- Chiragcs-focused metadata, canonical links, person/site structured data, social previews, and static crawl files.

## Tech stack

- Next.js 14 with static export.
- React 18 and JavaScript.
- Custom CSS for responsive layouts and theme tokens.
- Native browser APIs for construction animation and saved preferences.

Dependencies and commands are defined in [`package.json`](package.json).

## Run locally

Requires Node.js 18.17 or newer and npm.

1. Install dependencies with [`npm install`](package.json:10).
2. Start the development server with [`npm run dev`](package.json:6).
3. Open [localhost:3000](http://localhost:3000).

## Build and deploy

1. Create the production export with [`npm run build`](package.json:7). The generated site is written to [`out/`](out/).
2. Preview the export with [`npm start`](package.json:8). This uses the npm-hosted static server and may download it on first use.
3. Deploy the generated output to a static host such as Vercel, Netlify, or Cloudflare Pages. For hosts with build settings, use [`npm run build`](package.json:7) as the build command and [`out/`](out/) as the publish directory.

Static export settings are in [`next.config.mjs`](next.config.mjs). Hosting under a subdirectory, such as a GitHub Pages project site, requires configuring the deployment base path before building.

## SEO and Google indexing

The portfolio identifies **Chirag Chavda** as **Chiragcs** in its title, description, visible introduction, and structured data. Shared SEO settings are in [`lib/seo.js`](lib/seo.js:3). The canonical origin is [https://www.chiragcs.in](https://www.chiragcs.in), matching the live redirect from the non-www domain. Change this setting if the primary domain changes.

- [`app/page.jsx`](app/page.jsx:4) provides homepage-specific canonical, indexing, and social-preview metadata. Its structured data describes the person, website, and profile page using the existing profile information and social links.
- [`app/robots.js`](app/robots.js:6) allows crawling and points to [the sitemap](https://www.chiragcs.in/sitemap.xml). [`app/sitemap.js`](app/sitemap.js:6) lists only the real homepage; section anchors are not separate pages, and no artificial modification dates are generated.
- [`public/social-card.png`](public/social-card.png) is the locally hosted 1200 × 630 social-preview image.
- Content is included in the exported HTML. The main heading and introduction are visible immediately; off-screen content stays readable without scrolling, while construction effects run only on reached elements. Reduced motion and no-JavaScript access remain supported. Error pages retain their no-index behavior.

After deployment:

1. Deploy the latest export, keeping HTTP and non-www traffic redirected to [https://www.chiragcs.in/](https://www.chiragcs.in/).
2. Add the **chiragcs.in** domain property in [Google Search Console](https://search.google.com/search-console/about) and complete DNS verification through the domain provider. The domain property covers both www and non-www addresses; no verification secret needs to be committed to the project.
3. Submit [https://www.chiragcs.in/sitemap.xml](https://www.chiragcs.in/sitemap.xml). Use URL Inspection on [the homepage](https://www.chiragcs.in/) to test the live URL and request indexing.
4. Add the canonical portfolio link to your GitHub and LinkedIn profiles. Keep the name **Chirag Chavda** and handle **Chiragcs** consistent so search engines can connect the profiles.
5. Monitor indexing and the **chiragcs** query in Search Console. Ranking depends on indexing, relevance, and signals from other sites; these changes do not guarantee a particular position or immediate search results.

## Controls

- Scrolling is fully manual on every visit. The live build follows the sections you reach without moving the page or locking focus.
- A bottom-right **Skip Building** button appears during active construction and hides when construction is idle or complete. Clicking it, or pressing Esc, cancels cursor construction and progressively reveals unfinished components, prioritizing the current viewport. Their text and controls fade in over 260 milliseconds with a short stagger; the entire sequence finishes within 580 milliseconds. Already-built content, solid card backgrounds, scroll position, and keyboard focus are preserved. Reduced motion reveals everything immediately. The cursors settle into the footer after completion. There is no floating build status or Replay bar.
- The header theme switch follows your device preference initially and saves manual light/dark changes. Theme changes work without restarting construction.
- Larger elements use two or three cursors working together. Single-cursor tasks rotate through the crew, and up to eight cursors can work concurrently.
- Headings, project descriptions, and section text type in from left to right, with a visible caret and a cursor following the writing. Separate cursors can write separate blocks in parallel; space is reserved to prevent layout jumps.
- Cards stay fully opaque throughout construction and hover states. Outline-only blueprints and text reveals provide the build effect without translucent fills or whole-card fades.
- Cursor movements finish before the next movement begins. Construction timing is centralized in [`lib/swarm.js`](lib/swarm.js:9).
- Reloads start at the top. A section starts constructing only after you reach it; once started, it finishes even if you scroll past.
- After the build completes, all eight cursors glide into a tidy footer dock and remain stationary. They never circle the heading, follow your pointer, or gather around it.
- Visitors with "reduce motion" turned on, or with JavaScript off, see the finished page right away.
- Section links smoothly navigate only when activated; there is no automatic walkthrough or first-visit tracking.

## Project structure and customization

| Location | Responsibility |
| --- | --- |
| [`app/page.jsx`](app/page.jsx) | Portfolio page entry point. |
| [`app/layout.jsx`](app/layout.jsx) | Shared metadata, local fonts, and initial theme setup. |
| [`app/robots.js`](app/robots.js) | Static crawl rules and sitemap discovery. |
| [`app/sitemap.js`](app/sitemap.js) | Static sitemap with the canonical homepage URL. |
| [`app/globals.css`](app/globals.css) | Colors, theme tokens, responsive layout, and animation styling. |
| [`components/Portfolio.jsx`](components/Portfolio.jsx) | Sections, project cards, demo-first ordering, and category filters. |
| [`components/ThemeToggle.jsx`](components/ThemeToggle.jsx) | Light/dark theme control. |
| [`components/Icon.jsx`](components/Icon.jsx) | Shared vector icons. |
| [`lib/data.js`](lib/data.js) | Profile, projects, jobs, skills, education, and contact links. |
| [`lib/swarm.js`](lib/swarm.js) | Construction animation, cursor crew, and skip behavior. |
| [`lib/theme.js`](lib/theme.js) | Theme preference utilities. |
| [`lib/seo.js`](lib/seo.js) | Canonical domain, branded metadata, and structured data. |
| [`public/social-card.png`](public/social-card.png) | Social-sharing preview. |
| [`public/favicon.ico`](public/favicon.ico) | Multi-resolution site favicon. |
| [`public/fonts/`](public/fonts/) | Locally hosted fonts and their licenses. |

### Add or update a project

Edit the [`projects`](lib/data.js:14) collection in [`lib/data.js`](lib/data.js). Each entry supplies a title, category, description, technology list, and GitHub repository name. Use one of the categories already supported by the filters: Full-stack, Frontend, or Web3.

Add an optional [`demo`](lib/data.js:16) URL when a live deployment is available. The card then includes an **Open demo** link and automatically appears before projects without demos. Omit the URL for code-only projects; no manual reordering is needed. The source collection is not mutated by display ordering.

Update personal information in [`lib/data.js`](lib/data.js), shared SEO settings in [`lib/seo.js`](lib/seo.js:3), page metadata in [`app/page.jsx`](app/page.jsx:4), colors and spacing in [`app/globals.css`](app/globals.css), and cursor names or timing in [`lib/swarm.js`](lib/swarm.js:2).
