import * as React from "react";
import {useState} from "react";
import ReceiverSetupModal from "./ReceiverSetupModal";

interface ReceiverListProps {
    formData: any;
    setFormData: (data: any) => void;
}

const ReceiverList: React.FC<ReceiverListProps> = ({formData, setFormData}) => {
    const [selectedReceiver, setSelectedReceiver] = useState(null);

    const deleteReceiver = (id: string) => {
        setFormData({
            ...formData,
            receivers: formData.receivers.filter(
                (receiver: any, index: number) =>
                    receiver.id !== id || index < 2
            ),
        });
    };

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold">Receivers</h3>
            <ul>
                {formData.receivers.map((receiver: any, index: number) => (
                    <li key={receiver.id} className="flex justify-between items-center border-b py-2">
                        <div>
                            <span className="font-medium">{receiver.role.toUpperCase()}</span> - {receiver.id}
                        </div>
                        <div className="flex space-x-2">
                            <button
                                className="bg-blue-500 text-white px-3 py-1 rounded"
                                onClick={() => setSelectedReceiver(receiver)}
                            >
                                Configure
                            </button>
                            {index >= 2 && receiver.role === "rover" && (
                                <button
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                    onClick={() => deleteReceiver(receiver.id)}
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>

            {selectedReceiver && (
                <ReceiverSetupModal
                    receiver={selectedReceiver}
                    setFormData={setFormData}
                    closeModal={() => setSelectedReceiver(null)}
                />
            )}
        </div>
    );
};

export default ReceiverList;
