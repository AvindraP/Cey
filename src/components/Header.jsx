import { useState } from "react";

export const Header = ({ scrollToSection }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = (e, sectionIndex) => {
    e.preventDefault();
    if (scrollToSection) scrollToSection(sectionIndex);
    setMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-1500">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between text-white">
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => handleNavClick(e, 0)}
          className="text-2xl md:text-3xl font-bold tracking-widest uppercase hover:text-zinc-300 transition-colors"
        >
          INKVERSE
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-10 text-sm font-medium tracking-wide">
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, 1)}
            className="hover:text-zinc-300 transition-colors cursor-pointer"
          >
            Home
          </a>
          <a
            href="#about"
            onClick={(e) => handleNavClick(e, 2)}
            className="hover:text-zinc-300 transition-colors cursor-pointer"
          >
            About Us
          </a>
          <a
            href="#products"
            onClick={(e) => handleNavClick(e, 3)}
            className="hover:text-zinc-300 transition-colors cursor-pointer"
          >
            Our Products
          </a>
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, 5)}
            className="hover:text-zinc-300 transition-colors cursor-pointer"
          >
            Contact Us
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none hover:text-zinc-300 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-7 h-7"
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
        <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-zinc-800">
          <nav className="flex flex-col items-center py-6 space-y-4 text-sm font-medium tracking-wide text-white">
            <a
              href="#hero"
              onClick={(e) => handleNavClick(e, 1)}
              className="hover:text-zinc-300 transition-colors w-full text-center py-2"
            >
              Home
            </a>
            <a
              href="#about"
              onClick={(e) => handleNavClick(e, 2)}
              className="hover:text-zinc-300 transition-colors w-full text-center py-2"
            >
              About Us
            </a>
            <a
              href="#products"
              onClick={(e) => handleNavClick(e, 3)}
              className="hover:text-zinc-300 transition-colors w-full text-center py-2"
            >
              Our Products
            </a>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, 5)}
              className="hover:text-zinc-300 transition-colors w-full text-center py-2"
            >
              Contact Us
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};