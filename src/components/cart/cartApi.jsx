const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Network error");
  }
  return res.json();
}

export async function addToCart(product_id, variation_id = null, quantity = 1) {
  const res = await fetch(`${API_BASE_URL}/cart/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // include cookies (for JWT/session)
    body: JSON.stringify({ product_id, variation_id, quantity }),
  });
  return handleResponse(res);
}

export async function getCart() {
  const res = await fetch(`${API_BASE_URL}/cart`, {
    method: "GET",
    credentials: "include",
  });
  return handleResponse(res);
}

export async function updateCartItem(itemId, quantity) {
  const res = await fetch(`${API_BASE_URL}/cart/update/${itemId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ quantity }),
  });
  return handleResponse(res);
}

export async function removeCartItem(itemId) {
  const res = await fetch(`${API_BASE_URL}/cart/remove/${itemId}`, {
    method: "DELETE",
    credentials: "include",
  });
  return handleResponse(res);
}

export async function clearCart() {
  const res = await fetch(`${API_BASE_URL}/cart/clear`, {
    method: "DELETE",
    credentials: "include",
  });
  return handleResponse(res);
}
