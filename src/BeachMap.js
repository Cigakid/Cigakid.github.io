/* global google */
import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import './BeachMap.css';

function BeachMap() {
    const mapRef = useRef(null);
    const markers = useRef([]);

    useEffect(() => {
        // Initialize the Google Map
        mapRef.current = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 39.8283, lng: -98.5795 },
            zoom: 4
        });

        // Fetch the beach data and add markers to the map
        axios.get('http://localhost:5000/api/beachData')
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

                    const marker = new google.maps.Marker({
                        position: { lat: latitude, lng: longitude },
                        map: mapRef.current,
                        icon: {
                            path: google.maps.SymbolPath.CIRCLE,
                            fillColor: markerColor,
                            fillOpacity: 1,
                            strokeWeight: 0,
                            scale: 5
                        }
                    });

                    const infoWindow = new google.maps.InfoWindow({
                        content: `<b>${beach.beach_name}</b><br>Seaweed Level: ${seaweed_level}`
                    });

                    marker.addListener('click', () => {
                        infoWindow.open(mapRef.current, marker);
                    });

                    markers.current.push(marker);
                });
            })
            .catch(error => {
                console.error('Error fetching the beach data', error);
            });

        // Cleanup map on component unmount
        return () => {
            markers.current.forEach(marker => marker.setMap(null)); // Remove markers
            markers.current = []; // Clear the markers array
            google.maps.event.clearInstanceListeners(mapRef.current); // Remove all event listeners
        };

    }, []); // Empty dependency array ensures this runs once on mount and cleanup runs on unmount

    return (
        <div id="map"></div>
    );
}

export default BeachMap;