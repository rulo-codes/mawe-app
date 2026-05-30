import { useState, useRef, useEffect } from 'react';
import './App.css';

import Map from "./component/map";
import Dashboard from "./component/dashboard";
import Search from "./component/search";



function App() {
  const [locSelected, setLocSelected] = useState(false);

  const map = useRef(null);

  useEffect(() => {
    if(locSelected){
      console.log("Location Selected");
    }else{
      console.log("Location Not Selected");
    }
  }, [locSelected])

  return (
    <>
      <div id="App" className='main-wrapper'>
        <Map map={map} />
        <Search locSelected={locSelected} setLocSelected={setLocSelected} map={map} />
        <Dashboard />
      </div>
    </>
  )
}

export default App
