import {Link, useLocation} from "react-router-dom";

const Sidebar = () => {
    const location = useLocation();

    return (
        <aside className="w-64 h-screen bg-white shadow-md flex flex-col">
            {/* Logo */}
            <div className="p-4 flex items-center gap-2 text-xl font-bold text-gray-800">
                <img src="/logo.png" alt="NET-SKYPLOT Logo" className="w-8 h-8 object-contain"/>
                <span>NET-SKYPLOT</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2">
                <NavItem label="Home" link="/" active={location.pathname === "/"}/>
                {/*<NavItem label="Library" link="/library" active={location.pathname === "/library"}/>*/}
                <NavItem label="Documentations" link="/documentations"
                         active={location.pathname === "/documentations"}/>
            </nav>

            {/* Start Planning Button */}
            <div className="p-0">
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-none">
                    Start Planning
                </button>
            </div>
        </aside>
    );
};

const NavItem = ({label, link, active}: { label: string; link: string; active: boolean }) => (
    <Link to={link} className="block">
        <div
            className={`px-4 py-3 rounded-md cursor-pointer w-full ${
                active ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
        >
            {label}
        </div>
    </Link>
);

export default Sidebar;
