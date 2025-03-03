import React from "react";
import {Bar} from "react-chartjs-2";
import {Chart, registerables} from "chart.js";

Chart.register(...registerables);

interface VisibilityData {
    time: string[];
    satelliteCounts: {
        constellation: string;
        counts: number[];
    }[];
}

interface SatelliteVisibilityProps {
    data: VisibilityData;
}

const SatelliteVisibility: React.FC<SatelliteVisibilityProps> = ({data}) => {
    const colorMap: Record<string, string> = {
        GPS: "rgba(0, 0, 255, 0.8)",      // Blue
        GLONASS: "rgba(255, 0, 0, 0.8)",  // Red
        Galileo: "rgba(0, 255, 0, 0.8)",  // Green
        BeiDou: "rgba(255, 165, 0, 0.8)", // Orange
    };

    const chartData = {
        labels: data.time.map((t) => new Date(t).toLocaleTimeString()),
        datasets: data.satelliteCounts.map((sat) => ({
            label: sat.constellation,
            data: sat.counts,
            backgroundColor: colorMap[sat.constellation] || "gray",
            borderColor: colorMap[sat.constellation] || "gray",
            borderWidth: 1,
        })),
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "chartArea" as const, // ✅ FIX: Valid predefined type
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
                type: "category" as const,
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
        <div className="p-4 bg-white shadow-md rounded-md">
            <h3 className="text-xl font-semibold mb-4">Satellite Visibility</h3>
            <div className="h-[400px]">
                <Bar data={chartData} options={options}/>
            </div>
        </div>
    );
};

export default SatelliteVisibility;
