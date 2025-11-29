<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Play, Trash2, Copy, Download, Settings, Loader2 } from 'lucide-svelte';
	import Button from '../ui/Button.svelte';
	import Select from '../ui/Select.svelte';
	import { editorStore } from '$lib/stores';
	import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '$lib/types';

	export let isAnalyzing: boolean = false;
	export let hasCode: boolean = false;

	const dispatch = createEventDispatcher<{
		analyze: void;
		clear: void;
		copy: void;
		download: void;
		settings: void;
	}>();

	const languageOptions = SUPPORTED_LANGUAGES.map((lang) => ({
		value: lang.id,
		label: lang.name
	}));

	function handleLanguageChange(e: CustomEvent<string>) {
		editorStore.setLanguage(e.detail as SupportedLanguage);
	}

	function getLanguageIcon(lang: SupportedLanguage): string {
		const icons: Record<SupportedLanguage, string> = {
			javascript: 'JS',
			typescript: 'TS',
			python: 'PY',
			html: 'HTML',
			css: 'CSS'
		};
		return icons[lang];
	}
</script>

<div class="flex items-center justify-between border-b border-border bg-card px-4 py-2">
	<div class="flex items-center gap-4">
		<!-- Language Selector -->
		<div class="flex items-center gap-2">
			<span class="text-sm font-medium text-muted-foreground">Language:</span>
			<Select
				options={languageOptions}
				value={$editorStore.language}
				on:change={handleLanguageChange}
				class="w-40"
			/>
		</div>

		<!-- Line/Column indicator -->
		<div class="hidden text-sm text-muted-foreground sm:block">
			Ln {$editorStore.cursorPosition.line}, Col {$editorStore.cursorPosition.column}
		</div>
	</div>

	<div class="flex items-center gap-2">
		<!-- Clear Button -->
		<Button
			variant="ghost"
			size="sm"
			disabled={!hasCode}
			on:click={() => dispatch('clear')}
			title="Clear code"
		>
			<Trash2 class="h-4 w-4" />
			<span class="ml-2 hidden sm:inline">Clear</span>
		</Button>

		<!-- Copy Button -->
		<Button
			variant="ghost"
			size="sm"
			disabled={!hasCode}
			on:click={() => dispatch('copy')}
			title="Copy code"
		>
			<Copy class="h-4 w-4" />
			<span class="ml-2 hidden sm:inline">Copy</span>
		</Button>

		<!-- Download Button -->
		<Button
			variant="ghost"
			size="sm"
			disabled={!hasCode}
			on:click={() => dispatch('download')}
			title="Download code"
		>
			<Download class="h-4 w-4" />
			<span class="ml-2 hidden sm:inline">Download</span>
		</Button>

		<!-- Settings Button -->
		<Button
			variant="ghost"
			size="sm"
			on:click={() => dispatch('settings')}
			title="Settings"
		>
			<Settings class="h-4 w-4" />
		</Button>

		<!-- Analyze Button -->
		<Button
			variant="default"
			size="sm"
			disabled={!hasCode || isAnalyzing}
			on:click={() => dispatch('analyze')}
		>
			{#if isAnalyzing}
				<Loader2 class="mr-2 h-4 w-4 animate-spin" />
				Analyzing...
			{:else}
				<Play class="mr-2 h-4 w-4" />
				Analyze
			{/if}
		</Button>
	</div>
</div>