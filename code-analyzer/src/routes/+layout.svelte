<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { settingsStore } from '$lib/stores';
	import { Code2, Github, Settings } from 'lucide-svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let mounted = false;

	onMount(() => {
		mounted = true;
		// Apply theme on mount
		updateTheme($settingsStore.theme);
	});

	function updateTheme(theme: 'light' | 'dark') {
		if (typeof document !== 'undefined') {
			if (theme === 'dark') {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		}
	}

	// Watch for theme changes
	$: if (mounted) {
		updateTheme($settingsStore.theme);
	}
</script>

<div class="flex min-h-screen flex-col">
	<!-- Header -->
	<header class="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
		<div class="container flex h-14 items-center justify-between px-4">
			<a href="/" class="flex items-center gap-2">
				<Code2 class="h-6 w-6 text-primary" />
				<span class="text-lg font-bold">Code Analyzer</span>
			</a>

			<nav class="flex items-center gap-2">
				<Button variant="ghost" size="sm" on:click={() => settingsStore.toggleTheme()}>
					{#if $settingsStore.theme === 'dark'}
						<span class="text-sm">☀️</span>
					{:else}
						<span class="text-sm">🌙</span>
					{/if}
				</Button>
				<a href="/settings">
					<Button variant="ghost" size="sm">
						<Settings class="h-4 w-4" />
						<span class="ml-2 hidden sm:inline">Settings</span>
					</Button>
				</a>
				<a
					href="https://github.com"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Button variant="ghost" size="sm">
						<Github class="h-4 w-4" />
					</Button>
				</a>
			</nav>
		</div>
	</header>

	<!-- Main Content -->
	<main class="flex-1">
		<slot />
	</main>

	<!-- Footer -->
	<footer class="border-t border-border py-4">
		<div class="container px-4 text-center text-sm text-muted-foreground">
			<p>
				Code Analyzer - AI-powered code review for better code quality.
			</p>
			<p class="mt-1">
				Supports JavaScript, TypeScript, Python, HTML, and CSS.
			</p>
		</div>
	</footer>
</div>