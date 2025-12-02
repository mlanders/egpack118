# CLAUDE.md - AI Assistant Guide for Cub Scout Pack 118 Website

## Project Overview

This is a marketing website for **Cub Scout Pack 118** based in Elk Grove, California. The site provides information about the pack, activities, events, and how to join or become a leader.

**Project Status**: ✅ Completed and actively maintained
**Purpose**: Static informational website with no backend or user authentication
**Contact**: ElkGrovePack118@gmail.com
**Meeting Location**: 3329 Point Pleasant Rd, Elk Grove, CA 95757

## Tech Stack

- **Framework**: SvelteKit 2.48.5 (with Svelte 5.43.8)
- **Language**: TypeScript 5.9.3
- **Styling**: Tailwind CSS 4.1.17
- **Build Tool**: Vite 7.2.2
- **Adapter**: `@sveltejs/adapter-auto`
- **Image Format**: WebP (for optimization)

### Key Technologies

- **Svelte 5**: Uses modern syntax including `$state()` and `{@render children()}` snippets
- **Tailwind CSS v4**: Uses new PostCSS plugin format with `@theme` configuration
- **TypeScript**: Strict mode enabled with bundler module resolution
- **File-based Routing**: SvelteKit's convention with `+page.svelte` files

## Project Structure

```
/home/user/egpack118/
├── src/
│   ├── routes/                          # SvelteKit file-based routing
│   │   ├── +layout.svelte               # Root layout (Navigation + content + Footer)
│   │   ├── +page.svelte                 # Home page (/)
│   │   ├── activities/+page.svelte      # Activities page (/activities)
│   │   ├── become-a-leader/+page.svelte # Leader signup (/become-a-leader)
│   │   ├── calendar/+page.svelte        # Calendar page (/calendar)
│   │   └── pinewood-derby/+page.svelte  # Derby rules (/pinewood-derby)
│   ├── lib/
│   │   ├── components/                  # Reusable components
│   │   │   ├── Navigation.svelte        # Main nav with mobile menu
│   │   │   └── Footer.svelte            # Site footer
│   │   ├── assets/                      # WebP images
│   │   │   ├── activities/              # Activity-specific images
│   │   │   └── *.webp                   # Hero and content images
│   │   └── index.ts                     # $lib export barrel (currently empty)
│   ├── app.css                          # Global styles + Tailwind config
│   ├── app.d.ts                         # TypeScript declarations
│   └── app.html                         # HTML shell template
├── static/
│   ├── downloads/                       # PDF files (applications, forms)
│   ├── favicon/                         # Favicon in multiple formats
│   ├── images/                          # Logo and static images
│   └── robots.txt
├── package.json                         # Dependencies and scripts
├── svelte.config.js                     # SvelteKit configuration
├── vite.config.ts                       # Vite build configuration
├── postcss.config.js                    # PostCSS with Tailwind plugin
├── tsconfig.json                        # TypeScript configuration
└── plan.md                              # Project development plan (completed)
```

## Routing & Navigation

### File-Based Routing

SvelteKit uses directory structure to determine routes:

- `/` → `src/routes/+page.svelte`
- `/activities` → `src/routes/activities/+page.svelte`
- `/calendar` → `src/routes/calendar/+page.svelte`
- `/pinewood-derby` → `src/routes/pinewood-derby/+page.svelte`
- `/become-a-leader` → `src/routes/become-a-leader/+page.svelte`

### Navigation Structure

The navigation menu includes:
- **Main Links**: Home, Calendar, Activities, Pinewood Derby
- **Resources Dropdown**: Contains "Become a Leader" link
- **Mobile Menu**: Hamburger menu with collapsible navigation

## Code Conventions & Patterns

### 1. File Naming

- **Components**: PascalCase (e.g., `Navigation.svelte`, `Footer.svelte`)
- **Pages**: `+page.svelte` (SvelteKit convention)
- **Route Directories**: kebab-case (e.g., `become-a-leader/`, `pinewood-derby/`)
- **Assets**: snake_case with extension (e.g., `blue_and_gold_banquet.webp`)
- **Config Files**: Standard names (e.g., `svelte.config.js`, `vite.config.ts`)

