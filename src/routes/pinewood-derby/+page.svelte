<script>
    import pinewood_derby from "/src/lib/assets/activities/pinewood_derby.webp";
    import pwdRules2026 from "/src/lib/assets/2026threeriversPWDrules.pdf";
    import derby_templates_1 from "/src/lib/assets/pinewood_derby_templates/derby_templates_1.pdf";
    import derby_templates_2 from "/src/lib/assets/pinewood_derby_templates/derby_templates_2.pdf";
    import derby_templates_3 from "/src/lib/assets/pinewood_derby_templates/derby_templates_3.pdf";
    import derby_templates_4 from "/src/lib/assets/pinewood_derby_templates/derby_templates_4.pdf";
    import derby_templates_5 from "/src/lib/assets/pinewood_derby_templates/derby_templates_5.pdf";
    import derby_templates_6 from "/src/lib/assets/pinewood_derby_templates/derby_templates_6.pdf";
    import derby_templates_7 from "/src/lib/assets/pinewood_derby_templates/derby_templates_7.pdf";
    import derby_templates_8 from "/src/lib/assets/pinewood_derby_templates/derby_templates_8.pdf";
    import pwdtemplate from "/src/lib/assets/pinewood_derby_templates/pwdtemplate.pdf";

    const templates = [
        { name: "Main PWD Template", file: pwdtemplate },
        { name: "Car Template 1", file: derby_templates_1 },
        { name: "Car Template 2", file: derby_templates_2 },
        { name: "Car Template 3", file: derby_templates_3 },
        { name: "Car Template 4", file: derby_templates_4 },
        { name: "Car Template 5", file: derby_templates_5 },
        { name: "Car Template 6", file: derby_templates_6 },
        { name: "Car Template 7", file: derby_templates_7 },
        { name: "Car Template 8", file: derby_templates_8 },
    ];
</script>

