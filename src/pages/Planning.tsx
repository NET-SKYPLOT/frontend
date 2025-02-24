import Sidebar from "../components/Sidebar";
import PlanningWizard from "../components/PlanningWizard";

const Planning = () => {
    return (
        <div className="flex h-screen w-screen bg-gray-50">
            <Sidebar/>
            <main className="flex-1 p-8 bg-white shadow-md overflow-y-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Planning Wizard</h1>
                <PlanningWizard/>
            </main>
        </div>
    );
};

export default Planning;
