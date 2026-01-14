import { json, error } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";
import { z } from "zod";

const acceptSchema = z.object({
  token: z.string(),
});

export async function POST(event: RequestEvent) {
  const body = await event.request.json();
  const validation = acceptSchema.safeParse(body);

  if (!validation.success) {
    throw error(400, { message: "Invalid request" });
  }

  const { token } = validation.data;

  const invitation = await prisma.invitation.findUnique({
    where: { token },
  });

  if (!invitation || invitation.used || invitation.expiresAt < new Date()) {
    throw error(400, { message: "Invalid or expired invitation" });
  }

  // Update user role (user should have just been created)
  const user = await prisma.user.findUnique({
    where: { email: invitation.email },
  });

  if (!user) {
    throw error(400, { message: "User not found" });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { role: invitation.role },
  });

  // Mark invitation as used
  await prisma.invitation.update({
    where: { id: invitation.id },
    data: { used: true },
  });

  return json({ success: true });
}
