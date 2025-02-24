import {useEffect, useState} from "react";
import {MapPin} from "lucide-react";
import MapComponent from "../components/MapComponent";
import LocationInput from "../components/LocationInput";

interface Coordinates {
    lat: number;
    lon: number;
}

interface StepLocationProps {
    formData: any;
    setFormData: (data: any) => void;
    nextStep: () => void;
    prevStep: () => void;
    stepIndex: number;
}

const StepLocation = ({formData, setFormData, nextStep, prevStep, stepIndex}: StepLocationProps) => {
    const [coordinates, setCoordinates] = useState<Coordinates>(formData.locations[stepIndex] || {
        lat: 45.0703,
        lon: 7.6869
    });
    const [realignMap, setRealignMap] = useState(false);

    // Fetch User's Current Location
    const fetchCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const newCoordinates = {lat: position.coords.latitude, lon: position.coords.longitude};
                setCoordinates(newCoordinates);
                setRealignMap(true);
                setTimeout(() => setRealignMap(false), 500);
            },
            (error) => console.error("Error fetching location:", error)
        );
    };

    useEffect(() => {
        let updatedLocations = [...formData.locations];
        updatedLocations[stepIndex] = coordinates;
        setFormData({...formData, locations: updatedLocations});
    }, [coordinates]);

    return (
        <div className="p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-semibold mb-4">Select Location {stepIndex + 1}</h2>

            <MapComponent coordinates={coordinates} setCoordinates={setCoordinates} realignMap={realignMap}/>

            <div className="mb-4">
                <button
                    onClick={fetchCurrentLocation}
                    className="bg-green-500 text-white px-4 py-2 rounded flex items-center space-x-2"
                >
                    <MapPin size={20}/>
                    <span>Use My Location</span>
                </button>
            </div>

            <LocationInput coordinates={coordinates} setCoordinates={setCoordinates} setRealignMap={setRealignMap}/>

            <div className="flex justify-between mt-4">
                <button onClick={prevStep} className="bg-gray-400 text-white px-4 py-2 rounded">
                    Back
                </button>
                <button onClick={nextStep} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Next
                </button>
            </div>
        </div>
    );
};

export default StepLocation;
