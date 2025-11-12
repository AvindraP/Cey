import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Login from './dashboard/login/Login.jsx'
import Dashboard from './dashboard/index.jsx'
import { AuthProvider } from './middleware/AuthProvider.jsx'
import ProtectedRoute from './middleware/ProtectedRoute.jsx'
import ProductPage from './components/products/ProductPage.jsx'
import AllProductsPage from './components/products/AllProductsPage.jsx'
import Cart from './components/cart/Cart.jsx'
import CheckoutPage from './components/checkout/CheckoutPage.jsx'

// Define routes
const router = createBrowserRouter([
  { path: "/", element: <App />, }, // main app or homepage  
  { path: "product", element: <ProductPage />, }, // single product page
  { path: "products", element: <AllProductsPage />, }, // all products
  { path: "cart", element: <Cart />, }, // cart
  { path: "checkout", element: <CheckoutPage />, }, // cart
  { path: "login", element: <Login />, }, // admin dashboard login
  { path: "dashboard", element: (<ProtectedRoute> <Dashboard /> </ProtectedRoute>), }, // admin dashboard 
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
