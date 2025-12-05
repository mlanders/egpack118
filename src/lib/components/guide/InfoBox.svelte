<script>
    export let title = "";
</script>

<div class="bg-blue-50 border-l-4 border-scout-blue p-4 mb-4">
    {#if title}
        <p class="font-semibold text-gray-900 mb-2">{title}</p>
    {/if}
    <slot />
</div>
