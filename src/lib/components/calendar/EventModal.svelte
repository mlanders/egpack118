<script lang="ts">
    interface EventDetails {
        title: string;
        date: string;
        time?: string;
        location?: string;
        description?: string;
    }

    let {
        show,
        event,
        onClose,
    }: { show: boolean; event: EventDetails | null; onClose: () => void } =
        $props();

    let dialog = $state<HTMLDialogElement>();

    // Native modal: traps focus, closes on Escape, returns focus on close().
    function openModal(node: HTMLDialogElement) {
        node.showModal();
    }
</script>

{#if show && event}
    <!-- Clicks on the backdrop target the dialog itself; Escape is native. -->
    <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
    <dialog
        bind:this={dialog}
        use:openModal
        onclose={onClose}
        onclick={(e) => e.target === dialog && dialog?.close()}
        aria-labelledby="event-title"
        class="m-auto w-[calc(100%-2rem)] max-w-2xl max-h-[calc(100dvh-2rem)] rounded-lg p-0 shadow-xl backdrop:bg-black/50"
    >
            <div class="relative p-6">
                <!-- Close Button -->
                <button
                    aria-label="Close"
                    onclick={() => dialog?.close()}
                    class="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700"
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
                <h2
                    id="event-title"
                    class="text-2xl font-bold text-gray-900 mb-4 pr-8 break-words"
                >
                    {event.title}
                </h2>

                <!-- Event Details -->
                <div class="space-y-4">
                    <!-- Date and Time -->
                    <div class="flex items-start">
                        <svg
                            class="w-6 h-6 text-scout-blue mr-3 mt-0.5 shrink-0"
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
                                {event.date}
                            </p>
                            {#if event.time}
                                <p class="text-gray-600">{event.time}</p>
                            {/if}
                        </div>
                    </div>

                    <!-- Location -->
                    {#if event.location}
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
                                {event.location}
                            </p>
                        </div>
                    {/if}

                    <!-- Description -->
                    {#if event.description}
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
                                class="text-gray-700 whitespace-pre-line text-base flex-1 min-w-0 break-words"
                            >
                                {event.description}
                            </p>
                        </div>
                    {/if}
                </div>

                <!-- Close Button at Bottom -->
                <div class="mt-6 flex justify-end">
                    <button
                        onclick={() => dialog?.close()}
                        class="px-6 py-2 bg-scout-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
    </dialog>
{/if}
