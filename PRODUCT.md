# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: parents of Kindergarten through 5th grade children who are considering joining, often knowing little about Scouting. Secondary: current families and volunteer leaders looking up dates, guides and forms.

## Product Purpose

The public website for Cub Scout Pack 118 in Elk Grove, CA. Success is a new family showing up at a pack meeting.

## Positioning

- Boys and girls are welcome, Kindergarten through 5th grade.
- Families can visit a meeting before joining, with no sign-up or uniform.
- The pack is financially independent and runs on registration fees and fundraising.
- Hands-on events, such as the Pinewood Derby, the USS Hornet overnight, hikes and campouts.

## Operating Context

- Pack meetings are the 2nd Thursday of each month, 6:15-7:30 PM, at the United Methodist Church, 3329 Point Pleasant Rd, Elk Grove, CA 95757.
- The calendar comes from an iCal feed (events are entered through BAND) and is refreshed by a Cloudflare Worker.
- Contact is by email: ElkGrovePack118@gmail.com.

## Capabilities and Constraints

- Static-content SvelteKit site deployed to Cloudflare Workers. No database or sign-in.
- Public pages: home, calendar, activities, Pinewood Derby, new family guide, FAQ, resources, become a leader.
- Terminology: Pack, den, den leader, Cubmaster, Committee Chair; ranks Lion, Tiger, Wolf, Bear, Webelos, Arrow of Light; "Scouting America (formerly Boy Scouts of America)".
- Scouting America has no Transitional Kindergarten curriculum.

Privacy rules every change must keep:

- No private home addresses.
- Leaders are named by first name and last initial only.
- Photos of children are published only with their family's consent.
- No personal payment handles (such as Venmo or Zelle) on the public site, including calendar descriptions.

## Brand Commitments

- Name: Cub Scout Pack 118, Elk Grove, CA.
- Cub Scouts logo and the official den insignia.

## Evidence on Hand

- Scout photos: `src/lib/assets/scouts1.webp`, `scouts2.webp`, `scouts3.webp`.
- Den insignia: `src/lib/assets/den_insignias/`.
- 2025-26 costs: $165 registration, $100 pack fee.
- No testimonials, membership numbers or press on hand; do not invent them.

## Product Principles

- Serve the prospective parent first: what it is, when to come, how to try it.
- State only facts the pack can stand behind.
- Keep one answer for each fact (meeting time, costs, leaders) across pages.
- Protect families' and leaders' privacy over completeness.
- Keep it easy for volunteers to maintain.
