import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Login from './dashboard/login/Login.jsx'
import Dashboard from './dashboard/index.jsx'
import { AuthProvider } from './middleware/AuthProvider.jsx'
import ProductPage from './components/products/ProductPage.jsx'
import AllProductsPage from './components/products/AllProductsPage.jsx'
import Cart from './components/cart/Cart.jsx'
import CheckoutPage from './components/checkout/CheckoutPage.jsx'
import AdminRoute from './middleware/AdminRoute.jsx'
import CustomerRoute from './middleware/CustomerRoute.jsx'
import CustomerAccount from './customer/account/CustomerAccount.jsx'
import RegisterPage from './customer/register/RegisterPage.jsx'

// Define routes
const router = createBrowserRouter([
  { path: "/", element: <App />, }, // main app or homepage  
  { path: "product", element: <ProductPage />, }, // single product page
  { path: "products", element: <AllProductsPage />, }, // all products
  { path: "cart", element: <Cart />, }, // cart
  { path: "checkout", element: <CheckoutPage />, }, // checkout
  { path: "account", element: (<CustomerRoute><CustomerAccount /></CustomerRoute>), }, // customer account
  { path: "login", element: <Login />, }, // admin/customer login
  { path: "register", element: <RegisterPage />, }, // customer registration
  { path: "dashboard", element: (<AdminRoute> <Dashboard /> </AdminRoute>), }, // admin dashboard 
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
