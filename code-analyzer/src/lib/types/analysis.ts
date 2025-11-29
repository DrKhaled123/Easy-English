export type Severity = 'error' | 'warning' | 'info';

export interface CodeError {
	line: number;
	column?: number;
	endLine?: number;
	endColumn?: number;
	message: string;
	severity: Severity;
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
	language: SupportedLanguage;
	originalCode: string;
	errors: CodeError[];
	warnings: CodeError[];
	bestPractices: BestPractice[];
	cleanCode: CleanCodeSuggestion[];
	fixedCode?: string;
}

export type SupportedLanguage = 'javascript' | 'typescript' | 'python' | 'html' | 'css';

export interface LanguageConfig {
	id: SupportedLanguage;
	name: string;
	extension: string;
	icon: string;
	monacoLanguage: string;
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
	{
		id: 'javascript',
		name: 'JavaScript',
		extension: '.js',
		icon: 'js',
		monacoLanguage: 'javascript'
	},
	{
		id: 'typescript',
		name: 'TypeScript',
		extension: '.ts',
		icon: 'ts',
		monacoLanguage: 'typescript'
	},
	{
		id: 'python',
		name: 'Python',
		extension: '.py',
		icon: 'py',
		monacoLanguage: 'python'
	},
	{
		id: 'html',
		name: 'HTML',
		extension: '.html',
		icon: 'html',
		monacoLanguage: 'html'
	},
	{
		id: 'css',
		name: 'CSS',
		extension: '.css',
		icon: 'css',
		monacoLanguage: 'css'
	}
];