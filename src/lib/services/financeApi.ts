import type {
	Scout,
	Transaction,
	PackTransaction,
	ScoutInput,
	TransactionInput,
	PackTransactionInput
} from '$lib/types/finances';

const BASE_URL = '/finances/api';

async function handleResponse<T>(response: Response): Promise<T> {
	if (!response.ok) {
		const error = await response.json().catch(() => ({ error: 'Unknown error' }));
		throw new Error(error.error || `HTTP ${response.status}`);
	}
	return response.json();
}

// Scouts
export async function getScouts(fiscalYear?: string, active?: boolean): Promise<Scout[]> {
	const params = new URLSearchParams();
	if (fiscalYear) params.set('fiscalYear', fiscalYear);
	if (active !== undefined) params.set('active', String(active));

	const response = await fetch(`${BASE_URL}/scouts?${params}`);
	return handleResponse<Scout[]>(response);
}

export async function createScout(scout: ScoutInput): Promise<Scout> {
	const response = await fetch(`${BASE_URL}/scouts`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(scout)
	});
	return handleResponse<Scout>(response);
}

export async function updateScout(id: number, scout: Partial<ScoutInput>): Promise<Scout> {
	const response = await fetch(`${BASE_URL}/scouts/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(scout)
	});
	return handleResponse<Scout>(response);
}

export async function deleteScout(id: number): Promise<void> {
	const response = await fetch(`${BASE_URL}/scouts/${id}`, {
		method: 'DELETE'
	});
	await handleResponse(response);
}

// Transactions
export async function getTransactions(fiscalYear?: string): Promise<Transaction[]> {
	const params = new URLSearchParams();
	if (fiscalYear) params.set('fiscalYear', fiscalYear);

	const response = await fetch(`${BASE_URL}/transactions?${params}`);
	return handleResponse<Transaction[]>(response);
}

export async function createTransaction(transaction: TransactionInput): Promise<Transaction> {
	const response = await fetch(`${BASE_URL}/transactions`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(transaction)
	});
	return handleResponse<Transaction>(response);
}

export async function deleteTransaction(id: number): Promise<void> {
	const response = await fetch(`${BASE_URL}/transactions/${id}`, {
		method: 'DELETE'
	});
	await handleResponse(response);
}

// Pack Transactions
export async function getPackTransactions(fiscalYear?: string): Promise<PackTransaction[]> {
	const params = new URLSearchParams();
	if (fiscalYear) params.set('fiscalYear', fiscalYear);

	const response = await fetch(`${BASE_URL}/pack-transactions?${params}`);
	return handleResponse<PackTransaction[]>(response);
}

export async function createPackTransaction(
	transaction: PackTransactionInput
): Promise<PackTransaction> {
	const response = await fetch(`${BASE_URL}/pack-transactions`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(transaction)
	});
	return handleResponse<PackTransaction>(response);
}

export async function deletePackTransaction(id: number): Promise<void> {
	const response = await fetch(`${BASE_URL}/pack-transactions/${id}`, {
		method: 'DELETE'
	});
	await handleResponse(response);
}
