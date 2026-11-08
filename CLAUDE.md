# CLAUDE.md

SvelteKit 2 / Svelte 5 (runes) / Tailwind v4 static-content site for Cub Scout Pack 118 (Elk Grove, CA). No database or auth.

## Commands
```bash
npm run dev      # dev server (port 5173)
npm run build    # production build
npm run check    # svelte-check
node scripts/update-calendar.js  # refresh src/content/calendar.json from the iCal feed
```

## Layout
- `src/routes/`: public pages (home, activities, calendar, faq, new-family-guide, pinewood-derby, resources, become-a-leader)
- `src/lib/components/`: Navigation, Footer, calendar, guide, leaders
- `src/lib/config/calendar-whitelist.ts`: calendar location/content filtering
