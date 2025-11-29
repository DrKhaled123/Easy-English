export type AIProvider = 'openai' | 'claude';
export type Theme = 'light' | 'dark';

export interface Settings {
	openaiKey: string;
	claudeKey: string;
	preferredAI: AIProvider;
	theme: Theme;
	autoAnalyze: boolean;
	fontSize: number;
	tabSize: number;
	wordWrap: boolean;
	minimap: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
	openaiKey: '',
	claudeKey: '',
	preferredAI: 'openai',
	theme: 'dark',
	autoAnalyze: false,
	fontSize: 14,
	tabSize: 2,
	wordWrap: true,
	minimap: false
};

export interface APIKeyValidation {
	isValid: boolean;
	error?: string;
}