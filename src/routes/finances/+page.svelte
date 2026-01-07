<script lang="ts">
    import { enhance } from "$app/forms";
    import type { PageData, ActionData } from "./$types";
    import ScoutFinanceApp from "./ScoutFinanceApp.svelte";

    let { data, form } = $props<{ data: PageData; form: ActionData }>();

    let password = $state("");
    let showError = $state(false);

    $effect(() => {
        if (form?.incorrect) {
            showError = true;
            password = "";
        }
    });
</script>

<svelte:head>
    <title>Scout Finances - Eagle Pass Cub Scout Pack 118</title>
</svelte:head>

{#if data.authenticated}
    <ScoutFinanceApp />
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
                        Enter password to access financial tracker
                    </p>
                </div>

                <form method="POST" action="?/login" use:enhance>
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
                            name="password"
                            bind:value={password}
                            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            required
                            autocomplete="current-password"
                        />
                    </div>

                    {#if showError}
                        <div
                            class="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm"
                        >
                            Incorrect password. Please try again.
                        </div>
                    {/if}

                    <button
                        type="submit"
                        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                        Login
                    </button>
                </form>

                <div class="mt-4 text-center text-xs text-gray-500">
                    Session expires after 15 minutes
                </div>
            </div>
        </div>
    </div>
{/if}
