"use client";

import { useState, useEffect } from 'react';
import { FaSearch, FaTimes, FaSadTear } from 'react-icons/fa'; // Added FaSadTear for no results icon
import { motion } from 'framer-motion';
import { debounce } from 'lodash';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Debounced search function to limit API calls
  const handleSearch = debounce(async (query) => {
    setLoading(true);
    setError(null);
    setResults([]);

    if (!query) return;

    try {
      const response = await fetch(`/api/search?query=${query}`);
      const data = await response.json();
      if (response.ok) {
        setResults(data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch results');
    } finally {
      setLoading(false);
    }
  }, 500); // Delay of 500ms to avoid too many requests

  // UseEffect to trigger search whenever query changes
  useEffect(() => {
    handleSearch(query);
  }, [query]);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-r from-blue-500 to-teal-400'} flex flex-col items-center justify-center px-4 sm:px-8 transition-all duration-300`}>
      <div className="w-full max-w-xl p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Dork Searcher</h1>
          <button onClick={() => setDarkMode(!darkMode)} className="text-teal-600 dark:text-teal-400">
            {darkMode ? 'Light' : 'Dark'} Mode
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for dorks"
            className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
          />
          <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          {query && (
            <FaTimes
              onClick={() => setQuery('')}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 cursor-pointer"
            />
          )}
        </div>

        {loading && (
          <div className="flex justify-center">
            <div className="animate-spin border-t-4 border-teal-500 border-solid w-8 h-8 rounded-full"></div>
          </div>
        )}

        {error && <p className="text-red-500 text-center">{error}</p>}

        <motion.div
          className="mt-6 space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {results.length > 0 ? (
            <ul className="space-y-3">
              {results.map((result) => (
                <motion.li
                  key={result.id}
                  className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <strong className="text-xl text-gray-900 dark:text-white">{result.query}</strong>
                  <p className="text-gray-700 dark:text-gray-300 mt-1">{result.description}</p>
                </motion.li>
              ))}
            </ul>
          ) : (
            !loading && (
              <div className="flex flex-col items-center space-y-4">
                <FaSadTear className="text-5xl text-gray-500 dark:text-gray-400" />
                <p className="text-center text-gray-700 dark:text-gray-300">
                  No results found. Try a different query.
                </p>
              </div>
            )
          )}
        </motion.div>
      </div>
    </div>
  );
}
