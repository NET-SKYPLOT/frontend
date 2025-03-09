import React from "react";
import {Bar} from "react-chartjs-2";
import {Chart, registerables} from "chart.js";

Chart.register(...registerables);

interface VisibilityEntry {
    time: string;
    count: number;
}

interface VisibilityData {
    [constellation: string]: VisibilityEntry[];
}

interface SatelliteVisibilityProps {
    data: VisibilityData;
}

const SatelliteVisibility: React.FC<SatelliteVisibilityProps> = ({data}) => {
    if (!data || Object.keys(data).length === 0) {
        return <p className="text-red-500">No satellite visibility data available.</p>;
    }

    // Extract time labels (assume first constellation defines the timestamps)
    const firstConstellation = Object.keys(data)[0];
    const timeLabels = data[firstConstellation]?.map((entry) => entry.time) || [];

    // Map colors for different constellations
    const colorMap: Record<string, string> = {
        GPS: "rgba(0, 0, 255, 0.8)",      // Blue
        GLONASS: "rgba(255, 0, 0, 0.8)",  // Red
        Galileo: "rgba(0, 255, 0, 0.8)",  // Green
        BeiDou: "rgba(255, 165, 0, 0.8)", // Orange
    };

    // Format data for Chart.js
    const chartData = {
        labels: timeLabels.map((t) => new Date(t).toLocaleTimeString()), // Convert to readable time
        datasets: Object.keys(data).map((constellation) => ({
            label: constellation,
            data: data[constellation].map((entry) => entry.count),
            backgroundColor: colorMap[constellation] || "gray",
            borderColor: colorMap[constellation] || "gray",
            borderWidth: 1,
        })),
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
                    font: {size: 12},
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
                title: {display: true, text: "Satellite Count"},
                min: 0,
                grid: {color: "rgba(200, 200, 200, 0.3)"},
            },
        },
    };

    return (
        <div className="p-4 bg-white shadow-md rounded-md mt-6">
            <h3 className="text-xl font-semibold mb-4">Satellite Visibility</h3>
            <div className="h-[400px]">
                <Bar data={chartData} options={options}/>
            </div>
        </div>
    );
};

export default SatelliteVisibility;
