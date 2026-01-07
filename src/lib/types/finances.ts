// API response types (matching frontend interfaces)
export interface Scout {
	id: number;
	name: string;
	beginningBalance: number;
	notes: string;
	active: boolean;
	createdAt: string; // ISO string
	fiscalYear: string;
}

export interface Transaction {
	id: number;
	date: string; // ISO string
	scoutName: string;
	description: string;
	type: 'Deposit' | 'Withdrawal' | 'Pack Dues Paid' | 'Reimbursement' | 'Transfer to Pack';
	amount: number;
	notes: string;
	createdAt: string; // ISO string
	fiscalYear: string;
}

export interface PackTransaction {
	id: number;
	date: string; // ISO string
	description: string;
	type: 'Income' | 'Expense';
	amount: number;
	category: string;
	notes: string;
	createdAt: string; // ISO string
	fiscalYear: string;
}

// Input types for creating (without id, createdAt)
export type ScoutInput = Omit<Scout, 'id' | 'createdAt'>;
export type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>;
export type PackTransactionInput = Omit<PackTransaction, 'id' | 'createdAt'>;

// Update types (partial)
export type ScoutUpdate = Partial<ScoutInput>;
