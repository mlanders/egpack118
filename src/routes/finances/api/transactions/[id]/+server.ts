import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { prisma } from "$lib/server/prisma";
import { validateSession } from "$lib/server/auth";

// DELETE /finances/api/transactions/[id]
export const DELETE: RequestHandler = async (event) => {
  validateSession(event);

  const id = parseInt(event.params.id);

  try {
    // Get the transaction first to check if it's a pack dues payment
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      return json({ error: "Transaction not found" }, { status: 404 });
    }

    // If this is a pack dues transaction, also delete the corresponding PackDuesPayment
    if (
      transaction.type === "Withdrawal" &&
      transaction.description === "Pack Dues"
    ) {
      // Find and delete matching pack dues payment(s)
      // Match by scout name, date, amount, and fiscal year
      await prisma.packDuesPayment.deleteMany({
        where: {
          scoutName: transaction.scoutName,
          date: transaction.date,
          amount: transaction.amount,
          fiscalYear: transaction.fiscalYear,
          paymentMethod: "ScoutAccount",
        },
      });
    }

    // If this transaction is linked to a pack transaction (fundraising split), delete both
    if (transaction.linkedPackTxId) {
      await prisma.$transaction(async (tx) => {
        // Delete the linked pack transaction
        await tx.packTransaction.delete({
          where: { id: transaction.linkedPackTxId! },
        });

        // Delete this transaction
        await tx.transaction.delete({
          where: { id },
        });
      });
    } else {
      // Delete the transaction normally
      await prisma.transaction.delete({
        where: { id },
      });
    }

    return json({ success: true });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return json({ error: "Failed to delete transaction" }, { status: 500 });
  }
};
