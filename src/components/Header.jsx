import { useState } from "react";

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between text-white">
        {/* Logo */}
        <a href="#" className="text-2xl font-bold tracking-widest uppercase">
          Inkverse
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 text-sm font-semibold">
          <a href="#hero" className="hover:text-red-500 transition">Home</a>
          <a href="#portfolio" className="hover:text-red-500 transition">Portfolio</a>
          <a href="#about" className="hover:text-red-500 transition">About</a>
          <a href="#contact" className="hover:text-red-500 transition">Contact</a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-md border-t border-white/10">
          <nav className="flex flex-col items-center py-4 space-y-3 text-sm font-semibold text-white">
            <a href="#hero" onClick={() => setMenuOpen(false)} className="hover:text-red-500 transition">Home</a>
            <a href="#portfolio" onClick={() => setMenuOpen(false)} className="hover:text-red-500 transition">Portfolio</a>
            <a href="#about" onClick={() => setMenuOpen(false)} className="hover:text-red-500 transition">About</a>
            <a href="#contact" onClick={() => setMenuOpen(false)} className="hover:text-red-500 transition">Contact</a>
          </nav>
        </div>
      )}
    </header>
  );
};
