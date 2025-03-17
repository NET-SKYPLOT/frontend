import {Home, Layers, Users, Code} from "lucide-react";

interface NavbarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const tabs = [
    {name: "Introduction", icon: <Home size={20}/>},
    {name: "Features", icon: <Layers size={20}/>},
    {name: "Our Team", icon: <Users size={20}/>},
    {name: "Open-Source", icon: <Code size={20}/>},
];

const Navbar = ({activeTab, setActiveTab}: NavbarProps) => {
    return (
        <div className="mt-4 border-b bg-white text-gray-800 overflow-x-auto">
            <div className="flex space-x-4 sm:space-x-6 px-4 sm:px-8 whitespace-nowrap">
                {tabs.map((tab) => (
                    <button
                        key={tab.name}
                        onClick={() => setActiveTab(tab.name)}
                        className={`flex items-center gap-2 pb-3 px-4 text-lg transition rounded-md ${
                            activeTab === tab.name
                                ? "border-b-2 border-blue-500 font-semibold text-blue-600 bg-gray-100"
                                : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                        }`}
                    >
                        {tab.icon}
                        {tab.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Navbar;
