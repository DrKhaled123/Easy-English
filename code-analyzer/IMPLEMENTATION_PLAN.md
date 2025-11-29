# Code Analyzer - Implementation Plan

## Overview

This document outlines the step-by-step implementation plan for building the Code Analyzer SvelteKit application.

---

## Phase 1: Project Setup (Day 1)

### 1.1 Initialize SvelteKit Project

```bash
# Create SvelteKit project
cd code-analyzer
npm create svelte@latest .
# Select: Skeleton project, TypeScript, ESLint, Prettier, Playwright

# Install dependencies
npm install
```

### 1.2 Install Core Dependencies

```bash
# UI and Styling
npm install -D tailwindcss postcss autoprefixer
npm install lucide-svelte
npm install clsx tailwind-merge

# Monaco Editor
npm install @monaco-editor/loader monaco-editor

# AI Integration
npm install openai @anthropic-ai/sdk

# Utilities
npm install zod
```

### 1.3 Configure Tailwind CSS

```bash
npx tailwindcss init -p
```

### 1.4 Project Configuration Files

Create/update the following files:
- `tailwind.config.js` - Tailwind configuration
- `svelte.config.js` - SvelteKit configuration
- `vite.config.ts` - Vite configuration
- `vercel.json` - Vercel deployment config

---

## Phase 2: Core UI Components (Day 2-3)

### 2.1 Base UI Components

Create reusable UI components in `src/lib/components/ui/`:

| Component | Purpose |
|-----------|---------|
| `Button.svelte` | Primary action buttons |
| `Card.svelte` | Container for content sections |
| `Tabs.svelte` | Tab navigation for analysis results |
| `Modal.svelte` | Dialogs for settings and confirmations |
| `Toast.svelte` | Notification messages |
| `Input.svelte` | Form inputs |
| `Select.svelte` | Dropdown selections |
| `Badge.svelte` | Status indicators |

### 2.2 Layout Components

Create layout structure:
- `src/routes/+layout.svelte` - Main app layout
- Header with navigation
- Sidebar for settings
- Main content area

### 2.3 Theme System

Implement dark/light theme:
- CSS variables for colors
- Theme toggle component
- Persist preference in localStorage

---

## Phase 3: Monaco Editor Integration (Day 4-5)

### 3.1 Monaco Editor Component

Create `src/lib/components/editor/MonacoEditor.svelte`:

```svelte
<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import loader from '@monaco-editor/loader';
  import type { editor } from 'monaco-editor';

  export let value: string = '';
  export let language: string = 'javascript';
  export let theme: string = 'vs-dark';
  export let readOnly: boolean = false;

  const dispatch = createEventDispatcher();
  let container: HTMLDivElement;
  let editorInstance: editor.IStandaloneCodeEditor;

  onMount(async () => {
    const monaco = await loader.init();
    editorInstance = monaco.editor.create(container, {
      value,
      language,
      theme,
      readOnly,
      automaticLayout: true,
      minimap: { enabled: false },
      fontSize: 14,
      lineNumbers: 'on',
      scrollBeyondLastLine: false,
      wordWrap: 'on'
    });

    editorInstance.onDidChangeModelContent(() => {
      const newValue = editorInstance.getValue();
      dispatch('change', newValue);
    });
  });

  onDestroy(() => {
    editorInstance?.dispose();
  });

  export function setMarkers(markers: editor.IMarkerData[]) {
    const monaco = loader.init();
    monaco.then(m => {
      m.editor.setModelMarkers(
        editorInstance.getModel()!,
        'code-analyzer',
        markers
      );
    });
  }

  export function setValue(newValue: string) {
    editorInstance?.setValue(newValue);
  }
</script>

<div bind:this={container} class="h-full w-full min-h-[400px]"></div>
```

### 3.2 Editor Toolbar

Create `src/lib/components/editor/EditorToolbar.svelte`:
- Language selector dropdown
- Theme toggle
- Font size controls
- Clear button
- Copy button

### 3.3 Language Selector

Create `src/lib/components/editor/LanguageSelector.svelte`:
- Support for: JavaScript, TypeScript, Python, HTML, CSS
- Icon for each language
- Keyboard shortcuts

---

## Phase 4: State Management (Day 6)

### 4.1 Svelte Stores

Create stores in `src/lib/stores/`:

