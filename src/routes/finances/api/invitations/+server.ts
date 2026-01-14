import { json, error } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";
import { requireRole } from "$lib/server/authorization";
import { prisma } from "$lib/server/prisma";
import { z } from "zod";

const invitationSchema = z.object({
  email: z.string().email(),
  role: z.enum(["ADMIN", "TREASURER", "USER"]),
});

// POST - Create invitation
export async function POST(event: RequestEvent) {
  const user = requireRole(event, ["ADMIN", "TREASURER"]);

  const body = await event.request.json();
  const validation = invitationSchema.safeParse(body);

  if (!validation.success) {
    throw error(400, { message: "Invalid request data" });
  }

  const { email, role } = validation.data;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw error(400, { message: "User already exists with this email" });
  }

  // Check for existing unused invitation
  const existingInvitation = await prisma.invitation.findFirst({
    where: {
      email,
      used: false,
      expiresAt: { gte: new Date() },
    },
  });

  if (existingInvitation) {
    throw error(400, { message: "Active invitation already exists" });
  }

  // Create invitation
  const token = crypto.randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  const invitation = await prisma.invitation.create({
    data: {
      email,
      role,
      token,
      expiresAt,
      invitedBy: user.id as string,
    },
  });

  return json({
    invitation,
    invitationUrl: `${event.url.origin}/finances/accept-invite?token=${token}`,
  });
}

// GET - List invitations
export async function GET(event: RequestEvent) {
  requireRole(event, ["ADMIN", "TREASURER"]);

  const invitations = await prisma.invitation.findMany({
    where: { used: false, expiresAt: { gte: new Date() } },
    orderBy: { createdAt: "desc" },
  });

  return json({ invitations });
}
