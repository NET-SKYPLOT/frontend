// utils/idGenerator.ts

// Stores used IDs within the same planning session
const usedIds: Set<string> = new Set();

// Function to generate a unique 4-digit ID
export const generateUniqueId = (): string => {
    let newId: string;
    do {
        newId = Math.floor(1000 + Math.random() * 9000).toString(); // Generate a 4-digit ID
    } while (usedIds.has(newId)); // Ensure it doesn't repeat in the session

    usedIds.add(newId); // Store the generated ID
    return newId;
};
