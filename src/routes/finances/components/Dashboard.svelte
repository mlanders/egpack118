<script lang="ts">
    import type {
        Scout,
        Transaction,
        PackTransaction,
    } from "$lib/types/finances";

    interface Props {
        scouts: Scout[];
        transactions: Transaction[];
        packTransactions: PackTransaction[];
        packFinances: () => any;
        accountHealth: () => string;
        filteredScouts: () => Scout[];
        filteredTransactions: () => Transaction[];
        filteredPackTransactions: () => PackTransaction[];
        recentActivity: () => any[];
        getTypeBadgeClass: (type: string) => string;
        canWrite: boolean;
        onAddScout: () => void;
        onAddTransaction: () => void;
        onAddPackTransaction: () => void;
        onNewFiscalYear: () => void;
    }

    let {
        scouts,
        transactions,
        packTransactions,
        packFinances,
        accountHealth,
        filteredScouts,
        filteredTransactions,
        filteredPackTransactions,
        recentActivity,
        getTypeBadgeClass,
        canWrite,
        onAddScout,
        onAddTransaction,
        onAddPackTransaction,
        onNewFiscalYear,
    }: Props = $props();

    const healthColors = {
        healthy: "text-green-600 bg-green-100",
        warning: "text-yellow-600 bg-yellow-100",
        critical: "text-red-600 bg-red-100",
    };

    const healthLabels = {
        healthy: "Healthy",
        warning: "Warning",
        critical: "Critical",
    };
</script>

