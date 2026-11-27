<script lang="ts">
    import "../app.css";
    import Navigation from "$lib/components/Navigation.svelte";
    import Footer from "$lib/components/Footer.svelte";

    let { children } = $props();
</script>

<svelte:head>
    <link rel="icon" href="/favicon/favicon.svg" />
</svelte:head>

<div class="min-h-screen flex flex-col">
    <a
        href="#main"
        class="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[60] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg"
    >
        Skip to main content
    </a>
    <Navigation />
    <main id="main" tabindex="-1" class="grow scroll-mt-20 focus:outline-none">
        {@render children()}
    </main>
    <Footer />
</div>
