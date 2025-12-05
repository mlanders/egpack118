<script lang="ts">
	let {
		monthName,
		isCollapsed,
		onToggle
	}: { monthName: string; isCollapsed: boolean; onToggle: () => void } = $props();
</script>

<button
	onclick={onToggle}
	class="bg-scout-blue text-white px-6 py-4 w-full flex items-center justify-between hover:bg-blue-700 transition-colors"
>
	<h2 class="text-2xl font-bold">
		{monthName}
	</h2>
	<svg
		class="w-6 h-6 transition-transform {isCollapsed ? '' : 'rotate-180'}"
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
	</svg>
</button>
