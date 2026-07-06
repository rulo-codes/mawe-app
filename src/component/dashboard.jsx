import React, { useRef, useEffect, useState } from 'react';
import './dashboard.css';


//For testing: setWeatherData, locSelected
export default function Dashboard({weatherData, setWeatherData, locSelected}){
    const [isLoading, setLoading] = useState(true);

    const [lng, lat] = Array.isArray(weatherData.coordinates) ? weatherData.coordinates : [null, null];
    //Weather Data
    const weatherCode = weatherData.weather_data?.code;
    const weatherCurrent = weatherData.weather_data?.current;
    const weatherSolar = weatherData?.solar;

    const alertLevel = weatherCode?.alertLevel ?? "UNKNOWN";
    const checkData = Array.isArray(weatherData.coordinates) && weatherData.coordinates.length === 2 && weatherData.weather_data != null;

    //Date & Time
    const getDate = weatherData?.date;
    const date = getDate ? new Date(getDate) : null;

    const currentTime = date && !Number.isNaN(date.getTime())
        ? date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short',
            hour12: false
        })
        : "--:--:--";
    
    const currentDate = date && !Number.isNaN(date.getTime())
        ? date.toLocaleString([], {
            weekday: 'long',
            month: 'long',
            day: '2-digit',
            year: 'numeric'
        })
        : "---,---,--,----";
    
    const dawn = weatherSolar?.dawn ? new Date(weatherSolar?.dawn) : null;
    const dawnTime = dawn && !Number.isNaN(dawn.getTime())
        ? dawn.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        })
        : "--:--:--";
    
    const dusk = weatherSolar?.dusk ? new Date(weatherSolar?.dusk) : null;
    const duskTime = dusk && !Number.isNaN(dusk.getTime())
        ? dusk.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        })
        : "--:--:--";

    useEffect(() => {
        if (!locSelected) {
            setLoading(true);
            return;
        }

        const loadingTimer = setTimeout(() => { setLoading(false) }, 5000);

        return () => {
            clearTimeout(loadingTimer);
        };
    }, [locSelected]);


    return (
        <div className="dashboard-wrapper">
            <div className="dashboard">
                {/* Dashboard Banner */}
                <div className='dashboard-header' style={{display: !checkData ? "none" : "flex"}}>
                    <div className='header-city-name'>
                        <h1>{weatherData.name}</h1>
                        <div style={{textAlign: "right"}}>
                            <span>{lng}</span>
                            <br />
                            <span>{lat}</span>
                        </div>
                    </div>
                    <hr style={{opacity: 0.3}} />
                    <div className='header-city-info'>{weatherData.place}</div>
                </div>

                {/* Dashboard Weather UI */}
                {isLoading ? (
                    <h3 className='loader'>Loading...</h3>
                ) : !checkData ? (
                    <h3 className='err-dashboard'>UNABLE TO GET DATA</h3>
                ) : (
                    <div className='dashboard-data'>
                        <div className='data-current'>
                            <div className='data-card current-condition'>
                                <img src="/public/icons/clear_sky_day.png" alt="weather icon" height={100} width={100} />
                                <div className='condition-details'>
                                    <div className='details-header'>
                                        <h2 className='details-code'>
                                            {weatherCode?.condition ?? "No Data"}
                                        </h2>
                                    </div>
                                    <div className='details-subheader'>
                                        <span>Precipitation: {weatherCurrent?.precipitation?.sg ?? "--"} mm/h</span>
                                        <span style={{margin: "0px 15px"}}>|</span>
                                        <span>Humidity: {weatherCurrent?.humidity?.sg ?? "--"}%</span>
                                    </div>
                                    <div className='details-alert'>
                                        Alert Level :
                                        <span className='details-alertLvl' style={{
                                            background: 
                                                alertLevel === "CRITICAL" ? "#D42C22AA" : alertLevel === "WARNING" ? "#e2bc13aa" : alertLevel === "ADVISORY" ? "#1ba4daaa" : alertLevel === "NONE" ? "#1ddd6daa" : "#868686aa",
                                            marginLeft: "5px"
                                            }}>{alertLevel}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className='current-weather-pin'>
                                <div className='data-card weather-pin pin-date'>
                                    <div className='time-data'>
                                        <span className='data-featured time-icon'></span>
                                        <span className='data-featured time'>{currentTime}</span>
                                    </div>
                                    <div className='other-data'>
                                        <div className='date'>{currentDate}</div>
                                        <div className='solar-header'>Nautical Dawn/Dusk</div>
                                        <div className='solar-data'>Dawn: {dawnTime}  |   Dusk: {duskTime}</div>
                                    </div>
                                </div>
                                <div className='data-card weather-pin pin-wind'>

                                </div>
                                <div className='data-card weather-pin pin-wave'>

                                </div>
                            </div>
                        </div>
                        <div className='data-hourly'></div>
                        <div className='data-daily'></div>
                    </div>
                )
                }
            </div>
        </div>
    )
}