import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function BeachMap() {
    const mapRef = useRef(null);

    useEffect(() => {
        // Initialize the map
        mapRef.current = L.map('map').setView([39.8283, -98.5795], 4);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapRef.current);

        // Fetch the beach data and add markers to the map
        axios.get('http://red-tide-induced-respiratory-irritation-level.us-east-2.elasticbeanstalk.com/api/beachData')
            .then(response => {
                response.data.forEach(beach => {
                    const { latitude, longitude, seaweed_level } = beach;
                    let markerColor;

                    switch (seaweed_level) {
                        case 'high':
                            markerColor = 'red';
                            break;
                        case 'medium':
                            markerColor = 'orange';
                            break;
                        case 'low':
                            markerColor = 'green';
                            break;
                        default:
                            markerColor = 'blue';
                    }

                    L.circleMarker([latitude, longitude], {
                        color: markerColor,
                        radius: 10
                    }).addTo(mapRef.current).bindPopup(`<b>${beach.beach_name}</b><br>Seaweed Level: ${seaweed_level}`);
                });
            })
            .catch(error => {
                console.error('Error fetching the beach data', error);
            });

        // Cleanup map on component unmount
        return () => {
            if (mapRef.current) {
                mapRef.current.off();
                mapRef.current.remove();
            }
        };

    }, []); // Empty dependency array ensures this runs once on mount and cleanup runs on unmount

    return (
        <div id="map" style={{ height: "500px", width: "100%" }}></div>
    );
}

export default BeachMap;