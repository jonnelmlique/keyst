export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  includeExtendedSymbols: boolean;
  excludeAmbiguous: boolean;
  avoidSequential: boolean;
  ensureComplexity: boolean;
}

export interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  feedback: string[];
}

export interface SecurityValidation {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
}

export type ThemeMode = 'light' | 'dark';
