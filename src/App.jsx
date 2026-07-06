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
        <Map map={map} />
        <Search locSelected={locSelected} setLocSelected={setLocSelected} map={map} setWeatherData={setWeatherData} />
        <Dashboard weatherData={weatherData} setWeatherData={setWeatherData} locSelected={locSelected}/>
      </div>
    </>
  )
}

export default App
