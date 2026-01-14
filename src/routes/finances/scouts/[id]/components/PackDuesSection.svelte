<script lang="ts">
    import type { DuesSummary, Scout } from "$lib/types/finances";
    import * as api from "$lib/services/financeApi";
    import AdminOverrideSection from "./AdminOverrideSection.svelte";

    interface Props {
        duesSummary: DuesSummary;
        scout: Scout;
        onRecordPayment: () => void;
        onRefresh: () => void;
    }

    let { duesSummary, scout, onRecordPayment, onRefresh }: Props = $props();

    let showAdminOverride = $state(false);
    let deleting = $state<number | null>(null);

    function getMethodBadgeClass(method: string): string {
        switch (method) {
            case "Cash":
                return "bg-green-100 text-green-800";
            case "Check":
                return "bg-blue-100 text-blue-800";
            case "Scout Account":
                return "bg-purple-100 text-purple-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    }

    async function handleDeletePayment(paymentId: number) {
        if (!confirm("Are you sure you want to delete this payment?")) {
            return;
        }

        try {
            deleting = paymentId;
            await api.deletePackDuesPayment(paymentId);
            await onRefresh();
        } catch (error: any) {
            alert("Failed to delete payment: " + error.message);
        } finally {
            deleting = null;
        }
    }

    function formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString();
    }

    function getProgressPercentage(): number {
        return Math.min(
            100,
            (duesSummary.totalPaid / duesSummary.packDuesAmount) * 100,
        );
    }
</script>

<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-6">
        <div>
            <h2 class="text-lg font-semibold text-gray-900">
                Pack Dues {duesSummary.fiscalYear}
            </h2>
            <p class="text-sm text-gray-600 mt-1">
                Annual pack dues: ${duesSummary.packDuesAmount.toFixed(2)}
            </p>
        </div>
        <div class="flex items-center gap-2">
            <button
                onclick={onRecordPayment}
                class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
                Record Payment
            </button>
            <button
                onclick={() => (showAdminOverride = !showAdminOverride)}
                class="px-4 py-2 bg-yellow-600 text-white rounded-md text-sm font-medium hover:bg-yellow-700 transition-colors"
            >
                {showAdminOverride ? "Hide" : "Admin"} Override
            </button>
        </div>
    </div>

    <!-- Override Notice -->
    {#if duesSummary.duesOverrideReason}
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div class="flex items-start gap-2">
                <svg
                    class="w-5 h-5 text-yellow-600 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path
                        fill-rule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                    />
                </svg>
                <div>
                    <strong class="text-yellow-900"
                        >Dues Override Applied</strong
                    >
                    <p class="text-yellow-800 text-sm mt-1">
                        {duesSummary.duesOverrideReason}
                    </p>
                </div>
            </div>
        </div>
    {/if}

    <!-- Progress Bar -->
    <div class="mb-6">
        <div class="flex justify-between text-sm mb-2">
            <span class="font-medium text-gray-700">
                Paid: <span class="text-green-600"
                    >${duesSummary.totalPaid.toFixed(2)}</span
                >
            </span>
            <span class="font-medium text-gray-700">
                Remaining: <span class="text-red-600"
                    >${duesSummary.remaining.toFixed(2)}</span
                >
            </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
            <div
                class="h-6 transition-all duration-300 flex items-center justify-center text-xs font-medium text-white
					{getProgressPercentage() >= 100 ? 'bg-green-600' : 'bg-blue-600'}"
                style="width: {getProgressPercentage()}%"
            >
                {#if getProgressPercentage() > 15}
                    {getProgressPercentage().toFixed(0)}%
                {/if}
            </div>
        </div>
        {#if duesSummary.totalPaid >= duesSummary.packDuesAmount}
            <div class="text-center mt-2">
                <span
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                >
                    ✓ Fully Paid
                </span>
            </div>
        {/if}
    </div>

    <!-- Admin Override Section -->
    {#if showAdminOverride}
        <AdminOverrideSection {scout} {duesSummary} {onRefresh} />
    {/if}

    <!-- Payment History Table -->
    <div class="mt-6">
        <h3 class="text-base font-semibold text-gray-900 mb-3">
            Payment History
        </h3>

        {#if duesSummary.payments.length === 0}
            <p class="text-gray-500 text-center py-8 bg-gray-50 rounded-lg">
                No payments recorded yet
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
                                >Method</th
                            >
                            <th
                                class="px-4 py-2 text-left text-xs font-medium text-white uppercase"
                                >Check #</th
                            >
                            <th
                                class="px-4 py-2 text-right text-xs font-medium text-white uppercase"
                                >Amount</th
                            >
                            <th
                                class="px-4 py-2 text-left text-xs font-medium text-white uppercase"
                                >Notes</th
                            >
                            <th
                                class="px-4 py-2 text-right text-xs font-medium text-white uppercase"
                                >Actions</th
                            >
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        {#each duesSummary.payments as payment}
                            <tr class="hover:bg-gray-50">
                                <td
                                    class="px-4 py-3 whitespace-nowrap text-sm text-gray-900"
                                >
                                    {formatDate(payment.date)}
                                </td>
                                <td class="px-4 py-3 whitespace-nowrap text-sm">
                                    <span
                                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium {getMethodBadgeClass(
                                            payment.paymentMethod,
                                        )}"
                                    >
                                        {payment.paymentMethod}
                                    </span>
                                    {#if payment.isOverride}
                                        <span
                                            class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 ml-1"
                                        >
                                            Override
                                        </span>
                                    {/if}
                                </td>
                                <td
                                    class="px-4 py-3 whitespace-nowrap text-sm text-gray-900"
                                >
                                    {payment.checkNumber || "-"}
                                </td>
                                <td
                                    class="px-4 py-3 whitespace-nowrap text-sm font-medium text-right text-green-600"
                                >
                                    ${payment.amount.toFixed(2)}
                                </td>
                                <td class="px-4 py-3 text-sm text-gray-600">
                                    {payment.notes || "-"}
                                </td>
                                <td
                                    class="px-4 py-3 whitespace-nowrap text-right text-sm"
                                >
                                    <button
                                        onclick={() =>
                                            handleDeletePayment(payment.id)}
                                        disabled={deleting === payment.id}
                                        class="text-red-600 hover:text-red-900 font-medium disabled:opacity-50"
                                    >
                                        {deleting === payment.id
                                            ? "Deleting..."
                                            : "Delete"}
                                    </button>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        {/if}
    </div>
</div>
