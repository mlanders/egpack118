import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";

export const load: PageServerLoad = async ({ url }) => {
  const token = url.searchParams.get("token");

  if (!token) {
    throw error(400, { message: "Missing invitation token" });
  }

  const invitation = await prisma.invitation.findUnique({
    where: { token },
  });

  if (!invitation || invitation.used || invitation.expiresAt < new Date()) {
    return { invitation: null };
  }

  return {
    invitation: {
      ...invitation,
      createdAt: invitation.createdAt.toISOString(),
      expiresAt: invitation.expiresAt.toISOString(),
    }
  };
};
