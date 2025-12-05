import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ICAL_URL =
  "https://calendar.google.com/calendar/ical/ld2c70e20kot5palni2skd61bjlr71s6%40import.calendar.google.com/public/basic.ics";
const OUTPUT_PATH = join(__dirname, "../static/calendar.md");

// Parse iCal data
function parseICalendar(icalData) {
  const events = [];
  const lines = icalData.split("\n");
  let currentEvent = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line === "BEGIN:VEVENT") {
      currentEvent = {};
    } else if (line === "END:VEVENT" && currentEvent) {
      events.push(currentEvent);
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
          currentEvent.startDate = parseICalDate(value);
          currentEvent.startDateRaw = value;
        } else if (baseKey === "DTEND") {
          currentEvent.endDate = parseICalDate(value);
          currentEvent.endDateRaw = value;
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

  return events;
}

// Parse iCal date format (YYYYMMDD or YYYYMMDDTHHMMSS)
function parseICalDate(dateStr) {
  const year = parseInt(dateStr.substring(0, 4));
  const month = parseInt(dateStr.substring(4, 6)) - 1;
  const day = parseInt(dateStr.substring(6, 8));

  if (dateStr.length > 8 && dateStr.includes("T")) {
    const hour = parseInt(dateStr.substring(9, 11));
    const minute = parseInt(dateStr.substring(11, 13));
    const second = parseInt(dateStr.substring(13, 15));
    return new Date(Date.UTC(year, month, day, hour, minute, second));
  }

  return new Date(year, month, day);
}

// Format date for display
function formatDate(date, isAllDay) {
  if (isAllDay) {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// Generate markdown from events
function generateMarkdown(events) {
  const now = new Date();
  const sixMonthsFromNow = new Date();
  sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

  // Filter events: upcoming events within the next 6 months
  const filteredEvents = events
    .filter((event) => {
      const eventDate = event.startDate;
      return eventDate >= now && eventDate <= sixMonthsFromNow;
    })
    .sort((a, b) => a.startDate - b.startDate);

  let markdown = `# Pack 118 Calendar\n\n`;
  markdown += `*Last updated: ${now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" })}*\n\n`;
  markdown += `## Upcoming Events (Next 6 Months)\n\n`;

  if (filteredEvents.length === 0) {
    markdown += `*No upcoming events scheduled.*\n`;
    return markdown;
  }

  // Group events by month
  const eventsByMonth = {};
  filteredEvents.forEach((event) => {
    const monthKey = event.startDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
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

// Main function
async function main() {
  try {
    console.log("Fetching calendar data...");
    const response = await fetch(ICAL_URL);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch calendar: ${response.status} ${response.statusText}`,
      );
    }

    const icalData = await response.text();
    console.log("Parsing calendar events...");

    const events = parseICalendar(icalData);
    console.log(`Found ${events.length} total events`);

    const markdown = generateMarkdown(events);

    console.log("Writing calendar.md...");
    writeFileSync(OUTPUT_PATH, markdown, "utf8");

    console.log("✓ Calendar updated successfully!");
  } catch (error) {
    console.error("Error updating calendar:", error);
    process.exit(1);
  }
}

main();
