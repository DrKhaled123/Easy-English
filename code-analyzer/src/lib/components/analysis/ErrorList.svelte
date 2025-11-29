<script lang="ts">
	import { cn } from '$lib/utils';
	import Button from '../ui/Button.svelte';
	import Badge from '../ui/Badge.svelte';
	import Card from '../ui/Card.svelte';
	import { AlertCircle, AlertTriangle, ExternalLink, Wrench } from 'lucide-svelte';
	import type { CodeError } from '$lib/types';

	export let items: CodeError[] = [];
	export let type: 'error' | 'warning' = 'error';
	export let onGoToLine: (line: number) => void = () => {};
	export let onApplyFix: (fix: string, line?: number) => void = () => {};

	const Icon = type === 'error' ? AlertCircle : AlertTriangle;
	const badgeVariant = type === 'error' ? 'destructive' : 'warning';
</script>

<div class="space-y-3 py-2">
	{#if items.length === 0}
		<div class="py-8 text-center text-muted-foreground">
			<p>No {type}s found. Great job!</p>
		</div>
	{:else}
		{#each items as item, index}
			<Card class="p-4">
				<div class="flex items-start gap-3">
					<div class={cn('mt-0.5', type === 'error' ? 'text-destructive' : 'text-warning')}>
						<svelte:component this={Icon} class="h-5 w-5" />
					</div>
					<div class="flex-1 space-y-2">
						<div class="flex items-start justify-between gap-2">
							<p class="text-sm font-medium">{item.message}</p>
							<Badge variant={badgeVariant} class="flex-shrink-0">
								Line {item.line}
							</Badge>
						</div>

						{#if item.ruleId}
							<p class="text-xs text-muted-foreground">Rule: {item.ruleId}</p>
						{/if}

						{#if item.fix}
							<div class="mt-2 rounded-md bg-muted p-3">
								<p class="mb-1 text-xs font-medium text-muted-foreground">Suggested fix:</p>
								<pre class="overflow-x-auto text-xs"><code>{item.fix}</code></pre>
							</div>
						{/if}

						<div class="flex items-center gap-2 pt-2">
							<Button
								variant="outline"
								size="sm"
								on:click={() => onGoToLine(item.line)}
							>
								<ExternalLink class="mr-1 h-3 w-3" />
								Go to line
							</Button>
							{#if item.fix}
								<Button
									variant="secondary"
									size="sm"
									on:click={() => onApplyFix(item.fix!, item.line)}
								>
									<Wrench class="mr-1 h-3 w-3" />
									Apply fix
								</Button>
							{/if}
						</div>
					</div>
				</div>
			</Card>
		{/each}
	{/if}
</div>