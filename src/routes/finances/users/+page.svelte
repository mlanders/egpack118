<script lang="ts">
  import { onMount } from "svelte";
  import type { PageData } from "./$types";

  let { data } = $props<{ data: PageData }>();

  interface User {
    id: string;
    email: string;
    name: string | null;
    role: "ADMIN" | "TREASURER" | "USER";
    emailVerified: boolean;
    createdAt: string;
  }

  interface Invitation {
    id: string;
    email: string;
    role: "ADMIN" | "TREASURER" | "USER";
    token: string;
    expiresAt: string;
    invitedBy: string;
    used: boolean;
    createdAt: string;
  }

  let users = $state<User[]>([]);
  let invitations = $state<Invitation[]>([]);
  let isLoading = $state(true);
  let errorMessage = $state("");
  let successMessage = $state("");

  // Invitation form
  let showInviteModal = $state(false);
  let inviteEmail = $state("");
  let inviteRole = $state<"ADMIN" | "TREASURER" | "USER">("USER");
  let invitationUrl = $state("");

  // Password reset
  let showResetModal = $state(false);
  let resetUserId = $state("");
  let resetUserEmail = $state("");
  let newPassword = $state("");
  let confirmNewPassword = $state("");

  const isAdmin = data.user.role === "ADMIN";

  onMount(() => {
    loadUsers();
    loadInvitations();
  });

  async function loadUsers() {
    try {
      const response = await fetch("/finances/api/users");
      const result = await response.json();
      users = result.users;
    } catch (err) {
      errorMessage = "Failed to load users";
    } finally {
      isLoading = false;
    }
  }

  async function loadInvitations() {
    try {
      const response = await fetch("/finances/api/invitations");
      const result = await response.json();
      invitations = result.invitations;
    } catch (err) {
      console.error("Failed to load invitations", err);
    }
  }

  async function sendInvitation() {
    errorMessage = "";
    successMessage = "";

    try {
      const response = await fetch("/finances/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });

      if (!response.ok) {
        const error = await response.json();
        errorMessage = error.message || "Failed to send invitation";
        return;
      }

      const result = await response.json();
      invitationUrl = result.invitationUrl;
      successMessage = "Invitation created successfully!";

      // Reload invitations
      await loadInvitations();

      // Don't close modal immediately so user can copy the URL
    } catch (err) {
      errorMessage = "Failed to send invitation";
    }
  }

  function closeInviteModal() {
    showInviteModal = false;
    inviteEmail = "";
    inviteRole = "USER";
    invitationUrl = "";
    errorMessage = "";
    successMessage = "";
  }

  function openResetPassword(user: User) {
    resetUserId = user.id;
    resetUserEmail = user.email;
    newPassword = "";
    confirmNewPassword = "";
    errorMessage = "";
    successMessage = "";
    showResetModal = true;
  }

  async function resetPassword() {
    errorMessage = "";
    successMessage = "";

    if (newPassword !== confirmNewPassword) {
      errorMessage = "Passwords do not match";
      return;
    }

    if (newPassword.length < 8) {
      errorMessage = "Password must be at least 8 characters";
      return;
    }

    try {
      const response = await fetch("/finances/api/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: resetUserId, newPassword }),
      });

      if (!response.ok) {
        const error = await response.json();
        errorMessage = error.message || "Failed to reset password";
        return;
      }

      successMessage = "Password reset successfully!";
      setTimeout(() => {
        showResetModal = false;
      }, 1500);
    } catch (err) {
      errorMessage = "Failed to reset password";
    }
  }

  async function deleteUser(userId: string, email: string) {
    if (!confirm(`Are you sure you want to delete user ${email}?`)) {
      return;
    }

    try {
      const response = await fetch("/finances/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const error = await response.json();
        errorMessage = error.message || "Failed to delete user";
        return;
      }

      successMessage = "User deleted successfully";
      await loadUsers();
    } catch (err) {
      errorMessage = "Failed to delete user";
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    successMessage = "Copied to clipboard!";
    setTimeout(() => { successMessage = ""; }, 2000);
  }

  function getRoleBadgeClass(role: string) {
    if (role === "ADMIN") return "bg-red-100 text-red-800";
    if (role === "TREASURER") return "bg-blue-100 text-blue-800";
    return "bg-gray-100 text-gray-800";
  }
</script>

<svelte:head>
  <title>User Management - Scout Finances</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 p-6">
  <div class="max-w-6xl mx-auto">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">User Management</h1>
        <p class="text-sm text-gray-600 mt-1">Manage users and send invitations</p>
      </div>
      <div class="flex gap-3">
        <a
          href="/finances"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Back to Finances
        </a>
        <button
          onclick={() => (showInviteModal = true)}
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Invite User
        </button>
      </div>
    </div>

    {#if errorMessage}
      <div class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
        {errorMessage}
      </div>
    {/if}

    {#if successMessage}
      <div class="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
        {successMessage}
      </div>
    {/if}

    <!-- Users Table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div class="px-4 py-3 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Users</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            {#if isLoading}
              <tr>
                <td colspan="5" class="px-4 py-8 text-center text-sm text-gray-500">
                  Loading users...
                </td>
              </tr>
            {:else if users.length === 0}
              <tr>
                <td colspan="5" class="px-4 py-8 text-center text-sm text-gray-500">
                  No users found
                </td>
              </tr>
            {:else}
              {#each users as user}
                <tr class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm text-gray-900">{user.email}</td>
                  <td class="px-4 py-3 text-sm text-gray-600">{user.name || "-"}</td>
                  <td class="px-4 py-3">
                    <span class="px-2 py-1 text-xs font-medium rounded-full {getRoleBadgeClass(user.role)}">
                      {user.role}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td class="px-4 py-3 text-right text-sm">
                    {#if isAdmin}
                      <button
                        onclick={() => openResetPassword(user)}
                        class="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        Reset Password
                      </button>
                      {#if user.id !== data.user.id}
                        <button
                          onclick={() => deleteUser(user.id, user.email)}
                          class="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      {/if}
                    {/if}
                  </td>
                </tr>
              {/each}
            {/if}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pending Invitations -->
    {#if invitations.length > 0}
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="px-4 py-3 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Pending Invitations</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expires</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Invitation Link</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              {#each invitations as invitation}
                <tr class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm text-gray-900">{invitation.email}</td>
                  <td class="px-4 py-3">
                    <span class="px-2 py-1 text-xs font-medium rounded-full {getRoleBadgeClass(invitation.role)}">
                      {invitation.role}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-600">
                    {new Date(invitation.expiresAt).toLocaleDateString()}
                  </td>
                  <td class="px-4 py-3 text-right">
                    <button
                      onclick={() => copyToClipboard(`${window.location.origin}/finances/accept-invite?token=${invitation.token}`)}
                      class="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Copy Link
                    </button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    {/if}
  </div>
</div>

<!-- Invite Modal -->
{#if showInviteModal}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Invite User</h2>

      <form on:submit|preventDefault={sendInvitation}>
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            bind:value={inviteEmail}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div class="mb-4">
          <label for="role" class="block text-sm font-medium text-gray-700 mb-1.5">
            Role
          </label>
          <select
            id="role"
            bind:value={inviteRole}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="USER">User (Read-only)</option>
            <option value="TREASURER">Treasurer (Full Access)</option>
            {#if isAdmin}
              <option value="ADMIN">Admin (Full Access + User Management)</option>
            {/if}
          </select>
        </div>

        {#if invitationUrl}
          <div class="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p class="text-sm text-green-800 font-medium mb-2">Invitation created!</p>
            <div class="flex gap-2">
              <input
                type="text"
                value={invitationUrl}
                readonly
                class="flex-1 px-2 py-1 text-xs border border-green-300 rounded bg-white"
              />
              <button
                type="button"
                onclick={() => copyToClipboard(invitationUrl)}
                class="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
              >
                Copy
              </button>
            </div>
          </div>
        {/if}

        <div class="flex gap-3">
          <button
            type="button"
            onclick={closeInviteModal}
            class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {invitationUrl ? "Close" : "Cancel"}
          </button>
          {#if !invitationUrl}
            <button
              type="submit"
              class="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Send Invitation
            </button>
          {/if}
        </div>
      </form>
    </div>
  </div>
{/if}

<!-- Reset Password Modal -->
{#if showResetModal}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Reset Password</h2>
      <p class="text-sm text-gray-600 mb-4">Resetting password for: <strong>{resetUserEmail}</strong></p>

      <form on:submit|preventDefault={resetPassword}>
        <div class="mb-4">
          <label for="new-password" class="block text-sm font-medium text-gray-700 mb-1.5">
            New Password
          </label>
          <input
            type="password"
            id="new-password"
            bind:value={newPassword}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
            minlength="8"
          />
        </div>

        <div class="mb-4">
          <label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-1.5">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirm-password"
            bind:value={confirmNewPassword}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {#if errorMessage}
          <div class="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {errorMessage}
          </div>
        {/if}

        {#if successMessage}
          <div class="mb-4 p-2.5 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
            {successMessage}
          </div>
        {/if}

        <div class="flex gap-3">
          <button
            type="button"
            onclick={() => (showResetModal = false)}
            class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Reset Password
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
