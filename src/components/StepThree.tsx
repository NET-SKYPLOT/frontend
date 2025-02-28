import React from "react";

interface StepThreeProps {
    formData: any;
    setFormData: (data: any) => void;
    nextStep: () => void;
    prevStep: () => void;
}

const StepThree: React.FC<StepThreeProps> = ({formData, setFormData, nextStep, prevStep}) => {
    const constellations = ["BeiDou", "GPS", "Galileo", "GLONASS"];

    const handleCheckboxChange = (constellation: string) => {
        setFormData((prevData: any) => {
            const selected = prevData.constellations.includes(constellation)
                ? prevData.constellations.filter((c: string) => c !== constellation)
                : [...prevData.constellations, constellation];

            return {...prevData, constellations: selected};
        });
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Step 3: Select Constellations</h2>

            <p>Select the GNSS constellations you want to use for planning:</p>

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
                <button onClick={prevStep} className="bg-gray-400 text-white px-6 py-2 rounded">
                    Back
                </button>
                <button onClick={nextStep} className="bg-blue-500 text-white px-6 py-2 rounded">
                    Next
                </button>
            </div>
        </div>
    );
};

export default StepThree;
