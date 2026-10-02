import { getDirectionfromValueShort, getDirectionfromValueLong } from '../utils/getDirectionfromValue.jsx';

export default function ExtendDetails({data}){
    return(
        <div className="extend-details-list">
            <div className='data-current-list'>
                <div className='data-card data-current-wave'>
                    <div className='data-label'>
                        <img src='/ui-icons/ui-wave.png' className='data-ui-icon'></img>
                        <span style={{margin: "0px 8px"}}>Wave</span> 
                    </div>
                    <div className='current-wave'>
                        <div style={{fontFamily: "var(--secondary-font)", textTransform: "uppercase", wordSpacing: "6px"}}>Height: <span className='val'>{data?.waveHeight?.sg ?? "---"} m</span></div>
                        <div style={{fontFamily: "var(--secondary-font)", textTransform: "uppercase", wordSpacing: "6px"}}>Period: <span className='val'>{data?.wavePeriod?.sg ?? "---"} m/s</span></div>
                        <div className='val'>{getDirectionfromValueShort(data?.waveDirection?.sg)}</div>
                    </div>
                </div>
                <div className='data-card data-current-swell'>
                    <div className='data-label'>
                        <img src='/ui-icons/ui-swell.png' className='data-ui-icon'></img>
                        <span style={{margin: "0px 8px"}}>Swell</span> 
                    </div>
                    <div className='current-swell'>
                        <div style={{fontFamily: "var(--secondary-font)", textTransform: "uppercase", wordSpacing: "6px"}}>Height: <span className='val'>{data?.swellHeight?.sg ?? "---"} m</span></div>
                        <div style={{fontFamily: "var(--secondary-font)", textTransform: "uppercase", wordSpacing: "6px"}}>Period: <span className='val'>{data?.swellPeriod?.sg ?? "---"} m/s</span></div>
                        <div className='val'>{getDirectionfromValueShort(data?.swellDirection?.sg)}</div>
                    </div>
                </div>
            </div>
            <div className='data-current-other-list'>

                <div className='data-card data-current-wind'>
                    <div className='data-label'>
                        <img src='/ui-icons/ui-wind.png' className='data-ui-icon'></img>
                        <span style={{margin: "0px 8px"}}>Wind</span> 
                    </div>
                    <div className='current-wind val'>{data?.windSpeed?.sg ?? "---"}m/s  {getDirectionfromValueShort(data?.windDirection?.sg)}</div>
                </div>
                <div className='data-card data-current-gust'>
                    <div className='data-label'>
                        <img src='/ui-icons/ui-gust.png' className='data-ui-icon'></img>
                        <span style={{margin: "0px 8px"}}>Gust</span> 
                    </div>
                    <div className='current-gust val'>{data?.gust?.sg ?? "---"}m/s </div>
                </div>
                <div className='data-card data-current-sea-level'>
                    <div className='data-label'>
                        <img src='/ui-icons/ui-sea-level.png' className='data-ui-icon'></img>
                        <span style={{margin: "0px 8px"}}>Sea Level</span> 
                    </div>
                    <div className='current-sea-level val'>{data?.seaLevel?.sg ?? "---"}m </div>
                </div>
                <div className='data-card data-current-curr'>
                    <div className='data-label'>
                        <img src='/ui-icons/ui-current.png' className='data-ui-icon'></img>
                        <span style={{margin: "0px 8px"}}>Current</span> 
                    </div>
                    <div className='current-curr val'>{data?.currentSpeed?.sg ?? "---"}m/s      {getDirectionfromValueShort(data?.currentDirection?.sg)}</div>
                </div>
                <div className='data-card data-current-temp'>
                    <div className='data-label'>
                        <img src='/ui-icons/ui-temp-air.png' className='data-ui-icon'></img>
                        <span style={{margin: "0px 8px"}}>Temp</span> 
                    </div>
                    <div className='current-air-temp val'>{data?.airTemperature?.sg ?? "---"}&deg;C </div>
                </div>
                <div className='data-card data-current-pressure'>
                    <div className='data-label'>
                        <img src='/ui-icons/ui-air-pressure.png' className='data-ui-icon'></img>
                        <span style={{margin: "0px 8px"}}>Air Pressure</span> 
                    </div>
                    <div className='current-air-pressure val'>{data?.pressure?.sg ?? "---"} hPa</div>
                </div>
                <div className='data-card data-current-humidity'>
                    <div className='data-label'>
                        <img src='/ui-icons/ui-humidity.png' className='data-ui-icon'></img>
                        <span style={{margin: "0px 8px"}}>Humidity</span> 
                    </div>
                    <div className='current-humidity val'>{data?.humidity?.sg ?? "---"}%</div>
                </div>
                <div className='data-card data-current-precep'>
                    <div className='data-label'>
                        <img src='/ui-icons/ui-precep.png' className='data-ui-icon'></img>
                        <span style={{margin: "0px 8px"}}>Precepitation</span> 
                    </div>
                    <div className='current-precep val'>{data?.precipitation?.sg ?? "---"}mm/h</div>
                </div>
                <div className='data-card data-current-cloud-cover'>
                    <div className='data-label'>
                        <img src='/ui-icons/ui-cloud-cover.png' className='data-ui-icon'></img>
                        <span style={{margin: "0px 8px"}}>Cloud Cover</span> 
                    </div>
                    <div className='current-cloud-cover val'>{data?.cloudCover?.sg ?? "---"}%</div>
                </div>
                <div className='data-card data-current-visibility'>
                    <div className='data-label'>
                        <img src='/ui-icons/ui-visibility.png' className='data-ui-icon'></img>
                        <span style={{margin: "0px 8px"}}>Visibility</span> 
                    </div>
                    <div className='current-visibility val'>{data?.visibility?.sg ?? "---"} km</div>
                </div>

            </div>
        </div>
    )
}