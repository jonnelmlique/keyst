import { createContext } from 'react';
import type { ThemeMode } from '../types';

export interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
