<script lang="ts">
    import type { PackTransaction } from "$lib/types/finances";

    interface Props {
        show: boolean;
        packTransactionForm: Partial<PackTransaction>;
        onClose: () => void;
        onSubmit: () => void;
        onUpdateForm: (
            field: keyof Partial<PackTransaction>,
            value: any,
        ) => void;
    }

    let {
        show,
        packTransactionForm,
        onClose,
        onSubmit,
        onUpdateForm,
    }: Props = $props();
</script>

{#if show}
    <div
        class="modal active"
        onclick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}
    >
        <div class="modal-content">
            <div class="modal-header">
                <h2>Add Pack Transaction</h2>
                <span class="close" onclick={onClose}>&times;</span>
            </div>
            <form
                onsubmit={(e) => {
                    e.preventDefault();
                    onSubmit();
                }}
            >
                <div class="form-group">
                    <label for="pack-transaction-date">Date *</label>
                    <input
                        type="date"
                        id="pack-transaction-date"
                        value={packTransactionForm.date || ""}
                        oninput={(e) =>
                            onUpdateForm("date", e.currentTarget.value)}
                        required
                    />
                </div>
                <div class="form-group">
                    <label for="pack-transaction-description"
                        >Description *</label
                    >
                    <input
                        type="text"
                        id="pack-transaction-description"
                        value={packTransactionForm.description || ""}
                        oninput={(e) =>
                            onUpdateForm("description", e.currentTarget.value)}
                        required
                    />
                </div>
                <div class="form-group">
                    <label for="pack-transaction-type">Type *</label>
                    <select
                        id="pack-transaction-type"
                        value={packTransactionForm.type || "Income"}
                        onchange={(e) =>
                            onUpdateForm("type", e.currentTarget.value)}
                        required
                    >
                        <option value="Income">Income</option>
                        <option value="Expense">Expense</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="pack-transaction-amount">Amount *</label>
                    <input
                        type="number"
                        id="pack-transaction-amount"
                        step="0.01"
                        value={packTransactionForm.amount || 0}
                        oninput={(e) =>
                            onUpdateForm(
                                "amount",
                                parseFloat(e.currentTarget.value),
                            )}
                        required
                    />
                </div>
                <div class="form-group">
                    <label for="pack-transaction-category">Category</label>
                    <input
                        type="text"
                        id="pack-transaction-category"
                        placeholder="e.g., Registration, Awards, Events, Donation"
                        value={packTransactionForm.category || ""}
                        oninput={(e) =>
                            onUpdateForm("category", e.currentTarget.value)}
                    />
                </div>
                <div class="form-group">
                    <label for="pack-transaction-notes">Notes</label>
                    <textarea
                        id="pack-transaction-notes"
                        value={packTransactionForm.notes || ""}
                        oninput={(e) =>
                            onUpdateForm("notes", e.currentTarget.value)}
                    ></textarea>
                </div>
                <div class="form-actions">
                    <button
                        type="button"
                        class="btn btn-secondary"
                        onclick={onClose}
                    >
                        Cancel
                    </button>
                    <button type="submit" class="btn btn-primary">
                        Add Transaction
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}
