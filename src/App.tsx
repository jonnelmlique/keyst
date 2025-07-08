import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ThemeProvider } from './hooks/ThemeProvider';
import ThemeToggle from './components/ThemeToggle';
import PasswordDisplay from './components/PasswordDisplay';
import type { PasswordDisplayRef } from './components/PasswordDisplay';
import PasswordOptionsComponent from './components/PasswordOptions';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import { generatePassword } from './utils/password';
import { LockIcon, ShieldIcon, SettingsIcon, RefreshIcon, PrivacyIcon, SpeedIcon } from './components/Icons';
import type { PasswordOptions } from './types';

function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    includeExtendedSymbols: false,
    excludeAmbiguous: false,
    avoidSequential: true,
    ensureComplexity: true,
  });

  const passwordDisplayRef = useRef<PasswordDisplayRef>(null);
  const hasGeneratedInitialPassword = useRef(false);

  const handleGenerate = useCallback(() => {
    try {
      const newPassword = generatePassword(options);
      setPassword(newPassword);
    } catch (error) {
      console.error('Error generating password:', error);
    }
  }, [options]);

  const handleCopy = () => {
    if (passwordDisplayRef.current) {
      passwordDisplayRef.current.handleCopy();
    }
  };

  const handlePasswordSelect = (selectedPassword: string) => {
    setPassword(selectedPassword);
  };

  const canGenerate = options.includeUppercase || options.includeLowercase || options.includeNumbers || options.includeSymbols;

  // Generate password when needed
  useEffect(() => {
    if (canGenerate) {
      // Generate initial password if we haven't yet
      if (!hasGeneratedInitialPassword.current) {
        try {
          const initialPassword = generatePassword(options);
          setPassword(initialPassword);
          hasGeneratedInitialPassword.current = true;
        } catch (error) {
          console.error('Error generating initial password:', error);
        }
      }
      // Auto-regenerate when options change (but only if we already have a password)
      else if (hasGeneratedInitialPassword.current) {
        try {
          const newPassword = generatePassword(options);
          setPassword(newPassword);
        } catch (error) {
          console.error('Error regenerating password:', error);
        }
      }
    }
  }, [options, canGenerate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-gray-900 dark:to-indigo-950 transition-all duration-300">
      <KeyboardShortcuts onGenerate={handleGenerate} onCopy={handleCopy} />
      <ThemeToggle />
      
      {/* Background Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-500/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-400/5 dark:bg-purple-500/3 rounded-full blur-2xl animate-bounce-subtle"></div>
      </div>
      
      <div className="relative container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            className="flex items-center justify-center gap-6 mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-3">
                <LockIcon className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-xl">
                <ShieldIcon className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="text-left">
              <motion.h1 
                className="text-6xl md:text-7xl font-black bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 dark:from-gray-100 dark:via-indigo-100 dark:to-purple-100 bg-clip-text text-transparent"
                animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                Keyst
              </motion.h1>
              <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
                Password Generator
              </div>
            </div>
          </motion.div>
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Create unbreakable passwords with advanced security features, real-time breach detection, and cryptographic strength analysis
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex items-center justify-center gap-8 text-sm"
          >
            <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-full">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="font-medium text-emerald-700 dark:text-emerald-300">Zero-Knowledge</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="font-medium text-blue-700 dark:text-blue-300">Breach Protected</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-full">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="font-medium text-purple-700 dark:text-purple-300">Military Grade</span>
            </div>
          </motion.div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
          {/* Password Display */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-8 order-2 lg:order-1"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
                <LockIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Generated Password
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Cryptographically secure • Real-time analysis
                </p>
              </div>
            </div>
            <PasswordDisplay 
              ref={passwordDisplayRef}
              password={password} 
              onRegenerate={handleGenerate}
              onPasswordSelect={handlePasswordSelect}
            />
          </motion.div>

          {/* Password Options */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-8 order-1 lg:order-2"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <SettingsIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Security Options
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Customize strength • Advanced patterns
                </p>
              </div>
            </div>
            <PasswordOptionsComponent options={options} onOptionsChange={setOptions} />
          </motion.div>
        </div>

        {/* Generate Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="btn-primary px-16 py-5 text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-4 shadow-2xl"
          >
            <RefreshIcon className="w-7 h-7" />
            Generate New Password
          </motion.button>
          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400 space-y-2">
            <p className="font-medium">Keyboard shortcuts:</p>
            <div className="flex items-center justify-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Ctrl/Cmd + G</kbd>
                <span>Generate</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Ctrl/Cmd + C</kbd>
                <span>Copy</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-20 text-center space-y-12"
        >
          <div className="glass-effect p-10 rounded-3xl max-w-6xl mx-auto border border-gray-200/50 dark:border-gray-700/50">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="group">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                    <ShieldIcon className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Security First</h4>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Advanced cryptography with real-time breach detection and comprehensive security analysis
                </p>
              </div>
              <div className="group">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                    <PrivacyIcon className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Privacy Protected</h4>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Zero-knowledge architecture - all passwords generated locally with no data transmission
                </p>
              </div>
              <div className="group">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                    <SpeedIcon className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Modern Tech</h4>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Built with cutting-edge React, TypeScript, and advanced security libraries
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>© 2025 Keyst Password Generator. Open source, privacy-focused, and built for security.</p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PasswordGenerator />
    </ThemeProvider>
  );
}
