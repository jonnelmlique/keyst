export const THEME_STORAGE_KEY = 'keyst-theme';
export const THEME_MODES = ['light', 'dark', 'system'] as const;
export type ThemeMode = typeof THEME_MODES[number];
