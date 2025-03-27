import {useState, useEffect} from "react";
import Sidebar from "../components/Sidebar";
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
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1024);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="flex h-screen w-screen bg-gray-50">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab}/>

            <main className={`flex-1 p-6 bg-white shadow-md overflow-y-auto ${!isMobile ? "ml-64" : ""}`}>
                <div className="flex-1 overflow-y-auto p-6">
                    <ImageCarousel/>
                    <div className="mt-8">{tabComponents[activeTab]}</div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
