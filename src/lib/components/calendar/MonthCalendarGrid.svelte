<script lang="ts">
	import MonthHeader from './MonthHeader.svelte';

	interface Event {
		title: string;
		date: string;
		time?: string;
		location?: string;
		description?: string;
	}

	interface CalendarDay {
		day: number;
		isCurrentMonth: boolean;
		events: Event[];
		date: Date;
	}

	interface CalendarMonth {
		month: string;
		year: number;
		weeks: CalendarDay[][];
	}

	let {
		monthData,
		isCollapsed,
		onToggleCollapse,
		onEventClick
	}: {
		monthData: CalendarMonth;
		isCollapsed: boolean;
		onToggleCollapse: () => void;
		onEventClick: (event: Event) => void;
	} = $props();

	const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
</script>

<div class="bg-white border-2 border-gray-200 rounded-lg shadow-lg overflow-hidden">
	<MonthHeader monthName={monthData.month} {isCollapsed} onToggle={onToggleCollapse} />

	{#if !isCollapsed}
		<div class="p-4">
			<!-- Weekday Headers -->
			<div class="grid grid-cols-7 gap-2 mb-2">
				{#each weekDays as day}
					<div class="text-center font-semibold text-gray-700 text-sm py-2">
						{day}
					</div>
				{/each}
			</div>

			<!-- Calendar Days -->
			{#each monthData.weeks as week}
				<div class="grid grid-cols-7 gap-2">
					{#each week as day}
						<div
							class="min-h-24 border rounded p-2 {day.isCurrentMonth
								? 'bg-white'
								: 'bg-gray-50'} {day.events.length > 0
								? 'border-scout-blue border-2'
								: 'border-gray-200'}"
						>
							<div
								class="text-sm font-medium {day.isCurrentMonth
									? 'text-gray-900'
									: 'text-gray-400'}"
							>
								{day.day}
							</div>
							{#if day.events.length > 0}
								<div class="mt-1 space-y-1">
									{#each day.events as event}
										<button
											onclick={() => onEventClick(event)}
											class="text-xs bg-scout-blue text-white rounded px-1 py-0.5 truncate w-full text-left hover:bg-blue-700 cursor-pointer transition-colors"
											title={event.title}
										>
											{event.title}
										</button>
									{/each}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			{/each}
		</div>
	{/if}
</div>
