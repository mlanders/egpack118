<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import type { Scout, Transaction, DuesSummary } from "$lib/types/finances";
    import * as api from "$lib/services/financeApi";
    import PackDuesSection from "./components/PackDuesSection.svelte";
    import RecordDuesPaymentModal from "./components/RecordDuesPaymentModal.svelte";

    let scoutId = $state(parseInt($page.params.id));
    let scout = $state<Scout | null>(null);
    let duesSummary = $state<DuesSummary | null>(null);
    let transactions = $state<Transaction[]>([]);
    let loading = $state(true);
    let error = $state<string | null>(null);
    let showPaymentModal = $state(false);

    async function loadData() {
        try {
            loading = true;
            error = null;

            // Load scout data, dues summary, and transactions in parallel
            const [scoutData, duesData, transactionsData] = await Promise.all([
                api.getScout(scoutId),
                api.getScoutDuesSummary(scoutId),
                api.getTransactions(),
            ]);

            scout = scoutData;
            duesSummary = duesData;
            // Filter transactions for this scout
            transactions = transactionsData.filter(
                (t) => t.scoutName === scoutData.name,
            );
        } catch (err: any) {
            error = err.message || "Failed to load scout data";
            console.error("Error loading scout data:", err);
        } finally {
            loading = false;
        }
    }

    async function handlePaymentSuccess() {
        showPaymentModal = false;
        await loadData();
    }

    function calculateBalance(): number {
        if (!scout || !transactions) return 0;

        const deposits = transactions
            .filter((t) => t.type === "Deposit" || t.type === "Reimbursement")
            .reduce((sum, t) => sum + t.amount, 0);

        const withdrawals = transactions
            .filter(
                (t) => t.type === "Withdrawal" || t.type === "Transfer to Pack",
            )
            .reduce((sum, t) => sum + t.amount, 0);

        return scout.beginningBalance + deposits - withdrawals;
    }

    onMount(() => {
        loadData();
    });
</script>

