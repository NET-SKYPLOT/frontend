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

const baseWidth = 600;
const baseHeight = 600;
const baseRadius = 250;
const center = {x: baseWidth / 2, y: baseHeight / 2};

const colorMap: Record<string, string> = {
    GPS: "blue",
    GLONASS: "red",
    GALILEO: "green",
    BEIDOU: "orange",
};

const SkyPlot: React.FC<SkyPlotProps> = ({responseData}) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [containerSize, setContainerSize] = useState({width: baseWidth, height: baseHeight});

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

            const r = (90 - point.elevation) * (baseRadius / 90);
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

    // Resize observer to track parent width
    useEffect(() => {
        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const {width} = entry.contentRect;
                const scale = width / baseWidth;
                setContainerSize({width, height: baseHeight * scale});
            }
        });

        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const scale = containerSize.width / baseWidth;
        const cx = center.x * scale;
        const cy = center.y * scale;
        const rScale = baseRadius * scale;

        // Background circle
        svg
            .append("circle")
            .attr("cx", cx)
            .attr("cy", cy)
            .attr("r", rScale)
            .attr("fill", "#f9fafb")
            .attr("stroke", "#ccc");

        // Rings
        [30, 60, 90].forEach((e) => {
            const r = (90 - e) * (rScale / 90);
            svg
                .append("circle")
                .attr("cx", cx)
                .attr("cy", cy)
                .attr("r", r)
                .attr("fill", "none")
                .attr("stroke", "#bbb")
                .attr("stroke-dasharray", "2,2");
        });

        // Axes
        const directions = [
            {angle: 0, label: "N"},
            {angle: 90, label: "E"},
            {angle: 180, label: "S"},
            {angle: 270, label: "W"},
        ];

        directions.forEach(({angle, label}) => {
            const rad = (angle * Math.PI) / 180;
            const x = cx + rScale * Math.sin(rad);
            const y = cy - rScale * Math.cos(rad);

            svg.append("line").attr("x1", cx).attr("y1", cy).attr("x2", x).attr("y2", y).attr("stroke", "#aaa");

            svg.append("text")
                .attr("x", x)
                .attr("y", y)
                .attr("dy", "0.35em")
                .attr("text-anchor", "middle")
                .text(label)
                .style("font-size", `${12 * scale}px`)
                .style("fill", "#444");
        });

        const tooltip = d3
            .select("body")
            .append("div")
            .attr("class", "absolute bg-white text-sm shadow px-2 py-1 border rounded pointer-events-none z-50")
            .style("opacity", 0);

        responseData
            .filter((sat) => visibleConstellations[sat.constellation])
            .forEach((sat) => {
                const pathData: [number, number][] = sat.trajectory
                    .filter((p) => p.time <= selectedTime)
                    .map((p): [number, number] => {
                        const r = (90 - p.elevation) * (rScale / 90);
                        const angleRad = (p.azimuth * Math.PI) / 180;
                        const x = cx + r * Math.sin(angleRad);
                        const y = cy - r * Math.cos(angleRad);
                        return [x, y];
                    });

                const line = d3
                    .line<[number, number]>()
                    .x((d) => d[0])
                    .y((d) => d[1])
                    .curve(d3.curveLinear);

                svg
                    .append("path")
                    .datum(pathData)
                    .attr("d", line)
                    .attr("fill", "none")
                    .attr("stroke", colorMap[sat.constellation] || "gray")
                    .attr("stroke-width", 1)
                    .attr("opacity", 0.6);
            });

        svg
            .selectAll("circle.sat-point")
            .data(filteredPoints)
            .enter()
            .append("circle")
            .attr("class", "sat-point")
            .attr("cx", (d) => d.x * scale)
            .attr("cy", (d) => d.y * scale)
            .attr("r", 5 * scale)
            .attr("fill", (d) => d.color)
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
    }, [filteredPoints, responseData, selectedTime, visibleConstellations, containerSize]);

    return (
        <div className="p-6 bg-white shadow-md rounded-md mt-6">
            <h3 className="text-xl font-semibold mb-4">SkyPlot</h3>

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

            {/* Responsive container */}
            <div ref={containerRef} className="w-full max-w-[700px] mx-auto relative aspect-square">
                <svg
                    ref={svgRef}
                    width={containerSize.width}
                    height={containerSize.height}
                    viewBox={`0 0 ${baseWidth} ${baseHeight}`}
                />
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
