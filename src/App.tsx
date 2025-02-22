import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {lazy, Suspense, useEffect} from "react";

// Lazy load pages for performance optimization
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Documentations = lazy(() => import("./pages/Documentations"));
const Planning = lazy(() => import("./pages/Planning"));

const NotFound = () => (
    <div className="flex flex-col items-center justify-center h-screen text-gray-700">
        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
        <p className="mt-2 text-lg">The page you're looking for doesn't exist.</p>
        <a href="/" className="mt-4 text-blue-500 hover:underline">Go Back Home</a>
    </div>
);

const ScrollToTop = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return null;
};

const App = () => {
    return (
        <Router>
            <ScrollToTop/> {/* Ensures scrolling resets when changing pages */}
            <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                <Routes>
                    <Route path="/" element={<Dashboard/>}/>
                    <Route path="/documentations" element={<Documentations/>}/>
                    <Route path="/planning" element={<Planning/>}/>
                    <Route path="*" element={<NotFound/>}/> {/* Handles 404 errors */}
                </Routes>
            </Suspense>
        </Router>
    );
};

export default App;
