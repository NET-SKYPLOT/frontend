import React, {useState} from "react";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    TimeScale,
    Title,
    Tooltip,
    Legend,
    CategoryScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import {Line} from "react-chartjs-2";

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Title, Tooltip, Legend, CategoryScale);

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

interface ElevationPlotProps {
    responseData: Satellite[];
}

const ElevationPlot: React.FC<ElevationPlotProps> = ({responseData}) => {
    if (!responseData || responseData.length === 0) {
        return <p className="text-red-500">No satellites found in elevation data.</p>;
    }

    // Extract all timestamps and sort
    const allTimestamps = Array.from(
        new Set(
            responseData.flatMap((sat) => sat.trajectory.map((t) => t.time))
        )
    ).sort();

    const [selectedTimeIndex, setSelectedTimeIndex] = useState(0);
    const selectedTime = allTimestamps[selectedTimeIndex];

    // Color map
    const colorMap: Record<string, string> = {
        GPS: "blue",
        GLONASS: "red",
        GALILEO: "green",
        BEIDOU: "orange",
    };

    // Prepare chart data (elevation over time per satellite)
    const datasets = responseData.map((satellite) => {
        const data = satellite.trajectory.map((t) => ({
            x: t.time,
            y: t.elevation,
        }));

        const color = colorMap[satellite.constellation] || "gray";

        return {
            label: `${satellite.constellation} - ${satellite.satellite_id}`,
            data,
            fill: false,
            borderColor: color,
            backgroundColor: color,
            tension: 0.2,
            pointRadius: 3,
        };
    });

    const chartData = {
        datasets,
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top" as const,
            },
            tooltip: {
                mode: "index" as const,
                intersect: false,
            },
        },
        scales: {
            x: {
                type: "time" as const,
                title: {
                    display: true,
                    text: "Time",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Elevation (°)",
                },
                min: -90,
                max: 90,
            },
        },
    };

    return (
        <div className="p-6 bg-white shadow-md rounded-md mt-6">
            <h3 className="text-xl font-semibold mb-4">Elevation Plot</h3>

            {/* Elevation Line Chart */}
            <div className="h-[800px] w-full">
                <Line data={chartData} options={chartOptions}/>
            </div>

            {/* Time Slider */}
            <div className="mt-6 flex flex-col items-center">
                <label className="font-semibold mb-2">
                    Selected Time: {new Date(selectedTime).toLocaleTimeString()}
                </label>
                <input
                    type="range"
                    min={0}
                    max={allTimestamps.length - 1}
                    value={selectedTimeIndex}
                    onChange={(e) => setSelectedTimeIndex(Number(e.target.value))}
                    className="w-full cursor-pointer"
                />
                <div className="flex justify-between w-full text-sm text-gray-500 mt-2">
                    <span>{new Date(allTimestamps[0]).toLocaleTimeString()}</span>
                    <span>{new Date(allTimestamps[allTimestamps.length - 1]).toLocaleTimeString()}</span>
                </div>
            </div>
        </div>
    );
};

export default ElevationPlot;
