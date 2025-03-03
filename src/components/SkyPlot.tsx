import React from "react";
import {Scatter} from "react-chartjs-2";
import {Chart, registerables} from "chart.js";

Chart.register(...registerables);

interface SkyPlotData {
    satellites: {
        constellation: string;
        satellite_id: string;
        trajectory: {
            azimuth: number;
            elevation: number;
            visible: boolean;
        }[];
    }[];
}

interface SkyPlotProps {
    data: SkyPlotData;
}

const SkyPlot: React.FC<SkyPlotProps> = ({data}) => {
    const colorMap: Record<string, string> = {
        GPS: "blue",
        GLONASS: "red",
        Galileo: "green",
        BeiDou: "orange",
    };

    const chartData = {
        datasets: data.satellites.map((satellite) => ({
            label: `${satellite.constellation} - ${satellite.satellite_id}`,
            data: satellite.trajectory.map((point) => ({
                x: point.azimuth,
                y: point.elevation,
            })),
            backgroundColor: satellite.trajectory.map((point) =>
                point.visible ? colorMap[satellite.constellation] || "gray" : "gray"
            ),
            pointRadius: 5,
        })),
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "chartArea" as const, // ✅ FIXED Type Issue
                labels: {boxWidth: 15, padding: 10, font: {size: 12}},
            },
            tooltip: {
                mode: "index" as const,
                intersect: false,
            },
        },
        scales: {
            x: {
                title: {display: true, text: "Azimuth (°)"},
                min: 0,
                max: 360,
                grid: {color: "rgba(200, 200, 200, 0.3)"},
            },
            y: {
                title: {display: true, text: "Elevation (°)"},
                min: 0, // ✅ FIX: Elevation can't be negative
                max: 90,
                grid: {color: "rgba(200, 200, 200, 0.3)"},
            },
        },
    };

    return (
        <div className="p-4 bg-white shadow-md rounded-md">
            <h3 className="text-xl font-semibold mb-4">SkyPlot</h3>
            <div className="h-[400px]">
                <Scatter data={chartData} options={options}/>
            </div>
        </div>
    );
};

export default SkyPlot;
