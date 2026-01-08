<script lang="ts">
    import type { Scout, DuesSummary } from "$lib/types/finances";
    import * as api from "$lib/services/financeApi";

    interface Props {
        show: boolean;
        scout: Scout;
        duesSummary: DuesSummary;
        currentBalance: number;
        onClose: () => void;
        onSuccess: () => void;
    }

    let {
        show,
        scout,
        duesSummary,
        currentBalance,
        onClose,
        onSuccess,
    }: Props = $props();

    let form = $state({
        amount: 0,
        paymentMethod: "Cash" as "Cash" | "Check" | "Scout Account",
        checkNumber: "",
        date: new Date().toISOString().split("T")[0],
        notes: "",
    });

    let validationError = $state("");
    let submitting = $state(false);

    // Reset form when modal opens
    $effect(() => {
        if (show) {
            resetForm();
        }
    });

    function resetForm() {
        form = {
            amount: duesSummary.remaining,
            paymentMethod: "Cash",
            checkNumber: "",
            date: new Date().toISOString().split("T")[0],
            notes: "",
        };
        validationError = "";
    }

    function fillRemaining() {
        form.amount = duesSummary.remaining;
    }

    function validate(): boolean {
        validationError = "";

        if (form.amount <= 0) {
            validationError = "Amount must be greater than 0";
            return false;
        }

        if (form.amount > duesSummary.remaining) {
            validationError = `Amount cannot exceed remaining balance of $${duesSummary.remaining.toFixed(2)}`;
            return false;
        }

        if (form.paymentMethod === "Check") {
            if (!form.checkNumber) {
                validationError = "Check number is required for check payments";
                return false;
            }
            if (!/^\d+$/.test(form.checkNumber)) {
                validationError = "Check number must be numeric";
                return false;
            }
        }

        if (form.paymentMethod === "Scout Account") {
            if (form.amount > currentBalance) {
                validationError = `Insufficient scout account balance. Available: $${currentBalance.toFixed(2)}`;
                return false;
            }
        }

        return true;
    }

    async function handleSubmit() {
        if (!validate()) return;

        try {
            submitting = true;
            validationError = "";

            await api.createPackDuesPayment({
                scoutId: scout.id,
                scoutName: scout.name,
                fiscalYear: duesSummary.fiscalYear,
                amount: form.amount,
                paymentMethod: form.paymentMethod,
                checkNumber:
                    form.paymentMethod === "Check"
                        ? form.checkNumber || null
                        : null,
                date: new Date(form.date).toISOString(),
                notes: form.notes || "",
                isOverride: false,
            });

            onSuccess();
        } catch (error: any) {
            validationError = error.message || "Failed to record payment";
        } finally {
            submitting = false;
        }
    }

    function handleClose() {
        if (!submitting) {
            onClose();
        }
    }
</script>

{#if show}
    <div
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onclick={(e) => {
            if (e.target === e.currentTarget) handleClose();
        }}
    >
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
            <!-- Header -->
            <div
                class="flex items-center justify-between p-6 border-b border-gray-200"
            >
                <h2 class="text-xl font-semibold text-gray-900">
                    Record Pack Dues Payment
                </h2>
                <button
                    onclick={handleClose}
                    disabled={submitting}
                    class="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                    <svg
                        class="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>

            <!-- Form -->
            <form
                onsubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
                class="p-6 space-y-4"
            >
                <!-- Remaining Balance Notice -->
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div class="text-sm">
                        <div class="font-medium text-blue-900">Dues Status</div>
                        <div class="text-blue-800 mt-1">
                            Total Dues: ${duesSummary.packDuesAmount.toFixed(
                                2,
                            )}<br />
                            Paid: ${duesSummary.totalPaid.toFixed(2)}<br />
                            <strong
                                >Remaining: ${duesSummary.remaining.toFixed(
                                    2,
                                )}</strong
                            >
                        </div>
                        {#if form.paymentMethod === "Scout Account"}
                            <div
                                class="text-blue-800 mt-2 pt-2 border-t border-blue-200"
                            >
                                Scout Account Balance: ${currentBalance.toFixed(
                                    2,
                                )}
                            </div>
                        {/if}
                    </div>
                </div>

                <!-- Payment Method -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Payment Method <span class="text-red-600">*</span>
                    </label>
                    <div class="space-y-2">
                        <label
                            class="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50
							{form.paymentMethod === 'Cash' ? 'bg-blue-50 border-blue-500' : ''}"
                        >
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="Cash"
                                bind:group={form.paymentMethod}
                                class="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span class="ml-3 text-sm font-medium text-gray-900"
                                >Cash</span
                            >
                        </label>

                        <label
                            class="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50
							{form.paymentMethod === 'Check' ? 'bg-blue-50 border-blue-500' : ''}"
                        >
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="Check"
                                bind:group={form.paymentMethod}
                                class="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span class="ml-3 text-sm font-medium text-gray-900"
                                >Check</span
                            >
                        </label>

                        <label
                            class="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50
							{form.paymentMethod === 'Scout Account' ? 'bg-blue-50 border-blue-500' : ''}"
                        >
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="Scout Account"
                                bind:group={form.paymentMethod}
                                class="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span class="ml-3 text-sm font-medium text-gray-900"
                                >Scout Account (Earmarked Funds)</span
                            >
                        </label>
                    </div>
                </div>

                <!-- Check Number (conditional) -->
                {#if form.paymentMethod === "Check"}
                    <div>
                        <label
                            for="checkNumber"
                            class="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Check Number <span class="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            id="checkNumber"
                            bind:value={form.checkNumber}
                            pattern="[0-9]+"
                            placeholder="Enter check number (numeric only)"
                            required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p class="text-xs text-gray-600 mt-1">
                            Numbers only, no letters or special characters
                        </p>
                    </div>
                {/if}

                <!-- Amount with Auto-fill -->
                <div>
                    <label
                        for="amount"
                        class="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Amount <span class="text-red-600">*</span>
                    </label>
                    <div class="flex gap-2">
                        <div class="flex-1">
                            <div class="relative">
                                <span
                                    class="absolute left-3 top-2 text-gray-600"
                                    >$</span
                                >
                                <input
                                    type="number"
                                    id="amount"
                                    bind:value={form.amount}
                                    step="0.01"
                                    min="0.01"
                                    max={duesSummary.remaining}
                                    required
                                    class="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <button
                            type="button"
                            onclick={fillRemaining}
                            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors whitespace-nowrap"
                        >
                            Fill Remaining
                        </button>
                    </div>
                </div>

                <!-- Date -->
                <div>
                    <label
                        for="date"
                        class="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Date <span class="text-red-600">*</span>
                    </label>
                    <input
                        type="date"
                        id="date"
                        bind:value={form.date}
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <!-- Notes -->
                <div>
                    <label
                        for="notes"
                        class="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Notes (Optional)
                    </label>
                    <textarea
                        id="notes"
                        bind:value={form.notes}
                        rows="3"
                        placeholder="Add any additional notes..."
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                </div>

                <!-- Validation Error -->
                {#if validationError}
                    <div
                        class="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3"
                    >
                        <div class="flex items-start gap-2">
                            <svg
                                class="w-5 h-5 text-red-600 mt-0.5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                            <span class="text-sm">{validationError}</span>
                        </div>
                    </div>
                {/if}

                <!-- Actions -->
                <div class="flex gap-3 pt-4">
                    <button
                        type="button"
                        onclick={handleClose}
                        disabled={submitting}
                        class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {submitting ? "Recording..." : "Record Payment"}
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}
