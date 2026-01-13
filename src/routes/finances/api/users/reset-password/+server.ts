import { json, error } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";
import { requireRole } from "$lib/server/authorization";
import { prisma } from "$lib/server/prisma";
import { hash } from "bcryptjs";
import { z } from "zod";

const resetPasswordSchema = z.object({
  userId: z.string(),
  newPassword: z.string().min(8),
});

export async function POST(event: RequestEvent) {
  // Only ADMIN can reset passwords
  requireRole(event, ["ADMIN"]);

  const body = await event.request.json();
  const validation = resetPasswordSchema.safeParse(body);

  if (!validation.success) {
    throw error(400, { message: "Invalid request data" });
  }

  const { userId, newPassword } = validation.data;

  // Get the user
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { accounts: true },
  });

  if (!user) {
    throw error(404, { message: "User not found" });
  }

  // Find the credential account
  const account = user.accounts.find((a) => a.providerId === "credential");

  if (!account) {
    throw error(400, { message: "User does not have password authentication" });
  }

  // Hash new password
  const hashedPassword = await hash(newPassword, 10);

  // Update password
  await prisma.account.update({
    where: { id: account.id },
    data: { password: hashedPassword },
  });

  return json({ success: true, message: "Password reset successfully" });
}
