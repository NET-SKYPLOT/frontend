import axios from "axios";

export const fetchAvailableDems = async (receivers: any[]) => {
    try {
        const response = await axios.post("/api/v1/dems", {
            receivers: receivers.map(receiver => ({
                coordinates: {
                    latitude: receiver.lat,
                    longitude: receiver.lon
                }
            }))
        });

        const data = response.data;

        // Extract available DEMs from response
        const availableDems = data.available_sources?.ot?.dems || [];

        // Extract recommended DEM if available
        const recommendedDEM = data.recommended
            ? {
                description: data.recommended.description || "Recommended DEM",
                type: data.recommended.type,
                resolution: data.recommended.resolution || "N/A",
            }
            : null;

        const finalResult = {
            availableDems: availableDems.map((dem: any) => ({
                description: dem.description,
                type: dem.type,
                resolution: dem.resolution,
            })),
            recommendedDEM,
        };

        console.log("Final Result Passed to Next Component:", finalResult);

        return finalResult;
    } catch (error) {
        console.error("Error fetching DEMs:", error);
        return { availableDems: [], recommendedDEM: null };
    }
};