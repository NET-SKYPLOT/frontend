import {useEffect, useState} from "react";
import Sidebar from "../components/Sidebar";
import PlanningWizard from "../components/PlanningWizard";

const Planning = () => {
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
            <Sidebar activeTab="Planning" setActiveTab={() => {
            }}/>

            <main className={`flex-1 p-6 bg-white shadow-md overflow-y-auto ${!isMobile ? "ml-64" : ""}`}>
                <div className="flex-1 overflow-y-auto p-6 max-w-6xl mx-auto text-gray-800">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Planning Wizard</h1>
                    <PlanningWizard/>
                </div>
            </main>
        </div>
    );
};

export default Planning;
