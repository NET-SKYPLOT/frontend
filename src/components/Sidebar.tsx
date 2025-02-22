import {Link, useLocation} from "react-router-dom";
import {useState, useEffect} from "react";
import {Menu, Home, Book, ClipboardList, X} from "lucide-react"; // Import icons

const Sidebar = () => {
    const location = useLocation();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
    const [isOpen, setIsOpen] = useState(false); // Mobile menu is hidden by default

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1024);
            if (window.innerWidth > 1024) setIsOpen(false);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
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

            {!isMobile && (
                <aside className="bg-white shadow-md h-screen w-64 fixed top-0 left-0">
                    {/* Sidebar Header */}
                    <Link to="/"
                          className="p-4 flex items-center gap-2 text-xl font-bold text-gray-800 hover:text-gray-600">
                        <img src="/logo.png" alt="NET-SKYPLOT Logo" className="w-8 h-8 object-contain"/>
                        <span className={`${isOpen ? "block" : "hidden"} lg:block`}>NET-SKYPLOT</span>
                    </Link>

                    {/* Navigation Links */}
                    <nav className="px-4 space-y-2">
                        <NavItem icon={<Home size={20}/>} label="Home" link="/" active={location.pathname === "/"}/>
                        <NavItem icon={<Book size={20}/>} label="Documentations" link="/documentations"
                                 active={location.pathname === "/documentations"}/>
                    </nav>

                    {/* Start Planning Button */}
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

            {isMobile && isOpen && (
                <div className="fixed inset-0 bg-white z-50 flex flex-col">
                    {/* Mobile Menu Header */}
                    <div className="p-4 flex items-center justify-between text-xl font-bold text-gray-800 border-b">
                        <span>Menu</span>
                        <button onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-gray-900">
                            <X size={30}/>
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    <nav className="flex-1 flex flex-col justify-center items-center space-y-6 text-lg">
                        <NavItem icon={<Home size={24}/>} label="Home" link="/" active={location.pathname === "/"}
                                 setIsOpen={setIsOpen} isMobile/>
                        <NavItem icon={<Book size={24}/>} label="Documentations" link="/documentations"
                                 active={location.pathname === "/documentations"} setIsOpen={setIsOpen} isMobile/>
                        <Link to="/planning" onClick={() => setIsOpen(false)} className="block w-full px-8">
                            <button
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-md flex items-center justify-center gap-2">
                                <ClipboardList size={24}/>
                                Start Planning
                            </button>
                        </Link>
                    </nav>
                </div>
            )}

            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

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
