import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-950 text-slate-100">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />


      {/* Main content */}
      <main className="flex-1 p-4 sm:p-8 overflow-auto relative">
        {/* Background glow */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-[30rem] h-[30rem] rounded-full bg-white/3 blur-3xl" />
        </div>

        {/* Header */}
        <Header setSidebarOpen={setSidebarOpen} />

        {/* Dashboard cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Total Users</h2>
            <p className="text-3xl font-bold">1,245</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Revenue</h2>
            <p className="text-3xl font-bold">$12,480</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Active Sessions</h2>
            <p className="text-3xl font-bold">312</p>
          </div>
        </section>

        {/* Additional content */}
        <section className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <ul className="space-y-2">
            <li className="p-3 rounded-xl bg-white/10">User John signed up</li>
            <li className="p-3 rounded-xl bg-white/10">
              Payment processed for order #234
            </li>
            <li className="p-3 rounded-xl bg-white/10">
              New comment on blog post
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
