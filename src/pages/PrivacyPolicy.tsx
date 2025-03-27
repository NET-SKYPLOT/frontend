import {useEffect, useState} from "react";
import Sidebar from "../components/Sidebar";

const PrivacyPolicy = () => {
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
            <Sidebar activeTab="Privacy Policy" setActiveTab={() => {
            }}/>

            <main className={`flex-1 p-6 bg-white shadow-md overflow-y-auto ${!isMobile ? "ml-64" : ""}`}>
                <div className="flex-1 overflow-y-auto p-6 max-w-3xl mx-auto text-gray-800">
                    <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
                    <p className="mb-4">
                        This website does not collect, store, or share any personal data. All planning results are
                        stored
                        temporarily (15 minutes) in your browser’s storage to enhance your experience. No data is sent
                        to our
                        servers or third parties.
                    </p>
                    <p>
                        Your privacy is important to us. If you have any questions, feel free to reach out.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default PrivacyPolicy;
