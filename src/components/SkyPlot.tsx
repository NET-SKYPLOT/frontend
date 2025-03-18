import React, {useState} from "react";
import {PolarArea} from "react-chartjs-2";
import {Chart, RadialLinearScale, PointElement, Legend, Tooltip} from "chart.js";

Chart.register(RadialLinearScale, PointElement, Legend, Tooltip);

interface SatelliteTrajectory {
    azimuth: number;
    elevation: number;
    visible: boolean;
    time: string;
}

interface Satellite {
    constellation: string;
    satellite_id: string;
    trajectory: SatelliteTrajectory[];
}

interface SkyPlotProps {
    responseData: Satellite[]; // Directly receives `satellites` array from `ResultPage.tsx`
}

const SkyPlot: React.FC<SkyPlotProps> = ({responseData}) => {
    if (!responseData || responseData.length === 0) {
        return <p className="text-red-500">No satellites found in Skyplot data.</p>;
    }

    // Extract unique timestamps from all satellite trajectories
    const timestamps = Array.from(
        new Set(
            responseData.flatMap((satellite) =>
                satellite.trajectory.map((point) => point.time)
            )
        )
    ).sort();

    // State for selected time
    const [selectedTimeIndex, setSelectedTimeIndex] = useState(0);
    const selectedTime = timestamps[selectedTimeIndex];

    // Color mapping for different satellite constellations
    const colorMap: Record<string, string> = {
        GPS: "blue",
        GLONASS: "red",
        GALILEO: "green",
        BEIDOU: "orange",
    };

    // Filter satellites for selected time
    const filteredSatellites = responseData
        .map((satellite) => {
            const trajectoryPoint = satellite.trajectory.find(
                (point) => point.time === selectedTime
            );
            return trajectoryPoint
                ? {
                    satellite,
                    point: trajectoryPoint,
                }
                : null;
        })
        .filter(Boolean) as { satellite: Satellite; point: SatelliteTrajectory }[];

    // Prepare data for Chart.js (PolarArea)
    const chartData = {
        labels: filteredSatellites.map(
            ({satellite}) => `${satellite.constellation} - ${satellite.satellite_id}`
        ),
        datasets: [
            {
                label: "Satellite Positions",
                data: filteredSatellites.map(({point}) => 90 - point.elevation), // Elevation (closer to center = higher)
                backgroundColor: filteredSatellites.map(
                    ({satellite, point}) =>
                        point.visible ? colorMap[satellite.constellation] || "gray" : "gray"
                ),
                borderColor: "black",
                borderWidth: 1,
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
        scales: {
            r: {
                min: 0,
                max: 90,
                reverse: true, // Ensure that lower elevation is at the center
                title: {display: true, text: "Elevation (°)"},
                grid: {color: "rgba(200, 200, 200, 0.3)"},
            },
        },
    };

    return (
        <div className="p-6 bg-white shadow-md rounded-md mt-6">
            <h3 className="text-xl font-semibold mb-4">SkyPlot</h3>

            {/* Skyplot Chart */}
            <div className="h-[600px] w-[600px] mx-auto">
                <PolarArea data={chartData} options={options}/>
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
