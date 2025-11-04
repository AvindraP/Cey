import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Overview from "./sections/Overview";
import AddProduct from "./sections/products/AddProducst";
import ViewProducts from "./sections/products/ViewProducts";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <div className="min-h-screen flex bg-gray-950 text-slate-100">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setActiveSection={setActiveSection} activeSection={activeSection} />


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
