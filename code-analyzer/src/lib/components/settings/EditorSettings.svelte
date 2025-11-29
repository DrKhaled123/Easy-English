<script lang="ts">
	import { settingsStore } from '$lib/stores';
	import Card from '../ui/Card.svelte';
	import Select from '../ui/Select.svelte';
	import { Moon, Sun, Type, Columns, WrapText, Map } from 'lucide-svelte';

	const fontSizeOptions = [
		{ value: '12', label: '12px' },
		{ value: '14', label: '14px' },
		{ value: '16', label: '16px' },
		{ value: '18', label: '18px' },
		{ value: '20', label: '20px' }
	];

	const tabSizeOptions = [
		{ value: '2', label: '2 spaces' },
		{ value: '4', label: '4 spaces' }
	];

	function handleFontSizeChange(e: CustomEvent<string>) {
		settingsStore.update((s) => ({ ...s, fontSize: parseInt(e.detail) }));
	}

	function handleTabSizeChange(e: CustomEvent<string>) {
		settingsStore.update((s) => ({ ...s, tabSize: parseInt(e.detail) }));
	}
</script>

<div class="space-y-6">
	<!-- Theme -->
	<Card class="p-4">
		<div class="space-y-4">
			<div class="flex items-center gap-2">
				{#if $settingsStore.theme === 'dark'}
					<Moon class="h-5 w-5 text-primary" />
				{:else}
					<Sun class="h-5 w-5 text-primary" />
				{/if}
				<h3 class="font-medium">Theme</h3>
			</div>

			<p class="text-sm text-muted-foreground">
				Choose between light and dark mode for the editor.
			</p>

			<div class="flex gap-4">
				<label class="flex items-center gap-2">
					<input
						type="radio"
						name="theme"
						value="light"
						checked={$settingsStore.theme === 'light'}
						on:change={() => settingsStore.setTheme('light')}
						class="h-4 w-4"
					/>
					<span class="text-sm">Light</span>
				</label>
				<label class="flex items-center gap-2">
					<input
						type="radio"
						name="theme"
						value="dark"
						checked={$settingsStore.theme === 'dark'}
						on:change={() => settingsStore.setTheme('dark')}
						class="h-4 w-4"
					/>
					<span class="text-sm">Dark</span>
				</label>
			</div>
		</div>
	</Card>

	<!-- Font Size -->
	<Card class="p-4">
		<div class="space-y-4">
			<div class="flex items-center gap-2">
				<Type class="h-5 w-5 text-primary" />
				<h3 class="font-medium">Font Size</h3>
			</div>

			<p class="text-sm text-muted-foreground">
				Adjust the font size in the code editor.
			</p>

			<Select
				options={fontSizeOptions}
				value={$settingsStore.fontSize.toString()}
				on:change={handleFontSizeChange}
				class="w-32"
			/>
		</div>
	</Card>

	<!-- Tab Size -->
	<Card class="p-4">
		<div class="space-y-4">
			<div class="flex items-center gap-2">
				<Columns class="h-5 w-5 text-primary" />
				<h3 class="font-medium">Tab Size</h3>
			</div>

			<p class="text-sm text-muted-foreground">
				Set the number of spaces for indentation.
			</p>

			<Select
				options={tabSizeOptions}
				value={$settingsStore.tabSize.toString()}
				on:change={handleTabSizeChange}
				class="w-32"
			/>
		</div>
	</Card>

	<!-- Word Wrap -->
	<Card class="p-4">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-2">
				<WrapText class="h-5 w-5 text-primary" />
				<div>
					<h3 class="font-medium">Word Wrap</h3>
					<p class="text-sm text-muted-foreground">
						Wrap long lines to fit the editor width.
					</p>
				</div>
			</div>

			<label class="relative inline-flex cursor-pointer items-center">
				<input
					type="checkbox"
					checked={$settingsStore.wordWrap}
					on:change={() =>
						settingsStore.update((s) => ({ ...s, wordWrap: !s.wordWrap }))}
					class="peer sr-only"
				/>
				<div
					class="peer h-6 w-11 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring"
				></div>
			</label>
		</div>
	</Card>

	<!-- Minimap -->
	<Card class="p-4">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-2">
				<Map class="h-5 w-5 text-primary" />
				<div>
					<h3 class="font-medium">Minimap</h3>
					<p class="text-sm text-muted-foreground">
						Show a minimap preview of the code.
					</p>
				</div>
			</div>

			<label class="relative inline-flex cursor-pointer items-center">
				<input
					type="checkbox"
					checked={$settingsStore.minimap}
					on:change={() =>
						settingsStore.update((s) => ({ ...s, minimap: !s.minimap }))}
					class="peer sr-only"
				/>
				<div
					class="peer h-6 w-11 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring"
				></div>
			</label>
		</div>
	</Card>
</div>