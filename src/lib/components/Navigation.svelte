<script lang="ts">
    interface NavLink {
        href: string;
        label: string;
        external?: boolean;
    }

    interface NavSection {
        type: "link" | "dropdown";
        label: string;
        href?: string;
        items?: NavLink[];
    }

    // Navigation configuration - single source of truth
    const navigationConfig: NavSection[] = [
        { type: "link", label: "Home", href: "/" },
        { type: "link", label: "Calendar", href: "/calendar" },
        {
            type: "dropdown",
            label: "Activities",
            items: [
                { href: "/activities", label: "Activities Overview" },
                { href: "/pinewood-derby", label: "Pinewood Derby" },
            ],
        },
        {
            type: "dropdown",
            label: "For Families",
            items: [
                { href: "/new-family-guide", label: "New Family Guide" },
                { href: "/faq", label: "FAQ" },
            ],
        },
        {
            type: "dropdown",
            label: "Resources",
            items: [
                { href: "/become-a-leader", label: "Become a Leader" },
                {
                    href: "https://advancements.scouting.org/",
                    label: "Scouting Advancements",
                    external: true,
                },
                {
                    href: "https://gec-bsa.org/",
                    label: "Golden Empire Council",
                    external: true,
                },
            ],
        },
    ];

    // State management for dropdowns - track which dropdown is open
    let mobileMenuOpen = $state(false);
    let openDropdown = $state<string | null>(null);

    function toggleMobileMenu(): void {
        mobileMenuOpen = !mobileMenuOpen;
    }

    function closeMobileMenu(): void {
        mobileMenuOpen = false;
        openDropdown = null;
    }

    function toggleDropdown(label: string): void {
        openDropdown = openDropdown === label ? null : label;
    }

    function openDropdownMenu(label: string): void {
        openDropdown = label;
    }

    function closeDropdown(): void {
        openDropdown = null;
    }

    function isDropdownOpen(label: string): boolean {
        return openDropdown === label;
    }

    // External link icon SVG
    const externalLinkIcon = `<svg class="inline w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
    </svg>`;
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
                {#each navigationConfig as navItem}
                    {#if navItem.type === "link"}
                        <a
                            href={navItem.href}
                            class="px-4 py-2 text-scout-blue font-semibold hover:bg-scout-blue/10 hover:text-blue-700 rounded-lg transition-all transform hover:scale-105"
                        >
                            {navItem.label}
                        </a>
                    {:else if navItem.type === "dropdown"}
                        <div class="relative" onmouseleave={closeDropdown}>
                            <button
                                class="px-4 py-2 text-scout-blue font-semibold hover:bg-scout-blue/10 hover:text-blue-700 rounded-lg transition-all transform hover:scale-105 flex items-center gap-1"
                                onmouseenter={() =>
                                    openDropdownMenu(navItem.label)}
                                onclick={() => toggleDropdown(navItem.label)}
                            >
                                {navItem.label}
                                <svg
                                    class="w-4 h-4 transition-transform {isDropdownOpen(
                                        navItem.label,
                                    )
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

                            {#if isDropdownOpen(navItem.label)}
                                <div class="absolute right-0 mt-0 pt-2 w-64">
                                    <div
                                        class="bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                                    >
                                        {#each navItem.items ?? [] as item}
                                            <a
                                                href={item.href}
                                                target={item.external
                                                    ? "_blank"
                                                    : undefined}
                                                rel={item.external
                                                    ? "noopener noreferrer"
                                                    : undefined}
                                                class="block px-4 py-2 text-scout-blue font-semibold hover:bg-scout-blue/10 hover:text-blue-700 transition-all"
                                                onclick={closeDropdown}
                                            >
                                                {item.label}
                                                {#if item.external}
                                                    {@html externalLinkIcon}
                                                {/if}
                                            </a>
                                        {/each}
                                    </div>
                                </div>
                            {/if}
                        </div>
                    {/if}
                {/each}
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
                {#each navigationConfig as navItem}
                    {#if navItem.type === "link"}
                        <a
                            href={navItem.href}
                            class="block px-4 py-3 text-scout-blue font-semibold hover:bg-scout-blue/10 hover:text-blue-700 rounded-lg transition-all"
                            onclick={closeMobileMenu}
                        >
                            {navItem.label}
                        </a>
                    {:else if navItem.type === "dropdown"}
                        <div class="space-y-1">
                            <button
                                class="w-full text-left px-4 py-3 text-scout-blue font-semibold hover:bg-scout-blue/10 hover:text-blue-700 rounded-lg transition-all flex items-center justify-between"
                                onclick={() => toggleDropdown(navItem.label)}
                            >
                                {navItem.label}
                                <svg
                                    class="w-4 h-4 transition-transform {isDropdownOpen(
                                        navItem.label,
                                    )
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

                            {#if isDropdownOpen(navItem.label)}
                                <div class="pl-4 space-y-1">
                                    {#each navItem.items ?? [] as item}
                                        <a
                                            href={item.href}
                                            target={item.external
                                                ? "_blank"
                                                : undefined}
                                            rel={item.external
                                                ? "noopener noreferrer"
                                                : undefined}
                                            class="block px-4 py-2 text-scout-blue font-semibold hover:bg-scout-blue/10 hover:text-blue-700 rounded-lg transition-all"
                                            onclick={closeMobileMenu}
                                        >
                                            {item.label}
                                            {#if item.external}
                                                {@html externalLinkIcon}
                                            {/if}
                                        </a>
                                    {/each}
                                </div>
                            {/if}
                        </div>
                    {/if}
                {/each}
            </div>
        </div>
    {/if}
</nav>
