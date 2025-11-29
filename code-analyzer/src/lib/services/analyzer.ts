import { get } from 'svelte/store';
import { settingsStore } from '$lib/stores';
import { analyzeWithOpenAI } from './ai/openai';
import { analyzeWithClaude } from './ai/claude';
import type { AnalysisResult, SupportedLanguage } from '$lib/types';

export async function analyzeCode(
	code: string,
	language: SupportedLanguage
): Promise<AnalysisResult> {
	const settings = get(settingsStore);

	// Check if code is empty
	if (!code.trim()) {
		throw new Error('Please enter some code to analyze.');
	}

	// Check if API key is configured
	if (settings.preferredAI === 'openai') {
		if (!settings.openaiKey) {
			throw new Error(
				'OpenAI API key not configured. Please add your API key in settings.'
			);
		}
		return analyzeWithOpenAI(code, language, settings.openaiKey);
	} else {
		if (!settings.claudeKey) {
			throw new Error(
				'Claude API key not configured. Please add your API key in settings.'
			);
		}
		return analyzeWithClaude(code, language, settings.claudeKey);
	}
}

export function hasApiKey(): boolean {
	const settings = get(settingsStore);
	return !!(settings.openaiKey || settings.claudeKey);
}

export function getPreferredProvider(): 'openai' | 'claude' | null {
	const settings = get(settingsStore);
	
	if (settings.preferredAI === 'openai' && settings.openaiKey) {
		return 'openai';
	}
	if (settings.preferredAI === 'claude' && settings.claudeKey) {
		return 'claude';
	}
	if (settings.openaiKey) {
		return 'openai';
	}
	if (settings.claudeKey) {
		return 'claude';
	}
	return null;
}