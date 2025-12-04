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
    <Navigation />
    <main class="grow">
        {@render children()}
    </main>
    <Footer />
</div>
