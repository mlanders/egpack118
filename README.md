# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Calendar refresh on Cloudflare

The Pack 118 Worker refreshes its public iCal feed every six hours on UTC
time. It writes the latest successful snapshot to the `CALENDAR_CACHE` KV
namespace. The calendar page uses the bundled `static/calendar.md` until the
first successful refresh, and applies its existing public-content filter to
both sources.

1. The Pack 118 account's namespace is wired in `wrangler.jsonc`. If you
   deploy to a different account, create its namespace with
   `npx wrangler kv namespace create CALENDAR_CACHE` and update the binding ID.
2. Build and deploy the Pack 118 site with `npm run build` and
   `npx wrangler deploy`. The checked-in Worker entry point attaches the cron.
3. Verify a successful scheduled invocation in Cloudflare and check the last
   updated timestamp on `/calendar`.

To test locally, run `node --test tests/calendar-feed.test.js`, then
`npm run build` and `npm run preview -- --test-scheduled`. Request
`http://localhost:8787/__scheduled?cron=0+*/6+*+*+*` and reload the calendar page.
