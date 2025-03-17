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
    const secondReceiver = receivers.length > 1 ? receivers[1] : null;
    const thirdReceiver = receivers.length > 2 ? receivers[2] : null;

    const firstReceiverDopData = firstReceiver?.dop;
    const firstReceiverVisibilityData = firstReceiver?.visibility;
    const firstReceiverSkyplotData = firstReceiver?.skyplot_data?.satellites || [];

    const secondReceiverDopData = secondReceiver?.common_dop;
    const secondReceiverSkyplotData = secondReceiver?.skyplot_data?.satellites || [];

    const thirdReceiverDopData = thirdReceiver?.common_dop;
    const thirdReceiverSkyplotData = thirdReceiver?.skyplot_data?.satellites || [];

    console.log(firstReceiverDopData);

    return (
        <div className="flex h-screen w-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar/>

            <main className="flex-1 ml-64 p-6 bg-white shadow-md overflow-y-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Planning Request Results
                </h1>

                {responseData ? (
                    <>
                        {/* First Receiver Plots */}
                        {firstReceiver && (
                            <div className="mb-12">
                                <h2 className="text-2xl font-semibold text-blue-700 mb-4">
                                    Receiver 1 - Role: {firstReceiver.role.toUpperCase()}
                                </h2>
                                {firstReceiverDopData ? (
                                    <div className="mb-6">
                                        <DOPPlot data={firstReceiverDopData}/>
                                    </div>
                                ) : (
                                    <p className="text-red-500">No DOP data available.</p>
                                )}

                                {firstReceiverVisibilityData ? (
                                    <div className="mb-6">
                                        <SatelliteVisibility data={firstReceiverVisibilityData}/>
                                    </div>
                                ) : (
                                    <p className="text-red-500">No satellite visibility data available.</p>
                                )}

                                {firstReceiverSkyplotData.length > 0 ? (
                                    <div className="mb-6">
                                        <SkyPlot responseData={firstReceiverSkyplotData}/>
                                    </div>
                                ) : (
                                    <p className="text-red-500">No Skyplot data available.</p>
                                )}
                            </div>
                        )}

                        {/* Second Receiver Plots */}
                        {secondReceiver && (
                            <div className="mb-12">
                                <h2 className="text-2xl font-semibold text-green-700 mb-4">
                                    Receiver 2 - Role: {secondReceiver.role.toUpperCase()}
                                </h2>
                                {secondReceiverDopData ? (
                                    <div className="mb-6">
                                        <DOPPlot data={secondReceiverDopData}/>
                                    </div>
                                ) : (
                                    <p className="text-red-500">No Common DOP data available.</p>
                                )}

                                {secondReceiverSkyplotData.length > 0 ? (
                                    <div className="mb-6">
                                        <SkyPlot responseData={secondReceiverSkyplotData}/>
                                    </div>
                                ) : (
                                    <p className="text-red-500">No Skyplot data available.</p>
                                )}
                            </div>
                        )}

                        {/* Third Receiver Plots */}
                        {thirdReceiver && (
                            <div className="mb-12">
                                <h2 className="text-2xl font-semibold text-purple-700 mb-4">
                                    Receiver 3 - Role: {thirdReceiver.role.toUpperCase()}
                                </h2>
                                {thirdReceiverDopData ? (
                                    <div className="mb-6">
                                        <DOPPlot data={thirdReceiverDopData}/>
                                    </div>
                                ) : (
                                    <p className="text-red-500">No Common DOP data available.</p>
                                )}

                                {thirdReceiverSkyplotData.length > 0 ? (
                                    <div className="mb-6">
                                        <SkyPlot responseData={thirdReceiverSkyplotData}/>
                                    </div>
                                ) : (
                                    <p className="text-red-500">No Skyplot data available.</p>
                                )}
                            </div>
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
