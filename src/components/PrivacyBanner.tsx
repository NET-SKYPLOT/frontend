import {useEffect, useState} from "react";

const EXPIRY_DAYS = 7;
const MILLISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000;

const PrivacyBanner = () => {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("privacy_notice_accepted");

        if (!stored) {
            setShowBanner(true);
        } else {
            try {
                const parsed = JSON.parse(stored);
                const acceptedAt = parsed.timestamp;
                const now = Date.now();

                if (now - acceptedAt > EXPIRY_DAYS * MILLISECONDS_IN_A_DAY) {
                    setShowBanner(true);
                }
            } catch {
                setShowBanner(true);
            }
        }
    }, []);

    const handleAccept = () => {
        const data = {
            timestamp: Date.now(),
        };
        localStorage.setItem("privacy_notice_accepted", JSON.stringify(data));
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div
            className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-lg z-50 flex items-center justify-between text-sm">
            <p className="text-gray-800">
                This website does not collect personal data. We temporarily store your planning results (for 15 minutes)
                on your device to improve your experience. No data is shared or transmitted.{" "}
                <a
                    href="/privacy-policy"
                    className="text-blue-600 underline hover:text-blue-800"
                >
                    Learn more
                </a>
            </p>
            <button
                onClick={handleAccept}
                className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Got it
            </button>
        </div>
    );
};

export default PrivacyBanner;
