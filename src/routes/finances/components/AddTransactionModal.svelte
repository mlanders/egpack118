<script lang="ts">
    import type { Scout, Transaction } from "$lib/types/finances";

    interface Props {
        show: boolean;
        scouts: Scout[];
        transactionForm: Partial<Transaction>;
        onClose: () => void;
        onSubmit: () => void;
        onUpdateForm: (field: keyof Partial<Transaction>, value: any) => void;
    }

    let {
        show,
        scouts,
        transactionForm,
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
                <h2>Add New Transaction</h2>
                <span class="close" onclick={onClose}>&times;</span>
            </div>
            <form
                onsubmit={(e) => {
                    e.preventDefault();
                    onSubmit();
                }}
            >
                <div class="form-group">
                    <label for="transaction-date">Date *</label>
                    <input
                        type="date"
                        id="transaction-date"
                        value={transactionForm.date || ""}
                        oninput={(e) =>
                            onUpdateForm("date", e.currentTarget.value)}
                        required
                    />
                </div>
                <div class="form-group">
                    <label for="transaction-scout">Scout Name *</label>
                    <select
                        id="transaction-scout"
                        value={transactionForm.scoutName || ""}
                        onchange={(e) =>
                            onUpdateForm("scoutName", e.currentTarget.value)}
                        required
                    >
                        <option value="">Select a scout...</option>
                        {#each scouts.filter((s) => s.active) as scout}
                            <option value={scout.name}>{scout.name}</option>
                        {/each}
                        {#if scouts.filter((s) => !s.active).length > 0}
                            <optgroup label="Inactive Scouts">
                                {#each scouts.filter((s) => !s.active) as scout}
                                    <option value={scout.name}
                                        >{scout.name}</option
                                    >
                                {/each}
                            </optgroup>
                        {/if}
                    </select>
                </div>
                <div class="form-group">
                    <label for="transaction-description">Description *</label>
                    <input
                        type="text"
                        id="transaction-description"
                        value={transactionForm.description || ""}
                        oninput={(e) =>
                            onUpdateForm("description", e.currentTarget.value)}
                        required
                    />
                </div>
                <div class="form-group">
                    <label for="transaction-type">Type *</label>
                    <select
                        id="transaction-type"
                        value={transactionForm.type || "Deposit"}
                        onchange={(e) =>
                            onUpdateForm("type", e.currentTarget.value)}
                        required
                    >
                        <option value="Deposit">Deposit (Fundraising)</option>
                        <option value="Withdrawal"
                            >Withdrawal (Fees/Expenses)</option
                        >
                        <option value="Pack Dues Paid"
                            >Pack Dues Paid (Family Cash)</option
                        >
                        <option value="Reimbursement">Reimbursement</option>
                        <option value="Transfer to Pack"
                            >Transfer to Pack</option
                        >
                    </select>
                </div>
                <div class="form-group">
                    <label for="transaction-amount">Amount *</label>
                    <input
                        type="number"
                        id="transaction-amount"
                        step="0.01"
                        value={transactionForm.amount || 0}
                        oninput={(e) =>
                            onUpdateForm(
                                "amount",
                                parseFloat(e.currentTarget.value),
                            )}
                        required
                    />
                </div>
                <div class="form-group">
                    <label for="transaction-notes">Notes</label>
                    <textarea
                        id="transaction-notes"
                        value={transactionForm.notes || ""}
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
