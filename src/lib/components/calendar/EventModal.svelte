<script lang="ts">
	interface EventDetails {
		title: string;
		date: string;
		time?: string;
		location?: string;
		description?: string;
	}

	let { show, event, onClose }: { show: boolean; event: EventDetails | null; onClose: () => void } =
		$props();
</script>

{#if show && event}
	<div
		class="fixed inset-0 z-50 overflow-y-auto"
		onclick={onClose}
		role="dialog"
		aria-modal="true"
	>
		<!-- Backdrop -->
		<div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

		<!-- Modal Content -->
		<div class="flex min-h-full items-center justify-center p-4">
			<div
				onclick={(e) => e.stopPropagation()}
				class="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 transform transition-all"
			>
				<!-- Close Button -->
				<button onclick={onClose} class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>

				<!-- Event Title -->
				<h2 class="text-2xl font-bold text-gray-900 mb-4 pr-8">
					{event.title}
				</h2>

				<!-- Event Details -->
				<div class="space-y-4">
					<!-- Date and Time -->
					<div class="flex items-start">
						<svg
							class="w-6 h-6 text-scout-blue mr-3 mt-0.5 flex-shrink-0"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
						<div>
							<p class="text-gray-900 font-semibold text-lg">{event.date}</p>
							{#if event.time}
								<p class="text-gray-600">{event.time}</p>
							{/if}
						</div>
					</div>

					<!-- Location -->
					{#if event.location}
						<div class="flex items-start">
							<svg
								class="w-6 h-6 text-scout-blue mr-3 mt-0.5 flex-shrink-0"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
							<p class="text-gray-700 text-base">{event.location}</p>
						</div>
					{/if}

					<!-- Description -->
					{#if event.description}
						<div class="flex items-start">
							<svg
								class="w-6 h-6 text-scout-blue mr-3 mt-0.5 flex-shrink-0"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<p class="text-gray-700 whitespace-pre-line text-base flex-1">
								{event.description}
							</p>
						</div>
					{/if}
				</div>

				<!-- Close Button at Bottom -->
				<div class="mt-6 flex justify-end">
					<button
						onclick={onClose}
						class="px-6 py-2 bg-scout-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
