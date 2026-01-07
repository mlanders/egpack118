-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('Deposit', 'Withdrawal', 'Pack Dues Paid', 'Reimbursement', 'Transfer to Pack');

-- CreateEnum
CREATE TYPE "PackTransactionType" AS ENUM ('Income', 'Expense');

-- CreateTable
CREATE TABLE "scouts" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "beginning_balance" DOUBLE PRECISION NOT NULL,
    "notes" TEXT NOT NULL DEFAULT '',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fiscal_year" TEXT NOT NULL,

    CONSTRAINT "scouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "scout_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "notes" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fiscal_year" TEXT NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pack_transactions" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "type" "PackTransactionType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL DEFAULT '',
    "notes" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fiscal_year" TEXT NOT NULL,

    CONSTRAINT "pack_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "scouts_fiscal_year_idx" ON "scouts"("fiscal_year");

-- CreateIndex
CREATE INDEX "scouts_active_idx" ON "scouts"("active");

-- CreateIndex
CREATE INDEX "transactions_scout_name_idx" ON "transactions"("scout_name");

-- CreateIndex
CREATE INDEX "transactions_fiscal_year_idx" ON "transactions"("fiscal_year");

-- CreateIndex
CREATE INDEX "transactions_type_idx" ON "transactions"("type");

-- CreateIndex
CREATE INDEX "pack_transactions_fiscal_year_idx" ON "pack_transactions"("fiscal_year");

-- CreateIndex
CREATE INDEX "pack_transactions_type_idx" ON "pack_transactions"("type");
