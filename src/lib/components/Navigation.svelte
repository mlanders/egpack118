<script lang="ts">
    let mobileMenuOpen = $state(false);
    let resourcesDropdownOpen = $state(false);

    function toggleMobileMenu() {
        mobileMenuOpen = !mobileMenuOpen;
    }

    function closeMobileMenu() {
        mobileMenuOpen = false;
    }

    function toggleResourcesDropdown() {
        resourcesDropdownOpen = !resourcesDropdownOpen;
    }

    function openResourcesDropdown() {
        resourcesDropdownOpen = true;
    }

    function closeResourcesDropdown() {
        resourcesDropdownOpen = false;
    }
</script>

<nav class="bg-white shadow-lg sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
            <!-- Logo -->
            <div class="flex items-center">
                <a
                    href="/"
                    class="flex items-center group"
                    onclick={closeMobileMenu}
                >
                    <!-- Cub Scouts Logo -->
                    <div
                        class="relative w-16 h-16 flex items-center justify-center"
                    >
                        <img
                            src="/images/cub-scouts-logo.png"
                            alt="Cub Scouts Logo"
                            class="w-full h-full object-contain drop-shadow-lg group-hover:brightness-110 transition-all"
                        />
                    </div>
                    <div class="ml-3">
                        <div
                            class="text-2xl font-bold text-scout-blue drop-shadow-md group-hover:text-blue-700 transition-colors"
                        >
                            Cub Scout Pack 118
                        </div>
                        <div
                            class="text-sm text-scout-gold font-semibold tracking-wide"
                        >
                            Elk Grove, CA
                        </div>
                    </div>
                </a>
            </div>

            <!-- Desktop Navigation -->
            <div class="hidden md:flex space-x-2 items-center">
                <a
                    href="/"
                    class="px-4 py-2 text-scout-blue font-semibold hover:bg-scout-blue/10 hover:text-blue-700 rounded-lg transition-all transform hover:scale-105"
                    >Home</a
                >
                <a
                    href="/calendar"
                    class="px-4 py-2 text-scout-blue font-semibold hover:bg-scout-blue/10 hover:text-blue-700 rounded-lg transition-all transform hover:scale-105"
                    >Calendar</a
                >
                <a
                    href="/activities"
                    class="px-4 py-2 text-scout-blue font-semibold hover:bg-scout-blue/10 hover:text-blue-700 rounded-lg transition-all transform hover:scale-105"
                    >Activities</a
                >
                <a
                    href="/pinewood-derby"
                    class="px-4 py-2 text-scout-blue font-semibold hover:bg-scout-blue/10 hover:text-blue-700 rounded-lg transition-all transform hover:scale-105"
                    >Pinewood Derby</a
                >

                <!-- Resources Dropdown -->
                <div class="relative" onmouseleave={closeResourcesDropdown}>
                    <button
                        class="px-4 py-2 text-scout-blue font-semibold hover:bg-scout-blue/10 hover:text-blue-700 rounded-lg transition-all transform hover:scale-105 flex items-center gap-1"
                        onmouseenter={openResourcesDropdown}
                        onclick={toggleResourcesDropdown}
                    >
                        Resources
                        <svg
                            class="w-4 h-4 transition-transform {resourcesDropdownOpen
                                ? 'rotate-180'
                                : ''}"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>

                    {#if resourcesDropdownOpen}
                        <div
                            class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                        >
                            <a
                                href="/become-a-leader"
                                class="block px-4 py-2 text-scout-blue font-semibold hover:bg-scout-blue/10 hover:text-blue-700 transition-all"
                                onclick={closeResourcesDropdown}
                            >
                                Become a Leader
                            </a>
                            <a
                                href="https://advancements.scouting.org/"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="block px-4 py-2 text-scout-blue font-semibold hover:bg-scout-blue/10 hover:text-blue-700 transition-all"
                                onclick={closeResourcesDropdown}
                            >
                                Scouting Advancements
                                <svg
                                    class="inline w-3 h-3 ml-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                </svg>
                            </a>
                            <a
                                href="https://gec-bsa.org/"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="block px-4 py-2 text-scout-blue font-semibold hover:bg-scout-blue/10 hover:text-blue-700 transition-all"
                                onclick={closeResourcesDropdown}
                            >
                                Golden Empire Council
                                <svg
                                    class="inline w-3 h-3 ml-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                </svg>
                            </a>
                        </div>
                    {/if}
                </div>
            </div>

            <!-- Mobile Menu Button -->
            <button
                class="md:hidden text-scout-blue hover:text-blue-700 p-2 rounded-lg hover:bg-scout-blue/10 transition-all"
                onclick={toggleMobileMenu}
                aria-label="Toggle menu"
            >
                {#if mobileMenuOpen}
                    <svg
                        class="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                {:else}
                    <svg
                        class="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                {/if}
            </button>
        </div>
    </div>

    <!-- Mobile Menu -->
    {#if mobileMenuOpen}
        <div class="md:hidden border-t border-scout-blue/20 bg-white">
            <div class="px-2 pt-2 pb-3 space-y-1">
                <a
                    href="/"
                    class="block px-4 py-3 text-scout-blue font-semibold hover:bg-scout-blue/10 hover:text-blue-700 rounded-lg transition-all"
                    onclick={closeMobileMenu}>Home</a
                >
                <a
                    href="/calendar"
                    class="block px-4 py-3 text-scout-blue font-semibold hover:bg-scout-blue/10 hover:text-blue-700 rounded-lg transition-all"
                    onclick={closeMobileMenu}>Calendar</a
                >
                <a
                    href="/activities"
                    class="block px-4 py-3 text-scout-blue font-semibold hover:bg-scout-blue/10 hover:text-blue-700 rounded-lg transition-all"
                    onclick={closeMobileMenu}>Activities</a
                >
                <a
                    href="/pinewood-derby"
                    class="block px-4 py-3 text-scout-blue font-semibold hover:bg-scout-blue/10 hover:text-blue-700 rounded-lg transition-all"
                    onclick={closeMobileMenu}>Pinewood Derby</a
                >

                <!-- Resources Section (Mobile) -->
                <div class="space-y-1">
                    <button
                        class="w-full text-left px-4 py-3 text-scout-blue font-semibold hover:bg-scout-blue/10 hover:text-blue-700 rounded-lg transition-all flex items-center justify-between"
                        onclick={toggleResourcesDropdown}
                    >
                        Resources
                        <svg
                            class="w-4 h-4 transition-transform {resourcesDropdownOpen
                                ? 'rotate-180'
                                : ''}"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>

                    {#if resourcesDropdownOpen}
                        <div class="pl-4 space-y-1">
                            <a
                                href="/become-a-leader"
                                class="block px-4 py-2 text-scout-blue font-semibold hover:bg-scout-blue/10 hover:text-blue-700 rounded-lg transition-all"
                                onclick={closeMobileMenu}>Become a Leader</a
                            >
                            <a
                                href="https://advancements.scouting.org/"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="block px-4 py-2 text-scout-blue font-semibold hover:bg-scout-blue/10 hover:text-blue-700 rounded-lg transition-all"
                                onclick={closeMobileMenu}
                            >
                                Scouting Advancements
                                <svg
                                    class="inline w-3 h-3 ml-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                </svg>
                            </a>
                            <a
                                href="https://gec-bsa.org/"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="block px-4 py-2 text-scout-blue font-semibold hover:bg-scout-blue/10 hover:text-blue-700 rounded-lg transition-all"
                                onclick={closeMobileMenu}
                            >
                                Golden Empire Council
                                <svg
                                    class="inline w-3 h-3 ml-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                </svg>
                            </a>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    {/if}
</nav>
