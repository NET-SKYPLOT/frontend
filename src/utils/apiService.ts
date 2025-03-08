import axios from "axios";

export const fetchAvailableDems = async (receivers: any[]) => {
    try {
        const response = await axios.post("https://api_gateway:8760/api/v1/dems", {
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

        return {
            availableDems: availableDems.map((dem: any) => ({
                description: dem.description,
                type: dem.type,
                resolution: dem.resolution,
            })),
            recommendedDEM,
        };
    } catch (error) {
        console.error("Error fetching DEMs:", error);
        return {availableDems: [], recommendedDEM: null};
    }
};
