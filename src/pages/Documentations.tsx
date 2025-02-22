import {useState, useEffect} from "react";
import Sidebar from "../components/Sidebar";

const Documentations = () => {
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowBackToTop(true);
            } else {
                setShowBackToTop(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="flex h-screen w-screen bg-gray-50">
            <Sidebar/>

            <main className="flex-1 ml-64 p-6 bg-white shadow-md overflow-y-auto">
                <section className="mb-8">
                    <h2 className="text-3xl font-semibold mb-4">📖 Welcome to the Documentation</h2>
                    <p className="leading-relaxed">
                        This web application provides a user-friendly experience. Below, you'll find instructions
                        on how to use its features.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">🚀 Getting Started</h2>
                    <ol className="list-decimal pl-5 space-y-2">
                        <li>Sign up or log in to your account.</li>
                        <li>Use the sidebar to navigate different sections.</li>
                        <li>View important insights on the dashboard.</li>
                    </ol>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">✨ Features Overview</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Dashboard:</strong> A central hub for insights.</li>
                        <li><strong>Image Carousel:</strong> Browse dynamic content.</li>
                        <li><strong>Our Team:</strong> Meet the contributors.</li>
                        <li><strong>Documentations:</strong> Learn how to use the platform.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">🔧 Troubleshooting</h2>
                    <p>If you encounter issues, try the following steps:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Refresh the page.</li>
                        <li>Clear your browser cache.</li>
                        <li>Ensure your browser is updated.</li>
                        <li>Contact support if the issue persists.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">📞 Need More Help?</h2>
                    <p>For further assistance, reach out to our support team.</p>
                </section>

                {showBackToTop && (
                    <button
                        onClick={() => window.scrollTo({top: 0, behavior: "smooth"})}
                        className="fixed bottom-6 right-6 bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition"
                    >
                        ↑ Back to Top
                    </button>
                )}
            </main>
        </div>
    );
};

export default Documentations;
