import React, {useEffect, useRef, useState} from "react";
import * as d3 from "d3";

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

interface SatellitePoint {
    label: string;
    x: number;
    y: number;
    color: string;
}

const width = 600;
const height = 600;
const radius = 250;
const center = {x: width / 2, y: height / 2};

const colorMap: Record<string, string> = {
    GPS: "blue",
    GLONASS: "red",
    GALILEO: "green",
    BEIDOU: "orange",
};

const SkyPlot: React.FC<SkyPlotProps> = ({responseData}) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    const timestamps = Array.from(
        new Set(responseData.flatMap((sat) => sat.trajectory.map((p) => p.time)))
    ).sort();

    const [selectedTimeIndex, setSelectedTimeIndex] = useState(0);
    const selectedTime = timestamps[selectedTimeIndex];

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

    const filteredPoints: SatellitePoint[] = responseData
        .filter((sat) => visibleConstellations[sat.constellation])
        .map((sat) => {
            const point = sat.trajectory.find((p) => p.time === selectedTime);
            if (!point) return null;

            const r = (90 - point.elevation) * (radius / 90);
            const angleRad = (point.azimuth * Math.PI) / 180;
            const x = center.x + r * Math.sin(angleRad);
            const y = center.y - r * Math.cos(angleRad);

            return {
                label: `${sat.constellation} - ${sat.satellite_id}`,
                x,
                y,
                color: point.visible ? colorMap[sat.constellation] || "gray" : "gray",
            };
        })
        .filter((p): p is SatellitePoint => p !== null);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        // Background
        svg
            .append("circle")
            .attr("cx", center.x)
            .attr("cy", center.y)
            .attr("r", radius)
            .attr("fill", "#f9fafb")
            .attr("stroke", "#ccc");

        // Rings
        [30, 60, 90].forEach((e) => {
            const r = (90 - e) * (radius / 90);
            svg
                .append("circle")
                .attr("cx", center.x)
                .attr("cy", center.y)
                .attr("r", r)
                .attr("fill", "none")
                .attr("stroke", "#bbb")
                .attr("stroke-dasharray", "2,2");
        });

        // Directional Axes
        const directions = [
            {angle: 0, label: "N"},
            {angle: 90, label: "E"},
            {angle: 180, label: "S"},
            {angle: 270, label: "W"},
        ];

        directions.forEach(({angle, label}) => {
            const rad = (angle * Math.PI) / 180;
            const x = center.x + radius * Math.sin(rad);
            const y = center.y - radius * Math.cos(rad);

            svg
                .append("line")
                .attr("x1", center.x)
                .attr("y1", center.y)
                .attr("x2", x)
                .attr("y2", y)
                .attr("stroke", "#aaa");

            svg
                .append("text")
                .attr("x", x)
                .attr("y", y)
                .attr("dy", "0.35em")
                .attr("text-anchor", "middle")
                .text(label)
                .style("font-size", "12px")
                .style("fill", "#444");
        });

        // Tooltip
        const tooltip = d3
            .select("body")
            .append("div")
            .attr("class", "absolute bg-white text-sm shadow px-2 py-1 border rounded pointer-events-none z-50")
            .style("opacity", 0);

        // Satellite points
        svg
            .selectAll("circle.sat-point")
            .data(filteredPoints)
            .enter()
            .append("circle")
            .attr("class", "sat-point")
            .attr("cx", (d: SatellitePoint) => d.x)
            .attr("cy", (d: SatellitePoint) => d.y)
            .attr("r", 5)
            .attr("fill", (d: SatellitePoint) => d.color)
            .on("mouseover", function (event: MouseEvent, d: SatellitePoint) {
                tooltip.transition().duration(200).style("opacity", 0.9);
                tooltip
                    .html(d.label)
                    .style("left", event.pageX + 10 + "px")
                    .style("top", event.pageY - 20 + "px");
            })
            .on("mouseout", () => {
                tooltip.transition().duration(200).style("opacity", 0);
            });

        return () => {
            tooltip.remove();
        };
    }, [filteredPoints]);

    return (
        <div className="p-6 bg-white shadow-md rounded-md mt-6">
            <h3 className="text-xl font-semibold mb-4">SkyPlot (D3)</h3>

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

            {/* D3 SVG Chart */}
            <div className="h-[600px] w-[600px] mx-auto relative">
                <svg ref={svgRef} width={width} height={height}></svg>
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
