import { client } from "@/lib/sanity";
import Image from "next/image";

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
    <div className="min-h-screen" style={{backgroundColor: '#F5F5F5'}}>
      {/* Header - Dark Background */}
      <header className="sticky top-0 z-50" style={{backgroundColor: '#0A0A0A'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <span className="text-2xl font-bold" style={{color: '#DC2626'}}>PEPTIDE</span>
                <span className="text-2xl font-bold text-white ml-1">DOJO</span>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <div className="relative group">
                <button className="text-white hover:text-gray-300 transition-colors font-medium">
                  Peptide Information
                </button>
              </div>
              <div className="relative group">
                <button className="text-white hover:text-gray-300 transition-colors font-medium">
                  Peptide Research
                </button>
              </div>
            </nav>
            <div className="flex items-center space-x-4">
              <button className="text-white hover:text-gray-300 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Gray Background */}
      <section className="py-20" style={{backgroundColor: '#878787'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Master Peptide Science
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Train your knowledge, elevate your understanding, achieve optimal health
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex">
              <input 
                type="text" 
                placeholder="Search peptides, research, conditions..."
                className="flex-1 px-6 py-4 rounded-l-lg border-0 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
              <button className="text-white px-8 py-4 rounded-r-lg font-semibold transition-colors" style={{backgroundColor: '#DC2626'}}>
                Search
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap justify-center items-center text-white text-sm space-x-8">
            <span>50+ Research Partners</span>
            <span>|</span>
            <span>10K+ Active Members</span>
            <span>|</span>
            <span>100% Science-Based</span>
            <span>|</span>
            <span>24/7 Expert Support</span>
          </div>
        </div>
      </section>

      {/* Explore Section - White Background */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Explore Peptide Dojo
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-300 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Peptides</h3>
              <p className="text-gray-600 mb-4">{featuredPeptides.length} items</p>
              <div className="font-medium" style={{color: '#DC2626'}}>View All →</div>
            </div>
            
            <div className="bg-white border border-gray-300 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Categories</h3>
              <p className="text-gray-600 mb-4">{categories.length} items</p>
              <div className="font-medium" style={{color: '#DC2626'}}>View All →</div>
            </div>
            
            <div className="bg-white border border-gray-300 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Research</h3>
              <p className="text-gray-600 mb-4">Studies & Protocols</p>
              <div className="font-medium" style={{color: '#DC2626'}}>View All →</div>
            </div>
            
            <div className="bg-white border border-gray-300 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Conditions</h3>
              <p className="text-gray-600 mb-4">Health Applications</p>
              <div className="font-medium" style={{color: '#DC2626'}}>View All →</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Research Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Featured Research
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">A+</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">15 Studies</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">BPC-157 Research</h3>
              <p className="text-gray-600 mb-4">Comprehensive studies on healing and recovery</p>
              <a href="#" className="font-medium" style={{color: '#DC2626'}}>View Details →</a>
            </div>
            
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">B</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">8 Studies</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">GLP-1 Agonists</h3>
              <p className="text-gray-600 mb-4">Weight management and metabolic health</p>
              <a href="#" className="font-medium" style={{color: '#DC2626'}}>View Details →</a>
            </div>
            
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">A</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">12 Studies</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">IGF-1+LR3</h3>
              <p className="text-gray-600 mb-4">Growth and recovery enhancement</p>
              <a href="#" className="font-medium" style={{color: '#DC2626'}}>View Details →</a>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Latest Updates
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">Safety Update</span>
                <span className="text-gray-900 font-medium">BPC-157 Administration Guidelines Updated</span>
              </div>
              <span className="text-gray-500 text-sm">2 hours ago</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Research</span>
                <span className="text-gray-900 font-medium">New Study: Semaglutide Long-term Effects</span>
              </div>
              <span className="text-gray-500 text-sm">1 day ago</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Protocol</span>
                <span className="text-gray-900 font-medium">Updated Tirzepatide Dosing Protocol</span>
              </div>
              <span className="text-gray-500 text-sm">3 days ago</span>
            </div>
          </div>
        </div>
      </section>

      {/* Research Glossary Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Research Glossary
          </h2>
          
          <div className="max-w-2xl mx-auto mb-8">
            <input 
              type="text" 
              placeholder="Search research terms..."
              className="w-full px-6 py-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200 flex items-center justify-between">
              <span className="text-gray-900 font-medium">BPC-157</span>
              <span className="text-gray-400">→</span>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 flex items-center justify-between">
              <span className="text-gray-900 font-medium">GLP-1 Agonists</span>
              <span className="text-gray-400">→</span>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 flex items-center justify-between">
              <span className="text-gray-900 font-medium">IGF-1+LR3</span>
              <span className="text-gray-400">→</span>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 flex items-center justify-between">
              <span className="text-gray-900 font-medium">Thymosin Beta-4</span>
              <span className="text-gray-400">→</span>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 flex items-center justify-between">
              <span className="text-gray-900 font-medium">NAD+ Precursors</span>
              <span className="text-gray-400">→</span>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 flex items-center justify-between">
              <span className="text-gray-900 font-medium">Semaglutide</span>
              <span className="text-gray-400">→</span>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Stay Updated
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Get the latest research, protocols, and safety updates
          </p>
          
          <div className="flex max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-l-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
            <button className="text-white px-8 py-4 rounded-r-lg font-semibold transition-colors" style={{backgroundColor: '#DC2626'}}>
              Subscribe Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer - Dark Background */}
      <footer className="text-white py-16" style={{backgroundColor: '#0A0A0A'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <span className="text-2xl font-bold" style={{color: '#DC2626'}}>PEPTIDE</span>
                <span className="text-2xl font-bold text-white ml-1">DOJO</span>
              </div>
              <p className="text-gray-400 mb-4">
                Advancing peptide research through education, collaboration, and cutting-edge tools.
              </p>
            </div>
            
            <div>
              <h6 className="text-white font-semibold mb-4">Research</h6>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Peptide Database</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Research Protocols</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Safety Guidelines</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Study Results</a></li>
              </ul>
            </div>
            
            <div>
              <h6 className="text-white font-semibold mb-4">About</h6>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Our Mission</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Research Team</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Partnerships</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h6 className="text-white font-semibold mb-4">Connect</h6>
              <ul className="space-y-2">
                <li><a href="https://github.com/erobrien/Shrine-Repo" className="text-gray-400 hover:text-white transition-colors">GitHub</a></li>
                <li><a href="http://localhost:3002" className="text-gray-400 hover:text-white transition-colors">Sanity Studio</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 PeptideDojo. All rights reserved. Built with Sanity.io and Next.js.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
