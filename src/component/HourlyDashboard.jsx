import { getDirectionfromValueShort, getDirectionfromValueLong } from '../utils/getDirectionfromValue.jsx';

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

    return (
        <div className="data-card data-weather data-hour">
            <div className='data-hour-row data-hour-header'>
                <div className='hour-header-time'></div>
                <div className='hour-header-temp-air'></div>
                <div className='hour-header-condition'></div>
                <div className='hour-header-wave'>Wind</div>
                <div className='hour-header-wave'>Wave</div>
                <div className='hour-header-wave'>Swell</div>
            </div>
            { weatherHourly.map((hourData) => (
                <div className='data-hour-row' key={hourData.time}>
                    <div className='hour-time val'>{getTime(hourData.time)}</div>
                    <div className='hour-temp-air val'>{hourData.airTemperature?.sg ?? "---"}&deg;C</div>
                    <div className='hour-condition'>
                        <img src={`/weather-icons/${hourData.weatherCode?.iconId}.png`} className='data-ui-icon' />
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
                    <div className='hour-data hour-wave val'>
                        <span className='val'>{hourData?.swellHeight?.sg ?? "---"}m</span>
                        <img src="/ui-icons/direction-arrow.png" className='data-ui-icon' style={{transform: `rotate(${(Number(hourData?.swellDirection?.sg) || 0) + 0}deg)`}}/>
                    </div>



                    <div className=''></div>
                </div>
            ))

            }
        </div>
    )
}