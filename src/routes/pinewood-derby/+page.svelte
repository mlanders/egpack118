<script>
    import pinewood_derby from "/src/lib/assets/activities/pinewood_derby.webp";
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
    <div class="bg-white border-2 border-gray-200 rounded-lg p-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">
            Pinewood Derby Rules
        </h2>
        <p class="text-gray-600 mb-6">Three Rivers District Official Rules</p>

        <div class="prose prose-lg max-w-none">
            <ol class="space-y-4 text-gray-700">
                <li>
                    <strong>1.</strong> Only the axles, wheels and body provided in
                    the Boy Scouts of America kit are the only parts that can be used
                    to construct your car.
                </li>
                <li>
                    <strong>2.</strong> Width shall not exceed 2-3/4 inches.
                </li>
                <li>
                    <strong>3.</strong> Length shall not exceed 7 inches.
                </li>
                <li>
                    <strong>4.</strong> Weight shall not exceed 5.0 ounces. Weight
                    may be added but must be securely fastened to the car body.
                </li>
                <li>
                    <strong>5.</strong> The car must have 1-3/4 inches clearance between
                    the wheels.
                </li>
                <li>
                    <strong>6.</strong> The car must have 3/8 inch clearance underneath
                    the body so the car will clear the center guide strip on the track.
                </li>
                <li>
                    <strong>7.</strong> Wheel bearings, washers and bushings are prohibited.
                </li>
                <li>
                    <strong>8.</strong> The car shall not ride on any type of springs.
                </li>
                <li>
                    <strong>9.</strong> Only official Cub Scout Grand Prix Pinewood
                    Derby wheels and axles are permitted.
                </li>
                <li>
                    <strong>10.</strong> Details such as steering wheel and driver
                    are permissible as long as these details do not exceed the maximum
                    length, width and weight specifications.
                </li>
                <li>
                    <strong>11.</strong> The car must be freewheeling with no starting
                    devices.
                </li>
                <li>
                    <strong>12.</strong> Each car must pass inspection by the official
                    inspection committee before it will be allowed to compete. If
                    a car does not pass inspection, the owner will be informed of
                    the reason and will be given time to make adjustments.
                </li>
                <li>
                    <strong>13.</strong> Cars that are deemed unsafe will be disqualified.
                </li>
                <li>
                    <strong>14.</strong> Wheel treatment: wheels may be sanded and
                    polished. All four wheels must touch the track surface.
                </li>
                <li>
                    <strong>15.</strong> Axle treatment: axles may be polished. Graphite
                    or other dry lubricant may be used. No liquid lubricants are permitted.
                </li>
                <li>
                    <strong>16.</strong> The car shall be constructed solely by the
                    Cub Scout with minimal adult assistance for safety purposes.
                </li>
            </ol>
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
