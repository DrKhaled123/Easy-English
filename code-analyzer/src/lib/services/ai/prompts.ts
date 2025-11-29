import type { SupportedLanguage, AnalysisResult } from '$lib/types';

export function buildAnalysisPrompt(code: string, language: SupportedLanguage): string {
	return `You are an expert code reviewer specializing in ${language}. Analyze the following code for:

1. **ERRORS**: Syntax errors, bugs, runtime issues, and logical problems that would cause the code to fail or behave incorrectly.

2. **WARNINGS**: Potential problems, code smells, anti-patterns, deprecated features, and suspicious code that might work but could cause issues.

3. **BEST PRACTICES**: Recommendations to follow industry standards, design patterns, and ${language}-specific best practices.

4. **CLEAN CODE**: Suggestions for improving readability, maintainability, naming conventions, code organization, and reducing complexity.

Provide your analysis in the following JSON format:
{
  "errors": [
    {
      "line": <line number>,
      "column": <optional column number>,
      "message": "<clear description of the error>",
      "severity": "error",
      "fix": "<corrected code snippet for this specific issue>",
      "ruleId": "<optional rule identifier>"
    }
  ],
  "warnings": [
    {
      "line": <line number>,
      "column": <optional column number>,
      "message": "<clear description of the warning>",
      "severity": "warning",
      "fix": "<suggested improvement>",
      "ruleId": "<optional rule identifier>"
    }
  ],
  "bestPractices": [
    {
      "category": "<category like 'Performance', 'Security', 'Maintainability', 'Accessibility'>",
      "message": "<specific recommendation>",
      "example": "<code example demonstrating the best practice>"
    }
  ],
  "cleanCode": [
    {
      "issue": "<description of the code smell or readability issue>",
      "recommendation": "<how to improve it>",
      "refactored": "<refactored code snippet>",
      "line": <optional line number where the issue occurs>
    }
  ],
  "fixedCode": "<complete corrected version of the entire code with all issues fixed>"
}

Code to analyze:
\`\`\`${language}
${code}
\`\`\`

Important guidelines:
- Be thorough but focus on real issues, not minor style preferences
- Provide actionable fixes that can be directly applied
- Include accurate line numbers (1-indexed)
- The fixedCode should be a complete, working version with all issues resolved
- If the code is already good, still provide best practices and clean code suggestions
- For each error/warning, explain why it's a problem
- Prioritize security and correctness issues`;
}

export function parseAIResponse(
	response: string,
	originalCode: string,
	language: SupportedLanguage
): AnalysisResult {
	// Try to extract JSON from the response
	let jsonStr = response;
	
	// Handle markdown code blocks
	const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
	if (jsonMatch) {
		jsonStr = jsonMatch[1].trim();
	}
	
	// Try to find JSON object in the response
	const objectMatch = jsonStr.match(/\{[\s\S]*\}/);
	if (objectMatch) {
		jsonStr = objectMatch[0];
	}

	try {
		const parsed = JSON.parse(jsonStr);

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
	} catch (e) {
		console.error('Failed to parse AI response:', e);
		console.error('Response was:', response);
		
		// Return empty result on parse failure
		return {
			id: crypto.randomUUID(),
			timestamp: new Date(),
			language,
			originalCode,
			errors: [{
				line: 1,
				message: 'Failed to parse AI response. Please try again.',
				severity: 'error'
			}],
			warnings: [],
			bestPractices: [],
			cleanCode: []
		};
	}
}

export const SYSTEM_PROMPT = `You are an expert code reviewer and software engineer with deep knowledge of:
- JavaScript/TypeScript (ES6+, Node.js, React, Vue, Svelte)
- Python (3.x, best practices, PEP standards)
- HTML5 and semantic markup
- CSS3, modern layouts, accessibility

Your role is to analyze code and provide constructive, actionable feedback. Always:
1. Be specific about issues and their locations
2. Explain why something is a problem
3. Provide working code fixes
4. Consider security, performance, and maintainability
5. Follow language-specific conventions and best practices

Respond only in valid JSON format as specified in the user prompt.`;