import * as React from "react";

interface SummaryStepProps {
    formData: any;
    prevStep: () => void;
    handleSubmit: () => void;
}

const SummaryStep: React.FC<SummaryStepProps> = ({formData, prevStep, handleSubmit}) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Final Step: Review & Submit</h2>

            {/* Application Type */}
            <div className="p-4 border rounded-md bg-gray-100">
                <p>
                    <strong>Application Type:</strong>{" "}
                    {formData.receivers.length > 1 ? "Multiple Receivers" : "Single Receiver"}
                </p>
            </div>

            {/* General Planning Information */}
            <div className="p-4 border rounded-md bg-gray-50">
                <p><strong>Date:</strong> {formData.date?.toLocaleDateString()}</p>
                <p><strong>Time:</strong> {formData.time?.toLocaleTimeString()}</p>
                <p><strong>Duration:</strong> {formData.duration} minutes</p>
                <p><strong>Timezone:</strong> {formData.timezone?.label}</p>
            </div>

            {/* Selected GNSS Constellations */}
            <div className="p-4 border rounded-md bg-gray-50">
                <h3 className="text-xl font-semibold">Selected GNSS Constellations</h3>
                {formData.constellations.length > 0 ? (
                    <ul className="list-disc ml-6">
                        {formData.constellations.map((constellation: string) => (
                            <li key={constellation}>{constellation}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No constellations selected.</p>
                )}
            </div>

            {/* Receivers List */}
            <div className="p-4 border rounded-md bg-gray-50">
                <h3 className="text-xl font-semibold">Receivers</h3>
                {formData.receivers.map((receiver: any, rIndex: number) => (
                    <div key={receiver.id} className="p-4 border-b last:border-none">
                        <h4 className="text-lg font-semibold mb-2">Receiver {rIndex + 1}</h4>
                        <p><strong>ID:</strong> {receiver.id}</p>
                        <p><strong>Role:</strong> {receiver.role.toUpperCase()}</p>
                        <p><strong>Location:</strong> Lat {receiver.lat}, Lon {receiver.lon}</p>
                        <p><strong>Height from Ground:</strong> {receiver.height} meters</p>

                        {/* Obstacles Section */}
                        {receiver.obstacles && receiver.obstacles.length > 0 && (
                            <div className="mt-3 p-3 border rounded-md bg-gray-100">
                                <h4 className="text-lg font-semibold">Obstacles</h4>
                                {receiver.obstacles.map((obstacle: any, index: number) => (
                                    <div key={obstacle.id} className="p-2 border-b last:border-none">
                                        <h5 className="text-md font-semibold">Obstacle {index + 1}</h5>
                                        <p><strong>ID:</strong> {obstacle.id}</p>
                                        <p><strong>Obstacle Height:</strong> {obstacle.totalHeight} meters</p>
                                        <p><strong>Height from Ground:</strong> {obstacle.groundHeight} meters</p>

                                        {/* Obstacle Vertices */}
                                        <div className="mt-2">
                                            <p><strong>Vertices:</strong></p>
                                            <ul className="ml-4 list-disc text-gray-700">
                                                {obstacle.coordinates.map((vertex: [number, number], vIndex: number) => (
                                                    <li key={vIndex}>
                                                        Lat: {vertex[0]}, Lon: {vertex[1]}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-4">
                <button onClick={prevStep} className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500">
                    Back
                </button>
                <button onClick={handleSubmit} className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
                    Submit
                </button>
            </div>
        </div>
    );
};

export default SummaryStep;