### 2. Import Paths

**CRITICAL CONVENTION**: Always use the `$lib` alias for source assets and components

```javascript
// ✅ CORRECT - Use $lib alias
import Navigation from "$lib/components/Navigation.svelte";
import scouts1 from "$lib/assets/scouts1.webp";

// ❌ WRONG - Don't use relative paths or /src/ prefix
import Navigation from "../lib/components/Navigation.svelte";
import scouts1 from "/src/lib/assets/scouts1.webp";
```

**Static Files**: Reference from root path:
```html
<!-- Static images -->
<img src="/images/cub-scouts-logo.png" alt="Logo" />

<!-- Static downloads -->
<a href="/downloads/adult_application.pdf">Download PDF</a>
```

**Recent Pattern**: Git history shows active refactoring to standardize on `$lib` imports. Always follow this convention.

### 3. Page Structure Pattern

All content pages follow this consistent structure:

```svelte
<script>
    // Import assets from $lib
    import imageName from "$lib/assets/image.webp";
</script>

<svelte:head>
    <title>Page Title - Cub Scout Pack 118</title>
</svelte:head>

<!-- Page container with consistent max-width and padding -->
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <!-- Page header section -->
    <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Page Title
        </h1>
        <p class="text-xl text-gray-600">Subtitle or description</p>
    </div>

    <!-- Content sections with consistent spacing -->
    <section class="mb-12">
        <!-- Section content -->
    </section>

    <!-- Call-to-action section (typically at bottom) -->
    <div class="bg-gradient-to-r from-scout-blue to-blue-600 text-white rounded-lg p-8 text-center">
        <!-- CTA content -->
    </div>
</div>
```

### 4. Component Patterns

**Svelte 5 State Management**:
```javascript
// Use $state() for reactive variables
let mobileMenuOpen = $state(false);
let resourcesDropdownOpen = $state(false);

function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
}
```

**Layout Components**: Root layout uses snippet syntax
```svelte
<div class="min-h-screen flex flex-col">
    <Navigation />
    <main class="grow">
        {@render children()}
    </main>
    <Footer />
</div>
```

**Event Handlers**: Use inline attributes
```svelte
<button onclick={toggleMenu}>Toggle</button>
<div onmouseenter={openDropdown} onmouseleave={closeDropdown}>
    Dropdown
</div>
```

### 5. Styling Conventions (Tailwind CSS)

**Custom Theme Colors** (defined in `src/app.css`):
```css
--color-scout-blue: #003f87;  /* Primary brand color */
--color-scout-gold: #ffc72c;  /* Secondary brand color */
```

**Custom Font Weights** (lighter than Tailwind defaults):
- `font-normal`: 300 (vs. default 400)
- `font-medium`: 400 (vs. default 500)
- `font-semibold`: 500 (vs. default 600)
- `font-bold`: 600 (vs. default 700)

**Common Utility Classes**:
- **Layout**: `max-w-7xl mx-auto px-4 py-16`
- **Grids**: `grid md:grid-cols-2 lg:grid-cols-3 gap-8`
- **Colors**: `text-scout-blue bg-scout-blue text-scout-gold bg-blue-50`
- **Spacing**: `mb-4 mb-8 mb-12 py-16` (multiples of 4)
- **Responsive**: `hidden md:flex md:text-5xl lg:px-8`
- **Hover**: `hover:shadow-lg hover:bg-scout-blue/10 hover:scale-105`
- **Transitions**: `transition-colors transition-shadow transition-all`

**Responsive Design**: Mobile-first approach
```svelte
<!-- Desktop-only navigation -->
<nav class="hidden md:flex space-x-8">...</nav>

<!-- Mobile menu -->
<div class="md:hidden">...</div>

<!-- Responsive grid -->
<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">...</div>
```

### 6. Common Section Patterns

**Info Box with Border**:
```svelte
<div class="bg-blue-50 border-l-4 border-scout-blue p-6 rounded">
    <h3 class="font-bold text-xl text-scout-blue mb-2">Title</h3>
    <p class="text-gray-700">Content</p>
</div>
```

