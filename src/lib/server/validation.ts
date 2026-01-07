import { z } from 'zod';

export const scoutSchema = z.object({
	name: z.string().min(1, 'Name is required').max(100),
	beginningBalance: z.number(),
	notes: z.string().max(500).default(''),
	active: z.boolean().default(true),
	fiscalYear: z.string().regex(/^\d{4}-\d{4}$/, 'Invalid fiscal year format')
});

export const transactionSchema = z.object({
	date: z.string().datetime(), // ISO datetime string
	scoutName: z.string().min(1, 'Scout name is required'),
	description: z.string().min(1, 'Description is required').max(200),
	type: z.enum(['Deposit', 'Withdrawal', 'Pack Dues Paid', 'Reimbursement', 'Transfer to Pack']),
	amount: z.number().positive('Amount must be positive'),
	notes: z.string().max(500).default(''),
	fiscalYear: z.string().regex(/^\d{4}-\d{4}$/)
});

export const packTransactionSchema = z.object({
	date: z.string().datetime(),
	description: z.string().min(1, 'Description is required').max(200),
	type: z.enum(['Income', 'Expense']),
	amount: z.number().positive('Amount must be positive'),
	category: z.string().max(100).default(''),
	notes: z.string().max(500).default(''),
	fiscalYear: z.string().regex(/^\d{4}-\d{4}$/)
});
