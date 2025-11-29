import Anthropic from '@anthropic-ai/sdk';
import type { AnalysisResult, SupportedLanguage } from '$lib/types';
import { buildAnalysisPrompt, parseAIResponse, SYSTEM_PROMPT } from './prompts';

export async function analyzeWithClaude(
	code: string,
	language: SupportedLanguage,
	apiKey: string
): Promise<AnalysisResult> {
	const anthropic = new Anthropic({
		apiKey,
		dangerouslyAllowBrowser: true
	});

	try {
		const response = await anthropic.messages.create({
			model: 'claude-3-5-sonnet-20241022',
			max_tokens: 4096,
			system: SYSTEM_PROMPT,
			messages: [{ role: 'user', content: buildAnalysisPrompt(code, language) }]
		});

		const content = response.content[0];
		if (content.type !== 'text') {
			throw new Error('Unexpected response format from Claude');
		}

		return parseAIResponse(content.text, code, language);
	} catch (error) {
		if (error instanceof Anthropic.APIError) {
			if (error.status === 401) {
				throw new Error('Invalid Claude API key. Please check your settings.');
			}
			if (error.status === 429) {
				throw new Error('Rate limit exceeded. Please wait a moment and try again.');
			}
			if (error.status === 500) {
				throw new Error('Claude service error. Please try again later.');
			}
			throw new Error(`Claude API error: ${error.message}`);
		}
		throw error;
	}
}

export async function validateClaudeKey(apiKey: string): Promise<boolean> {
	const anthropic = new Anthropic({
		apiKey,
		dangerouslyAllowBrowser: true
	});

	try {
		// Make a minimal API call to validate the key
		await anthropic.messages.create({
			model: 'claude-3-5-sonnet-20241022',
			max_tokens: 10,
			messages: [{ role: 'user', content: 'Hi' }]
		});
		return true;
	} catch {
		return false;
	}
}