import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {lazy, Suspense, useEffect} from "react";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Documentations = lazy(() => import("./pages/Documentations"));
const Planning = lazy(() => import("./pages/Planning"));
const NotFound = lazy(() => import("./pages/NotFound"));

const ScrollToTop = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return null;
};

const App = () => {
    return (
        <Router>
            <ScrollToTop/>
            <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                <Routes>
                    <Route path="/" element={<Dashboard/>}/>
                    <Route path="/documentations" element={<Documentations/>}/>
                    <Route path="/planning" element={<Planning/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </Suspense>
        </Router>
    );
};

export default App;
