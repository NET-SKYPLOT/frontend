import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimezoneSelect, {ITimezone} from "react-timezone-select";
import * as React from "react";

declare global {
    namespace Intl {
        function supportedValuesOf(key: "timeZone"): string[];
    }
}

interface StepOneProps {
    formData: any;
    setFormData: (data: any) => void;
    nextStep: () => void;
}

const StepOne: React.FC<StepOneProps> = ({formData, setFormData, nextStep}) => {
    const isValidTimezone = (tz: string): boolean => {
        // Check for valid IANA timezone
        try {
            if (Intl.supportedValuesOf && Intl.supportedValuesOf('timeZone').includes(tz)) {
                return true;
            }
        } catch (e) {
            console.warn("Couldn't verify IANA timezone");
        }

        // Check for UTC offset format (±HH:MM or ±HHMM or ±HH)
        const offsetRegex = /^[+-]([0-1]?[0-9]|2[0-3]):?([0-5][0-9])?$/;
        if (offsetRegex.test(tz)) {
            return true;
        }

        // Check for special values
        return tz === "UTC" || tz === "GMT" || tz === "Z";
    };

    const handleTimezoneChange = (tz: ITimezone) => {
        // Extract the raw timezone string
        const timezoneValue = typeof tz === "string" ? tz : tz.value;

        // Validate the timezone or default to UTC
        const validatedTimezone = timezoneValue && isValidTimezone(timezoneValue)
            ? timezoneValue
            : "UTC";

        setFormData({
            ...formData,
            timezone: validatedTimezone
        });
    };

    // Get supported timezones with proper typing and fallback
    const getTimezones = () => {
        try {
            if (typeof Intl.supportedValuesOf === 'function') {
                return Object.fromEntries(
                    Intl.supportedValuesOf('timeZone').map((tz: string) => [tz, tz])
                );
            }
        } catch (e) {
            console.warn("Intl.supportedValuesOf not supported in this browser");
        }

        // Fallback timezones
        return {
            'UTC': 'UTC',
            'America/New_York': 'America/New_York',
            'America/Chicago': 'America/Chicago',
            'America/Denver': 'America/Denver',
            'America/Los_Angeles': 'America/Los_Angeles',
            'Europe/London': 'Europe/London',
            'Europe/Berlin': 'Europe/Berlin',
            'Asia/Tokyo': 'Asia/Tokyo',
            'Australia/Sydney': 'Australia/Sydney',
        };
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Step 1: Select Planning Details</h2>

            <div>
                <label className="block text-lg font-medium">Select Date:</label>
                <DatePicker
                    selected={formData.date}
                    onChange={(date) => setFormData({...formData, date})}
                    className="border p-2 rounded w-full"
                />
            </div>

            <div>
                <label className="block text-lg font-medium">Select Time:</label>
                <DatePicker
                    selected={formData.time}
                    onChange={(time) => setFormData({...formData, time})}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={60}
                    timeCaption="Time"
                    dateFormat="HH:mm"
                    className="border p-2 rounded w-full"
                />
            </div>

            <div>
                <label className="block text-lg font-medium">
                    Duration (minutes){" "}
                    <span className="text-gray-500">
            ({(Number(formData.duration) / 60).toFixed(2)} hrs)
          </span>
                </label>
                <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            duration: Math.max(60, Math.ceil(Number(e.target.value) / 60) * 60),
                        })
                    }
                    className="border p-2 rounded w-full"
                    min="60"
                    step="60"
                />
            </div>

            <div>
                <label className="block text-lg font-medium">Select Timezone:</label>
                <TimezoneSelect
                    value={formData.timezone || "UTC"}
                    onChange={handleTimezoneChange}
                    className="w-full"
                    labelStyle="altName"
                    timezones={{
                        ...getTimezones(),
                        "UTC": "UTC",
                        "GMT": "GMT",
                        "Z": "Z",
                    }}
                />
                <p className="text-xs text-gray-500 mt-1">
                    Accepts: IANA names (e.g., <code>America/New_York</code>) or UTC offsets (e.g., <code>-05:00</code>).
                    Invalid entries will default to UTC.
                </p>
            </div>

            <button
                onClick={nextStep}
                className="bg-blue-500 text-white px-6 py-2 rounded w-full mt-4 hover:bg-blue-600"
            >
                Next
            </button>
        </div>
    );
};

export default StepOne;
