<script lang="ts">
	import { cn } from '$lib/utils';
	import { fade, fly } from 'svelte/transition';
	import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-svelte';
	import Button from './Button.svelte';

	export let type: 'success' | 'error' | 'warning' | 'info' = 'info';
	export let message: string;
	export let duration: number = 5000;
	export let visible: boolean = true;

	const icons = {
		success: CheckCircle,
		error: AlertCircle,
		warning: AlertTriangle,
		info: Info
	};

	const styles = {
		success: 'bg-success text-success-foreground',
		error: 'bg-destructive text-destructive-foreground',
		warning: 'bg-warning text-warning-foreground',
		info: 'bg-info text-info-foreground'
	};

	let timeoutId: ReturnType<typeof setTimeout>;

	$: if (visible && duration > 0) {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			visible = false;
		}, duration);
	}

	function dismiss() {
		visible = false;
	}
</script>

{#if visible}
	<div
		class={cn(
			'pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-lg p-4 shadow-lg',
			styles[type]
		)}
		role="alert"
		in:fly={{ y: 50, duration: 200 }}
		out:fade={{ duration: 150 }}
	>
		<svelte:component this={icons[type]} class="h-5 w-5 flex-shrink-0" />
		<p class="flex-1 text-sm font-medium">{message}</p>
		<Button
			variant="ghost"
			size="icon"
			class="h-6 w-6 flex-shrink-0 hover:bg-white/20"
			on:click={dismiss}
		>
			<X class="h-4 w-4" />
			<span class="sr-only">Dismiss</span>
		</Button>
	</div>
{/if}