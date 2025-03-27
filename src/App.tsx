import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {lazy, Suspense, useEffect} from "react";
import PrivacyBanner from "./components/PrivacyBanner";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Documentations = lazy(() => import("./pages/Documentations"));
const Planning = lazy(() => import("./pages/Planning"));
const ResultPage = lazy(() => import("./pages/ResultPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));

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
                    <Route path="/result" element={<ResultPage/>}/>
                    <Route path="*" element={<NotFound/>}/>
                    <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
                </Routes>
            </Suspense>
            <PrivacyBanner/>
        </Router>
    );
};

export default App;
