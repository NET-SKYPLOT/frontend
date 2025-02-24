import * as React from "react";

interface StepTwoProps {
    formData: any;
    setFormData: (data: any) => void;
    nextStep: () => void;
    prevStep: () => void;
}

const StepTwo: React.FC<StepTwoProps> = ({formData, setFormData, nextStep, prevStep}) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Step 2: Number of Locations</h2>

            <label className="block text-lg font-medium">How many locations are involved in your planning?</label>
            <input
                type="number"
                value={formData.numLocations}
                onChange={(e) => setFormData({
                    ...formData,
                    numLocations: Math.min(5, Math.max(1, Number(e.target.value)))
                })}
                className="border p-2 rounded w-full"
                min="1"
                max="5"
            />

            <div className="flex justify-between mt-4">
                <button onClick={prevStep} className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500">
                    Back
                </button>
                <button onClick={nextStep} className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
                    Next
                </button>
            </div>
        </div>
    );
};

export default StepTwo;
