import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Login from './dashboard/login/Login.jsx'
import Dashboard from './dashboard/index.jsx'
import { AuthProvider } from './middleware/AuthProvider.jsx'
import ProtectedRoute from './middleware/ProtectedRoute.jsx'

// Define routes
const router = createBrowserRouter([
  { path: "/", element: <App />, }, // main app or homepage  
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
