import React, {useState} from "react";
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    Legend,
    Tooltip,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import {Scatter} from "react-chartjs-2";

ChartJS.register(LinearScale, PointElement, Legend, Tooltip, annotationPlugin);

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

    const timestamps = Array.from(
        new Set(
            responseData.flatMap((satellite) =>
                satellite.trajectory.map((point) => point.time)
            )
        )
    ).sort();

    const [selectedTimeIndex, setSelectedTimeIndex] = useState(0);
    const selectedTime = timestamps[selectedTimeIndex];

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
        setVisibleConstellations((prev) => ({
            ...prev,
            [constellation]: !prev[constellation],
        }));
    };

    // Filter satellites based on selected time and visible constellations
    const filteredPoints = responseData
        .filter((sat) => visibleConstellations[sat.constellation])
        .map((sat) => {
            const point = sat.trajectory.find((p) => p.time === selectedTime);
            if (!point) return null;

            const radius = 90 - point.elevation;
            const angleRad = (point.azimuth * Math.PI) / 180;

            return {
                label: `${sat.constellation} - ${sat.satellite_id}`,
                data: [
                    {
                        x: radius * Math.sin(angleRad),
                        y: radius * Math.cos(angleRad),
                    },
                ],
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
                type: "linear" as const,
                min: -90,
                max: 90,
                ticks: {
                    stepSize: 30,
                },
                grid: {
                    color: "rgba(200,200,200,0.2)",
                },
            },
            y: {
                type: "linear" as const,
                min: -90,
                max: 90,
                ticks: {
                    stepSize: 30,
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
            annotation: {
                annotations: {
                    // === Rings ===
                    ring1: {
                        type: "ellipse" as const,
                        xMin: -30,
                        xMax: 30,
                        yMin: -30,
                        yMax: 30,
                        borderColor: "rgba(150,150,150,0.3)",
                        borderWidth: 1,
                    },
                    ring2: {
                        type: "ellipse" as const,
                        xMin: -60,
                        xMax: 60,
                        yMin: -60,
                        yMax: 60,
                        borderColor: "rgba(150,150,150,0.3)",
                        borderWidth: 1,
                    },
                    ring3: {
                        type: "ellipse" as const,
                        xMin: -90,
                        xMax: 90,
                        yMin: -90,
                        yMax: 90,
                        borderColor: "rgba(150,150,150,0.4)",
                        borderWidth: 1,
                    },

                    // === Axis lines ===
                    axisX: {
                        type: "line" as const,
                        xMin: -90,
                        xMax: 90,
                        yMin: 0,
                        yMax: 0,
                        borderColor: "gray",
                        borderWidth: 0.8,
                    },
                    axisY: {
                        type: "line" as const,
                        xMin: 0,
                        xMax: 0,
                        yMin: -90,
                        yMax: 90,
                        borderColor: "gray",
                        borderWidth: 0.8,
                    },

                    // === Azimuth Labels ===
                    labelN: {
                        type: "label" as const,
                        xValue: 0,
                        yValue: 90,
                        content: ["N"],
                        position: "center" as const,
                        font: {size: 14, weight: "bolder"} as const,
                        color: "black",
                    },
                    labelE: {
                        type: "label" as const,
                        xValue: 90,
                        yValue: 0,
                        content: ["E"],
                        position: "center" as const,
                        font: {size: 14, weight: "bolder"} as const,
                        color: "black",
                    },
                    labelS: {
                        type: "label" as const,
                        xValue: 0,
                        yValue: -90,
                        content: ["S"],
                        position: "center" as const,
                        font: {size: 14, weight: "bolder"} as const,
                        color: "black",
                    },
                    labelW: {
                        type: "label" as const,
                        xValue: -90,
                        yValue: 0,
                        content: ["W"],
                        position: "center" as const,
                        font: {size: 14, weight: "bolder"} as const,
                        color: "black",
                    },
                    // === Elevation Ring Labels ===
                    labelElv30: {
                        type: "label" as const,
                        xValue: 30, // Right edge of ring3 (90 - 30 = 60)
                        yValue: 0,
                        content: ["30°"],
                        position: "center" as const,
                        font: {size: 12},
                        color: "gray",
                    },
                    labelElv60: {
                        type: "label" as const,
                        xValue: 60, // Right edge of ring2 (90 - 60 = 30)
                        yValue: 0,
                        content: ["60°"],
                        position: "center" as const,
                        font: {size: 12},
                        color: "gray",
                    },
                    labelElv90: {
                        type: "label" as const,
                        xValue: 0,
                        yValue: 0,
                        content: ["90°"],
                        position: "center" as const,
                        font: {size: 12},
                        color: "gray",
                    },
                },
            },
        },
    };

    return (
        <div className="p-6 bg-white shadow-md rounded-md mt-6">
            <h3 className="text-xl font-semibold mb-4">SkyPlot</h3>

            {/* Constellation Toggles */}
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
                    min={0}
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
