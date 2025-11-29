<script lang="ts">
	import { onMount } from 'svelte';
	import { MonacoEditor, EditorToolbar } from '$lib/components/editor';
	import { AnalysisPanel } from '$lib/components/analysis';
	import { Modal, Toast } from '$lib/components/ui';
	import { ApiKeyManager } from '$lib/components/settings';
	import { editorStore, analysisStore, settingsStore, isCodeEmpty } from '$lib/stores';
	import { analyzeCode, hasApiKey } from '$lib/services/analyzer';
	import type { editor } from 'monaco-editor';
	import type { SupportedLanguage } from '$lib/types';

	let editorComponent: MonacoEditor;
	let showSettings = false;
	let toastMessage = '';
	let toastType: 'success' | 'error' | 'warning' | 'info' = 'info';
	let showToast = false;

	// Sample code for different languages
	const sampleCode: Record<SupportedLanguage, string> = {
		javascript: `// Example JavaScript code with some issues
function calculateSum(arr) {
  var total = 0
  for (var i = 0; i <= arr.length; i++) {
    total = total + arr[i]
  }
  return total
}

const result = calculateSum([1, 2, 3, 4, 5])
console.log(result)`,
		typescript: `// Example TypeScript code with some issues
function greet(name) {
  console.log("Hello, " + name)
}

const users = ["Alice", "Bob", "Charlie"]
users.forEach(user => {
  greet(user)
})`,
		python: `# Example Python code with some issues
def calculate_average(numbers):
    total = 0
    for i in range(len(numbers)):
        total = total + numbers[i]
    average = total / len(numbers)
    return average

result = calculate_average([1, 2, 3, 4, 5])
print(result)`,
		html: `<!-- Example HTML with some issues -->
<html>
<head>
<title>My Page</title>
</head>
<body>
<div class="container">
<h1>Welcome</h1>
<img src="image.jpg">
<button onclick="doSomething()">Click me</button>
</div>
</body>
</html>`,
		css: `/* Example CSS with some issues */
.container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.button {
  background: red;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
}

.button:hover {
  background: darkred;
}`
	};

	onMount(() => {
		// Set initial sample code
		if (!$editorStore.code) {
			editorStore.setCode(sampleCode[$editorStore.language]);
		}
	});

	// Update sample code when language changes
	$: if ($editorStore.language && !$editorStore.code) {
		editorStore.setCode(sampleCode[$editorStore.language]);
	}

	async function handleAnalyze() {
		if (!hasApiKey()) {
			showSettings = true;
			showNotification('Please configure your API key first.', 'warning');
			return;
		}

		editorStore.setAnalyzing(true);
		analysisStore.clear();

		try {
			const result = await analyzeCode($editorStore.code, $editorStore.language);
			analysisStore.set(result);

			// Set markers in editor
			const markers: editor.IMarkerData[] = [
				...result.errors.map((e) => ({
					startLineNumber: e.line,
					startColumn: e.column ?? 1,
					endLineNumber: e.endLine ?? e.line,
					endColumn: e.endColumn ?? 100,
					message: e.message,
					severity: 8 // Error
				})),
				...result.warnings.map((w) => ({
					startLineNumber: w.line,
					startColumn: w.column ?? 1,
					endLineNumber: w.endLine ?? w.line,
					endColumn: w.endColumn ?? 100,
					message: w.message,
					severity: 4 // Warning
				}))
			];
			editorComponent?.setMarkers(markers);

			const totalIssues = result.errors.length + result.warnings.length;
			if (totalIssues > 0) {
				showNotification(
					`Found ${result.errors.length} errors and ${result.warnings.length} warnings.`,
					'info'
				);
			} else {
				showNotification('No issues found! Your code looks good.', 'success');
			}
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Analysis failed';
			showNotification(message, 'error');
		} finally {
			editorStore.setAnalyzing(false);
		}
	}

	function handleClear() {
		editorStore.setCode('');
		analysisStore.clear();
		editorComponent?.clearMarkers();
	}

	async function handleCopy() {
		await navigator.clipboard.writeText($editorStore.code);
		showNotification('Code copied to clipboard!', 'success');
	}

	function handleDownload() {
		const extensions: Record<SupportedLanguage, string> = {
			javascript: 'js',
			typescript: 'ts',
			python: 'py',
			html: 'html',
			css: 'css'
		};
		const ext = extensions[$editorStore.language];
		const blob = new Blob([$editorStore.code], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `code.${ext}`;
		a.click();
		URL.revokeObjectURL(url);
		showNotification('Code downloaded!', 'success');
	}

	function handleGoToLine(line: number) {
		editorComponent?.goToLine(line);
	}

	function handleApplyFix(fix: string, line?: number) {
		// For now, just copy the fix to clipboard
		navigator.clipboard.writeText(fix);
		showNotification('Fix copied to clipboard! Paste it in the editor.', 'info');
		if (line) {
			editorComponent?.goToLine(line);
		}
	}

	function handleCodeChange(e: CustomEvent<string>) {
		editorStore.setCode(e.detail);
		// Clear markers when code changes
		editorComponent?.clearMarkers();
	}

	function handleCursorChange(e: CustomEvent<{ line: number; column: number }>) {
		editorStore.setCursorPosition(e.detail.line, e.detail.column);
	}

	function showNotification(message: string, type: 'success' | 'error' | 'warning' | 'info') {
		toastMessage = message;
		toastType = type;
		showToast = true;
	}
</script>

<svelte:head>
	<title>Code Analyzer - AI-Powered Code Review</title>
	<meta name="description" content="Analyze your code for errors, best practices, and clean code suggestions using AI." />
</svelte:head>

<div class="flex h-[calc(100vh-8rem)] flex-col lg:flex-row">
	<!-- Editor Section -->
	<div class="flex flex-1 flex-col border-r border-border">
		<EditorToolbar
			isAnalyzing={$editorStore.isAnalyzing}
			hasCode={!$isCodeEmpty}
			on:analyze={handleAnalyze}
			on:clear={handleClear}
			on:copy={handleCopy}
			on:download={handleDownload}
			on:settings={() => (showSettings = true)}
		/>
		<div class="flex-1">
			<MonacoEditor
				bind:this={editorComponent}
				value={$editorStore.code}
				language={$editorStore.language}
				on:change={handleCodeChange}
				on:cursorChange={handleCursorChange}
				class="h-full"
			/>
		</div>
	</div>

	<!-- Analysis Panel -->
	<div class="h-full w-full lg:w-96 xl:w-[28rem]">
		<AnalysisPanel
			onGoToLine={handleGoToLine}
			onApplyFix={handleApplyFix}
			class="h-full"
		/>
	</div>
</div>

<!-- Settings Modal -->
<Modal
	bind:open={showSettings}
	title="API Key Settings"
	description="Configure your AI API keys to enable code analysis."
>
	<ApiKeyManager />
</Modal>

<!-- Toast Notifications -->
<div class="fixed bottom-4 right-4 z-50">
	<Toast
		bind:visible={showToast}
		type={toastType}
		message={toastMessage}
		duration={5000}
	/>
</div>