**editor.ts**
```typescript
import { writable, derived } from 'svelte/store';

interface EditorState {
  code: string;
  language: 'javascript' | 'typescript' | 'python' | 'html' | 'css';
  isAnalyzing: boolean;
  analysisId: string | null;
}

const initialState: EditorState = {
  code: '',
  language: 'javascript',
  isAnalyzing: false,
  analysisId: null
};

export const editorStore = writable<EditorState>(initialState);

export const codeLength = derived(editorStore, $store => $store.code.length);
```

**analysis.ts**
```typescript
import { writable } from 'svelte/store';
import type { AnalysisResult } from '$lib/types/analysis';

export const analysisStore = writable<AnalysisResult | null>(null);
export const analysisHistory = writable<AnalysisResult[]>([]);
```

**settings.ts**
```typescript
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

interface Settings {
  openaiKey: string;
  claudeKey: string;
  preferredAI: 'openai' | 'claude';
  theme: 'light' | 'dark';
  autoAnalyze: boolean;
  fontSize: number;
}

const defaultSettings: Settings = {
  openaiKey: '',
  claudeKey: '',
  preferredAI: 'openai',
  theme: 'dark',
  autoAnalyze: false,
  fontSize: 14
};

function createSettingsStore() {
  const stored = browser ? localStorage.getItem('settings') : null;
  const initial = stored ? JSON.parse(stored) : defaultSettings;
  
  const { subscribe, set, update } = writable<Settings>(initial);
  
  return {
    subscribe,
    set: (value: Settings) => {
      if (browser) localStorage.setItem('settings', JSON.stringify(value));
      set(value);
    },
    update: (fn: (s: Settings) => Settings) => {
      update(s => {
        const newValue = fn(s);
        if (browser) localStorage.setItem('settings', JSON.stringify(newValue));
        return newValue;
      });
    }
  };
}

export const settingsStore = createSettingsStore();
```

### 4.2 Type Definitions

Create types in `src/lib/types/`:

**analysis.ts**
```typescript
export interface CodeError {
  line: number;
  column?: number;
  endLine?: number;
  endColumn?: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
  fix?: string;
  ruleId?: string;
}

export interface BestPractice {
  category: string;
  message: string;
  example?: string;
  link?: string;
}

export interface CleanCodeSuggestion {
  issue: string;
  recommendation: string;
  refactored?: string;
  line?: number;
}

export interface AnalysisResult {
  id: string;
  timestamp: Date;
  language: string;
  originalCode: string;
  errors: CodeError[];
  warnings: CodeError[];
  bestPractices: BestPractice[];
  cleanCode: CleanCodeSuggestion[];
  fixedCode?: string;
}
```

---

## Phase 5: AI Integration (Day 7-8)

### 5.1 AI Service Layer

Create `src/lib/services/ai/`:

**openai.ts**
```typescript
import OpenAI from 'openai';
import type { AnalysisResult } from '$lib/types/analysis';
import { buildAnalysisPrompt, parseAIResponse } from './prompts';

export async function analyzeWithOpenAI(
  code: string,
  language: string,
  apiKey: string
): Promise<AnalysisResult> {
  const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: 'You are an expert code reviewer.' },
      { role: 'user', content: buildAnalysisPrompt(code, language) }
    ],
    response_format: { type: 'json_object' }
  });
  
  return parseAIResponse(response.choices[0].message.content!, code, language);
}
```

**claude.ts**
```typescript
import Anthropic from '@anthropic-ai/sdk';
import type { AnalysisResult } from '$lib/types/analysis';
import { buildAnalysisPrompt, parseAIResponse } from './prompts';

export async function analyzeWithClaude(
  code: string,
  language: string,
  apiKey: string
): Promise<AnalysisResult> {
  const anthropic = new Anthropic({ apiKey });
  
  const response = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 4096,
    messages: [
      { role: 'user', content: buildAnalysisPrompt(code, language) }
    ]
  });
  
  const content = response.content[0];
  if (content.type === 'text') {
    return parseAIResponse(content.text, code, language);
  }
  throw new Error('Unexpected response format');
}
```

**prompts.ts**
```typescript
export function buildAnalysisPrompt(code: string, language: string): string {
  return `Analyze the following ${language} code for errors, best practices, and clean code principles.

