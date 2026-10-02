import { getDirectionfromValueShort, getDirectionfromValueLong } from '../utils/getDirectionfromValue.jsx';
import { checkWeatherIcon } from '../utils/checkWeatherIcon.jsx';

import ExtendDetails from './ExtendDetails.jsx';

import './HourlyDashboard.css';

export default function HourlyDashboard({ weatherData }){
    const weatherHourly = (weatherData.data?.hourly ?? []);
    
    function getTime(data){
        const date = new Date(data);

        const time = data && !Number.isNaN(date.getTime())
        ? date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        })
        : "--:--:--";

        return time;
    }

    function checkIcon(icon, time) {
        if (!time) return icon;

        const date = new Date(time);
        if (Number.isNaN(date.getTime())) return icon;

        const hour = date.getHours();
        const isNight =
            (icon === "clear_sky" || icon === "cloudy_partly") &&
            hour >= 18;

        return isNight ? `${icon}_night` : icon;
    }

    function toggleDetails(e){
        const wrapper = e.currentTarget;
        const details = wrapper.querySelector(".data-hour-details");
        const selectedRow = wrapper.querySelector(".data-hour-row");

        document.querySelectorAll(".data-hour-details").forEach((div) => {
            if (div !== details) div.classList.remove("details-show");
        });

        document.querySelectorAll(".data-hour-row").forEach((div) => {
            if (div !== selectedRow) div.classList.remove("data-hour-row-selected");
        });

        selectedRow.classList.add("data-hour-row-selected");
        details.classList.add("details-show");
    }


    return (
        <div className="data-card data-weather data-hour">
            <div className='data-hour-row data-hour-header'>
                <div className='hour-header-time'></div>
                <div className='hour-header-temp-air'><img src="/ui-icons/ui-temp-air.png" className='data-ui-icon' /></div>
                <div className='hour-header-temp-water'><img src="/ui-icons/ui-temp-water.png" className='data-ui-icon' /></div>
                <div className='hour-header-alert'></div>
                <div className='hour-header-condition'></div>
                <div className='hour-header-wave'>Wind</div>
                <div className='hour-header-wave'>Wave</div>
                <div className='hour-header-wave'>Swell</div>
            </div>
            { weatherHourly.map((hourData) => (
                <div className='data-hour-wrapper' key={hourData.time} onClick={(e) => toggleDetails(e)}>
                    <div className='data-hour-row'>
                        <div className='hour-time val'>{getTime(hourData.time)}</div>
                        <div className='hour-temp-air val'>{hourData.airTemperature?.sg ?? "---"}&deg;C</div>
                        <div className='hour-temp-air val'>{hourData.waterTemperature?.sg ?? "---"}&deg;C</div>
                        <div className='hour-alert-lvl'>
                            <div className='hour-alert-lvl-dot' style={{
                                background: 
                                    hourData.weatherCode?.alertLevel === "CRITICAL" ? "#D42C22AA" : hourData.weatherCode?.alertLevel === "WARNING" ? "#e2bc13aa" : hourData.weatherCode?.alertLevel === "ADVISORY" ? "#1ba4daaa" : hourData.weatherCode?.alertLevel === "NONE" ? "#1ddd6daa" : "#868686aa",
                                }}>
                            </div>
                        </div>
                        <div className='hour-condition'>
                            <img src={`/weather-icons/${checkWeatherIcon(hourData.weatherCode?.iconId, hourData.time)}.png`} className='data-ui-icon' />
                            <span>{hourData.weatherCode?.condition ?? "No Data"}</span>
                        </div>
                        <div className='hour-data hour-wind val'>
                            <span className='val'>{hourData?.windSpeed?.sg ?? "---"}m/s</span>
                            <img src="/ui-icons/direction-arrow.png" className='data-ui-icon' style={{transform: `rotate(${(Number(hourData?.windDirection?.sg) || 0) + 0}deg)`}}/>
                        </div>
                        <div className='hour-data hour-wave val'>
                            <span className='val'>{hourData?.waveHeight?.sg ?? "---"}m</span>
                            <img src="/ui-icons/direction-arrow.png" className='data-ui-icon' style={{transform: `rotate(${(Number(hourData?.waveDirection?.sg) || 0) + 0}deg)`}}/>
                        </div>
                        <div className='hour-data hour-swell val'>
                            <span className='val'>{hourData?.swellHeight?.sg ?? "---"}m</span>
                            <img src="/ui-icons/direction-arrow.png" className='data-ui-icon' style={{transform: `rotate(${(Number(hourData?.swellDirection?.sg) || 0) + 0}deg)`}}/>
                        </div>

                        <div className=''></div>
                    </div>
                    <div className='data-hour-details'>
                        <ExtendDetails data={hourData} />
                    </div>
                </div>
            ))

            }
        </div>
    )
}