<svelte:head>
    <title>Pinewood Derby - Cub Scout Pack 118</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <!-- Page Header -->
    <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Pinewood Derby
        </h1>
        <p class="text-xl text-gray-600">Annual Racing Event</p>
    </div>

    <!-- Hero Image -->
    <div class="mb-12">
        <div class="rounded-lg h-96 overflow-hidden">
            <img
                src={pinewood_derby}
                alt="Pinewood Derby Cars"
                class="w-full h-full object-cover"
            />
        </div>
    </div>

    <!-- Event Info -->
    <div class="bg-blue-50 border-l-4 border-scout-blue p-6 rounded mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-3">Event Details</h2>
        <p class="text-gray-700 mb-2">
            The Pinewood Derby is one of our most exciting annual events! Scouts
            design, build, and race their own custom cars. Awards are given for
            fastest cars, best design, and even the slowest car!
        </p>
        <p class="text-gray-700">
            <strong>Location:</strong> 3329 Point Pleasant Rd, Elk Grove, CA 95757
        </p>
    </div>

    <!-- Rules Section -->
    <div class="bg-white border-2 border-gray-200 rounded-lg p-8 mb-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">
            Pinewood Derby Rules
        </h2>
        <p class="text-gray-600 mb-6">Three Rivers District Official Rules</p>

        <div class="prose prose-lg max-w-none">
            <ol class="space-y-4 text-gray-700">
                <li>
                    <strong>1.</strong> NO PRE-CUT CARS or cars from PREVIOUS years.
                </li>
                <li>
                    <strong>2.</strong> The car, including all decorations, must
                    conform to the following size and weight restrictions:
                    <ul class="mt-2 ml-4 space-y-1">
                        <li>
                            <strong>a.</strong> WIDTH – Not to exceed 2 ¾ inches,
                            inner wheel width a minimum of 1 ¾ inches.
                        </li>
                        <li>
                            <strong>b.</strong> HEIGHT – Ground to underside of car
                            must be a minimum of 3/8 inch. Overall car height cannot
                            exceed 6 inches.
                        </li>
                        <li>
                            <strong>c.</strong> LENGTH – Not to exceed 7 inches.
                        </li>
                        <li>
                            <strong>d.</strong> WEIGHT – Not to exceed 5 ounces and
                            no loose weights (recommend designing for 4.9 ounces as
                            environmental items such as humidity can affect weight
                            reading – the scale used at car inspection determines
                            final qualification for race).
                        </li>
                    </ul>
                </li>
                <li>
                    <strong>3.</strong> Axles, wheels and body provided in the Boy
                    Scouts of America kit are the only parts to be used. Wheels and
                    axles from other kit brands are not allowed.
                </li>
                <li>
                    <strong>4.</strong> Wheel bearings, washers and bushings are prohibited.
                </li>
                <li>
                    <strong>5.</strong> Wheels may be sanded until the mold seam is
                    removed. Wheels are not to be turned on a lathe, completely smoothed
                    or modified. Some of the original surface must still be visible.
                </li>
                <li>
                    <strong>6.</strong> NO lubricating oil may be used. Axles may
                    only be lubricated with dry powdered graphite or Teflon lubricant.
                    No lubricants are allowed in the building. All lubricants must
                    be applied prior to race time.
                </li>
                <li>
                    <strong>7.</strong> NO enclosing or packing wheels. NO hub caps.
                </li>
                <li>
                    <strong>8.</strong> NO changing of the axles slot position. The
                    pre-cut axle slot on the block of wood must be used. If the axle
                    slot is not a true 90-degree to the length of the car, adjustment
                    may be made by filling the slot and re-sawing at the same location.
                </li>
                <li>
                    <strong>9.</strong> Axles must be attached directly to the car
                    body in the axle slot. The car may not ride on any kind of spring(s).
                </li>
                <li>
                    <strong>10.</strong> The car must be freewheeling, with no starting
                    devices. No assisted starts of any kind are allowed.
                </li>
                <li>
                    <strong>11.</strong> NO loose materials of any kind are allowed
                    on the car.
                </li>
                <li>
                    <strong>12.</strong> All cars must pass an inspection to qualify
                    for the race. Failure to follow the above rules will result in
                    disqualification. All racers must be pre-registered AND cars must
                    pass inspection on race day.
                </li>
                <li>
                    <strong>13.</strong> Cars that jump the track will be given a
                    restart. Cars that jump the track a second time immediately after
                    the restart will be disqualified if, in the opinion of the race
                    steward, the car will continue to jump the track or poses a danger
                    to the other cars on the track.
                </li>
                <li>
                    <strong>14.</strong> The race steward, in the case of a breakdown,
                    will do minor repairs.
                </li>
            </ol>
        </div>

        <div class="mt-6 pt-6 border-t border-gray-200">
            <a
                href={pwdRules2026}
                download
                class="inline-flex items-center gap-2 bg-scout-blue text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
                <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                </svg>
                Download Official Rules (PDF)
            </a>
        </div>
    </div>

    <!-- Tips Section -->
    <div class="mt-12 grid md:grid-cols-2 gap-8">
        <div class="bg-scout-blue text-white rounded-lg p-8">
            <h3 class="text-2xl font-bold mb-4">Building Tips</h3>
            <ul class="space-y-3">
                <li class="flex items-start">
                    <span class="mr-2">•</span>
                    <span>Weight matters! Aim for the maximum 5.0 ounces.</span>
                </li>
                <li class="flex items-start">
                    <span class="mr-2">•</span>
                    <span>Polish your axles for less friction.</span>
                </li>
                <li class="flex items-start">
                    <span class="mr-2">•</span>
                    <span>Use graphite lubricant on wheels.</span>
                </li>
                <li class="flex items-start">
                    <span class="mr-2">•</span>
                    <span>Make sure all four wheels touch the track.</span>
                </li>
            </ul>
        </div>

        <div class="bg-gray-700 text-white rounded-lg p-8">
            <h3 class="text-2xl font-bold mb-4">Design Ideas</h3>
            <ul class="space-y-3">
                <li class="flex items-start">
                    <span class="mr-2">•</span>
                    <span
                        >Race cars, rockets, animals, or anything you imagine!</span
                    >
                </li>
                <li class="flex items-start">
                    <span class="mr-2">•</span>
                    <span>Paint and decorate to make it unique.</span>
                </li>
                <li class="flex items-start">
                    <span class="mr-2">•</span>
                    <span>Aerodynamic designs can help with speed.</span>
                </li>
                <li class="flex items-start">
                    <span class="mr-2">•</span>
                    <span>Have fun and be creative!</span>
                </li>
            </ul>
        </div>
    </div>

    <!-- Templates Section -->
    <div class="bg-white border-2 border-gray-200 rounded-lg p-8 mt-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">
            Car Design Templates
        </h2>
        <p class="text-gray-600 mb-6">
            Click on any template to download the PDF.
        </p>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {#each templates as template}
                <a
                    href={template.file}
                    download
                    class="block border-2 border-gray-200 rounded-lg hover:border-scout-blue transition-all group overflow-hidden"
                >
                    <div
                        class="bg-gray-100 aspect-[8.5/11] flex items-center justify-center"
                    >
                        <embed
                            src={template.file}
                            type="application/pdf"
                            class="w-full h-full pointer-events-none"
                        />
                    </div>
                    <div
                        class="p-3 bg-white group-hover:bg-blue-50 flex items-center justify-between"
                    >
                        <span class="font-medium text-gray-900 text-sm"
                            >{template.name}</span
                        >
                        <svg
                            class="w-4 h-4 text-gray-400 group-hover:text-scout-blue flex-shrink-0 ml-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                        </svg>
                    </div>
                </a>
            {/each}
        </div>
    </div>

    <!-- Contact -->
    <div class="mt-12 text-center bg-gray-50 rounded-lg p-8">
        <h3 class="text-2xl font-bold text-gray-900 mb-4">Questions?</h3>
        <p class="text-gray-700 mb-4">
            Contact us if you have questions about the Pinewood Derby rules or
            event details.
        </p>
        <a
            href="mailto:ElkGrovePack118@gmail.com"
            class="inline-block bg-scout-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
            Contact Pack 118
        </a>
    </div>
</div>
