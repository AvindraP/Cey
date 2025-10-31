import React from "react";
import { ProductCard } from "./ProductCard";

export const ProductsSection = ({ opacityFourthSection }) => {
  const products = [
    { id: 1, name: "Tattoo Care Balm", description: "Soothes and hydrates freshly inked skin.", price: 25.0, discount: 10 },
    { id: 2, name: "Aftercare Lotion", description: "Keeps your tattoo vibrant and healthy.", price: 30.0, discount: 15 },
    { id: 3, name: "Tattoo Soap", description: "Gentle, fragrance-free cleansing formula.", price: 18.0, discount: 0 },
    { id: 4, name: "Ink Protection Cream", description: "Protects your tattoo from fading and dryness.", price: 28.0, discount: 5 },
  ];

  return (
    <section
      className="flex flex-col justify-center items-center min-h-screen w-[90vw] text-center m-6"
      style={{ opacity: opacityFourthSection }}
    >
      <h2 className="text-3xl md:text-5xl font-bold mb-10">Our Products</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
      <button className="mt-10 bg-red-800 text-white font-semibold px-6 py-3 rounded-full hover:bg-red-900 transition">
        See All Products
      </button>
    </section>
  );
};