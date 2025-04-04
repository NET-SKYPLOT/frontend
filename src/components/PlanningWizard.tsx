import {useState, useRef, useEffect} from "react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepDEMSelection from "./StepDEMSelection";
import SummaryStep from "./SummaryStep";
import ReceiverSetupModal from "./ReceiverSetupModal";
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
        constellations: [],
        cutoffAngle: 0,
        selectedDEM: null,
    });

    const [selectedReceiver, setSelectedReceiver] = useState<Receiver | null>(null);
    const nodeRef = useRef(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const scrollToTop = () => {
        if (containerRef.current) {
            containerRef.current.scrollTo({top: 0, behavior: 'smooth'});
        } else {
            window.scrollTo({top: 0, behavior: 'smooth'});
        }
    };

    const nextStep = () => {
        setStep((prev) => prev + 1);
        scrollToTop();
    };

    const prevStep = () => {
        setStep((prev) => prev - 1);
        scrollToTop();
    };

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
                    lat: 45.06721069132743,
                    lon: 7.656497777193932,
                    height: 0,
                } as Receiver,
            ],
            constellations: [],
            cutoffAngle: 0,
            selectedDEM: null,
        });
        setStep(1);
        scrollToTop();
    };

    useEffect(() => {
        scrollToTop();
    }, []);

    return (
        <div className="w-full max-w-3xl mx-auto bg-white p-6 shadow-lg rounded-md relative" ref={containerRef}>
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
                        {step === 5 && <SummaryStep formData={formData} prevStep={prevStep}/>}
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
