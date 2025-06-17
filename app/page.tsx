import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Grafopptak</h1>
        <p className="text-lg text-gray-600 mb-8">
          Velkommen til opptakssystemet for høyere utdanning
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link 
            href="/graph"
            className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">📊 Graf Visualisering</h2>
            <p className="text-gray-600">
              Utforsk relasjoner mellom søkere, utdanninger og institusjoner
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}