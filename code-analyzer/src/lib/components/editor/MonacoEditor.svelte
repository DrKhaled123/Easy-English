<script lang="ts">
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import loader from '@monaco-editor/loader';
	import type { editor } from 'monaco-editor';
	import { cn } from '$lib/utils';
	import { settingsStore } from '$lib/stores';
	import type { SupportedLanguage } from '$lib/types';

	export let value: string = '';
	export let language: SupportedLanguage = 'javascript';
	export let readOnly: boolean = false;
	let className: string = '';
	export { className as class };

	const dispatch = createEventDispatcher<{
		change: string;
		cursorChange: { line: number; column: number };
	}>();

	let container: HTMLDivElement;
	let editorInstance: editor.IStandaloneCodeEditor | null = null;
	let monaco: typeof import('monaco-editor') | null = null;

	$: theme = $settingsStore.theme === 'dark' ? 'vs-dark' : 'vs';
	$: fontSize = $settingsStore.fontSize;
	$: wordWrap = $settingsStore.wordWrap ? 'on' : 'off';
	$: minimap = $settingsStore.minimap;
	$: tabSize = $settingsStore.tabSize;

	// Update editor options when settings change
	$: if (editorInstance) {
		editorInstance.updateOptions({
			theme,
			fontSize,
			wordWrap: wordWrap as 'on' | 'off',
			minimap: { enabled: minimap },
			tabSize
		});
	}

	// Update language when it changes
	$: if (editorInstance && monaco) {
		const model = editorInstance.getModel();
		if (model) {
			monaco.editor.setModelLanguage(model, language);
		}
	}

	// Update value from outside
	$: if (editorInstance && value !== editorInstance.getValue()) {
		const position = editorInstance.getPosition();
		editorInstance.setValue(value);
		if (position) {
			editorInstance.setPosition(position);
		}
	}

	onMount(async () => {
		monaco = await loader.init();

		editorInstance = monaco.editor.create(container, {
			value,
			language,
			theme,
			readOnly,
			automaticLayout: true,
			minimap: { enabled: minimap },
			fontSize,
			lineNumbers: 'on',
			scrollBeyondLastLine: false,
			wordWrap: wordWrap as 'on' | 'off',
			tabSize,
			renderWhitespace: 'selection',
			bracketPairColorization: { enabled: true },
			cursorBlinking: 'smooth',
			smoothScrolling: true,
			padding: { top: 16, bottom: 16 },
			scrollbar: {
				verticalScrollbarSize: 10,
				horizontalScrollbarSize: 10
			}
		});

		// Listen for content changes
		editorInstance.onDidChangeModelContent(() => {
			const newValue = editorInstance!.getValue();
			if (newValue !== value) {
				value = newValue;
				dispatch('change', newValue);
			}
		});

		// Listen for cursor position changes
		editorInstance.onDidChangeCursorPosition((e) => {
			dispatch('cursorChange', {
				line: e.position.lineNumber,
				column: e.position.column
			});
		});
	});

	onDestroy(() => {
		editorInstance?.dispose();
	});

	// Public methods
	export function setMarkers(markers: editor.IMarkerData[]) {
		if (monaco && editorInstance) {
			const model = editorInstance.getModel();
			if (model) {
				monaco.editor.setModelMarkers(model, 'code-analyzer', markers);
			}
		}
	}

	export function clearMarkers() {
		if (monaco && editorInstance) {
			const model = editorInstance.getModel();
			if (model) {
				monaco.editor.setModelMarkers(model, 'code-analyzer', []);
			}
		}
	}

	export function setValue(newValue: string) {
		editorInstance?.setValue(newValue);
	}

	export function getValue(): string {
		return editorInstance?.getValue() ?? '';
	}

	export function focus() {
		editorInstance?.focus();
	}

	export function goToLine(line: number, column: number = 1) {
		if (editorInstance) {
			editorInstance.setPosition({ lineNumber: line, column });
			editorInstance.revealLineInCenter(line);
			editorInstance.focus();
		}
	}

	export function getPosition(): { line: number; column: number } | null {
		const pos = editorInstance?.getPosition();
		return pos ? { line: pos.lineNumber, column: pos.column } : null;
	}
</script>

<div
	bind:this={container}
	class={cn('h-full w-full min-h-[400px] rounded-md border border-border overflow-hidden', className)}
></div>