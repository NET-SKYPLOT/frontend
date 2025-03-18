import React, {useEffect, useRef, useState} from "react";
import {useLocation} from "react-router-dom";
import {useReactToPrint} from "react-to-print";
import Sidebar from "../components/Sidebar";
import DOPPlot from "../components/DOPPlot";
import SatelliteVisibility from "../components/SatelliteVisibility";
import SkyPlot from "../components/SkyPlot";

const ResultPage: React.FC = () => {
    const location = useLocation();
    const requestData = location.state?.requestData;
    const responseData = location.state?.responseData;
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

    const receivers = responseData?.receivers || [];
    const firstReceiver = receivers.length > 0 ? receivers[0] : null;
    const secondReceiver = receivers.length > 1 ? receivers[1] : null;
    const thirdReceiver = receivers.length > 2 ? receivers[2] : null;

    // Ref for printing
    const resultRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: resultRef,
        documentTitle: "Planning Results",
    });

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1024);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="flex h-screen w-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar/>

            <main className={`flex-1 p-6 bg-white shadow-md overflow-y-auto ${!isMobile ? "ml-64" : ""}`}>
                {/* Print Button */}
                <div className="flex justify-end mb-4">
                    <button
                        onClick={() => handlePrint()}  // ✅ Correctly calling the print function
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Export as PDF
                    </button>
                </div>

                {/* Printable Content */}
                <div ref={resultRef}>
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">
                        Planning Request Results
                    </h1>

                    {/* Planning Configuration Summary */}
                    {requestData && (
                        <div className="p-6 border rounded-md bg-gray-50 mb-8">
                            <h2 className="text-2xl font-semibold text-blue-700 mb-4">
                                Planning Configuration
                            </h2>
                            <p><strong>Date:</strong> {new Date(requestData.start_datetime).toLocaleDateString()}</p>
                            <p><strong>Duration:</strong> {requestData.duration_hours * 60} minutes</p>
                            <p><strong>Application
                                Type:</strong> {requestData.application === "differential_gnss" ? "Multiple Receivers" : "Single Receiver"}
                            </p>
                            <p><strong>Selected
                                DEM:</strong> {location.state?.formData?.selectedDEM === "no_dem" ? "No DEM selected" : `${requestData.dem.type} (Source: ${requestData.dem.source})`}
                            </p>
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

                            {/* Receivers Information */}
                            <h3 className="text-xl font-semibold mt-6">Receivers Information</h3>
                            {requestData.receivers.map((receiver: any, rIndex: number) => (
                                <div key={receiver.id} className="p-4 border-b last:border-none">
                                    <h4 className="text-lg font-semibold mb-2">Receiver {rIndex + 1}</h4>
                                    <p><strong>ID:</strong> {receiver.id}</p>
                                    <p><strong>Role:</strong> {receiver.role.toUpperCase()}</p>
                                    <p><strong>Location:</strong> Lat {receiver.coordinates.latitude},
                                        Lon {receiver.coordinates.longitude}</p>
                                    <p><strong>Height from Ground:</strong> {receiver.coordinates.height} meters</p>
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
                    )}

                    {responseData ? (
                        <>
                            {/* First Receiver Plots */}
                            {firstReceiver && (
                                <div className="mb-12">
                                    <h2 className="text-2xl font-semibold text-blue-700 mb-4">
                                        Receiver 1 - ID: {firstReceiver.id} - Role: {firstReceiver.role.toUpperCase()}
                                    </h2>
                                    <DOPPlot data={firstReceiver.dop}/>
                                    <SatelliteVisibility data={firstReceiver.visibility}/>
                                    <SkyPlot responseData={firstReceiver.skyplot_data?.satellites || []}/>
                                </div>
                            )}

                            {/* Second Receiver Plots */}
                            {secondReceiver && (
                                <div className="mb-12">
                                    <h2 className="text-2xl font-semibold text-green-700 mb-4">
                                        Receiver 2 - ID: {secondReceiver.id} - Role: {secondReceiver.role.toUpperCase()}
                                    </h2>
                                    <DOPPlot data={secondReceiver.common_dop}/>
                                    <SatelliteVisibility data={secondReceiver.common_visibility}/>
                                    <SkyPlot responseData={secondReceiver.skyplot_data?.satellites || []}/>
                                </div>
                            )}

                            {/* Third Receiver Plots */}
                            {thirdReceiver && (
                                <div className="mb-12">
                                    <h2 className="text-2xl font-semibold text-purple-700 mb-4">
                                        Receiver 3 - ID: {thirdReceiver.id} - Role: {thirdReceiver.role.toUpperCase()}
                                    </h2>
                                    <DOPPlot data={thirdReceiver.common_dop}/>
                                    <SatelliteVisibility data={thirdReceiver.common_visibility}/>
                                    <SkyPlot responseData={thirdReceiver.skyplot_data?.satellites || []}/>
                                </div>
                            )}
                        </>
                    ) : (
                        <p className="text-red-500">No response received.</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ResultPage;
