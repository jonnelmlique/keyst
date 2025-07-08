import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { NewsIcon, BackIcon, ShieldIcon, WarningIcon } from './Icons';
import { Link } from 'react-router-dom';

interface BreachNewsItem {
  title: string;
  source: string;
  date: string;
  description: string;
  fullDescription?: string;
  affectedAccounts?: number;
  compromisedData?: string[];
  addedDate?: string;
  dataClasses?: string[];
  isVerified?: boolean;
}

interface BreachNewsProps {
  isHomepage?: boolean;
}

export default function DataBreachNews({ isHomepage = false }: BreachNewsProps) {
  const [selectedBreach, setSelectedBreach] = useState<BreachNewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [breachNews, setBreachNews] = useState<BreachNewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [savedScrollPosition, setSavedScrollPosition] = useState(0);
  const breachesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only fetch data when not on homepage
    if (!isHomepage) {
      fetchBreachNews();
    }
  }, [isHomepage]);
  
  const fetchBreachNews = async () => {
    try {
      // Using free HaveIBeenPwned API for the latest breaches
      // Note: This is limited but doesn't require authentication
      const response = await fetch('https://haveibeenpwned.com/api/v3/breaches');
      
      if (!response.ok) {
        throw new Error('Failed to fetch breach data');
      }
      
      const data = await response.json();
      
      // Transform and sort by breach date (most recent first)
      const formattedNews: BreachNewsItem[] = data
        .map((breach: any) => ({
          title: breach.Name,
          source: breach.Domain || 'Unknown',
          date: new Date(breach.BreachDate).toLocaleDateString(),
          description: breach.Description.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
          fullDescription: breach.Description.replace(/<[^>]*>/g, ''),
          affectedAccounts: breach.PwnCount,
          compromisedData: breach.DataClasses || [],
          addedDate: new Date(breach.AddedDate).toLocaleDateString(),
          dataClasses: breach.DataClasses || [],
          isVerified: breach.IsVerified
        }))
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 20); // Show up to 20 items
      
      setBreachNews(formattedNews);
    } catch (err) {
      console.error('Error fetching breach news:', err);
      setError('Unable to load breach data. Try again later.');
      
      // Fallback data in case API fails
      setBreachNews([
        {
          title: 'Example Breach',
          source: 'example.com',
          date: new Date().toLocaleDateString(),
          description: 'This is sample data shown when the API is unavailable. In a real scenario, this would contain information about a recent data breach.',
          fullDescription: 'This is sample data shown when the API is unavailable. In a real scenario, this would contain detailed information about a recent data breach, including what was compromised and how many accounts were affected.',
          affectedAccounts: 1000000,
          compromisedData: ['Email addresses', 'Passwords', 'Names'],
          addedDate: new Date().toLocaleDateString(),
          dataClasses: ['Email addresses', 'Passwords', 'Names'],
          isVerified: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // For the homepage, just show a simple link box
  if (isHomepage) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-6"
      >
        <Link
          to="/data-breaches"
          className="w-full flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl border border-red-200/50 dark:border-red-700/50 hover:shadow-md hover:scale-[1.01] active:scale-[0.98] transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <NewsIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-gray-100">
                Latest Data Breaches
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Stay informed about recent security incidents
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-xs sm:text-sm text-blue-600 dark:text-blue-400">
              View all →
            </span>
          </div>
        </Link>
      </motion.div>
    );
  }

  // Restore scroll position when going back from breach detail
  useEffect(() => {
    if (!selectedBreach && savedScrollPosition > 0) {
      setTimeout(() => {
        window.scrollTo(0, savedScrollPosition);
      }, 0);
    }
  }, [selectedBreach, savedScrollPosition]);

  // For the standalone page view with breach details
  if (selectedBreach) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <motion.button
          onClick={() => {
            setSelectedBreach(null);
            // When going back to list, the scroll position will be restored by the useEffect
          }}
          className="flex items-center gap-2 mb-6 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
          whileHover={{ x: -5 }}
        >
          <BackIcon className="w-5 h-5" />
          <span>Back to all breaches</span>
        </motion.button>

        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl">
              <NewsIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {selectedBreach.title}
              </h2>
              <div className="flex flex-wrap items-center gap-x-3 mt-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedBreach.source}
                </span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Breached: {selectedBreach.date}
                </span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Added: {selectedBreach.addedDate}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="flex-1 border-b sm:border-b-0 sm:border-r border-orange-200 dark:border-orange-800 pb-4 sm:pb-0 sm:pr-6">
                <div className="text-sm text-gray-500 dark:text-gray-400">Affected Accounts</div>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {selectedBreach.affectedAccounts?.toLocaleString() || 'Unknown'}
                </div>
              </div>
              <div className="flex-1 pt-4 sm:pt-0 sm:pl-6">
                <div className="text-sm text-gray-500 dark:text-gray-400">Verification Status</div>
                <div className="flex items-center gap-2 text-lg font-semibold">
                  {selectedBreach.isVerified ? (
                    <>
                      <ShieldIcon className="w-5 h-5 text-green-500" />
                      <span className="text-green-600 dark:text-green-400">Verified</span>
                    </>
                  ) : (
                    <>
                      <WarningIcon className="w-5 h-5 text-yellow-500" />
                      <span className="text-yellow-600 dark:text-yellow-400">Unverified</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Description</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {selectedBreach.fullDescription}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Compromised Data</h3>
              <div className="flex flex-wrap gap-2">
                {selectedBreach.dataClasses?.map((dataType, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-full text-sm"
                  >
                    {dataType}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Security Recommendations</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li className="text-gray-700 dark:text-gray-300">Change your password for {selectedBreach.source} immediately</li>
                <li className="text-gray-700 dark:text-gray-300">If you used the same password elsewhere, change those too</li>
                <li className="text-gray-700 dark:text-gray-300">Enable two-factor authentication where possible</li>
                <li className="text-gray-700 dark:text-gray-300">Monitor your accounts for suspicious activity</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // For the standalone page list view
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto"
      ref={breachesContainerRef}
    >
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl">
            <NewsIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Latest Data Breaches
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Stay informed about recent security incidents and protect your online accounts
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin w-6 h-6 border-2 border-red-400 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading breach data...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-500 dark:text-red-400">
            {error}
          </div>
        ) : (
          breachNews.map((news, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 bg-white/70 dark:bg-gray-800/50 rounded-lg border border-gray-200/30 dark:border-gray-700/30 hover:shadow-md hover:bg-white/90 dark:hover:bg-gray-800/70 transition-all duration-200 cursor-pointer"
              onClick={() => {
                // Save current scroll position before viewing breach details
                setSavedScrollPosition(window.scrollY);
                setSelectedBreach(news);
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {news.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>{news.source}</span>
                    <span>•</span>
                    <span>{news.date}</span>
                    {news.affectedAccounts && (
                      <>
                        <span>•</span>
                        <span className="text-red-600 dark:text-red-400">
                          {news.affectedAccounts.toLocaleString()} accounts affected
                        </span>
                      </>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {news.description}
                  </p>
                </div>
              </div>
              <div className="mt-3 text-right">
                <span className="inline-block text-xs font-medium text-blue-600 dark:text-blue-400 transition-colors">
                  View details →
                </span>
              </div>
            </motion.div>
          ))
        )}
        
        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg mt-6">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            If you suspect your data has been compromised, change your passwords immediately and enable two-factor authentication where possible.
          </p>
          <a
            href="https://haveibeenpwned.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors block mt-2"
          >
            Data powered by HaveIBeenPwned
          </a>
        </div>
      </div>
    </motion.div>
  );
}