Provide your analysis in the following JSON format:
{
  "errors": [
    {
      "line": <line number>,
      "message": "<error description>",
      "severity": "error",
      "fix": "<corrected code snippet>"
    }
  ],
  "warnings": [
    {
      "line": <line number>,
      "message": "<warning description>",
      "severity": "warning",
      "fix": "<suggested improvement>"
    }
  ],
  "bestPractices": [
    {
      "category": "<category name>",
      "message": "<recommendation>",
      "example": "<code example>"
    }
  ],
  "cleanCode": [
    {
      "issue": "<issue description>",
      "recommendation": "<how to improve>",
      "refactored": "<refactored code>",
      "line": <line number if applicable>
    }
  ],
  "fixedCode": "<complete corrected version of the code>"
}

Code to analyze:
\`\`\`${language}
${code}
\`\`\`

Important:
- Be thorough but concise
- Provide actionable fixes
- Focus on real issues, not style preferences
- Include line numbers where applicable
- The fixedCode should be a complete, working version`;
}

export function parseAIResponse(
  response: string,
  originalCode: string,
  language: string
): AnalysisResult {
  const parsed = JSON.parse(response);
  
  return {
    id: crypto.randomUUID(),
    timestamp: new Date(),
    language,
    originalCode,
    errors: parsed.errors || [],
    warnings: parsed.warnings || [],
    bestPractices: parsed.bestPractices || [],
    cleanCode: parsed.cleanCode || [],
    fixedCode: parsed.fixedCode
  };
}
```

### 5.2 Analysis Service

Create `src/lib/services/analyzer.ts`:
```typescript
import { analyzeWithOpenAI } from './ai/openai';
import { analyzeWithClaude } from './ai/claude';
import { settingsStore } from '$lib/stores/settings';
import { get } from 'svelte/store';

export async function analyzeCode(code: string, language: string) {
  const settings = get(settingsStore);
  
  if (settings.preferredAI === 'openai' && settings.openaiKey) {
    return analyzeWithOpenAI(code, language, settings.openaiKey);
  } else if (settings.claudeKey) {
    return analyzeWithClaude(code, language, settings.claudeKey);
  }
  
  throw new Error('No API key configured. Please add your API key in settings.');
}
```

---

## Phase 6: Analysis UI Components (Day 9-10)

### 6.1 Analysis Panel

Create `src/lib/components/analysis/AnalysisPanel.svelte`:
- Tabbed interface for Errors, Warnings, Best Practices, Clean Code
- Count badges on each tab
- Loading state during analysis

### 6.2 Error List

Create `src/lib/components/analysis/ErrorList.svelte`:
- List of errors with line numbers
- Severity icons
- Click to jump to line in editor
- "Fix" button for each error

### 6.3 Suggestion Card

Create `src/lib/components/analysis/SuggestionCard.svelte`:
- Card layout for best practices and clean code suggestions
- Category badges
- Expandable examples
- Copy button for code snippets

### 6.4 Code Diff View

Create `src/lib/components/analysis/CodeDiff.svelte`:
- Side-by-side comparison
- Highlight additions/deletions
- Toggle between unified and split view
- "Apply All Fixes" button

---

## Phase 7: Settings & API Key Management (Day 11)

### 7.1 Settings Page

Create `src/routes/settings/+page.svelte`:
- API key input fields with show/hide toggle
- AI provider selection
- Theme preference
- Auto-analyze toggle
- Font size slider
- Clear all data button

### 7.2 API Key Manager

Create `src/lib/components/settings/ApiKeyManager.svelte`:
- Secure input for API keys
- Key validation on save
- Clear instructions for obtaining keys
- Links to API documentation

### 7.3 First-Time Setup Modal

Create onboarding flow for new users:
- Welcome message
- API key setup prompt
- Quick tutorial

---

## Phase 8: Main Application Page (Day 12)

### 8.1 Home Page

Create `src/routes/+page.svelte`:

```svelte
<script lang="ts">
  import MonacoEditor from '$lib/components/editor/MonacoEditor.svelte';
  import EditorToolbar from '$lib/components/editor/EditorToolbar.svelte';
  import AnalysisPanel from '$lib/components/analysis/AnalysisPanel.svelte';
  import { editorStore } from '$lib/stores/editor';
  import { analysisStore } from '$lib/stores/analysis';
  import { analyzeCode } from '$lib/services/analyzer';
  
  let editorComponent: MonacoEditor;
  
  async function handleAnalyze() {
    editorStore.update(s => ({ ...s, isAnalyzing: true }));
    try {
      const result = await analyzeCode($editorStore.code, $editorStore.language);
      analysisStore.set(result);
      
      // Set markers in editor
      const markers = result.errors.map(e => ({
        startLineNumber: e.line,
        startColumn: 1,
        endLineNumber: e.line,
        endColumn: 100,
        message: e.message,
        severity: 8 // Error
      }));
      editorComponent.setMarkers(markers);
    } catch (error) {
      // Handle error
    } finally {
      editorStore.update(s => ({ ...s, isAnalyzing: false }));
    }
  }
  
  function handleCodeChange(event: CustomEvent<string>) {
    editorStore.update(s => ({ ...s, code: event.detail }));
  }
