import { useState, useRef, useEffect } from 'react';
import './App.css';

import Map from "./component/map";
import Dashboard from "./component/dashboard";
import Search from "./component/search";



function App() {
  const [locSelected, setLocSelected] = useState(false);
  const [weatherData, setWeatherData] = useState({
    date: null, 
    coordinates: null, 
    name: "", 
    place: "", 
    weather_data: null, 
    bio: null, 
    solar: null
  });
  const [isMiniMode, setIsMiniMode] = useState(false);

  const map = useRef(null);

  useEffect(() => {
    if(locSelected){
      console.log("Location Selected");
      console.log(weatherData);
    }else{
      console.log("Location Not Selected");
    }
  }, [weatherData])

  return (
    <>
      <div id="App" className='main-wrapper'>
        <Map map={map} isMiniMode={isMiniMode} />
        <Search locSelected={locSelected} setLocSelected={setLocSelected} map={map} setWeatherData={setWeatherData} isMiniMode={isMiniMode} setIsMiniMode={setIsMiniMode} />
        <Dashboard weatherData={weatherData} setWeatherData={setWeatherData} locSelected={locSelected} isMiniMode={isMiniMode} />
      </div>
    </>
  )
}

export default App
