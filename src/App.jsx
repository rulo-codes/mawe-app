import { useState } from 'react';
import './App.css';

import Map from "./component/map";


function App() {
  return (
    <>
      <div id="App">
        <Map />
        <div className="panel"></div>
      </div>
    </>
  )
}

export default App
