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

        // Extract DEMs from all available sources
        const availableDems: { description: string; type: string; resolution: number; source: string }[] = [];

        if (data.available_sources) {
            for (const sourceKey in data.available_sources) {
                if (data.available_sources[sourceKey].dems) {
                    data.available_sources[sourceKey].dems.forEach((dem: any) => {
                        availableDems.push({
                            description: dem.description,
                            type: dem.type,
                            resolution: dem.resolution,
                            source: data.available_sources[sourceKey].name, // Assign source name
                        });
                    });
                }
            }
        }

        // Extract recommended DEM if available
        const recommendedDEM = data.recommended
            ? {
                description: data.recommended.description || "Recommended DEM",
                type: data.recommended.type,
                resolution: data.recommended.resolution || "N/A",
            }
            : null;

        return {
            availableDems,
            recommendedDEM,
        };
    } catch (error) {
        console.error("Error fetching DEMs:", error);
        return {availableDems: [], recommendedDEM: null};
    }
};
