import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Documentations from "./pages/Documentations";
import Planning from "./pages/Planning";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard/>}/>
                <Route path="/documentations" element={<Documentations/>}/>
                <Route path="/planning" element={<Planning/>}/>
            </Routes>
        </Router>
    );
};

export default App;
