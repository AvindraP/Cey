import React, { useState, useEffect } from 'react';
import {
  ShoppingCartIcon,
  HeartIcon,
  ShareIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MinusIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { useLocation } from 'react-router-dom';
import { ProductHeader } from './ProductHeader';
import { Footer } from '../Footer';
import { addToCart } from '../cart/cartApi';
import toast, { Toaster } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Reusable Components
const ImageGallery = ({ images }) => {

  const newImages = images.length
    ? images.map((i) => {
      return `${API_BASE_URL}/images/${i.filename}`;
    })
    : ['/images/noimage.webp'];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : newImages.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < newImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="space-y-4">
      <div className="relative rounded-2xl overflow-hidden border border-gray-700/50 backdrop-blur-sm"
        style={{
          backgroundColor: 'black',
          background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 40%, #2b2b2b 100%)'
        }}>
        <div className="aspect-square flex items-center justify-center p-8">
          <img
            src={newImages[currentIndex]}
            alt="Product"
            className="max-w-full max-h-full object-contain"
          />
        </div>

        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-gray-700/50 flex items-center justify-center transition-all"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-gray-700/50 flex items-center justify-center transition-all"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-6 gap-2">
        {newImages.map((img, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrentIndex(idx);
            }}
            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${currentIndex === idx
              ? 'border-white-400 ring-2 ring-white-400/30'
              : 'border-gray-700/50 hover:border-gray-600'
              } bg-gradient-to-br from-gray-800/30 to-gray-900/30`}
          >
            <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

const ColorSelector = ({ colors, selectedColor, onColorSelect }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-3">
        Color: <span className="text-slate-100 font-semibold">{selectedColor}</span>
      </label>
      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-6 lg:grid-cols-8 gap-2">
        {colors.map((color) => (
          <div key={color.id} className='flex flex-col'>
            <button
              onClick={() => onColorSelect(color.value)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${selectedColor === color.value
                ? 'border-white-400 ring-2 ring-white-400/30'
                : 'border-gray-700/50 hover:border-gray-600'
                } bg-gradient-to-br from-gray-800/30 to-gray-900/30 text-gray-100`}
            >
              <img src={color.image ? `${API_BASE_URL}/images/${color.image}` : '/images/noimage.webp'} alt={color.value} className="w-full h-full object-cover" />
            </button>
            <label className='text-sm text-gray-300 text-center'>{color.value}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

const SizeSelector = ({ sizes, selectedSize, onSizeSelect, availableSizes }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-3">
        Capacity: <span className="text-slate-100 font-semibold">{selectedSize}</span>
      </label>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const isAvailable = availableSizes.includes(size.value);
          return (
            <button
              key={size.id}
              onClick={() => isAvailable && onSizeSelect(size.value)}
              disabled={!isAvailable}
              className={`px-6 py-2.5 rounded-lg border-2 transition-all font-medium ${!isAvailable
                ? 'border-gray-800/50 bg-gray-900/30 text-gray-600 cursor-not-allowed opacity-50'
                : selectedSize === size.value
                  ? 'border-white-400 bg-white-400/10 text-white-400'
                  : 'border-gray-700/50 bg-gray-800/30 text-slate-300 hover:border-gray-600 hover:bg-gray-800/50'
                }`}
            >
              {size.value}
              {/* {!isAvailable && <span className="ml-1 text-xs">(Out of stock)</span>} */}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const QuantitySelector = ({ quantity, onQuantityChange, max = 99, stockAvailable }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-3">
        Quantity
        {stockAvailable !== null && (
          <span className="ml-2 text-xs text-slate-400">
            ({stockAvailable} available)
          </span>
        )}
      </label>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
          className="w-10 h-10 rounded-lg border border-gray-700/50 bg-gray-800/30 hover:bg-gray-800/50 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={quantity <= 1}
        >
          <MinusIcon className="w-4 h-4" />
        </button>
        <input
          type="number"
          value={quantity}
          onChange={(e) => onQuantityChange(Math.max(1, Math.min(max, parseInt(e.target.value) || 1)))}
          className="w-20 h-10 text-center bg-gray-800/30 border border-gray-700/50 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-white-400/50"
        />
        <button
          onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
          className="w-10 h-10 rounded-lg border border-gray-700/50 bg-gray-800/30 hover:bg-gray-800/50 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={quantity >= max}
        >
          <PlusIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const PriceDisplay = ({ price, originalPrice, discount }) => {
  return (
    <div className="flex items-baseline gap-3">
      <span className="text-3xl font-bold text-slate-100">${price}</span>
      {originalPrice && (
        <>
          <span className="text-lg text-slate-500 line-through">${originalPrice}</span>
          <span className="px-2 py-1 rounded-md bg-green-500/20 text-green-400 text-sm font-semibold border border-green-500/30">
            Save {discount}%
          </span>
        </>
      )}
    </div>
  );
};

const ActionButtons = ({ onAddToCart, onBuyNow, disabled, isLoading }) => {
  return (
    <div className="space-y-3">
      <button
        onClick={onAddToCart}
        disabled={disabled || isLoading}
        className="w-full py-3.5 rounded-lg bg-gradient-to-r from-gray-200 to-gray-400 hover:from-gray-300 hover:to-gray-500 text-black font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-white-500/25 hover:shadow-white-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ShoppingCartIcon className="w-5 h-5" />
        {isLoading ? 'Adding...' : 'Add to cart'}
      </button>
      <button
        onClick={onBuyNow}
        disabled={disabled}
        className="w-full py-3.5 rounded-lg bg-gradient-to-r from-gray-600 to-gray-600 hover:from-gray-700 hover:to-gray-700 text-white font-semibold transition-all shadow-lg shadow-gray-500/25 hover:shadow-gray-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Buy with Stripe
      </button>
      <button className="w-full py-2 text-sm text-slate-400 hover:text-slate-300 transition-colors">
        More payment options
      </button>
    </div>
  );
};

const ProductInfo = ({ description, specifications }) => {
  const [activeTab, setActiveTab] = useState('description');

  return (
    <div className="mt-12">
      <div className="border-b border-gray-700/50">
        <div className="flex gap-8">
          {['description', 'specification', 'reviews', 'faqs'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-medium capitalize transition-colors relative ${activeTab === tab
                ? 'text-white-400'
                : 'text-slate-400 hover:text-slate-300'
                }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-white-400 to-blue-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="py-6">
        {activeTab === 'description' && (
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-300 leading-relaxed">{description}</p>
            {specifications && (
              <div className="mt-6 space-y-3">
                {Object.entries(specifications).map(([key, value]) => (
                  <div key={key} className="flex gap-2">
                    <span className="font-semibold text-slate-100 min-w-[200px]">{key}:</span>
                    <span className="text-slate-300">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === 'specification' && (
          <div className="text-slate-300">Technical specifications content...</div>
        )}
        {activeTab === 'reviews' && (
          <div className="text-slate-300">Customer reviews content...</div>
        )}
        {activeTab === 'faqs' && (
          <div className="text-slate-300">Frequently asked questions...</div>
        )}
      </div>
    </div>
  );
};

// Main Product Page Component
function ProductPage() {
  const location = useLocation();
  const [productId, setProductId] = useState(null);
  const [productData, setProductData] = useState({});
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const idFromUrl = params.get("product_id");
    setProductId(idFromUrl);
  }, [location.search]);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`${API_BASE_URL}/products/getproduct/${productId}`, {
          method: 'GET',
        });

        const data = await response.json();
        if (response.ok) setProductData(data)
        else throw new Error(data.error || "No product found!");
      } catch (err) {
        console.log(err)
      }
    }

    if (productId) fetchProduct();
  }, [productId])

  const colorOptions = productData.attributes?.find(a => a.name === 'Color')?.options || [];
  const sizeOptions = productData.attributes?.find(a => a.name === 'Size')?.options || [];

  // Get available sizes based on selected color
  const getAvailableSizes = () => {
    if (!selectedColor || !productData.variations) {
      return sizeOptions.map(s => s.value);
    }

    const availableSizes = new Set();
    productData.variations.forEach(variation => {
      const hasColor = variation.options.some(
        opt => opt.attribute_name === 'Color' && opt.option_value === selectedColor
      );
      const sizeOption = variation.options.find(opt => opt.attribute_name === 'Size');

      if (hasColor && sizeOption && variation.stock_balance > 0) {
        availableSizes.add(sizeOption.option_value);
      }
    });

    return Array.from(availableSizes);
  };

  // Get current variation based on selected color and size
  const getCurrentVariation = () => {
    if (!selectedColor || !selectedSize || !productData.variations) {
      return null;
    }

    return productData.variations.find(variation => {
      const hasColor = variation.options.some(
        opt => opt.attribute_name === 'Color' && opt.option_value === selectedColor
      );
      const hasSize = variation.options.some(
        opt => opt.attribute_name === 'Size' && opt.option_value === selectedSize
      );
      return hasColor && hasSize;
    });
  };

  const currentVariation = getCurrentVariation();
  const maxQuantity = currentVariation ? currentVariation.stock_balance : 99;
  const availableSizes = getAvailableSizes();

  // Reset size if it becomes unavailable
  useEffect(() => {
    if (selectedSize && !availableSizes.includes(selectedSize)) {
      setSelectedSize(null);
      setQuantity(1);
    }
  }, [selectedColor, availableSizes, selectedSize]);

  // Reset quantity if it exceeds new max
  useEffect(() => {
    if (quantity > maxQuantity) {
      setQuantity(Math.min(quantity, maxQuantity));
    }
  }, [maxQuantity, quantity]);

  const specifications = {
    'Pigment Temperature': 'Cool',
    'Opacity Level': 'Medium',
    'Fitzpatrick Skin Type Suitability': 'F1 - F6',
    'Ready to Use - No Mixing Required': 'Pre-modified and ready straight from the bottle',
    'Compatibility': 'Use it on its own or mix with other Biomaser pigments',
    'Includes': '1 12ml / 0.5 oz. pigment',
    'High Retention & Color Stability': 'Developed by Biomaser, this formula is packed with high-density pigments'
  };

  const handleAddToCart = async () => {
    if (!selectedColor || !selectedSize) {
      toast.error('Please select color and size');
      return;
    }
    if (!currentVariation || currentVariation.stock_balance < 1) {
      toast.error('This variation is out of stock');
      return;
    }

    setIsLoading(true);
    try {
      const response = await addToCart(
        productData.product.id,
        currentVariation.id,
        quantity
      );

      toast.success('Product added to cart successfully!');
      console.log('Added to cart:', response);
    } catch (error) {
      const parsed = JSON.parse(error.message);
      toast.error(parsed.message || 'Failed to add to cart');
      console.error('Add to cart error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyNow = () => {
    if (!selectedColor || !selectedSize) {
      toast.error('Please select color and size');
      return;
    }
    if (!currentVariation || currentVariation.stock_balance < 1) {
      toast.error('This variation is out of stock');
      return;
    }
    console.log('Buy now:', { selectedColor, selectedSize, quantity, variation: currentVariation });
    // Implement buy now logic here
  };

  const isOutOfStock = currentVariation && currentVariation.stock_balance < 1;
  const canPurchase = selectedColor && selectedSize && !isOutOfStock;

  return (
    <>
      <ProductHeader allProducts={true} />

      {/* Toaster */}
      <Toaster position="top-right" reverseOrder={false} containerStyle={{ marginTop: '80px', }} />

      <div className="min-h-screen mt-15"
        style={{
          backgroundColor: 'black',
          background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 40%, #2b2b2b 100%)'
        }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-slate-400">
            <a href="/products" className="hover:text-slate-300 cursor-pointer">Products</a>
            <span className="mx-2">/</span>
            <span className="text-slate-100">{productData.product?.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column - Images */}
            <div>
              <ImageGallery
                images={productData.images ?? []}
              />
            </div>

            {/* Right Column - Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-100 mb-3">
                  {productData.product?.name}
                </h1>
                <PriceDisplay price={currentVariation?.price || productData.product?.base_price || 0.00} />
              </div>

              <ColorSelector
                colors={colorOptions}
                selectedColor={selectedColor}
                onColorSelect={setSelectedColor}
              />

              <SizeSelector
                sizes={sizeOptions}
                selectedSize={selectedSize}
                onSizeSelect={setSelectedSize}
                availableSizes={availableSizes}
              />

              <QuantitySelector
                quantity={quantity}
                onQuantityChange={setQuantity}
                max={maxQuantity}
                stockAvailable={currentVariation?.stock_balance ?? null}
              />

              {isOutOfStock && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  This combination is currently out of stock
                </div>
              )}

              <ActionButtons
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                disabled={!canPurchase}
                isLoading={isLoading}
              />

              {/* Payment Icons */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-700/50">
                <span className="text-sm text-slate-400">We accept:</span>
                <div className="flex gap-2">
                  {['VISA', 'MC', 'AMEX', 'PP', 'DISC'].map((card) => (
                    <div key={card} className="w-10 h-6 rounded bg-gray-800/50 border border-gray-700/50" />
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Product Description Preview */}
          <div className="mt-6 pt-6 border-t border-gray-700/50">
            <p className="text-slate-300 leading-relaxed">
              {productData.product?.description}
            </p>
          </div>

          {/* Full Product Information Tabs */}
          {/* <ProductInfo
          description={productData.product?.description}
          specifications={specifications}
        /> */}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ProductPage;