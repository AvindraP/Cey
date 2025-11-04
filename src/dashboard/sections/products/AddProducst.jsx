import React, { useState, useMemo } from "react";

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
    { id: crypto.randomUUID(), name: "Color", options: [] },
    { id: crypto.randomUUID(), name: "Size", options: [] },
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
      setVariations([]);
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

  /* Attribute CRUD */
  const addAttribute = () => {
    setAttributes((prev) => [...prev, { id: crypto.randomUUID(), name: "", options: [] }]);
  };

  const updateAttributeName = (attrId, name) => {
    setAttributes((prev) => prev.map((a) => (a.id === attrId ? { ...a, name } : a)));
  };

  const removeAttribute = (attrId) => {
    setAttributes((prev) => prev.filter((a) => a.id !== attrId));
  };

  const addOption = (attrId) => {
    setAttributes((prev) =>
      prev.map((a) => (a.id === attrId ? { ...a, options: [...(a.options || []), { id: crypto.randomUUID(), value: "" }] } : a))
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
    setAttributes((prev) => prev.map((a) => (a.id === attrId ? { ...a, options: a.options.filter((o) => o.id !== optionId) } : a)));
  };

  /* Variation editing */
  const updateVariationField = (variationId, field, value) => {
    setVariations((prev) => prev.map((v) => (v.id === variationId ? { ...v, [field]: value } : v)));
  };

  const removeVariation = (variationId) => {
    setVariations((prev) => prev.filter((v) => v.id !== variationId));
  };

  /* Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Build payload
    const payload = {
      product: { ...product },
      attributes: attributes.map((a) => ({
        id: a.id,
        name: a.name,
        options: a.options.map((o) => ({ id: o.id, value: o.value })),
      })),
      variations: variations.map((v) => ({
        id: v.id,
        product_id: v.product_id,
        sku: v.sku,
        price: v.price,
        stock_quantity: Number(v.stock_quantity),
        options: v.options,
      })),
    };

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

    // For the demo, we just log and show the JSON below the form
    // console.log("Product payload", payload);
    // setLastPayload(payload);

    const res = await fetch(`${API_BASE_URL}/products/addproduct`, {
      method: 'POST',
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(payload),
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

  // const [lastPayload, setLastPayload] = useState(null);

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
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
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
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                value={product.sku}
                onChange={(e) => setProduct((p) => ({ ...p, sku: e.target.value }))}
                placeholder="e.g. TS-001"
                maxLength={100}
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium">Description</label>
              <textarea
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
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
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                value={product.base_price}
                onChange={(e) => setProduct((p) => ({ ...p, base_price: e.target.value }))}
                placeholder="0.00"
                max={99999999.99}
                min={0}
              />
            </div>
          </div>

          {/* Attributes */}
          <div>
            <h2 className="text-lg font-medium mb-2">Attributes</h2>
            <div className="space-y-4">
              {attributes.map((attr) => (
                <div key={attr.id} className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">{attr.name}</h3>
                  <div className="space-y-2">
                    {attr.options.map((opt) => (
                      <div key={opt.id} className="flex gap-2 items-center">
                        <input
                          className="flex-1 border-gray-300 rounded-md shadow-sm"
                          value={opt.value}
                          onChange={(e) =>
                            updateOptionValue(attr.id, opt.id, e.target.value)
                          }
                          placeholder={`e.g. ${
                            attr.name === "Color" ? "Red" : "Large"
                          }`}
                        />
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
                      className="px-3 py-1 text-sm rounded-md border"
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
                <div key={v.id} className="border rounded-md p-3 flex flex-col gap-3">
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

        {/* Debug / payload preview */}
        {/* <div className="mt-8">
          <h3 className="text-lg font-medium mb-2">Payload preview</h3>
          <div className="bg-gray-100/10 rounded-md p-4 overflow-auto">
            <pre className="text-xs">{JSON.stringify(lastPayload || { product, attributes, variations }, null, 2)}</pre>
          </div>
        </div> */}
      </div>
    </div>
  );
}
