const Features = () => {
    return (
        <section className="mt-6 px-4 md:px-8 text-gray-700">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-center sm:text-left">
                Platform Features
            </h2>
            <ul className="list-disc pl-5 space-y-4 text-lg sm:text-base">
                <li>
                    <strong>Step-by-Step Planning Wizard:</strong> Seamless workflow for defining date, time, duration,
                    and location for GNSS planning.
                </li>
                <li>
                    <strong>Supports Multi-Receiver Configurations:</strong> Base and rover setups for differential GNSS
                    applications.
                </li>
                <li>
                    <strong>Obstacle and Terrain Integration:</strong> Users can define obstacles affecting satellite
                    signals and choose the best Digital Elevation Model (DEM).
                </li>
                <li>
                    <strong>Multi-Constellation GNSS Support:</strong> GPS, Galileo, BeiDou, and GLONASS for improved
                    accuracy.
                </li>
                <li>
                    <strong>Backend API for GNSS Simulations:</strong> Processes planning requests and fetches DEMs
                    dynamically.
                </li>
                <li>
                    <strong>Real-Time Data Visualization:</strong> DOP analysis, SkyPlot, and Satellite Visibility
                    plots.
                </li>
                <li>
                    <strong>Interactive and Responsive UI:</strong> Built with React.js and Tailwind CSS for a seamless
                    user experience.
                </li>
            </ul>
        </section>
    );
};

export default Features;
