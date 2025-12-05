<script lang="ts">
	type ViewMode = 'list' | 'calendar';

	let { viewMode, onToggle }: { viewMode: ViewMode; onToggle: (mode: ViewMode) => void } =
		$props();
</script>

<div class="inline-flex rounded-lg border border-gray-300 bg-white p-1">
	<button
		onclick={() => onToggle('list')}
		class="px-4 py-2 rounded-md text-sm font-medium transition-colors {viewMode === 'list'
			? 'bg-scout-blue text-white'
			: 'text-gray-700 hover:bg-gray-100'}"
	>
		<svg class="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M4 6h16M4 10h16M4 14h16M4 18h16"
			/>
		</svg>
		List
	</button>
	<button
		onclick={() => onToggle('calendar')}
		class="px-4 py-2 rounded-md text-sm font-medium transition-colors {viewMode === 'calendar'
			? 'bg-scout-blue text-white'
			: 'text-gray-700 hover:bg-gray-100'}"
	>
		<svg class="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
			/>
		</svg>
		Calendar
	</button>
</div>
