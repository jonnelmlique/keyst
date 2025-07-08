import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { copyToClipboard, calculatePasswordStrength } from '../utils/password';
import { checkPasswordBreach, estimateCrackingTime } from '../utils/security';
import { CopyIcon, RefreshIcon, CheckIcon, MicroscopeIcon, ChevronDownIcon, WarningIcon, ShieldIcon } from './Icons';
import SecurityAudit from './SecurityAudit';
import AdvancedSecurityScanner from './AdvancedSecurityScanner';
import PasswordHistory from './PasswordHistory';

interface PasswordDisplayProps {
  password: string;
  onRegenerate: () => void;
  onPasswordSelect?: (password: string) => void;
}

export interface PasswordDisplayRef {
  handleCopy: () => void;
}

const PasswordDisplay = forwardRef<PasswordDisplayRef, PasswordDisplayProps>(
  ({ password, onRegenerate, onPasswordSelect }, ref) => {
    const [copied, setCopied] = useState(false);
    const [isCheckingBreach, setIsCheckingBreach] = useState(false);
    const [breachInfo, setBreachInfo] = useState<{ isBreached: boolean; count: number } | null>(null);
    const [showAdvancedAnalysis, setShowAdvancedAnalysis] = useState(false);
    
    const strength = calculatePasswordStrength(password);
    const crackingTime = password ? estimateCrackingTime(password) : '';

    const handleCopy = async () => {
      const success = await copyToClipboard(password);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    };

    const handlePasswordSelect = (selectedPassword: string) => {
      if (onPasswordSelect) {
        onPasswordSelect(selectedPassword);
      }
    };

    // Check for breaches when password changes
    useEffect(() => {
      if (password && password.length > 0) {
        setIsCheckingBreach(true);
        checkPasswordBreach(password)
          .then((result) => {
            setBreachInfo(result);
          })
          .finally(() => {
            setIsCheckingBreach(false);
          });
      } else {
        setBreachInfo(null);
      }
    }, [password]);

    useImperativeHandle(ref, () => ({
      handleCopy,
    }));

    const getPasswordDisplayClass = () => {
      if (!password) return 'input-field font-mono text-lg min-h-[4rem] flex items-center justify-center text-center break-all relative';
      
      const baseClass = 'input-field font-mono text-lg min-h-[4rem] flex items-center justify-center text-center break-all relative transition-all duration-300';
      
      if (breachInfo?.isBreached) {
        return `${baseClass} border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20`;
      } else if (strength.score >= 80) {
        return `${baseClass} border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20`;
      } else if (strength.score >= 60) {
        return `${baseClass} border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20`;
      } else {
        return `${baseClass} border-yellow-500 dark:border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20`;
      }
    };

    return (
      <div className="space-y-6">
        {/* Password Display */}
        <div className="relative">
          <div className={getPasswordDisplayClass()}>
            {password ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full px-2"
              >
                {password}
              </motion.div>
            ) : (
              <div className="text-gray-500 dark:text-gray-400">
                Generated password will appear here...
              </div>
            )}
          </div>
          
          {/* Security Badges - moved outside the password display */}
          {password && (
            <div className="flex justify-center gap-2 mt-3">
              {breachInfo?.isBreached && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="danger-badge text-xs flex items-center gap-1"
                >
                  <WarningIcon className="w-3 h-3" />
                  BREACHED
                </motion.div>
              )}
              {strength.score >= 80 && !breachInfo?.isBreached && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="security-badge text-xs flex items-center gap-1"
                >
                  <ShieldIcon className="w-3 h-3" />
                  SECURE
                </motion.div>
              )}
              {strength.score >= 95 && !breachInfo?.isBreached && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="security-badge text-xs animate-pulse-glow flex items-center gap-1"
                >
                  <CheckIcon className="w-3 h-3" />
                  PERFECT
                </motion.div>
              )}
            </div>
          )}
          
          <AnimatePresence>
            {copied && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.8 }}
                className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg z-10"
              >
                <div className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4" />
                  Copied to clipboard!
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Password Analysis Dashboard */}
        {password && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {/* Strength Indicator */}
            <div className="glass-card p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Strength</span>
                <span className="text-sm font-bold">{strength.label}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${strength.score}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`h-3 rounded-full ${strength.color} shadow-sm`}
                />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                {strength.score}/100
              </div>
            </div>

            {/* Breach Status */}
            <div className="glass-card p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Security</span>
                {isCheckingBreach ? (
                  <div className="animate-spin w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full"></div>
                ) : null}
              </div>
              {breachInfo ? (
                <div className={`text-center ${breachInfo.isBreached ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                  {breachInfo.isBreached ? (
                    <div>
                      <div className="text-2xl">🚨</div>
                      <div className="text-xs mt-1">
                        {breachInfo.count.toLocaleString()} breaches
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-2xl">🛡️</div>
                      <div className="text-xs mt-1">No breaches found</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <div className="text-2xl">⏳</div>
                  <div className="text-xs mt-1">Checking...</div>
                </div>
              )}
            </div>

            {/* Crack Time */}
            <div className="glass-card p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Crack Time</span>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {crackingTime.includes('years') ? '∞' : crackingTime}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {crackingTime.includes('years') ? 'Practically uncrackable' : 'Estimated time'}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCopy}
            disabled={!password}
            className="btn-primary flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed h-12"
          >
            <CopyIcon className="w-5 h-5" />
            {copied ? 'Copied!' : 'Copy Password'}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRegenerate}
            className="btn-secondary flex items-center justify-center gap-3 h-12"
          >
            <RefreshIcon className="w-5 h-5" />
            Regenerate
          </motion.button>
        </div>

        {/* Advanced Analysis Toggle */}
        {password && (
          <motion.button
            onClick={() => setShowAdvancedAnalysis(!showAdvancedAnalysis)}
            className="w-full p-3 text-center text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors duration-200 border border-blue-200/50 dark:border-blue-700/50"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center justify-center gap-2">
              <MicroscopeIcon className="w-5 h-5" />
              <span className="font-medium">
                {showAdvancedAnalysis ? 'Hide' : 'Show'} Advanced Security Analysis
              </span>
              <motion.div
                animate={{ rotate: showAdvancedAnalysis ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDownIcon className="w-4 h-4" />
              </motion.div>
            </div>
          </motion.button>
        )}

        {/* Advanced Security Analysis */}
        <AnimatePresence>
          {showAdvancedAnalysis && password && (
            <AdvancedSecurityScanner password={password} />
          )}
        </AnimatePresence>

        {/* Security Audit */}
        <SecurityAudit password={password} />

        {/* Password History */}
        <PasswordHistory 
          currentPassword={password} 
          onSelectPassword={handlePasswordSelect}
        />
      </div>
    );
  }
);

PasswordDisplay.displayName = 'PasswordDisplay';

export default PasswordDisplay;
