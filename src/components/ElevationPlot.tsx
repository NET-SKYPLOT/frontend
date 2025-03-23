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

    // Color map
    const colorMap: Record<string, string> = {
        GPS: "blue",
        GLONASS: "red",
        GALILEO: "green",
        BEIDOU: "orange",
    };

    // Initial constellation filter state
    const uniqueConstellations = Array.from(new Set(responseData.map(sat => sat.constellation)));
    const [visibleConstellations, setVisibleConstellations] = useState<Record<string, boolean>>(
        uniqueConstellations.reduce((acc, type) => {
            acc[type] = true;
            return acc;
        }, {} as Record<string, boolean>)
    );

    const handleToggle = (constellation: string) => {
        setVisibleConstellations(prev => ({
            ...prev,
            [constellation]: !prev[constellation]
        }));
    };

    // Prepare filtered datasets
    const datasets = responseData
        .filter(sat => visibleConstellations[sat.constellation])
        .map((satellite) => {
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
                min: 0,
                max: 90,
            },
        },
    };

    return (
        <div className="p-6 bg-white shadow-md rounded-md mt-6">
            <h3 className="text-xl font-semibold mb-4">Elevation Plot</h3>

            {/* Constellation Type Filters */}
            <div className="mb-4 flex flex-wrap gap-4">
                {uniqueConstellations.map((type) => (
                    <label key={type} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={visibleConstellations[type]}
                            onChange={() => handleToggle(type)}
                            className="cursor-pointer"
                        />
                        <span className="text-sm font-medium text-gray-700">{type}</span>
                    </label>
                ))}
            </div>

            {/* Chart */}
            <div className="h-[800px] w-full">
                <Line data={chartData} options={chartOptions}/>
            </div>
        </div>
    );
};

export default ElevationPlot;
