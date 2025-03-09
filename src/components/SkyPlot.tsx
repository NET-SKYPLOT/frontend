import React from "react";
import {Chart, registerables} from "chart.js";
import {PolarArea} from "react-chartjs-2";

Chart.register(...registerables);

// Define the expected structure of Skyplot data
interface SatelliteTrajectory {
    azimuth: number;
    elevation: number;
    visible: boolean;
}

interface Satellite {
    constellation: string;
    satellite_id: string;
    trajectory: SatelliteTrajectory[];
}

interface Receiver {
    skyplot_data?: {
        satellites: Satellite[];
    };
}

interface ResponseData {
    receivers?: Receiver[];
}

interface SkyPlotProps {
    responseData: ResponseData;
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
        GPS: "rgba(0, 0, 255, 0.8)",      // Blue
        GLONASS: "rgba(255, 0, 0, 0.8)",  // Red
        Galileo: "rgba(0, 255, 0, 0.8)",  // Green
        BeiDou: "rgba(255, 165, 0, 0.8)", // Orange
    };

    // Convert azimuth and elevation data for the polar chart
    const labels: string[] = [];
    const datasetData: number[] = [];
    const backgroundColors: string[] = [];

    skyplotData.forEach((satellite) => {
        satellite.trajectory.forEach((point) => {
            if (point.elevation >= 0) {  // Ensure valid elevation
                labels.push(`${satellite.satellite_id} (${satellite.constellation})`);
                datasetData.push(point.elevation); // Elevation as radial distance
                backgroundColors.push(
                    point.visible ? colorMap[satellite.constellation] || "gray" : "gray"
                );
            }
        });
    });

    const chartData = {
        labels,
        datasets: [
            {
                label: "Satellite Elevation",
                data: datasetData,
                backgroundColor: backgroundColors,
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
                    font: {size: 12},
                },
            },
            tooltip: {
                mode: "index" as const,
                intersect: false,
            },
        },
    };

    return (
        <div className="p-4 bg-white shadow-md rounded-md mt-6">
            <h3 className="text-xl font-semibold mb-4">SkyPlot</h3>
            <div className="h-[400px]">
                <PolarArea data={chartData} options={options}/>
            </div>
        </div>
    );
};

export default SkyPlot;