**Card Grid with Hover Effects**:
```svelte
<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
    <div class="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
        <img src={image} alt="Description" class="w-full h-48 object-cover" />
        <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Card Title</h3>
            <p class="text-gray-600">Card content</p>
        </div>
    </div>
</div>
```

**Call-to-Action Section**:
```svelte
<div class="bg-gradient-to-r from-scout-blue to-blue-600 text-white rounded-lg p-8 text-center">
    <h3 class="text-2xl font-bold mb-4">CTA Title</h3>
    <p class="text-lg mb-6">CTA description</p>
    <a href="/link" class="bg-scout-gold text-scout-blue px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
        Button Text
    </a>
</div>
```

**Numbered Steps** (from become-a-leader page):
```svelte
<div class="flex items-start gap-4">
    <div class="w-10 h-10 bg-scout-blue text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0">
        1
    </div>
    <div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Step Title</h3>
        <p class="text-gray-700">Step description</p>
    </div>
</div>
```

## Development Workflow

### Development Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173 by default)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run check

# Type checking with watch mode
npm run check:watch
```

### Git Workflow

**Branch Convention**: Feature branches start with `claude/` and include session ID
```bash
# Current branch example
claude/claude-md-miouh2p52m66pbpw-015819JFjEcBfJscGU52CA83
```

**Committing Changes**:
1. Review changes: `git status` and `git diff`
2. Stage files: `git add <files>`
3. Commit with descriptive message: `git commit -m "Message"`
4. Push with upstream: `git push -u origin <branch-name>`

**Important Git Notes**:
- Branch names MUST start with `claude/` for push permission
- Use retry logic for network failures (exponential backoff: 2s, 4s, 8s, 16s)
- Never force push to main/master
- Never skip hooks without explicit permission

### Recent Commit Patterns

Based on git history, recent work focuses on:
- Refactoring image import paths to use `$lib` alias
- Adding PDF resources for leader applications
- Updating event handling in components
- Favicon and metadata improvements

## Data Architecture

### State Management

- **No Global State**: No Svelte stores, context API, or external state libraries
- **Local Component State**: Components manage their own state using Svelte 5 `$state()`
- **Static Content**: All content is hard-coded in component templates

### Content Strategy

- **No CMS or Database**: Content is directly embedded in Svelte files
- **No API Calls**: All data is static
- **PDF Forms**: Stored in `/static/downloads/` directory
- **Images**: Optimized WebP format in `/src/lib/assets/`

### Key Information to Reference

**Contact Details**:
- Email: ElkGrovePack118@gmail.com
- Location: 3329 Point Pleasant Rd, Elk Grove, CA 95757
- Meeting Time: 2nd Tuesday, 6:15pm - 7:30pm

**Available PDF Resources**:
- `/downloads/Pack_118_General_Information.pdf`
- `/downloads/adult_application.pdf`
- `/downloads/waiver_and_live_scan.pdf`

## Common Tasks for AI Assistants

### Adding a New Page

1. Create directory in `src/routes/` (e.g., `new-page/`)
2. Add `+page.svelte` file with standard structure
3. Add page title in `<svelte:head>`
4. Update navigation in `src/lib/components/Navigation.svelte`
5. Follow responsive design patterns with Tailwind classes

### Adding New Images

1. Convert image to WebP format for optimization
2. Place in `src/lib/assets/` (or `assets/activities/` for activity images)
3. Use snake_case naming (e.g., `new_activity_image.webp`)
4. Import using `$lib` alias:
   ```javascript
   import newImage from "$lib/assets/new_activity_image.webp";
   ```

### Updating Navigation

Navigation component location: `src/lib/components/Navigation.svelte`

**Adding Main Link**:
```svelte
<a href="/new-page" class="text-gray-700 hover:text-blue-700 transition-colors">
    New Page
</a>
```

**Adding to Resources Dropdown**:
```svelte
<a href="/new-resource" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
    New Resource
