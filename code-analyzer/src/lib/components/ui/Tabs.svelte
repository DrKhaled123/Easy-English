<script lang="ts">
	import { cn } from '$lib/utils';
	import { createEventDispatcher } from 'svelte';

	export let tabs: { id: string; label: string; count?: number }[] = [];
	export let activeTab: string = tabs[0]?.id ?? '';
	let className: string = '';
	export { className as class };

	const dispatch = createEventDispatcher<{ change: string }>();

	function selectTab(id: string) {
		activeTab = id;
		dispatch('change', id);
	}
</script>

<div class={cn('w-full', className)}>
	<div class="flex border-b border-border">
		{#each tabs as tab}
			<button
				type="button"
				class={cn(
					'relative px-4 py-2 text-sm font-medium transition-colors',
					'hover:text-foreground',
					activeTab === tab.id
						? 'text-foreground'
						: 'text-muted-foreground'
				)}
				on:click={() => selectTab(tab.id)}
			>
				<span class="flex items-center gap-2">
					{tab.label}
					{#if tab.count !== undefined}
						<span
							class={cn(
								'inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium',
								activeTab === tab.id
									? 'bg-primary text-primary-foreground'
									: 'bg-muted text-muted-foreground'
							)}
						>
							{tab.count}
						</span>
					{/if}
				</span>
				{#if activeTab === tab.id}
					<span class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></span>
				{/if}
			</button>
		{/each}
	</div>
	<div class="mt-4">
		<slot {activeTab} />
	</div>
</div>