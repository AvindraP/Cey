import { useState } from "react";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-950 text-slate-100">
      {/* Sidebar for desktop */}
      <aside
        className={`hidden sm:flex sm:flex-col sm:w-64 transition-all duration-300 bg-white/5 backdrop-blur-md border-r border-white/10`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="font-semibold text-lg">My Dashboard</h2>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-2">
          <a
            href="#"
            className="block rounded-xl px-3 py-2 hover:bg-white/10 transition"
          >
            Overview
          </a>
          <a
            href="#"
            className="block rounded-xl px-3 py-2 hover:bg-white/10 transition"
          >
            Analytics
          </a>
          <a
            href="#"
            className="block rounded-xl px-3 py-2 hover:bg-white/10 transition"
          >
            Settings
          </a>
          <a
            href="#"
            className="block rounded-xl px-3 py-2 hover:bg-white/10 transition"
          >
            Profile
          </a>
        </nav>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 w-64 h-full bg-white/5 backdrop-blur-md border-r border-white/10 p-4 flex flex-col">
            <button
              className="self-end mb-4 text-slate-100 text-2xl"
              onClick={() => setSidebarOpen(false)}
            >
              ✕
            </button>
            <nav className="flex-1 flex flex-col gap-2">
              <a
                href="#"
                className="block rounded-xl px-3 py-2 hover:bg-white/10 transition"
              >
                Overview
              </a>
              <a
                href="#"
                className="block rounded-xl px-3 py-2 hover:bg-white/10 transition"
              >
                Analytics
              </a>
              <a
                href="#"
                className="block rounded-xl px-3 py-2 hover:bg-white/10 transition"
              >
                Settings
              </a>
              <a
                href="#"
                className="block rounded-xl px-3 py-2 hover:bg-white/10 transition"
              >
                Profile
              </a>
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 p-4 sm:p-8 overflow-auto relative">
        {/* Background glow */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-[30rem] h-[30rem] rounded-full bg-white/3 blur-3xl" />
        </div>

        {/* Header */}
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile hamburger menu */}
            <button
              className="sm:hidden p-2 rounded-lg hover:bg-white/10 transition"
              onClick={() => setSidebarOpen(true)}
            >
              <svg
                className="w-6 h-6 text-slate-100"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications button */}
            <button className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-sm transition">
              <svg
                className="w-5 h-5 text-slate-100"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="hidden sm:inline">Notifications</span>
            </button>

            {/* Account button */}
            <button className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-sm transition">
              <svg
                className="w-5 h-5 text-slate-100"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z"
                />
              </svg>
              <span className="hidden sm:inline">Account</span>
            </button>
          </div>
        </header>


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
            <li className="p-3 rounded-xl bg-white/10">New comment on blog post</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
