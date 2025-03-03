import * as React from "react";
import {useState} from "react";
import {generateUniqueId} from "../utils/idGenerator";
import ReceiverList from "./ReceiverList";

interface Receiver {
    id: string;
    role: "base" | "rover";
    lat: number;
    lon: number;
}

interface StepTwoProps {
    formData: { receivers: Receiver[] };
    setFormData: (data: any) => void;
    nextStep: () => void;
    prevStep: () => void;
}

const StepTwo: React.FC<StepTwoProps> = ({formData, setFormData, nextStep, prevStep}) => {
    const [appType, setAppType] = useState<"single" | "multiple">(formData.receivers.length > 1 ? "multiple" : "single");

    const initializeReceivers = (type: "single" | "multiple") => {
        if (type === "single") {
            setFormData({
                ...formData,
                receivers: [
                    {
                        id: generateUniqueId(),
                        role: "base",
                        lat: 45.0703,
                        lon: 7.6869,
                    },
                ],
            });
        } else {
            setFormData({
                ...formData,
                receivers: [
                    {
                        id: generateUniqueId(),
                        role: "base",
                        lat: 45.0703,
                        lon: 7.6869,
                    },
                    {
                        id: generateUniqueId(),
                        role: "rover",
                        lat: 45.0703,
                        lon: 7.6869,
                    },
                ],
            });
        }
    };

    const addReceiver = () => {
        if (appType === "multiple" && formData.receivers.length < 3) {
            setFormData({
                ...formData,
                receivers: [
                    ...formData.receivers,
                    {
                        id: generateUniqueId(),
                        role: "rover",
                        lat: 45.0703,
                        lon: 7.6869,
                    },
                ],
            });
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Step 2: Define Receivers</h2>

            <div className="flex gap-6">
                <label className="flex items-center space-x-2">
                    <input
                        type="radio"
                        value="single"
                        checked={appType === "single"}
                        onChange={() => {
                            setAppType("single");
                            initializeReceivers("single");
                        }}
                    />
                    <span>Single Receiver Application</span>
                </label>

                <label className="flex items-center space-x-2">
                    <input
                        type="radio"
                        value="multiple"
                        checked={appType === "multiple"}
                        onChange={() => {
                            setAppType("multiple");
                            initializeReceivers("multiple");
                        }}
                    />
                    <span>Multiple Receivers Application</span>
                </label>
            </div>

            <ReceiverList formData={formData} setFormData={setFormData}/>

            {appType === "multiple" && formData.receivers.length < 3 && (
                <button
                    onClick={addReceiver}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
                >
                    + Add New Rover
                </button>
            )}

            <div className="flex justify-between mt-4">
                <button onClick={prevStep} className="bg-gray-400 text-white px-6 py-2 rounded w-1/4 mx-1">
                    Back
                </button>
                <button onClick={nextStep} className="bg-blue-500 text-white px-6 py-2 rounded w-3/4 mx-1">
                    Next
                </button>
            </div>
        </div>
    );
};

export default StepTwo;
