import { readFileSync } from "fs";
import { join } from "path";
import { dev } from "$app/environment";
import type { PageServerLoad } from "./$types";
import { cleanEventData } from "$lib/config/calendar-whitelist";

export const load: PageServerLoad = async ({ fetch }) => {
  try {
    let calendarContent: string;

    if (dev) {
      // In development, read from filesystem
      const calendarPath = join(process.cwd(), "static/calendar.md");
      calendarContent = readFileSync(calendarPath, "utf-8");
    } else {
      // In production, fetch via HTTP
      const response = await fetch("/calendar.md");
      if (!response.ok) {
        throw new Error(`Failed to fetch calendar: ${response.status}`);
      }
      calendarContent = await response.text();
    }

    // Parse the markdown into structured data
    const events = parseCalendarMarkdown(calendarContent);

    // Apply whitelist filtering to events
    const cleanedEvents = events.map((monthGroup) => ({
      ...monthGroup,
      events: monthGroup.events.map(cleanEventData),
    }));

    const calendarData = buildCalendarGrid(cleanedEvents);

    return {
      events: cleanedEvents,
      calendarData,
      lastUpdated: extractLastUpdated(calendarContent),
    };
  } catch (error) {
    console.error("Error loading calendar:", error);
    return {
      events: [],
      calendarData: [],
      lastUpdated: null,
    };
  }
};

interface Event {
  title: string;
  date: string;
  time?: string;
  location?: string;
  description?: string;
  dateObj?: Date;
}

interface MonthGroup {
  month: string;
  events: Event[];
}

interface CalendarDay {
  day: number;
  isCurrentMonth: boolean;
  events: Event[];
  date: Date;
}

interface CalendarMonth {
  month: string;
  year: number;
  weeks: CalendarDay[][];
}

function extractLastUpdated(content: string): string | null {
  const match = content.match(/\*Last updated: (.+?)\*/);
  return match ? match[1] : null;
}

function parseCalendarMarkdown(content: string): MonthGroup[] {
  const monthGroups: MonthGroup[] = [];
  const lines = content.split("\n");

  let currentMonth: MonthGroup | null = null;
  let currentEvent: Event | null = null;
  let inDescription = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Match month headers (### December 2025)
    if (line.startsWith("### ")) {
      if (currentEvent && currentMonth) {
        currentMonth.events.push(currentEvent);
        currentEvent = null;
      }
      currentMonth = {
        month: line.replace("### ", "").trim(),
        events: [],
      };
      monthGroups.push(currentMonth);
      inDescription = false;
    }
    // Match event titles (#### Event Name)
    else if (line.startsWith("#### ")) {
      if (currentEvent && currentMonth) {
        currentMonth.events.push(currentEvent);
      }
      currentEvent = {
        title: line.replace("#### ", "").trim(),
        date: "",
      };
      inDescription = false;
    }
    // Match date line
    else if (line.startsWith("**Date:**") && currentEvent) {
      const dateContent = line.replace("**Date:**", "").trim();
      // Check if there's a time range (contains '-')
      if (
        dateContent.includes(" - ") &&
        (dateContent.includes("AM") || dateContent.includes("PM"))
      ) {
        const parts = dateContent.split(" at ");
        currentEvent.date = parts[0]?.trim() || dateContent;
        currentEvent.time = parts[1]?.trim() || undefined;
      } else {
        currentEvent.date = dateContent;
      }
      // Parse date to Date object
      currentEvent.dateObj = parseDateString(dateContent);
      inDescription = false;
    }
    // Match location line
    else if (line.startsWith("**Location:**") && currentEvent) {
      currentEvent.location = line.replace("**Location:**", "").trim();
      inDescription = false;
    }
    // Match separator (end of event)
    else if (line.trim() === "---") {
      if (currentEvent && currentMonth) {
        currentMonth.events.push(currentEvent);
        currentEvent = null;
      }
      inDescription = false;
    }
    // Collect description lines (after date/location, before separator)
    else if (
      currentEvent &&
      line.trim() &&
      !line.startsWith("**") &&
      !line.startsWith("#")
    ) {
      if (!inDescription) {
        currentEvent.description = line.trim();
        inDescription = true;
      } else {
        currentEvent.description += "\n" + line.trim();
      }
    }
  }

  // Add the last event if exists
  if (currentEvent && currentMonth) {
    currentMonth.events.push(currentEvent);
  }

  return monthGroups;
}

function parseDateString(dateStr: string): Date {
  // Try to parse date strings like "Tuesday, December 9, 2025 at 10:15 AM"
  const dateMatch = dateStr.match(/(\w+day),\s+(\w+)\s+(\d+),\s+(\d+)/);
  if (dateMatch) {
    const [, , monthName, day, year] = dateMatch;
    const month = new Date(`${monthName} 1, ${year}`).getMonth();
    return new Date(parseInt(year), month, parseInt(day));
  }
  return new Date();
}

function buildCalendarGrid(monthGroups: MonthGroup[]): CalendarMonth[] {
  const calendarMonths: CalendarMonth[] = [];

  monthGroups.forEach((monthGroup) => {
    // Parse month and year from string like "December 2025"
    const [monthName, yearStr] = monthGroup.month.split(" ");
    const year = parseInt(yearStr);
    const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();

    // Get first day of month and last day of month
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);

    // Get the day of week for the first day (0 = Sunday)
    const firstDayOfWeek = firstDay.getDay();

    // Build calendar grid
    const weeks: CalendarDay[][] = [];
    let currentWeek: CalendarDay[] = [];

    // Add days from previous month to fill the first week
    const prevMonthLastDay = new Date(year, monthIndex, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const date = new Date(year, monthIndex - 1, day);
      currentWeek.push({
        day,
        isCurrentMonth: false,
        events: [],
        date,
      });
    }

    // Add days from current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, monthIndex, day);
      const dayEvents = monthGroup.events.filter((event) => {
        if (!event.dateObj) return false;
        return (
          event.dateObj.getDate() === day &&
          event.dateObj.getMonth() === monthIndex &&
          event.dateObj.getFullYear() === year
        );
      });

      currentWeek.push({
        day,
        isCurrentMonth: true,
        events: dayEvents,
        date,
      });

      // If we've completed a week (Sunday to Saturday)
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // Add days from next month to complete the last week
    if (currentWeek.length > 0) {
      let nextMonthDay = 1;
      while (currentWeek.length < 7) {
        const date = new Date(year, monthIndex + 1, nextMonthDay);
        currentWeek.push({
          day: nextMonthDay,
          isCurrentMonth: false,
          events: [],
          date,
        });
        nextMonthDay++;
      }
      weeks.push(currentWeek);
    }

    calendarMonths.push({
      month: monthGroup.month,
      year,
      weeks,
    });
  });

  return calendarMonths;
}
