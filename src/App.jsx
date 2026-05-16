import { useState, useRef } from 'react';
import './App.css';

import Map from "./component/map";
import Search from "./component/search";


function App() {
  const map = useRef(null);

  return (
    <>
      <div id="App" className='main-wrapper'>
        <Map map={map} />

        <div className="panel">
          <div className="panel-wrapper">
            <Search map={map} />
          </div>
        </div>

      </div>
    </>
  )
}

export default App