</script>

<div class="flex h-screen">
  <!-- Editor Section -->
  <div class="flex-1 flex flex-col">
    <EditorToolbar on:analyze={handleAnalyze} />
    <MonacoEditor
      bind:this={editorComponent}
      value={$editorStore.code}
      language={$editorStore.language}
      on:change={handleCodeChange}
    />
  </div>
  
  <!-- Analysis Panel -->
  <div class="w-96 border-l">
    <AnalysisPanel analysis={$analysisStore} />
  </div>
</div>
```

---

## Phase 9: Testing (Day 13-14)

### 9.1 Unit Tests

Create tests in `tests/unit/`:
- Store tests
- Service tests
- Component tests
- Utility function tests

### 9.2 Integration Tests

Test complete flows:
- Code input and analysis
- Fix application
- Settings persistence
- API error handling

### 9.3 E2E Tests

Create Playwright tests in `tests/e2e/`:
- Full user journey
- Different languages
- Error scenarios
- Responsive design

---

## Phase 10: Deployment (Day 15)

### 10.1 Vercel Configuration

Create `vercel.json`:
```json
{
  "framework": "sveltekit",
  "regions": ["iad1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

### 10.2 Environment Variables

Set up in Vercel dashboard:
- `PUBLIC_APP_NAME` = "Code Analyzer"
- `PUBLIC_APP_VERSION` = "1.0.0"

### 10.3 Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

---

## Implementation Checklist

### Phase 1: Project Setup
- [ ] Initialize SvelteKit project
- [ ] Install dependencies
- [ ] Configure Tailwind CSS
- [ ] Set up project structure

### Phase 2: Core UI Components
- [ ] Create Button component
- [ ] Create Card component
- [ ] Create Tabs component
- [ ] Create Modal component
- [ ] Create Toast component
- [ ] Create layout structure
- [ ] Implement theme system

### Phase 3: Monaco Editor
- [ ] Integrate Monaco Editor
- [ ] Create editor toolbar
- [ ] Implement language selector
- [ ] Add marker support

### Phase 4: State Management
- [ ] Create editor store
- [ ] Create analysis store
- [ ] Create settings store
- [ ] Define TypeScript types

### Phase 5: AI Integration
- [ ] Implement OpenAI service
- [ ] Implement Claude service
- [ ] Create analysis prompts
- [ ] Build analyzer service

### Phase 6: Analysis UI
- [ ] Create AnalysisPanel
- [ ] Create ErrorList
- [ ] Create SuggestionCard
- [ ] Create CodeDiff view

### Phase 7: Settings
- [ ] Create settings page
- [ ] Build API key manager
- [ ] Add first-time setup modal

### Phase 8: Main Page
- [ ] Build main application page
- [ ] Connect all components
- [ ] Add error handling
- [ ] Implement loading states

### Phase 9: Testing
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Write E2E tests

### Phase 10: Deployment
- [ ] Configure Vercel
- [ ] Set up CI/CD
- [ ] Deploy to production

---

## Timeline Summary

| Phase | Days | Description |
|-------|------|-------------|
| 1 | 1 | Project Setup |
| 2 | 2 | Core UI Components |
| 3 | 2 | Monaco Editor Integration |
| 4 | 1 | State Management |
| 5 | 2 | AI Integration |
| 6 | 2 | Analysis UI Components |
| 7 | 1 | Settings & API Key Management |
| 8 | 1 | Main Application Page |
| 9 | 2 | Testing |
| 10 | 1 | Deployment |
| **Total** | **15** | **Complete Implementation** |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Monaco Editor bundle size | Use dynamic imports and code splitting |
| AI API rate limits | Implement debouncing and caching |
| API key security | Store in localStorage, never log or transmit |
| Browser compatibility | Test on major browsers, use polyfills |
| Performance issues | Use Web Workers for heavy processing |

---

## Success Criteria

1. Users can paste code and receive analysis within 5 seconds
2. All 5 languages are fully supported
3. One-click fixes work correctly
4. Settings persist across sessions
5. Mobile-responsive design
6. Lighthouse score > 90
7. Zero critical security vulnerabilities