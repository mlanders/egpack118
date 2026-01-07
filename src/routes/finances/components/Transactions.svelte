<script lang="ts">
    import type { Transaction, PackTransaction } from "$lib/types/finances";

    interface Props {
        transactionViewMode: "scout" | "pack";
        transactions: Transaction[];
        packTransactions: PackTransaction[];
        selectedFiscalYear: string;
        filteredTransactions: () => Transaction[];
        filteredPackTransactions: () => PackTransaction[];
        getTypeBadgeClass: (type: string) => string;
        getPackShare: (transaction: Transaction) => number;
        onViewModeChange: (mode: "scout" | "pack") => void;
        onAddTransaction: () => void;
        onAddPackTransaction: () => void;
        onDeleteTransaction: (id: number) => void;
        onDeletePackTransaction: (id: number) => void;
    }

    let {
        transactionViewMode,
        transactions,
        packTransactions,
        selectedFiscalYear,
        filteredTransactions,
        filteredPackTransactions,
        getTypeBadgeClass,
        getPackShare,
        onViewModeChange,
        onAddTransaction,
        onAddPackTransaction,
        onDeleteTransaction,
        onDeletePackTransaction,
    }: Props = $props();
</script>

<div class="space-y-4">
    <!-- Header with Toggle -->
    <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-900">Transactions</h2>
        <div class="flex items-center gap-3">
            <div class="inline-flex rounded-md shadow-sm">
                <button
                    onclick={() => onViewModeChange("scout")}
                    class="px-4 py-2 text-sm font-medium rounded-l-md border {transactionViewMode ===
                    'scout'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}"
                >
                    Scout
                </button>
                <button
                    onclick={() => onViewModeChange("pack")}
                    class="px-4 py-2 text-sm font-medium rounded-r-md border-t border-r border-b {transactionViewMode ===
                    'pack'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}"
                >
                    Pack
                </button>
            </div>
            {#if transactionViewMode === "scout"}
                <button
                    onclick={onAddTransaction}
                    class="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                    Add Transaction
                </button>
            {:else}
                <button
                    onclick={onAddPackTransaction}
                    class="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                    Add Pack Transaction
                </button>
            {/if}
        </div>
    </div>

    <!-- Scout Transactions Table -->
    {#if transactionViewMode === "scout"}
        <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th
                                class="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider"
                                >Date</th
                            >
                            <th
                                class="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider"
                                >Scout</th
                            >
                            <th
                                class="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider"
                                >Description</th
                            >
                            <th
                                class="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider"
                                >Type</th
                            >
                            <th
                                class="px-4 py-2 text-right text-xs font-medium text-white uppercase tracking-wider"
                                >Amount</th
                            >
                            <th
                                class="px-4 py-2 text-right text-xs font-medium text-white uppercase tracking-wider"
                                >Pack (25%)</th
                            >
                            {#if selectedFiscalYear === ""}
                                <th
                                    class="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider"
                                    >Year</th
                                >
                            {/if}
                            <th
                                class="px-4 py-2 text-right text-xs font-medium text-white uppercase tracking-wider"
                                >Actions</th
                            >
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        {#if filteredTransactions().length === 0}
                            <tr>
                                <td
                                    colspan={selectedFiscalYear === "" ? 8 : 7}
                                    class="px-4 py-8 text-center text-sm text-gray-500"
                                >
                                    No transactions yet. Click "Add Transaction"
                                    to get started.
                                </td>
                            </tr>
                        {:else}
                            {#each filteredTransactions() as transaction (transaction.id)}
                                <tr class="hover:bg-gray-50">
                                    <td
                                        class="px-4 py-3 whitespace-nowrap text-sm text-gray-900"
                                    >
                                        {new Date(
                                            transaction.date,
                                        ).toLocaleDateString()}
                                    </td>
                                    <td
                                        class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900"
                                    >
                                        {transaction.scoutName}
                                    </td>
                                    <td class="px-4 py-3 text-sm text-gray-900">
                                        {transaction.description}
                                        {#if transaction.notes}
                                            <div
                                                class="text-xs text-gray-500 mt-0.5"
                                            >
                                                {transaction.notes}
                                            </div>
                                        {/if}
                                    </td>
                                    <td class="px-4 py-3 whitespace-nowrap">
                                        <span
                                            class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium {getTypeBadgeClass(
                                                transaction.type,
                                            )}"
                                        >
                                            {transaction.type}
                                        </span>
                                    </td>
                                    <td
                                        class="px-4 py-3 whitespace-nowrap text-right text-sm {transaction.type ===
                                            'Deposit' ||
                                        transaction.type === 'Reimbursement'
                                            ? 'text-green-600'
                                            : transaction.type ===
                                                    'Withdrawal' ||
                                                transaction.type ===
                                                    'Transfer to Pack'
                                              ? 'text-red-600'
                                              : 'text-gray-900'}"
                                    >
                                        ${transaction.amount.toFixed(2)}
                                    </td>
                                    <td
                                        class="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-900"
                                    >
                                        {#if transaction.type === "Transfer to Pack"}
                                            <span class="text-xs text-gray-500"
                                                >Reallocation</span
                                            >
                                        {:else if getPackShare(transaction) > 0}
                                            ${getPackShare(transaction).toFixed(
                                                2,
                                            )}
                                        {/if}
                                    </td>
                                    {#if selectedFiscalYear === ""}
                                        <td
                                            class="px-4 py-3 whitespace-nowrap text-center"
                                        >
                                            <span
                                                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                                            >
                                                {transaction.fiscalYear}
                                            </span>
                                        </td>
                                    {/if}
                                    <td
                                        class="px-4 py-3 whitespace-nowrap text-right text-sm"
                                    >
                                        <button
                                            onclick={() =>
                                                onDeleteTransaction(
                                                    transaction.id!,
                                                )}
                                            class="text-red-600 hover:text-red-900 font-medium"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            {/each}
                        {/if}
                    </tbody>
                </table>
            </div>
        </div>
    {:else}
        <!-- Pack Transactions Table -->
        <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th
                                class="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider"
                                >Date</th
                            >
                            <th
                                class="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider"
                                >Description</th
                            >
                            <th
                                class="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider"
                                >Category</th
                            >
                            <th
                                class="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider"
                                >Type</th
                            >
                            <th
                                class="px-4 py-2 text-right text-xs font-medium text-white uppercase tracking-wider"
                                >Amount</th
                            >
                            {#if selectedFiscalYear === ""}
                                <th
                                    class="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider"
                                    >Year</th
                                >
                            {/if}
                            <th
                                class="px-4 py-2 text-right text-xs font-medium text-white uppercase tracking-wider"
                                >Actions</th
                            >
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        {#if filteredPackTransactions().length === 0}
                            <tr>
                                <td
                                    colspan={selectedFiscalYear === "" ? 7 : 6}
                                    class="px-4 py-8 text-center text-sm text-gray-500"
                                >
                                    No pack transactions yet. Click "Add Pack
                                    Transaction" to get started.
                                </td>
                            </tr>
                        {:else}
                            {#each filteredPackTransactions() as transaction (transaction.id)}
                                <tr class="hover:bg-gray-50">
                                    <td
                                        class="px-4 py-3 whitespace-nowrap text-sm text-gray-900"
                                    >
                                        {new Date(
                                            transaction.date,
                                        ).toLocaleDateString()}
                                    </td>
                                    <td class="px-4 py-3 text-sm text-gray-900">
                                        {transaction.description}
                                        {#if transaction.notes}
                                            <div
                                                class="text-xs text-gray-500 mt-0.5"
                                            >
                                                {transaction.notes}
                                            </div>
                                        {/if}
                                    </td>
                                    <td
                                        class="px-4 py-3 whitespace-nowrap text-sm text-gray-900"
                                    >
                                        {transaction.category || "-"}
                                    </td>
                                    <td class="px-4 py-3 whitespace-nowrap">
                                        <span
                                            class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium {transaction.type ===
                                            'Income'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'}"
                                        >
                                            {transaction.type}
                                        </span>
                                    </td>
                                    <td
                                        class="px-4 py-3 whitespace-nowrap text-right text-sm {transaction.type ===
                                        'Income'
                                            ? 'text-green-600'
                                            : 'text-red-600'}"
                                    >
                                        ${transaction.amount.toFixed(2)}
                                    </td>
                                    {#if selectedFiscalYear === ""}
                                        <td
                                            class="px-4 py-3 whitespace-nowrap text-center"
                                        >
                                            <span
                                                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                                            >
                                                {transaction.fiscalYear}
                                            </span>
                                        </td>
                                    {/if}
                                    <td
                                        class="px-4 py-3 whitespace-nowrap text-right text-sm"
                                    >
                                        <button
                                            onclick={() =>
                                                onDeletePackTransaction(
                                                    transaction.id!,
                                                )}
                                            class="text-red-600 hover:text-red-900 font-medium"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            {/each}
                        {/if}
                    </tbody>
                </table>
            </div>
        </div>
    {/if}
</div>
