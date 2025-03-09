import React from "react";
import {Scatter} from "react-chartjs-2";
import {Chart, registerables} from "chart.js";

Chart.register(...registerables);

interface SkyPlotProps {
    responseData: any;
}

const SkyPlot: React.FC<SkyPlotProps> = ({responseData}) => {
    if (!responseData || !responseData.receivers || responseData.receivers.length === 0) {
        return <p className="text-red-500">No Skyplot data available.</p>;
    }

    const skyplotData = responseData.receivers[0]?.skyplot_data?.satellites;
    if (!skyplotData || skyplotData.length === 0) {
        return <p className="text-red-500">No satellites found in Skyplot data.</p>;
    }

    // Color mapping for satellite constellations
    const colorMap: Record<string, string> = {
        GPS: "blue",
        GLONASS: "red",
        Galileo: "green",
        BeiDou: "orange",
    };

    // Convert azimuth and elevation data for the polar scatter plot
    const chartData = {
        datasets: skyplotData.map((satellite) => ({
            label: `${satellite.constellation} - ${satellite.satellite_id}`,
            data: satellite.trajectory.map((point) => ({
                x: point.azimuth,  // Azimuth (angle around the plot)
                y: Math.max(point.elevation, 0), // Elevation (radius) - Ensure it's non-negative
            })),
            backgroundColor: satellite.trajectory.map((point) =>
                point.visible ? colorMap[satellite.constellation] || "gray" : "gray"
            ),
            pointRadius: 5,
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
            r: {
                title: {display: true, text: "Elevation (°)"},
                min: 0,
                max: 90,
                grid: {color: "rgba(200, 200, 200, 0.3)"},
            },
            theta: {
                title: {display: true, text: "Azimuth (°)"},
                min: 0,
                max: 360,
                grid: {color: "rgba(200, 200, 200, 0.3)"},
            },
        },
    };

    return (
        <div className="p-4 bg-white shadow-md rounded-md mt-6">
            <h3 className="text-xl font-semibold mb-4">SkyPlot</h3>
            <div className="h-[400px]">
                <Scatter data={chartData} options={options}/>
            </div>
        </div>
    );
};

export default SkyPlot;
