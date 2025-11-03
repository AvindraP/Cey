export default function Header({ setSidebarOpen }) {
    return(
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
    );
};