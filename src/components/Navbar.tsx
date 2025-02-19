interface NavbarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const Navbar = ({activeTab, setActiveTab}: NavbarProps) => {
    const tabs = ["Introduction", "Features", "Our Team", "Open-Source"];

    return (
        <div className="mt-4 flex space-x-6 border-b">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 text-lg transition ${
                        activeTab === tab ? "border-b-2 border-blue-500 font-semibold text-blue-600" : "text-gray-500"
                    }`}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};

export default Navbar;
