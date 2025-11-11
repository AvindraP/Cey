import React, { useState, useMemo } from "react";
import toast from "react-hot-toast";

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

export default function AddProduct() {
  const [product, setProduct] = useState({
    id: crypto.randomUUID(),
    name: "",
    description: "",
    base_price: "",
    sku: "",
  });

  const [attributes, setAttributes] = useState([
    { id: crypto.randomUUID(), name: "Color", options: [{ id: crypto.randomUUID(), value: "default", imageFile: null }] },
    { id: crypto.randomUUID(), name: "Size", options: [{ id: crypto.randomUUID(), value: "default", imageFile: null }] },
  ]);
  const [variations, setVariations] = useState([]); // generated variations

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
      const defaultVariation = {
        id: crypto.randomUUID(),
        product_id: product.id,
        sku: `${product.sku || product.name || "P"}-DEFAULT`.toUpperCase(),
        price: product.base_price || "",
        stock_quantity: 0,
        options: [
          { attribute_name: "Color", option_value: "default" },
          { attribute_name: "Size", option_value: "default" },
        ],
      };
      setVariations([defaultVariation]);
      return;
    }

    const combos = cartesianProduct(optionMatrix);
    const newVariations = combos.map((combo, idx) => {
      const combination = combo.map((entry) => ({
        attribute_id: entry.attributeId,
        attribute_name: entry.attributeName,
        option_id: entry.optionId,
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

    setVariations(newVariations);
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

        // Prevent deleting the last remaining option
        if (a.options.length <= 1) {
          toast.error(`At least one option must remain for ${a.name}`, {
            style: {
              background: "#fee2e2", // Tailwind red-100
              color: "#991b1b", // Tailwind red-800
              border: "1px solid #fca5a5", // Tailwind red-300
            },
            icon: "⚠️",
          });
          return a;
        }

        return {
          ...a,
          options: a.options.filter((o) => o.id !== optionId),
        };
      })
    );
  };

  /* Variation editing */
  const updateVariationField = (variationId, field, value) => {
    setVariations((prev) => prev.map((v) => (v.id === variationId ? { ...v, [field]: value } : v)));
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
        product_id: v.product_id,
        sku: v.sku,
        price: v.price,
        stock_quantity: Number(v.stock_quantity),
        options: v.options,
      }))
    ));

    // Append images
    if (product.images) {
      product.images.forEach((img, i) => {
        if (img) formData.append(`product_images[${i}]`, img);
      });
    }

    // Append image files (if any)
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
      alert("Fix errors:\n" + errors.join("\n"));
      return;
    }

    const res = await fetch(`${API_BASE_URL}/products/addproduct`, {
      method: 'POST',
      body: formData,
      credentials: "include",
    });

    const data = res.json();

    if (!res.ok) {
      alert(data.error || "Failed to create product.");
    } else {
      alert("Product created successfully!");
      setProduct({ id: crypto.randomUUID(), name: "", description: "", base_price: "", sku: "" });
      setAttributes([
        { id: crypto.randomUUID(), name: "Color", options: [] },
        { id: crypto.randomUUID(), name: "Size", options: [] },
      ]);
      setVariations([]);
    }

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
                    imageFile: file, // keep raw File for backend upload
                    previewUrl: e.target.result, // local preview
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

  return (
    <div className="min-h-screen p-0">
      <div className="mx-auto shadow-md rounded-lg p-0 pt-6">
        <h1 className="text-2xl font-semibold mb-4">Create Product</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic product info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium">Product Name</label>
              <input
                className="mt-1 pl-2 block w-full border-gray-300 rounded-md shadow-sm"
                value={product.name}
                onChange={(e) => setProduct((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Classic T-Shirt"
                maxLength={100}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">SKU</label>
              <input
                className="mt-1 pl-2 block w-full border-gray-300 rounded-md shadow-sm"
                value={product.sku}
                onChange={(e) => setProduct((p) => ({ ...p, sku: e.target.value }))}
                placeholder="e.g. TS-001"
                maxLength={100}
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium">Description</label>
              <textarea
                className="mt-1 pl-2 block w-full border-gray-300 rounded-md shadow-sm"
                rows="3"
                value={product.description}
                onChange={(e) => setProduct((p) => ({ ...p, description: e.target.value }))}
                placeholder="Product description..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Base Price</label>
              <input
                type="number"
                step="0.01"
                className="mt-1 pl-2 block w-full border-gray-300 rounded-md shadow-sm"
                value={product.base_price}
                onChange={(e) => setProduct((p) => ({ ...p, base_price: e.target.value }))}
                placeholder="0.00"
                max={99999999.99}
                min={0}
              />
            </div>

            {/* Product Images */}
            <div className="md:col-span-3">
              <label className="block text-sm font-medium">Product Images</label>
              <div className="mt-2 space-y-2">
                {product.images?.map((img, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setProduct((prev) => {
                          const newImages = [...(prev.images || [])];
                          newImages[index] = file;
                          return { ...prev, images: newImages };
                        });
                      }}
                      className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md cursor-pointer"
                    />
                    {img && (
                      <div className="mt-1">
                        <img
                          src={typeof img === "string" ? img : URL.createObjectURL(img)}
                          alt={`Preview ${index + 1}`}
                          className="h-16 w-16 object-cover rounded border"
                        />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setProduct((prev) => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== index),
                        }))
                      }
                      className="px-2 py-1 text-sm bg-red-50 text-red-600 border rounded-md"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  setProduct((prev) => ({
                    ...prev,
                    images: [...(prev.images || []), null],
                  }))
                }
                className="mt-2 px-3 py-1.5 bg-cyan-50/20 text-cyan-100 border rounded-md text-sm"
              >
                + Add Image
              </button>
            </div>
          </div>

          {/* Attributes */}
          <div>
            <h2 className="text-lg font-medium mb-2">Attributes</h2>
            <div className="space-y-4">
              {attributes.map((attr) => (
                <div key={attr.id} className="border border-gray-700 rounded-md p-4">
                  <h3 className="font-medium mb-2">{attr.name}</h3>
                  <div className="space-y-2">
                    {attr.options.map((opt) => (
                      <div key={opt.id} className="flex flex-col md:flex-row gap-3 items-start md:items-center border border-gray-900 p-3 rounded-md">
                        <div className="flex-1 w-full">
                          <input
                            className="w-full border border-gray-600 pl-2 rounded-md shadow-sm"
                            value={opt.value}
                            onChange={(e) => updateOptionValue(attr.id, opt.id, e.target.value)}
                            placeholder={`e.g. ${attr.name === "Color" ? "Red" : "Large"}`}
                          />
                        </div>

                        {/* Only show image upload for Color options */}
                        {attr.name.toLowerCase() === "color" && (
                          <div className="flex items-center gap-3">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) updateOptionImage(attr.id, opt.id, file);
                              }}
                              className="text-sm text-gray-600"
                            />
                            {opt.previewUrl && (
                              <img
                                src={opt.previewUrl}
                                alt={opt.value}
                                className="w-10 h-10 rounded object-cover border"
                              />
                            )}
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => removeOption(attr.id, opt.id)}
                          className="px-2 py-1 rounded-md bg-red-50 text-red-600 border"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addOption(attr.id)}
                      className="px-3 py-1 text-sm rounded-md border border-gray-400"
                    >
                      + Add {attr.name} Option
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Variations */}
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Variations ({variations.length})</h2>
              <button
                type="button"
                onClick={generateVariations}
                className="px-3 py-1.5 text-sm rounded-md bg-indigo-100 text-indigo-700 border"
              >
                Generate Variations
              </button>
            </div>

            <div className="mt-3 space-y-3">
              {variations.map((v) => (
                <div key={v.id} className="border border-gray-700 rounded-md p-3 flex flex-col gap-3">
                  <div className="text-sm text-gray-600">
                    {v.options.map((o) => (
                      <span key={o.option_id} className="mr-2">
                        <strong>{o.attribute_name}:</strong> {o.option_value}
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <input
                      value={v.sku}
                      onChange={(e) =>
                        updateVariationField(v.id, "sku", e.target.value)
                      }
                      className="border-gray-300 rounded-md shadow-sm"
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={v.price}
                      onChange={(e) =>
                        updateVariationField(v.id, "price", e.target.value)
                      }
                      className="border-gray-300 rounded-md shadow-sm"
                      placeholder="Price"
                    />
                    <input
                      type="number"
                      value={v.stock_quantity}
                      onChange={(e) =>
                        updateVariationField(v.id, "stock_quantity", e.target.value)
                      }
                      className="border-gray-300 rounded-md shadow-sm"
                      placeholder="Stock"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Save Product
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
