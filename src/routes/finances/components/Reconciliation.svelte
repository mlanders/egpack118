<script lang="ts">
    import type { Scout } from "$lib/types/finances";

    interface Props {
        scouts: Scout[];
        packFinances: () => any;
        getCurrentBalance: (scout: Scout) => number;
    }

    let { scouts, packFinances, getCurrentBalance }: Props = $props();
</script>

<div class="p-4 space-y-4">
    <h2 class="text-lg font-semibold text-gray-900">Reconciliation</h2>

    <div
        class="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-800"
    >
        Verify that pack cash on hand equals scout earmarked balances plus
        unallocated funds.
    </div>

    <div class="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
        <h3 class="text-base font-semibold text-gray-900">
            Account Breakdown
        </h3>

        <div class="space-y-2">
            <div
                class="flex justify-between items-center py-2 border-b border-gray-200"
            >
                <span class="text-sm font-medium text-gray-700"
                    >Total Pack Cash on Hand:</span
                >
                <span class="text-lg font-bold text-gray-900">
                    ${packFinances().packCashOnHand.toFixed(2)}
                </span>
            </div>
            <div
                class="flex justify-between items-center py-2 border-b border-gray-200"
            >
                <span class="text-sm text-gray-700"
                    >Total Earmarked for Scouts:</span
                >
                <span class="text-sm font-semibold text-gray-900">
                    ${packFinances().totalEarmarked.toFixed(2)}
                </span>
            </div>
            <div class="flex justify-between items-center py-2">
                <span class="text-sm text-gray-700">Unallocated Pack Funds:</span
                >
                <span
                    class="text-sm font-semibold {packFinances()
                        .unallocatedFunds < 0
                        ? 'text-red-600'
                        : 'text-green-600'}"
                >
                    ${packFinances().unallocatedFunds.toFixed(2)}
                </span>
            </div>
        </div>

        {#if Math.abs(packFinances().packCashOnHand - (packFinances().totalEarmarked + packFinances().unallocatedFunds)) < 0.01}
            <div
                class="bg-green-50 border border-green-200 rounded-md p-3 text-sm text-green-800"
            >
                <strong>Reconciled:</strong> All accounts balance correctly!
            </div>
        {:else}
            <div
                class="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm text-yellow-800"
            >
                <strong>Discrepancy:</strong> Difference of ${Math.abs(
                    packFinances().packCashOnHand -
                        (packFinances().totalEarmarked +
                            packFinances().unallocatedFunds),
                ).toFixed(2)}
            </div>
        {/if}

        {#if packFinances().unallocatedFunds < 0}
            <div
                class="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm text-yellow-800"
            >
                <strong>Warning:</strong> Negative unallocated funds means the pack
                has earmarked more than available.
            </div>
        {/if}
    </div>

    <h3 class="text-base font-semibold text-gray-900">Scout Balance Details</h3>
    <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th
                            class="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase"
                            >Scout</th
                        >
                        <th
                            class="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase"
                            >Status</th
                        >
                        <th
                            class="px-4 py-2 text-right text-xs font-medium text-gray-700 uppercase"
                            >Balance</th
                        >
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    {#if scouts.length === 0}
                        <tr>
                            <td
                                colspan="3"
                                class="px-4 py-8 text-center text-sm text-gray-500"
                            >
                                No scouts added yet
                            </td>
                        </tr>
                    {:else}
                        {#each scouts.filter((s) => s.active) as scout (scout.id)}
                            {@const balance = getCurrentBalance(scout)}
                            <tr class="hover:bg-gray-50">
                                <td
                                    class="px-4 py-2 text-sm font-medium text-gray-900"
                                    >{scout.name}</td
                                >
                                <td class="px-4 py-2 text-sm">
                                    <span
                                        class="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800"
                                    >
                                        Active
                                    </span>
                                </td>
                                <td
                                    class="px-4 py-2 text-sm font-semibold text-right {balance >=
                                    0
                                        ? 'text-green-600'
                                        : 'text-red-600'}"
                                >
                                    ${balance.toFixed(2)}
                                </td>
                            </tr>
                        {/each}
                        {#if scouts.filter((s) => !s.active).length > 0}
                            <tr class="bg-gray-50">
                                <td
                                    colspan="3"
                                    class="px-4 py-2 text-xs font-semibold text-gray-600 uppercase"
                                >
                                    Inactive Scouts
                                </td>
                            </tr>
                            {#each scouts.filter((s) => !s.active) as scout (scout.id)}
                                {@const balance = getCurrentBalance(scout)}
                                <tr class="opacity-60 hover:opacity-100">
                                    <td
                                        class="px-4 py-2 text-sm font-medium text-gray-900"
                                        >{scout.name}</td
                                    >
                                    <td class="px-4 py-2 text-sm">
                                        <span
                                            class="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600"
                                        >
                                            Inactive
                                        </span>
                                    </td>
                                    <td
                                        class="px-4 py-2 text-sm font-semibold text-right {balance >=
                                        0
                                            ? 'text-green-600'
                                            : 'text-red-600'}"
                                    >
                                        ${balance.toFixed(2)}
                                    </td>
                                </tr>
                            {/each}
                        {/if}
                        <tr class="bg-gray-50 font-semibold">
                            <td
                                colspan="2"
                                class="px-4 py-3 text-sm text-gray-900"
                                >Total Earmarked (Active Only)</td
                            >
                            <td class="px-4 py-3 text-sm text-right text-gray-900">
                                ${packFinances().totalEarmarked.toFixed(2)}
                            </td>
                        </tr>
                    {/if}
                </tbody>
            </table>
        </div>
    </div>

    <div class="bg-white border border-gray-200 rounded-lg p-4">
        <h3 class="text-base font-semibold text-gray-900 mb-3">Verification</h3>
        <div class="text-sm text-gray-700 space-y-1">
            <p>
                <strong>Pack Cash</strong> =
                <strong>Earmarked</strong>
                + <strong>Unallocated</strong>
            </p>
            <p class="font-mono">
                ${packFinances().packCashOnHand.toFixed(2)} = ${packFinances().totalEarmarked.toFixed(
                    2,
                )} + ${packFinances().unallocatedFunds.toFixed(2)}
            </p>
            <div class="mt-2">
                {#if Math.abs(packFinances().packCashOnHand - (packFinances().totalEarmarked + packFinances().unallocatedFunds)) < 0.01}
                    <span
                        class="inline-flex px-2 py-1 text-xs font-medium rounded-md bg-green-100 text-green-800"
                        >Verified</span
                    >
                {:else}
                    <span
                        class="inline-flex px-2 py-1 text-xs font-medium rounded-md bg-yellow-100 text-yellow-800"
                        >Does Not Match</span
                    >
                {/if}
            </div>
        </div>
    </div>
</div>
