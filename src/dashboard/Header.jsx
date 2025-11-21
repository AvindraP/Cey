import { BellAlertIcon, UserIcon } from "@heroicons/react/24/outline";

export default function Header({ setSidebarOpen }) {
    return(
        <header className="flex items-center justify-between p-4 sm:p-8">
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
            <h1 className="sm:text-2xl font-semibold tracking-tight">Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* <button className="flex items-center gap-2 px-2 py-1 sm:px-4 sm:py-2 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-sm transition">
              <BellAlertIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Notifications</span>
            </button> */}

            <button className="flex items-center gap-2 px-2 py-1 sm:px-4 sm:py-2 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-sm transition">
              <UserIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Account</span>
            </button>
          </div>
        </header>
    );
};