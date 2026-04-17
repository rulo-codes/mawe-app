import React, { useRef, useEffect } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './map.css';

export default function Map() {

    const mapContainer = useRef(null);
    const map = useRef(null);
    const coordinates = useRef(null);
    const zoom = 7;
    maptilersdk.config.apiKey = 'B5DZprXVurPYHQYpjYGc';

    useEffect(() => {
        if (map.current) return; // stops map from intializing more than once
        map.current = new maptilersdk.Map({
            container: mapContainer.current,
            style: "019d9359-9c57-7522-b4dc-7a10a029169f",
            center: [139.753, 35.6844],
            zoom: zoom
        });

        function onMove(e){
            const coords = e.lngLat;

            if(!coordinates.current) return;
            coordinates.current.style.display = "block";
            coordinates.current.innerHTML = `Long: ${coords.lng} <br/> Lat:${coords.lat}`;
        }

        map.current.on('mousemove', onMove);

    }, []);



    return (
        <div className="map-wrap">
                <div ref={mapContainer} className="map" />
                <pre ref={coordinates} id="coordinates" className="coordinates"></pre>
        </div>
    );
}