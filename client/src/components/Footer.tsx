import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-black text-white relative overflow-hidden">
      {/* Shimenawa rope divider */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-primary"></div>
      <div className="absolute top-2 left-0 right-0 h-px bg-white/20 border-dashed"></div>
      
      {/* Seigaiha pattern overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url('/src/assets/patterns/LRG_Pattern_On_Black_Phantom_1758946471927.png')`,
          backgroundSize: '200px 200px',
          backgroundRepeat: 'repeat'
        }}
      ></div>

      <div className="relative max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo and Tagline */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
              <div className="w-8 h-8">
                <svg viewBox="0 0 32 32" className="w-full h-full text-primary fill-current">
                  <rect x="4" y="8" width="2" height="20" />
                  <rect x="26" y="8" width="2" height="20" />
                  <rect x="0" y="6" width="32" height="2" rx="1" />
                  <rect x="3" y="12" width="26" height="1.5" rx="0.75" />
                  <circle cx="16" cy="4" r="2" />
                </svg>
              </div>
              <div className="font-bold text-xl">
                <span>PEPTIDE</span>
                <span className="text-primary ml-1">DOJO</span>
              </div>
            </div>
            <p className="text-gray-400 mb-4">by Shrine Peptides</p>
            <p className="text-primary font-bold text-sm tracking-wider">
              PURITY. POWER. PROVEN.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="font-bold mb-4 text-white">Dojo Paths</h3>
            <div className="space-y-2">
              {[
                { href: "/curriculum", label: "Belt Progression" },
                { href: "/scrolls", label: "Sacred Scrolls" },
                { href: "/teachings", label: "Teachings" },
                { href: "/community", label: "Dojo Community" }
              ].map((link) => (
                <Link key={link.href} href={link.href}>
                  <div className="text-gray-400 hover:text-primary transition-colors cursor-pointer py-1">
                    {link.label}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="font-bold mb-4 text-white">Begin Your Journey</h3>
            <p className="text-gray-400 mb-4 text-sm">
              Ready to master the art of peptides? Join the dojo and start your training.
            </p>
            <div className="space-y-3">
              <Link href="https://shrine-peptides.com">
                <div 
                  className="text-primary hover:text-primary/80 transition-colors cursor-pointer text-sm"
                  data-testid="link-shrine-peptides"
                >
                  Visit Shrine Peptides →
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Komainu guardian silhouettes */}
        <div className="flex justify-between items-end mt-16 opacity-10">
          <div className="text-6xl">🦁</div>
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              © 2024 Shrine Peptides. All rights reserved.
            </p>
          </div>
          <div className="text-6xl">🦁</div>
        </div>
      </div>
    </footer>
  );
}