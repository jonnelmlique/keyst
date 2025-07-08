import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from './hooks/ThemeProvider';
import ThemeToggleInline from './components/ThemeToggleInline';
import PasswordDisplay from './components/PasswordDisplay';
import type { PasswordDisplayRef } from './components/PasswordDisplay';
import PasswordOptionsComponent from './components/PasswordOptions';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import DataBreachNews from './components/DataBreachNews';
import { generatePassword } from './utils/password';
import { LockIcon, ShieldIcon, SettingsIcon, RefreshIcon, NewsIcon } from './components/Icons';
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
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-4 sm:mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-3">
                <LockIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-xl">
                <ShieldIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
            </div>
            <div className="text-center sm:text-left">
              <motion.h1 
                className="text-5xl sm:text-6xl md:text-7xl font-black bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 dark:from-gray-100 dark:via-indigo-100 dark:to-purple-100 bg-clip-text text-transparent"
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
            className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Create unbreakable passwords with advanced security features and real-time breach detection
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 mobile-flex-col items-center justify-center gap-3 sm:gap-8 text-xs sm:text-sm"
          >
            <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-full mb-2 sm:mb-0 w-full sm:w-auto">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="font-medium text-emerald-700 dark:text-emerald-300">Zero-Knowledge</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-2 sm:mb-0 w-full sm:w-auto">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="font-medium text-blue-700 dark:text-blue-300">Breach Protected</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-50 dark:bg-purple-900/20 rounded-full w-full sm:w-auto">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="font-medium text-purple-700 dark:text-purple-300">Military Grade</span>
            </div>
          </motion.div>
        </motion.div>

        <div className="grid gap-4 sm:gap-6 lg:gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
          {/* Password Display */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-4 sm:p-6 md:p-8 order-2 lg:order-1"
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
            <DataBreachNews isHomepage={true} />
          </motion.div>

          {/* Password Options */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-4 sm:p-6 md:p-8 order-1 lg:order-2"
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
            className="btn-primary px-8 sm:px-12 md:px-16 py-4 sm:py-5 text-lg sm:text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2 sm:gap-4 shadow-2xl"
          >
            <RefreshIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
            <span className="hidden xs:inline">Generate New Password</span>
            <span className="xs:hidden">Generate</span>
          </motion.button>
          <div className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-500 dark:text-gray-400 space-y-2">
            <p className="font-medium">Keyboard shortcuts:</p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-6 text-xs">
              <div className="flex items-center gap-1 sm:gap-2">
                <kbd className="px-1 sm:px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Ctrl/Cmd + G</kbd>
                <span>Generate</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <kbd className="px-1 sm:px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Ctrl/Cmd + C</kbd>
                <span>Copy</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Generate button is the last element in this component */}
      </div>
    </div>
  );
}

// Navigation component
function Navbar() {
  return (
    <nav className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md sticky top-0 z-10 shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
            <LockIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
          </div>
          <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Keyst</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-6">
          <div className="hidden sm:flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <LockIcon className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link to="/data-breaches" className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <NewsIcon className="w-4 h-4" />
              <span>Data Breaches</span>
            </Link>
          </div>
          
          {/* Mobile navigation */}
          <div className="flex sm:hidden items-center gap-3">
            <Link to="/" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
              <LockIcon className="w-5 h-5" />
            </Link>
            <Link to="/data-breaches" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
              <NewsIcon className="w-5 h-5" />
            </Link>
          </div>
          
          {/* Theme toggle button - inline instead of fixed position */}
          <ThemeToggleInline />
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
          <Navbar />
          <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12">
            <Routes>
              <Route path="/" element={<PasswordGenerator />} />
              <Route path="/data-breaches" element={<DataBreachNews isHomepage={false} />} />
            </Routes>
          </div>
          
          <footer className="py-6 border-t border-gray-200/50 dark:border-gray-800/50 mt-10">
            <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
              <p>© {new Date().getFullYear()} Keyst Password Generator. Open source, privacy-focused, and secure.</p>
            </div>
          </footer>
          
          {/* Note: Keyboard shortcuts handled within PasswordGenerator component */}
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
