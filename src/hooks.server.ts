import { auth } from "$lib/server/auth";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { prisma } from "$lib/server/prisma";
import { building } from "$app/environment";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  // Populate event.locals with session and user
  const session = await auth.api.getSession({
    headers: event.request.headers,
  });

  event.locals.session = session?.session ?? null;

  // If we have a user, fetch the full user with role from database
  if (session?.user) {
    const fullUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    });
    event.locals.user = fullUser as any;
  } else {
    event.locals.user = null;
  }

  // Use Better Auth's SvelteKit handler to handle auth routes and resolve
  return svelteKitHandler({ event, resolve, auth, building });
};
