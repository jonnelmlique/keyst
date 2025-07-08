import { motion, AnimatePresence } from 'framer-motion';
import { UppercaseIcon, LowercaseIcon, NumberIcon, SymbolIcon, EyeOffIcon, ChartBarIcon, ShieldIcon, ExtendedSymbolIcon } from './Icons';
import type { PasswordOptions } from '../types';

interface PasswordOptionsProps {
  options: PasswordOptions;
  onOptionsChange: (options: PasswordOptions) => void;
}

export default function PasswordOptionsComponent({ options, onOptionsChange }: PasswordOptionsProps) {
  const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const length = parseInt(e.target.value);
    onOptionsChange({ ...options, length });
  };

  const handleCheckboxChange = (key: keyof PasswordOptions) => {
    onOptionsChange({ ...options, [key]: !options[key] });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Customize Your Password
      </h3>

      {/* Password Length */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password Length
            </label>
            <div className="text-2xl font-bold gradient-text">{options.length}</div>
          </div>
        </div>
        
        <div className="space-y-3">
          <input
            type="range"
            min="4"
            max="128"
            value={options.length}
            onChange={handleLengthChange}
            className="w-full h-3 slider"
          />
          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <span>4</span>
              <span className="text-red-500">Weak</span>
            </span>
            <span className="flex items-center gap-1">
              <span>12</span>
              <span className="text-yellow-500">Good</span>
            </span>
            <span className="flex items-center gap-1">
              <span>20</span>
              <span className="text-green-500">Strong</span>
            </span>
            <span className="flex items-center gap-1">
              <span>128</span>
              <span className="text-blue-500">Max</span>
            </span>
          </div>
          
          {/* Length recommendations */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className={`p-2 rounded-lg text-center transition-all duration-200 ${
              options.length >= 8 && options.length < 12 
                ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
            }`}>
              <div className="font-medium">8-11 chars</div>
              <div>Basic</div>
            </div>
            <div className={`p-2 rounded-lg text-center transition-all duration-200 ${
              options.length >= 12 && options.length < 20 
                ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
            }`}>
              <div className="font-medium">12-19 chars</div>
              <div>Recommended</div>
            </div>
            <div className={`p-2 rounded-lg text-center transition-all duration-200 ${
              options.length >= 20 && options.length < 32 
                ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
            }`}>
              <div className="font-medium">20-31 chars</div>
              <div>Strong</div>
            </div>
            <div className={`p-2 rounded-lg text-center transition-all duration-200 ${
              options.length >= 32 
                ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
            }`}>
              <div className="font-medium">32+ chars</div>
              <div>Maximum</div>
            </div>
          </div>
        </div>
      </div>

      {/* Character Options */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Character Types
        </h4>
        
        <div className="space-y-2">
          {[
            { 
              key: 'includeUppercase' as const, 
              label: 'Uppercase Letters', 
              example: 'ABCDEFG', 
              icon: <UppercaseIcon className="w-5 h-5 text-blue-600" />
            },
            { 
              key: 'includeLowercase' as const, 
              label: 'Lowercase Letters', 
              example: 'abcdefg', 
              icon: <LowercaseIcon className="w-5 h-5 text-green-600" />
            },
            { 
              key: 'includeNumbers' as const, 
              label: 'Numbers', 
              example: '0123456', 
              icon: <NumberIcon className="w-5 h-5 text-purple-600" />
            },
            { 
              key: 'includeSymbols' as const, 
              label: 'Special Symbols', 
              example: '!@#$%^&', 
              icon: <SymbolIcon className="w-5 h-5 text-red-600" />
            },
          ].map((option) => (
            <motion.label
              key={option.key}
              className="flex items-center gap-3 p-4 glass-card cursor-pointer hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <input
                type="checkbox"
                checked={options[option.key]}
                onChange={() => handleCheckboxChange(option.key)}
                className="checkbox-field"
              />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  {option.icon}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {option.label}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-1">
                    {option.example}
                  </div>
                </div>
              </div>
            </motion.label>
          ))}
        </div>
      </div>

      {/* Extended Symbol Option */}
      <AnimatePresence>
        {options.includeSymbols && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <motion.label
              className="flex items-center gap-3 p-4 glass-card cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all duration-300 border border-blue-200/50 dark:border-blue-700/50"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <input
                type="checkbox"
                checked={options.includeExtendedSymbols}
                onChange={() => handleCheckboxChange('includeExtendedSymbols')}
                className="checkbox-field"
              />
              <ExtendedSymbolIcon className="w-6 h-6 text-amber-500" />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Extended Symbol Set
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Includes quotes, backslashes, and additional special characters
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-500 font-mono mt-1">
                  ~`"'\/?
                </div>
              </div>
            </motion.label>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Security Options */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Advanced Security Options
        </h4>
        
        <div className="space-y-2">
          {[
            { 
              key: 'excludeAmbiguous' as const, 
              label: 'Exclude Ambiguous Characters', 
              desc: 'Avoids characters like 0, O, 1, l, I, |',
              icon: <EyeOffIcon className="w-5 h-5 text-yellow-600" />
            },
            { 
              key: 'avoidSequential' as const, 
              label: 'Avoid Sequential Patterns', 
              desc: 'Prevents abc, 123, and similar patterns',
              icon: <ChartBarIcon className="w-5 h-5 text-orange-600" />
            },
            { 
              key: 'ensureComplexity' as const, 
              label: 'Ensure High Complexity', 
              desc: 'Guarantees strong character distribution',
              icon: <ShieldIcon className="w-5 h-5 text-green-600" />
            },
          ].map((option) => (
            <motion.label
              key={option.key}
              className="flex items-center gap-3 p-4 glass-card cursor-pointer hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <input
                type="checkbox"
                checked={options[option.key]}
                onChange={() => handleCheckboxChange(option.key)}
                className="checkbox-field"
              />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  {option.icon}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {option.label}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {option.desc}
                  </div>
                </div>
              </div>
            </motion.label>
          ))}
        </div>
      </div>

      {/* Validation Warning */}
      {!options.includeUppercase && !options.includeLowercase && !options.includeNumbers && !options.includeSymbols && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <div className="text-sm text-red-700 dark:text-red-400">
            Please select at least one character type to generate a password.
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