</a>
```

### Styling New Components

1. Use Scout brand colors: `text-scout-blue`, `bg-scout-blue`, `text-scout-gold`
2. Follow spacing scale: `mb-4`, `mb-8`, `mb-12`, `py-16`
3. Add responsive breakpoints: `md:` and `lg:` prefixes
4. Include hover states: `hover:shadow-lg`, `hover:scale-105`
5. Add transitions: `transition-colors`, `transition-shadow`

### Working with TypeScript

- TypeScript strict mode is enabled
- Components can use TypeScript in `<script lang="ts">` blocks
- Type definitions extend `.svelte-kit/tsconfig.json`
- Path aliases handled automatically by SvelteKit

## Important Notes for AI Assistants

### Do's ✅

- **ALWAYS use `$lib` alias** for imports from `src/lib/`
- **Follow mobile-first responsive design** with Tailwind breakpoints
- **Use Svelte 5 syntax**: `$state()` for reactivity, `{@render children()}` for slots
- **Maintain consistent spacing**: multiples of 4 (mb-4, py-8, gap-12)
- **Include semantic HTML**: proper `<nav>`, `<main>`, `<section>` tags
- **Add accessibility**: ARIA labels, alt text, proper link attributes
- **Use WebP format** for new images
- **Match existing patterns**: study similar pages before creating new ones
- **Test responsive behavior**: verify mobile, tablet, and desktop layouts
- **Include page titles**: always add `<svelte:head>` with title

### Don'ts ❌

- **Don't use relative imports** (e.g., `../lib/`) - use `$lib` instead
- **Don't use `/src/` prefix** in import paths - use `$lib` alias
- **Don't add state management libraries** - keep state local
- **Don't add backend/API code** - this is a static site
- **Don't use old Svelte 4 syntax** - use Svelte 5 patterns
- **Don't skip responsive design** - always include mobile breakpoints
- **Don't forget hover states** - maintain interactive feel
- **Don't use inconsistent colors** - stick to scout-blue and scout-gold
- **Don't add authentication** - not needed for this informational site
- **Don't use different image formats** - prefer WebP for optimization

### Security & Best Practices

- External links use `target="_blank" rel="noopener noreferrer"`
- No user input or forms (static site)
- No environment variables or secrets needed
- Favicon and meta tags properly configured
- Robots.txt configured for search engines

### Accessibility Checklist

- ✅ Semantic HTML structure
- ✅ ARIA labels on interactive elements
- ✅ Alt text on all images
- ✅ Keyboard navigation support (native HTML elements)
- ✅ Color contrast meets WCAG standards
- ✅ Responsive text sizing

### Performance Considerations

- WebP images for smaller file sizes
- Tailwind CSS purging unused styles (automatic)
- Vite build optimization
- No runtime JavaScript for static content (minimal JS for navigation)
- Lazy loading handled by browser for images

## Testing & Quality Assurance

### Pre-Deployment Checklist

- [ ] All navigation links work correctly
- [ ] Responsive design tested on mobile, tablet, desktop
- [ ] All images load properly
- [ ] PDF downloads accessible
- [ ] No console errors in browser
- [ ] Type checking passes: `npm run check`
- [ ] Build succeeds: `npm run build`
- [ ] Meta tags present on all pages

### Browser Testing

Test in major browsers:
- Chrome/Edge (Chromium)
- Firefox
- Safari (desktop and iOS)
- Mobile Chrome/Safari

## Deployment Notes

- **Adapter**: `@sveltejs/adapter-auto` detects deployment platform automatically
- **Build Output**: Static files generated in `build/` directory
- **Compatible Platforms**: Vercel, Netlify, Cloudflare Pages, or any static hosting
- **Environment**: No environment variables required

## Additional Resources

- **SvelteKit Docs**: https://svelte.dev/docs/kit
- **Svelte 5 Docs**: https://svelte.dev/docs/svelte
- **Tailwind CSS v4**: https://tailwindcss.com/docs
- **Project Plan**: See `plan.md` for completed development phases

---

**Last Updated**: December 2, 2025
**Document Version**: 1.0
**Maintained By**: AI Assistants working on Cub Scout Pack 118 website
