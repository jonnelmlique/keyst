import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HistoryIcon, ChevronDownIcon } from './Icons';

interface PasswordHistoryProps {
  currentPassword: string;
  onSelectPassword: (password: string) => void;
}

export default function PasswordHistory({ currentPassword, onSelectPassword }: PasswordHistoryProps) {
  const [history, setHistory] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (currentPassword && !history.includes(currentPassword)) {
      setHistory(prev => [currentPassword, ...prev].slice(0, 5)); // Keep last 5 passwords
    }
  }, [currentPassword, history]);

  const handleClearHistory = () => {
    setHistory([]);
  };

  if (history.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="mt-4"
    >
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200/50 dark:border-gray-600/50 hover:shadow-md transition-all duration-200"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center gap-3">
          <div className="text-gray-600 dark:text-gray-400">
            <HistoryIcon className="w-5 h-5" />
          </div>
          <div className="text-left">
            <div className="font-medium text-gray-900 dark:text-gray-100">
              Recent Passwords
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {history.length} saved passwords
            </div>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDownIcon className="w-5 h-5 text-gray-400" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 space-y-2 overflow-hidden"
          >
            {history.map((password, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-200/30 dark:border-gray-600/30 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-sm text-gray-600 dark:text-gray-400 truncate">
                    {password}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {index === 0 ? 'Current' : `${index + 1} password${index > 0 ? 's' : ''} ago`}
                  </div>
                </div>
                <motion.button
                  onClick={() => onSelectPassword(password)}
                  className="ml-3 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-md transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Use
                </motion.button>
              </motion.div>
            ))}
            
            <motion.button
              onClick={handleClearHistory}
              className="w-full mt-3 p-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              Clear History
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
