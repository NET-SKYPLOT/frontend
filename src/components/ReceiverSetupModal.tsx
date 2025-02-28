import React, {useState} from "react";
import MapComponent from "../components/MapComponent";
import LocationInput from "../components/LocationInput";
import ObstacleConfig from "../components/ObstacleConfig";
import {MapPin, X} from "lucide-react";

interface ReceiverSetupModalProps {
    receiver: any;
    setFormData: (data: any) => void;
    closeModal: () => void;
}

const ReceiverSetupModal: React.FC<ReceiverSetupModalProps> = ({receiver, setFormData, closeModal}) => {
    const [coordinates, setCoordinates] = useState({lat: receiver.lat, lon: receiver.lon});
    const [height, setHeight] = useState(receiver.height || 0);
    const [activeTab, setActiveTab] = useState("location");
    const [obstacles, setObstacles] = useState(receiver.obstacles || []);

    const saveReceiverConfig = () => {
        setFormData((prevData: any) => ({
            ...prevData,
            receivers: prevData.receivers.map((r: any) =>
                r.id === receiver.id
                    ? {...r, lat: coordinates.lat, lon: coordinates.lon, height, obstacles}
                    : r
            ),
        }));
        closeModal();
    };

    const fetchCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCoordinates({lat: position.coords.latitude, lon: position.coords.longitude});
            },
            (error) => console.error("Error fetching location:", error)
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[85vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">
                        Configure {receiver.role.toUpperCase()} Receiver
                    </h3>
                    <button onClick={closeModal} className="text-gray-600 hover:text-gray-900">
                        <X size={24}/>
                    </button>
                </div>

                <div className="flex space-x-4 border-b pb-2 mb-4">
                    <button
                        onClick={() => setActiveTab("location")}
                        className={`pb-2 flex-1 text-center ${
                            activeTab === "location"
                                ? "border-b-2 border-blue-500 text-blue-600 font-semibold"
                                : "text-gray-700 hover:text-gray-900"
                        }`}
                    >
                        Location Configs
                    </button>
                    <button
                        onClick={() => setActiveTab("obstacle")}
                        className={`pb-2 flex-1 text-center ${
                            activeTab === "obstacle"
                                ? "border-b-2 border-blue-500 text-blue-600 font-semibold"
                                : "text-gray-700 hover:text-gray-900"
                        }`}
                    >
                        Obstacle Configs
                    </button>
                </div>

                {activeTab === "location" ? (
                    <div className="space-y-4">
                        <MapComponent coordinates={coordinates} setCoordinates={setCoordinates} realignMap={true}/>

                        <button
                            onClick={fetchCurrentLocation}
                            className="bg-green-500 text-white px-4 py-2 rounded flex items-center justify-center space-x-2 w-full"
                        >
                            <MapPin size={20}/>
                            <span>Use My Location</span>
                        </button>

                        <LocationInput coordinates={coordinates} setCoordinates={setCoordinates} setRealignMap={() => {
                        }}/>

                        <div className="flex space-x-4">
                            <div className="w-1/2">
                                <label className="block text-lg font-medium">Latitude:</label>
                                <input
                                    type="number"
                                    value={coordinates.lat}
                                    onChange={(e) => setCoordinates({...coordinates, lat: parseFloat(e.target.value)})}
                                    className="border p-2 rounded w-full"
                                />
                            </div>

                            <div className="w-1/2">
                                <label className="block text-lg font-medium">Longitude:</label>
                                <input
                                    type="number"
                                    value={coordinates.lon}
                                    onChange={(e) => setCoordinates({...coordinates, lon: parseFloat(e.target.value)})}
                                    className="border p-2 rounded w-full"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-lg font-medium">Height from Ground (meters):</label>
                            <input
                                type="number"
                                min="0"
                                value={height}
                                onChange={(e) => setHeight(Math.max(0, Number(e.target.value)))}
                                className="border p-2 rounded w-full"
                            />
                        </div>
                    </div>
                ) : (
                    <ObstacleConfig obstacles={obstacles} setObstacles={setObstacles}
                                    receiverCoordinates={coordinates}/>
                )}

                <button
                    onClick={saveReceiverConfig}
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-4 w-full hover:bg-blue-600"
                >
                    Save
                </button>
            </div>
        </div>
    );
};

export default ReceiverSetupModal;
