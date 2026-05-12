import React, { useRef, useEffect, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import { PrecipitationLayer, PressureLayer, TemperatureLayer, WindLayer } from '@maptiler/weather';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './map.css';

export default function Map() {

    const mapContainer = useRef(null);
    const map = useRef(null);
    const coordinates = useRef(null);
    maptilersdk.config.apiKey = import.meta.env.VITE_MAPTILER_API_KEY;

    const mapMarker = document.querySelector(".map-marker");
    const pointerDataDiv = useRef(null);
    const windLayerData = useRef(null);
    let pointerLngLat = null;

    const [selectedLayer, setSelectedLayer] = useState("default");


    useEffect(() => {

        //Creating map
        if (map.current) return; // stops map from intializing more than once
        map.current = new maptilersdk.Map({
            container: mapContainer.current,
            style: "019d9359-9c57-7522-b4dc-7a10a029169f",
            zoom: 8,
            //Disable Pitch
            pitch: 0,
            minPitch: 0,
            maxPitch: 0,
            bearingSnap: 0,
            dragRotate: true,
            //Main Controls
            geolocate: maptilersdk.GeolocationType.POINT,
            navigationControl: false,
            geolocateControl: false
        });

        //Map Layers
        const windLayer = new WindLayer();
        const tempLayer = new TemperatureLayer();
        const pptLayer = new PrecipitationLayer();
        const presLayer = new PressureLayer();



        //Map Controls
        const mapNavigationControl = new maptilersdk.NavigationControl();
        map.current.addControl(mapNavigationControl, "bottom-right");

        const mapGeolocationControl = new maptilersdk.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true, // Keeps updating as the user moves
            showUserLocation: true,
            showAccuracyCircle: true
        });
        map.current.addControl(mapGeolocationControl, "bottom-right");

        //Map Event Handlers
        map.current.on('load', () => {
            console.log("map loaded...");

            //Add new marker
            const el = document.createElement('div');
            el.classList.add('map-marker');

            const marker = new maptilersdk.Marker({element: el, anchor: 'bottom'});
            
            //Handle Marker Event
            map.current.on('click', (e) => {
                const coords = e.lngLat;
                marker.remove();
                marker.setLngLat([coords.lng, coords.lat]);
                marker.addTo(map.current);
                console.log("Marker added: " + coords.lng + " " + coords.lat);
                requestAnimationFrame(animate);
            });

            //Handle Geolocation Event
            mapGeolocationControl.on('geolocate', async () => {
                //Get GPS info with geolocation info
                const result = await maptilersdk.geolocation.info();
                console.log(result);
            });
            // Optional: Handle errors (e.g., user denied permission)
            mapGeolocationControl.on('error', (error) => {
                console.error("User denied or GPS failed:", error);
            });

             let start = null;

            function animate(timestamp) {
                if (!start) start = timestamp;
                const progress = timestamp - start;

                // Create a sine wave for smooth up/down motion
                // 10 is the height of the float, 0.003 is the speed
                const offset = Math.sin(progress * 0.003) * 10;

                // Apply the offset. 
                // Note: if your anchor is 'bottom', you might need to add this 
                // to your base offset (e.g., -20 + offset)
                marker.setOffset([0, -20 + offset]);

                requestAnimationFrame(animate);
            }
        });

       




        //Map Loading Layers
        map.current.on('style.load', () => {
            // Add source and layer during style.load to ensure proper timing

            // Find insertion point and add openseamap layer
            const layers = map.current.getStyle().layers;
            const firstLabelId = layers.find(l => l.type === 'symbol')?.id;


            const weatherLayers = [
                {instance: windLayer, id: "MapTiler Wind"},
                {instance: tempLayer, id: "MapTiler Temperature"},
                {instance: pptLayer, id: "MapTiler Precipitation"},
                {instance: presLayer, id: "MapTiler Pressure"}
            ]

            weatherLayers.forEach(({instance}) => {
                map.current.addLayer(instance, firstLabelId);
                map.current.setLayoutProperty(instance.id, 'visibility', 'none');
            });


            map.current.once('idle', () => {

                windLayer.setOpacity(0.7);
                tempLayer.setOpacity(0.6);
                pptLayer.setOpacity(0.9);
                presLayer.setOpacity(0.5);

                console.log("Weather materials initialized successfully.");

            });
        })

        //Initinialize Weather Layers
        windLayer.animateByFactor(0);
        tempLayer.animateByFactor(0);
        pptLayer.animateByFactor(0);
        presLayer.animateByFactor(0);



        map.current.on('mouseout', function(evt) {
            if (!evt.originalEvent.relatedTarget) {
                pointerDataDiv.innerText = "";
                pointerLngLat = null;
            }
        });

        //Update and display wind speed value
        function updatePointerValue(lngLat) {
                if (!lngLat) return;
                pointerLngLat = lngLat;
                const value = windLayer.pickAt(lngLat.lng, lngLat.lat);
                
                if (!value) {
                    pointerDataDiv.current.innerText = "";
                    return;
                }

                pointerDataDiv.current.innerHTML = `<div id="arrow" style="transform: rotate(${value.directionAngle}deg);">↑</div> ${value.compassDirection} ${value.speedMetersPerSecond.toFixed(1)} m/s`
        }

        // Function for coordinates on pointer map position
        function onMove(lngLat){
            const coords = lngLat;

            if(!coordinates.current) return;
            coordinates.current.style.display = "block";
            coordinates.current.innerHTML = `Long: ${coords.lng} <br/> Lat:${coords.lat} <br/>`;
        }


        map.current.on('mousemove', (e) => {
            updatePointerValue(e.lngLat);
            onMove(e.lngLat);
        });

        /*
        navigator.geolocation.watchPosition((position) => {
            const speed = position.coords.speed; // Speed in m/s
            const bearing = position.coords.heading; // Movement direction
            // ... update your UI
            speed.current.innerHTML = `Speed: ${speed} <br/> Bearing: ${bearing}`;
        }, null, { enableHighAccuracy: true });
        */

    }, []);

    function toggleWeatherLayer(){
        if (!map.current || !map.current.isStyleLoaded()) {
            console.log("Map style is still loading. Please wait...");
            return;
        }

        const layerId = "MapTiler Wind"
        const currentLayerStatus = map.current.getLayoutProperty(layerId, 'visibility');
        map.current.setLayoutProperty(layerId, 'visibility', currentLayerStatus === 'none' ? 'visible' : 'none');
        if(currentLayerStatus === 'none'){
            console.log("Wind Layer Added");
            windLayerData.current.style.display = "block";
        }else{
            windLayerData.current.style.display = "none";
        }
    }

    function toggleWeather(e){
        const layerName = e.currentTarget.value;
        setSelectedLayer(selectedLayer === layerName ? null : layerName);

        const weatherLayers = [
                "MapTiler Wind",
                "MapTiler Temperature",
                "MapTiler Precipitation",
                "MapTiler Pressure"
        ];

        weatherLayers.forEach(layer => {
            map.current.setLayoutProperty(layer, 'visibility', 'none');
        });

        if(layerName == "default"){
            console.log("Default Layer Set");
            weatherLayers.forEach(layer => {
                map.current.setLayoutProperty(layer, 'visibility', 'none');
                console.log(layer + " Layer Disabled");
            });
        }else{
            console.log("Selected " + layerName + " has been initialized");
            map.current.setLayoutProperty(e.target.value, 'visibility', 'visible');
        }
    }

    return (
        <div className="map-wrap">
                <div ref={windLayerData} id="wind-layer-data">
                    <div id="variable-name">Wind</div>
                    <div ref={pointerDataDiv} id="pointer-data"></div>
                </div>
                <div ref={mapContainer} className="map" />
                <pre ref={coordinates} id="coordinates" className="coordinates"></pre>
                <div id="map-weather-layers">
                    <button id="default-layer-btn" className={`layer-btn ${selectedLayer === "default" ? "selected" : ""}`} onClick={toggleWeather} value="default">Default</button>
                    <button id="wind-layer-btn" className={`layer-btn ${selectedLayer === "MapTiler Wind" ? "selected" : ""}`} onClick={toggleWeather} value="MapTiler Wind">Wind</button>
                    <button id="temp-layer-btn" className={`layer-btn ${selectedLayer === "MapTiler Temperature" ? "selected" : ""}`} onClick={toggleWeather} value="MapTiler Temperature">Temperature</button>
                    <button id="ppt-layer-btn" className={`layer-btn ${selectedLayer === "MapTiler Precipitation" ? "selected" : ""}`} onClick={toggleWeather} value="MapTiler Precipitation">Precipitation</button>
                    <button id="pres-layer-btn" className={`layer-btn ${selectedLayer === "MapTiler Pressure" ? "selected" : ""}`} onClick={toggleWeather} value="MapTiler Pressure">Pressure</button>
                </div>

        </div>
    );
}