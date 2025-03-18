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
    const [dems, setDems] = useState<{ description: string; type: string; resolution: number; source: string }[]>([]);
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

                setFormData((prev: any) => ({
                    ...prev,
                    availableDems,
                    selectedDEM: recommendedDEM ? recommendedDEM.type : prev.selectedDEM,
                }));

                if (recommendedDEM) {
                    setSelectedDEM(recommendedDEM.type);
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

    // Categorize DEMs based on resolution, including new category for very high accuracy (≤10m)
    const categorizedDems = {
        veryHigh: dems.filter(dem => dem.resolution <= 10),
        high: dems.filter(dem => dem.resolution > 10 && dem.resolution <= 30),
        medium: dems.filter(dem => dem.resolution > 30 && dem.resolution <= 90),
        low: dems.filter(dem => dem.resolution > 90 && dem.resolution <= 500),
        veryLow: dems.filter(dem => dem.resolution > 500)
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
                        Very high accuracy DEMs (≤10m) are extremely detailed but very resource-intensive.
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
                                <th className="border border-gray-300 px-4 py-2">Source</th>
                            </tr>
                            </thead>
                            <tbody>
                            {/* Option to Continue Without DEM (Now Enabled) */}
                            <tr className="bg-red-100">
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    <input
                                        type="radio"
                                        name="selectedDEM"
                                        value="no_dem"
                                        checked={selectedDEM === "no_dem"}
                                        onChange={() => handleDEMSelection("no_dem")}
                                    />
                                </td>
                                <td className="border border-gray-300 px-4 py-2">Continue without DEM</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">N/A</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">Lowest</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">Fastest</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">N/A</td>
                            </tr>

                            {/* Very High Accuracy DEMs */}
                            {categorizedDems.veryHigh.length > 0 && (
                                <tr className="bg-gray-100">
                                    <td colSpan={6} className="text-center font-semibold py-2">
                                        Very High Accuracy
                                    </td>
                                </tr>
                            )}
                            {categorizedDems.veryHigh.map((dem, index) => (
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
                                    <td className="border border-gray-300 px-4 py-2 text-center">Very High</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">Very High</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">{dem.source}</td>
                                </tr>
                            ))}

                            {/* High Accuracy DEMs */}
                            {categorizedDems.high.length > 0 && (
                                <tr className="bg-gray-100">
                                    <td colSpan={6} className="text-center font-semibold py-2">
                                        High Accuracy
                                    </td>
                                </tr>
                            )}
                            {categorizedDems.high.map((dem, index) => (
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
                                    <td className="border border-gray-300 px-4 py-2 text-center">High</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">High</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">{dem.source}</td>
                                </tr>
                            ))}

                            {/* Medium Accuracy DEMs */}
                            {categorizedDems.medium.length > 0 && (
                                <tr className="bg-gray-100">
                                    <td colSpan={6} className="text-center font-semibold py-2">
                                        Medium Accuracy
                                    </td>
                                </tr>
                            )}
                            {categorizedDems.medium.map((dem, index) => (
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
                                    <td className="border border-gray-300 px-4 py-2 text-center">Medium</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">Medium</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">{dem.source}</td>
                                </tr>
                            ))}

                            {/* Low Accuracy DEMs */}
                            {categorizedDems.low.length > 0 && (
                                <tr className="bg-gray-100">
                                    <td colSpan={6} className="text-center font-semibold py-2">
                                        Low Accuracy
                                    </td>
                                </tr>
                            )}
                            {categorizedDems.low.map((dem, index) => (
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
                                    <td className="border border-gray-300 px-4 py-2 text-center">Low</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">Low</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">{dem.source}</td>
                                </tr>
                            ))}

                            {/* Very low Accuracy DEMs */}
                            {categorizedDems.veryLow.length > 0 && (
                                <tr className="bg-gray-100">
                                    <td colSpan={6} className="text-center font-semibold py-2">
                                        Very Low Accuracy
                                    </td>
                                </tr>
                            )}
                            {categorizedDems.veryLow.map((dem, index) => (
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
                                    <td className="border border-gray-300 px-4 py-2 text-center">Very Low</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">Very Low</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">{dem.source}</td>
                                </tr>
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
