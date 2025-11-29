import { writable, derived } from 'svelte/store';
import type { AnalysisResult } from '$lib/types';

function createAnalysisStore() {
	const { subscribe, set, update } = writable<AnalysisResult | null>(null);

	return {
		subscribe,
		set,
		clear: () => set(null)
	};
}

function createAnalysisHistoryStore() {
	const { subscribe, set, update } = writable<AnalysisResult[]>([]);

	return {
		subscribe,
		add: (result: AnalysisResult) => {
			update((history) => [result, ...history].slice(0, 10)); // Keep last 10
		},
		remove: (id: string) => {
			update((history) => history.filter((r) => r.id !== id));
		},
		clear: () => set([])
	};
}

export const analysisStore = createAnalysisStore();
export const analysisHistoryStore = createAnalysisHistoryStore();

// Derived stores for analysis stats
export const errorCount = derived(analysisStore, ($analysis) => $analysis?.errors.length ?? 0);

export const warningCount = derived(analysisStore, ($analysis) => $analysis?.warnings.length ?? 0);

export const bestPracticeCount = derived(
	analysisStore,
	($analysis) => $analysis?.bestPractices.length ?? 0
);

export const cleanCodeCount = derived(
	analysisStore,
	($analysis) => $analysis?.cleanCode.length ?? 0
);

export const totalIssueCount = derived(
	[errorCount, warningCount],
	([$errors, $warnings]) => $errors + $warnings
);

export const hasIssues = derived(totalIssueCount, ($count) => $count > 0);

export const hasAnalysis = derived(analysisStore, ($analysis) => $analysis !== null);