import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {MapContainer, TileLayer, Marker} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface SummaryStepProps {
    formData: any;
    prevStep: () => void;
}

const markerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const SummaryStep: React.FC<SummaryStepProps> = ({formData, prevStep}) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const selectedDem = formData.selectedDEM === "no_dem"
        ? {type: "GEDI_L3", source: "ot"}
        : formData.availableDems?.find((dem: any) => dem.type === formData.selectedDEM) || {
        type: formData.selectedDEM,
        source: "unknown"
    };

    const demSource = selectedDem.source === "Piemote Geoportale" ? "pgp" : "ot";

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        try {
            const date = new Date(formData.date);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");

            const time = new Date(formData.time);
            const hours = String(time.getHours()).padStart(2, "0");
            const minutes = String(time.getMinutes()).padStart(2, "0");
            const seconds = "00";

            const startDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`

            const requestData = {
                start_datetime: startDateTime,
                timezone: formData.timezone?.value || 'UTC',
                duration_hours: Number(formData.duration) / 60,
                cutoff_angle: Number(formData.cutoffAngle) || 0,
                dem: {
                    type: selectedDem.type,
                    source: demSource,
                },
                constellations: formData.constellations || [],
                receivers: formData.receivers.map((receiver: any) => ({
                    id: receiver.id,
                    role: receiver.role,
                    coordinates: {
                        latitude: receiver.lat,
                        longitude: receiver.lon,
                        height: receiver.height || 0,
                    },
                    obstacles: receiver.obstacles?.map((obstacle: any) => ({
                        vertices: obstacle.coordinates.map((vertex: [number, number]) => ({
                            latitude: vertex[0],
                            longitude: vertex[1],
                        })),
                        height: obstacle.totalHeight,
                    })) || [],
                })),
                application: formData.receivers.length > 1 ? "differential_gnss" : "single",
            };

            const response = await axios.post("/api/v1/plan", requestData, {timeout: 1200000});

            const timestampedData = {
                requestData,
                responseData: response.data,
                formData: {
                    ...formData,
                    date: formData.date,
                    time: formData.time,
                },
                timestamp: Date.now()
            };
            localStorage.setItem("planning_result", JSON.stringify(timestampedData));

            navigate("/result", {
                state: {
                    formData,
                    requestData,
                    responseData: response.data,
                },
            });
        } catch (err) {
            console.error("Error submitting planning request:", err);
            setError("Failed to submit request. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const displayDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const displayTime = (timeString: string) => {
        const time = new Date(timeString);
        return time.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Final Step: Review & Submit</h2>

            <div className="p-4 border rounded-md bg-gray-100">
                <p><strong>Application
                    Type:</strong> {formData.receivers.length > 1 ? "Multiple Receivers" : "Single Receiver"}</p>
            </div>

            <div className="p-4 border rounded-md bg-gray-50">
                <p><strong>Date:</strong> {displayDate(formData.date)}</p>
                <p><strong>Time:</strong> {displayTime(formData.time)}</p>
                <p><strong>Duration:</strong> {formData.duration} minutes</p>
                <p><strong>Timezone:</strong> {formData.timezone?.label}</p>
            </div>

            <div className="p-4 border rounded-md bg-gray-50">
                <h3 className="text-xl font-semibold">Selected GNSS Constellations</h3>
                {formData.constellations.length > 0 ? (
                    <ul className="list-disc ml-6">
                        {formData.constellations.map((constellation: string) => (
                            <li key={constellation}>{constellation}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No constellations selected.</p>
                )}
            </div>

            <div className="p-4 border rounded-md bg-gray-50">
                <h3 className="text-xl font-semibold">Receivers</h3>
                {formData.receivers.map((receiver: any, rIndex: number) => (
                    <div key={receiver.id} className="p-4 border-b last:border-none">
                        <h4 className="text-lg font-semibold mb-2">Receiver {rIndex + 1}</h4>
                        <p><strong>ID:</strong> {receiver.id}</p>
                        <p><strong>Role:</strong> {receiver.role.toUpperCase()}</p>
                        <p><strong>Location:</strong> Lat {receiver.lat}, Lon {receiver.lon}</p>
                        <p><strong>Height from Ground:</strong> {receiver.height} meters</p>

                        {receiver.obstacles && receiver.obstacles.length > 0 && (
                            <div className="mt-3 p-3 border rounded-md bg-gray-100">
                                <h4 className="text-lg font-semibold">Obstacles</h4>
                                {receiver.obstacles.map((obstacle: any, index: number) => (
                                    <div key={obstacle.id} className="p-2 border-b last:border-none">
                                        <h5 className="text-md font-semibold">Obstacle {index + 1}</h5>
                                        <p><strong>ID:</strong> {obstacle.id}</p>
                                        <p><strong>Obstacle Height:</strong> {obstacle.totalHeight} meters</p>

                                        <div className="mt-2">
                                            <p><strong>Vertices:</strong></p>
                                            <ul className="ml-4 list-disc text-gray-700">
                                                {obstacle.coordinates.map((vertex: [number, number], vIndex: number) => (
                                                    <li key={vIndex}>
                                                        Lat: {vertex[0]}, Lon: {vertex[1]}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="p-4 border rounded-md bg-gray-50">
                <p><strong>Cutoff Angle:</strong> {formData.cutoffAngle} degree</p>
            </div>

            <div className="p-4 border rounded-md bg-gray-50">
                <h3 className="text-xl font-semibold">Selected Digital Elevation Model (DEM)</h3>
                {formData.selectedDEM === "no_dem" ? (
                    <p className="text-red-500"><strong>No DEM selected</strong></p>
                ) : (
                    <>
                        <p><strong>DEM Name:</strong> {formData.selectedDEM}</p>
                        <p><strong>DEM Source:</strong> {selectedDem.source}</p>
                    </>
                )}
            </div>

            {formData.receivers && formData.receivers.length > 0 && (
                <div className="p-4 border rounded-md bg-gray-50">
                    <h3 className="text-xl font-semibold">Selected Locations</h3>

                    {formData.receivers.map((receiver: any, index: number) => (
                        <p key={index} className="text-gray-700">
                            📍 <strong>Receiver {index + 1}:</strong> Lat {receiver.lat}, Lon {receiver.lon}
                        </p>
                    ))}

                    <div className="w-full h-64 mt-6">
                        <MapContainer
                            center={[formData.receivers[0].lat, formData.receivers[0].lon]}
                            zoom={4}
                            className="w-full h-full rounded-md"
                        >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                            {formData.receivers.map((receiver: any, index: number) => (
                                <Marker key={index} position={[receiver.lat, receiver.lon]} icon={markerIcon}/>
                            ))}
                        </MapContainer>
                    </div>
                </div>
            )}

            {error && <p className="text-red-500">{error}</p>}

            {loading && (
                <div className="flex justify-center items-center py-4">
                    <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0H4z"></path>
                    </svg>
                    <p className="ml-3 text-lg font-semibold text-blue-500">Processing request...</p>
                </div>
            )}

            <div className="flex justify-between mt-4">
                <button onClick={prevStep} className="bg-gray-400 text-white px-6 py-2 rounded w-1/4 mx-1">
                    Back
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`px-6 py-2 rounded w-3/4 mx-1 ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 text-white"}`}
                >
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </div>
        </div>
    );
};

export default SummaryStep;
