import {MapContainer, TileLayer, Marker, useMapEvents, useMap} from "react-leaflet";
import {useEffect} from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix missing marker icon
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";
import * as React from "react";

// Define marker icon manually
const markerIcon = new L.Icon({
    iconUrl: markerIconPng,
    shadowUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

interface Coordinates {
    lat: number;
    lon: number;
}

interface MapComponentProps {
    coordinates: Coordinates;
    setCoordinates: (coords: Coordinates) => void;
    realignMap: boolean;
}

const MapComponent: React.FC<MapComponentProps> = ({coordinates, setCoordinates, realignMap}) => {
    return (
        <div className="w-full h-[400px] mb-6">
            <MapContainer
                center={[coordinates.lat, coordinates.lon]}
                zoom={13}
                className="w-full h-full rounded-md"
                style={{height: "400px", width: "100%"}}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                <ClickableMap setCoordinates={setCoordinates}/>
                <Marker position={[coordinates.lat, coordinates.lon]} icon={markerIcon}/>
                {realignMap && <RecenterMap coordinates={coordinates}/>}
            </MapContainer>
        </div>
    );
};

// Function to update the map center
const RecenterMap = ({coordinates}: { coordinates: Coordinates }) => {
    const map = useMap();

    useEffect(() => {
        if (map && coordinates.lat && coordinates.lon) {
            map.setView([coordinates.lat, coordinates.lon], 13, {animate: true});
        }
    }, [coordinates, map]);

    return null;
};

// Clickable Map Component: Updates marker position when user clicks on the map
const ClickableMap: React.FC<{ setCoordinates: (coords: Coordinates) => void }> = ({setCoordinates}) => {
    useMapEvents({
        click(e) {
            setCoordinates({lat: e.latlng.lat, lon: e.latlng.lng});
        },
    });
    return null;
};

export default MapComponent;
