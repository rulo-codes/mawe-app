import React, { useRef, useEffect, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import { WindLayer } from '@maptiler/weather';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './map.css';

export default function Map() {

    const mapContainer = useRef(null);
    const map = useRef(null);
    const coordinates = useRef(null);
    maptilersdk.config.apiKey = 'B5DZprXVurPYHQYpjYGc';

    const timeInfo = useRef(null);
    const timeTextDiv = useRef(null);
    const timeSlider = useRef(null);
    const playPauseButton = useRef(null);
    const pointerDataDiv = useRef(null);
    const windLayerData = useRef(null);
    let pointerLngLat = null;

    const [isToggleWeather, setToggleWeather] = useState(false);


    useEffect(() => {

        //Creating map
        if (map.current) return; // stops map from intializing more than once
        map.current = new maptilersdk.Map({
            container: mapContainer.current,
            style: "019d9359-9c57-7522-b4dc-7a10a029169f",
            zoom: 8,
            geolocate: maptilersdk.GeolocationType.POINT,
            geolocateControl: false

        });

        const windLayer = new WindLayer();

        const gc = new maptilersdk.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true, // Keeps updating as the user moves
            showUserLocation: true
        });

        map.current.addControl(gc, "bottom-right");

        map.current.on('load', () => {
            console.log("map loaded...");
            gc.on('geolocate', async () => {
                const result = await maptilersdk.geolocation.info();
                console.log(result);
            });
            // Optional: Handle errors (e.g., user denied permission)
            gc.on('error', (error) => {
                console.error("User denied or GPS failed:", error);
            });
        });

        map.current.on('style.load', () => {
            // Add source and layer during style.load to ensure proper timing

            // Find insertion point and add openseamap layer
            const layers = map.current.getStyle().layers;
            const firstLabelId = layers.find(l => l.type === 'symbol')?.id;

            map.current.addLayer(windLayer, firstLabelId);
            map.current.setLayoutProperty(windLayer.id, 'visibility', 'none');

            map.current.once('idle', () => {
                if (windLayer) {
                    windLayer.setOpacity(0.7);
                    console.log("Weather materials initialized successfully.");
                }
            });
        })

        //Time Slider Controls
        timeSlider.current.addEventListener("input", (evt) => {
            windLayer.setAnimationTime(parseInt(timeSlider.current.value / 1000))
        });
        
        // Event called when all the datasource for the next days are added and ready.
        // From now on, the layer nows the start and end dates.
        windLayer.on("sourceReady", event => {
            const startDate = windLayer.getAnimationStartDate();
            const endDate = windLayer.getAnimationEndDate();
            const currentDate = windLayer.getAnimationTimeDate();
            refreshTime()

            timeSlider.current.min = +startDate;
            timeSlider.current.max = +endDate;
            timeSlider.current.value = +currentDate;
        });

        // Called when the animation is progressing
        windLayer.on("tick", event => {
            refreshTime();
            updatePointerValue(pointerLngLat);
        });

        // Called when the time is manually set
        windLayer.on("animationTimeSet", event => {
            refreshTime()
        });

        // When clicking on the play/pause
        let isPlaying = false;
        playPauseButton.current.addEventListener("click", () => {
            if (isPlaying) {
                    windLayer.animateByFactor(0);
                    playPauseButton.current.innerText = "Play 3600x";
            } else {
                    windLayer.animateByFactor(3600);
                    playPauseButton.current.innerText = "Pause";
            }

            isPlaying = !isPlaying;
        });

        // Update the date time display
        function refreshTime() {
            const d = windLayer.getAnimationTimeDate();
            timeTextDiv.current.innerText = d.toString();
            timeSlider.current.value = +d;
        }

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
            timeInfo.current.style.display = "block";
            windLayerData.current.style.display = "block";
        }else{
            timeInfo.current.style.display = "none";
            windLayerData.current.style.display = "none";
        }
    }

    function toggleWeather(){
        if(!isToggleWeather){
            setToggleWeather(true);
        }else{
            setToggleWeather(false);
        }

        toggleWeatherLayer();
    }

    return (
        <div className="map-wrap">
              <div ref={timeInfo} id="time-info">
                    <span ref={timeTextDiv} id="time-text"></span>
                    <button ref={playPauseButton} id="play-pause-bt" className="button">Play 3600x</button>
                    <input ref={timeSlider} type="range" id="time-slider" min="0" max="11" step="1" />
                </div>
                <div ref={windLayerData} id="wind-layer-data">
                    <div id="variable-name">Wind</div>
                    <div ref={pointerDataDiv} id="pointer-data"></div>
                </div>
                <div ref={mapContainer} className="map" />
                <pre ref={coordinates} id="coordinates" className="coordinates"></pre>
                <button id="toggle-weather-btn" onClick={toggleWeather}>Toggle Weather</button>
        </div>
    );
}