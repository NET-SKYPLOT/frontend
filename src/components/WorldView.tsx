import React, {useEffect, useRef} from "react";
import * as d3 from "d3";
import {feature} from "topojson-client";
import {FeatureCollection, Geometry} from "geojson";

interface Position {
    latitude: number;
    longitude: number;
    time: string;
}

interface SatelliteWorldView {
    constellation: string;
    satellite_id: string;
    position: Position[];
}

interface WorldViewProps {
    worldViewData: SatelliteWorldView[];
}

const width = 1000;
const height = 500;

const colorMap: Record<string, string> = {
    GPS: "blue",
    GLONASS: "red",
    GALILEO: "green",
    BEIDOU: "orange",
};

const WorldView: React.FC<WorldViewProps> = ({worldViewData}) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous render

        const projection = d3.geoMercator().scale(155).translate([width / 2, height / 1.45]);
        const geoPath = d3.geoPath().projection(projection);

        d3.json("/world-110m.json").then((worldData: any) => {
            const countries = feature(
                worldData,
                worldData.objects.countries
            ) as unknown as FeatureCollection<Geometry>;

            // Draw world map
            svg
                .append("g")
                .selectAll("path")
                .data(countries.features)
                .enter()
                .append("path")
                .attr("d", geoPath as any)
                .attr("fill", "#f3f4f6")
                .attr("stroke", "#ccc");

            // Draw satellite tracks
            worldViewData.forEach((sat) => {
                const line = d3
                    .line<[number, number]>()
                    .x((d) => d[0])
                    .y((d) => d[1])
                    .curve(d3.curveBasis);

                const pathCoords: [number, number][] = sat.position
                    .map((p): [number, number] | null => {
                        const projected = projection([p.longitude, p.latitude]);
                        return projected ? [projected[0], projected[1]] : null;
                    })
                    .filter((d): d is [number, number] => d !== null);

                svg
                    .append("path")
                    .datum(pathCoords)
                    .attr("d", line)
                    .attr("fill", "none")
                    .attr("stroke", colorMap[sat.constellation] || "gray")
                    .attr("stroke-width", 1)
                    .attr("opacity", 0.6);
            });
        });
    }, [worldViewData]);

    return (
        <div className="p-6 bg-white shadow-md rounded-md mt-6">
            <h3 className="text-xl font-semibold mb-4">World View</h3>
            <div className="overflow-x-auto">
                <svg ref={svgRef} width={width} height={height}></svg>
            </div>
        </div>
    );
};

export default WorldView;
