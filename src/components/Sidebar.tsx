const Sidebar = () => {
    return (
        <aside className="w-64 h-screen bg-white shadow-md flex flex-col">
            {/* Logo */}
            <div className="p-4 flex items-center gap-2 text-xl font-bold text-gray-800">
                <img src="/logo.png" alt="NET-SKYPLOT Logo" className="w-8 h-8 object-contain" />
                <span>NET-SKYPLOT</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2">
                <NavItem label="Home"/>
                <NavItem label="Settings"/>
                <NavItem label="Library"/>
                <NavItem label="Help"/>
            </nav>

            {/* Start Planning Button */}
            <div className="p-4">
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-md">
                    Start Planning
                </button>
            </div>
        </aside>
    );
};

const NavItem = ({label}: { label: string }) => (
    <div className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer">
        {label}
    </div>
);

export default Sidebar;
