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
                setSuggestions([]);
            }
        } catch (error) {
            console.error("Error fetching address suggestions:", error);
            setSuggestions([]);
        }
    };

    const debouncedFetchAddressSuggestions = useCallback(debounce(fetchAddressSuggestions, 500), []);

    return (
        <div className="mb-6">
            <label className="block text-lg font-medium">Enter Address:</label>
            <Select
                options={suggestions}
                onInputChange={(value, {action}) => {
                    if (action === "input-change" && value.trim() !== "") {
                        debouncedFetchAddressSuggestions(value);
                    } else if (action === "input-blur" || value.trim() === "") {
                        setSuggestions([]);
                    }
                }}
                onChange={(option) => {
                    if (option && option.value) {
                        setCoordinates(option.value);
                        setRealignMap(true);
                        setTimeout(() => setRealignMap(false), 500);
                    }
                }}
                value={suggestions.find((s) => s.value.lat === coordinates.lat && s.value.lon === coordinates.lon) || null}
                placeholder="Enter Address"
                isClearable
                className="w-full"
            />
        </div>
    );
};

export default LocationInput;
