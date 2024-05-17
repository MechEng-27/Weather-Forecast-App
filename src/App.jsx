import { useState } from "react";
import './App.css';
import Card from './Card.jsx'


function App() {

  const [lat, setLat] = useState();
  const [lon, setLon] = useState();
  const [forecast, setForecast] = useState(["mega"]);

  function handleLatChange(event){
    setLat(event.target.value);
  }

  function handleLonChange(event){
    setLon(event.target.value);
  }

  function getWeather(){
    if (lat && lon !== ""){
      console.log(lat)
      console.log(lon)
      fetch(`https://api.weather.gov/points/${lat},${lon}`)
      .then(res => res.json())
      .then(data => handleResult(data))
    }
  }

  // note, notice the endpoint is provided, forward to render function
  function handleResult(data){
    if(data.status == "404"){
      console.log('error')
    } else {
      console.log('running')
      fetch(data.properties.forecast)
      .then(res => res.json())
      .then(data => renderWeather(data))
    }
  }

  function renderWeather(forecast){
    console.log(forecast)
    setForecast((forecast.properties.periods.map(result => {
      return (<Card
        name = {result.name}
        description = {result.detailedForecast}
      />)
    })))
  }

  return (
    <div className='main-box'>
      <h1>Weather Forecast App</h1>
      <div className='input-box'>
        <input
          type="text"
          placeholder='Enter Latitude'
          onChange={handleLatChange}
          value={lat}
        />
        <input
          type="text"
          placeholder='Enter Longitude'
          onChange={handleLonChange}
          value={lon}
        />
        <button onClick={getWeather}>Get Weather</button>
      </div>
      <div className ='render-area'>{[forecast]}</div>
    </div>
  )
}

export default App
