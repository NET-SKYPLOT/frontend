import React, {useEffect, useRef, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useReactToPrint} from "react-to-print";
import Sidebar from "../components/Sidebar";
import DOPPlot from "../components/DOPPlot";
import SatelliteVisibility from "../components/SatelliteVisibility";
import SkyPlot from "../components/SkyPlot";
import ElevationPlot from "../components/ElevationPlot";
import WorldView from "../components/WorldView";
import {FileDown, Trash2} from "lucide-react";


const ResultPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
    const resultRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState<any>(location.state?.formData || null);
    const [requestData, setRequestData] = useState<any>(location.state?.requestData || null);
    const [responseData, setResponseData] = useState<any>(location.state?.responseData || null);
    const [expired, setExpired] = useState(false);

    const handlePrint = useReactToPrint({
        contentRef: resultRef,
        documentTitle: "Planning Results",
    });

    const handleClearResults = () => {
        localStorage.removeItem("planning_result");
        setFormData(null);
        setRequestData(null);
        setResponseData(null);
        setExpired(true);
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1024);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (!requestData || !responseData || !formData) {
            const saved = localStorage.getItem("planning_result");
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    const now = Date.now();
                    if (now - parsed.timestamp < 15 * 60 * 1000) {
                        const restoredDate = new Date(parsed.formData.date);
                        const restoredTime = new Date(parsed.formData.time);

                        if (!isNaN(restoredDate.getTime()) && !isNaN(restoredTime.getTime())) {
                            parsed.formData.date = restoredDate;
                            parsed.formData.time = restoredTime;

                            setFormData(parsed.formData);
                            setRequestData(parsed.requestData);
                            setResponseData(parsed.responseData);
                            setExpired(false);
                        } else {
                            localStorage.removeItem("planning_result");
                            setExpired(true);
                        }
                    }
                } catch {
                    setExpired(true);
                }
            } else {
                setExpired(true);
            }
        }
    }, [requestData, responseData, formData]);

    const receivers = responseData?.receivers || [];
    const firstReceiver = receivers.length > 0 ? receivers[0] : null;
    const secondReceiver = receivers.length > 1 ? receivers[1] : null;
    const thirdReceiver = receivers.length > 2 ? receivers[2] : null;

    return (
        <div className="flex h-screen w-screen bg-gray-50">
            <Sidebar activeTab="Planning Results" setActiveTab={() => {
            }}/>

            <main className={`flex-1 p-6 bg-white shadow-md overflow-y-auto ${!isMobile ? "ml-64" : ""}`}>
                <div className="flex-1 overflow-y-auto p-6 max-w-6xl mx-auto text-gray-800">

                    {/* Conditional Export Button */}
                    {responseData && (
                        <div className="flex justify-between items-center mb-6">
                            <button
                                onClick={() => handlePrint()}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
                            >
                                <FileDown size={18}/>
                                Export as PDF
                            </button>
                            <button
                                onClick={handleClearResults}
                                className="ml-4 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded flex items-center gap-2"
                            >
                                <Trash2 size={18}/>
                                Clear Results
                            </button>
                        </div>
                    )}

                    {/* If expired or empty */}
                    {expired && (
                        <div className="text-center mt-24">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-700">No Active Planning Results</h2>
                            <p className="text-gray-600 mb-6">
                                You have no saved planning session, or it has expired. Please start a new planning.
                            </p>
                            <button
                                onClick={() => navigate("/planning")}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded"
                            >
                                Start Planning
                            </button>
                        </div>
                    )}

                    {/* Planning Results Section */}
                    {!expired && requestData && responseData && formData && (
                        <div ref={resultRef}>
                            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                                Planning Request Results
                            </h1>

                            {/* Configuration Summary */}
                            <div className="p-6 border rounded-md bg-gray-50 mb-10">
                                <h2 className="text-2xl font-semibold text-blue-700 mb-4">Planning Configuration</h2>
                                <p><strong>Date:</strong> {formData.date?.toLocaleDateString()}</p>
                                <p><strong>Time:</strong> {formData.time?.toLocaleTimeString()}</p>
                                <p><strong>Duration:</strong> {formData.duration} minutes</p>
                                <p><strong>Time Zone:</strong> {formData.timezone?.label}</p>
                                <p><strong>Application
                                    Type:</strong> {requestData.application === "differential_gnss" ? "Multiple Receivers" : "Single Receiver"}
                                </p>
                                <p><strong>Selected
                                    DEM:</strong> {formData?.selectedDEM === "no_dem" ? "No DEM selected" : `${requestData.dem.type} (Source: ${requestData.dem.source})`}
                                </p>
                                <p><strong>Cutoff Angle:</strong> {formData.cutoffAngle} degree</p>
                                <h3 className="text-xl font-semibold mt-4">Selected GNSS Constellations</h3>
                                {requestData.constellations.length > 0 ? (
                                    <ul className="list-disc ml-6">
                                        {requestData.constellations.map((constellation: string) => (
                                            <li key={constellation}>{constellation}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">No constellations selected.</p>
                                )}

                                {/* Receivers */}
                                <h3 className="text-xl font-semibold mt-6">Receivers Information</h3>
                                {requestData.receivers.map((receiver: any, rIndex: number) => (
                                    <div key={receiver.id} className="p-4 border-b last:border-none">
                                        <h4 className="text-lg font-semibold mb-2">Receiver {rIndex + 1}</h4>
                                        <p><strong>ID:</strong> {receiver.id}</p>
                                        <p><strong>Role:</strong> {receiver.role.toUpperCase()}</p>
                                        <p><strong>Location:</strong> Lat {receiver.coordinates.latitude},
                                            Lon {receiver.coordinates.longitude}</p>
                                        <p><strong>Height:</strong> {receiver.coordinates.height} meters</p>
                                        {receiver.obstacles.length > 0 && (
                                            <div className="mt-2">
                                                <h5 className="text-md font-semibold">Obstacles:</h5>
                                                {receiver.obstacles.map((obstacle: any, oIndex: number) => (
                                                    <div key={oIndex} className="pl-4 border-l-2 border-gray-400 mt-1">
                                                        <p>
                                                            <strong>Obstacle {oIndex + 1} Height:</strong> {obstacle.height} meters
                                                        </p>
                                                        <p><strong>Vertices:</strong></p>
                                                        <ul className="list-disc ml-6">
                                                            {obstacle.vertices.map((vertex: any, vIndex: number) => (
                                                                <li key={vIndex}>Lat {vertex.latitude},
                                                                    Lon {vertex.longitude}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Plots */}
                            {firstReceiver && (
                                <div className="mb-16">
                                    <h2 className="text-2xl font-semibold text-blue-700 mb-4">
                                        Receiver 1 - ID: {firstReceiver.id} - Role: {firstReceiver.role.toUpperCase()}
                                    </h2>
                                    <DOPPlot data={firstReceiver.dop}/>
                                    <SatelliteVisibility data={firstReceiver.visibility}/>
                                    <SkyPlot responseData={firstReceiver.skyplot_data?.satellites || []}/>
                                    <ElevationPlot responseData={firstReceiver.skyplot_data.satellites}/>
                                </div>
                            )}

                            {secondReceiver && (
                                <div className="mb-16">
                                    <h2 className="text-2xl font-semibold text-green-700 mb-4">
                                        Receiver 2 - ID: {secondReceiver.id} - Role: {secondReceiver.role.toUpperCase()}
                                    </h2>
                                    <DOPPlot data={secondReceiver.common_dop}/>
                                    <SatelliteVisibility data={secondReceiver.common_visibility}/>
                                    <SkyPlot responseData={secondReceiver.skyplot_data?.satellites || []}/>
                                    <ElevationPlot responseData={secondReceiver.skyplot_data.satellites}/>
                                </div>
                            )}

                            {thirdReceiver && (
                                <div className="mb-16">
                                    <h2 className="text-2xl font-semibold text-purple-700 mb-4">
                                        Receiver 3 - ID: {thirdReceiver.id} - Role: {thirdReceiver.role.toUpperCase()}
                                    </h2>
                                    <DOPPlot data={thirdReceiver.common_dop}/>
                                    <SatelliteVisibility data={thirdReceiver.common_visibility}/>
                                    <SkyPlot responseData={thirdReceiver.skyplot_data?.satellites || []}/>
                                    <ElevationPlot responseData={thirdReceiver.skyplot_data.satellites}/>
                                </div>
                            )}

                            {responseData?.world_view?.length > 0 && (
                                <div className="mb-16">
                                    <WorldView worldViewData={responseData.world_view}/>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ResultPage;
