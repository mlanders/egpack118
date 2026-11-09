import assert from "node:assert/strict";
import test from "node:test";
import { refreshCalendar } from "../scripts/calendar-feed.js";

/** @param {...string} events */
const feed = (...events) =>
  ["BEGIN:VCALENDAR", "VERSION:2.0", ...events, "END:VCALENDAR"].join("\r\n");

test("publishes Pacific times and includes same-day all-day events", async () => {
  /** @type {[string, string][]} */
  const writes = [];
  await refreshCalendar({ put: async (...args) => writes.push(args) }, {
    now: new Date("2026-07-02T03:00:00Z"),
    fetchFeed: async () => new Response(feed(
      "BEGIN:VEVENT\r\nDTSTART;VALUE=DATE:20260701\r\nSUMMARY:All-day\r\nEND:VEVENT",
      "BEGIN:VEVENT\r\nDTSTART:20260702T013000Z\r\nSUMMARY:Past\r\nEND:VEVENT",
      "BEGIN:VEVENT\r\nDTSTART:20260703T013000Z\r\nSUMMARY:UTC event\r\nEND:VEVENT",
      "BEGIN:VEVENT\r\nDTSTART;TZID=America/Los_Angeles:20260703T183000\r\nSUMMARY:Pacific event\r\nEND:VEVENT",
    )),
  });
  assert.equal(writes.length, 1);
  const [[key, snapshot]] = writes;
  assert.equal(key, "calendar.md");
  assert.match(snapshot, /All-day\n\n\*\*Date:\*\* Wednesday, July 1, 2026/);
  assert.match(snapshot, /Thursday, July 2, 2026 at 6:30 PM/);
  assert.match(snapshot, /Friday, July 3, 2026 at 6:30 PM/);
  assert.doesNotMatch(snapshot, /Past/);
});

test("keeps the previous snapshot when the feed is unavailable or incomplete", async () => {
  for (const response of [new Response("", { status: 503 }), new Response("BEGIN:VCALENDAR\r\n"), new Response(feed("BEGIN:VEVENT"))]) {
    await assert.rejects(refreshCalendar({
      put: () => assert.fail("An invalid response should never replace the snapshot"),
    }, { fetchFeed: async () => response }));
  }
});
