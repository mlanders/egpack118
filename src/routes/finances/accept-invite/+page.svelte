<script lang="ts">
  import { authClient } from "$lib/auth";
  import { goto } from "$app/navigation";
  import type { PageData } from "./$types";

  let { data } = $props<{ data: PageData }>();

  let name = $state("");
  let password = $state("");
  let confirmPassword = $state("");
  let errorMessage = $state("");
  let isLoading = $state(false);

  async function handleSignup() {
    if (password !== confirmPassword) {
      errorMessage = "Passwords do not match";
      return;
    }

    if (password.length < 8) {
      errorMessage = "Password must be at least 8 characters";
      return;
    }

    isLoading = true;
    errorMessage = "";

    try {
      // Create account with Better Auth
      const result = await authClient.signUp.email({
        email: data.invitation!.email,
        password,
        name,
      });

      if (result.error) {
        errorMessage = "Failed to create account";
        return;
      }

      // Mark invitation as used and update user role
      await fetch("/finances/api/invitations/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: data.invitation!.token }),
      });

      // Redirect to login
      await goto("/finances");
    } catch (err) {
      errorMessage = "Signup failed. Please try again.";
    } finally {
      isLoading = false;
    }
  }
</script>

<svelte:head>
  <title>Accept Invitation - Scout Finances</title>
</svelte:head>

{#if data.invitation}
  <div class="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 class="text-2xl font-semibold text-gray-900 mb-4">
          Create Your Account
        </h1>
        <p class="text-sm text-gray-600 mb-6">
          You've been invited to join as <span class="font-medium text-blue-600">{data.invitation.role}</span>
        </p>

        <form on:submit|preventDefault={handleSignup}>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={data.invitation.email}
              disabled
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50"
            />
          </div>

          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1.5">
              Name (optional)
            </label>
            <input
              type="text"
              id="name"
              bind:value={name}
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div class="mb-4">
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              id="password"
              bind:value={password}
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
              minlength="8"
            />
          </div>

          <div class="mb-4">
            <label for="confirm" class="block text-sm font-medium text-gray-700 mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm"
              bind:value={confirmPassword}
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {#if errorMessage}
            <div class="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {errorMessage}
            </div>
          {/if}

          <button
            type="submit"
            disabled={isLoading}
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  </div>
{:else}
  <div class="min-h-[80vh] flex items-center justify-center px-4">
    <div class="text-center">
      <h1 class="text-2xl font-semibold text-gray-900 mb-2">
        Invalid Invitation
      </h1>
      <p class="text-gray-600">
        This invitation link is invalid or has expired.
      </p>
    </div>
  </div>
{/if}
