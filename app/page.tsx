import { client } from "@/lib/sanity";

interface Peptide {
  _id: string;
  name: string;
  description?: string;
  category?: {
    name: string;
    color: string;
    icon: string;
  };
  featured?: boolean;
  images?: Array<{
    asset: {
      _ref: string;
    };
    alt?: string;
  }>;
}

interface Category {
  _id: string;
  name: string;
  color: string;
  icon: string;
  description?: string;
  featured?: boolean;
}

export default async function Home() {
  // Fetch featured peptides and categories from Sanity
  const [featuredPeptides, categories] = await Promise.all([
    client.fetch(`*[_type=="peptide" && featured == true][0...6]{
      _id,
      name,
      description,
      featured,
      "category": category->{
        name,
        color,
        icon
      },
      "images": images[0...1]{
        asset->{
          _ref
        },
        alt
      }
    }`),
    client.fetch(`*[_type=="category" && featured == true]{
      _id,
      name,
      color,
      icon,
      description,
      featured
    }`)
  ]);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">PD</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                PeptideDojo
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Peptides</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Protocols</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Research</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Education</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">About</a>
            </nav>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Master the Art of<br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Peptide Research
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Your comprehensive platform for peptide education, research protocols, and scientific discovery. 
              Join thousands of researchers advancing peptide science with cutting-edge tools and knowledge.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105">
                Start Learning Now
              </button>
              <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 rounded-lg font-semibold text-lg transition-all">
                Browse Peptides
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Explore by Category
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover peptides organized by research focus and application areas
            </p>
          </div>
          
          {categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category: Category) => (
                <div key={category._id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl mr-4 bg-${category.color}-100 text-${category.color}-600`}>
                      {category.icon}
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h4>
                  </div>
                  {category.description && (
                    <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                      {category.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No categories found. Add some content in your Sanity Studio!
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

      {/* Featured Peptides Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Peptides
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the most important and well-researched peptides in our database
            </p>
          </div>
          
          {featuredPeptides.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPeptides.map((peptide: Peptide) => (
                <div key={peptide._id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer group">
                  {peptide.images && peptide.images.length > 0 ? (
                    <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-6xl">🧬</span>
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-6xl">🧬</span>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {peptide.name}
                      </h4>
                      {peptide.category && (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${peptide.category.color}-100 text-${peptide.category.color}-800`}>
                          {peptide.category.name}
                        </span>
                      )}
                    </div>
                    {peptide.description && (
                      <p className="text-gray-600 group-hover:text-gray-700 transition-colors line-clamp-3">
                        {peptide.description}
                      </p>
                    )}
                    <div className="mt-4 flex items-center text-blue-600 group-hover:text-blue-700 transition-colors">
                      <span className="text-sm font-medium">Learn More</span>
                      <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No featured peptides found. Add some content in your Sanity Studio!
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
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose PeptideDojo?
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools and resources for peptide research and education
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🧬</span>
              </div>
              <h4 className="text-2xl font-semibold text-gray-900 mb-4">Comprehensive Database</h4>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                Access detailed information on hundreds of peptides, their mechanisms, and applications.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">📚</span>
              </div>
              <h4 className="text-2xl font-semibold text-gray-900 mb-4">Research Protocols</h4>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                Step-by-step protocols and methodologies validated by leading researchers.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🎓</span>
              </div>
              <h4 className="text-2xl font-semibold text-gray-900 mb-4">Education Platform</h4>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                Learn from experts with courses, tutorials, and interactive learning modules.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-white mb-4">
            Ready to Advance Your Research?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of researchers using PeptideDojo to accelerate their discoveries
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105">
              Start Free Trial
            </button>
            <button className="border border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all">
              View Pricing
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">PD</span>
                </div>
                <h5 className="text-2xl font-bold text-white">PeptideDojo</h5>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Advancing peptide research through education, collaboration, and cutting-edge tools for researchers worldwide.
              </p>
              <div className="flex space-x-4">
                <a href="https://github.com/erobrien/Shrine-Repo" className="text-gray-400 hover:text-white transition-colors">
                  GitHub
                </a>
                <a href="http://localhost:3002" className="text-gray-400 hover:text-white transition-colors">
                  Sanity Studio
                </a>
              </div>
            </div>
            
            <div>
              <h6 className="text-white font-semibold mb-4">Resources</h6>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Peptide Database</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Research Protocols</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Education Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h6 className="text-white font-semibold mb-4">Support</h6>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 PeptideDojo. All rights reserved. Built with Sanity.io and Next.js.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
