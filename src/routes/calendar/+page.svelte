<script lang="ts">
    import type { PageData } from "./$types";

    let { data }: { data: PageData } = $props();

    let viewMode: "list" | "calendar" = $state("list");
    let expandedEvents: Record<string, boolean> = $state({});
    let collapsedMonths: Record<string, boolean> = $state({});
    let selectedEvent = $state<{
        title: string;
        date: string;
        time?: string;
        location?: string;
        description?: string;
    } | null>(null);
    let showModal = $state(false);

    const CHARACTER_LIMIT = 200;

    function toggleExpanded(eventId: string) {
        expandedEvents[eventId] = !expandedEvents[eventId];
    }

    function isExpanded(eventId: string): boolean {
        return expandedEvents[eventId] || false;
    }

    function needsTruncation(text: string | undefined): boolean {
        return text ? text.length > CHARACTER_LIMIT : false;
    }

    function getTruncatedText(text: string): string {
        return text.substring(0, CHARACTER_LIMIT) + "...";
    }

    function getEventId(monthIndex: number, eventIndex: number): string {
        return `${monthIndex}-${eventIndex}`;
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

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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
            <!-- View Toggle -->
            <div
                class="inline-flex rounded-lg border border-gray-300 bg-white p-1"
            >
                <button
                    onclick={() => (viewMode = "list")}
                    class="px-4 py-2 rounded-md text-sm font-medium transition-colors {viewMode ===
                    'list'
                        ? 'bg-scout-blue text-white'
                        : 'text-gray-700 hover:bg-gray-100'}"
                >
                    <svg
                        class="w-5 h-5 inline-block mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
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
                    onclick={() => (viewMode = "calendar")}
                    class="px-4 py-2 rounded-md text-sm font-medium transition-colors {viewMode ===
                    'calendar'
                        ? 'bg-scout-blue text-white'
                        : 'text-gray-700 hover:bg-gray-100'}"
                >
                    <svg
                        class="w-5 h-5 inline-block mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
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

            <!-- Last Updated -->
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
                        <div
                            class="bg-white border-2 border-gray-200 rounded-lg shadow-lg overflow-hidden"
                        >
                            <!-- Month Header -->
                            <button
                                onclick={() => toggleMonth(monthData.month)}
                                class="bg-scout-blue text-white px-6 py-4 w-full flex items-center justify-between hover:bg-blue-700 transition-colors"
                            >
                                <h2 class="text-2xl font-bold">
                                    {monthData.month}
                                </h2>
                                <svg
                                    class="w-6 h-6 transition-transform {isMonthCollapsed(
                                        monthData.month,
                                    )
                                        ? ''
                                        : 'rotate-180'}"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>

                            <!-- Calendar Grid -->
                            {#if !isMonthCollapsed(monthData.month)}
                                <div class="p-4">
                                    <!-- Weekday Headers -->
                                    <div class="grid grid-cols-7 gap-2 mb-2">
                                        {#each weekDays as day}
                                            <div
                                                class="text-center font-semibold text-gray-700 text-sm py-2"
                                            >
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
                                                        : 'bg-gray-50'} {day
                                                        .events.length > 0
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
                                                        <div
                                                            class="mt-1 space-y-1"
                                                        >
                                                            {#each day.events as event}
                                                                <button
                                                                    onclick={() =>
                                                                        openModal(
                                                                            event,
                                                                        )}
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
                        <div
                            class="bg-white border-2 border-gray-200 rounded-lg shadow-lg overflow-hidden"
                        >
                            <!-- Month Header -->
                            <button
                                onclick={() => toggleMonth(monthGroup.month)}
                                class="bg-scout-blue text-white px-6 py-4 w-full flex items-center justify-between hover:bg-blue-700 transition-colors"
                            >
                                <h2 class="text-2xl font-bold">
                                    {monthGroup.month}
                                </h2>
                                <svg
                                    class="w-6 h-6 transition-transform {isMonthCollapsed(
                                        monthGroup.month,
                                    )
                                        ? ''
                                        : 'rotate-180'}"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>

                            <!-- Events for this month -->
                            {#if !isMonthCollapsed(monthGroup.month)}
                                <div class="divide-y divide-gray-200">
                                    {#each monthGroup.events as event, eventIndex}
                                        {@const eventId = getEventId(
                                            monthIndex,
                                            eventIndex,
                                        )}
                                        {@const expanded = isExpanded(eventId)}
                                        {@const descriptionNeedsTruncation =
                                            needsTruncation(event.description)}

                                        <div
                                            class="p-6 hover:bg-gray-50 transition-colors"
                                        >
                                            <!-- Event Title -->
                                            <h3
                                                class="text-xl font-bold text-gray-900 mb-3"
                                            >
                                                {event.title}
                                            </h3>

                                            <!-- Event Details -->
                                            <div class="space-y-2">
                                                <!-- Date and Time -->
                                                <div class="flex items-start">
                                                    <svg
                                                        class="w-5 h-5 text-scout-blue mr-3 mt-0.5 flex-shrink-0"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                    <div>
                                                        <p
                                                            class="text-gray-900 font-semibold"
                                                        >
                                                            {event.date}
                                                        </p>
                                                        {#if event.time}
                                                            <p
                                                                class="text-gray-600"
                                                            >
                                                                {event.time}
                                                            </p>
                                                        {/if}
                                                    </div>
                                                </div>

                                                <!-- Location -->
                                                {#if event.location}
                                                    <div
                                                        class="flex items-start"
                                                    >
                                                        <svg
                                                            class="w-5 h-5 text-scout-blue mr-3 mt-0.5 flex-shrink-0"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                                stroke-width="2"
                                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                            />
                                                            <path
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                                stroke-width="2"
                                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                            />
                                                        </svg>
                                                        <p
                                                            class="text-gray-700"
                                                        >
                                                            {event.location}
                                                        </p>
                                                    </div>
                                                {/if}

                                                <!-- Description -->
                                                {#if event.description}
                                                    <div
                                                        class="flex items-start mt-3"
                                                    >
                                                        <svg
                                                            class="w-5 h-5 text-scout-blue mr-3 mt-0.5 flex-shrink-0"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                                stroke-width="2"
                                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                            />
                                                        </svg>
                                                        <div class="flex-1">
                                                            <p
                                                                class="text-gray-700 whitespace-pre-line"
                                                            >
                                                                {#if descriptionNeedsTruncation && !expanded}
                                                                    {getTruncatedText(
                                                                        event.description,
                                                                    )}
                                                                {:else}
                                                                    {event.description}
                                                                {/if}
                                                            </p>
                                                            {#if descriptionNeedsTruncation}
                                                                <button
                                                                    onclick={() =>
                                                                        toggleExpanded(
                                                                            eventId,
                                                                        )}
                                                                    class="text-scout-blue hover:underline text-sm font-medium mt-2"
                                                                >
                                                                    {expanded
                                                                        ? "Show less"
                                                                        : "Show more"}
                                                                </button>
                                                            {/if}
                                                        </div>
                                                    </div>
                                                {/if}
                                            </div>
                                        </div>
                                    {/each}
                                </div>
                            {/if}
                        </div>
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
{#if showModal && selectedEvent}
    <div
        class="fixed inset-0 z-50 overflow-y-auto"
        onclick={closeModal}
        role="dialog"
        aria-modal="true"
    >
        <!-- Backdrop -->
        <div
            class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        ></div>

        <!-- Modal Content -->
        <div class="flex min-h-full items-center justify-center p-4">
            <div
                onclick={(e) => e.stopPropagation()}
                class="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 transform transition-all"
            >
                <!-- Close Button -->
                <button
                    onclick={closeModal}
                    class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <svg
                        class="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                <!-- Event Title -->
                <h2 class="text-2xl font-bold text-gray-900 mb-4 pr-8">
                    {selectedEvent.title}
                </h2>

                <!-- Event Details -->
                <div class="space-y-4">
                    <!-- Date and Time -->
                    <div class="flex items-start">
                        <svg
                            class="w-6 h-6 text-scout-blue mr-3 mt-0.5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <div>
                            <p class="text-gray-900 font-semibold text-lg">
                                {selectedEvent.date}
                            </p>
                            {#if selectedEvent.time}
                                <p class="text-gray-600">
                                    {selectedEvent.time}
                                </p>
                            {/if}
                        </div>
                    </div>

                    <!-- Location -->
                    {#if selectedEvent.location}
                        <div class="flex items-start">
                            <svg
                                class="w-6 h-6 text-scout-blue mr-3 mt-0.5 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                            <p class="text-gray-700 text-base">
                                {selectedEvent.location}
                            </p>
                        </div>
                    {/if}

                    <!-- Description -->
                    {#if selectedEvent.description}
                        <div class="flex items-start">
                            <svg
                                class="w-6 h-6 text-scout-blue mr-3 mt-0.5 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <p
                                class="text-gray-700 whitespace-pre-line text-base flex-1"
                            >
                                {selectedEvent.description}
                            </p>
                        </div>
                    {/if}
                </div>

                <!-- Close Button at Bottom -->
                <div class="mt-6 flex justify-end">
                    <button
                        onclick={closeModal}
                        class="px-6 py-2 bg-scout-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}
