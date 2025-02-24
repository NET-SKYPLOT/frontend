import * as React from "react";
import {MapContainer, TileLayer, Marker} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

interface SummaryStepProps {
    formData: any;
    prevStep: () => void;
    handleSubmit: () => void;
}

const SummaryStep: React.FC<SummaryStepProps> = ({formData, prevStep, handleSubmit}) => {
    return (
        <div className="space-y-6 p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-semibold">Final Step: Review & Submit</h2>

            <p><strong>Date:</strong> {formData.date?.toLocaleDateString()}</p>
            <p><strong>Time:</strong> {formData.time?.toLocaleTimeString()}</p>
            <p><strong>Duration:</strong> {formData.duration} minutes</p>
            <p><strong>Timezone:</strong> {formData.timezone?.label || "UTC"}</p>

            <h3 className="text-xl font-semibold mt-4">Selected Locations</h3>

            {formData.locations.map((loc: any, index: number) => (
                <p key={index} className="text-gray-700">
                    📍 <strong>Location {index + 1}:</strong> Lat {loc.lat}, Lon {loc.lon}
                </p>
            ))}

            {formData.locations.length > 0 && (
                <div className="w-full h-64 mt-6">
                    <MapContainer
                        center={[formData.locations[0].lat, formData.locations[0].lon]}
                        zoom={2}
                        className="w-full h-full rounded-md"
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                        {formData.locations.map((loc: any, index: number) => (
                            <Marker key={index} position={[loc.lat, loc.lon]} icon={markerIcon}/>
                        ))}
                    </MapContainer>
                </div>
            )}

            <div className="flex justify-between mt-4">
                <button onClick={prevStep} className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500">
                    Back
                </button>
                <button onClick={handleSubmit} className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
                    Submit
                </button>
            </div>
        </div>
    );
};

export default SummaryStep;
