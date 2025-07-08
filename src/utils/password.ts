import type { PasswordOptions, PasswordStrength, SecurityValidation } from '../types';

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const EXTENDED_SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?~`"\'\\/?';

// Ambiguous characters that might be confused
const AMBIGUOUS = '0O1lI|`';

// Common weak patterns to avoid
const WEAK_PATTERNS = [
  /(.)\1{2,}/g, // Same character repeated 3+ times
  /123|234|345|456|567|678|789|890/g, // Sequential numbers
  /abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/gi, // Sequential letters
  /password|123456|qwerty|admin|login|user|root|pass|test/gi, // Common weak words
];

/**
 * Validates password strength and ensures it meets security requirements
 */
function isPasswordSecure(password: string): boolean {
  // Check for weak patterns
  for (const pattern of WEAK_PATTERNS) {
    if (pattern.test(password)) {
      return false;
    }
  }
  
  // Ensure good character distribution
  const charTypes = [
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^a-zA-Z0-9]/.test(password)
  ].filter(Boolean).length;
  
  return charTypes >= 2; // At least 2 character types
}

/**
 * Generates a secure password based on provided options with enhanced security
 */
export function generatePassword(options: PasswordOptions): string {
  // Input validation
  if (options.length < 4 || options.length > 128) {
    throw new Error('Password length must be between 4 and 128 characters');
  }
  
  let charset = '';
  
  if (options.includeUppercase) {
    charset += UPPERCASE;
  }
  
  if (options.includeLowercase) {
    charset += LOWERCASE;
  }
  
  if (options.includeNumbers) {
    charset += NUMBERS;
  }
  
  if (options.includeSymbols) {
    charset += options.includeExtendedSymbols ? EXTENDED_SYMBOLS : SYMBOLS;
  }
  
  if (options.excludeAmbiguous) {
    charset = charset.split('').filter(char => !AMBIGUOUS.includes(char)).join('');
  }
  
  if (charset === '') {
    throw new Error('At least one character type must be selected');
  }
  
  let password = '';
  let attempts = 0;
  const maxAttempts = 100; // Prevent infinite loops
  
  do {
    password = '';
    
    // Ensure at least one character from each selected type
    const requiredChars: string[] = [];
    
    if (options.includeUppercase) {
      const upperChars = options.excludeAmbiguous ? 
        UPPERCASE.split('').filter(char => !AMBIGUOUS.includes(char)) : 
        UPPERCASE.split('');
      requiredChars.push(upperChars[Math.floor(Math.random() * upperChars.length)]);
    }
    
    if (options.includeLowercase) {
      const lowerChars = options.excludeAmbiguous ? 
        LOWERCASE.split('').filter(char => !AMBIGUOUS.includes(char)) : 
        LOWERCASE.split('');
      requiredChars.push(lowerChars[Math.floor(Math.random() * lowerChars.length)]);
    }
    
    if (options.includeNumbers) {
      const numberChars = options.excludeAmbiguous ? 
        NUMBERS.split('').filter(char => !AMBIGUOUS.includes(char)) : 
        NUMBERS.split('');
      requiredChars.push(numberChars[Math.floor(Math.random() * numberChars.length)]);
    }
    
    if (options.includeSymbols) {
      const symbolChars = options.includeExtendedSymbols ? EXTENDED_SYMBOLS : SYMBOLS;
      const symbols = options.excludeAmbiguous ? 
        symbolChars.split('').filter(char => !AMBIGUOUS.includes(char)) : 
        symbolChars.split('');
      requiredChars.push(symbols[Math.floor(Math.random() * symbols.length)]);
    }
    
    // Generate the rest of the password
    const array = new Uint8Array(options.length);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < options.length; i++) {
      password += charset[array[i] % charset.length];
    }
    
    // Insert required characters at random positions
    for (let i = 0; i < requiredChars.length && i < password.length; i++) {
      const randomPos = Math.floor(Math.random() * password.length);
      password = password.substring(0, randomPos) + requiredChars[i] + password.substring(randomPos + 1);
    }
    
    attempts++;
    
    if (attempts >= maxAttempts) {
      console.warn('Max attempts reached for password generation');
      break;
    }    } while (!isPasswordSecure(password) && attempts < maxAttempts);
  
  return password;
}

