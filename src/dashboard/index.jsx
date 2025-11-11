import { useContext, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Overview from "./sections/Overview";
import AddProduct from "./sections/products/AddProducst";
import ViewProducts from "./sections/products/ViewProducts";
import { AuthContext } from "../middleware/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useActivityTracker } from "../hooks/useActivityTracker";
import SessionWarningModal from "./SessionWarningModal";
import { Toaster } from "react-hot-toast";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  // Handle session timeout
  const handleTimeout = async () => {
    console.log('Session expired, logging out...');
    await logout();
    navigate('/login', {
      replace: true,
      state: { message: 'Your session has expired. Please login again.' }
    });
  };

  // Initialize activity tracker
  const { showWarning, extendSession } = useActivityTracker(user, handleTimeout, {
    sessionTimeout: 30 * 60 * 1000,  // 30 minutes
    extendThreshold: 5 * 60 * 1000,   // Extend every 5 minutes of activity
    warningTime: 2 * 60 * 1000,       // Warning 2 minutes before timeout
  });

  const handleContinueSession = async () => {
    await extendSession();
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-gray-950 text-slate-100">

      {/* Session Warning Modal */}
      <SessionWarningModal
        show={showWarning}
        onContinue={handleContinueSession}
        onLogout={handleLogout}
        timeLeft={120} // 2 minutes in seconds
      />

      {/* Toaster */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setActiveSection={setActiveSection} activeSection={activeSection} handleLogout={handleLogout} />


      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-auto relative">
        {/* Background glow */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-[30rem] h-[30rem] rounded-full bg-white/3 blur-3xl" />
        </div>

        {/* Header */}
        <Header setSidebarOpen={setSidebarOpen} />

        {/* Dynamically load sections */}
        <div className="flex-1 overflow-y-auto scrollable px-4 sm:px-8 max-h-[calc(100vh-7rem)]">
          {activeSection === "overview" && <Overview />}
          {activeSection === "add product" && <AddProduct />}
          {activeSection === "view products" && <ViewProducts />}
        </div>
      </main>
    </div>
  );
}
