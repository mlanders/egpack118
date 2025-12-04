# Calendar Whitelist Configuration

This directory contains the configuration for filtering sensitive information from the public calendar display.

## Overview

The whitelist system protects private information (like personal addresses and Zoom URLs) from being displayed publicly on the calendar page while allowing public venues and approved URLs to be shown.

## How It Works

When the calendar data is loaded from `calendar.md`, the server applies filters to:

1. **Remove private locations** - Only addresses matching the whitelist are displayed in the location field
2. **Filter sensitive URLs** - Zoom links and other blocked URLs are removed from descriptions
3. **Filter blocked addresses from descriptions** - Private addresses in `blockedLocations` are replaced with `[Address removed for privacy]` in event descriptions
4. **Keep public information** - Approved locations and URLs are shown normally

## Configuration File

Edit `src/lib/config/calendar-whitelist.ts` to manage what content is allowed:

### Blocked Locations (Priority)

**These are checked first and take priority over allowed locations.**

Add private addresses to the `blockedLocations` array:

```typescript
blockedLocations: [
  "9810 Collie Way",
  // Add more private addresses here
];
```

**How it works:** If an event's location contains any of these strings (case-insensitive), it will ALWAYS be hidden, even if it matches an allowed pattern.

### Allowed Locations

Add public venue addresses to the `allowedLocations` array:

```typescript
allowedLocations: [
  "Point Pleasant United Methodist Church",
  "3329 Point Pleasant Rd, Elk Grove, CA 95757",
  "Nimbus Fish Hatchery",
  // Add more public locations here
];
```

**How it works:** If an event's location contains any of these strings (case-insensitive), it will be displayed. Otherwise, the location will be hidden.

### Allowed URL Patterns

Add domain patterns for URLs that should be visible in descriptions:

```typescript
allowedUrlPatterns: [
  "https://calendar.google.com",
  "https://www.gec-bsa.org",
  "https://bit.ly",
  "https://maps.google.com",
  // Add more public URL patterns here
];
```

### Blocked URL Patterns

Add patterns for URLs that should be removed from descriptions:

```typescript
blockedUrlPatterns: [
  "zoom.us",
  "csus.zoom.us",
  // Add more blocked patterns here
];
```

**How it works:** Any URL containing these patterns will be replaced with `[URL removed for privacy]` in event descriptions.

## Examples

### Example 1: Private Home Address

**Original:** `Location: 9810 Collie Way, Elk Grove, CA 95757`
**Filtered:** Location field removed (not shown)

### Example 2: Public Venue

**Original:** `Location: Point Pleasant United Methodist Church, 3329 Point Pleasant Rd`
**Filtered:** Location displayed as-is (matches whitelist)

### Example 3: Zoom URL in Description

**Original:** `Join us at: https://csus.zoom.us/j/12345678`
**Filtered:** `Join us at: [URL removed for privacy]`

### Example 4: Approved URL

**Original:** `Register at: https://www.gec-bsa.org/events`
**Filtered:** URL displayed as-is (matches allowed pattern)

## Adding New Entries

1. Open `src/lib/config/calendar-whitelist.ts`
2. Add the location or URL pattern to the appropriate array
3. Rebuild the site: `npm run build`
4. The changes will apply automatically on next deployment

## Security Notes

- The whitelist is server-side only - filtered data never reaches the browser
- The original `calendar.md` file is not modified - filtering happens at runtime
- Private addresses from the Google Calendar still exist in the markdown file but are hidden from public view
- Consider the whitelist a security layer, not the only protection for sensitive data

## Maintenance

Review and update the whitelist regularly when:

- Adding new public venues that should be displayed
- Discovering new URL patterns that should be blocked
- Moving events between public and private locations
