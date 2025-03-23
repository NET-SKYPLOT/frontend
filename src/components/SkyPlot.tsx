import React, {useState, useMemo, lazy, Suspense} from "react";
import debounce from "lodash.debounce";

const Plot = lazy(() => import("react-plotly.js"));

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

    const timestamps = useMemo(() => {
        return Array.from(
            new Set(
                responseData.flatMap((satellite) =>
                    satellite.trajectory.map((point) => point.time)
                )
            )
        ).sort();
    }, [responseData]);

    const [selectedTimeIndex, setSelectedTimeIndex] = useState(0);
    const selectedTime = timestamps[selectedTimeIndex];

    const colorMap: Record<string, string> = {
        GPS: "blue",
        GLONASS: "red",
        GALILEO: "green",
        BEIDOU: "orange",
    };

    const uniqueConstellations = useMemo(() => {
        return Array.from(new Set(responseData.map((sat) => sat.constellation)));
    }, [responseData]);

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

    const scatterData = useMemo(() => {
        return responseData
            .filter((sat) => visibleConstellations[sat.constellation])
            .map((sat) => {
                const point = sat.trajectory.find((p) => p.time === selectedTime);
                if (!point) return null;

                return {
                    r: [90 - point.elevation],
                    theta: [point.azimuth],
                    mode: "markers" as const,
                    type: "scatterpolar" as const,
                    name: `${sat.constellation} - ${sat.satellite_id}`,
                    marker: {
                        color: point.visible ? colorMap[sat.constellation] || "gray" : "gray",
                        size: 8,
                    },
                };
            })
            .filter((d): d is Extract<typeof d, object> => d !== null);
    }, [responseData, visibleConstellations, selectedTime]);

    const debouncedTimeChange = useMemo(() => {
        return debounce((value: number) => {
            setSelectedTimeIndex(value);
        }, 100);
    }, []);

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

            {/* Plotly Skyplot - Lazy loaded with Suspense */}
            <Suspense fallback={<div className="text-center">Loading SkyPlot...</div>}>
                {scatterData.length > 0 && (
                    <div className="h-[600px] w-[600px] mx-auto">
                        <Plot
                            data={scatterData}
                            layout={{
                                width: 600,
                                height: 600,
                                polar: {
                                    radialaxis: {
                                        visible: true,
                                        range: [0, 90],
                                        tickvals: [30, 60, 90],
                                        ticktext: ["60°", "30°", "0°"],
                                        angle: 0,
                                    },
                                    angularaxis: {
                                        direction: "clockwise",
                                        rotation: 90,
                                        tickmode: "array",
                                        tickvals: [0, 90, 180, 270],
                                        ticktext: ["N", "E", "S", "W"],
                                    },
                                },
                                margin: {t: 30, r: 0, b: 0, l: 0},
                                showlegend: false,
                            }}
                            config={{responsive: true}}
                        />
                    </div>
                )}
            </Suspense>

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
                    onChange={(e) => debouncedTimeChange(Number(e.target.value))}
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
