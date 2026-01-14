import { json, error } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";
import { requireRole } from "$lib/server/authorization";
import { prisma } from "$lib/server/prisma";

// GET - List all users
export async function GET(event: RequestEvent) {
  requireRole(event, ["ADMIN", "TREASURER"]);

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      emailVerified: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return json({
    users: users.map((user) => ({
      ...user,
      createdAt: user.createdAt.toISOString(),
    })),
  });
}

// DELETE - Delete user (ADMIN only)
export async function DELETE(event: RequestEvent) {
  requireRole(event, ["ADMIN"]);

  const body = await event.request.json();
  const userId = body.userId;

  if (!userId) {
    throw error(400, { message: "User ID is required" });
  }

  // Don't allow deleting yourself
  if (event.locals.user?.id === userId) {
    throw error(400, { message: "Cannot delete your own account" });
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  return json({ success: true });
}
