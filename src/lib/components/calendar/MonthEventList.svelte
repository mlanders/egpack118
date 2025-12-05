<script lang="ts">
	import MonthHeader from './MonthHeader.svelte';
	import EventCard from './EventCard.svelte';

	interface Event {
		title: string;
		date: string;
		time?: string;
		location?: string;
		description?: string;
	}

	interface MonthGroup {
		month: string;
		events: Event[];
	}

	let {
		monthGroup,
		monthIndex,
		isCollapsed,
		expandedEvents,
		onToggleCollapse,
		onToggleEventExpand
	}: {
		monthGroup: MonthGroup;
		monthIndex: number;
		isCollapsed: boolean;
		expandedEvents: Record<string, boolean>;
		onToggleCollapse: () => void;
		onToggleEventExpand: (eventId: string) => void;
	} = $props();

	function getEventId(eventIndex: number): string {
		return `${monthIndex}-${eventIndex}`;
	}

	function isEventExpanded(eventId: string): boolean {
		return expandedEvents[eventId] || false;
	}
</script>

<div class="bg-white border-2 border-gray-200 rounded-lg shadow-lg overflow-hidden">
	<MonthHeader monthName={monthGroup.month} {isCollapsed} onToggle={onToggleCollapse} />

	{#if !isCollapsed}
		<div class="divide-y divide-gray-200">
			{#each monthGroup.events as event, eventIndex}
				{@const eventId = getEventId(eventIndex)}
				{@const expanded = isEventExpanded(eventId)}
				<EventCard
					{event}
					isExpanded={expanded}
					onToggleExpand={() => onToggleEventExpand(eventId)}
				/>
			{/each}
		</div>
	{/if}
</div>
