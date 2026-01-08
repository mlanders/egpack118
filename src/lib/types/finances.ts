// API response types (matching frontend interfaces)
export interface Scout {
  id: number;
  name: string;
  beginningBalance: number;
  notes: string;
  active: boolean;
  createdAt: string; // ISO string
  fiscalYear: string;
  duesOverrideReason: string | null;
}

export interface Transaction {
  id: number;
  date: string; // ISO string
  scoutName: string;
  description: string;
  type:
    | "Deposit"
    | "Withdrawal"
    | "Pack Dues Paid"
    | "Reimbursement"
    | "Transfer to Pack";
  amount: number;
  notes: string;
  createdAt: string; // ISO string
  fiscalYear: string;
}

export interface PackTransaction {
  id: number;
  date: string; // ISO string
  description: string;
  type: "Income" | "Expense";
  amount: number;
  category: string;
  notes: string;
  createdAt: string; // ISO string
  fiscalYear: string;
}

// Input types for creating (without id, createdAt)
export type ScoutInput = Omit<Scout, "id" | "createdAt">;
export type TransactionInput = Omit<Transaction, "id" | "createdAt">;
export type PackTransactionInput = Omit<PackTransaction, "id" | "createdAt">;

// Update types (partial)
export type ScoutUpdate = Partial<ScoutInput>;

// Pack dues types
export interface FiscalYearConfig {
  id: number;
  fiscalYear: string;
  packDuesAmount: number;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface PackDuesPayment {
  id: number;
  scoutId: number;
  scoutName: string;
  fiscalYear: string;
  amount: number;
  paymentMethod: "Cash" | "Check" | "Scout Account";
  checkNumber: string | null;
  date: string; // ISO string
  notes: string;
  isOverride: boolean;
  createdAt: string; // ISO string
}

export interface DuesSummary {
  scoutId: number;
  scoutName: string;
  fiscalYear: string;
  packDuesAmount: number;
  totalPaid: number;
  remaining: number;
  payments: PackDuesPayment[];
  duesOverrideReason: string | null;
}

// Input types for pack dues
export type FiscalYearConfigInput = Omit<
  FiscalYearConfig,
  "id" | "createdAt" | "updatedAt"
>;
export type PackDuesPaymentInput = Omit<PackDuesPayment, "id" | "createdAt">;
