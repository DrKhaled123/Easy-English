<script lang="ts">
	import { cn } from '$lib/utils';
	import { createEventDispatcher } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { X } from 'lucide-svelte';
	import Button from './Button.svelte';

	export let open: boolean = false;
	export let title: string = '';
	export let description: string = '';
	let className: string = '';
	export { className as class };

	const dispatch = createEventDispatcher<{ close: void }>();

	function close() {
		open = false;
		dispatch('close');
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			close();
		}
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			close();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-50 bg-black/80"
		transition:fade={{ duration: 150 }}
		on:click={handleBackdropClick}
		on:keydown={(e) => e.key === 'Escape' && close()}
		role="button"
		tabindex="-1"
		aria-label="Close modal"
	>
		<!-- Modal -->
		<div
			class={cn(
				'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg',
				className
			)}
			transition:scale={{ duration: 150, start: 0.95 }}
			role="dialog"
			aria-modal="true"
			aria-labelledby={title ? 'modal-title' : undefined}
			aria-describedby={description ? 'modal-description' : undefined}
		>
			<!-- Close button -->
			<Button
				variant="ghost"
				size="icon"
				class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
				on:click={close}
			>
				<X class="h-4 w-4" />
				<span class="sr-only">Close</span>
			</Button>

			<!-- Header -->
			{#if title || description}
				<div class="flex flex-col space-y-1.5 text-center sm:text-left">
					{#if title}
						<h2 id="modal-title" class="text-lg font-semibold leading-none tracking-tight">
							{title}
						</h2>
					{/if}
					{#if description}
						<p id="modal-description" class="text-sm text-muted-foreground">
							{description}
						</p>
					{/if}
				</div>
			{/if}

			<!-- Content -->
			<slot />

			<!-- Footer -->
			{#if $$slots.footer}
				<div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
					<slot name="footer" />
				</div>
			{/if}
		</div>
	</div>
{/if}