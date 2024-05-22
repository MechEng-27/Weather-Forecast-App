import { useState, useEffect } from "react";
import './App.css';
import Card from './Card.jsx';

export default function App() {

  const [lat, setLat] = useState();
  const [lon, setLon] = useState();
  const [locationName, setLocationName] = useState();
  // render weather result or error
  const [forecast, setForecast] = useState([]);

  // handle previous results from local storage
  const [prevLat, setPrevLat] = useState();
  const [prevLon, setPrevLon] = useState();
  const [prevName, setPrevName] = useState();
  // show button for previous result
  const [renderPrev, setRenderPrev] = useState(false);
  // upon click of previous location button,
  // render weather forecast
  const [runPrev, setRunPrev] = useState (false);

  const year = new Date().getFullYear();
  
  // get valid, saved local data and render button to get weather
  // for previous location
  useEffect(() => {
    if (localStorage.getItem('prevName') !== null){
      setPrevLat(localStorage.getItem('prevLat'));
      setPrevLon(localStorage.getItem('prevLon'));
      setPrevName(localStorage.getItem('prevName'));
      setRenderPrev(true);
    }
  }, [prevName]);

  // render weather for previous valid weather location
  // upon button click
  useEffect(() => {
    getWeather()
    setRenderPrev(false);
  },[runPrev]);

// if new search, hide previous result button
  useEffect(() => {
    setRenderPrev(false);
  },[locationName]);

  function handleLatChange(event){
    setLat(event.target.value);
  };

  function handleLonChange(event){
    setLon(event.target.value);
  };

  // fetch weather for previously saved result
  function prevWeather(){
    setLat(prevLat);
    setLon(prevLon);
    setRunPrev(true);
  }

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
      // prevent name from remaining from previous search
      setLocationName('')
      setForecast("Input error - please try again");
    } else {
      const locationName = (input.properties.relativeLocation.properties.city);
      setLocationName(`Weather Forecast for ${locationName}`);
      fetch(input.properties.forecast)
      .then(res => res.json())
      .then(data => renderWeather(data))
      // set previous location data
      localStorage.setItem('prevLat', lat);
      localStorage.setItem('prevLon', lon);
      localStorage.setItem('prevName', locationName);
      setPrevName(locationName);
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
    <div className = 'main-box'>
      <h1>Weather Forecast App</h1>
      <div className = 'input-box'>
        <input
          type = "text"
          placeholder = 'Enter Latitude'
          onChange = {handleLatChange}
          value = {lat}
        />
        <input
          type = "text"
          placeholder = 'Enter Longitude'
          onChange = {handleLonChange}
          value = {lon}
        />
        <button onClick = {getWeather}>Get Weather</button>
        {renderPrev ? 
          <button
          onClick = {prevWeather}
          >Get {prevName} Weather</button> : '' }
      </div>
      <div className = 'location-name'>{locationName}</div>
      <div className = 'render-area'>{[forecast]}</div>
      <footer>Weather Forecast App {year}</footer>
    </div>
  );
};



