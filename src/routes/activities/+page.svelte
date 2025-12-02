<svelte:head>
    <title>Activities - Cub Scout Pack 118</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <!-- Page Header -->
    <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Activities
        </h1>
        <p class="text-xl text-gray-600">What We Do Together</p>
    </div>

    <!-- Activities Grid -->
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Pack Meetings -->
        <div
            class="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
        >
            <div class="h-48 overflow-hidden">
                <img
                    src="/src/lib/assets/activities/pack_meetings.webp"
                    alt="Pack Meeting"
                    class="w-full h-full object-cover"
                />
            </div>
            <div class="p-6">
                <h3 class="text-2xl font-bold text-scout-blue mb-3">
                    Pack Meetings
                </h3>
                <p class="text-gray-700">
                    Usually held at 6:30 p.m. on the 2nd Tuesday of each month.
                    Pack meetings bring all dens together for fun activities,
                    ceremonies, and awards.
                </p>
            </div>
        </div>

        <!-- Pinewood Derby -->
        <div
            class="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
        >
            <div class="h-48 overflow-hidden">
                <img
                    src="/src/lib/assets/activities/pinewood_derby.webp"
                    alt="Pinewood Derby"
                    class="w-full h-full object-cover"
                />
            </div>
            <div class="p-6">
                <h3 class="text-2xl font-bold text-scout-blue mb-3">
                    Pinewood Derby
                </h3>
                <p class="text-gray-700 mb-4">
                    Annual racing event with awards for speed, design, and
                    slowest car. Scouts build and race their own custom cars.
                </p>
                <a
                    href="/pinewood-derby"
                    class="text-scout-blue hover:underline font-semibold"
                >
                    Learn more →
                </a>
            </div>
        </div>

        <!-- Den Meetings -->
        <div
            class="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
        >
            <div class="h-48 overflow-hidden">
                <img
                    src="/src/lib/assets/activities/den_meetings.webp"
                    alt="Den Meeting"
                    class="w-full h-full object-cover"
                />
            </div>
            <div class="p-6">
                <h3 class="text-2xl font-bold text-scout-blue mb-3">
                    Den Meetings
                </h3>
                <p class="text-gray-700">
                    Monthly gatherings of small groups by grade level, covering
                    advancement requirements, crafts, games, and outdoor skills.
                </p>
            </div>
        </div>

        <!-- Blue & Gold Banquet -->
        <div
            class="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
        >
            <div class="h-48 overflow-hidden">
                <img
                    src="/src/lib/assets/activities/blue_and_gold_banquet.webp"
                    alt="Blue & Gold Banquet"
                    class="w-full h-full object-cover"
                />
            </div>
            <div class="p-6">
                <h3 class="text-2xl font-bold text-scout-blue mb-3">
                    Blue & Gold Banquet
                </h3>
                <p class="text-gray-700">
                    Spring celebration featuring dinner and trophy distribution.
                    This annual event honors scouts' achievements and celebrates
                    the pack's birthday.
                </p>
            </div>
        </div>

        <!-- Service Projects -->
        <div
            class="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
        >
            <div class="h-48 overflow-hidden">
                <img
                    src="/src/lib/assets/activities/service_projects.webp"
                    alt="Service Projects"
                    class="w-full h-full object-cover"
                />
            </div>
            <div class="p-6">
                <h3 class="text-2xl font-bold text-scout-blue mb-3">
                    Service Projects
                </h3>
                <p class="text-gray-700">
                    Community initiatives including food bank support and
                    cleanups. Scouts learn the importance of giving back to
                    their community.
                </p>
            </div>
        </div>

        <!-- Camping & Nature Hikes -->
        <div
            class="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
        >
            <div class="h-48 overflow-hidden">
                <img
                    src="/src/lib/assets/activities/camping.webp"
                    alt="Camping & Nature Hikes"
                    class="w-full h-full object-cover"
                />
            </div>
            <div class="p-6">
                <h3 class="text-2xl font-bold text-scout-blue mb-3">
                    Camping & Nature Hikes
                </h3>
                <p class="text-gray-700">
                    Overnight trips and regional hiking adventures. Scouts
                    experience the outdoors, learn camping skills, and build
                    friendships.
                </p>
            </div>
        </div>
    </div>

    <!-- Call to Action -->
    <div
        class="mt-16 bg-gradient-to-r from-scout-blue to-blue-600 text-white rounded-lg p-8 text-center"
    >
        <h2 class="text-3xl font-bold mb-4">Ready to Join the Adventure?</h2>
        <p class="text-xl mb-6">
            Come visit us at our next pack meeting and see what makes Pack 118
            special!
        </p>
        <a
            href="mailto:ElkGrovePack118@gmail.com"
            class="inline-block bg-white text-scout-blue px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
            Contact Us
        </a>
    </div>
</div>
