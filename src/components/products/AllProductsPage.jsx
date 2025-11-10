import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { ProductHeader } from './ProductHeader';
import { Footer } from '../Footer';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Product Card Component
const ProductCard = ({ product, images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered || !images || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 800);

    return () => clearInterval(interval);
  }, [isHovered, images]);

  useEffect(() => {
    if (!isHovered) {
      setCurrentImageIndex(0);
    }
  }, [isHovered]);

  const displayPrice = product.display_price || null;
  const discountedPrice = product.base_price || '0.00';
  const discountPercent = displayPrice
    ? Math.round(((parseFloat(displayPrice) - parseFloat(discountedPrice)) / parseFloat(displayPrice)) * 100)
    : 0;

  return (
    <div
      className="bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-600 hover:scale-[1.02] transition-all duration-300 group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-64 bg-zinc-950 rounded-t-lg overflow-hidden">
        {images && images.length > 0 ? (
          <img
            src={`${API_BASE_URL}/images/${images[currentImageIndex]}`}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <img
            src="/images/noimage.webp"
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {displayPrice && discountPercent > 0 && (
          <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded shadow-lg">
            -{discountPercent}%
          </div>
        )}

        {images && images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'
                  }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col p-5">
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-zinc-200 transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-zinc-400 mb-4 line-clamp-2 leading-snug min-h-[2.8em]">
          {product.description}
        </p>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl font-bold text-white">${discountedPrice}</span>
          {displayPrice && (
            <span className="text-sm text-zinc-500 line-through">${displayPrice}</span>
          )}
        </div>

        <a
          href={`/product?product_id=${product.id}`}
          className="w-full bg-white text-black px-4 py-2.5 text-sm font-semibold rounded hover:bg-zinc-200 transition-colors text-center"
        >
          View Details
        </a>
      </div>
    </div>
  );
};

// Filter Sidebar Component
const FilterSidebar = ({ isOpen, onClose, filters, onFilterChange }) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed lg:sticky top-20 left-0 h-[calc(100vh-5rem)] lg:h-auto w-80 bg-black lg:bg-zinc-900/50 border-r lg:border border-zinc-800 rounded-none lg:rounded-lg p-6 overflow-y-auto z-40 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Filters</h2>
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">Category</h3>
          <div className="space-y-2.5">
            {['All Products', 'Tattoo Inks', 'Needles', 'Machines', 'Aftercare', 'Accessories'].map((category) => (
              <label key={category} className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category)}
                  onChange={(e) => onFilterChange('categories', category, e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-white focus:ring-2 focus:ring-white/50 cursor-pointer"
                />
                <span className="text-sm text-zinc-400 group-hover:text-white transition-colors">
                  {category}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">Price Range</h3>
          <div className="space-y-2.5">
            {[
              { label: 'Under $25', value: '0-25' },
              { label: '$25 - $50', value: '25-50' },
              { label: '$50 - $100', value: '50-100' },
              { label: 'Over $100', value: '100-999999' }
            ].map((range) => (
              <label key={range.value} className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.priceRanges.includes(range.value)}
                  onChange={(e) => onFilterChange('priceRanges', range.value, e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-white focus:ring-2 focus:ring-white/50 cursor-pointer"
                />
                <span className="text-sm text-zinc-400 group-hover:text-white transition-colors">
                  {range.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Brand */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">Brand</h3>
          <div className="space-y-2.5">
            {['Biomaser', 'Cheyenne', 'Eternal Ink', 'Intenze', 'World Famous'].map((brand) => (
              <label key={brand} className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={(e) => onFilterChange('brands', brand, e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-white focus:ring-2 focus:ring-white/50 cursor-pointer"
                />
                <span className="text-sm text-zinc-400 group-hover:text-white transition-colors">
                  {brand}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">Availability</h3>
          <label className="flex items-center space-x-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) => onFilterChange('inStock', null, e.target.checked)}
              className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-white focus:ring-2 focus:ring-white/50 cursor-pointer"
            />
            <span className="text-sm text-zinc-400 group-hover:text-white transition-colors">
              In Stock Only
            </span>
          </label>
        </div>

        <button
          onClick={() => onFilterChange('clear')}
          className="w-full py-2.5 text-sm font-medium text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-all"
        >
          Clear All Filters
        </button>
      </div>
    </>
  );
};

// Main All Products Page
export default function AllProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    categories: [],
    priceRanges: [],
    brands: [],
    inStock: false
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products/listproducts`);
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleFilterChange = (filterType, value, checked) => {
    if (filterType === 'clear') {
      setFilters({
        categories: [],
        priceRanges: [],
        brands: [],
        inStock: false
      });
      return;
    }

    if (filterType === 'inStock') {
      setFilters(prev => ({ ...prev, inStock: checked }));
      return;
    }

    setFilters(prev => ({
      ...prev,
      [filterType]: checked
        ? [...prev[filterType], value]
        : prev[filterType].filter(item => item !== value)
    }));
  };

  useEffect(() => {
    let result = [...products];

    if (searchQuery) {
      result = result.filter(item =>
        item.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes('All Products')) {
      result = result.filter(item => {
        // You can add category field to your product data
        // For now, filter by product name keywords
        const productName = item.product.name.toLowerCase();
        return filters.categories.some(category => {
          const categoryKey = category.toLowerCase();
          if (categoryKey.includes('ink')) return productName.includes('ink') || productName.includes('pigment');
          if (categoryKey.includes('needle')) return productName.includes('needle');
          if (categoryKey.includes('machine')) return productName.includes('machine') || productName.includes('pen');
          if (categoryKey.includes('aftercare')) return productName.includes('aftercare') || productName.includes('balm') || productName.includes('cream');
          if (categoryKey.includes('accessories')) return productName.includes('tip') || productName.includes('grip') || productName.includes('accessory');
          return false;
        });
      });
    }

    // Price range filter
    if (filters.priceRanges.length > 0) {
      result = result.filter(item => {
        const price = parseFloat(item.product.base_price);
        return filters.priceRanges.some(range => {
          const [min, max] = range.split('-').map(Number);
          return price >= min && price <= max;
        });
      });
    }

    // Brand filter
    if (filters.brands.length > 0) {
      result = result.filter(item => {
        const productName = item.product.name.toLowerCase();
        return filters.brands.some(brand =>
          productName.includes(brand.toLowerCase())
        );
      });
    }

    // In stock filter
    if (filters.inStock) {
      result = result.filter(item => {
        // Check if product has variations with stock
        if (item.product.variations && item.product.variations.length > 0) {
          return item.product.variations.some(v => v.stock_quantity > 0);
        }
        // If no variations, assume in stock (or add stock_quantity field to product)
        return true;
      });
    }

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => parseFloat(a.product.base_price) - parseFloat(b.product.base_price));
        break;
      case 'price-high':
        result.sort((a, b) => parseFloat(b.product.base_price) - parseFloat(a.product.base_price));
        break;
      case 'name':
        result.sort((a, b) => a.product.name.localeCompare(b.product.name));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [products, searchQuery, sortBy, filters]);

  return (
    <div className="min-h-screen bg-black">
      <ProductHeader allProducts={false} />

      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="mb-12 text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              Our Products
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto">
              Premium tattoo supplies, inks, and aftercare essentials trusted by professionals
            </p>
          </div>

          {/* Search and Sort Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 pl-12 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer min-w-[200px]"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-low">Sort: Price Low to High</option>
              <option value="price-high">Sort: Price High to Low</option>
              <option value="name">Sort: Name A to Z</option>
            </select>

            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="lg:hidden flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-6 py-3 text-white hover:bg-zinc-800 transition-colors font-medium"
            >
              <FunnelIcon className="w-5 h-5" />
              Filters
            </button>
          </div>

          <div className="flex gap-8">
            <FilterSidebar
              isOpen={filterOpen}
              onClose={() => setFilterOpen(false)}
              filters={filters}
              onFilterChange={handleFilterChange}
            />

            <div className="flex-1 min-w-0">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-zinc-400">
                  <span className="font-semibold text-white">{filteredProducts.length}</span> of{' '}
                  <span className="font-semibold text-white">{products.length}</span> products
                </p>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-zinc-900/50 border border-zinc-800 rounded-lg h-[450px] animate-pulse"
                    />
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20 border border-zinc-800 rounded-lg bg-zinc-900/30">
                  <div className="mb-4">
                    <MagnifyingGlassIcon className="w-16 h-16 mx-auto text-zinc-600" />
                  </div>
                  <p className="text-xl text-zinc-300 mb-2 font-semibold">No products found</p>
                  <p className="text-sm text-zinc-500">Try adjusting your filters or search query</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((item) => (
                    <ProductCard
                      key={item.product.id}
                      product={item.product}
                      images={item.images}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}