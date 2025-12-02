<svelte:head>
    <title>Calendar - Cub Scout Pack 118</title>
</svelte:head>

<div class="w-full px-4 sm:px-6 lg:px-8 py-16">
    <!-- Page Header -->
    <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Calendar
        </h1>
        <p class="text-xl text-gray-600">Discover Events & Join Today</p>
    </div>

    <!-- Calendar Section -->
    <div class="max-w-5xl mx-auto">
        <!-- Meeting Schedule -->
        <div class="bg-blue-50 border-l-4 border-scout-blue p-6 rounded mb-8">
            <h3 class="text-xl font-bold text-gray-900 mb-3">
                Regular Pack Meetings
            </h3>
            <p class="text-gray-700 mb-2">
                <strong>When:</strong> 2nd Tuesday of each month, 6:15pm - 7:30pm
            </p>
            <p class="text-gray-700 mb-2">
                <strong>Where:</strong> United Methodist Church
            </p>
            <p class="text-gray-700">
                3329 Point Pleasant Rd, Elk Grove, CA 95757
            </p>
            <a
                href="https://maps.google.com/?q=3329+Point+Pleasant+Rd+Elk+Grove+CA+95757"
                class="text-scout-blue hover:underline mt-2 inline-block font-semibold"
                target="_blank"
                rel="noopener noreferrer"
            >
                View on Map →
            </a>
        </div>

        <!-- Calendar Embed -->
        <div
            class="bg-white border-2 border-gray-200 rounded-lg overflow-hidden shadow-lg"
        >
            <div class="aspect-4/3 w-full">
                <iframe
                    src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FLos_Angeles&showPrint=0&src=ZWxrZ3JvdmVwYWNrMTE4QGdtYWlsLmNvbQ&src=MDhiNWNjZmY4OTk4ZGU2YTk1MTMwNDA4Y2JmNWViMGZhNmEyOGE3NTAxZmI3MTBhYWJkMjVkMTA5ZTJhY2VmZEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=ZW4udXNhI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&src=bGQyYzcwZTIwa290NXBhbG5pMnNrZDYxYmpscjcxczZAaW1wb3J0LmNhbGVuZGFyLmdvb2dsZS5jb20&color=%23039be5&color=%23f09300&color=%230b8043&color=%23f6bf26"
                    class="w-full h-full border border-gray-300"
                    frameborder="0"
                    scrolling="no"
                    title="Pack 118 Calendar"
                ></iframe>
            </div>
        </div>
    </div>
</div>