/**
 * Enhanced password strength calculation with detailed feedback
 */
export function calculatePasswordStrength(password: string): PasswordStrength {
  let score = 0;
  const feedback: string[] = [];
  
  // Length scoring
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  if (password.length >= 20) score += 1;
  
  if (password.length < 8) {
    feedback.push('Use at least 8 characters');
  }
  
  // Character variety scoring
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);
  
  if (hasLower) score += 1;
  if (hasUpper) score += 1;
  if (hasNumber) score += 1;
  if (hasSymbol) score += 1;
  
  if (!hasLower) feedback.push('Add lowercase letters');
  if (!hasUpper) feedback.push('Add uppercase letters');
  if (!hasNumber) feedback.push('Add numbers');
  if (!hasSymbol) feedback.push('Add symbols');
  
  // Complexity bonuses
  const uniqueChars = new Set(password).size;
  const uniqueRatio = uniqueChars / password.length;
  
  if (uniqueRatio >= 0.7) score += 1;
  if (uniqueRatio >= 0.8) score += 1;
  
  // Penalty for weak patterns
  let hasWeakPattern = false;
  for (const pattern of WEAK_PATTERNS) {
    if (pattern.test(password)) {
      hasWeakPattern = true;
      break;
    }
  }
  
  if (hasWeakPattern) {
    score -= 2;
    feedback.push('Avoid predictable patterns');
  }
  
  // Entropy calculation
  const charset = 
    (hasLower ? 26 : 0) +
    (hasUpper ? 26 : 0) +
    (hasNumber ? 10 : 0) +
    (hasSymbol ? 32 : 0);
  
  const entropy = Math.log2(charset) * password.length;
  
  if (entropy >= 60) score += 1;
  if (entropy >= 80) score += 1;
  
  // Normalize to 0-100
  const normalizedScore = Math.max(0, Math.min(Math.round((score / 12) * 100), 100));
  
  let label = '';
  let color = '';
  
  if (normalizedScore < 25) {
    label = 'Very Weak';
    color = 'bg-red-600';
  } else if (normalizedScore < 50) {
    label = 'Weak';
    color = 'bg-red-500';
  } else if (normalizedScore < 70) {
    label = 'Fair';
    color = 'bg-yellow-500';
  } else if (normalizedScore < 85) {
    label = 'Good';
    color = 'bg-blue-500';
  } else if (normalizedScore < 95) {
    label = 'Strong';
    color = 'bg-green-500';
  } else {
    label = 'Very Strong';
    color = 'bg-green-600';
  }
  
  return { score: normalizedScore, label, color, feedback };
}

/**
 * Validates password against security best practices
 */
export function validatePasswordSecurity(password: string): SecurityValidation {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  // Check minimum length
  if (password.length < 8) {
    issues.push('Password is too short');
    suggestions.push('Use at least 8 characters');
  }
  
  // Check for common weak patterns
  if (/(.)\1{2,}/.test(password)) {
    issues.push('Contains repeated characters');
    suggestions.push('Avoid repeating the same character multiple times');
  }
  
  if (/123|234|345|456|567|678|789|890/.test(password)) {
    issues.push('Contains sequential numbers');
    suggestions.push('Avoid sequential number patterns');
  }
  
  if (/abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/gi.test(password)) {
    issues.push('Contains sequential letters');
    suggestions.push('Avoid sequential letter patterns');
  }
  
  if (/password|123456|qwerty|admin|login|user|root|pass|test/gi.test(password)) {
    issues.push('Contains common weak words');
    suggestions.push('Avoid common dictionary words');
  }
  
  // Check character variety
  const charTypes = [
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^a-zA-Z0-9]/.test(password)
  ].filter(Boolean).length;
  
  if (charTypes < 3) {
    issues.push('Limited character variety');
    suggestions.push('Use a mix of letters, numbers, and symbols');
  }
  
  // Check entropy
  const uniqueChars = new Set(password).size;
  if (uniqueChars < password.length * 0.6) {
    issues.push('Low character diversity');
    suggestions.push('Use more unique characters');
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    suggestions
  };
}

/**
 * Copies text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
}

/**
 * Gets system theme preference
 */
export function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
