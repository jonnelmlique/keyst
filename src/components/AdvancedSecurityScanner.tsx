import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { estimateCrackingTime } from '../utils/security';

interface AdvancedSecurityScannerProps {
  password: string;
}

interface SecurityMetrics {
  entropy: number;
  diversity: number;
  patterns: string[];
  commonWords: string[];
  strength: 'very-weak' | 'weak' | 'fair' | 'good' | 'strong' | 'very-strong';
  crackingTime: string;
  recommendations: string[];
}

export default function AdvancedSecurityScanner({ password }: AdvancedSecurityScannerProps) {
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (!password || password.length === 0) {
      setMetrics(null);
      return;
    }

    setIsScanning(true);
    
    // Simulate scanning delay for UX
    const timer = setTimeout(() => {
      const analysis = analyzePassword(password);
      setMetrics(analysis);
      setIsScanning(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [password]);

  const analyzePassword = (pwd: string): SecurityMetrics => {
    // Calculate entropy
    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSymbol = /[^a-zA-Z0-9]/.test(pwd);
    
    const charset = 
      (hasLower ? 26 : 0) +
      (hasUpper ? 26 : 0) +
      (hasNumber ? 10 : 0) +
      (hasSymbol ? 32 : 0);
    
    const entropy = Math.log2(charset) * pwd.length;
    
    // Calculate character diversity
    const uniqueChars = new Set(pwd).size;
    const diversity = (uniqueChars / pwd.length) * 100;
    
    // Detect patterns
    const patterns: string[] = [];
    if (/(.)\1{2,}/.test(pwd)) patterns.push('Repeated characters');
    if (/123|234|345|456|567|678|789|890/.test(pwd)) patterns.push('Sequential numbers');
    if (/abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/gi.test(pwd)) patterns.push('Sequential letters');
    if (/qwerty|asdf|zxcv|1234|password/gi.test(pwd)) patterns.push('Keyboard patterns');
    
    // Detect common words
    const commonWords: string[] = [];
    const commonPatterns = [
      'password', 'admin', 'login', 'user', 'root', 'pass', 'test', 'guest',
      'welcome', 'secret', 'master', 'key', 'god', 'love', 'money', 'sex'
    ];
    
    commonPatterns.forEach(word => {
      if (pwd.toLowerCase().includes(word)) {
        commonWords.push(word);
      }
    });
    
    // Determine strength
    let strength: SecurityMetrics['strength'] = 'very-weak';
    if (entropy >= 80 && diversity >= 70 && patterns.length === 0 && commonWords.length === 0) {
      strength = 'very-strong';
    } else if (entropy >= 60 && diversity >= 60 && patterns.length <= 1) {
      strength = 'strong';
    } else if (entropy >= 45 && diversity >= 50) {
      strength = 'good';
    } else if (entropy >= 30) {
      strength = 'fair';
    } else if (entropy >= 15) {
      strength = 'weak';
    }
    
    // Generate recommendations
    const recommendations: string[] = [];
    if (pwd.length < 12) recommendations.push('Use at least 12 characters');
    if (!hasLower) recommendations.push('Add lowercase letters');
    if (!hasUpper) recommendations.push('Add uppercase letters');
    if (!hasNumber) recommendations.push('Add numbers');
    if (!hasSymbol) recommendations.push('Add special symbols');
    if (diversity < 60) recommendations.push('Use more unique characters');
    if (patterns.length > 0) recommendations.push('Avoid predictable patterns');
    if (commonWords.length > 0) recommendations.push('Avoid common dictionary words');
    
    return {
      entropy: Math.round(entropy),
      diversity: Math.round(diversity),
      patterns,
      commonWords,
      strength,
      crackingTime: estimateCrackingTime(pwd),
      recommendations
    };
  };

  const getStrengthColor = (strength: SecurityMetrics['strength']) => {
    switch (strength) {
      case 'very-weak': return 'text-red-600 dark:text-red-400';
      case 'weak': return 'text-red-500 dark:text-red-400';
      case 'fair': return 'text-yellow-500 dark:text-yellow-400';
      case 'good': return 'text-blue-500 dark:text-blue-400';
      case 'strong': return 'text-green-500 dark:text-green-400';
      case 'very-strong': return 'text-green-600 dark:text-green-300';
      default: return 'text-gray-500';
    }
  };

  const getStrengthIcon = (strength: SecurityMetrics['strength']) => {
    switch (strength) {
      case 'very-weak': 
        return (
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'weak': 
        return (
          <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'fair': 
        return (
          <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'good': 
        return (
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'strong': 
        return (
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case 'very-strong': 
        return (
          <svg className="w-8 h-8 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      default: 
        return (
          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-700/50"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            Advanced Security Analysis
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Deep cryptographic analysis of your password
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isScanning ? (
          <motion.div
            key="scanning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center py-8"
          >
            <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
              <div className="animate-spin w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full"></div>
              <span className="font-medium">Analyzing security patterns...</span>
            </div>
          </motion.div>
        ) : metrics ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Security Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg text-center">
                <div className="h-12 flex items-center justify-center text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {metrics.entropy}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Entropy (bits)
                </div>
              </div>
              
              <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg text-center">
                <div className="h-12 flex items-center justify-center text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {metrics.diversity}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Diversity
                </div>
              </div>
              
              <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg text-center">
                <div className={`flex items-center justify-center h-12 ${getStrengthColor(metrics.strength)}`}>
                  {getStrengthIcon(metrics.strength)}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Strength
                </div>
              </div>
              
              <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg text-center">
                <div className="h-12 flex items-center justify-center text-lg font-bold text-green-600 dark:text-green-400">
                  {metrics.crackingTime.includes('years') ? '∞' : metrics.crackingTime.split(' ')[0]}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Crack Time
                </div>
              </div>
            </div>

            {/* Issues and Warnings */}
            {(metrics.patterns.length > 0 || metrics.commonWords.length > 0) && (
              <div className="space-y-2">
                {metrics.patterns.length > 0 && (
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-start gap-2">
                      <span className="text-yellow-500 text-lg">⚠️</span>
                      <div>
                        <div className="font-medium text-yellow-800 dark:text-yellow-200 text-sm">
                          Detected Patterns
                        </div>
                        <div className="text-sm text-yellow-700 dark:text-yellow-300">
                          {metrics.patterns.join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {metrics.commonWords.length > 0 && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-start gap-2">
                      <span className="text-red-500 text-lg">🚨</span>
                      <div>
                        <div className="font-medium text-red-800 dark:text-red-200 text-sm">
                          Common Words Detected
                        </div>
                        <div className="text-sm text-red-700 dark:text-red-300">
                          Contains: {metrics.commonWords.join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Recommendations */}
            {metrics.recommendations.length > 0 && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 text-lg">💡</span>
                  <div>
                    <div className="font-medium text-blue-800 dark:text-blue-200 text-sm mb-2">
                      Security Recommendations
                    </div>
                    <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                      {metrics.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Perfect Score */}
            {metrics.strength === 'very-strong' && metrics.recommendations.length === 0 && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-green-500 text-2xl">🛡️</span>
                  <div>
                    <div className="font-semibold text-green-800 dark:text-green-200">
                      Excellent Password Security!
                    </div>
                    <div className="text-sm text-green-700 dark:text-green-300">
                      This password meets all security best practices and provides exceptional protection.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
