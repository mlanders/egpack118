import site from "./.svelte-kit/cloudflare/_worker.js";
import { refreshCalendar } from "./scripts/calendar-feed.js";

export default {
  fetch: site.fetch,

  async scheduled(_controller, env) {
    await refreshCalendar(env.CALENDAR_CACHE);
    console.log("Pack 118 calendar refreshed");
  },
};
