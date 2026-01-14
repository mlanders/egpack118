<script lang="ts">
	import type { Scout, DuesSummary } from '$lib/types/finances';
	import * as api from '$lib/services/financeApi';

	interface Props {
		scout: Scout;
		duesSummary: DuesSummary;
		onRefresh: () => void;
	}

	let { scout, duesSummary, onRefresh }: Props = $props();

	let overrideAction = $state<string>(scout.duesOverrideReason ? 'custom' : '');
	let customReason = $state(scout.duesOverrideReason || '');
	let submitting = $state(false);
	let error = $state<string | null>(null);

	async function handleWaiveRemaining() {
		if (!confirm(`Are you sure you want to waive the remaining $${duesSummary.remaining.toFixed(2)} in dues for ${scout.name}?`)) {
			return;
		}

		const reason = overrideAction === 'custom' ? customReason :
			overrideAction === 'scholarship' ? 'Scholarship' :
			overrideAction === 'waived' ? 'Fees Waived' :
			'Unknown Reason';

		if (!reason.trim()) {
			error = 'Please provide a reason for the override';
			return;
		}

		try {
			submitting = true;
			error = null;

			// Create an override payment for the remaining amount
			if (duesSummary.remaining > 0) {
				await api.createPackDuesPayment({
					scoutId: scout.id,
					scoutName: scout.name,
					fiscalYear: duesSummary.fiscalYear,
					amount: duesSummary.remaining,
					paymentMethod: 'Cash',
					checkNumber: null,
					date: new Date().toISOString(),
					notes: `Admin override: ${reason}`,
					isOverride: true
				});
			}

			// Update scout with override reason
			await api.updateScout(scout.id, {
				duesOverrideReason: reason
			});

			await onRefresh();
		} catch (err: any) {
			error = err.message || 'Failed to waive dues';
		} finally {
			submitting = false;
		}
	}

	async function handleMarkFullyPaid() {
		if (!confirm(`Are you sure you want to mark ${scout.name} as fully paid for dues?`)) {
			return;
		}

		const reason = overrideAction === 'custom' ? customReason :
			overrideAction === 'correction' ? 'Data Entry Correction' :
			'Admin Adjustment';

		if (!reason.trim()) {
			error = 'Please provide a reason for the override';
			return;
		}

		try {
			submitting = true;
			error = null;

			// Create an override payment to bring total to pack dues amount
			if (duesSummary.remaining > 0) {
				await api.createPackDuesPayment({
					scoutId: scout.id,
					scoutName: scout.name,
					fiscalYear: duesSummary.fiscalYear,
					amount: duesSummary.remaining,
					paymentMethod: 'Cash',
					checkNumber: null,
					date: new Date().toISOString(),
					notes: `Admin adjustment: ${reason}`,
					isOverride: true
				});
			}

			// Update scout with override reason
			await api.updateScout(scout.id, {
				duesOverrideReason: reason
			});

			await onRefresh();
		} catch (err: any) {
			error = err.message || 'Failed to mark as paid';
		} finally {
			submitting = false;
		}
	}

	async function handleClearOverride() {
		if (!confirm('Are you sure you want to clear the override reason? This will not delete any payments.')) {
			return;
		}

		try {
			submitting = true;
			error = null;

			await api.updateScout(scout.id, {
				duesOverrideReason: null
			});

			overrideAction = '';
			customReason = '';
			await onRefresh();
		} catch (err: any) {
			error = err.message || 'Failed to clear override';
		} finally {
			submitting = false;
		}
	}
</script>

<div class="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-6">
	<div class="flex items-start gap-2 mb-4">
		<svg class="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
			<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
		</svg>
		<div class="flex-1">
			<h3 class="font-semibold text-yellow-900">Admin Override Controls</h3>
			<p class="text-sm text-yellow-800 mt-1">
				Use these controls to override pack dues for scholarships, waivers, or data corrections.
			</p>
		</div>
	</div>

	<div class="space-y-4">
		<!-- Override Reason Selection -->
		<div>
			<label class="block text-sm font-medium text-yellow-900 mb-2">Override Reason</label>
			<select
				bind:value={overrideAction}
				disabled={submitting}
				class="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white disabled:opacity-50"
			>
				<option value="">Select a reason...</option>
				<option value="scholarship">Scholarship</option>
				<option value="waived">Fees Waived</option>
				<option value="correction">Data Entry Correction</option>
				<option value="custom">Custom Reason...</option>
			</select>
		</div>

		<!-- Custom Reason Input -->
		{#if overrideAction === 'custom'}
			<div>
				<label class="block text-sm font-medium text-yellow-900 mb-1">Custom Reason</label>
				<input
					type="text"
					bind:value={customReason}
					disabled={submitting}
					placeholder="Enter reason for override..."
					class="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white disabled:opacity-50"
				/>
			</div>
		{/if}

		<!-- Current Override Display -->
		{#if scout.duesOverrideReason}
			<div class="bg-white border border-yellow-300 rounded-md p-3">
				<div class="text-sm font-medium text-yellow-900">Current Override</div>
				<div class="text-sm text-yellow-800 mt-1">{scout.duesOverrideReason}</div>
				<button
					onclick={handleClearOverride}
					disabled={submitting}
					class="mt-2 text-sm text-yellow-700 hover:text-yellow-900 underline disabled:opacity-50"
				>
					Clear Override Reason
				</button>
			</div>
		{/if}

		<!-- Error Message -->
		{#if error}
			<div class="bg-red-50 border border-red-200 text-red-700 rounded-md p-3">
				<div class="flex items-start gap-2">
					<svg class="w-5 h-5 text-red-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
					</svg>
					<span class="text-sm">{error}</span>
				</div>
			</div>
		{/if}

		<!-- Action Buttons -->
		<div class="flex gap-3">
			<button
				onclick={handleWaiveRemaining}
				disabled={submitting || !overrideAction || duesSummary.remaining <= 0}
				class="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-md font-medium hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{submitting ? 'Processing...' : `Waive Remaining Dues ($${duesSummary.remaining.toFixed(2)})`}
			</button>
			<button
				onclick={handleMarkFullyPaid}
				disabled={submitting || !overrideAction || duesSummary.remaining <= 0}
				class="flex-1 px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{submitting ? 'Processing...' : 'Mark as Fully Paid'}
			</button>
		</div>

		{#if duesSummary.remaining <= 0}
			<p class="text-sm text-yellow-700 text-center">
				No remaining balance to waive or mark as paid.
			</p>
		{/if}
	</div>
</div>
