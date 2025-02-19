import Sidebar from "../components/Sidebar";

const Documentations = () => {
    return (
        <div className="flex h-screen w-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar/>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8 text-gray-700">
                {/* Introduction */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">Welcome to the Documentation</h2>
                    <p>
                        This web application provides a user-friendly experience. Below, you'll find instructions
                        on how to use its features.
                    </p>
                </section>

                {/* Getting Started */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">Getting Started</h2>
                    <ol className="list-decimal pl-5 space-y-2">
                        <li>Sign up or log in to your account.</li>
                        <li>Use the sidebar to navigate different sections.</li>
                        <li>View important insights on the dashboard.</li>
                    </ol>
                </section>

                {/* Features */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">Features Overview</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Dashboard:</strong> A central hub for insights.</li>
                        <li><strong>Image Carousel:</strong> Browse dynamic content.</li>
                        <li><strong>Our Team:</strong> Meet the contributors.</li>
                        <li><strong>Documentations:</strong> Learn how to use the platform.</li>
                    </ul>
                </section>

                {/* Troubleshooting */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">Troubleshooting</h2>
                    <p>If you encounter issues, try the following steps:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Refresh the page.</li>
                        <li>Clear your browser cache.</li>
                        <li>Ensure your browser is updated.</li>
                        <li>Contact support if the issue persists.</li>
                    </ul>
                </section>

                {/* Contact Support */}
                <section>
                    <h2 className="text-2xl font-semibold mb-2">Need More Help?</h2>
                    <p>For further assistance, reach out to our support team.</p>
                </section>
            </main>
        </div>
    );
};

export default Documentations;
