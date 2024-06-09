import React, { useEffect, useRef, useState } from 'react'
import './Weather.css'
import searchicon from '../assets/search.png'
import clearicon from '../assets/clear.png'
import cloudicon from '../assets/cloud.png'
import drizzleicon from '../assets/drizzle.png'
import rainicon from '../assets/rain.png'
import snowicon from '../assets/snow.png'
import windicon from '../assets/wind.png'
import humidityicon from '../assets/humidity.png'
import nighticon from '../assets/night.png'
import fewcloudsicon from '../assets/fewclouds.png'
import nightrainicon from '../assets/nightrain.png'




const Weather = () => {

    const inputRef = useRef()
    const [weatherData, setWeatherData] = useState(false)

    const allIcons = {
        "01d": clearicon,
        "01n": nighticon,
        "02d": cloudicon,
        "02n": fewcloudsicon,
        "03d": clearicon,
        "03n": clearicon,
        "04d": drizzleicon,
        "04n": drizzleicon,
        "09d": rainicon,
        "09n": rainicon,
        "010d": rainicon,
        "010n": nightrainicon,
        "013d": snowicon,
        "013n": snowicon,
    }

    const search = async (city) => {
        if (city === "") {
            alert("Please enter city name")
            return
        }
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_WEATHER_APP_ID}`

            const response = await fetch(url)
            const data = await response.json()

            if(!response.ok){
                alert(data.message)
                return
            }

            console.log(data)
            const icon = allIcons[data.weather[0].icon] || clearicon
            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                icon: icon
            })

        }
        catch (error) {
            setWeatherData(false)
            console.error("Error in fetching data")
        }
    }

    useEffect(() => {
        search("Nepal")
    }, [])

    return (
        <div className='weather'>

            <div className="search-bar">
                <input ref={inputRef} type='text' placeholder='search' />
                <img src={searchicon} alt='' onClick={() => search(inputRef.current.value)} />
            </div>

            {weatherData ? <>
                <img src={weatherData.icon} alt='' className='weathericon' />
                <p className='temp'>{weatherData.temperature}°C</p>
                <p className='location'>{weatherData.location}</p>
                <div className="weather-data">
                    <div className="col">
                        <img src={humidityicon} alt='' />
                        <div>
                            <p>{weatherData.humidity} %</p>
                            <span>Humidity</span>
                        </div>
                    </div>
                    <div className="col">
                        <img src={windicon} alt='' />
                        <div>
                            <p>{weatherData.windSpeed} Km/h</p>
                            <span>Wind Speed</span>
                        </div>
                    </div>
                </div>
            </> : <></>}



        </div>
    )
}

export default Weather
