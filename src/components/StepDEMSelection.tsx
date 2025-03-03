import React, {useState, useEffect} from "react";
import {fetchAvailableDems} from "../utils/apiService";

interface StepDEMSelectionProps {
    formData: any;
    setFormData: (data: any) => void;
    nextStep: () => void;
    prevStep: () => void;
}

const StepDEMSelection: React.FC<StepDEMSelectionProps> = ({formData, setFormData, nextStep, prevStep}) => {
    const [loading, setLoading] = useState(true);
    const [dems, setDems] = useState<{ description: string; type: string; resolution: number }[]>([]);
    const [recommendedDEM, setRecommendedDEM] = useState<{
        description: string;
        type: string;
        resolution: number
    } | null>(null);
    const [selectedDEM, setSelectedDEM] = useState<string | null>(formData.selectedDEM || null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const {availableDems, recommendedDEM} = await fetchAvailableDems(formData.receivers);
                setDems(availableDems);
                setRecommendedDEM(recommendedDEM);

                if (recommendedDEM) {
                    setSelectedDEM(recommendedDEM.type);
                    setFormData((prev: any) => ({...prev, selectedDEM: recommendedDEM.type}));
                }
            } catch (error) {
                console.error("Failed to fetch DEMs:", error);
                alert("Failed to fetch DEMs. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        void fetchData();
    }, [formData.receivers]);


    const handleDEMSelection = (dem: string) => {
        setSelectedDEM(dem);
        setFormData((prev: any) => ({...prev, selectedDEM: dem}));
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Step 3: Select Available DEM</h2>

            {loading ? (
                <p>Loading available DEMs...</p>
            ) : (
                <div className="p-4 border rounded-md bg-gray-50">
                    <h3 className="text-lg font-semibold">Available DEMs</h3>

                    {/* Recommended DEM (if exists) */}
                    {recommendedDEM && (
                        <div className="p-3 border rounded-md bg-green-100 mb-4">
                            <p className="font-semibold text-green-800">Recommended DEM:</p>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="selectedDEM"
                                    value={recommendedDEM.type}
                                    checked={selectedDEM === recommendedDEM.type}
                                    onChange={() => handleDEMSelection(recommendedDEM.type)}
                                />
                                <span>{recommendedDEM.description} ({recommendedDEM.resolution}m resolution)</span>
                            </label>
                        </div>
                    )}

                    {/* List of Other Available DEMs */}
                    {dems.length > 0 ? (
                        dems.map((dem, index) => (
                            <label key={index} className="flex items-center space-x-2 p-2 border rounded-md">
                                <input
                                    type="radio"
                                    name="selectedDEM"
                                    value={dem.type}
                                    checked={selectedDEM === dem.type}
                                    onChange={() => handleDEMSelection(dem.type)}
                                />
                                <span>{dem.description} ({dem.resolution}m resolution)</span>
                            </label>
                        ))
                    ) : (
                        <p className="text-gray-500">No DEMs available for the selected receivers.</p>
                    )}
                </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-4">
                <button onClick={prevStep}
                        className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500 w-1/4 mx-1">
                    Back
                </button>
                <button
                    onClick={nextStep}
                    disabled={!selectedDEM}
                    className={`px-6 py-2 rounded w-3/4 mx-1 ${
                        selectedDEM ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-gray-400 cursor-not-allowed"
                    }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default StepDEMSelection;
