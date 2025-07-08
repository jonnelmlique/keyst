import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { assessPasswordSecurity } from '../utils/security';

interface SecurityAssessment {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
  isBreached: boolean;
  breachCount: number;
  recommendations: string[];
}

interface SecurityAuditProps {
  password: string;
}

export default function SecurityAudit({ password }: SecurityAuditProps) {
  const [securityAssessment, setSecurityAssessment] = useState<SecurityAssessment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (password && password.length > 0) {
      setIsLoading(true);
      assessPasswordSecurity(password)
        .then(setSecurityAssessment)
        .finally(() => setIsLoading(false));
    } else {
      setSecurityAssessment(null);
    }
  }, [password]);

  if (!password || !securityAssessment) return null;

  const getSecurityScoreColor = (isValid: boolean, isBreached: boolean) => {
    if (isBreached) return 'text-red-600 dark:text-red-400';
    if (isValid) return 'text-green-600 dark:text-green-400';
    return 'text-yellow-600 dark:text-yellow-400';
  };

  const getSecurityScoreIcon = (isValid: boolean, isBreached: boolean) => {
    if (isBreached) {
      return (
        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    }
    if (isValid) {
      return (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    return (
      <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  const getSecurityLevel = (isValid: boolean, isBreached: boolean) => {
    if (isBreached) return 'COMPROMISED';
    if (isValid) return 'SECURE';
    return 'WEAK';
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="mt-4 space-y-3"
    >
      {/* Security Status Header */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50 hover:shadow-md transition-all duration-200"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center gap-3">
          <div className={`text-2xl ${getSecurityScoreColor(securityAssessment.isValid, securityAssessment.isBreached)}`}>
            {getSecurityScoreIcon(securityAssessment.isValid, securityAssessment.isBreached)}
          </div>
          <div className="text-left">
            <div className={`font-semibold ${getSecurityScoreColor(securityAssessment.isValid, securityAssessment.isBreached)}`}>
              {getSecurityLevel(securityAssessment.isValid, securityAssessment.isBreached)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {isLoading ? 'Analyzing...' : 'Click for detailed analysis'}
            </div>
          </div>
        </div>
        <motion.svg
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </motion.button>

      {/* Detailed Analysis */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 overflow-hidden"
          >
            {/* Breach Information */}
            {securityAssessment.isBreached && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-red-800 dark:text-red-200">
                      Security Breach Alert
                    </div>
                    <div className="text-sm text-red-700 dark:text-red-300 mt-1">
                      This password appears in {securityAssessment.breachCount.toLocaleString()} known data breaches.
                      <strong className="block mt-1">Do not use this password!</strong>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Security Issues */}
            {securityAssessment.issues.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                      Security Issues Found
                    </div>
                    <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
                      {securityAssessment.issues.map((issue: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-yellow-500 mt-0.5">•</span>
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Recommendations */}
            {securityAssessment.recommendations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                      Security Recommendations
                    </div>
                    <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                      {securityAssessment.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {/* All Good */}
            {securityAssessment.isValid && !securityAssessment.isBreached && securityAssessment.issues.length === 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-green-800 dark:text-green-200">
                      Excellent Security
                    </div>
                    <div className="text-sm text-green-700 dark:text-green-300 mt-1">
                      This password meets all security requirements and has not been found in any known data breaches.
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Security Tips */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg"
            >                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                  <div className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Security Best Practices
                  </div>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-start gap-2">
                      <span className="text-gray-500 mt-0.5">•</span>
                      Use unique passwords for every account
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-500 mt-0.5">•</span>
                      Enable two-factor authentication when available
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-500 mt-0.5">•</span>
                      Store passwords in a reputable password manager
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-500 mt-0.5">•</span>
                      Regularly update important passwords
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
