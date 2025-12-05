<script lang="ts">
    interface Event {
        title: string;
        date: string;
        time?: string;
        location?: string;
        description?: string;
    }

    let {
        event,
        isExpanded,
        onToggleExpand,
    }: { event: Event; isExpanded: boolean; onToggleExpand: () => void } =
        $props();

    const CHARACTER_LIMIT = 200;

    function needsTruncation(text: string | undefined): boolean {
        return text ? text.length > CHARACTER_LIMIT : false;
    }

    function getTruncatedText(text: string): string {
        return text.substring(0, CHARACTER_LIMIT) + "...";
    }

    const descriptionNeedsTruncation = needsTruncation(event.description);
</script>

<div class="p-6 hover:bg-gray-50 transition-colors">
    <!-- Event Title -->
    <h3 class="text-xl font-bold text-gray-900 mb-3">{event.title}</h3>

    <!-- Event Details -->
    <div class="space-y-2">
        <!-- Date and Time -->
        <div class="flex items-start">
            <svg
                class="w-5 h-5 text-scout-blue mr-3 mt-0.5 shrink-0"
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
                <p class="text-gray-900 font-semibold">{event.date}</p>
                {#if event.time}
                    <p class="text-gray-600">{event.time}</p>
                {/if}
            </div>
        </div>

        <!-- Location -->
        {#if event.location}
            <div class="flex items-start">
                <svg
                    class="w-5 h-5 text-scout-blue mr-3 mt-0.5 shrink-0"
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
                <p class="text-gray-700">{event.location}</p>
            </div>
        {/if}

        <!-- Description -->
        {#if event.description}
            <div class="flex items-start mt-3">
                <svg
                    class="w-5 h-5 text-scout-blue mr-3 mt-0.5 shrink-0"
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
                    <p class="text-gray-700 whitespace-pre-line">
                        {#if descriptionNeedsTruncation && !isExpanded}
                            {getTruncatedText(event.description)}
                        {:else}
                            {event.description}
                        {/if}
                    </p>
                    {#if descriptionNeedsTruncation}
                        <button
                            onclick={onToggleExpand}
                            class="text-scout-blue hover:underline text-sm font-medium mt-2"
                        >
                            {isExpanded ? "Show less" : "Show more"}
                        </button>
                    {/if}
                </div>
            </div>
        {/if}
    </div>
</div>