<svelte:head>
    <title>{scout?.name || "Scout Profile"} - Scout Finances</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 py-6">
        <!-- Back Navigation -->
        <div class="mb-6">
            <a
                href="/finances"
                class="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
            >
                <span>←</span> Back to Finances
            </a>
        </div>

        {#if loading}
            <div class="flex items-center justify-center py-12">
                <div class="text-gray-600">Loading scout data...</div>
            </div>
        {:else if error}
            <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                <p class="text-red-800">{error}</p>
            </div>
        {:else if scout && duesSummary}
            <!-- Header -->
            <div
                class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
            >
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900">
                            {scout.name}
                        </h1>
                        <p class="text-sm text-gray-600 mt-1">
                            Fiscal Year: {scout.fiscalYear}
                        </p>
                    </div>
                    <div>
                        {#if scout.active}
                            <span
                                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                            >
                                Active
                            </span>
                        {:else}
                            <span
                                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                            >
                                Inactive
                            </span>
                        {/if}
                    </div>
                </div>
                {#if scout.notes}
                    <p class="text-sm text-gray-700 mt-3">{scout.notes}</p>
                {/if}
            </div>

            <!-- Overview Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div
                    class="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
                >
                    <div class="text-sm font-medium text-gray-600">
                        Current Balance
                    </div>
                    <div
                        class="text-2xl font-bold mt-1 {calculateBalance() >= 0
                            ? 'text-green-600'
                            : 'text-red-600'}"
                    >
                        ${calculateBalance().toFixed(2)}
                    </div>
                </div>

                <div
                    class="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
                >
                    <div class="text-sm font-medium text-gray-600">
                        Beginning Balance
                    </div>
                    <div class="text-2xl font-bold text-gray-900 mt-1">
                        ${scout.beginningBalance.toFixed(2)}
                    </div>
                </div>

                <div
                    class="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
                >
                    <div class="text-sm font-medium text-gray-600">
                        Total Deposits
                    </div>
                    <div class="text-2xl font-bold text-green-600 mt-1">
                        ${transactions
                            .filter(
                                (t) =>
                                    t.type === "Deposit" ||
                                    t.type === "Reimbursement",
                            )
                            .reduce((sum, t) => sum + t.amount, 0)
                            .toFixed(2)}
                    </div>
                </div>

                <div
                    class="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
                >
                    <div class="text-sm font-medium text-gray-600">
                        Total Withdrawals
                    </div>
                    <div class="text-2xl font-bold text-red-600 mt-1">
                        ${transactions
                            .filter(
                                (t) =>
                                    t.type === "Withdrawal" ||
                                    t.type === "Transfer to Pack",
                            )
                            .reduce((sum, t) => sum + t.amount, 0)
                            .toFixed(2)}
                    </div>
                </div>
            </div>

            <!-- Pack Dues Section -->
            <PackDuesSection
                {duesSummary}
                {scout}
                onRecordPayment={() => (showPaymentModal = true)}
                onRefresh={loadData}
            />

            <!-- Transaction History -->
            <div
                class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6"
            >
                <h2 class="text-lg font-semibold text-gray-900 mb-4">
                    Transaction History
                </h2>

                {#if transactions.length === 0}
                    <p class="text-gray-500 text-center py-8">
                        No transactions yet
                    </p>
                {:else}
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th
                                        class="px-4 py-2 text-left text-xs font-medium text-white uppercase"
                                        >Date</th
                                    >
                                    <th
                                        class="px-4 py-2 text-left text-xs font-medium text-white uppercase"
                                        >Description</th
                                    >
                                    <th
                                        class="px-4 py-2 text-left text-xs font-medium text-white uppercase"
                                        >Type</th
                                    >
                                    <th
                                        class="px-4 py-2 text-right text-xs font-medium text-white uppercase"
                                        >Amount</th
                                    >
                                    <th
                                        class="px-4 py-2 text-left text-xs font-medium text-white uppercase"
                                        >Notes</th
                                    >
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                {#each transactions as transaction}
                                    <tr class="hover:bg-gray-50">
                                        <td
                                            class="px-4 py-3 whitespace-nowrap text-sm text-gray-900"
                                        >
                                            {new Date(
                                                transaction.date,
                                            ).toLocaleDateString()}
                                        </td>
                                        <td
                                            class="px-4 py-3 text-sm text-gray-900"
                                            >{transaction.description}</td
                                        >
                                        <td
                                            class="px-4 py-3 whitespace-nowrap text-sm"
                                        >
                                            <span
                                                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
												{transaction.type === 'Deposit' || transaction.type === 'Reimbursement'
                                                    ? 'bg-green-100 text-green-800'
                                                    : transaction.type ===
                                                            'Withdrawal' ||
                                                        transaction.type ===
                                                            'Transfer to Pack'
                                                      ? 'bg-red-100 text-red-800'
                                                      : 'bg-blue-100 text-blue-800'}"
                                            >
                                                {transaction.type}
                                            </span>
                                        </td>
                                        <td
                                            class="px-4 py-3 whitespace-nowrap text-sm font-medium text-right
											{transaction.type === 'Deposit' || transaction.type === 'Reimbursement'
                                                ? 'text-green-600'
                                                : 'text-red-600'}"
                                        >
                                            ${transaction.amount.toFixed(2)}
                                        </td>
                                        <td
                                            class="px-4 py-3 text-sm text-gray-600"
                                            >{transaction.notes || "-"}</td
                                        >
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                {/if}
            </div>
        {/if}
    </div>
</div>

<!-- Payment Modal -->
{#if scout && duesSummary}
    <RecordDuesPaymentModal
        show={showPaymentModal}
        {scout}
        {duesSummary}
        currentBalance={calculateBalance()}
        onClose={() => (showPaymentModal = false)}
        onSuccess={handlePaymentSuccess}
    />
{/if}
