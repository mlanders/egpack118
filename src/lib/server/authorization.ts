import type { RequestEvent } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import type { UserRole } from "@prisma/client";

export function requireAuth(event: RequestEvent) {
  if (!event.locals.session || !event.locals.user) {
    throw error(401, { message: "Unauthorized - Please log in" });
  }
  return event.locals.user;
}

export function requireRole(
  event: RequestEvent,
  allowedRoles: UserRole[]
) {
  const user = requireAuth(event);

  if (!allowedRoles.includes(user.role as UserRole)) {
    throw error(403, {
      message: `Access denied - Required role: ${allowedRoles.join(" or ")}`
    });
  }

  return user;
}

export function canWrite(event: RequestEvent): boolean {
  const user = event.locals.user;
  if (!user) return false;
  return user.role === "ADMIN" || user.role === "TREASURER";
}

export function requireWriteAccess(event: RequestEvent) {
  const user = requireAuth(event);

  if (user.role !== "ADMIN" && user.role !== "TREASURER") {
    throw error(403, {
      message: "Access denied - Write permission required"
    });
  }

  return user;
}

export function isAdmin(event: RequestEvent): boolean {
  return event.locals.user?.role === "ADMIN";
}
