import {useState} from "react";
import Sidebar from "../components/Sidebar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimezoneSelect from "react-timezone-select";
import axios from "axios";
import MapComponent from "../components/MapComponent";
import LocationInput from "../components/LocationInput";
import {MapPin} from "lucide-react";

const Planning = () => {
    const [date, setDate] = useState<Date | null>(new Date());
    const [time, setTime] = useState<Date | null>(new Date());
    const [duration, setDuration] = useState("15");
    const [timezone, setTimezone] = useState<any>(null);
    const [coordinates, setCoordinates] = useState<{ lat: number; lon: number }>({lat: 45.0703, lon: 7.6869});
    const [realignMap, setRealignMap] = useState(false);
    const [loading, setLoading] = useState(false);

    // Fetch User's Current Location and Center the Map
    const fetchCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCoordinates({lat: position.coords.latitude, lon: position.coords.longitude});
                setRealignMap(true);
                setTimeout(() => setRealignMap(false), 500);
            },
            (error) => console.error("Error fetching location:", error)
        );
    };

    // Handle form submission
    const handleSubmit = async () => {
        setLoading(true);

        const data = {
            date,
            time,
            duration,
            timezone: timezone?.value || "",
            latitude: coordinates.lat,
            longitude: coordinates.lon,
        };

        console.log(data);

        try {
            await axios.post("https://your-api-endpoint.com/planning", data);
            alert("Planning data submitted successfully!");
        } catch (error) {
            console.error("Error submitting data:", error);
            alert("An error occurred while submitting your data.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar/>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-6 bg-white shadow-md overflow-y-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Planning Page</h1>

                {/* Map Component */}
                <MapComponent coordinates={coordinates} setCoordinates={setCoordinates} realignMap={realignMap}/>

                {/* Use My Location Button */}
                <div className="mb-4">
                    <label className="block text-lg font-medium">Select Location:</label>
                    <button
                        onClick={fetchCurrentLocation}
                        className="bg-green-500 text-white px-4 py-2 rounded flex items-center space-x-2"
                    >
                        <MapPin size={20}/>
                        <span>Use My Location</span>
                    </button>
                </div>

                {/* Location Input Component */}
                <LocationInput coordinates={coordinates} setCoordinates={setCoordinates} setRealignMap={setRealignMap}/>

                {/* Latitude & Longitude Input Fields */}
                <div className="mb-4 flex flex-col sm:flex-row gap-4">
                    {/* Latitude Input */}
                    <div className="w-full sm:w-1/2">
                        <label className="block text-lg font-medium">Latitude:</label>
                        <input
                            type="number"
                            step="0.000001"
                            value={coordinates.lat}
                            onChange={(e) => {
                                const lat = parseFloat(e.target.value);
                                if (!isNaN(lat)) {
                                    setCoordinates({...coordinates, lat});
                                    setRealignMap(true);
                                    setTimeout(() => setRealignMap(false), 500);
                                }
                            }}
                            className="border p-2 rounded w-full"
                        />
                    </div>

                    {/* Longitude Input */}
                    <div className="w-full sm:w-1/2">
                        <label className="block text-lg font-medium">Longitude:</label>
                        <input
                            type="number"
                            step="0.000001"
                            value={coordinates.lon}
                            onChange={(e) => {
                                const lon = parseFloat(e.target.value);
                                if (!isNaN(lon)) {
                                    setCoordinates({...coordinates, lon});
                                    setRealignMap(true);
                                    setTimeout(() => setRealignMap(false), 500);
                                }
                            }}
                            className="border p-2 rounded w-full"
                        />
                    </div>
                </div>

                {/* Date, Time, Duration Section */}
                <div className="mb-4 flex flex-col sm:flex-row gap-4">
                    {/* Date Picker */}
                    <div className="w-full sm:w-1/3 relative">
                        <label className="block text-lg font-medium">Select Date:</label>
                        <DatePicker
                            selected={date}
                            onChange={(date) => setDate(date)}
                            className="border p-2 rounded w-full"
                            popperPlacement="top"
                        />
                    </div>

                    {/* Time Picker */}
                    <div className="w-full sm:w-1/3 relative">
                        <label className="block text-lg font-medium">Select Time:</label>
                        <DatePicker
                            selected={time}
                            onChange={(time) => setTime(time)}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="HH:mm"
                            className="border p-2 rounded w-full"
                            popperPlacement="top"
                        />
                    </div>

                    {/* Duration Input */}
                    <div className="w-full sm:w-1/3">
                        <label className="block text-lg font-medium">
                            Duration (minutes)
                            <span className="text-gray-500 text-sm ml-2">
                                ({(Number(duration) / 60).toFixed(2)} hrs)
                            </span>
                        </label>
                        <input
                            type="number"
                            value={duration}
                            onChange={(e) => {
                                const value = Math.max(15, Math.ceil(Number(e.target.value) / 15) * 15);
                                setDuration(value.toString());
                            }}
                            className="border p-2 rounded w-full"
                            min="15"
                            step="15"
                        />
                    </div>
                </div>

                {/* Timezone Select */}
                <div className="mb-4">
                    <label className="block text-lg font-medium">Select Timezone:</label>
                    <TimezoneSelect
                        value={timezone}
                        onChange={(selected) => setTimezone(selected)}
                        className="w-full"
                    />
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    className={`bg-blue-500 text-white px-6 py-2 rounded w-full mt-4 ${
                        loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
                    }`}
                    disabled={loading}
                >
                    {loading ? "Submitting..." : "Submit Planning"}
                </button>
            </main>
        </div>
    );
};

export default Planning;
