import {useState, useEffect} from "react";
import Sidebar from "../components/Sidebar";

const Documentations = () => {
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowBackToTop(true);
            } else {
                setShowBackToTop(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1024);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="flex h-screen w-screen bg-gray-50">
            <Sidebar/>
            <main className={`flex-1 p-6 bg-white shadow-md overflow-y-auto ${!isMobile ? "ml-64" : ""}`}>
                <section className="mb-8">
                    <h2 className="text-3xl font-semibold mb-4">How to Use Net-SkyPlot: A Step-by-Step Guide</h2>
                    <p className="leading-relaxed">
                        Net-SkyPlot provides a structured workflow for GNSS planning, analysis, and visualization.
                        Follow the steps below to configure your receivers, select GNSS constellations, integrate
                        terrain and obstacles, and visualize the results.
                    </p>
                </section>

                <section className="mb-8">
                    <h3 className="text-2xl font-semibold">🔹 Step 1: Define Planning Details</h3>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Select the Date & Time:</strong> Choose the start date and time for the GNSS
                            simulation.
                        </li>
                        <li><strong>Set Duration:</strong> Specify the duration (in minutes) for the GNSS planning
                            session.
                        </li>
                        <li><strong>Choose Timezone:</strong> Select the appropriate timezone for your planning
                            location.
                        </li>
                    </ul>
                    <p className="mt-2 italic">📌 Tip: The default duration is 60 minutes and can be adjusted in
                        60-minute increments.</p>
                </section>

                <section className="mb-8">
                    <h3 className="text-2xl font-semibold">🔹 Step 2: Configure Receivers</h3>
                    <p>Define your receiver type, location, and height.</p>
                </section>

                <section className="mb-8">
                    <h3 className="text-2xl font-semibold">🔹 Step 3: Define Obstacles (Optional)</h3>
                    <p>Draw obstacles on the map to simulate GNSS signal obstructions.</p>
                </section>

                <section className="mb-8">
                    <h3 className="text-2xl font-semibold">🔹 Step 4: Select GNSS Constellations</h3>
                    <p>Choose the GNSS constellations you want to use:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>✅ GPS</li>
                        <li>✅ Galileo</li>
                        <li>✅ BeiDou</li>
                        <li>✅ GLONASS</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h3 className="text-2xl font-semibold">🔹 Step 5: Select Digital Elevation Model (DEM)</h3>
                    <p>Fetch available DEMs and select the most suitable one for terrain-aware GNSS planning.</p>
                </section>

                <section className="mb-8">
                    <h3 className="text-2xl font-semibold">🔹 Step 6: Review & Submit Planning Request</h3>
                    <p>Review all configurations and submit the request to the backend for processing.</p>
                </section>

                <section className="mb-8">
                    <h3 className="text-2xl font-semibold">🔹 Step 7: View Planning Results</h3>
                    <p>Analyze DOP plots, SkyPlot, and satellite visibility metrics.</p>
                </section>

                <section>
                    <h3 className="text-2xl font-semibold">🚀 Start Using Net-SkyPlot Today!</h3>
                    <p>With Net-SkyPlot, you can perform high-precision GNSS planning and optimize receiver placement
                        for various applications.</p>
                </section>

                {showBackToTop && (
                    <button
                        onClick={() => window.scrollTo({top: 0, behavior: "smooth"})}
                        className="fixed bottom-6 right-6 bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition"
                    >
                        ↑ Back to Top
                    </button>
                )}
            </main>
        </div>
    );
};

export default Documentations;
