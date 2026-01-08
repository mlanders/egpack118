-- CreateEnum
CREATE TYPE "PackDuesPaymentMethod" AS ENUM ('Cash', 'Check', 'Scout Account');

-- AlterTable
ALTER TABLE "scouts" ADD COLUMN     "dues_override_reason" TEXT;

-- CreateTable
CREATE TABLE "fiscal_year_configs" (
    "id" SERIAL NOT NULL,
    "fiscal_year" TEXT NOT NULL,
    "pack_dues_amount" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fiscal_year_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pack_dues_payments" (
    "id" SERIAL NOT NULL,
    "scout_id" INTEGER NOT NULL,
    "scout_name" TEXT NOT NULL,
    "fiscal_year" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "payment_method" "PackDuesPaymentMethod" NOT NULL,
    "check_number" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT NOT NULL DEFAULT '',
    "is_override" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pack_dues_payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fiscal_year_configs_fiscal_year_key" ON "fiscal_year_configs"("fiscal_year");

-- CreateIndex
CREATE INDEX "fiscal_year_configs_fiscal_year_idx" ON "fiscal_year_configs"("fiscal_year");

-- CreateIndex
CREATE INDEX "pack_dues_payments_scout_id_idx" ON "pack_dues_payments"("scout_id");

-- CreateIndex
CREATE INDEX "pack_dues_payments_scout_name_idx" ON "pack_dues_payments"("scout_name");

-- CreateIndex
CREATE INDEX "pack_dues_payments_fiscal_year_idx" ON "pack_dues_payments"("fiscal_year");
