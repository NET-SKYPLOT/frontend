import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Documentations from "./pages/Documentations";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard/>}/>
                <Route path="/documentations" element={<Documentations/>}/>
            </Routes>
        </Router>
    );
};

export default App;
