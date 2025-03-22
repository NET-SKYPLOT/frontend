import React, {useState} from "react";
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    Legend,
    Tooltip,
} from "chart.js";
import {Scatter} from "react-chartjs-2";

ChartJS.register(RadialLinearScale, PointElement, Legend, Tooltip);

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
    responseData: Satellite[];
}

const SkyPlot: React.FC<SkyPlotProps> = ({responseData}) => {
    if (!responseData || responseData.length === 0) {
        return <p className="text-red-500">No satellites found in Skyplot data.</p>;
    }

    // Extract unique timestamps
    const timestamps = Array.from(
        new Set(
            responseData.flatMap((satellite) =>
                satellite.trajectory.map((point) => point.time)
            )
        )
    ).sort();

    // Selected time state
    const [selectedTimeIndex, setSelectedTimeIndex] = useState(0);
    const selectedTime = timestamps[selectedTimeIndex];

    // Constellation color map
    const colorMap: Record<string, string> = {
        GPS: "blue",
        GLONASS: "red",
        GALILEO: "green",
        BEIDOU: "orange",
    };

    const uniqueConstellations = Array.from(
        new Set(responseData.map((sat) => sat.constellation))
    );

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

    // Filter satellites based on selected time and visible constellations
    const filteredPoints = responseData
        .filter((sat) => visibleConstellations[sat.constellation])
        .map((sat) => {
            const point = sat.trajectory.find(p => p.time === selectedTime);
            if (!point) return null;

            const radius = 90 - point.elevation;
            const angleRad = (point.azimuth * Math.PI) / 180;

            return {
                label: `${sat.constellation} - ${sat.satellite_id}`,
                data: [{
                    x: radius * Math.sin(angleRad),
                    y: radius * Math.cos(angleRad),
                }],
                backgroundColor: point.visible ? colorMap[sat.constellation] || "gray" : "gray",
                pointRadius: 5,
            };
        })
        .filter(Boolean) as any[];

    const chartData = {
        datasets: filteredPoints,
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: "linear" as const, // ✅ Fixed
                min: -90,
                max: 90,
                title: {
                    display: true,
                    text: "Azimuth (X)",
                },
                grid: {
                    color: "rgba(200,200,200,0.2)",
                },
            },
            y: {
                type: "linear" as const, // ✅ Fixed
                min: -90,
                max: 90,
                title: {
                    display: true,
                    text: "Elevation (Y)",
                },
                grid: {
                    color: "rgba(200,200,200,0.2)",
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        const label = context.dataset.label || "";
                        const x = context.raw.x;
                        const y = context.raw.y;
                        return `${label}: x=${x.toFixed(2)}, y=${y.toFixed(2)}`;
                    },
                },
            },
        },
    };

    return (
        <div className="p-6 bg-white shadow-md rounded-md mt-6">
            <h3 className="text-xl font-semibold mb-4">SkyPlot</h3>

            {/* Constellation Toggle Filters */}
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
            <div className="h-[600px] w-[600px] mx-auto">
                <Scatter data={chartData} options={chartOptions}/>
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
