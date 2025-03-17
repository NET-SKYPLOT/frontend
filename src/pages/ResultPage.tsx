import React from "react";
import {useLocation} from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DOPPlot from "../components/DOPPlot";
import SatelliteVisibility from "../components/SatelliteVisibility";
import SkyPlot from "../components/SkyPlot";

const ResultPage: React.FC = () => {
    const location = useLocation();
    const requestData = location.state?.requestData;
    const responseData = location.state?.responseData;

    const receivers = responseData?.receivers || [];
    const firstReceiver = receivers.length > 0 ? receivers[0] : null;
    const dopData = firstReceiver?.dop;
    const visibilityData = firstReceiver?.visibility;
    const skyplotData = firstReceiver?.skyplot_data;

    return (
        <div className="flex h-screen w-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar/>

            <main className="flex-1 ml-64 p-6 bg-white shadow-md overflow-y-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Planning Request Results
                </h1>

                {/* Check if responseData exists and contains necessary data */}
                {responseData ? (
                    <>
                        {/* DOP Plot */}
                        {dopData ? (
                            <div className="mb-6">
                                <DOPPlot data={dopData}/>
                            </div>
                        ) : (
                            <p className="text-red-500">No DOP data available.</p>
                        )}

                        {/* Satellite Visibility */}
                        {visibilityData ? (
                            <div className="mb-6">
                                <SatelliteVisibility data={visibilityData}/>
                            </div>
                        ) : (
                            <p className="text-red-500">No satellite visibility data available.</p>
                        )}

                        {/* SkyPlot */}
                        {skyplotData ? (
                            <div className="mb-6">
                                <SkyPlot responseData={responseData}/>
                            </div>
                        ) : (
                            <p className="text-red-500">No Skyplot data available.</p>
                        )}

                        {/* Display Request Data */}
                        <div className="p-4 border rounded-md bg-gray-50 mb-6">
                            <h2 className="text-xl font-semibold">Request Data</h2>
                            <pre className="p-3 bg-gray-100 rounded-md overflow-x-auto">
                                {JSON.stringify(requestData, null, 2)}
                            </pre>
                        </div>

                        {/* Display API Response */}
                        <div className="p-4 border rounded-md bg-gray-50">
                            <h2 className="text-xl font-semibold">API Response</h2>
                            <pre className="p-3 bg-gray-100 rounded-md overflow-x-auto">
                                {JSON.stringify(responseData, null, 2)}
                            </pre>
                        </div>
                    </>
                ) : (
                    <p className="text-red-500">No response received.</p>
                )}
            </main>
        </div>
    );
};

export default ResultPage;
