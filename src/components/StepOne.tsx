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

interface TimezoneOption {
    value: string;
    label: string;
}

const StepOne: React.FC<StepOneProps> = ({formData, setFormData, nextStep}) => {
    const formatTimezone = (tz: string): TimezoneOption => ({
        value: tz,
        label: tz === 'UTC' ? 'UTC (Coordinated Universal Time)' : tz.replace(/_/g, ' ')
    });

    const timezones = React.useMemo(() => {
        try {
            if (typeof Intl.supportedValuesOf === 'function') {
                const supportedZones = Intl.supportedValuesOf('timeZone');
                return ['UTC', ...supportedZones.filter(tz => tz !== 'UTC')];
            }
        } catch (e) {
            console.warn("Intl.supportedValuesOf not supported in this browser");
        }

        return [
            'UTC',
            'America/New_York',
            'America/Chicago',
            'America/Denver',
            'America/Los_Angeles',
            'Europe/London',
            'Europe/Berlin',
            'Asia/Tokyo',
            'Australia/Sydney',
        ];
    }, []);

    const isValidTimezone = (tz: string): boolean => {
        return timezones.includes(tz);
    };

    const handleTimezoneChange = (tz: ITimezone) => {
        let timezoneValue: string;
        if (typeof tz === 'string') {
            timezoneValue = tz;
        } else {
            timezoneValue = tz.value;
        }

        const validatedTimezone = timezoneValue && isValidTimezone(timezoneValue)
            ? formatTimezone(timezoneValue)
            : formatTimezone("UTC");

        setFormData({
            ...formData,
            timezone: validatedTimezone
        });
    };

    const timezoneOptions = React.useMemo(() => {
        return Object.fromEntries(
            timezones.map(tz => [tz, formatTimezone(tz).label])
        );
    }, [timezones]);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Step 1: Select Planning Details</h2>

            <div>
                <label className="block text-lg font-medium">Select Date:</label>
                <DatePicker
                    selected={formData.date}
                    onChange={(date) => setFormData({...formData, date})}
                    className="border p-2 rounded w-full"
                    minDate={new Date()}
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
                    value={formData.timezone || formatTimezone("UTC")}
                    onChange={handleTimezoneChange}
                    className="w-full"
                    labelStyle="altName"
                    timezones={timezoneOptions}
                    isSearchable={true}
                />
                <p className="text-xs text-gray-500 mt-1">
                    Only IANA timezone names from the dropdown are accepted. Invalid entries will default to UTC.{" "}
                    <a
                        href="https://en.wikipedia.org/wiki/List_of_tz_database_time_zones"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                    >
                        View complete list of IANA timezones
                    </a>
                </p>
            </div>

            <button
                onClick={nextStep}
                className="bg-blue-500 text-white px-6 py-2 rounded w-full mt-4 hover:bg-blue-600"
                disabled={!formData.date || !formData.time}
            >
                Next
            </button>
        </div>
    );
};

export default StepOne;
