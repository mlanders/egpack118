<script lang="ts">
    // SVG fallback for default avatar
    let { name, position, alt, avatar = undefined } = $props();
</script>

<div
    class="leader-card bg-white border-2 border-gray-200 rounded-lg p-6 flex flex-col items-center w-64"
    style="transition: box-shadow 0.2s;"
    role="group"
    onmouseover={(event) => {
        const target = event.currentTarget as HTMLElement | null;
        if (target) target.style.boxShadow = "0 4px 16px rgba(26,95,180,0.10)";
    }}
    onmouseout={(event) => {
        const target = event.currentTarget as HTMLElement | null;
        if (target) target.style.boxShadow = "";
    }}
    onfocus={(event) => {
        const target = event.currentTarget as HTMLElement | null;
        if (target) target.style.boxShadow = "0 4px 16px rgba(26,95,180,0.10)";
    }}
    onblur={(event) => {
        const target = event.currentTarget as HTMLElement | null;
        if (target) target.style.boxShadow = "";
    }}
>
    {#if avatar}
        <img
            src={avatar}
            alt={alt || `${name} avatar`}
            class="w-24 h-24 rounded-full object-cover mb-4 border-4 border-scout-blue shadow"
        />
    {:else}
        <span
            class="w-24 h-24 rounded-full mb-4 border-4 border-scout-blue shadow bg-gray-100 flex items-center justify-center overflow-hidden"
            aria-label={alt || `${name} avatar`}
        >
            <svg
                width="96"
                height="96"
                viewBox="0 0 96 96"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="w-full h-full"
            >
                <circle cx="48" cy="48" r="48" fill="#E5E7EB" />
                <circle cx="48" cy="40" r="20" fill="#A7C7E7" />
                <ellipse cx="48" cy="76" rx="28" ry="16" fill="#A7C7E7" />
            </svg>
        </span>
    {/if}

    <div class="text-lg font-bold text-gray-900">{name}</div>
    <div class="text-scout-blue font-semibold">{position}</div>
</div>
