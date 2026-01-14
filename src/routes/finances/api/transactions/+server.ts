import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { prisma } from "$lib/server/prisma";
import { requireAuth, requireWriteAccess } from "$lib/server/authorization";
import { transactionSchema } from "$lib/server/validation";
import { z } from "zod";

// Helper functions for enum mapping
function mapFrontendToEnum(type: string): string {
  const mapping: Record<string, string> = {
    Deposit: "Deposit",
    Withdrawal: "Withdrawal",
    "Pack Dues Paid": "PackDuesPaid",
    Reimbursement: "Reimbursement",
    "Transfer to Pack": "TransferToPack",
  };
  return mapping[type] || type;
}

function mapEnumToFrontend(type: string): string {
  const mapping: Record<string, string> = {
    Deposit: "Deposit",
    Withdrawal: "Withdrawal",
    PackDuesPaid: "Pack Dues Paid",
    Reimbursement: "Reimbursement",
    TransferToPack: "Transfer to Pack",
  };
  return mapping[type] || type;
}

// GET /finances/api/transactions?fiscalYear=2024-2025
export const GET: RequestHandler = async (event) => {
  requireAuth(event);

  const fiscalYear = event.url.searchParams.get("fiscalYear");

  const where: any = {};
  if (fiscalYear) {
    where.fiscalYear = fiscalYear;
  }

  try {
    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { date: "desc" },
    });

    const transactionsResponse = transactions.map((t) => ({
      ...t,
      date: t.date.toISOString().split("T")[0], // Date only
      createdAt: t.createdAt.toISOString(),
      type: mapEnumToFrontend(t.type),
    }));

    return json(transactionsResponse);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
};

// POST /finances/api/transactions
export const POST: RequestHandler = async (event) => {
  requireWriteAccess(event);

  try {
    const body = await event.request.json();
    const validated = transactionSchema.parse(body);

    // Convert type to enum format
    const typeEnum = mapFrontendToEnum(validated.type);

    // Check if this is a fundraising transaction (Deposit or Reimbursement)
    // If so, we need to split it: 75% to scout, 25% to pack
    const isFundraising =
      validated.type === "Deposit" || validated.type === "Reimbursement";

    if (isFundraising) {
      // Use a transaction to create both records atomically
      const result = await prisma.$transaction(async (tx) => {
        const scoutAmount = validated.amount * 0.75;
        const packAmount = validated.amount * 0.25;

        // Create the scout transaction (75%)
        const scoutTx = await tx.transaction.create({
          data: {
            ...validated,
            date: new Date(validated.date),
            type: typeEnum as any,
            amount: scoutAmount,
            notes: validated.notes || `Fundraising (75% to scout, 25% to pack)`,
          },
        });

        // Create the linked pack transaction (25%)
        const packTx = await tx.packTransaction.create({
          data: {
            date: new Date(validated.date),
            description: `25% of ${validated.scoutName} ${validated.description}`,
            type: "Income",
            amount: packAmount,
            category: "Fundraising Share",
            notes: `Linked to scout transaction #${scoutTx.id}`,
            fiscalYear: validated.fiscalYear,
            linkedScoutTxId: scoutTx.id,
          },
        });

        // Update scout transaction with link to pack transaction
        const updatedScoutTx = await tx.transaction.update({
          where: { id: scoutTx.id },
          data: { linkedPackTxId: packTx.id },
        });

        return updatedScoutTx;
      });

      return json(
        {
          ...result,
          date: result.date.toISOString().split("T")[0],
          createdAt: result.createdAt.toISOString(),
          type: mapEnumToFrontend(result.type),
        },
        { status: 201 },
      );
    } else {
      // Non-fundraising transaction - create normally
      const transaction = await prisma.transaction.create({
        data: {
          ...validated,
          date: new Date(validated.date),
          type: typeEnum as any,
        },
      });

      return json(
        {
          ...transaction,
          date: transaction.date.toISOString().split("T")[0],
          createdAt: transaction.createdAt.toISOString(),
          type: mapEnumToFrontend(transaction.type),
        },
        { status: 201 },
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return json(
        { error: "Validation failed", details: error.issues },
        { status: 400 },
      );
    }
    console.error("Error creating transaction:", error);
    return json({ error: "Failed to create transaction" }, { status: 500 });
  }
};
