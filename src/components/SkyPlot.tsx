import React, {useState} from "react";
import {Scatter} from "react-chartjs-2";
import {Chart, registerables} from "chart.js";

Chart.register(...registerables);

// Define the expected structure of Skyplot data
interface SatelliteTrajectory {
    azimuth: number;
    elevation: number;
    visible: boolean;
    time: string; // Add timestamp to trajectory
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

    // Extract unique timestamps
    const timestamps = Array.from(
        new Set(
            skyplotData.flatMap((satellite) =>
                satellite.trajectory.map((point) => point.time)
            )
        )
    ).sort();

    // Time selection state
    const [selectedTimeIndex, setSelectedTimeIndex] = useState(0);
    const selectedTime = timestamps[selectedTimeIndex];

    // Color mapping for satellite constellations
    const colorMap: Record<string, string> = {
        GPS: "blue",
        GLONASS: "red",
        Galileo: "green",
        BeiDou: "orange",
    };

    // Filter data for selected time
    const filteredSatellites = skyplotData.map((satellite) => {
        const trajectoryPoint = satellite.trajectory.find(
            (point) => point.time === selectedTime
        );
        return trajectoryPoint
            ? {
                satellite,
                point: trajectoryPoint,
            }
            : null;
    }).filter(Boolean) as { satellite: Satellite; point: SatelliteTrajectory }[];

    // Prepare data for Chart.js
    const chartData = {
        datasets: filteredSatellites.map(({satellite, point}) => ({
            label: `${satellite.constellation} - ${satellite.satellite_id}`,
            data: [
                {
                    x: point.azimuth, // Azimuth (angle in degrees)
                    y: 90 - Math.max(point.elevation, 0), // Convert elevation: higher values closer to center
                },
            ],
            backgroundColor: point.visible
                ? colorMap[satellite.constellation] || "gray"
                : "gray",
            borderColor: "black",
            pointRadius: 5,
            pointHoverRadius: 7,
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
                min: 0,
                max: 90, // 0 (center) is zenith, 90 is horizon
                reverse: true, // Ensure the lowest values are at the center
                title: {display: true, text: "Elevation (°)"},
                grid: {color: "rgba(200, 200, 200, 0.3)"},
            },
            theta: {
                min: 0,
                max: 360,
                title: {display: true, text: "Azimuth (°)"},
                grid: {color: "rgba(200, 200, 200, 0.3)"},
                ticks: {stepSize: 30}, // Ensure azimuth labels are readable
            },
        },
    };

    return (
        <div className="p-6 bg-white shadow-md rounded-md mt-6">
            <h3 className="text-xl font-semibold mb-4">SkyPlot</h3>

            {/* Skyplot Chart */}
            <div className="h-[600px] w-[600px] mx-auto">
                <Scatter data={chartData} options={options}/>
            </div>

            {/* Time Slider */}
            <div className="mt-4 flex flex-col items-center">
                <label className="font-semibold mb-2">
                    Time: {new Date(selectedTime).toLocaleTimeString()}
                </label>
                <input
                    type="range"
                    min="0"
                    max={timestamps.length - 1}
                    value={selectedTimeIndex}
                    onChange={(e) => setSelectedTimeIndex(Number(e.target.value))}
                    className="w-full cursor-pointer"
                />
                <div className="flex justify-between w-full text-sm text-gray-500 mt-2">
                    <span>{new Date(timestamps[0]).toLocaleTimeString()}</span>
                    <span>{new Date(timestamps[timestamps.length - 1]).toLocaleTimeString()}</span>
                </div>
            </div>
        </div>
    );
};

export default SkyPlot;