<div class="space-y-4">
    <!-- Compact Key Metrics Grid -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div
            class="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-3"
        >
            <p class="text-xs font-medium text-blue-700 mb-1">Cash on Hand</p>
            <p class="text-xl font-bold text-blue-900">
                ${packFinances().packCashOnHand.toFixed(2)}
            </p>
        </div>

        <div class="bg-white border border-gray-200 rounded-lg p-3">
            <p class="text-xs font-medium text-gray-600 mb-1">Earmarked</p>
            <p class="text-xl font-bold text-gray-900">
                ${packFinances().totalEarmarked.toFixed(2)}
            </p>
        </div>

        <div class="bg-white border border-gray-200 rounded-lg p-3">
            <p class="text-xs font-medium text-gray-600 mb-1">Unallocated</p>
            <p
                class="text-xl font-bold {packFinances().unallocatedFunds < 0
                    ? 'text-red-600'
                    : 'text-green-600'}"
            >
                ${packFinances().unallocatedFunds.toFixed(2)}
            </p>
        </div>

        <div class="bg-white border border-gray-200 rounded-lg p-3">
            <p class="text-xs font-medium text-gray-600 mb-1">Revenue</p>
            <p class="text-xl font-bold text-green-600">
                ${packFinances().totalRevenue.toFixed(2)}
            </p>
        </div>

        <div class="bg-white border border-gray-200 rounded-lg p-3">
            <p class="text-xs font-medium text-gray-600 mb-1">Expenses</p>
            <p class="text-xl font-bold text-red-600">
                ${packFinances().expenses.toFixed(2)}
            </p>
        </div>

        <div class="bg-white border border-gray-200 rounded-lg p-3">
            <p class="text-xs font-medium text-gray-600 mb-1">Status</p>
            <span
                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium {healthColors[
                    accountHealth()
                ]}"
            >
                {healthLabels[accountHealth()]}
            </span>
        </div>
    </div>

    <!-- Compact Stats Row -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div class="bg-white border border-gray-200 rounded-lg px-3 py-2">
            <div class="flex items-center justify-between">
                <span class="text-xs text-gray-600">Active Scouts</span>
                <span class="text-lg font-semibold text-gray-900"
                    >{filteredScouts().filter((s) => s.active).length}</span
                >
            </div>
        </div>
        <div class="bg-white border border-gray-200 rounded-lg px-3 py-2">
            <div class="flex items-center justify-between">
                <span class="text-xs text-gray-600">Transactions</span>
                <span class="text-lg font-semibold text-gray-900"
                    >{filteredTransactions().length +
                        filteredPackTransactions().length}</span
                >
            </div>
        </div>
        <div
            class="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg px-3 py-2"
        >
            <div class="flex flex-col">
                <span class="text-xs text-green-700 mb-1"
                    >Pack Dues Collected</span
                >
                <span class="text-lg font-semibold text-green-900"
                    >${packFinances().totalDues.toFixed(2)}</span
                >
            </div>
        </div>
        <div class="bg-white border border-gray-200 rounded-lg px-3 py-2">
            <div class="flex items-center justify-between">
                <span class="text-xs text-gray-600">Dues Paid</span>
                <span class="text-lg font-semibold text-gray-900">
                    {transactions.filter(
                        (t) =>
                            t.type === "Pack Dues Paid" ||
                            (t.type === "Withdrawal" &&
                                t.description === "Pack Dues"),
                    ).length}
                </span>
            </div>
        </div>
        <div class="bg-white border border-gray-200 rounded-lg px-3 py-2">
            <div class="flex items-center justify-between">
                <span class="text-xs text-gray-600">Fundraising</span>
                <span class="text-lg font-semibold text-gray-900"
                    >${packFinances().fundraisingShare.toFixed(2)}</span
                >
            </div>
        </div>
    </div>

    <!-- Balance Status -->
    {#if Math.abs(packFinances().packCashOnHand - (packFinances().totalEarmarked + packFinances().unallocatedFunds)) < 0.01}
        <div
            class="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg"
        >
            <svg
                class="w-4 h-4 text-green-600 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                />
            </svg>
            <span class="text-sm font-medium text-green-800"
                >Accounts Balanced</span
            >
        </div>
    {:else}
        <div
            class="flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg"
        >
            <svg
                class="w-4 h-4 text-yellow-600 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path
                    fill-rule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                />
            </svg>
            <span class="text-sm font-medium text-yellow-800"
                >Reconciliation Needed</span
            >
        </div>
    {/if}

    <!-- Recent Activity -->
    <div>
        <h3 class="text-sm font-semibold text-gray-900 mb-2">
            Recent Activity
        </h3>
        <div
            class="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200 max-h-96 overflow-y-auto"
        >
            {#if recentActivity().length === 0}
                <div class="p-4 text-center text-gray-500 text-sm">
                    No recent activity
                </div>
            {:else}
                {#each recentActivity().slice(0, 10) as activity}
                    <div class="px-3 py-2 hover:bg-gray-50 transition-colors">
                        <div class="flex items-start justify-between gap-3">
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-2">
                                    <p
                                        class="text-sm font-medium text-gray-900 truncate"
                                    >
                                        {activity.scoutName || "Pack"}
                                    </p>
                                    <span
                                        class="text-xs px-1.5 py-0.5 rounded {activity.category ===
                                        'scout'
                                            ? getTypeBadgeClass(activity.type)
                                            : activity.type === 'Income'
                                              ? 'bg-green-100 text-green-700'
                                              : 'bg-red-100 text-red-700'}"
                                    >
                                        {activity.type}
                                    </span>
                                </div>
                                <p
                                    class="text-xs text-gray-600 truncate mt-0.5"
                                >
                                    {activity.description}
                                </p>
                                <p class="text-xs text-gray-400 mt-0.5">
                                    {new Date(
                                        activity.date,
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                            <div class="flex-shrink-0">
                                <p
                                    class="text-sm font-semibold {activity.type ===
                                        'Income' || activity.type === 'Deposit'
                                        ? 'text-green-600'
                                        : activity.type === 'Expense' ||
                                            activity.type === 'Withdrawal'
                                          ? 'text-red-600'
                                          : 'text-gray-900'}"
                                >
                                    ${activity.amount.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                {/each}
            {/if}
        </div>
    </div>
</div>
