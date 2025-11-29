<script lang="ts">
	import Card from '../ui/Card.svelte';
	import Button from '../ui/Button.svelte';
	import { Sparkles, ExternalLink, Wrench, Copy, Check } from 'lucide-svelte';
	import type { CleanCodeSuggestion } from '$lib/types';

	export let items: CleanCodeSuggestion[] = [];
	export let onGoToLine: (line: number) => void = () => {};
	export let onApplyFix: (fix: string, line?: number) => void = () => {};

	let copiedIndex: number | null = null;

	async function copyRefactored(code: string, index: number) {
		await navigator.clipboard.writeText(code);
		copiedIndex = index;
		setTimeout(() => {
			copiedIndex = null;
		}, 2000);
	}
</script>

<div class="space-y-3 py-2">
	{#if items.length === 0}
		<div class="py-8 text-center text-muted-foreground">
			<p>No clean code suggestions available.</p>
		</div>
	{:else}
		{#each items as item, index}
			<Card class="p-4">
				<div class="flex items-start gap-3">
					<div class="mt-0.5 text-info">
						<Sparkles class="h-5 w-5" />
					</div>
					<div class="flex-1 space-y-2">
						<div class="flex items-start justify-between gap-2">
							<div>
								<p class="text-sm font-medium">{item.issue}</p>
								<p class="mt-1 text-sm text-muted-foreground">{item.recommendation}</p>
							</div>
							{#if item.line}
								<span class="flex-shrink-0 text-xs text-muted-foreground">
									Line {item.line}
								</span>
							{/if}
						</div>

						{#if item.refactored}
							<div class="mt-2 rounded-md bg-muted p-3">
								<div class="mb-1 flex items-center justify-between">
									<p class="text-xs font-medium text-muted-foreground">Refactored code:</p>
									<Button
										variant="ghost"
										size="sm"
										class="h-6 px-2"
										on:click={() => copyRefactored(item.refactored!, index)}
									>
										{#if copiedIndex === index}
											<Check class="h-3 w-3 text-success" />
										{:else}
											<Copy class="h-3 w-3" />
										{/if}
									</Button>
								</div>
								<pre class="overflow-x-auto text-xs"><code>{item.refactored}</code></pre>
							</div>
						{/if}

						<div class="flex items-center gap-2 pt-2">
							{#if item.line}
								<Button
									variant="outline"
									size="sm"
									on:click={() => onGoToLine(item.line!)}
								>
									<ExternalLink class="mr-1 h-3 w-3" />
									Go to line
								</Button>
							{/if}
							{#if item.refactored}
								<Button
									variant="secondary"
									size="sm"
									on:click={() => onApplyFix(item.refactored!, item.line)}
								>
									<Wrench class="mr-1 h-3 w-3" />
									Apply refactoring
								</Button>
							{/if}
						</div>
					</div>
				</div>
			</Card>
		{/each}
	{/if}
</div>