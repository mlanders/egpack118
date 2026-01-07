<script lang="ts">
    import type { Scout } from "$lib/types/finances";

    interface Props {
        scouts: Scout[];
        showInactiveScouts: boolean;
        filteredScouts: () => Scout[];
        getCurrentBalance: (scout: Scout) => number;
        getTotalEarnedFromFundraising: (scoutName: string) => number;
        getTotalFamilyCash: (scoutName: string) => number;
        getTotalWithdrawals: (scoutName: string) => number;
        hasPackDuesPaid: (scoutName: string) => boolean;
        onToggleInactive: () => void;
        onAddScout: () => void;
        onMarkInactive: (scout: Scout) => void;
        onMarkActive: (scout: Scout) => void;
        onDeleteScout: (id: number) => void;
    }

    let {
        scouts,
        showInactiveScouts,
        filteredScouts,
        getCurrentBalance,
        getTotalEarnedFromFundraising,
        getTotalFamilyCash,
        getTotalWithdrawals,
        hasPackDuesPaid,
        onToggleInactive,
        onAddScout,
        onMarkInactive,
        onMarkActive,
        onDeleteScout,
    }: Props = $props();
</script>

<div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-900">Scout Balances</h2>
        <div class="flex items-center gap-3">
            <label
                class="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
            >
                <input
                    type="checkbox"
                    checked={showInactiveScouts}
                    onchange={onToggleInactive}
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Show Inactive
            </label>
            <button
                onclick={onAddScout}
                class="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
                Add Scout
            </button>
        </div>
    </div>

    <!-- Table -->
    <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th
                            class="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider"
                            >Scout</th
                        >
                        <th
                            class="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider"
                            >Status</th
                        >
                        <th
                            class="px-4 py-2 text-right text-xs font-medium text-white uppercase tracking-wider"
                            >Beginning</th
                        >
                        <th
                            class="px-4 py-2 text-right text-xs font-medium text-white uppercase tracking-wider"
                            >Fundraising</th
                        >
                        <th
                            class="px-4 py-2 text-right text-xs font-medium text-white uppercase tracking-wider"
                            >Family Cash</th
                        >
                        <th
                            class="px-4 py-2 text-right text-xs font-medium text-white uppercase tracking-wider"
                            >Withdrawals</th
                        >
                        <th
                            class="px-4 py-2 text-right text-xs font-medium text-white uppercase tracking-wider"
                            >Current</th
                        >
                        <th
                            class="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider"
                            >Dues</th
                        >
                        <th
                            class="px-4 py-2 text-right text-xs font-medium text-white uppercase tracking-wider"
                            >Actions</th
                        >
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    {#if filteredScouts().length === 0}
                        <tr>
                            <td
                                colspan="9"
                                class="px-4 py-8 text-center text-sm text-gray-500"
                            >
                                {#if showInactiveScouts}
                                    No scouts found. Click "Add Scout" to get
                                    started.
                                {:else}
                                    No active scouts. Enable "Show Inactive" to
                                    see all scouts.
                                {/if}
                            </td>
                        </tr>
                    {:else}
                        {#each filteredScouts() as scout (scout.id)}
                            <tr
                                class="hover:bg-gray-50 {!scout.active
                                    ? 'bg-gray-50/50'
                                    : ''}"
                            >
                                <td class="px-4 py-3 whitespace-nowrap">
                                    <div
                                        class="text-sm font-medium text-gray-900"
                                    >
                                        {scout.name}
                                    </div>
                                    {#if scout.notes}
                                        <div
                                            class="text-xs text-gray-500 mt-0.5"
                                        >
                                            {scout.notes}
                                        </div>
                                    {/if}
                                </td>
                                <td class="px-4 py-3 whitespace-nowrap">
                                    {#if scout.active}
                                        <span
                                            class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                                        >
                                            Active
                                        </span>
                                    {:else}
                                        <span
                                            class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                                        >
                                            Inactive
                                        </span>
                                    {/if}
                                </td>
                                <td
                                    class="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-900"
                                >
                                    ${scout.beginningBalance.toFixed(2)}
                                </td>
                                <td
                                    class="px-4 py-3 whitespace-nowrap text-right text-sm text-green-600"
                                >
                                    ${getTotalEarnedFromFundraising(
                                        scout.name,
                                    ).toFixed(2)}
                                </td>
                                <td
                                    class="px-4 py-3 whitespace-nowrap text-right text-sm text-green-600"
                                >
                                    ${getTotalFamilyCash(scout.name).toFixed(2)}
                                </td>
                                <td
                                    class="px-4 py-3 whitespace-nowrap text-right text-sm text-red-600"
                                >
                                    ${getTotalWithdrawals(scout.name).toFixed(
                                        2,
                                    )}
                                </td>
                                <td
                                    class="px-4 py-3 whitespace-nowrap text-right"
                                >
                                    <span
                                        class="text-sm font-semibold {getCurrentBalance(
                                            scout,
                                        ) > 0
                                            ? 'text-green-600'
                                            : getCurrentBalance(scout) < 0
                                              ? 'text-red-600'
                                              : 'text-gray-900'}"
                                    >
                                        ${getCurrentBalance(scout).toFixed(2)}
                                    </span>
                                </td>
                                <td
                                    class="px-4 py-3 whitespace-nowrap text-center"
                                >
                                    {#if hasPackDuesPaid(scout.name)}
                                        <span
                                            class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                                        >
                                            Paid
                                        </span>
                                    {/if}
                                </td>
                                <td
                                    class="px-4 py-3 whitespace-nowrap text-right text-sm space-x-2"
                                >
                                    {#if scout.active}
                                        <button
                                            onclick={() =>
                                                onMarkInactive(scout)}
                                            class="text-yellow-600 hover:text-yellow-900 font-medium"
                                        >
                                            Deactivate
                                        </button>
                                    {:else}
                                        <button
                                            onclick={() => onMarkActive(scout)}
                                            class="text-green-600 hover:text-green-900 font-medium"
                                        >
                                            Activate
                                        </button>
                                    {/if}
                                    <button
                                        onclick={() => onDeleteScout(scout.id!)}
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
</div>
