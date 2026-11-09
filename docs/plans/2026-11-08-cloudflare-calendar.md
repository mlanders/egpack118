# Cloudflare calendar implementation plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refresh the Pack 118 calendar on Cloudflare every six hours.

**Architecture:** Keep SvelteKit's generated fetch handler and add a scheduled handler to the Worker entry point. Write one validated calendar snapshot to KV and let the page fall back to the bundled calendar when KV is empty or unavailable.

**Tech Stack:** SvelteKit, Wrangler, Workers Cron Triggers, Workers KV, Node test runner.

1. Extract the iCal fetch and formatting into a Worker-compatible module and verify dates in Pacific time.
2. Wrap the generated entry point, bind KV, and make the page read the latest snapshot through the existing content filter.
3. Remove the GitHub refresh workflow and document provisioning and local verification. Run the build, the calendar tests, and a Wrangler dry run.
