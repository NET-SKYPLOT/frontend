import React, {useState} from "react";
import Plot from "react-plotly.js";
import {ScatterData} from "plotly.js";  // ✅ Correct type

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

    // State for selected time
    const [selectedTimeIndex, setSelectedTimeIndex] = useState(0);
    const selectedTime = timestamps[selectedTimeIndex];

    // Color mapping for different satellite constellations
    const colorMap: Record<string, string> = {
        GPS: "blue",
        GLONASS: "red",
        Galileo: "green",
        BeiDou: "orange",
    };

    // Filter satellites for selected time
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

    // Prepare data for Plotly (Explicitly use Partial<ScatterData> type)
    const plotData: Partial<ScatterData>[] = filteredSatellites.map(({satellite, point}) => ({
        type: "scatterpolar",  // ✅ Correct type for Polar Plot
        mode: "markers",
        r: [90 - point.elevation], // Convert elevation: closer to center = higher elevation
        theta: [point.azimuth], // Azimuth angle
        marker: {
            size: 8,
            color: point.visible ? colorMap[satellite.constellation] || "gray" : "gray",
            symbol: point.visible ? "circle" : "x",
        },
        name: `${satellite.constellation} - ${satellite.satellite_id}`,
    }));

    return (
        <div className="p-6 bg-white shadow-md rounded-md mt-6">
            <h3 className="text-xl font-semibold mb-4">SkyPlot</h3>

            {/* Skyplot Chart */}
            <Plot
                data={plotData} // ✅ Fixed Type Issue
                layout={{
                    title: `Satellite Skyplot at ${new Date(selectedTime).toLocaleTimeString()}`,
                    width: 700,
                    height: 700,
                    polar: {
                        radialaxis: {range: [0, 90], showgrid: true, showline: false},
                        angularaxis: {direction: "clockwise", rotation: 90},
                    },
                    showlegend: true,
                }}
                config={{responsive: true}}
            />

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
