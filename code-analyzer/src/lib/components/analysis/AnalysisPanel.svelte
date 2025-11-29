<script lang="ts">
	import { cn } from '$lib/utils';
	import Tabs from '../ui/Tabs.svelte';
	import ErrorList from './ErrorList.svelte';
	import BestPracticesList from './BestPracticesList.svelte';
	import CleanCodeList from './CleanCodeList.svelte';
	import {
		analysisStore,
		errorCount,
		warningCount,
		bestPracticeCount,
		cleanCodeCount,
		hasAnalysis
	} from '$lib/stores';
	import { FileWarning, AlertCircle, Lightbulb, Sparkles } from 'lucide-svelte';

	export let onGoToLine: (line: number) => void = () => {};
	export let onApplyFix: (fix: string, line?: number) => void = () => {};

	let className: string = '';
	export { className as class };

	let activeTab = 'errors';

	$: tabs = [
		{ id: 'errors', label: 'Errors', count: $errorCount },
		{ id: 'warnings', label: 'Warnings', count: $warningCount },
		{ id: 'bestPractices', label: 'Best Practices', count: $bestPracticeCount },
		{ id: 'cleanCode', label: 'Clean Code', count: $cleanCodeCount }
	];
</script>

<div class={cn('flex h-full flex-col bg-card', className)}>
	<div class="border-b border-border px-4 py-3">
		<h2 class="text-lg font-semibold">Analysis Results</h2>
	</div>

	{#if $hasAnalysis}
		<Tabs {tabs} bind:activeTab class="flex-1 overflow-hidden px-4">
			<div class="h-full overflow-y-auto" slot="default" let:activeTab>
				{#if activeTab === 'errors'}
					<ErrorList
						items={$analysisStore?.errors ?? []}
						type="error"
						{onGoToLine}
						{onApplyFix}
					/>
				{:else if activeTab === 'warnings'}
					<ErrorList
						items={$analysisStore?.warnings ?? []}
						type="warning"
						{onGoToLine}
						{onApplyFix}
					/>
				{:else if activeTab === 'bestPractices'}
					<BestPracticesList items={$analysisStore?.bestPractices ?? []} />
				{:else if activeTab === 'cleanCode'}
					<CleanCodeList
						items={$analysisStore?.cleanCode ?? []}
						{onGoToLine}
						{onApplyFix}
					/>
				{/if}
			</div>
		</Tabs>
	{:else}
		<div class="flex flex-1 flex-col items-center justify-center p-8 text-center">
			<div class="mb-4 rounded-full bg-muted p-4">
				<Sparkles class="h-8 w-8 text-muted-foreground" />
			</div>
			<h3 class="mb-2 text-lg font-medium">No Analysis Yet</h3>
			<p class="text-sm text-muted-foreground">
				Enter some code and click "Analyze" to get started.
			</p>
		</div>
	{/if}
</div>