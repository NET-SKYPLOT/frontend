import React from "react";
import {Line} from "react-chartjs-2";
import {Chart, registerables} from "chart.js";

Chart.register(...registerables);

interface DOPPlotProps {
    responseData: any;
}

const DOPPlot: React.FC<DOPPlotProps> = ({responseData}) => {
    if (!responseData || !responseData.receivers || responseData.receivers.length === 0) {
        return <p className="text-red-500">No DOP data available.</p>;
    }

    const dopData = responseData.receivers[0]?.dop;
    if (!dopData) {
        return <p className="text-red-500">No DOP values found.</p>;
    }

    // Extract the time and DOP values
    const chartData = {
        labels: dopData.time.map((t: string) => new Date(t).toLocaleTimeString()), // Convert to readable format
        datasets: [
            {
                label: "GDOP",
                data: dopData.gdop,
                borderColor: "rgba(255, 0, 0, 0.8)",
                backgroundColor: "rgba(255, 0, 0, 0.2)",
                borderWidth: 2,
                pointRadius: 3,
                fill: false,
            },
            {
                label: "PDOP",
                data: dopData.pdop,
                borderColor: "rgba(0, 0, 255, 0.8)",
                backgroundColor: "rgba(0, 0, 255, 0.2)",
                borderWidth: 2,
                pointRadius: 3,
                fill: false,
            },
            {
                label: "HDOP",
                data: dopData.hdop,
                borderColor: "rgba(0, 128, 0, 0.8)",
                backgroundColor: "rgba(0, 128, 0, 0.2)",
                borderWidth: 2,
                pointRadius: 3,
                fill: false,
            },
            {
                label: "VDOP",
                data: dopData.vdop,
                borderColor: "rgba(128, 0, 128, 0.8)",
                backgroundColor: "rgba(128, 0, 128, 0.2)",
                borderWidth: 2,
                pointRadius: 3,
                fill: false,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top" as const,
                labels: {
                    boxWidth: 15,
                    padding: 10,
                    font: {
                        size: 12,
                    },
                },
            },
            tooltip: {
                mode: "index" as const,
                intersect: false,
            },
        },
        scales: {
            x: {
                title: {display: true, text: "Time (HH:MM:SS)"},
                ticks: {autoSkip: true, maxRotation: 45, minRotation: 0},
            },
            y: {
                title: {display: true, text: "DOP Value"},
                min: 0,
                grid: {color: "rgba(200, 200, 200, 0.3)"},
            },
        },
    };

    return (
        <div className="p-4 bg-white shadow-md rounded-md mt-6">
            <h3 className="text-xl font-semibold mb-4">Dilution of Precision (DOP)</h3>
            <div className="h-[400px]">
                <Line data={chartData} options={options}/>
            </div>
        </div>
    );
};

export default DOPPlot;
