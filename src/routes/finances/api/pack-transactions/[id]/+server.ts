import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { prisma } from "$lib/server/prisma";
import { requireAuth, requireWriteAccess } from "$lib/server/authorization";

// DELETE /finances/api/pack-transactions/[id]
export const DELETE: RequestHandler = async (event) => {
  requireWriteAccess(event);

  const id = parseInt(event.params.id);

  try {
    // Get the pack transaction first to check if it's linked to a scout transaction
    const packTransaction = await prisma.packTransaction.findUnique({
      where: { id },
    });

    if (!packTransaction) {
      return json({ error: "Pack transaction not found" }, { status: 404 });
    }

    // If this pack transaction is linked to a scout transaction (fundraising split), delete both
    if (packTransaction.linkedScoutTxId) {
      await prisma.$transaction(async (tx) => {
        // Delete the linked scout transaction
        await tx.transaction.delete({
          where: { id: packTransaction.linkedScoutTxId! },
        });

        // Delete this pack transaction
        await tx.packTransaction.delete({
          where: { id },
        });
      });
    } else {
      // Delete the pack transaction normally
      await prisma.packTransaction.delete({
        where: { id },
      });
    }

    return json({ success: true });
  } catch (error) {
    console.error("Error deleting pack transaction:", error);
    return json(
      { error: "Failed to delete pack transaction" },
      { status: 500 },
    );
  }
};
