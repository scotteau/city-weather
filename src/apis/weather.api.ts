import Axios from "axios";
import { City, Report, Weather } from "../Model";

interface OpenWeatherResType {
  lat: number;
  lon: number;
  timezone: string;
  current: {
    dt: number;
    sunrise: number;
    sunset: number;
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    dew_point: number;
    uvi: number;
    clouds: number;
    visibility: number;
    wind_speed: number;
    wind_deg: number;
    weather: [
      {
        id: number;
        main: string;
        description: string;
        icon: string;
      }
    ];
  };
  daily: {
    dt: number;
    sunrise: number;
    sunset: number;
    temp: {
      day: number;
      min: number;
      max: number;
      night: number;
      eve: number;
      morn: number;
    };
    feels_like: {
      day: number;
      night: number;
      eve: number;
      morn: number;
    };
    pressure: number;
    humidity: number;
    dew_point: number;
    wind_speed: number;
    wind_deg: number;
    weather: [
      {
        id: number;
        main: string;
        description: string;
        icon: string;
      }
    ];
    clouds: number;
    uvi: number;
  }[];
}

const fetchWeather = async (city: City) => {
  try {
    const weatherRequest = await Axios.get(
      "https://api.openweathermap.org/data/2.5/onecall",
      {
        params: {
          lat: city.lat,
          lon: city.lng,
          units: "metric",
          appid: process.env.REACT_APP_OPEN_WEATHER_APPID,
        },
      }
    );

    const weatherData = (await weatherRequest.data) as OpenWeatherResType;

    const report = {
      current: {
        date: weatherData.current.dt,
        temp: weatherData.current.temp,
        description: weatherData.current.weather[0].description,
      },
      daily: weatherData.daily.map<Weather>(
        (w) =>
          new Weather(w.dt, Math.round(w.temp.day), w.weather[0].description)
      ),
    } as Report;

    return report;


  } catch (e) {
    console.log(e);
  }


};

export default fetchWeather;
