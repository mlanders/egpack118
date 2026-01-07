import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { FINANCE_PASSWORD } from "$env/static/private";
import { dev } from "$app/environment";

const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds

export const load: PageServerLoad = async ({ cookies }) => {
  const authTimestamp = cookies.get("finance_auth_timestamp");

  if (authTimestamp) {
    const timestamp = parseInt(authTimestamp);
    const now = Date.now();

    // Check if session is still valid (within 15 minutes)
    if (now - timestamp < SESSION_TIMEOUT) {
      return { authenticated: true };
    } else {
      // Session expired, clear cookie
      cookies.delete("finance_auth_timestamp", { path: "/finances" });
    }
  }

  return { authenticated: false };
};

export const actions = {
  login: async ({ request, cookies }) => {
    const data = await request.formData();
    const password = data.get("password");

    if (password === FINANCE_PASSWORD) {
      // Set cookie with current timestamp
      cookies.set("finance_auth_timestamp", Date.now().toString(), {
        path: "/finances",
        httpOnly: true,
        sameSite: "strict",
        secure: !dev,
        maxAge: SESSION_TIMEOUT / 1000, // Convert to seconds
      });

      return { success: true };
    }

    return fail(401, { incorrect: true });
  },

  logout: async ({ cookies }) => {
    cookies.delete("finance_auth_timestamp", { path: "/finances" });
    return { success: true };
  },
} satisfies Actions;
