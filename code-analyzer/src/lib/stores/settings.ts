import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { Settings } from '$lib/types';
import { DEFAULT_SETTINGS } from '$lib/types';

const STORAGE_KEY = 'code-analyzer-settings';

function loadSettings(): Settings {
	if (!browser) return DEFAULT_SETTINGS;
	
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
		}
	} catch (e) {
		console.error('Failed to load settings:', e);
	}
	
	return DEFAULT_SETTINGS;
}

function saveSettings(settings: Settings): void {
	if (!browser) return;
	
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
	} catch (e) {
		console.error('Failed to save settings:', e);
	}
}

function createSettingsStore() {
	const { subscribe, set, update } = writable<Settings>(loadSettings());

	return {
		subscribe,
		set: (value: Settings) => {
			saveSettings(value);
			set(value);
		},
		update: (fn: (settings: Settings) => Settings) => {
			update((current) => {
				const newSettings = fn(current);
				saveSettings(newSettings);
				return newSettings;
			});
		},
		setOpenAIKey: (key: string) => {
			update((s) => {
				const newSettings = { ...s, openaiKey: key };
				saveSettings(newSettings);
				return newSettings;
			});
		},
		setClaudeKey: (key: string) => {
			update((s) => {
				const newSettings = { ...s, claudeKey: key };
				saveSettings(newSettings);
				return newSettings;
			});
		},
		setPreferredAI: (provider: 'openai' | 'claude') => {
			update((s) => {
				const newSettings = { ...s, preferredAI: provider };
				saveSettings(newSettings);
				return newSettings;
			});
		},
		setTheme: (theme: 'light' | 'dark') => {
			update((s) => {
				const newSettings = { ...s, theme };
				saveSettings(newSettings);
				return newSettings;
			});
		},
		toggleTheme: () => {
			update((s) => {
				const newSettings = { ...s, theme: s.theme === 'dark' ? 'light' : 'dark' };
				saveSettings(newSettings);
				return newSettings;
			});
		},
		reset: () => {
			saveSettings(DEFAULT_SETTINGS);
			set(DEFAULT_SETTINGS);
		}
	};
}

export const settingsStore = createSettingsStore();