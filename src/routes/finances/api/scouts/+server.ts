import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { prisma } from "$lib/server/prisma";
import { requireAuth, requireWriteAccess } from "$lib/server/authorization";
import { scoutSchema } from "$lib/server/validation";
import { z } from "zod";

// GET /finances/api/scouts?fiscalYear=2024-2025&active=true
export const GET: RequestHandler = async (event) => {
  requireAuth(event);

  const fiscalYear = event.url.searchParams.get("fiscalYear");
  const activeParam = event.url.searchParams.get("active");

  const where: any = {};

  if (fiscalYear) {
    where.fiscalYear = fiscalYear;
  }

  if (activeParam !== null) {
    where.active = activeParam === "true";
  }

  try {
    const scouts = await prisma.scout.findMany({
      where,
      orderBy: { name: "asc" },
    });

    // Convert DateTime to ISO strings
    const scoutsResponse = scouts.map((scout) => ({
      ...scout,
      createdAt: scout.createdAt.toISOString(),
    }));

    return json(scoutsResponse);
  } catch (error) {
    console.error("Error fetching scouts:", error);
    return json({ error: "Failed to fetch scouts" }, { status: 500 });
  }
};

// POST /finances/api/scouts
export const POST: RequestHandler = async (event) => {
  requireWriteAccess(event);

  try {
    const body = await event.request.json();
    const validated = scoutSchema.parse(body);

    const scout = await prisma.scout.create({
      data: validated,
    });

    return json(
      {
        ...scout,
        createdAt: scout.createdAt.toISOString(),
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return json(
        { error: "Validation failed", details: error.issues },
        { status: 400 },
      );
    }
    console.error("Error creating scout:", error);
    return json({ error: "Failed to create scout" }, { status: 500 });
  }
};
