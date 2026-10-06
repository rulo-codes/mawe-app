import { getDirectionfromValueShort, getDirectionfromValueLong } from '../utils/getDirectionfromValue.jsx';
import { checkWeatherIcon } from '../utils/checkWeatherIcon.jsx';

import ExtendDetails from './ExtendDetails.jsx';

import './DailyDashboard.css';

export default function DailyDashboard({ weatherData }){
    const weatherDaily = (weatherData.data?.daily ?? []);
    const date = new Date();
    
    function getDay(data){
        const date = new Date(data);

        const day = data && !Number.isNaN(date.getTime())
        ? date.toLocaleString([], {
            month: '2-digit',
            day: '2-digit',
        })
        : "--/--";

        return day;
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
        const details = wrapper.querySelector(".data-day-details");
        const selectedRow = wrapper.querySelector(".data-day-row");

        document.querySelectorAll(".data-day-details").forEach((div) => {
            if (div !== details) div.classList.remove("details-show");
        });

        document.querySelectorAll(".data-day-row").forEach((div) => {
            if (div !== selectedRow) div.classList.remove("data-day-row-selected");
        });

        selectedRow.classList.add("data-day-row-selected");
        details.classList.add("details-show");
    }


    return (
        <div className="data-card data-weather data-day">
            <div className='data-day-row data-day-header'>
                <div className='day-header-time'></div>
                <div className='day-header-temp-air'><img src="/ui-icons/ui-temp-air.png" className='data-ui-icon' /></div>
                <div className='day-header-temp-water'><img src="/ui-icons/ui-temp-water.png" className='data-ui-icon' /></div>
                <div className='day-header-alert'></div>
                <div className='day-header-condition'></div>
                <div className='day-header-wave'>Wind</div>
                <div className='day-header-wave'>Wave</div>
                <div className='day-header-wave'>Swell</div>
            </div>
            { weatherDaily.map((dayData) => (
                <div className='data-day-wrapper' key={dayData.time} onClick={(e) => toggleDetails(e)}>
                    <div className='data-day-row'>
                        <div className='day-time val'>{getDay(dayData.time)}</div>
                        <div className='day-temp-air val'>{dayData.airTemperature?.sg ?? "---"}&deg;C</div>
                        <div className='day-temp-air val'>{dayData.waterTemperature?.sg ?? "---"}&deg;C</div>
                        <div className='day-alert-lvl'>
                            <div className='day-alert-lvl-dot' style={{
                                background: 
                                    dayData.weatherCode?.alertLevel === "CRITICAL" ? "#D42C22AA" : dayData.weatherCode?.alertLevel === "WARNING" ? "#e2bc13aa" : dayData.weatherCode?.alertLevel === "ADVISORY" ? "#1ba4daaa" : dayData.weatherCode?.alertLevel === "NONE" ? "#1ddd6daa" : "#868686aa",
                                }}>
                            </div>
                        </div>
                        <div className='day-condition'>
                            <img src={`/weather-icons/${checkWeatherIcon(dayData.weatherCode?.iconId, date)}.png`} className='data-ui-icon' />
                            <span>{dayData.weatherCode?.condition ?? "No Data"}</span>
                        </div>
                        <div className='day-data day-wind val'>
                            <span className='val'>{dayData?.windSpeed?.sg ?? "---"}m/s</span>
                            <img src="/ui-icons/direction-arrow.png" className='data-ui-icon' style={{transform: `rotate(${(Number(dayData?.windDirection?.sg) || 0) + 0}deg)`}}/>
                        </div>
                        <div className='day-data day-wave val'>
                            <span className='val'>{dayData?.waveHeight?.sg ?? "---"}m</span>
                            <img src="/ui-icons/direction-arrow.png" className='data-ui-icon' style={{transform: `rotate(${(Number(dayData?.waveDirection?.sg) || 0) + 0}deg)`}}/>
                        </div>
                        <div className='day-data day-swell val'>
                            <span className='val'>{dayData?.swellHeight?.sg ?? "---"}m</span>
                            <img src="/ui-icons/direction-arrow.png" className='data-ui-icon' style={{transform: `rotate(${(Number(dayData?.swellDirection?.sg) || 0) + 0}deg)`}}/>
                        </div>

                        <div className=''></div>
                    </div>
                    <div className='data-day-details'>
                        <ExtendDetails data={dayData} />
                    </div>
                </div>
            ))

            }
        </div>
    )
}