<script>
    export let title = "";
    export let variant = "default"; // default, highlight, border
</script>

{#if variant === "highlight"}
    <div class="bg-scout-blue text-white rounded-lg p-8">
        {#if title}
            <h2 class="text-3xl font-bold mb-4">{title}</h2>
        {/if}
        <slot />
    </div>
{:else if variant === "border"}
    <div class="bg-white border-2 border-gray-200 rounded-lg p-8">
        {#if title}
            <h3 class="text-xl font-bold text-scout-blue mb-4">{title}</h3>
        {/if}
        <slot />
    </div>
{:else}
    <div class="bg-white border-2 border-gray-200 rounded-lg p-6">
        {#if title}
            <h3 class="text-xl font-bold text-scout-blue mb-4">{title}</h3>
        {/if}
        <slot />
    </div>
{/if}
