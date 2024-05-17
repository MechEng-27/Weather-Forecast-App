import { useState } from "react";
import './App.css';
import Card from './Card.jsx';


export default function App() {

  const [lat, setLat] = useState();
  const [lon, setLon] = useState();
  const [forecast, setForecast] = useState([]);
  const [locationName, setLocationName] = useState();

  const year = new Date().getFullYear();

  function handleLatChange(event){
    setLat(event.target.value);
  };

  function handleLonChange(event){
    setLon(event.target.value);
  };

  // fetch from API based on lat&lon
  function getWeather(){
    if (lat && lon !== ""){
      fetch(`https://api.weather.gov/points/${lat},${lon}`)
      .then(res => res.json())
      .then(data => handleResult(data))
    };
  };

  // first fetch provides grid X&Y end point, needed for results
  function handleResult(input){
    if(input.status == "404"){
      setForecast("Input error - please try again");
    } else {
      const locationName = (input.properties.relativeLocation.properties.city);
      setLocationName(`Weather Forecast for ${locationName}`);
      fetch(input.properties.forecast)
      .then(res => res.json())
      .then(data => renderWeather(data))
    };
  };

  // render weather results
  function renderWeather(forecast){
    setForecast((forecast.properties.periods.map(result => {
      return (<Card
        name = {result.name}
        description = {result.detailedForecast}
      />);
    })));
  };

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
      <div className='location-name'>{locationName}</div>
      <div className ='render-area'>{[forecast]}</div>
      <footer>Weather Forecast App {year}</footer>
    </div>
  );
};



