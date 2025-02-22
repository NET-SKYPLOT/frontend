import {useState} from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ImageCarousel from "../components/ImageCarousel";

import Introduction from "../components/dashboard-components/Introduction";
import Features from "../components/dashboard-components/Features";
import OurTeam from "../components/dashboard-components/OurTeam";
import OpenSource from "../components/dashboard-components/OpenSource";

const tabComponents: { [key: string]: JSX.Element } = {
    Introduction: <Introduction/>,
    Features: <Features/>,
    "Our Team": <OurTeam/>,
    "Open-Source": <OpenSource/>,
};

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("Introduction");

    return (
        <div className="flex h-screen w-screen bg-gray-50">
            {/* Sidebar (Fixed) */}
            <Sidebar/>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-6 bg-white shadow-md overflow-y-auto">
                {/* Navbar (Fixed at the Top) */}
                <div className="p-6 bg-white shadow-md sticky top-0 z-10">
                    <Navbar activeTab={activeTab} setActiveTab={setActiveTab}/>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <ImageCarousel/>
                    <div className="mt-8">{tabComponents[activeTab]}</div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
