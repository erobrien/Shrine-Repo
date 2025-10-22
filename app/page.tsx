import { client } from "@/lib/sanity";

interface Peptide {
  _id: string;
  name: string;
  description?: string;
  category?: string;
}

export default async function Home() {
  // Fetch peptides from Sanity
  const peptides = await client.fetch(`*[_type=="peptide"]{
    _id,
    name,
    description,
    category
  }`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                🧬 PeptideDojo
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">Peptides</a>
              <a href="#" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">Protocols</a>
              <a href="#" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">Research</a>
              <a href="#" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">About</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Master the Art of Peptide Research
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
              Your comprehensive platform for peptide education, research protocols, and scientific discovery. 
              Join thousands of researchers advancing peptide science.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                Start Learning
              </button>
              <button className="border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 px-8 py-3 rounded-lg font-semibold transition-colors">
                Browse Peptides
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Peptides Grid */}
      <section className="py-16 bg-white/50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
            Featured Peptides
          </h3>
          
          {peptides.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {peptides.slice(0, 6).map((peptide: Peptide) => (
                <div key={peptide._id} className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    {peptide.name}
                  </h4>
                  {peptide.description && (
                    <p className="text-slate-600 dark:text-slate-300 mb-4">
                      {peptide.description}
                    </p>
                  )}
                  {peptide.category && (
                    <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm px-3 py-1 rounded-full">
                      {peptide.category}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-300 text-lg">
                No peptides found. Add some content in your Sanity Studio!
              </p>
              <a 
                href="http://localhost:3002" 
                className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Open Sanity Studio
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧬</span>
              </div>
              <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Peptide Database</h4>
              <p className="text-slate-600 dark:text-slate-300">Comprehensive information on peptide compounds, mechanisms, and applications.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Research Protocols</h4>
              <p className="text-slate-600 dark:text-slate-300">Step-by-step protocols and methodologies for peptide research.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎓</span>
              </div>
              <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Education</h4>
              <p className="text-slate-600 dark:text-slate-300">Learning resources and scientific documentation for all skill levels.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h5 className="text-xl font-bold mb-4">🧬 PeptideDojo</h5>
            <p className="text-slate-400 mb-4">Advancing peptide research through education and collaboration.</p>
            <div className="flex justify-center space-x-6">
              <a href="https://github.com/erobrien/Shrine-Repo" className="text-slate-400 hover:text-white transition-colors">
                GitHub
              </a>
              <a href="http://localhost:3002" className="text-slate-400 hover:text-white transition-colors">
                Sanity Studio
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
