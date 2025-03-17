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

    // Categorize DEMs based on resolution
    const categorizedDems = {
        high: dems.filter(dem => dem.resolution <= 30),
        medium: dems.filter(dem => dem.resolution === 90),
        low: dems.filter(dem => dem.resolution >= 500)
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Step 3: Select Available DEM</h2>

            {loading ? (
                <p>Loading available DEMs...</p>
            ) : (
                <div className="p-4 border rounded-md bg-gray-50">
                    <h3 className="text-lg font-semibold">Available DEMs</h3>

                    {/* Accuracy Information */}
                    <p className="text-sm text-gray-600">
                        Higher resolution DEMs (≤30m) provide more accuracy but require more computation.
                        Lower resolution DEMs (≥500m) are faster but less detailed.
                    </p>

                    {/* Recommended DEM (if available) */}
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

                    {/* DEM Comparison Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300 mt-4">
                            <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 px-4 py-2">Select</th>
                                <th className="border border-gray-300 px-4 py-2">Description</th>
                                <th className="border border-gray-300 px-4 py-2">Resolution (m)</th>
                                <th className="border border-gray-300 px-4 py-2">Accuracy</th>
                                <th className="border border-gray-300 px-4 py-2">Resource Demand</th>
                            </tr>
                            </thead>
                            <tbody>
                            {/* Option to Continue Without DEM TODO */}
                            <tr className="bg-red-100">
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    <input
                                        type="radio"
                                        name="selectedDEM"
                                        value="no_dem"
                                        checked={selectedDEM === "no_dem"}
                                        disabled
                                    />
                                </td>
                                <td className="border border-gray-300 px-4 py-2">Continue without DEM</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">N/A</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">Lowest</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">Fastest</td>
                            </tr>

                            {Object.entries(categorizedDems).map(([category, list]) => (
                                <React.Fragment key={category}>
                                    {list.length > 0 && (
                                        <tr className="bg-gray-100">
                                            <td colSpan={5} className="text-center font-semibold py-2">
                                                {category === "high" && "High Accuracy (≤30m)"}
                                                {category === "medium" && "Medium Accuracy (90m)"}
                                                {category === "low" && "Low Accuracy (≥500m)"}
                                            </td>
                                        </tr>
                                    )}
                                    {list.map((dem, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="border border-gray-300 px-4 py-2 text-center">
                                                <input
                                                    type="radio"
                                                    name="selectedDEM"
                                                    value={dem.type}
                                                    checked={selectedDEM === dem.type}
                                                    onChange={() => handleDEMSelection(dem.type)}
                                                />
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">{dem.description}</td>
                                            <td className="border border-gray-300 px-4 py-2 text-center">{dem.resolution}</td>
                                            <td className="border border-gray-300 px-4 py-2 text-center">
                                                {category === "high" ? "High" : category === "medium" ? "Medium" : "Low"}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2 text-center">
                                                {category === "high" ? "High" : category === "medium" ? "Medium" : "Low"}
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                            </tbody>
                        </table>
                    </div>
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
