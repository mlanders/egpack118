import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals }) => {
  const user = locals.user;

  if (!user) {
    throw error(401, { message: "Unauthorized" });
  }

  // Only ADMIN and TREASURER can access user management
  if (user.role !== "ADMIN" && user.role !== "TREASURER") {
    throw error(403, { message: "Access denied" });
  }

  return {
    user,
  };
};
