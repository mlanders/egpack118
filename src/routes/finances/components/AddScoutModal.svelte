<script lang="ts">
    import type { Scout } from "$lib/types/finances";

    interface Props {
        show: boolean;
        scoutForm: Partial<Scout>;
        onClose: () => void;
        onSubmit: () => void;
        onUpdateForm: (field: keyof Partial<Scout>, value: any) => void;
    }

    let { show, scoutForm, onClose, onSubmit, onUpdateForm }: Props = $props();
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
                <h2>Add New Scout</h2>
                <span class="close" onclick={onClose}>&times;</span>
            </div>
            <form
                onsubmit={(e) => {
                    e.preventDefault();
                    onSubmit();
                }}
            >
                <div class="form-group">
                    <label for="scout-name">Scout Name *</label>
                    <input
                        type="text"
                        id="scout-name"
                        value={scoutForm.name || ""}
                        oninput={(e) =>
                            onUpdateForm("name", e.currentTarget.value)}
                        required
                    />
                </div>
                <div class="form-group">
                    <label for="beginning-balance">Beginning Balance</label>
                    <input
                        type="number"
                        id="beginning-balance"
                        step="0.01"
                        value={scoutForm.beginningBalance || 0}
                        oninput={(e) =>
                            onUpdateForm(
                                "beginningBalance",
                                parseFloat(e.currentTarget.value),
                            )}
                    />
                </div>
                <div class="form-group">
                    <label for="scout-notes">Notes</label>
                    <textarea
                        id="scout-notes"
                        value={scoutForm.notes || ""}
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
                        Add Scout
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}
