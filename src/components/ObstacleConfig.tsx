import React, {useState, useEffect} from "react";
import {MapContainer, TileLayer, Polygon, FeatureGroup, Marker, useMap} from "react-leaflet";
import {EditControl} from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";

const markerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

interface Obstacle {
    id: string;
    coordinates: [number, number][];
    totalHeight: number;
}

interface ObstacleConfigProps {
    obstacles: Obstacle[];
    setObstacles: React.Dispatch<React.SetStateAction<Obstacle[]>>;
    receiverCoordinates: { lat: number; lon: number };
}

const ObstacleConfig: React.FC<ObstacleConfigProps> = ({obstacles, setObstacles, receiverCoordinates}) => {
    const [currentObstacle, setCurrentObstacle] = useState<Obstacle | null>(null);
    const [editing, setEditing] = useState(false);

    const MapCenterUpdater: React.FC = () => {
        const map = useMap();
        useEffect(() => {
            map.setView([receiverCoordinates.lat, receiverCoordinates.lon], 17, {animate: true});
        }, [receiverCoordinates, map]);

        return null;
    };

    const generateUniqueID = (): string => Math.random().toString(36).slice(2, 7);

    const handleCreate = (e: any) => {
        const layer = e.layer;
        const latLngs = layer.getLatLngs()[0].map((point: any): [number, number] => [point.lat, point.lng]);

        if (latLngs.length < 3) {
            alert("An obstacle must have at least 3 points to form a closed shape.");
            return;
        }

        const closedPolygon: [number, number][] = [...latLngs, latLngs[0]];

        setCurrentObstacle({
            id: generateUniqueID(),
            coordinates: closedPolygon,
            totalHeight: 0,
        });
        setEditing(true);
    };

    const saveObstacle = () => {
        if (currentObstacle) {
            setObstacles((prevObstacles: Obstacle[]) => {
                const existingIndex = prevObstacles.findIndex((obs) => obs.id === currentObstacle.id);
                if (existingIndex > -1) {
                    const updatedObstacles = [...prevObstacles];
                    updatedObstacles[existingIndex] = currentObstacle;
                    return updatedObstacles;
                } else {
                    return [...prevObstacles, currentObstacle];
                }
            });

            setCurrentObstacle(null);
            setEditing(false);
        }
    };

    const deleteObstacle = (id: string) => {
        setObstacles((prevObstacles: Obstacle[]) => prevObstacles.filter((obs) => obs.id !== id));
    };

    const editObstacle = (obstacle: Obstacle) => {
        setCurrentObstacle(obstacle);
        setEditing(true);
    };

    return (
        <div className="p-6 bg-white shadow-md rounded-md space-y-6">
            <h2 className="text-2xl font-semibold">Obstacle Configuration</h2>

            <MapContainer center={[receiverCoordinates.lat, receiverCoordinates.lon]} zoom={17} maxZoom={19}
                          className="h-[400px] w-full rounded-md">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                <MapCenterUpdater/>

                <Marker position={[receiverCoordinates.lat, receiverCoordinates.lon]} icon={markerIcon}/>

                <FeatureGroup>
                    <EditControl
                        position="topright"
                        onCreated={handleCreate}
                        draw={{
                            polyline: false,
                            marker: false,
                            circle: false,
                            rectangle: false,
                            circlemarker: false,
                            polygon: true,
                        }}
                    />
                </FeatureGroup>

                {obstacles.map((obstacle) => (
                    <Polygon key={obstacle.id} positions={obstacle.coordinates} color="red"/>
                ))}
                {currentObstacle && <Polygon positions={currentObstacle.coordinates} color="blue"/>}
            </MapContainer>

            {editing && currentObstacle && (
                <div className="p-4 border rounded-md bg-gray-50">
                    <h3 className="text-lg font-semibold mb-3">{obstacles.some((o) => o.id === currentObstacle.id) ? "Edit" : "Define"} Obstacle
                        Properties</h3>

                    <label className="block text-lg font-medium">Total Height (m):</label>
                    <input
                        type="number"
                        min="0"
                        value={currentObstacle.totalHeight}
                        onChange={(e) =>
                            setCurrentObstacle({...currentObstacle, totalHeight: Number(e.target.value)})
                        }
                        className="border p-2 rounded w-full mb-3"
                    />

                    <button
                        onClick={saveObstacle}
                        className="bg-blue-500 text-white px-4 py-2 rounded mt-4 w-full hover:bg-blue-600"
                    >
                        {obstacles.some((o) => o.id === currentObstacle.id) ? "Update Obstacle" : "Save Obstacle"}
                    </button>
                </div>
            )}

            {obstacles.length > 0 && (
                <div className="p-4 border rounded-md bg-gray-50">
                    <h3 className="text-lg font-semibold mb-3">Obstacles List</h3>
                    <ul>
                        {obstacles.map((obstacle) => (
                            <li key={obstacle.id} className="flex justify-between items-center border-b py-2">
                                <div>
                                    <p>
                                        <strong>Height:</strong> {obstacle.totalHeight}m
                                    </p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => editObstacle(obstacle)}
                                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteObstacle(obstacle.id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ObstacleConfig;
