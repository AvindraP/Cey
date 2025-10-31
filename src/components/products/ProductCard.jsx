import React from "react";

export const ProductCard = ({ image, name, description, price, discount }) => {
    const discountedPrice = price - (price * (discount / 100));

    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col justify-between p-4 text-center">
            <div className="w-full h-48 flex items-center justify-center mb-4 overflow-hidden rounded-md">
                <img
                    src={image ?? '/images/noimage.webp'}
                    alt={name ?? 'no-image'}
                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                />
            </div>
            <h3 className="text-xl font-semibold mb-2">{name}</h3>
            <p className="text-gray-600 mb-3 text-sm">{description}</p>
            <div className="mb-4">
                <span className="text-lg font-bold text-gray-900">${discountedPrice.toFixed(2)}</span>
                {discount > 0 && (
                    <span className="text-sm line-through text-gray-400 ml-2">${price.toFixed(2)}</span>
                )}
            </div>
            <div className="flex flex-col gap-2">
                <button className="bg-red-800 text-white py-2 rounded-full hover:bg-red-900 transition">
                    Buy Now
                </button>
                <a href="#" className="text-red-700 font-medium hover:underline">
                    Learn more &gt;
                </a>
            </div>
        </div>
    );
};