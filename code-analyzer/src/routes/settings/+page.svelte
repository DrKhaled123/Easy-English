<script lang="ts">
	import { ApiKeyManager, EditorSettings } from '$lib/components/settings';
	import Tabs from '$lib/components/ui/Tabs.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { settingsStore } from '$lib/stores';
	import { ArrowLeft, RotateCcw } from 'lucide-svelte';

	let activeTab = 'api';

	const tabs = [
		{ id: 'api', label: 'API Keys' },
		{ id: 'editor', label: 'Editor' }
	];

	function handleReset() {
		if (confirm('Are you sure you want to reset all settings to defaults?')) {
			settingsStore.reset();
		}
	}
</script>

<svelte:head>
	<title>Settings - Code Analyzer</title>
</svelte:head>

<div class="container max-w-3xl px-4 py-8">
	<div class="mb-8 flex items-center justify-between">
		<div class="flex items-center gap-4">
			<a href="/">
				<Button variant="ghost" size="sm">
					<ArrowLeft class="mr-2 h-4 w-4" />
					Back
				</Button>
			</a>
			<h1 class="text-2xl font-bold">Settings</h1>
		</div>
		<Button variant="outline" size="sm" on:click={handleReset}>
			<RotateCcw class="mr-2 h-4 w-4" />
			Reset All
		</Button>
	</div>

	<Tabs {tabs} bind:activeTab>
		<div slot="default" let:activeTab>
			{#if activeTab === 'api'}
				<ApiKeyManager />
			{:else if activeTab === 'editor'}
				<EditorSettings />
			{/if}
		</div>
	</Tabs>
</div>