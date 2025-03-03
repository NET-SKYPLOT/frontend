import {useState, useRef} from "react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree"; // GNSS selection step
import StepDEMSelection from "./StepDEMSelection"; // New step for DEM selection
import SummaryStep from "./SummaryStep";
import ReceiverSetupModal from "./ReceiverSetupModal";
import axios from "axios";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {generateUniqueId} from "../utils/idGenerator";
import "../assets/PlanningWizard.css";

interface Receiver {
    id: string;
    role: "base" | "rover";
    lat: number;
    lon: number;
    height?: number;
}

const PlanningWizard = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        date: new Date(),
        time: new Date(),
        duration: "60",
        timezone: {value: "UTC", label: "UTC"},
        receivers: [
            {
                id: generateUniqueId(),
                role: "base",
                lat: 45.0703,
                lon: 7.6869,
                height: 0,
            } as Receiver,
        ],
        constellations: [], // ✅ GNSS constellation selection
        selectedDEM: null,  // ✅ New field for DEM selection
    });

    const [selectedReceiver, setSelectedReceiver] = useState<Receiver | null>(null);

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    const startOver = () => {
        setFormData({
            date: new Date(),
            time: new Date(),
            duration: "60",
            timezone: {value: "UTC", label: "UTC"},
            receivers: [
                {
                    id: generateUniqueId(),
                    role: "base",
                    lat: 45.0703,
                    lon: 7.6869,
                    height: 0,
                } as Receiver,
            ],
            constellations: [], // ✅ Reset GNSS selections
            selectedDEM: null,  // ✅ Reset DEM selection
        });
        setStep(1);
    };

    const handleSubmit = async () => {
        console.log("Submitting data:", formData);

        try {
            await axios.post("#", formData);
            alert("Planning data submitted successfully!");
            startOver();
        } catch (error) {
            console.error("Error submitting data:", error);
            alert("An error occurred while submitting your data.");
        }
    };

    const nodeRef = useRef(null);

    return (
        <div className="w-full max-w-3xl mx-auto bg-white p-6 shadow-lg rounded-md relative">
            <TransitionGroup>
                <CSSTransition key={step} timeout={300} classNames="fade" nodeRef={nodeRef}>
                    <div ref={nodeRef}>
                        {step === 1 && <StepOne formData={formData} setFormData={setFormData} nextStep={nextStep}/>}
                        {step === 2 && <StepTwo formData={formData} setFormData={setFormData} nextStep={nextStep}
                                                prevStep={prevStep}/>}
                        {step === 3 && <StepThree formData={formData} setFormData={setFormData} nextStep={nextStep}
                                                  prevStep={prevStep}/>}
                        {step === 4 &&
                            <StepDEMSelection formData={formData} setFormData={setFormData} nextStep={nextStep}
                                              prevStep={prevStep}/>}
                        {step === 5 &&
                            <SummaryStep formData={formData} prevStep={prevStep} handleSubmit={handleSubmit}/>}
                    </div>
                </CSSTransition>
            </TransitionGroup>

            <button
                onClick={startOver}
                className="bg-red-500 text-white px-4 py-2 rounded mt-4 w-full hover:bg-red-600"
            >
                Start Over
            </button>

            {selectedReceiver && (
                <ReceiverSetupModal
                    receiver={selectedReceiver}
                    setFormData={setFormData}
                    closeModal={() => setSelectedReceiver(null)}
                />
            )}
        </div>
    );
};

export default PlanningWizard;
