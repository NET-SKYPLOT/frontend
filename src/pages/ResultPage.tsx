import React from "react";
import {useLocation} from "react-router-dom";
import Sidebar from "../components/Sidebar";

const ResultPage: React.FC = () => {
    const location = useLocation();
    const requestData = location.state?.requestData;
    const responseData = location.state?.responseData;

    return (
        <div className="flex h-screen w-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar/>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-6 bg-white shadow-md overflow-y-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Planning Request Results</h1>

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
                    {responseData ? (
                        <pre className="p-3 bg-gray-100 rounded-md overflow-x-auto">
                            {JSON.stringify(responseData, null, 2)}
                        </pre>
                    ) : (
                        <p className="text-red-500">No response received.</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ResultPage;
