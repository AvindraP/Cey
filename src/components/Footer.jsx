// Footer Component
import 'react';

export const Footer = () => {
  return (
    <footer className="border-t border-zinc-800 bg-black mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4 tracking-widest">INKVERSE</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Premium tattoo supplies and essentials for artists and enthusiasts.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'All Products', 'About Us', 'Contact'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">Support</h4>
            <ul className="space-y-2">
              {['FAQ', 'Shipping', 'Returns', 'Track Order'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">Contact</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>245 Wythe Ave</li>
              <li>Brooklyn, NY 11249</li>
              <li className="pt-2">
                <a href="tel:7185559034" className="hover:text-white transition-colors">
                  (718) 555-9034
                </a>
              </li>
              <li>
                <a href="mailto:hello@inkversestudio.com" className="hover:text-white transition-colors">
                  hello@inkversestudio.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-800 text-center text-sm text-zinc-500">
          © 2025 INKVERSE. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

