<script lang="ts">
    import { page } from "$app/stores";
    import { onMount } from "svelte";

    let canGoBack = $state(false);

    onMount(() => {
        canGoBack = window.history.length > 1;
    });
</script>

<div class="flex flex-col items-center justify-center px-4 py-16 md:py-24">
    <div class="text-center max-w-2xl">
        <!-- Error Code -->
        <div class="mb-8">
            <h1 class="text-8xl md:text-9xl font-bold text-scout-blue mb-4">
                {$page.status}
            </h1>
            <div class="h-1 w-24 bg-scout-gold mx-auto"></div>
        </div>

        <!-- Error Message -->
        <h2 class="text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
            {#if $page.status === 404}
                Page Not Found
            {:else}
                Something Went Wrong
            {/if}
        </h2>

        <p class="text-lg text-gray-600 mb-8">
            {#if $page.status === 404}
                The page you're looking for doesn't exist or has been moved.
            {:else}
                We encountered an unexpected error. Please try again later.
            {/if}
        </p>

        <!-- Navigation Options -->
        <div class="flex flex-wrap gap-4 justify-center items-center">
            <a
                href="/"
                class="px-6 py-3 bg-scout-blue text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
            >
                Go to Homepage
            </a>
            {#if canGoBack}
                <button
                    onclick={() => window.history.back()}
                    class="px-6 py-3 border-2 border-scout-blue text-scout-blue rounded-lg hover:bg-scout-blue hover:text-white transition-all duration-200 font-medium ml-4"
                >
                    Go Back
                </button>
            {/if}
        </div>

        <!-- Scout-themed decoration -->
        {#if $page.status === 404}
            <div class="mt-12 text-6xl opacity-20">🏕️</div>
            <p class="mt-4 text-sm text-gray-500 italic">
                Looks like you've wandered off the trail!
            </p>
        {/if}
    </div>
</div>
