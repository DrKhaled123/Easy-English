<script lang="ts">
	import { cn } from '$lib/utils';
	import { ChevronDown } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	export let options: { value: string; label: string }[] = [];
	export let value: string = '';
	export let placeholder: string = 'Select an option';
	let className: string = '';
	export { className as class };

	const dispatch = createEventDispatcher<{ change: string }>();

	function handleChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		value = target.value;
		dispatch('change', value);
	}
</script>

<div class={cn('relative', className)}>
	<select
		class={cn(
			'flex h-10 w-full appearance-none items-center justify-between rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
			!value && 'text-muted-foreground'
		)}
		{value}
		on:change={handleChange}
		{...$$restProps}
	>
		{#if placeholder}
			<option value="" disabled selected={!value}>{placeholder}</option>
		{/if}
		{#each options as option}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>
	<ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
</div>