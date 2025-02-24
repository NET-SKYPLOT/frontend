import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimezoneSelect from "react-timezone-select";
import * as React from "react";

interface StepOneProps {
    formData: any;
    setFormData: (data: any) => void;
    nextStep: () => void;
}

const StepOne: React.FC<StepOneProps> = ({formData, setFormData, nextStep}) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Step 1: Select Planning Details</h2>

            {/* Date Input */}
            <div>
                <label className="block text-lg font-medium">Select Date:</label>
                <DatePicker
                    selected={formData.date}
                    onChange={(date) => setFormData({...formData, date})}
                    className="border p-2 rounded w-full"
                />
            </div>

            {/* Time Input */}
            <div>
                <label className="block text-lg font-medium">Select Time:</label>
                <DatePicker
                    selected={formData.time}
                    onChange={(time) => setFormData({...formData, time})}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="HH:mm"
                    className="border p-2 rounded w-full"
                />
            </div>

            {/* Duration Input */}
            <div>
                <label className="block text-lg font-medium">
                    Duration (minutes) <span
                    className="text-gray-500">({(Number(formData.duration) / 60).toFixed(2)} hrs)</span>
                </label>
                <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({
                        ...formData,
                        duration: Math.max(15, Math.ceil(Number(e.target.value) / 15) * 15)
                    })}
                    className="border p-2 rounded w-full"
                    min="15"
                    step="15"
                />
            </div>

            {/* Timezone Select */}
            <div>
                <label className="block text-lg font-medium">Select Timezone:</label>
                <TimezoneSelect
                    value={formData.timezone || {
                        value: "UTC",
                        label: "Coordinated Universal Time (UTC)"
                    }}
                    onChange={(timezone) => setFormData({...formData, timezone})}
                    className="w-full"
                />
            </div>

            <button onClick={nextStep}
                    className="bg-blue-500 text-white px-6 py-2 rounded w-full mt-4 hover:bg-blue-600">
                Next
            </button>
        </div>
    );
};

export default StepOne;
