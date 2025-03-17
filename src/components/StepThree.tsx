import React from "react";

interface StepThreeProps {
    formData: any;
    setFormData: (data: any) => void;
    nextStep: () => void;
    prevStep: () => void;
}

const StepThree: React.FC<StepThreeProps> = ({formData, setFormData, nextStep, prevStep}) => {
    const constellations = ["BEIDOU", "GPS", "GALILEO", "GLONASS"];

    const handleCheckboxChange = (constellation: string) => {
        setFormData((prevData: any) => {
            const selected = prevData.constellations.includes(constellation)
                ? prevData.constellations.filter((c: string) => c !== constellation)
                : [...prevData.constellations, constellation];

            return {...prevData, constellations: selected};
        });
    };

    const handleSelectAll = () => {
        setFormData((prevData: any) => ({
            ...prevData,
            constellations: prevData.constellations.length === constellations.length ? [] : [...constellations],
        }));
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Step 3: Select Constellations</h2>

            <p>Select the GNSS constellations you want to use for planning:</p>

            {/* Select All Button */}
            <button
                onClick={handleSelectAll}
                className="mb-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
                {formData.constellations.length === constellations.length ? "Deselect All" : "Select All"}
            </button>

            {/* Constellation Selection */}
            <div className="grid grid-cols-2 gap-4">
                {constellations.map((constellation) => (
                    <label key={constellation} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={formData.constellations.includes(constellation)}
                            onChange={() => handleCheckboxChange(constellation)}
                        />
                        <span>{constellation}</span>
                    </label>
                ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-4">
                <button onClick={prevStep} className="bg-gray-400 text-white px-6 py-2 rounded w-1/4 mx-1">
                    Back
                </button>
                <button
                    onClick={nextStep}
                    disabled={formData.constellations.length === 0} // ✅ Prevents proceeding if no selection
                    className={`px-6 py-2 rounded w-3/4 mx-1 ${
                        formData.constellations.length > 0
                            ? "bg-blue-500 hover:bg-blue-600 text-white"
                            : "bg-gray-400 cursor-not-allowed"
                    }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default StepThree;
