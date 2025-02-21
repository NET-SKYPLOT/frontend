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
            <Sidebar/>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Page Header & Navbar */}
                <div className="p-6 bg-white shadow-md">
                    <Navbar activeTab={activeTab} setActiveTab={setActiveTab}/>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <ImageCarousel/>
                    <div className="mt-8">{tabComponents[activeTab]}</div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
