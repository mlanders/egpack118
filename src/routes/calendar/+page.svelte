<script lang="ts">
    import type { PageData } from "./$types";
    import ViewToggle from "$lib/components/calendar/ViewToggle.svelte";
    import EventModal from "$lib/components/calendar/EventModal.svelte";
    import MonthCalendarGrid from "$lib/components/calendar/MonthCalendarGrid.svelte";
    import MonthEventList from "$lib/components/calendar/MonthEventList.svelte";

    let { data }: { data: PageData } = $props();

    let viewMode = $state<"list" | "calendar">("list");
    let expandedEvents = $state<Record<string, boolean>>({});
    let collapsedMonths = $state<Record<string, boolean>>({});
    let selectedEvent = $state<{
        title: string;
        date: string;
        time?: string;
        location?: string;
        description?: string;
    } | null>(null);
    let showModal = $state(false);

    function toggleExpanded(eventId: string) {
        expandedEvents[eventId] = !expandedEvents[eventId];
    }

    function openModal(event: {
        title: string;
        date: string;
        time?: string;
        location?: string;
        description?: string;
    }) {
        selectedEvent = event;
        showModal = true;
    }

    function closeModal() {
        showModal = false;
        selectedEvent = null;
    }

    function toggleMonth(monthName: string) {
        collapsedMonths[monthName] = !collapsedMonths[monthName];
    }

    function isMonthCollapsed(monthName: string): boolean {
        return collapsedMonths[monthName] || false;
    }

    function setViewMode(mode: "list" | "calendar") {
        viewMode = mode;
    }
</script>

<svelte:head>
    <title>Calendar - Cub Scout Pack 118</title>
</svelte:head>

<div class="w-full px-4 sm:px-6 lg:px-8 py-16">
    <!-- Page Header -->
    <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Calendar
        </h1>
        <p class="text-xl text-gray-600">Discover Events & Join Today</p>
    </div>

    <!-- Calendar Section -->
    <div class="max-w-5xl mx-auto">
        <!-- Meeting Schedule -->
        <div class="bg-blue-50 border-l-4 border-scout-blue p-6 rounded mb-8">
            <h3 class="text-xl font-bold text-gray-900 mb-3">
                Regular Pack Meetings
            </h3>
            <p class="text-gray-700 mb-2">
                <strong>When:</strong> 2nd Tuesday of each month, 6:15pm - 7:30pm
            </p>
            <p class="text-gray-700 mb-2">
                <strong>Where:</strong> United Methodist Church
            </p>
            <p class="text-gray-700">
                3329 Point Pleasant Rd, Elk Grove, CA 95757
            </p>
            <a
                href="https://maps.google.com/?q=3329+Point+Pleasant+Rd+Elk+Grove+CA+95757"
                class="text-scout-blue hover:underline mt-2 inline-block font-semibold"
                target="_blank"
                rel="noopener noreferrer"
            >
                View on Map →
            </a>
        </div>

        <!-- View Toggle and Last Updated -->
        <div class="flex justify-between items-center mb-6">
            <ViewToggle {viewMode} onToggle={setViewMode} />

            {#if data.lastUpdated}
                <div class="text-sm text-gray-500">
                    Last updated: {data.lastUpdated}
                </div>
            {/if}
        </div>

        <!-- Calendar Grid View -->
        {#if viewMode === "calendar"}
            {#if data.calendarData.length > 0}
                <div class="space-y-8">
                    {#each data.calendarData as monthData}
                        <MonthCalendarGrid
                            {monthData}
                            isCollapsed={isMonthCollapsed(monthData.month)}
                            onToggleCollapse={() =>
                                toggleMonth(monthData.month)}
                            onEventClick={openModal}
                        />
                    {/each}
                </div>
            {:else}
                <div
                    class="bg-white border-2 border-gray-200 rounded-lg shadow-lg p-12 text-center text-gray-500"
                >
                    <p class="text-lg">
                        No upcoming events scheduled at this time.
                    </p>
                </div>
            {/if}
        {/if}

        <!-- List View -->
        {#if viewMode === "list"}
            {#if data.events.length > 0}
                <div class="space-y-8">
                    {#each data.events as monthGroup, monthIndex}
                        <MonthEventList
                            {monthGroup}
                            {monthIndex}
                            isCollapsed={isMonthCollapsed(monthGroup.month)}
                            {expandedEvents}
                            onToggleCollapse={() =>
                                toggleMonth(monthGroup.month)}
                            onToggleEventExpand={toggleExpanded}
                        />
                    {/each}
                </div>
            {:else}
                <div
                    class="bg-white border-2 border-gray-200 rounded-lg shadow-lg p-12 text-center text-gray-500"
                >
                    <p class="text-lg">
                        No upcoming events scheduled at this time.
                    </p>
                </div>
            {/if}
        {/if}
    </div>
</div>

<!-- Event Details Modal -->
<EventModal show={showModal} event={selectedEvent} onClose={closeModal} />
