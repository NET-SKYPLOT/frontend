import React from "react";
import {Line} from "react-chartjs-2";
import {Chart, registerables} from "chart.js";

Chart.register(...registerables);

interface DOPData {
    time: string[];
    gdop: number[];
    pdop: number[];
    hdop: number[];
    vdop: number[];
}

interface DOPPlotProps {
    data: DOPData;
}

const DOPPlot: React.FC<DOPPlotProps> = ({data}) => {
    const chartData = {
        labels: data.time.map((t) => new Date(t).toLocaleTimeString()), // Format time for better readability
        datasets: [
            {
                label: "GDOP",
                data: data.gdop,
                borderColor: "rgba(255, 0, 0, 0.8)",
                backgroundColor: "rgba(255, 0, 0, 0.2)",
                borderWidth: 2,
                pointRadius: 3,
                fill: false,
            },
            {
                label: "PDOP",
                data: data.pdop,
                borderColor: "rgba(0, 0, 255, 0.8)",
                backgroundColor: "rgba(0, 0, 255, 0.2)",
                borderWidth: 2,
                pointRadius: 3,
                fill: false,
            },
            {
                label: "HDOP",
                data: data.hdop,
                borderColor: "rgba(0, 128, 0, 0.8)",
                backgroundColor: "rgba(0, 128, 0, 0.2)",
                borderWidth: 2,
                pointRadius: 3,
                fill: false,
            },
            {
                label: "VDOP",
                data: data.vdop,
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
                position: "chartArea" as const,
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
                type: "category" as const, // ✅ FIX: Ensure it's a valid type
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
        <div className="p-4 bg-white shadow-md rounded-md">
            <h3 className="text-xl font-semibold mb-4">Dilution of Precision (DOP)</h3>
            <div className="h-[400px]">
                <Line data={chartData} options={options}/>
            </div>
        </div>
    );
};

export default DOPPlot;
