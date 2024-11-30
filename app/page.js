"use client";

import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setResults([]);

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
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-teal-400 flex flex-col items-center justify-center text-white">
      <div className="w-full max-w-xl p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-900">Dork Searcher</h1>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter a dork query"
          className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button
          onClick={handleSearch}
          className="w-full bg-teal-600 text-white p-2 rounded-lg focus:ring-2 focus:ring-teal-500"
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="mt-6 space-y-4">
          {results.length > 0 ? (
            <ul className="space-y-3">
              {results.map((result) => (
                <li key={result.id} className="p-4 bg-gray-100 rounded-lg shadow-md">
                  <strong className="text-xl">{result.query}</strong>
                  <p className="text-gray-700 mt-1">{result.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-700">No results found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
