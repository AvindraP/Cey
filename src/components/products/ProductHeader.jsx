import { MagnifyingGlassIcon, UserIcon, ShoppingCartIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';
import { useContext, useState } from 'react';
import { AuthContext } from '../../middleware/AuthProvider';

export const ProductHeader = ({ allProducts, prodCount }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const { isCustomer, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between text-white">
        {/* Left Section */}
        <div className="flex items-center space-x-8">
          <a
            href="/"
            className="text-2xl md:text-3xl font-bold tracking-widest uppercase hover:text-zinc-300 transition-colors"
          >
            INKVERSE
          </a>

          {allProducts
            ?
            <nav className="hidden md:flex space-x-6 text-sm font-medium">
              <a
                href="/products"
                className="hover:text-zinc-300 transition-colors"
              >
                All Products
              </a>
            </nav>
            : ''}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-0 md:space-x-4">
          {/* Search Icon */}
          {allProducts
            ?
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              aria-label="Search"
            >
              <MagnifyingGlassIcon className="w-6 h-6" />
            </button>
            : ''}

          {/* Profile Icon */}
          <a
            href="/account"
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
            aria-label="Account"
          >
            <UserIcon className="w-6 h-6" />
          </a>

          {/* Cart Icon with Badge */}
          <a
            href="/cart"
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors relative"
            aria-label="Shopping Cart"
          >
            <ShoppingCartIcon className="w-6 h-6" />
            <span className="absolute top-0 right-0 w-5 h-5 bg-white text-black text-xs font-bold rounded-full flex items-center justify-center">
              {prodCount ?? 0}
            </span>
          </a>

          {/* Logout Icon */}
          {isCustomer &&
            <a
              href="#"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <ArrowRightStartOnRectangleIcon className="w-6 h-6" />
            </a>
          }
        </div>
      </div>

      {/* Search Bar Dropdown */}
      {searchOpen && (
        <div className="border-t border-zinc-800 bg-black/95 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 pl-12 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                autoFocus
              />
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};