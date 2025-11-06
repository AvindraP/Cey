import React, { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ViewProducts() {
  const [products, setProducts] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${API_BASE_URL}/products/getproducts`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError("Could not load products");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-600 text-sm">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 text-sm">{error}</div>
    );
  }

  return (
    <div className="min-h-screen p-0">
      <div className="mx-auto shadow-md rounded-lg p-0 pt-6 max-w-7xl">
        <h1 className="text-2xl font-semibold mb-4 px-6">
          View Products
        </h1>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-100/20 rounded">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-100">
                  Product ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-100">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-100">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-100">
                  Base Price
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-100">
                  Created At
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {products.map((p, i) => (
                <React.Fragment key={p.product.id}>
                  {/* Main Row */}
                  <tr
                    className="hover:bg-gray-800 cursor-pointer"
                    onClick={() => toggleExpand(p.product.id)}
                  >
                    <td className="px-6 py-3 text-sm text-gray-300">
                      {p.product.id}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-300">
                      {p.product.name}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-300">
                      {p.product.sku}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-300">
                      ${p.product.base_price}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-300">
                      {p.product.created_at
                        ? new Date(p.product.created_at).toLocaleString()
                        : "-"}
                    </td>
                  </tr>

                  {/* Expanded Row */}
                  {expanded === p.product.id && (
                    <tr className="bg-gray-50/10">
                      <td colSpan={5} className="px-6 py-4">
                        <div className="space-y-3">
                          {/* Attributes */}
                          <div>
                            <h3 className="text-sm font-semibold text-gray-100">
                              Attributes
                            </h3>
                            {p.attributes && p.attributes.length > 0 ? (
                              <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-300">
                                {p.attributes.map((attr) => (
                                  <div key={attr.id}>
                                    <strong>{attr.name}:</strong>{" "}
                                    {attr.options
                                      .map((o) => o.value)
                                      .join(", ")}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">
                                No attributes
                              </p>
                            )}
                          </div>

                          {/* Variations */}
                          <div>
                            <h3 className="text-sm font-semibold text-gray-100">
                              Variations ({p.variations?.length || 0})
                            </h3>

                            {p.variations && p.variations.length > 0 ? (
                              <div className="overflow-x-auto mt-2">
                                <table className="min-w-full text-sm border border-gray-800">
                                  <thead className="bg-gray-100/20">
                                    <tr>
                                      <th className="px-3 py-2 text-left font-medium">
                                        SKU
                                      </th>
                                      <th className="px-3 py-2 text-left font-medium">
                                        Price
                                      </th>
                                      <th className="px-3 py-2 text-left font-medium">
                                        Stock
                                      </th>
                                      <th className="px-3 py-2 text-left font-medium">
                                        Options
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {p.variations.map((v) => (
                                      <tr
                                        key={v.id}
                                        className="border-t border-gray-800 text-gray-300"
                                      >
                                        <td className="px-3 py-2">
                                          {v.sku}
                                        </td>
                                        <td className="px-3 py-2">
                                          ${v.price}
                                        </td>
                                        <td className="px-3 py-2">
                                          {v.stock_quantity}
                                        </td>
                                        <td className="px-3 py-2">
                                          {v.options
                                            .map(
                                              (o) =>
                                                `${o.attribute_name}: ${o.option_value}`
                                            )
                                            .join(", ")}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">
                                No variations
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}