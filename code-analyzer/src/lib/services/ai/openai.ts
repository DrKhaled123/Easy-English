import OpenAI from 'openai';
import type { AnalysisResult, SupportedLanguage } from '$lib/types';
import { buildAnalysisPrompt, parseAIResponse, SYSTEM_PROMPT } from './prompts';

export async function analyzeWithOpenAI(
	code: string,
	language: SupportedLanguage,
	apiKey: string
): Promise<AnalysisResult> {
	const openai = new OpenAI({
		apiKey,
		dangerouslyAllowBrowser: true
	});

	try {
		const response = await openai.chat.completions.create({
			model: 'gpt-4-turbo-preview',
			messages: [
				{ role: 'system', content: SYSTEM_PROMPT },
				{ role: 'user', content: buildAnalysisPrompt(code, language) }
			],
			response_format: { type: 'json_object' },
			temperature: 0.3,
			max_tokens: 4096
		});

		const content = response.choices[0]?.message?.content;
		if (!content) {
			throw new Error('No response content from OpenAI');
		}

		return parseAIResponse(content, code, language);
	} catch (error) {
		if (error instanceof OpenAI.APIError) {
			if (error.status === 401) {
				throw new Error('Invalid OpenAI API key. Please check your settings.');
			}
			if (error.status === 429) {
				throw new Error('Rate limit exceeded. Please wait a moment and try again.');
			}
			if (error.status === 500) {
				throw new Error('OpenAI service error. Please try again later.');
			}
			throw new Error(`OpenAI API error: ${error.message}`);
		}
		throw error;
	}
}

export async function validateOpenAIKey(apiKey: string): Promise<boolean> {
	const openai = new OpenAI({
		apiKey,
		dangerouslyAllowBrowser: true
	});

	try {
		await openai.models.list();
		return true;
	} catch {
		return false;
	}
}