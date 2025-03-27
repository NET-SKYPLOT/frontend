import {useEffect, useState} from "react";

const PrivacyBanner = () => {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const hasAccepted = localStorage.getItem("privacy_notice_accepted");
        if (!hasAccepted) setShowBanner(true);
    }, []);

    const handleAccept = () => {
        localStorage.setItem("privacy_notice_accepted", "true");
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
