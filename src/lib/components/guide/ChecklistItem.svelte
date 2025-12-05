<script>
    export let type = "check"; // check or circle
</script>

<li class="flex items-start">
    {#if type === "circle"}
        <svg
            class="w-6 h-6 text-scout-blue mr-2 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
        </svg>
    {:else}
        <svg
            class="w-6 h-6 text-scout-blue mr-2 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
            />
        </svg>
    {/if}
    <span><slot /></span>
</li>
