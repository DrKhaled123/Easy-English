import { writable, derived } from 'svelte/store';
import type { SupportedLanguage } from '$lib/types';

interface EditorState {
	code: string;
	language: SupportedLanguage;
	isAnalyzing: boolean;
	analysisId: string | null;
	cursorPosition: { line: number; column: number };
}

const initialState: EditorState = {
	code: '',
	language: 'javascript',
	isAnalyzing: false,
	analysisId: null,
	cursorPosition: { line: 1, column: 1 }
};

function createEditorStore() {
	const { subscribe, set, update } = writable<EditorState>(initialState);

	return {
		subscribe,
		set,
		update,
		setCode: (code: string) => {
			update((s) => ({ ...s, code }));
		},
		setLanguage: (language: SupportedLanguage) => {
			update((s) => ({ ...s, language }));
		},
		setAnalyzing: (isAnalyzing: boolean) => {
			update((s) => ({ ...s, isAnalyzing }));
		},
		setAnalysisId: (analysisId: string | null) => {
			update((s) => ({ ...s, analysisId }));
		},
		setCursorPosition: (line: number, column: number) => {
			update((s) => ({ ...s, cursorPosition: { line, column } }));
		},
		reset: () => {
			set(initialState);
		}
	};
}

export const editorStore = createEditorStore();

// Derived stores
export const codeLength = derived(editorStore, ($store) => $store.code.length);
export const lineCount = derived(editorStore, ($store) => $store.code.split('\n').length);
export const isCodeEmpty = derived(editorStore, ($store) => $store.code.trim().length === 0);