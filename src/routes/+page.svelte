<script lang="ts">
    import { onMount } from "svelte";
    import scouts1 from "$lib/assets/scouts1.webp";
    import scouts2 from "$lib/assets/scouts2.webp";
    import cubmasterMikeAvatar from "$lib/assets/leaders/Cubmaster_Mike_Avatar.png";
    import lion from "$lib/assets/den_insignias/Lion-insignia-CSBC.jpg";
    import tiger from "$lib/assets/den_insignias/TIGER-color-insignia-CSBC.jpg";
    import wolf from "$lib/assets/den_insignias/Wolf rank-color-insignia-CSBC.jpg";
    import bear from "$lib/assets/den_insignias/CS_bear-insignia-CSBC.jpg";
    import webelos from "$lib/assets/den_insignias/Webelos Oval-color-insignia-CSBC.jpg";
    import arrow from "$lib/assets/den_insignias/Arrow of Light-insignia-CSBC.jpg";
    import LeaderCard from "$lib/components/leaders/LeaderCard.svelte";

    const dens = [
        { name: "Lion", grade: "Kindergarten", img: lion },
        { name: "Tiger", grade: "1st grade", img: tiger },
        { name: "Wolf", grade: "2nd grade", img: wolf },
        { name: "Bear", grade: "3rd grade", img: bear },
        { name: "Webelos", grade: "4th grade", img: webelos },
        { name: "Arrow of Light", grade: "5th grade", img: arrow },
    ];

    // Standing rule: 2nd Thursday, 6:15 PM Pacific. Computed on the client so it never goes stale.
    // shortcut: ignores one-off schedule changes; upgrade by reading the next "Pack Meeting" from the calendar.
    let nextMeeting = $state("2nd Thursday of every month, 6:15 PM");
    onMount(() => {
        const pacificNow = new Date(
            new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
        );
        const secondThursday = (year: number, month: number) => {
            const first = new Date(year, month, 1);
            return new Date(year, month, 1 + ((4 - first.getDay() + 7) % 7) + 7, 18, 15);
        };
        let d = secondThursday(pacificNow.getFullYear(), pacificNow.getMonth());
        if (d < pacificNow) d = secondThursday(pacificNow.getFullYear(), pacificNow.getMonth() + 1);
        nextMeeting = `${d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}, 6:15 PM`;
    });
</script>

<svelte:head>
    <title>Cub Scout Pack 118 - Elk Grove, CA</title>
    <meta
        name="description"
        content="Cub Scout Pack 118 in Elk Grove, CA welcomes boys and girls in kindergarten through 5th grade. Visit a pack meeting, no sign-up needed."
    />
</svelte:head>

<!-- Hero -->
<section class="relative bg-scout-blue text-white overflow-hidden">
    <img src={scouts1} alt="Cub Scouts working on a project together" class="absolute inset-0 w-full h-full object-cover" />
    <div class="absolute inset-0 bg-linear-to-t from-scout-blue via-scout-blue/80 to-scout-blue/30"></div>
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-12 md:pt-56 md:pb-16">
        <p class="font-semibold text-scout-gold mb-3">Cub Scout Pack 118 · Elk Grove, CA</p>
        <h1 class="display text-4xl sm:text-5xl md:text-6xl font-bold max-w-3xl text-balance">
            Kindergarten to 5th grade. Come to a meeting, no sign-up needed.
        </h1>
        <div class="mt-8 inline-block bg-scout-gold text-gray-900 rounded-lg px-5 py-4">
            <p class="text-sm font-semibold">Next pack meeting</p>
            <p class="display text-xl sm:text-2xl font-bold">{nextMeeting}</p>
            <p class="text-sm">United Methodist Church, 3329 Point Pleasant Rd</p>
        </div>
        <div class="mt-6 flex flex-wrap gap-3">
            <a href="https://maps.google.com/?q=3329+Point+Pleasant+Rd+Elk+Grove+CA+95757" target="_blank" rel="noopener noreferrer"
                class="bg-white text-scout-blue px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Get directions
            </a>
            <a href="/new-family-guide" class="border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                New family guide
            </a>
        </div>
        <p class="mt-4 text-sm">Come as you are. No uniform needed for your first visit.</p>
    </div>
</section>

