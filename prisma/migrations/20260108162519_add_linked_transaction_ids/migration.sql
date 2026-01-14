-- AlterTable
ALTER TABLE "pack_transactions" ADD COLUMN     "linked_scout_tx_id" INTEGER;

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "linked_pack_tx_id" INTEGER;

-- CreateIndex
CREATE INDEX "pack_transactions_linked_scout_tx_id_idx" ON "pack_transactions"("linked_scout_tx_id");

-- CreateIndex
CREATE INDEX "transactions_linked_pack_tx_id_idx" ON "transactions"("linked_pack_tx_id");
