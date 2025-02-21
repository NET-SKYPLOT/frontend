import {useState, useCallback} from "react";
import Select from "react-select";
import axios from "axios";
import debounce from "lodash.debounce";
import * as React from "react";

interface Coordinates {
    lat: number;
    lon: number;
}

interface LocationInputProps {
    coordinates: Coordinates;
    setCoordinates: (coords: Coordinates) => void;
    setRealignMap: (realign: boolean) => void;
}

const LocationInput: React.FC<LocationInputProps> = ({coordinates, setCoordinates, setRealignMap}) => {
    const [suggestions, setSuggestions] = useState<{ label: string; value: Coordinates }[]>([]);

    // Fetches address suggestions from OpenStreetMap and updates the list
    const fetchAddressSuggestions = async (input: string) => {
        if (!input.trim()) {
            setSuggestions([]);
            return;
        }

        try {
            const response = await axios.get("https://nominatim.openstreetmap.org/search", {
                params: {q: input, format: "json", addressdetails: 1, limit: 5},
            });

            if (response.data.length > 0) {
                setSuggestions(
                    response.data.map((place: { display_name: string; lat: string; lon: string }) => ({
                        label: place.display_name,
                        value: {lat: parseFloat(place.lat), lon: parseFloat(place.lon)},
                    }))
                );
            } else {
                setSuggestions([]); // Clear suggestions if no results
            }
        } catch (error) {
            console.error("Error fetching address suggestions:", error);
        }
    };

    // Debounce function to limit API requests while typing
    const debouncedFetchAddressSuggestions = useCallback(debounce(fetchAddressSuggestions, 500), []);

    return (
        <div className="mb-4">
            <label className="block text-lg font-medium">Enter Address:</label>
            <Select
                options={suggestions}
                onInputChange={(value, {action}) => {
                    if (action === "input-change") {
                        debouncedFetchAddressSuggestions(value);
                    }
                }}
                onChange={(option) => {
                    if (option && (option.value.lat !== coordinates.lat || option.value.lon !== coordinates.lon)) {
                        setCoordinates(option.value);
                        setRealignMap(true);
                        setTimeout(() => setRealignMap(false), 500);
                    }
                }}
                placeholder="Enter Address"
                className="w-full"
            />
        </div>
    );
};

export default LocationInput;
