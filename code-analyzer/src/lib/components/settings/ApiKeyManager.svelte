<script lang="ts">
	import { settingsStore } from '$lib/stores';
	import Button from '../ui/Button.svelte';
	import Input from '../ui/Input.svelte';
	import Card from '../ui/Card.svelte';
	import { Eye, EyeOff, Check, X, Loader2, Key } from 'lucide-svelte';
	import { validateOpenAIKey } from '$lib/services/ai/openai';
	import { validateClaudeKey } from '$lib/services/ai/claude';

	let showOpenAIKey = false;
	let showClaudeKey = false;
	let openAIKeyInput = $settingsStore.openaiKey;
	let claudeKeyInput = $settingsStore.claudeKey;
	let validatingOpenAI = false;
	let validatingClaude = false;
	let openAIValid: boolean | null = null;
	let claudeValid: boolean | null = null;

	async function saveOpenAIKey() {
		if (!openAIKeyInput.trim()) {
			settingsStore.setOpenAIKey('');
			openAIValid = null;
			return;
		}

		validatingOpenAI = true;
		openAIValid = null;

		try {
			const isValid = await validateOpenAIKey(openAIKeyInput);
			openAIValid = isValid;
			if (isValid) {
				settingsStore.setOpenAIKey(openAIKeyInput);
			}
		} catch {
			openAIValid = false;
		} finally {
			validatingOpenAI = false;
		}
	}

	async function saveClaudeKey() {
		if (!claudeKeyInput.trim()) {
			settingsStore.setClaudeKey('');
			claudeValid = null;
			return;
		}

		validatingClaude = true;
		claudeValid = null;

		try {
			const isValid = await validateClaudeKey(claudeKeyInput);
			claudeValid = isValid;
			if (isValid) {
				settingsStore.setClaudeKey(claudeKeyInput);
			}
		} catch {
			claudeValid = false;
		} finally {
			validatingClaude = false;
		}
	}

	function clearOpenAIKey() {
		openAIKeyInput = '';
		settingsStore.setOpenAIKey('');
		openAIValid = null;
	}

	function clearClaudeKey() {
		claudeKeyInput = '';
		settingsStore.setClaudeKey('');
		claudeValid = null;
	}
</script>

<div class="space-y-6">
	<!-- OpenAI API Key -->
	<Card class="p-4">
		<div class="space-y-4">
			<div class="flex items-center gap-2">
				<Key class="h-5 w-5 text-primary" />
				<h3 class="font-medium">OpenAI API Key</h3>
				{#if openAIValid === true}
					<Check class="h-4 w-4 text-success" />
				{:else if openAIValid === false}
					<X class="h-4 w-4 text-destructive" />
				{/if}
			</div>

			<p class="text-sm text-muted-foreground">
				Enter your OpenAI API key to use GPT-4 for code analysis.
				<a
					href="https://platform.openai.com/api-keys"
					target="_blank"
					rel="noopener noreferrer"
					class="text-primary hover:underline"
				>
					Get an API key →
				</a>
			</p>

			<div class="flex gap-2">
				<div class="relative flex-1">
					<Input
						type={showOpenAIKey ? 'text' : 'password'}
						placeholder="sk-..."
						bind:value={openAIKeyInput}
						class="pr-10"
					/>
					<button
						type="button"
						class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
						on:click={() => (showOpenAIKey = !showOpenAIKey)}
					>
						{#if showOpenAIKey}
							<EyeOff class="h-4 w-4" />
						{:else}
							<Eye class="h-4 w-4" />
						{/if}
					</button>
				</div>
				<Button
					variant="secondary"
					on:click={saveOpenAIKey}
					disabled={validatingOpenAI}
				>
					{#if validatingOpenAI}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					{/if}
					Save
				</Button>
				{#if $settingsStore.openaiKey}
					<Button variant="outline" on:click={clearOpenAIKey}>
						Clear
					</Button>
				{/if}
			</div>

			{#if openAIValid === false}
				<p class="text-sm text-destructive">Invalid API key. Please check and try again.</p>
			{/if}
		</div>
	</Card>

	<!-- Claude API Key -->
	<Card class="p-4">
		<div class="space-y-4">
			<div class="flex items-center gap-2">
				<Key class="h-5 w-5 text-primary" />
				<h3 class="font-medium">Claude API Key</h3>
				{#if claudeValid === true}
					<Check class="h-4 w-4 text-success" />
				{:else if claudeValid === false}
					<X class="h-4 w-4 text-destructive" />
				{/if}
			</div>

			<p class="text-sm text-muted-foreground">
				Enter your Anthropic API key to use Claude for code analysis.
				<a
					href="https://console.anthropic.com/settings/keys"
					target="_blank"
					rel="noopener noreferrer"
					class="text-primary hover:underline"
				>
					Get an API key →
				</a>
			</p>

			<div class="flex gap-2">
				<div class="relative flex-1">
					<Input
						type={showClaudeKey ? 'text' : 'password'}
						placeholder="sk-ant-..."
						bind:value={claudeKeyInput}
						class="pr-10"
					/>
					<button
						type="button"
						class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
						on:click={() => (showClaudeKey = !showClaudeKey)}
					>
						{#if showClaudeKey}
							<EyeOff class="h-4 w-4" />
						{:else}
							<Eye class="h-4 w-4" />
						{/if}
					</button>
				</div>
				<Button
					variant="secondary"
					on:click={saveClaudeKey}
					disabled={validatingClaude}
				>
					{#if validatingClaude}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					{/if}
					Save
				</Button>
				{#if $settingsStore.claudeKey}
					<Button variant="outline" on:click={clearClaudeKey}>
						Clear
					</Button>
				{/if}
			</div>

			{#if claudeValid === false}
				<p class="text-sm text-destructive">Invalid API key. Please check and try again.</p>
			{/if}
		</div>
	</Card>

	<!-- Preferred AI Provider -->
	<Card class="p-4">
		<div class="space-y-4">
			<h3 class="font-medium">Preferred AI Provider</h3>
			<p class="text-sm text-muted-foreground">
				Choose which AI to use for code analysis when both keys are available.
			</p>

			<div class="flex gap-4">
				<label class="flex items-center gap-2">
					<input
						type="radio"
						name="preferredAI"
						value="openai"
						checked={$settingsStore.preferredAI === 'openai'}
						on:change={() => settingsStore.setPreferredAI('openai')}
						class="h-4 w-4"
					/>
					<span class="text-sm">OpenAI (GPT-4)</span>
				</label>
				<label class="flex items-center gap-2">
					<input
						type="radio"
						name="preferredAI"
						value="claude"
						checked={$settingsStore.preferredAI === 'claude'}
						on:change={() => settingsStore.setPreferredAI('claude')}
						class="h-4 w-4"
					/>
					<span class="text-sm">Claude (Anthropic)</span>
				</label>
			</div>
		</div>
	</Card>
</div>