import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Overview from "./sections/Overview";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <div className="min-h-screen flex bg-gray-950 text-slate-100">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setActiveSection={setActiveSection} activeSection={activeSection} />


      {/* Main content */}
      <main className="flex-1 p-4 sm:p-8 overflow-auto relative">
        {/* Background glow */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-[30rem] h-[30rem] rounded-full bg-white/3 blur-3xl" />
        </div>

        {/* Header */}
        <Header setSidebarOpen={setSidebarOpen} />

        {/* Dynamically load sections */}
        {activeSection === "overview" && <Overview />}
      </main>
    </div>
  );
}
