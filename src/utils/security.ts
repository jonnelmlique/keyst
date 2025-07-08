/**
 * Security utilities for password validation and breach checking
 */

import { validatePasswordSecurity } from './password';

/**
 * Checks if a password has been compromised in known data breaches
 * Uses the HaveIBeenPwned API with k-anonymity
 */
export async function checkPasswordBreach(password: string): Promise<{ isBreached: boolean; count: number }> {
  try {
    // Use SHA-1 hash for HaveIBeenPwned API
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    
    // Send only first 5 characters to maintain k-anonymity
    const prefix = hashHex.substring(0, 5);
    const suffix = hashHex.substring(5);
    
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Keyst-Password-Generator',
      },
    });
    
    if (!response.ok) {
      throw new Error('Breach check service unavailable');
    }
    
    const text = await response.text();
    const lines = text.split('\n');
    
    for (const line of lines) {
      const [hashSuffix, count] = line.split(':');
      if (hashSuffix === suffix) {
        return { isBreached: true, count: parseInt(count, 10) };
      }
    }
    
    return { isBreached: false, count: 0 };
  } catch (error) {
    console.error('Error checking password breach:', error);
    // Return false if service is unavailable - don't block password generation
    return { isBreached: false, count: 0 };
  }
}

/**
 * Comprehensive password security assessment
 */
export async function assessPasswordSecurity(password: string) {
  const validation = validatePasswordSecurity(password);
  const breachCheck = await checkPasswordBreach(password);
  
  return {
    ...validation,
    isBreached: breachCheck.isBreached,
    breachCount: breachCheck.count,
    recommendations: [
      ...validation.suggestions,
      ...(breachCheck.isBreached ? ['This password has been found in data breaches - avoid using it'] : [])
    ]
  };
}

/**
 * Secure memory clearing for sensitive data
 */
export function clearSensitiveData(obj: string | Record<string, unknown>): string | Record<string, unknown> {
  if (typeof obj === 'string') {
    // For strings, we can't actually clear memory in JS, but we can at least not reference it
    return '';
  }
  
  if (typeof obj === 'object' && obj !== null) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        obj[key] = null;
      }
    }
    return obj;
  }
  
  return obj;
}

/**
 * Generates a cryptographically secure random salt
 */
export function generateSecureRandom(length: number): Uint8Array {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return array;
}

/**
 * Estimates password cracking time based on entropy
 */
export function estimateCrackingTime(password: string): string {
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);
  
  const charset = 
    (hasLower ? 26 : 0) +
    (hasUpper ? 26 : 0) +
    (hasNumber ? 10 : 0) +
    (hasSymbol ? 32 : 0);
  
  const entropy = Math.log2(Math.pow(charset, password.length));
  
  // Assuming 1 billion guesses per second
  const guessesPerSecond = 1e9;
  const secondsToGuess = Math.pow(2, entropy - 1) / guessesPerSecond;
  
  if (secondsToGuess < 60) {
    return 'Less than 1 minute';
  } else if (secondsToGuess < 3600) {
    return `${Math.round(secondsToGuess / 60)} minutes`;
  } else if (secondsToGuess < 86400) {
    return `${Math.round(secondsToGuess / 3600)} hours`;
  } else if (secondsToGuess < 31536000) {
    return `${Math.round(secondsToGuess / 86400)} days`;
  } else if (secondsToGuess < 31536000000) {
    return `${Math.round(secondsToGuess / 31536000)} years`;
  } else {
    return 'Millions of years';
  }
}
