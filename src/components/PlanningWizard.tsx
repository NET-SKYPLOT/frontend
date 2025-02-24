import {useState} from "react";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepLocation from "./StepLocation";
import SummaryStep from "./SummaryStep";
import axios from "axios";
import "./PlanningWizard.css";

const PlanningWizard = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        date: new Date(),
        time: new Date(),
        duration: "15",
        timezone: {value: "UTC", label: "UTC"}, // ✅ Default to UTC
        numLocations: 1,
        locations: [{lat: 45.0703, lon: 7.6869}],
    });

    const nextStep = () => {
        setStep((prev) => prev + 1);
    };

    const prevStep = () => {
        if (step > 1) {
            setStep((prev) => prev - 1);
        }
    };

    const startOver = () => {
        setFormData({
            date: new Date(),
            time: new Date(),
            duration: "15",
            timezone: {value: "UTC", label: "UTC"},
            numLocations: 1,
            locations: [{lat: 45.0703, lon: 7.6869}],
        });
        setStep(1);
    };

    const handleSubmit = async () => {
        const data = {
            date: formData.date,
            time: formData.time,
            duration: formData.duration,
            timezone: formData.timezone?.value || "UTC",
            locations: formData.locations,
        };

        console.log("Submitting data:", data);

        try {
            await axios.post("#", data);
            alert("Planning data submitted successfully!");
            startOver();
        } catch (error) {
            console.error("Error submitting data:", error);
            alert("An error occurred while submitting your data.");
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-md relative">
            <TransitionGroup>
                <CSSTransition key={step} timeout={300} classNames="fade">
                    <div className="relative">
                        {/* Step 1: Date, Time, Duration, Timezone */}
                        {step === 1 && <StepOne formData={formData} setFormData={setFormData} nextStep={nextStep}/>}

                        {/* Step 2: Number of Locations */}
                        {step === 2 && <StepTwo formData={formData} setFormData={setFormData} nextStep={nextStep}
                                                prevStep={prevStep}/>}

                        {/* Dynamic Steps for Location Selection */}
                        {step > 2 && step <= 2 + formData.numLocations && (
                            <StepLocation
                                formData={formData}
                                setFormData={setFormData}
                                nextStep={nextStep}
                                prevStep={prevStep}
                                stepIndex={step - 3}
                            />
                        )}

                        {/* Final Step: Summary and Submission */}
                        {step === 3 + formData.numLocations && (
                            <SummaryStep formData={formData} prevStep={prevStep} handleSubmit={handleSubmit}/>
                        )}
                    </div>
                </CSSTransition>
            </TransitionGroup>

            <div className="mt-6 flex justify-center">
                <button
                    onClick={startOver}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-all"
                >
                    Start Over
                </button>
            </div>
        </div>
    );
};

export default PlanningWizard;
