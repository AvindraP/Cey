import { useState } from "react";
import {
    HomeIcon,
    ChartBarIcon,
    Cog6ToothIcon,
    UserIcon,
    CubeIcon,
    ChevronRightIcon,
    ChevronLeftIcon,
} from "@heroicons/react/24/outline";

const menuItems = [
    { name: "Overview", icon: HomeIcon, href: "#" },
    { name: "Analytics", icon: ChartBarIcon, href: "#" },
    {
        name: "Products",
        icon: CubeIcon,
        subItems: [
            { name: "View Products", href: "#" },
            { name: "Add Product", href: "#" },
        ],
    },
    { name: "Settings", icon: Cog6ToothIcon, href: "#" },
    { name: "Profile", icon: UserIcon, href: "#" },
];

function SidebarItem({ item, sidebarCollapsed, setActiveSection, activeSection }) {
    const [open, setOpen] = useState(false);
    const Icon = item.icon;

    const handleClick = () => {
        if (item.subItems) setOpen(!open);
        else setActiveSection(item.name.toLowerCase()); // e.g., "Products" → "products"
    };

    return (
        <div>
            <button
                onClick={handleClick}
                className={`flex items-center justify-between w-full rounded-xl px-3 py-2 hover:bg-white/10 transition-all ${activeSection === item.name.toLowerCase() ? "bg-white/10" : ""}`}
            >
                <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span
                        className={`whitespace-nowrap overflow-hidden transition-all duration-500 ${sidebarCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
                            }`}
                    >
                        {item.name}
                    </span>
                </div>
                {item.subItems && !sidebarCollapsed && (
                    <ChevronRightIcon
                        className={`w-4 h-4 transition-transform ${open ? "rotate-90" : ""
                            }`}
                    />
                )}
            </button>

            {item.subItems && open && !sidebarCollapsed && (
                <div className="whitespace-nowrap overflow-hidden ml-8 mt-2 space-y-1 transition-all duration-500">
                    {item.subItems.map((sub) => (
                        <button
                            key={sub.name}
                            onClick={() => setActiveSection(sub.name.toLowerCase())}
                            className={`block rounded-lg px-3 py-2 text-sm hover:bg-white/10 transition-all ${activeSection === sub.name.toLowerCase() ? "bg-white/10" : ""}`}
                        >
                            {sub.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
function MobileSidebarItem({ item, setActiveSection, activeSection }) {
    const [open, setOpen] = useState(false);
    const Icon = item.icon;

    const handleClick = () => {
        if (item.subItems) setOpen(!open);
        else setActiveSection(item.name.toLowerCase()); // e.g., "Products" → "products"
    };

    return (
        <div>
            <button
                onClick={handleClick}
                className={`flex items-center justify-between w-full rounded-xl px-3 py-2 hover:bg-white/10 transition-all duration-300 
                    ${activeSection === item.name.toLowerCase() ? "bg-white/10" : ""}`}
            >
                <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span className="transition-all duration-300">{item.name}</span>
                </div>

                {item.subItems && (
                    <ChevronRightIcon
                        className={`w-4 h-4 transition-transform duration-300 ${open ? "rotate-90" : ""
                            }`}
                    />
                )}
            </button>

            {item.subItems && (
                <div
                    className={`ml-6 overflow-hidden transition-all duration-500 ${open ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                        }`}
                >
                    {item.subItems.map((sub) => (
                        <a
                            key={sub.name}
                            href={sub.href}
                            onClick={() => { setActiveSection(sub.name.toLowerCase()) }}
                            className={`block rounded-lg px-3 py-2 text-sm hover:bg-white/10 transition-all ${activeSection === sub.name.toLowerCase() ? "bg-white/10" : ""}`}
                        >
                            {sub.name}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}


export default function Sidebar({ sidebarOpen, setSidebarOpen, setActiveSection, activeSection }) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <>
            <aside
                className={`hidden sm:flex sm:flex-col bg-white/5 backdrop-blur-md border-r border-white/10 
                            transition-[width] duration-500 ease-in-out overflow-hidden ${sidebarCollapsed ? "sm:w-15" : "sm:w-50"
                    }`}
            >
                <div className="flex items-center justify-between p-4 border-b border-white/10 transition-all">
                    {!sidebarCollapsed && (
                        <h2 className="font-semibold text-lg">Dashboard</h2>
                    )}
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="text-slate-100 hover:bg-white/10 p-2 rounded-lg transition"
                    >
                        {sidebarCollapsed ? (
                            <ChevronRightIcon className="w-5 h-5" />
                        ) : (
                            <ChevronLeftIcon className="w-5 h-5" />
                        )}
                    </button>
                </div>

                <nav className="flex-1 px-2 py-4 space-y-2">
                    {menuItems.map((item) => (
                        <SidebarItem
                            key={item.name}
                            item={item}
                            sidebarCollapsed={sidebarCollapsed}
                            setActiveSection={setActiveSection}
                            activeSection={activeSection}
                        />
                    ))}
                </nav>
            </aside>

            {/* Mobile sidebar overlay */}
            {
                sidebarOpen && (
                    <div className="fixed inset-0 z-50 sm:hidden">
                        <div
                            className="absolute inset-0 bg-black/50"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <div
                            className={`absolute left-0 top-0 w-64 h-full bg-white/5 backdrop-blur-md border-r border-white/10 p-4 flex flex-col
                                        transform transition-transform duration-500 ease-in-out
                                        ${sidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}
                        >
                            <button
                                className="self-end mb-4 text-slate-100 text-2xl"
                                onClick={() => setSidebarOpen(false)}
                            >
                                ✕
                            </button>
                            <nav className="flex-1 flex flex-col gap-2">
                                {menuItems.map((item) => (
                                    <MobileSidebarItem key={item.name} item={item} setActiveSection={setActiveSection} activeSection={activeSection} />
                                ))}
                            </nav>
                        </div>
                    </div>
                )
            }
        </>

    );
};