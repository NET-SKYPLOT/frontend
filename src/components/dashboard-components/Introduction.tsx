const Introduction = () => {
    return (
        <section className="mt-6 px-4 md:px-8 text-gray-700">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-center sm:text-left">
                Introduction
            </h2>
            <p className="leading-relaxed text-lg sm:text-base text-center sm:text-left">
                Welcome to <strong>Net-SkyPlot</strong>, a powerful web-based GNSS (Global Navigation Satellite System)
                planning and visualization platform. Net-SkyPlot enables users to configure and simulate GNSS-based
                receiver deployments,
                visualize satellite coverage, and analyze positioning accuracy using Dilution of Precision (DOP),
                SkyPlot, and
                Satellite Visibility metrics.
            </p>
            <p className="mt-4 leading-relaxed text-lg sm:text-base text-center sm:text-left">
                With a structured step-by-step workflow, users can define receiver locations, select GNSS constellations
                (GPS, Galileo, BeiDou, GLONASS), integrate terrain and obstacles affecting satellite visibility, and
                choose the
                most suitable Digital Elevation Model (DEM) for terrain-aware GNSS planning. After processing the data
                via a backend API,
                the system provides interactive visualizations of key GNSS parameters, making it an essential tool for
                surveying, mapping, autonomous navigation, and scientific research.
            </p>

            <h3 className="text-xl font-semibold mt-6">Key Features</h3>
            <ul className="list-disc list-inside mt-2 text-lg sm:text-base">
                <li><strong>Step-by-Step Planning Wizard:</strong> Seamless workflow for defining date, time, duration,
                    and location for GNSS planning.
                </li>
                <li><strong>Multi-Constellation Support:</strong> GPS, Galileo, BeiDou, GLONASS for enhanced accuracy.
                </li>
                <li><strong>Data Processing and API Integration:</strong> Backend API for GNSS simulations and DEM
                    selection.
                </li>
                <li><strong>Real-Time Data Visualization:</strong> DOP analysis, SkyPlot, and Satellite Visibility
                    charts.
                </li>
                <li><strong>Interactive UI:</strong> Built with React.js and Tailwind CSS for a seamless experience.
                </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6">Use Cases</h3>
            <ul className="list-disc list-inside mt-2 text-lg sm:text-base">
                <li><strong>Surveying & Mapping:</strong> Optimize GNSS receiver placement for high-accuracy
                    positioning.
                </li>
                <li><strong>Autonomous Vehicles & Drones:</strong> Ensure optimal satellite visibility for navigation.
                </li>
                <li><strong>Scientific Research & Academia:</strong> Study GNSS signal behavior and satellite coverage.
                </li>
                <li><strong>Infrastructure & Construction:</strong> Plan GNSS-based monitoring for structural
                    positioning.
                </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6">Technology Stack</h3>
            <ul className="list-disc list-inside mt-2 text-lg sm:text-base">
                <li><strong>Frontend:</strong> React.js, TypeScript, Tailwind CSS, Bootstrap</li>
                <li><strong>Data Visualization:</strong> Chart.js, Plotly.js</li>
                <li><strong>Backend:</strong> Python, Flask</li>
                <li><strong>Infrastructure & Deployment:</strong> DigitalOcean, Docker, GitHub Actions</li>
                <li><strong>State Management:</strong> React Hooks (useState, useEffect, useRef)</li>
                <li><strong>Routing:</strong> React Router</li>
                <li><strong>Geospatial & Mapping:</strong> Leaflet.js</li>
                <li><strong>Version Control:</strong> GitHub</li>
            </ul>

            <p className="mt-6 leading-relaxed text-lg sm:text-base text-center sm:text-left">
                🚀 <strong>Net-SkyPlot</strong> is the go-to GNSS planning and visualization platform for professionals,
                researchers, and engineers who require accurate, real-time satellite visibility analysis for
                various geospatial applications.
            </p>
        </section>
    );
};

export default Introduction;
