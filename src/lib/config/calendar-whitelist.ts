/**
 * Calendar Content Whitelist Configuration
 *
 * This file defines patterns for addresses and URLs that should be shown publicly.
 * Any content not matching these patterns will be filtered out from the public calendar.
 */

export const WHITELIST = {
  /**
   * Blocked location patterns (case-insensitive)
   * Locations containing these patterns will ALWAYS be hidden, regardless of allowedLocations
   * This takes priority over allowedLocations
   */
  blockedLocations: [
    "9810 Collie Way",
    // Add more private addresses here
  ],

  /**
   * Allowed location patterns (case-insensitive)
   * Add full addresses or partial patterns that are safe to display publicly
   */
  allowedLocations: [
    // Public venues
    "Point Pleasant United Methodist Church",
    "3329 Point Pleasant Rd, Elk Grove, CA 95757",
    "United Methodist Church",
    "Nimbus Fish Hatchery",
    "2001 Nimbus Rd",
    "2101 Nimbus Rd, Gold River, CA 95670",
    // Add more public locations here as needed
  ],

  /**
   * Allowed URL patterns (case-insensitive)
   * Add domain patterns or full URLs that are safe to display publicly
   */
  allowedUrlPatterns: [
    "https://calendar.google.com",
    "https://www.gec-bsa.org",
    "https://bit.ly",
    "https://maps.google.com",
    // Add more public URL patterns here
  ],

  /**
   * Blocked URL patterns (case-insensitive)
   * URLs containing these patterns will be removed from descriptions and locations
   */
  blockedUrlPatterns: [
    "zoom.us",
    "csus.zoom.us",
    // Add more blocked patterns here
  ],
};

/**
 * Check if a location string is allowed to be displayed publicly
 */
export function isLocationAllowed(location: string | undefined): boolean {
  if (!location) return true;

  const locationLower = location.toLowerCase();

  // First check if it's explicitly blocked (takes priority)
  for (const blocked of WHITELIST.blockedLocations) {
    if (locationLower.includes(blocked.toLowerCase())) {
      return false;
    }
  }

  // Then check if it's an allowed location
  for (const allowed of WHITELIST.allowedLocations) {
    if (locationLower.includes(allowed.toLowerCase())) {
      return true;
    }
  }

  // If it doesn't match any allowed location, hide it
  return false;
}

/**
 * Filter sensitive content from text (URLs and locations)
 */
export function filterSensitiveContent(
  text: string | undefined,
): string | undefined {
  if (!text) return text;

  let filteredText = text;

  // Remove blocked URLs
  for (const blocked of WHITELIST.blockedUrlPatterns) {
    const regex = new RegExp(
      `https?://[^\\s]*${blocked.replace(".", "\\.")}[^\\s]*`,
      "gi",
    );
    filteredText = filteredText.replace(regex, "[URL removed for privacy]");
  }

  // Remove blocked locations from text
  for (const blocked of WHITELIST.blockedLocations) {
    // Create a regex that matches the blocked location (case-insensitive)
    // Escape special regex characters
    const escapedBlocked = blocked.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escapedBlocked, "gi");
    filteredText = filteredText.replace(regex, "[Address removed for privacy]");
  }

  return filteredText;
}

/**
 * @deprecated Use filterSensitiveContent instead
 * Filter URLs from text, removing blocked URLs and keeping allowed ones
 */
export function filterUrls(text: string | undefined): string | undefined {
  return filterSensitiveContent(text);
}

/**
 * Check if a URL is allowed to be displayed
 */
export function isUrlAllowed(url: string): boolean {
  const urlLower = url.toLowerCase();

  // Check if it matches any blocked pattern
  for (const blocked of WHITELIST.blockedUrlPatterns) {
    if (urlLower.includes(blocked.toLowerCase())) {
      return false;
    }
  }

  // Check if it matches any allowed pattern
  for (const allowed of WHITELIST.allowedUrlPatterns) {
    if (urlLower.includes(allowed.toLowerCase())) {
      return true;
    }
  }

  // If it doesn't match any allowed pattern, block it
  return false;
}

/**
 * Clean event data by filtering sensitive information
 */
export function cleanEventData(event: {
  title: string;
  date: string;
  time?: string;
  location?: string;
  description?: string;
  dateObj?: Date;
}): {
  title: string;
  date: string;
  time?: string;
  location?: string;
  description?: string;
  dateObj?: Date;
} {
  return {
    ...event,
    location: isLocationAllowed(event.location) ? event.location : undefined,
    description: filterSensitiveContent(event.description),
  };
}
