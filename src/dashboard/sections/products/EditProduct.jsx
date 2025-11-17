import React, { useState, useMemo, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function cartesianProduct(arrays) {
    if (!arrays.length) return [];
    return arrays.reduce((acc, curr) => {
        const out = [];
        acc.forEach((a) => {
            curr.forEach((c) => {
                out.push([...a, c]);
            });
        });
        return out;
    }, [[]]);
}

export default function EditProduct({ setActiveSection, id }) {
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState({
        id: "",
        name: "",
        description: "",
        base_price: "",
        sku: "",
    });

    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [deletedImages, setDeletedImages] = useState([]);

    const [attributes, setAttributes] = useState([
        { id: crypto.randomUUID(), name: "Color", options: [] },
        { id: crypto.randomUUID(), name: "Size", options: [] },
    ]);
    const [variations, setVariations] = useState([]);
    const [deletedVariations, setDeletedVariations] = useState([]);

    // Fetch existing product data
    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/products/getproduct/${id}`, {
                method: 'GET',
                credentials: 'include',
            });

            const data = await response.json();
            if (response.ok) {
                // Set product data
                setProduct({
                    id: data.product.id,
                    name: data.product.name,
                    description: data.product.description,
                    base_price: data.product.base_price,
                    sku: data.product.sku,
                });

                // Set existing images
                setExistingImages(data.images || []);

                // Set attributes with options
                const colorAttr = data.attributes?.find(a => a.name === 'Color');
                const sizeAttr = data.attributes?.find(a => a.name === 'Size');

                setAttributes([
                    {
                        id: crypto.randomUUID(),
                        name: "Color",
                        options: colorAttr?.options.map(opt => ({
                            id: opt.id,
                            value: opt.value,
                            imageFile: null,
                            previewUrl: opt.image ? `${API_BASE_URL}/images/${opt.image}` : null,
                            existing: true,
                        })) || []
                    },
                    {
                        id: crypto.randomUUID(),
                        name: "Size",
                        options: sizeAttr?.options.map(opt => ({
                            id: opt.id,
                            value: opt.value,
                            existing: true,
                        })) || []
                    },
                ]);

                // Set variations
                setVariations(data.variations?.map(v => ({
                    id: crypto.randomUUID(),
                    existing_id: v.id, // Store DB ID
                    product_id: data.product.id,
                    sku: v.sku,
                    price: v.price,
                    stock_quantity: v.stock_quantity,
                    options: v.options.map(opt => ({
                        attribute_name: opt.attribute_name,
                        option_value: opt.option_value,
                    })),
                })) || []);
            } else {
                toast.error(data.error || "Failed to load product");
                setActiveSection('view products');
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            toast.error('Failed to load product');
            setActiveSection('view products');
        } finally {
            setLoading(false);
        }
    };

    /* Derived: prepare arrays of option values for cartesian product */
    const optionMatrix = useMemo(
        () =>
            attributes
                .filter((a) => a.options && a.options.length)
                .map((a) => a.options.map((o) => ({ attributeId: a.id, attributeName: a.name, optionId: o.id, optionValue: o.value }))),
        [attributes]
    );

    /* Generate variations from current attributes/options */
    const generateVariations = () => {
        const productAttributes = attributes.filter((a) => a.options.length);
        if (productAttributes.length === 0) {
            toast.warning("No attributes to generate variations from");
            return;
        }

        const combos = cartesianProduct(optionMatrix);

        // Build a normalized signature map for quick comparison
        const comboSignatures = new Set(
            combos.map(combo =>
                combo.map(c => `${c.attributeName}:${c.optionValue}`).sort().join("|")
            )
        );

        // STEP 1: Identify existing variations that no longer match any combo
        const removedExistingVars = variations.filter(v => {
            const sig = v.options
                .map(o => `${o.attribute_name}:${o.option_value}`)
                .sort()
                .join("|");

            return !comboSignatures.has(sig);  // this variation no longer valid
        });

        // STEP 2: Add their existing_id to deletedVariations
        removedExistingVars.forEach(v => {
            if (v.existing_id) {
                setDeletedVariations(prev => {
                    if (!prev.includes(v.existing_id)) {
                        return [...prev, v.existing_id];
                    }
                    return prev;
                });
            }
        });

        // STEP 3: Build new variations list (preserve valid existing ones)
        const newVariations = combos.map(combo => {
            const sig = combo
                .map(c => `${c.attributeName}:${c.optionValue}`)
                .sort()
                .join("|");

            // Look for matching existing variation
            const existingVar = variations.find(v => {
                const vsig = v.options
                    .map(o => `${o.attribute_name}:${o.option_value}`)
                    .sort()
                    .join("|");
                return vsig === sig;
            });

            if (existingVar) return existingVar;

            const combination = combo.map(entry => ({
                attribute_name: entry.attributeName,
                option_value: entry.optionValue,
            }));

            const skuParts = [product.sku || product.name || "P", ...combo.map((c) => c.optionValue)];

            return {
                id: crypto.randomUUID(),
                product_id: product.id,
                sku: skuParts.join("-").replace(/\s+/g, "").toUpperCase(),
                price: product.base_price || "",
                stock_quantity: 0,
                options: combination,
            };
        });

        // STEP 4: Update variations
        setVariations(newVariations);
        toast.success("Variations updated");
    };

    const addOption = (attrId) => {
        setAttributes((prev) =>
            prev.map((a) => (a.id === attrId ? { ...a, options: [...(a.options || []), { id: crypto.randomUUID(), value: "", imageFile: null }] } : a))
        );
    };

    const updateOptionValue = (attrId, optionId, value) => {
        setAttributes((prev) =>
            prev.map((a) =>
                a.id === attrId ? { ...a, options: a.options.map((o) => (o.id === optionId ? { ...o, value } : o)) } : a
            )
        );
    };

    const removeOption = (attrId, optionId) => {
        setAttributes((prev) =>
            prev.map((a) => {
                if (a.id !== attrId) return a;

                if (a.options.length <= 1) {
                    toast.error(`At least one option must remain for ${a.name}`);
                    return a;
                }

                return {
                    ...a,
                    options: a.options.filter((o) => o.id !== optionId),
                };
            })
        );
    };

    const removeImage = (imageId, isExisting) => {
        if (isExisting) {
            setDeletedImages(prev => [...prev, imageId]);
            setExistingImages(prev => prev.filter(img => img.id !== imageId));
        } else {
            setNewImages(prev => prev.filter((_, i) => i !== imageId));
        }
    };

    const removeVariation = (variationId, existingId) => {
        if (existingId) {
            setDeletedVariations(prev => [...prev, existingId]);
        }
        setVariations(prev => prev.filter(v => v.id !== variationId));
    };

    /* Variation editing */
    const updateVariationField = (variationId, field, value) => {
        setVariations((prev) => prev.map((v) => (v.id === variationId ? { ...v, [field]: value } : v)));
    };

    const updateOptionImage = (attrId, optId, file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            setAttributes((prev) =>
                prev.map((attr) =>
                    attr.id === attrId
                        ? {
                            ...attr,
                            options: attr.options.map((opt) =>
                                opt.id === optId
                                    ? {
                                        ...opt,
                                        imageFile: file,
                                        previewUrl: e.target.result,
                                    }
                                    : opt
                            ),
                        }
                        : attr
                )
            );
        };
        reader.readAsDataURL(file);
    };

    /* Submit */
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("product", JSON.stringify(product));
        formData.append("attributes", JSON.stringify(
            attributes.map(attr => ({
                id: attr.id,
                name: attr.name,
                options: attr.options.map(opt => ({
                    id: opt.id,
                    value: opt.value,
                })),
            }))
        ));
        formData.append("variations", JSON.stringify(
            variations.map((v) => ({
                id: v.id,
                existing_id: v.existing_id,
                product_id: v.product_id,
                sku: v.sku,
                price: v.price,
                stock_quantity: Number(v.stock_quantity),
                options: v.options,
            }))
        ));
        formData.append("deleted_images", JSON.stringify(deletedImages));
        formData.append("deleted_variations", JSON.stringify(deletedVariations));

        // Append new images
        newImages.forEach((img, i) => {
            if (img) formData.append(`product_images[${i}]`, img);
        });

        // Append color images
        attributes.forEach(attr => {
            if (attr.name.toLowerCase() === "color") {
                attr.options.forEach(opt => {
                    if (opt.imageFile) {
                        formData.append(`color_images[${opt.id}]`, opt.imageFile);
                    }
                });
            }
        });

        // Basic validation
        const errors = [];
        if (!product.name.trim()) errors.push("Product name is required.");
        const hasEmptyAttributeNames = attributes.some((a) => !a.name.trim());
        if (hasEmptyAttributeNames) errors.push("All attribute names must be filled.");
        const hasEmptyOption = attributes.some((a) => a.options.some((o) => !o.value.trim()));
        if (hasEmptyOption) errors.push("All attribute options must be filled.");

        if (errors.length) {
            toast.error("Fix errors:\n" + errors.join("\n"));
            return;
        }

        const loadingToast = toast.loading("Updating product...");

        try {
            const res = await fetch(`${API_BASE_URL}/products/editproduct/${id}`, {
                method: 'PUT',
                body: formData,
                credentials: "include",
            });

            const data = await res.json();

            toast.dismiss(loadingToast);

            if (!res.ok) {
                toast.error(data.error || "Failed to update product.");
            } else {
                toast.success("Product updated successfully!");
                setTimeout(() => {
                    setActiveSection('view products');
                }, 1500);
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error("Failed to update product");
            console.error(error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-300">Loading product...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Toaster position="top-right" />

            <div className="max-w-7xl mx-auto shadow-md pt-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold mb-4">Edit Product</h1>
                        <p className="text-gray-400">Update product details, variations, and images</p>
                    </div>
                    <button
                        onClick={() => setActiveSection('view products')}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                        ← Back to Products
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic product info */}
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Basic Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Product Name *</label>
                                <input
                                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                                    value={product.name}
                                    onChange={(e) => setProduct((p) => ({ ...p, name: e.target.value }))}
                                    placeholder="e.g. Classic T-Shirt"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">SKU</label>
                                <input
                                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                                    value={product.sku}
                                    onChange={(e) => setProduct((p) => ({ ...p, sku: e.target.value }))}
                                    placeholder="e.g. TS-001"
                                />
                            </div>

                            <div className="md:col-span-3">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <textarea
                                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                                    rows="3"
                                    value={product.description}
                                    onChange={(e) => setProduct((p) => ({ ...p, description: e.target.value }))}
                                    placeholder="Product description..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Base Price</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                                    value={product.base_price}
                                    onChange={(e) => setProduct((p) => ({ ...p, base_price: e.target.value }))}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Product Images */}
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Product Images</h2>

                        {/* Existing Images */}
                        {existingImages.length > 0 && (
                            <div className="mb-4">
                                <h3 className="text-sm font-medium text-gray-400 mb-2">Current Images</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {existingImages.map((img) => (
                                        <div key={img.id} className="relative group">
                                            <img
                                                src={`${API_BASE_URL}/images/${img.filename}`}
                                                alt="Product"
                                                className="w-full h-32 object-cover rounded-lg border border-gray-600"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(img.id, true)}
                                                className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* New Images */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-400 mb-2">Add New Images</h3>
                            <div className="space-y-3">
                                {newImages.map((img, index) => (
                                    <div key={index} className="flex items-center gap-3 bg-gray-900/30 p-3 rounded-lg border border-gray-700">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                setNewImages((prev) => {
                                                    const updated = [...prev];
                                                    updated[index] = file;
                                                    return updated;
                                                });
                                            }}
                                            className="flex-1 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-500/20 file:text-gray-400 hover:file:bg-gray-500/30 cursor-pointer"
                                        />
                                        {img && (
                                            <img
                                                src={URL.createObjectURL(img)}
                                                alt="Preview"
                                                className="h-16 w-16 object-cover rounded border border-gray-600"
                                            />
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index, false)}
                                            className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={() => setNewImages((prev) => [...prev, null])}
                                className="mt-3 px-4 py-2 hover:bg-gray-500/30 text-gray-200 border border-gray-300 rounded-lg transition-colors"
                            >
                                + Add Image
                            </button>
                        </div>
                    </div>

                    {/* Attributes */}
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Attributes</h2>

                        <div className="space-y-4">
                            {attributes.map((attr) => (
                                <div key={attr.id} className="bg-gray-900/30 border border-gray-700 rounded-lg p-4">
                                    <h3 className="font-medium text-gray-200 mb-3">{attr.name}</h3>
                                    <div className="space-y-3">
                                        {attr.options.map((opt) => (
                                            <div key={opt.id} className="flex flex-col md:flex-row gap-3 items-start md:items-center bg-gray-800/30 p-3 rounded-lg border border-gray-700">
                                                <div className="flex-1 w-full">
                                                    <input
                                                        className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                                                        value={opt.value}
                                                        onChange={(e) => updateOptionValue(attr.id, opt.id, e.target.value)}
                                                        placeholder={`e.g. ${attr.name === "Color" ? "Red" : "Large"}`}
                                                    />
                                                </div>

                                                {attr.name.toLowerCase() === "color" && (
                                                    <div className="flex items-center gap-3">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) updateOptionImage(attr.id, opt.id, file);
                                                            }}
                                                            className="text-sm text-gray-400 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-gray-500/20 file:text-gray-400 hover:file:bg-gray-500/30"
                                                        />
                                                        {opt.previewUrl && (
                                                            <img
                                                                src={opt.previewUrl}
                                                                alt={opt.value}
                                                                className="w-10 h-10 rounded object-cover border border-gray-600"
                                                            />
                                                        )}
                                                    </div>
                                                )}

                                                <button
                                                    type="button"
                                                    onClick={() => removeOption(attr.id, opt.id)}
                                                    className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg transition-colors"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => addOption(attr.id)}
                                            className="px-3 py-1 hover:bg-gray-500/30 text-sm rounded-md border border-gray-400"
                                        >
                                            + Add {attr.name} Option
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Variations */}
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-xl font-semibold text-white">Variations ({variations.length})</h2>
                                <p className="text-sm text-gray-400 mt-1">Generate variations based on attributes</p>
                            </div>
                            <button
                                type="button"
                                onClick={generateVariations}
                                className="px-3 py-1.5 text-sm rounded-md bg-indigo-100 text-indigo-700 border"
                            >
                                Generate Variations
                            </button>
                        </div>

                        <div className="space-y-3">
                            {variations.map((v) => (
                                <div key={v.id} className="bg-gray-900/30 border border-gray-700 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="text-sm text-gray-400">
                                            {v.options.map((o, idx) => (
                                                <span key={idx} className="mr-3">
                                                    <strong className="text-gray-300">{o.attribute_name}:</strong> {o.option_value}
                                                </span>
                                            ))}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeVariation(v.id, v.existing_id)}
                                            className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg transition-colors text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">SKU</label>
                                            <input
                                                value={v.sku}
                                                onChange={(e) => updateVariationField(v.id, "sku", e.target.value)}
                                                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">Price</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={v.price}
                                                onChange={(e) => updateVariationField(v.id, "price", e.target.value)}
                                                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">Stock</label>
                                            <input
                                                type="number"
                                                value={v.stock_quantity}
                                                onChange={(e) => updateVariationField(v.id, "stock_quantity", e.target.value)}
                                                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setActiveSection('view products')}
                            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-indigo-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                        >
                            Update Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}