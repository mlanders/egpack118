import type {
  Scout,
  Transaction,
  PackTransaction,
  ScoutInput,
  TransactionInput,
  PackTransactionInput,
  FiscalYearConfig,
  FiscalYearConfigInput,
  PackDuesPayment,
  PackDuesPaymentInput,
  DuesSummary,
} from "$lib/types/finances";

const BASE_URL = "/finances/api";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  return response.json();
}

// Scouts
export async function getScouts(
  fiscalYear?: string,
  active?: boolean,
): Promise<Scout[]> {
  const params = new URLSearchParams();
  if (fiscalYear) params.set("fiscalYear", fiscalYear);
  if (active !== undefined) params.set("active", String(active));

  const response = await fetch(`${BASE_URL}/scouts?${params}`);
  return handleResponse<Scout[]>(response);
}

export async function createScout(scout: ScoutInput): Promise<Scout> {
  const response = await fetch(`${BASE_URL}/scouts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(scout),
  });
  return handleResponse<Scout>(response);
}

export async function updateScout(
  id: number,
  scout: Partial<ScoutInput>,
): Promise<Scout> {
  const response = await fetch(`${BASE_URL}/scouts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(scout),
  });
  return handleResponse<Scout>(response);
}

export async function deleteScout(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/scouts/${id}`, {
    method: "DELETE",
  });
  await handleResponse(response);
}

// Transactions
export async function getTransactions(
  fiscalYear?: string,
): Promise<Transaction[]> {
  const params = new URLSearchParams();
  if (fiscalYear) params.set("fiscalYear", fiscalYear);

  const response = await fetch(`${BASE_URL}/transactions?${params}`);
  return handleResponse<Transaction[]>(response);
}

export async function createTransaction(
  transaction: TransactionInput,
): Promise<Transaction> {
  const response = await fetch(`${BASE_URL}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transaction),
  });
  return handleResponse<Transaction>(response);
}

export async function deleteTransaction(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/transactions/${id}`, {
    method: "DELETE",
  });
  await handleResponse(response);
}

// Pack Transactions
export async function getPackTransactions(
  fiscalYear?: string,
): Promise<PackTransaction[]> {
  const params = new URLSearchParams();
  if (fiscalYear) params.set("fiscalYear", fiscalYear);

  const response = await fetch(`${BASE_URL}/pack-transactions?${params}`);
  return handleResponse<PackTransaction[]>(response);
}

export async function createPackTransaction(
  transaction: PackTransactionInput,
): Promise<PackTransaction> {
  const response = await fetch(`${BASE_URL}/pack-transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transaction),
  });
  return handleResponse<PackTransaction>(response);
}

export async function deletePackTransaction(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/pack-transactions/${id}`, {
    method: "DELETE",
  });
  await handleResponse(response);
}

// Fiscal Year Config
export async function getFiscalYearConfig(
  fiscalYear: string,
): Promise<FiscalYearConfig> {
  const response = await fetch(
    `${BASE_URL}/fiscal-year-config?fiscalYear=${fiscalYear}`,
  );
  return handleResponse<FiscalYearConfig>(response);
}

export async function createOrUpdateFiscalYearConfig(
  config: FiscalYearConfigInput,
): Promise<FiscalYearConfig> {
  const response = await fetch(`${BASE_URL}/fiscal-year-config`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });
  return handleResponse<FiscalYearConfig>(response);
}

// Pack Dues Payments
export async function getPackDuesPayments(
  fiscalYear?: string,
  scoutId?: number,
  scoutName?: string,
): Promise<PackDuesPayment[]> {
  const params = new URLSearchParams();
  if (fiscalYear) params.set("fiscalYear", fiscalYear);
  if (scoutId) params.set("scoutId", String(scoutId));
  if (scoutName) params.set("scoutName", scoutName);

  const response = await fetch(`${BASE_URL}/pack-dues-payments?${params}`);
  return handleResponse<PackDuesPayment[]>(response);
}

export async function createPackDuesPayment(
  payment: PackDuesPaymentInput,
): Promise<PackDuesPayment> {
  const response = await fetch(`${BASE_URL}/pack-dues-payments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payment),
  });
  return handleResponse<PackDuesPayment>(response);
}

export async function deletePackDuesPayment(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/pack-dues-payments/${id}`, {
    method: "DELETE",
  });
  await handleResponse(response);
}

// Scout Dues Summary
export async function getScoutDuesSummary(
  scoutId: number,
): Promise<DuesSummary> {
  const response = await fetch(`${BASE_URL}/scouts/${scoutId}/dues-summary`);
  return handleResponse<DuesSummary>(response);
}

// Individual Scout
export async function getScout(id: number): Promise<Scout> {
  const response = await fetch(`${BASE_URL}/scouts/${id}`);
  return handleResponse<Scout>(response);
}
