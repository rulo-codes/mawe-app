import React, { useRef, useEffect, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import { WindLayer } from '@maptiler/weather';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './map.css';

export default function Map() {

    const mapContainer = useRef(null);
    const map = useRef(null);
    const coordinates = useRef(null);
    const zoom = 7;
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
            center: [139.753, 35.6844],
            zoom: zoom
        });

        const windLayer = new WindLayer();

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
                pointerDataDiv.current.innerText = `${value.speedMetersPerSecond.toFixed(1)} m/s`
        }

        // Function for coordinates on pointer map position
        function onMove(lngLat){
            const coords = lngLat;

            if(!coordinates.current) return;
            coordinates.current.style.display = "block";
            coordinates.current.innerHTML = `Long: ${coords.lng} <br/> Lat:${coords.lat}`;
        }

        map.current.on('mousemove', (e) => {
            updatePointerValue(e.lngLat);
            onMove(e.lngLat);
        });

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