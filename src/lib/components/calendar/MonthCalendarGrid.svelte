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

	// Narrow screens can't fit titles in day cells, so they list the month's events underneath.
	let monthEvents = $derived(
		monthData.weeks.flat().flatMap((day) => (day.isCurrentMonth ? day.events : []))
	);
</script>

<div class="bg-white border-2 border-gray-200 rounded-lg shadow-lg overflow-hidden">
	<MonthHeader monthName={monthData.month} {isCollapsed} onToggle={onToggleCollapse} />

	{#if !isCollapsed}
		<div class="p-2 md:p-4">
			<!-- Weekday Headers -->
			<div class="grid grid-cols-7 gap-1 md:gap-2 mb-2">
				{#each weekDays as day}
					<div class="text-center font-semibold text-gray-700 text-sm py-2">
						{day}
					</div>
				{/each}
			</div>

			<!-- Calendar Days -->
			{#each monthData.weeks as week}
				<div class="grid grid-cols-7 gap-1 mb-1 md:gap-2 md:mb-0">
					{#each week as day}
						<div
							class="min-w-0 min-h-11 md:min-h-24 border rounded p-1 md:p-2 {day.isCurrentMonth
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
								<span class="mx-auto mt-1 block size-1.5 rounded-full bg-scout-blue md:hidden" aria-hidden="true"></span>
								<div class="mt-1 space-y-1 hidden md:block">
									{#each day.events as event}
										<button
											onclick={() => onEventClick(event)}
											class="text-xs bg-scout-blue text-white rounded px-1 py-0.5 line-clamp-2 break-words w-full text-left hover:bg-blue-700 cursor-pointer transition-colors"
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

			{#if monthEvents.length > 0}
				<ul class="mt-3 divide-y divide-gray-200 border-t border-gray-200 md:hidden">
					{#each monthEvents as event}
						<li>
							<button
								onclick={() => onEventClick(event)}
								class="w-full px-2 py-3 text-left hover:bg-scout-blue/10"
							>
								<span class="block font-semibold text-scout-blue break-words">{event.title}</span>
								<span class="block text-sm text-gray-600">
									{event.date}{event.time ? `, ${event.time}` : ''}
								</span>
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	{/if}
</div>
