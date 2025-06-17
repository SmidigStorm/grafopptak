'use client';

import { useState, useEffect } from 'react';
import SimpleGraph from '@/app/components/SimpleGraph';

export default function GraphPage() {
  const [graphData, setGraphData] = useState({ nodes: [], relationships: [] });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadGraph = async (query = '') => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/graph?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to fetch graph data');
      
      const data = await response.json();
      setGraphData(data);
    } catch (err) {
      setError('Kunne ikke laste grafdata. Sjekk at Neo4j kjører.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGraph();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadGraph(searchQuery);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Graf Visualisering</h1>
        
        {/* Søkefelt */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Søk etter noder (f.eks. Person, Utdanning)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Laster...' : 'Søk'}
            </button>
          </div>
        </form>

        {/* Feilmelding */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Graf */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm" style={{ height: '600px' }}>
          {!loading && !error && (
            <SimpleGraph
              nodes={graphData.nodes}
              relationships={graphData.relationships}
              className="w-full h-full"
            />
          )}
        </div>

        {/* Info */}
        <div className="mt-6 text-sm text-gray-600">
          <p>Visualisering av {graphData.nodes.length} noder og {graphData.relationships.length} relasjoner</p>
          <p className="mt-2">Tips: Klikk og dra noder for å organisere grafen</p>
        </div>
      </div>
    </div>
  );
}