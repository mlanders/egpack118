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
        getAvailableFiscalYears: () => string[];
        onSelectYear: (year: string) => void;
    }

    let {
        scouts,
        transactions,
        packTransactions,
        getAvailableFiscalYears,
        onSelectYear,
    }: Props = $props();
</script>

<div class="p-4 space-y-4">
    <h2 class="text-lg font-semibold text-gray-900">Year Summary</h2>

    <div
        class="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-800"
    >
        Overview of all fiscal years with key financial metrics.
    </div>

    <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th
                            class="px-3 py-2 text-left text-xs font-medium text-white uppercase"
                            >Year</th
                        >
                        <th
                            class="px-3 py-2 text-center text-xs font-medium text-white uppercase"
                            >Scouts</th
                        >
                        <th
                            class="px-3 py-2 text-center text-xs font-medium text-white uppercase"
                            >Txns</th
                        >
                        <th
                            class="px-3 py-2 text-right text-xs font-medium text-white uppercase"
                            >Revenue</th
                        >
                        <th
                            class="px-3 py-2 text-right text-xs font-medium text-white uppercase"
                            >Expenses</th
                        >
                        <th
                            class="px-3 py-2 text-right text-xs font-medium text-white uppercase"
                            >Cash</th
                        >
                        <th
                            class="px-3 py-2 text-right text-xs font-medium text-white uppercase"
                            >Earmarked</th
                        >
                        <th
                            class="px-3 py-2 text-right text-xs font-medium text-white uppercase"
                            >Unallocated</th
                        >
                        <th
                            class="px-3 py-2 text-center text-xs font-medium text-white uppercase"
                            >Actions</th
                        >
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    {#each getAvailableFiscalYears() as year}
                        {@const yearScouts = scouts.filter(
                            (s) => s.fiscalYear === year,
                        )}
                        {@const yearTransactions = transactions.filter(
                            (t) => t.fiscalYear === year,
                        )}
                        {@const yearPackTransactions = packTransactions.filter(
                            (t) => t.fiscalYear === year,
                        )}
                        {@const activeScoutCount = yearScouts.filter(
                            (s) => s.active,
                        ).length}

                        {@const yearDuesFromAccounts =
                            yearTransactions.filter(
                                (t) =>
                                    t.description === "Pack Dues" &&
                                    t.type === "Withdrawal",
                            ).length * 100}
                        {@const yearDuesFromCash =
                            yearTransactions.filter(
                                (t) => t.type === "Pack Dues Paid",
                            ).length * 100}
                        {@const yearFundraisingShare = yearPackTransactions
                            .filter(
                                (t) =>
                                    t.type === "Income" &&
                                    t.category === "Fundraising Share",
                            )
                            .reduce((sum, t) => sum + t.amount, 0)}
                        {@const yearTransfersFromScouts = yearTransactions
                            .filter((t) => t.type === "Transfer to Pack")
                            .reduce((sum, t) => sum + t.amount, 0)}
                        {@const yearOtherIncome = yearPackTransactions
                            .filter((t) => t.type === "Income")
                            .reduce((sum, t) => sum + t.amount, 0)}
                        {@const yearTotalRevenue =
                            yearDuesFromAccounts +
                            yearDuesFromCash +
                            yearFundraisingShare +
                            yearOtherIncome +
                            yearTransfersFromScouts}

                        {@const yearExpenses = yearPackTransactions
                            .filter((t) => t.type === "Expense")
                            .reduce((sum, t) => sum + t.amount, 0)}
                        {@const yearReimbursements = yearTransactions
                            .filter((t) => t.type === "Reimbursement")
                            .reduce((sum, t) => sum + t.amount, 0)}
                        {@const yearPackCash =
                            yearTotalRevenue -
                            yearExpenses -
                            yearReimbursements}

                        {@const yearEarmarked = yearScouts.reduce(
                            (sum, scout) => {
                                const deposits = yearTransactions
                                    .filter(
                                        (t) =>
                                            t.scoutName === scout.name &&
                                            (t.type === "Deposit" ||
                                                t.type === "Reimbursement"),
                                    )
                                    .reduce((s, t) => s + t.amount, 0);
                                const withdrawals = yearTransactions
                                    .filter(
                                        (t) =>
                                            t.scoutName === scout.name &&
                                            (t.type === "Withdrawal" ||
                                                t.type === "Transfer to Pack"),
                                    )
                                    .reduce((s, t) => s + t.amount, 0);
                                const balance =
                                    scout.beginningBalance +
                                    deposits -
                                    withdrawals;
                                return sum + (balance > 0 ? balance : 0);
                            },
                            0,
                        )}
                        {@const yearUnallocated = yearPackCash - yearEarmarked}

                        <tr class="hover:bg-gray-50">
                            <td class="px-3 py-2">
                                <div
                                    class="text-sm font-semibold text-gray-900"
                                >
                                    {year}
                                </div>
                                <div class="text-xs text-gray-500">
                                    Jul {year.split("-")[0]} - Jun {year.split(
                                        "-",
                                    )[1]}
                                </div>
                            </td>
                            <td
                                class="px-3 py-2 text-center text-sm text-gray-900"
                                >{activeScoutCount}</td
                            >
                            <td
                                class="px-3 py-2 text-center text-sm text-gray-900"
                            >
                                {yearTransactions.length +
                                    yearPackTransactions.length}
                            </td>
                            <td
                                class="px-3 py-2 text-right text-sm font-semibold text-green-600"
                            >
                                ${yearTotalRevenue.toFixed(2)}
                            </td>
                            <td
                                class="px-3 py-2 text-right text-sm font-semibold text-red-600"
                            >
                                ${yearExpenses.toFixed(2)}
                            </td>
                            <td
                                class="px-3 py-2 text-right text-sm font-bold text-gray-900"
                            >
                                ${yearPackCash.toFixed(2)}
                            </td>
                            <td
                                class="px-3 py-2 text-right text-sm text-gray-900"
                            >
                                ${yearEarmarked.toFixed(2)}
                            </td>
                            <td
                                class="px-3 py-2 text-right text-sm font-semibold {yearUnallocated <
                                0
                                    ? 'text-red-600'
                                    : 'text-green-600'}"
                            >
                                ${yearUnallocated.toFixed(2)}
                            </td>
                            <td class="px-3 py-2 text-center">
                                <button
                                    class="px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                                    onclick={() => onSelectYear(year)}
                                >
                                    View
                                </button>
                            </td>
                        </tr>
                    {/each}
                    {#if getAvailableFiscalYears().length === 0}
                        <tr>
                            <td
                                colspan="9"
                                class="px-3 py-8 text-center text-sm text-gray-500"
                            >
                                No fiscal year data yet. Add scouts and
                                transactions to see summaries.
                            </td>
                        </tr>
                    {/if}
                </tbody>
            </table>
        </div>
    </div>
</div>
