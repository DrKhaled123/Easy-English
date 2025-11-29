<script lang="ts">
	import Card from '../ui/Card.svelte';
	import Badge from '../ui/Badge.svelte';
	import { Lightbulb, Copy, Check } from 'lucide-svelte';
	import Button from '../ui/Button.svelte';
	import type { BestPractice } from '$lib/types';

	export let items: BestPractice[] = [];

	let copiedIndex: number | null = null;

	async function copyExample(example: string, index: number) {
		await navigator.clipboard.writeText(example);
		copiedIndex = index;
		setTimeout(() => {
			copiedIndex = null;
		}, 2000);
	}

	function getCategoryColor(category: string): 'default' | 'secondary' | 'success' | 'warning' {
		const categoryLower = category.toLowerCase();
		if (categoryLower.includes('security')) return 'warning';
		if (categoryLower.includes('performance')) return 'success';
		if (categoryLower.includes('accessibility')) return 'default';
		return 'secondary';
	}
</script>

<div class="space-y-3 py-2">
	{#if items.length === 0}
		<div class="py-8 text-center text-muted-foreground">
			<p>No best practice suggestions available.</p>
		</div>
	{:else}
		{#each items as item, index}
			<Card class="p-4">
				<div class="flex items-start gap-3">
					<div class="mt-0.5 text-primary">
						<Lightbulb class="h-5 w-5" />
					</div>
					<div class="flex-1 space-y-2">
						<div class="flex items-start justify-between gap-2">
							<p class="text-sm font-medium">{item.message}</p>
							<Badge variant={getCategoryColor(item.category)} class="flex-shrink-0">
								{item.category}
							</Badge>
						</div>

						{#if item.example}
							<div class="mt-2 rounded-md bg-muted p-3">
								<div class="mb-1 flex items-center justify-between">
									<p class="text-xs font-medium text-muted-foreground">Example:</p>
									<Button
										variant="ghost"
										size="sm"
										class="h-6 px-2"
										on:click={() => copyExample(item.example!, index)}
									>
										{#if copiedIndex === index}
											<Check class="h-3 w-3 text-success" />
										{:else}
											<Copy class="h-3 w-3" />
										{/if}
									</Button>
								</div>
								<pre class="overflow-x-auto text-xs"><code>{item.example}</code></pre>
							</div>
						{/if}

						{#if item.link}
							<a
								href={item.link}
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex items-center text-xs text-primary hover:underline"
							>
								Learn more →
							</a>
						{/if}
					</div>
				</div>
			</Card>
		{/each}
	{/if}
</div>