<!-- What kids do -->
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="grid md:grid-cols-2 gap-12 items-center">
        <div>
            <h2 class="display text-3xl md:text-4xl font-bold text-gray-900 mb-4">One den for every grade</h2>
            <p class="text-lg text-gray-700 mb-6">
                Kids earn adventures, belt loops and ranks with friends their age, build a car for the
                <a href="/pinewood-derby" class="text-scout-blue underline">Pinewood Derby</a>, and learn to do their best together.
                Cub Scouts welcomes boys and girls.
            </p>
            <ul class="grid grid-cols-3 gap-4">
                {#each dens as den}
                    <li class="text-center">
                        <img src={den.img} alt="{den.name} insignia" class="mx-auto h-20 w-20 object-contain" loading="lazy" />
                        <p class="mt-2 font-semibold text-gray-900 text-sm">{den.name}</p>
                        <p class="text-sm text-gray-600">{den.grade}</p>
                    </li>
                {/each}
            </ul>
        </div>
        <img src={scouts2} alt="Cub Scouts at a pack meeting activity" class="rounded-lg w-full aspect-4/3 object-cover" loading="lazy" />
    </div>
</section>

<!-- How joining works -->
<section class="bg-gray-50 py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="display text-3xl md:text-4xl font-bold text-gray-900 mb-8">How joining works</h2>
        <ol class="grid md:grid-cols-3 gap-8">
            <li>
                <h3 class="display text-xl font-bold text-scout-blue mb-2">1. Visit a meeting</h3>
                <p class="text-gray-700">Bring your child to any pack meeting, the 2nd Thursday of each month, 6:15–7:30 PM. Meet the leaders and see what a night looks like.</p>
            </li>
            <li>
                <h3 class="display text-xl font-bold text-scout-blue mb-2">2. Register</h3>
                <p class="text-gray-700">Your child is placed in a den by grade. The <a href="/new-family-guide" class="text-scout-blue underline">new family guide</a> walks through registration and uniforms.</p>
            </li>
            <li>
                <h3 class="display text-xl font-bold text-scout-blue mb-2">3. Join your den</h3>
                <p class="text-gray-700">Dens meet through the month, and the whole pack comes together for events and campouts.</p>
            </li>
        </ol>
        <p class="mt-8 text-gray-700 max-w-3xl">
            Scouting America (formerly Boy Scouts of America) has no curriculum for Transitional Kindergarten, so we suggest
            waiting until your child is in Kindergarten <em>and</em> at least 5 years old.
        </p>
    </div>
</section>

<!-- Costs -->
<section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <h2 class="display text-3xl md:text-4xl font-bold text-gray-900 mb-2">What it costs</h2>
    <p class="text-gray-700 mb-8">Paid once per scouting year (2025-26). Total: <strong>$265</strong>.</p>
    <dl class="grid md:grid-cols-2 gap-8">
        <div>
            <dt class="display text-2xl font-bold text-scout-blue">$165 registration</dt>
            <dd class="mt-2 text-gray-700">National Scouting America youth registration and the Golden Empire Council fee.</dd>
        </div>
        <div>
            <dt class="display text-2xl font-bold text-scout-blue">$100 pack fee</dt>
            <dd class="mt-2 text-gray-700">Paid to Pack 118. Covers rank badges, adventure belt loops, awards, the Pinewood Derby, den and pack supplies, and celebrations like the Blue and Gold Banquet.</dd>
        </div>
    </dl>
    <p class="mt-8 text-gray-700">
        Pack 118 is financially independent and depends on these fees and a couple of fundraisers to pay for extra activities.
    </p>
</section>

<!-- Scout Oath -->
<section class="bg-scout-blue text-white py-16">
    <figure class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <blockquote class="display text-xl md:text-2xl leading-relaxed">
            On my honor I will do my best to do my duty to God and my country and to obey the Scout Law;
            to help other people at all times; to keep myself physically strong, mentally awake, and morally straight.
        </blockquote>
        <figcaption class="mt-4 font-semibold text-scout-gold">The Scout Oath</figcaption>
    </figure>
</section>

<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4 display">
            Leaders
        </h2>
        <p class="text-xl text-gray-700">Meet our Pack 118 leadership team.</p>
    </div>
    <div class="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-3 sm:gap-4">
            <LeaderCard
                name="Mike L."
                position="Cubmaster"
                avatar={cubmasterMikeAvatar}
                alt="Cubmaster Mike L"
            />
            <LeaderCard
                name="Daniel A."
                position="Committee Chair"
                alt="Committee Chair Daniel A."
            />
            <LeaderCard
                name="This could be you!"
                position="Treasurer"
                alt="Treasurer position open"
            />
            <LeaderCard
                name="Stephanie L."
                position="Den Leader"
                alt="Den Leader Stephanie L."
            />
            <LeaderCard
                name="Rob R."
                position="Den Leader"
                alt="Den Leader Rob R."
            />
            <LeaderCard
                name="Liliana G."
                position="Den Leader"
                alt="Den Leader Liliana G."
            />
            <LeaderCard
                name="Ryan W."
                position="Den Leader"
                alt="Den Leader Ryan W."
            />
    </div>
</section>

<!-- Contact -->
<section class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
    <h2 class="display text-3xl md:text-4xl font-bold text-gray-900 mb-4">Questions? Email us.</h2>
    <a href="mailto:ElkGrovePack118@gmail.com" class="text-scout-blue underline text-xl">ElkGrovePack118@gmail.com</a>
    <p class="mt-4 text-gray-700">3329 Point Pleasant Rd, Elk Grove, CA 95757</p>
</section>
