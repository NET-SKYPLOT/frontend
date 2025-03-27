import {Link, useLocation} from "react-router-dom";
import {useState, useEffect} from "react";
import {Menu, Home, Book, BookOpenText, ClipboardList, X, Layers, Users, Code} from "lucide-react";

const HomeTabs = [
    {name: "Introduction", icon: <BookOpenText size={18}/>},
    {name: "Features", icon: <Layers size={18}/>},
    {name: "Our Team", icon: <Users size={18}/>},
    {name: "Open-Source", icon: <Code size={18}/>},
];

// Home submenu component
const HomeSubMenu = ({
                         activeTab,
                         setActiveTab,
                         isMobile,
                         setIsOpen,
                         isVisible,
                     }: {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    isMobile?: boolean;
    setIsOpen?: (open: boolean) => void;
    isVisible: boolean;
}) => (
    <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isVisible ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
        } w-full`}
    >
        <div className="space-y-1 w-full">
            {HomeTabs.map((tab) => (
                <button
                    key={tab.name}
                    onClick={() => {
                        setActiveTab(tab.name);
                        if (isMobile && setIsOpen) setIsOpen(false); // Close menu on mobile
                    }}
                    className={`w-full text-left py-2 transition ${
                        activeTab === tab.name
                            ? "bg-blue-100 text-blue-600 font-semibold"
                            : "hover:bg-gray-100 text-gray-700"
                    }`}
                >
                    <div className="flex items-center gap-2 px-6 text-sm">
                        {tab.icon}
                        {tab.name}
                    </div>
                </button>
            ))}
        </div>
    </div>
);

// Main Sidebar component
const Sidebar = ({activeTab, setActiveTab}: {
    activeTab?: string,
    setActiveTab?: (tab: string) => void
}) => {
    const location = useLocation();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
    const [isOpen, setIsOpen] = useState(false);
    const [showSubMenu, setShowSubMenu] = useState(location.pathname === "/");

    const showHomeSubMenu = location.pathname === "/" && activeTab && setActiveTab;

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1024);
            if (window.innerWidth > 1024) setIsOpen(false);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        setShowSubMenu(location.pathname === "/");
    }, [location.pathname]);

    return (
        <>
            {/* Topbar on mobile */}
            {isMobile && (
                <header
                    className="fixed top-0 left-0 w-full bg-white shadow-md flex items-center justify-between p-4 z-50">
                    <Link to="/"
                          className="p-4 flex items-center gap-2 text-xl font-bold text-gray-800 hover:text-gray-600">
                        <img src="/logo.png" alt="NET-SKYPLOT Logo" className="w-8 h-8 object-contain"/>
                        <span className={`${isOpen ? "block" : "hidden"} lg:block`}>NET-SKYPLOT</span>
                    </Link>
                    <button onClick={() => setIsOpen(true)} className="text-gray-700 hover:text-gray-900">
                        <Menu size={30}/>
                    </button>
                </header>
            )}

            {/* Sidebar on desktop */}
            {!isMobile && (
                <aside className="bg-white shadow-md h-screen w-64 fixed top-0 left-0">
                    <Link to="/"
                          className="p-4 flex items-center gap-2 text-xl font-bold text-gray-800 hover:text-gray-600">
                        <img src="/logo.png" alt="NET-SKYPLOT Logo" className="w-8 h-8 object-contain"/>
                        <span className={`${isOpen ? "block" : "hidden"} lg:block`}>NET-SKYPLOT</span>
                    </Link>

                    <nav className="px-4 space-y-2">
                        <NavItem icon={<Home size={20}/>} label="Home" link="/" active={location.pathname === "/"}/>
                        {showHomeSubMenu && (
                            <HomeSubMenu
                                activeTab={activeTab!}
                                setActiveTab={setActiveTab!}
                                isVisible={showSubMenu}
                            />
                        )}
                        <NavItem icon={<Book size={20}/>} label="Documentations" link="/documentations"
                                 active={location.pathname === "/documentations"}/>
                    </nav>

                    <div className="p-6 absolute bottom-0 w-full">
                        <Link to="/planning" className="block">
                            <button
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-md flex items-center justify-center gap-2">
                                <ClipboardList size={20}/>
                                Start Planning
                            </button>
                        </Link>
                    </div>
                </aside>
            )}

            {/* Full screen mobile drawer */}
            {isMobile && isOpen && (
                <>
                    <div className="fixed inset-0 bg-white z-50 flex flex-col">
                        <div className="p-4 flex items-center justify-between text-xl font-bold text-gray-800 border-b">
                            <span>Menu</span>
                            <button onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-gray-900">
                                <X size={30}/>
                            </button>
                        </div>

                        <nav className="flex-1 flex flex-col items-start space-y-2 text-lg px-4 pt-6 w-full">
                            <NavItem icon={<Home size={24}/>} label="Home" link="/" active={location.pathname === "/"}
                                     setIsOpen={setIsOpen} isMobile/>
                            {showHomeSubMenu && (
                                <HomeSubMenu
                                    activeTab={activeTab!}
                                    setActiveTab={setActiveTab!}
                                    isMobile={isMobile}
                                    setIsOpen={setIsOpen}
                                    isVisible={showSubMenu}
                                />
                            )}
                            <NavItem icon={<Book size={24}/>} label="Documentations" link="/documentations"
                                     active={location.pathname === "/documentations"} setIsOpen={setIsOpen} isMobile/>
                            <Link to="/planning" onClick={() => setIsOpen(false)} className="block w-full px-2">
                                <button
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-md flex items-center justify-center gap-2">
                                    <ClipboardList size={24}/>
                                    Start Planning
                                </button>
                            </Link>
                        </nav>
                    </div>

                    {/* Overlay */}
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsOpen(false)}/>
                </>
            )}
        </>
    );
};

// Sidebar nav item component
const NavItem = ({icon, label, link, active, setIsOpen, isMobile}: {
    icon: JSX.Element;
    label: string;
    link: string;
    active: boolean;
    setIsOpen?: (open: boolean) => void;
    isMobile?: boolean
}) => (
    <Link to={link} onClick={() => isMobile && setIsOpen?.(false)} className="block w-full">
        <div
            className={`flex items-center gap-3 px-6 py-4 text-xl rounded-md cursor-pointer transition ${
                active ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
        >
            {icon}
            {label}
        </div>
    </Link>
);

export default Sidebar;
