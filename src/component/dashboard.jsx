import React, { useRef, useEffect, useState } from 'react';
import { getDirectionfromValueShort, getDirectionfromValueLong } from '../utils/getDirectionfromValue.jsx';

import CurrentDashboard from "./CurrentDashboard.jsx";
import HourlyDashboard from './HourlyDashboard.jsx';

import './dashboard.css';


//For testing: setWeatherData, locSelected
export default function Dashboard({weatherData, setWeatherData, locSelected, isMiniMode}){
    const [isLoading, setLoading] = useState(true);

    const [lng, lat] = Array.isArray(weatherData.coordinates) ? weatherData.coordinates : [null, null];
    //Weather Data
    const weatherCurrent = weatherData.data?.current;
    const bioCurrent = weatherData?.bio;
    const astronomyCurrent = weatherData?.data?.astronomy;

    const checkData = Array.isArray(weatherData.coordinates) && weatherData.coordinates.length === 2 && weatherData.data != null;

    //Date & Time
    const date = weatherData?.date ? new Date(weatherData.date) : null;

    const currentTime = date && !Number.isNaN(date.getTime())
        ? date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        })
        : "--:--:--";

    const currentDay = date && !Number.isNaN(date.getTime())
        ? date.toLocaleString([], {
            weekday: 'long',
        })
        : "----";
    
    const currentDate = date && !Number.isNaN(date.getTime())
        ? date.toLocaleString([], {
            weekday: 'short',
            month: 'long',
            day: '2-digit',
            year: 'numeric'
        })
        : "---,---,--,----";
    
    const dawn = astronomyCurrent?.nauticalDawn ? new Date(astronomyCurrent?.nauticalDawn) : null;
    const dawnTime = dawn && !Number.isNaN(dawn.getTime())
        ? dawn.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        })
        : "--:--:--";
    
    const dusk = astronomyCurrent?.nauticalDusk ? new Date(astronomyCurrent?.nauticalDusk) : null;
    const duskTime = dusk && !Number.isNaN(dusk.getTime())
        ? dusk.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        })
        : "--:--:--";

    useEffect(() => {
        console.log(weatherData);

        if (!locSelected) {
            setLoading(true);
            return;
        }

        const loadingTimer = setTimeout(() => { setLoading(false) }, 2000);

        return () => {
            clearTimeout(loadingTimer);
        };
    }, [locSelected]);

    function selectMode(e){
        const modeVal = e.currentTarget.value;

        document.querySelectorAll(".data-mode-btn").forEach(btn => {
            btn.classList.remove("mode-selected");
        })

        document.querySelector(`.mode-${modeVal}`).classList.add("mode-selected");
        console.log(`${modeVal} mode selected for data`);
    }


    return (
        <div className="dashboard-wrapper" style={{display: isMiniMode ? 'block' : 'none'}}>
            <div className="dashboard">
                {/* Dashboard Banner */}
                <div className='dashboard-banner' style={{display: !checkData ? "none" : "flex"}}>
                    <div className='dashboard-banner-header'>
                        <h1 className='banner-header-city-name'>{weatherData.name}</h1>
                        <div className='banner-header-coord'>
                            <span>{lng}</span>
                            <br />
                            <span>{lat}</span>
                        </div>
                    </div>
                    <div className='header-city-info'>{weatherData.place}</div>
                </div>

                {/* Dashboard Weather UI */}
                {isLoading ? (
                    <h3 className='loader'>Loading...</h3>
                ) : !checkData ? (
                    <h3 className='err-dashboard'>UNABLE TO GET DATA</h3>
                ) : (
                    <div className='dashboard-data'>
                        {/* Weather Data at current hour */}
                        <div className='data-card data-pin'>
                            <div className='data-pin-top'>
                                <div className='pin-condition'>
                                    <div className='pin-condition-header'>
                                        <span className='condition-header-day'>{currentDay}</span> 
                                        <h2 className='condition-header-code'>{weatherCurrent.weatherCode?.condition ?? "No Data"}</h2>
                                    </div>
                                    <div className='pin-condition-alert'>
                                        Alert Level :
                                        <span className='pin-condition-alertLvl' style={{
                                            background: 
                                                weatherCurrent.weatherCode?.alertLevel === "CRITICAL" ? "#D42C22AA" : weatherCurrent.weatherCode?.alertLevel === "WARNING" ? "#e2bc13aa" : weatherCurrent.weatherCode?.alertLevel === "ADVISORY" ? "#1ba4daaa" : weatherCurrent.weatherCode?.alertLevel === "NONE" ? "#1ddd6daa" : "#868686aa",
                                            marginLeft: "5px"
                                            }}>{weatherCurrent.weatherCode?.alertLevel}
                                        </span>
                                    </div>
                                </div>
                                <div className='pin-condition-icon'>
                                    <img src={`/weather-icons/${weatherCurrent.weatherCode?.iconId}.png`} alt="weather icon" />
                                </div>                                
                            </div>
                            <div className='data-pin-details'>                              
                                <div className='data-pin-details-time'>
                                    <span className='data-card pin-time'>{currentTime}</span>
                                    <div className='pin-time-others'>
                                        <div className='pin-date'>{currentDate}</div>
                                        <div className='pin-solar'>
                                            <div className='solar-dawn'>
                                                <span>Nautical Dawn:</span>
                                                <span className='val'> {dawnTime}</span>
                                            </div>
                                            <div className='solar-dusk'>
                                                <span>Nautical Dusk: </span>
                                                <span className='val'> {duskTime}</span>
                                            </div>
                                        </div> 
                                    </div>
                                </div>
                                
                                <div className='data-pin-details-condition'>
                                    <div className='pin-details-condition val'><img src='/ui-icons/ui-precep.png' className='data-ui-icon' style={{marginRight: "auto"}}></img> <div>{weatherCurrent?.precipitation?.sg ?? "--"} mm/h</div></div>
                                    <div className='pin-details-condition val'><img src='/ui-icons/ui-humidity.png' className='data-ui-icon' style={{marginRight: "auto"}}></img> <div>{weatherCurrent?.humidity?.sg ?? "--"}%</div></div>
                                    <div className='pin-details-condition val'>
                                        <img src='/ui-icons/ui-temp-air.png' className='data-ui-icon' style={{marginRight: "auto"}}></img>
                                        <div>{weatherCurrent?.airTemperature?.sg ?? "---"} &deg;C</div>
                                    </div>  
                                </div>
                            </div>
                        </div>

                        <div className='data-mode'>
                            <button className='data-mode-btn mode-today mode-selected' onClick={selectMode} value="today">Today</button>
                            <div className='divider'></div>
                            <button className='data-mode-btn mode-hours' onClick={selectMode} value="hours">Hours</button>
                            <div className='divider'></div>
                            <button className='data-mode-btn mode-daily' onClick={selectMode} value="daily">Daily</button>
                        </div>

                        {/* Currenty, Hourly, Daily Weather Data */}
                        {/*
                        <div className='data-card data-weather data-current'>
                            <div className='data-current'>
                                
                                <div className='data-current-list'>
                                    <h2 className='data-header'>Current Condition</h2>
                                    <div className='data-card data-current-wave'>
                                        <div className='data-label'>
                                            <img src='/ui-icons/ui-wave.png' className='data-ui-icon'></img>
                                            <span style={{margin: "0px 8px"}}>Wave</span> 
                                        </div>
                                        <div className='current-wave'>
                                            <div style={{fontFamily: "var(--secondary-font)", textTransform: "uppercase", wordSpacing: "6px"}}>Height: <span className='val'>{weatherCurrent?.waveHeight?.sg ?? "---"} m</span></div>
                                            <div style={{fontFamily: "var(--secondary-font)", textTransform: "uppercase", wordSpacing: "6px"}}>Period: <span className='val'>{weatherCurrent?.wavePeriod?.sg ?? "---"} m/s</span></div>
                                            <div className='val'>{getDirectionfromValueShort(weatherCurrent?.waveDirection?.sg)}</div>
                                        </div>
                                    </div>
                                    <div className='data-card data-current-swell'>
                                        <div className='data-label'>
                                            <img src='/ui-icons/ui-swell.png' className='data-ui-icon'></img>
                                            <span style={{margin: "0px 8px"}}>Swell</span> 
                                        </div>
                                        <div className='current-swell'>
                                            <div style={{fontFamily: "var(--secondary-font)", textTransform: "uppercase", wordSpacing: "6px"}}>Height: <span className='val'>{weatherCurrent?.swellHeight?.sg ?? "---"} m</span></div>
                                            <div style={{fontFamily: "var(--secondary-font)", textTransform: "uppercase", wordSpacing: "6px"}}>Period: <span className='val'>{weatherCurrent?.swellPeriod?.sg ?? "---"} m/s</span></div>
                                            <div className='val'>{getDirectionfromValueShort(weatherCurrent?.swellDirection?.sg)}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className='data-current-other-list'>

                                    <div className='data-card data-current-wind'>
                                        <div className='data-label'>
                                            <img src='/ui-icons/ui-wind.png' className='data-ui-icon'></img>
                                            <span style={{margin: "0px 8px"}}>Wind</span> 
                                        </div>
                                        <div className='current-wind val'>{weatherCurrent?.windSpeed?.sg ?? "---"}m/s  {getDirectionfromValueShort(weatherCurrent?.windDirection?.sg)}</div>
                                    </div>
                                    <div className='data-card data-current-gust'>
                                        <div className='data-label'>
                                            <img src='/ui-icons/ui-gust.png' className='data-ui-icon'></img>
                                            <span style={{margin: "0px 8px"}}>Gust</span> 
                                        </div>
                                        <div className='current-gust val'>{weatherCurrent?.gust?.sg ?? "---"}m/s </div>
                                    </div>
                                    <div className='data-card data-current-sea-level'>
                                        <div className='data-label'>
                                            <img src='/ui-icons/ui-sea-level.png' className='data-ui-icon'></img>
                                            <span style={{margin: "0px 8px"}}>Sea Level</span> 
                                        </div>
                                        <div className='current-sea-level val'>{weatherCurrent?.seaLevel?.sg ?? "---"}m </div>
                                    </div>
                                    <div className='data-card data-current-curr'>
                                        <div className='data-label'>
                                            <img src='/ui-icons/ui-current.png' className='data-ui-icon'></img>
                                            <span style={{margin: "0px 8px"}}>Current</span> 
                                        </div>
                                        <div className='current-curr val'>{weatherCurrent?.currentSpeed?.sg ?? "---"}m/s      {getDirectionfromValueShort(weatherCurrent?.currentDirection?.sg)}</div>
                                    </div>
                                    <div className='data-card data-current-temp'>
                                        <div className='data-label'>
                                            <img src='/ui-icons/ui-temp-air.png' className='data-ui-icon'></img>
                                            <span style={{margin: "0px 8px"}}>Temp</span> 
                                        </div>
                                        <div className='current-air-temp val'>{weatherCurrent?.airTemperature?.sg ?? "---"}&deg;C </div>
                                    </div>
                                    <div className='data-card data-current-pressure'>
                                        <div className='data-label'>
                                            <img src='/ui-icons/ui-air-pressure.png' className='data-ui-icon'></img>
                                            <span style={{margin: "0px 8px"}}>Air Pressure</span> 
                                        </div>
                                        <div className='current-air-pressure val'>{weatherCurrent?.pressure?.sg ?? "---"} hPa</div>
                                    </div>
                                    <div className='data-card data-current-humidity'>
                                        <div className='data-label'>
                                            <img src='/ui-icons/ui-humidity.png' className='data-ui-icon'></img>
                                            <span style={{margin: "0px 8px"}}>Humidity</span> 
                                        </div>
                                        <div className='current-humidity val'>{weatherCurrent?.humidity?.sg ?? "---"}%</div>
                                    </div>
                                    <div className='data-card data-current-precep'>
                                        <div className='data-label'>
                                            <img src='/ui-icons/ui-precep.png' className='data-ui-icon'></img>
                                            <span style={{margin: "0px 8px"}}>Precepitation</span> 
                                        </div>
                                        <div className='current-precep val'>{weatherCurrent?.precipitation?.sg ?? "---"}mm/h</div>
                                    </div>
                                    <div className='data-card data-current-cloud-cover'>
                                        <div className='data-label'>
                                            <img src='/ui-icons/ui-cloud-cover.png' className='data-ui-icon'></img>
                                            <span style={{margin: "0px 8px"}}>Cloud Cover</span> 
                                        </div>
                                        <div className='current-cloud-cover val'>{weatherCurrent?.cloudCover?.sg ?? "---"}%</div>
                                    </div>
                                    <div className='data-card data-current-visibility'>
                                        <div className='data-label'>
                                            <img src='/ui-icons/ui-visibility.png' className='data-ui-icon'></img>
                                            <span style={{margin: "0px 8px"}}>Visibility</span> 
                                        </div>
                                        <div className='current-visibility val'>{weatherCurrent?.visibility?.sg ?? "---"} km</div>
                                    </div>
                
                                </div>
                                <div className='data-current-marine'>
                                    <h2 className='data-header'>Marine Biology</h2>
                                    <div className='data-current-marine-list'>

                                        <div className='data-card data-current-marine-water-temp'>
                                            <div className='data-label'>
                                                <img src='/ui-icons/ui-temp-water.png' className='data-ui-icon'></img>
                                                <span style={{margin: "0px 8px"}}>Water Temp</span> 
                                            </div>
                                            <div className='current-bio-watertemp val'>{weatherCurrent?.waterTemperature?.sg ?? "---"}&deg;C</div>
                                        </div>
                                        <div className='data-card data-current-marine-ph'>
                                            <div className='data-label'>
                                                <img src='/ui-icons/ui-bio-ph.png' className='data-ui-icon'></img>
                                                <span style={{margin: "0px 8px"}}>pH Scale</span> 
                                            </div>
                                            <div className='current-bio-ph val'>{bioCurrent?.ph?.sg ?? "---"}</div>
                                        </div>
                                        <div className='data-card data-current-marine-oxygen'>
                                            <div className='data-label'>
                                                <img src='/ui-icons/ui-bio-oxygen.png' className='data-ui-icon'></img>
                                                <span style={{margin: "0px 8px"}}>Oxygen</span> 
                                            </div>
                                            <div className='current-bio-oxygen val'>{bioCurrent?.oxygen?.sg > 0 ? (bioCurrent?.oxygen?.sg * 0.0328).toFixed(1) : "---"} mg/L</div>
                                        </div>
                                        <div className='data-card data-current-marine-salinity'>
                                            <div className='data-label'>
                                                <img src='/ui-icons/ui-bio-salinity.png' className='data-ui-icon'></img>
                                                <span style={{margin: "0px 8px"}}>Salinity</span> 
                                            </div>
                                            <div className='current-bio-salinity val'>{bioCurrent?.salinity?.sg ?? "---"}</div>
                                        </div>
                                        <div className='data-card data-current-marine-iron'>
                                            <div className='data-label'>
                                                <img src='/ui-icons/ui-bio-iron.png' className='data-ui-icon'></img>
                                                <span style={{margin: "0px 8px"}}>Iron</span> 
                                            </div>
                                            <div className='current-bio-iron val'>{(bioCurrent?.iron?.sg).toFixed(3) ?? "---"} nmol/kg</div>
                                        </div>
                                        <div className='data-card data-current-marine-nitrate'>
                                            <div className='data-label'>
                                                <img src='/ui-icons/ui-bio-nitrate.png' className='data-ui-icon'></img>
                                                <span style={{margin: "0px 8px"}}>Nitrate</span> 
                                            </div>
                                            <div className='current-bio-nitrate val'>{(bioCurrent?.nitrate?.sg).toFixed(2) ?? "---"} &micro;mol/kg</div>
                                        </div>
                                        <div className='data-card data-current-marine-chloro'>
                                            <div className='data-label'>
                                                <img src='/ui-icons/ui-bio-chloro.png' className='data-ui-icon'></img>
                                                <span style={{margin: "0px 8px"}}>Chlorophyll</span> 
                                            </div>
                                            <div className='current-bio-chloro val'>{bioCurrent?.chlorophyll?.sg ?? "---"} mg/m</div>
                                        </div>
                                        <div className='data-card data-current-marine-phyto'>
                                            <div className='data-label'>
                                                <img src='/ui-icons/ui-bio-phyto.png' className='data-ui-icon'></img>
                                                <span style={{margin: "0px 8px"}}>Phyto</span> 
                                            </div>
                                            <div className='current-bio-phyto val'>{((bioCurrent?.phyto?.sg * 0.001) * 12.011).toFixed(3) ?? "---"} g/m</div>
                                        </div>
                                        <div className='data-card data-current-marine-plankton'>
                                            <div className='data-label'>
                                                <img src='/ui-icons/ui-bio-plankton.png' className='data-ui-icon'></img>
                                                <span style={{margin: "0px 8px"}}>Phytoplankton</span> 
                                            </div>
                                            <div className='current-bio-plankton salinity val'>{(bioCurrent?.phytoplankton?.sg * 12.011).toFixed(2) ?? "---"} mg/m<sup>3</sup></div>
                                        </div>
                                        <div className='data-card data-current-marine-phosphate'>
                                            <div className='data-label'>
                                                <img src='/ui-icons/ui-bio-phosphate.png' className='data-ui-icon'></img>
                                                <span style={{margin: "0px 8px"}}>Phosphate</span> 
                                            </div>
                                            <div className='current-bio-phosphate val'>{(bioCurrent?.phosphate?.sg).toFixed(2) ?? "---"} &micro;mol/kg</div>
                                        </div>
                                        <div className='data-card data-current-marine-silicate'>
                                            <div className='data-label'>
                                                <img src='/ui-icons/ui-bio-silicate.png' className='data-ui-icon'></img>
                                                <span style={{margin: "0px 8px"}}>Silicate</span> 
                                            </div>
                                            <div className='current-bio-silicate val'>{(bioCurrent?.silicate?.sg).toFixed(2) ?? "---"} &micro;mol/kg</div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        */}

                        <CurrentDashboard weatherData={weatherData} />
                        <HourlyDashboard weatherData={weatherData} />
                    </div>
                )
                }
            </div>
        </div>
    )
}