import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { prisma } from "$lib/server/prisma";
import { validateSession } from "$lib/server/auth";
import { scoutSchema } from "$lib/server/validation";
import { z } from "zod";

// GET /finances/api/scouts/[id]
export const GET: RequestHandler = async (event) => {
  validateSession(event);

  const id = parseInt(event.params.id);

  try {
    const scout = await prisma.scout.findUnique({
      where: { id },
    });

    if (!scout) {
      return json({ error: "Scout not found" }, { status: 404 });
    }

    return json({
      ...scout,
      createdAt: scout.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("Error fetching scout:", error);
    return json({ error: "Failed to fetch scout" }, { status: 500 });
  }
};

// PUT /finances/api/scouts/[id]
export const PUT: RequestHandler = async (event) => {
  validateSession(event);

  const id = parseInt(event.params.id);

  try {
    const body = await event.request.json();
    const validated = scoutSchema.partial().parse(body);

    const scout = await prisma.scout.update({
      where: { id },
      data: validated,
    });

    return json({
      ...scout,
      createdAt: scout.createdAt.toISOString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return json(
        { error: "Validation failed", details: error.issues },
        { status: 400 },
      );
    }
    console.error("Error updating scout:", error);
    return json({ error: "Failed to update scout" }, { status: 500 });
  }
};

// DELETE /finances/api/scouts/[id]
export const DELETE: RequestHandler = async (event) => {
  validateSession(event);

  const id = parseInt(event.params.id);

  try {
    await prisma.scout.delete({
      where: { id },
    });

    return json({ success: true });
  } catch (error) {
    console.error("Error deleting scout:", error);
    return json({ error: "Failed to delete scout" }, { status: 500 });
  }
};
