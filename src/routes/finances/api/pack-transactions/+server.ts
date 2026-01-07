import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { prisma } from "$lib/server/prisma";
import { validateSession } from "$lib/server/auth";
import { packTransactionSchema } from "$lib/server/validation";
import { z } from "zod";

// GET /finances/api/pack-transactions?fiscalYear=2024-2025
export const GET: RequestHandler = async (event) => {
  validateSession(event);

  const fiscalYear = event.url.searchParams.get("fiscalYear");

  const where: any = {};
  if (fiscalYear) {
    where.fiscalYear = fiscalYear;
  }

  try {
    const packTransactions = await prisma.packTransaction.findMany({
      where,
      orderBy: { date: "desc" },
    });

    const packTransactionsResponse = packTransactions.map((t) => ({
      ...t,
      date: t.date.toISOString().split("T")[0],
      createdAt: t.createdAt.toISOString(),
    }));

    return json(packTransactionsResponse);
  } catch (error) {
    console.error("Error fetching pack transactions:", error);
    return json(
      { error: "Failed to fetch pack transactions" },
      { status: 500 },
    );
  }
};

// POST /finances/api/pack-transactions
export const POST: RequestHandler = async (event) => {
  validateSession(event);

  try {
    const body = await event.request.json();
    const validated = packTransactionSchema.parse(body);

    const packTransaction = await prisma.packTransaction.create({
      data: {
        ...validated,
        date: new Date(validated.date),
      },
    });

    return json(
      {
        ...packTransaction,
        date: packTransaction.date.toISOString().split("T")[0],
        createdAt: packTransaction.createdAt.toISOString(),
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
    console.error("Error creating pack transaction:", error);
    return json(
      { error: "Failed to create pack transaction" },
      { status: 500 },
    );
  }
};
