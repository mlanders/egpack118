<script lang="ts">
    import "../app.css";
    import favicon from "/static/favicon/favicon.svg";
    import Navigation from "$lib/components/Navigation.svelte";
    import Footer from "$lib/components/Footer.svelte";

    let { children } = $props();
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen flex flex-col">
    <Navigation />
    <main class="flex-grow">
        {@render children()}
    </main>
    <Footer />
</div>
