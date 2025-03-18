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

// Define Leaflet marker icon
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

    console.log(formData);

    const demSource = selectedDem.source === "Piemote Geoportale" ? "pgp" : "ot";

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        const requestData = {
            start_datetime: new Date(formData.date).toISOString(),
            duration_hours: Number(formData.duration) / 60,
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

        try {
            const response = await axios.post("/api/v1/plan", requestData, {timeout: 300000});

            navigate("/result", {state: {requestData, responseData: response.data}});
        } catch (err) {
            console.error("Error submitting planning request:", err);
            setError("Failed to submit request. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Final Step: Review & Submit</h2>

            {/* Application Type */}
            <div className="p-4 border rounded-md bg-gray-100">
                <p><strong>Application
                    Type:</strong> {formData.receivers.length > 1 ? "Multiple Receivers" : "Single Receiver"}</p>
            </div>

            {/* General Planning Information */}
            <div className="p-4 border rounded-md bg-gray-50">
                <p><strong>Date:</strong> {formData.date?.toLocaleDateString()}</p>
                <p><strong>Time:</strong> {formData.time?.toLocaleTimeString()}</p>
                <p><strong>Duration:</strong> {formData.duration} minutes</p>
                <p><strong>Timezone:</strong> {formData.timezone?.label}</p>
            </div>

            {/* Selected GNSS Constellations */}
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

            {/* Receivers List */}
            <div className="p-4 border rounded-md bg-gray-50">
                <h3 className="text-xl font-semibold">Receivers</h3>
                {formData.receivers.map((receiver: any, rIndex: number) => (
                    <div key={receiver.id} className="p-4 border-b last:border-none">
                        <h4 className="text-lg font-semibold mb-2">Receiver {rIndex + 1}</h4>
                        <p><strong>ID:</strong> {receiver.id}</p>
                        <p><strong>Role:</strong> {receiver.role.toUpperCase()}</p>
                        <p><strong>Location:</strong> Lat {receiver.lat}, Lon {receiver.lon}</p>
                        <p><strong>Height from Ground:</strong> {receiver.height} meters</p>
                    </div>
                ))}
            </div>

            {/* Selected DEM Section */}
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

            {/* Selected Locations Map */}
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

            {/* Error Message */}
            {error && <p className="text-red-500">{error}</p>}

            {/* Loading Indicator */}
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

            {/* Navigation Buttons */}
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
