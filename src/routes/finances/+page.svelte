<script lang="ts">
    import { authClient } from "$lib/auth";
    import type { PageData } from "./$types";
    import ScoutFinanceApp from "./ScoutFinanceApp.svelte";

    let { data } = $props<{ data: PageData }>();

    let email = $state("");
    let password = $state("");
    let errorMessage = $state("");
    let isLoading = $state(false);

    async function handleLogin() {
        isLoading = true;
        errorMessage = "";

        try {
            const result = await authClient.signIn.email({
                email,
                password,
            });

            if (result.error) {
                errorMessage = "Invalid email or password";
            } else {
                // Success - SvelteKit will reload with session
                window.location.reload();
            }
        } catch (err) {
            errorMessage = "Login failed. Please try again.";
        } finally {
            isLoading = false;
        }
    }
</script>

<svelte:head>
    <title>Scout Finances - Eagle Pass Cub Scout Pack 118</title>
</svelte:head>

{#if data.user}
    <ScoutFinanceApp user={data.user} />
{:else}
    <div class="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50">
        <div class="w-full max-w-sm">
            <div
                class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
                <div class="mb-6">
                    <h1 class="text-2xl font-semibold text-gray-900 mb-1">
                        Scout Finances
                    </h1>
                    <p class="text-sm text-gray-600">
                        Sign in to access financial tracker
                    </p>
                </div>

                <form on:submit|preventDefault={handleLogin}>
                    <div class="mb-4">
                        <label
                            for="email"
                            class="block text-sm font-medium text-gray-700 mb-1.5"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            bind:value={email}
                            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            required
                            autocomplete="email"
                        />
                    </div>

                    <div class="mb-4">
                        <label
                            for="password"
                            class="block text-sm font-medium text-gray-700 mb-1.5"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            bind:value={password}
                            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            required
                            autocomplete="current-password"
                        />
                    </div>

                    {#if errorMessage}
                        <div
                            class="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm"
                        >
                            {errorMessage}
                        </div>
                    {/if}

                    <button
                        type="submit"
                        disabled={isLoading}
                        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <div class="mt-4 text-center text-xs text-gray-500">
                    Session expires after 7 days
                </div>
            </div>
        </div>
    </div>
{/if}
