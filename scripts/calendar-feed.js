import { CALENDAR_SNAPSHOT_KEY } from "../src/lib/calendar-snapshot.js";

const ICAL_URL =
  "https://calendar.google.com/calendar/ical/ld2c70e20kot5palni2skd61bjlr71s6%40import.calendar.google.com/public/basic.ics";

/** @typedef {{ startDate: Date, startDateRaw: string, endDate?: Date, summary?: string, description?: string, location?: string }} CalendarEvent */

/** @param {string} icalData */
function parseICalendar(icalData) {
  /** @type {CalendarEvent[]} */
  const events = [];
  const lines = icalData.split("\n");
  /** @type {Partial<CalendarEvent> | null} */
  let currentEvent = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line === "BEGIN:VEVENT") {
      if (currentEvent) throw new Error("Unexpected nested iCal event");
      currentEvent = {};
    } else if (line === "END:VEVENT" && currentEvent) {
      if (!currentEvent.startDate || !currentEvent.startDateRaw) throw new Error("iCal event is missing DTSTART");
      events.push({ ...currentEvent, startDate: currentEvent.startDate, startDateRaw: currentEvent.startDateRaw });
      currentEvent = null;
    } else if (currentEvent) {
      const colonIndex = line.indexOf(":");
      if (colonIndex > 0) {
        let key = line.substring(0, colonIndex);
        let value = line.substring(colonIndex + 1);

        // Handle multi-line values (continuation lines start with space or tab)
        while (i + 1 < lines.length && /^[ \t]/.test(lines[i + 1])) {
          i++;
          value += lines[i].trim();
        }

        // Extract the base key (before semicolon for parameters)
        const semiIndex = key.indexOf(";");
        const baseKey = semiIndex > 0 ? key.substring(0, semiIndex) : key;

        if (baseKey === "DTSTART") {
          currentEvent.startDate = parseICalDate(value, /(?:^|;)TZID="?([^;"]+)/i.exec(key)?.[1]);
          currentEvent.startDateRaw = value;
        } else if (baseKey === "DTEND") {
          currentEvent.endDate = parseICalDate(value, /(?:^|;)TZID="?([^;"]+)/i.exec(key)?.[1]);
        } else if (baseKey === "SUMMARY") {
          currentEvent.summary = value
            .replace(/\\,/g, ",")
            .replace(/\\;/g, ";")
            .replace(/\\n/g, "\n");
        } else if (baseKey === "DESCRIPTION") {
          currentEvent.description = value
            .replace(/\\,/g, ",")
            .replace(/\\;/g, ";")
            .replace(/\\n/g, "\n");
        } else if (baseKey === "LOCATION") {
          currentEvent.location = value
            .replace(/\\,/g, ",")
            .replace(/\\;/g, ";")
            .replace(/\\n/g, "\n");
        }
      }
    }
  }

  if (currentEvent) throw new Error("Incomplete iCal event");
  return events;
}

const PACIFIC = "America/Los_Angeles";

/** @param {string} value */
function parseICalDate(value, timezone = PACIFIC) {
  const parts = /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?$/.exec(value);
  if (!parts) throw new Error("Invalid iCal date");
  const [, year, month, day, hour, minute, second, utc] = parts;
  const wallTime = Date.UTC(+year, +month - 1, +day, +(hour ?? 12), +(minute ?? 0), +(second ?? 0));
  if (utc) return new Date(wallTime);

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone, year: "numeric", month: "numeric", day: "numeric",
    hour: "numeric", minute: "numeric", second: "numeric", hourCycle: "h23",
  });
  // Resolve a local wall time to an instant. The second pass handles an offset
  // change between the initial UTC guess and the corrected instant.
  let instant = wallTime;
  for (let pass = 0; pass < 2; pass++) {
    const local = Object.fromEntries(formatter.formatToParts(instant).map(({ type, value }) => [type, Number(value)]));
    instant += wallTime - Date.UTC(local.year, local.month - 1, local.day, local.hour, local.minute, local.second);
  }
  return new Date(instant);
}

/** @param {Date} date @param {boolean} isAllDay */
function formatDate(date, isAllDay) {
  /** @type {Intl.DateTimeFormatOptions} */
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Los_Angeles",
  };

  if (isAllDay) {
    return date.toLocaleDateString("en-US", options);
  }

  return date.toLocaleString("en-US", {
    ...options,
    hour: "numeric",
    minute: "2-digit",
  });
}

/** @param {CalendarEvent[]} events @param {Date} now */
function generateMarkdown(events, now) {
  const sixMonthsFromNow = new Date(now);
  const pacificDay = new Intl.DateTimeFormat("en-CA", { timeZone: PACIFIC, dateStyle: "short" });
  sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

  // Filter events: upcoming events within the next 6 months
  const filteredEvents = events
    .filter((event) => {
      const eventDate = event.startDate;
      const isToday = event.startDateRaw?.length === 8 && eventDate && pacificDay.format(eventDate) === pacificDay.format(now);
      return (eventDate >= now || isToday) && eventDate <= sixMonthsFromNow;
    })
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  let markdown = `# Pack 118 Calendar\n\n`;
  markdown += `*Last updated: ${now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" })}*\n\n`;
  markdown += `## Upcoming Events (Next 6 Months)\n\n`;

  if (filteredEvents.length === 0) {
    markdown += `*No upcoming events scheduled.*\n`;
    return markdown;
  }

  // Group events by month
  /** @type {Record<string, CalendarEvent[]>} */
  const eventsByMonth = {};
  filteredEvents.forEach((event) => {
    const monthKey = event.startDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      timeZone: "America/Los_Angeles",
    });
    if (!eventsByMonth[monthKey]) {
      eventsByMonth[monthKey] = [];
    }
    eventsByMonth[monthKey].push(event);
  });

  // Generate markdown for each month
  Object.entries(eventsByMonth).forEach(([month, monthEvents]) => {
    markdown += `### ${month}\n\n`;

    monthEvents.forEach((event) => {
      const isAllDay = !event.startDateRaw.includes("T");
      markdown += `#### ${event.summary}\n\n`;
      markdown += `**Date:** ${formatDate(event.startDate, isAllDay)}`;

      if (!isAllDay && event.endDate) {
        const endTime = event.endDate.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          timeZone: "America/Los_Angeles",
        });
        markdown += ` - ${endTime}`;
      }

      markdown += `\n\n`;

      if (event.location) {
        markdown += `**Location:** ${event.location}\n\n`;
      }

      if (event.description) {
        markdown += `${event.description}\n\n`;
      }

      markdown += `---\n\n`;
    });
  });

  return markdown;
}

/** @param {{ put(key: string, value: string): Promise<unknown> }} namespace */
export async function refreshCalendar(namespace, { fetchFeed = fetch, now = new Date() } = {}) {
  const response = await fetchFeed(ICAL_URL, { signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error(`Calendar feed returned HTTP ${response.status}`);

  const data = await response.text();
  if (!/^BEGIN:VCALENDAR\r?\n/i.test(data) || !/\r?\nEND:VCALENDAR\s*$/i.test(data)) {
    throw new Error("Calendar feed did not return a complete iCal document");
  }

  const events = parseICalendar(data);
  await namespace.put(CALENDAR_SNAPSHOT_KEY, generateMarkdown(events, now));
}
