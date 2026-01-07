<script lang="ts">
    interface Props {
        show: boolean;
        getCurrentFiscalYear: () => string;
        newFiscalYearOptions: {
            carryForwardBalances: boolean;
            markPreviousInactive: boolean;
        };
        onClose: () => void;
        onSubmit: () => void;
        onUpdateOptions: (
            field: "carryForwardBalances" | "markPreviousInactive",
            value: boolean,
        ) => void;
    }

    let {
        show,
        getCurrentFiscalYear,
        newFiscalYearOptions,
        onClose,
        onSubmit,
        onUpdateOptions,
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
                <h2>Create New Fiscal Year</h2>
                <span class="close" onclick={onClose}>&times;</span>
            </div>
            <form
                onsubmit={(e) => {
                    e.preventDefault();
                    onSubmit();
                }}
            >
                <div class="info-box" style="margin-bottom: 1.5rem;">
                    <p>
                        <strong
                            >This will create a new fiscal year starting July
                            1st.</strong
                        >
                    </p>
                    <p>
                        The new fiscal year will be based on the current fiscal
                        year: {getCurrentFiscalYear()}
                    </p>
                    <p>
                        New fiscal year: <strong
                            >{parseInt(
                                getCurrentFiscalYear().split("-")[1],
                            )}-{parseInt(getCurrentFiscalYear().split("-")[1]) +
                                1}</strong
                        >
                    </p>
                </div>

                <div class="form-group">
                    <label
                        style="display: flex; align-items: center; gap: 0.5rem;"
                    >
                        <input
                            type="checkbox"
                            checked={newFiscalYearOptions.carryForwardBalances}
                            onchange={(e) =>
                                onUpdateOptions(
                                    "carryForwardBalances",
                                    e.currentTarget.checked,
                                )}
                        />
                        <strong>Carry Forward Scout Balances</strong>
                    </label>
                    <p
                        style="margin-left: 1.5rem; margin-top: 0.5rem; color: #666;"
                    >
                        Create new scout records in the new fiscal year with
                        their current balances as beginning balances.
                    </p>
                </div>

                <div class="form-group">
                    <label
                        style="display: flex; align-items: center; gap: 0.5rem;"
                    >
                        <input
                            type="checkbox"
                            checked={newFiscalYearOptions.markPreviousInactive}
                            onchange={(e) =>
                                onUpdateOptions(
                                    "markPreviousInactive",
                                    e.currentTarget.checked,
                                )}
                        />
                        <strong>Mark Scouts in Previous Year as Inactive</strong
                        >
                    </label>
                    <p
                        style="margin-left: 1.5rem; margin-top: 0.5rem; color: #666;"
                    >
                        Mark all scout records from the current fiscal year as
                        inactive. This keeps them separate from the new year.
                    </p>
                </div>

                <div class="warning-box" style="margin-top: 1.5rem;">
                    <strong>Important:</strong> This action cannot be undone easily.
                    Make sure you understand the options above before proceeding.
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
                        Create New Fiscal Year
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}
