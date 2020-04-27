import React, { useEffect, useRef, useState } from "react";
import Axios from "axios";
import {
  City,
  Mode,
  OpenWeatherResType,
  Report,
  Usage,
  Weather,
} from "../Model";
import Loader from "./Loader";

interface myProps {
  city: City;
  editMode: boolean;
  theme: Mode;
  index?: number;
  cardActions?: any;
}

const Feature = ({
  city,
  editMode,
  theme = Mode.light,
  cardActions,
}: myProps) => {
  const imageRef = useRef(null) as any;
  const [shouldConfig, setShouldConfig] = useState(false);
  const [weatherReport, setWeatherReport] = useState<Report | any>(null);
  const [isFetching, setIsFetching] = useState(false);

  let imageUrl: string;

  if (city) {
    imageUrl =
      theme === Mode.light ? city?.cover?.day?.url : city?.cover?.night?.url;
  } else {
    imageUrl = "";
  }

  const loadImage = () => {
    return {
      backgroundImage: `url(${imageUrl})`,
      backgroundPosition: "center",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
    };
  };


  const renderForecast = () => {
    let forecast = [] as any[];
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    if (weatherReport) {
      for (let i = 0; i < 5; i++) {
        const forecastData = weatherReport.daily;
        const weekDay = new Date(forecastData[i].date * 1000).getDay();

        const daily = {
          date: i === 0 ? "Tomorrow" : days[weekDay + 1],
          temp: forecastData[i].temp,
          description: forecastData[i].description,
        };

        const item = (
          <li key={i} className={"forecast__weather"}>
            <span className={"forecast__weather__date"}>
              {isFetching ? "" : daily.date}
            </span>
            <span className="forecast__weather__temp">
              {isFetching ? "" : `${daily.temp}°`}
            </span>
            <span className="forecast__weather__condition">
              {isFetching ? "" : daily.description}
            </span>
          </li>
        );
        forecast.push(item);
      }
    }

    return forecast;
  };


  useEffect(() => {
    setShouldConfig(editMode);
  }, [editMode]);

  useEffect(() => {
    const fetchWeather = async () => {
      if (city) {
        setIsFetching(true);
        const weatherRequest = await Axios.get(
          "https://api.openweathermap.org/data/2.5/onecall?",
          {
            params: {
              lat: city.lat,
              lon: city.lng,
              units: "metric",
              appid: process.env.REACT_APP_OPEN_WEATHER_APPID,
            },
          }
        );

        const weatherData = weatherRequest.data as OpenWeatherResType;
        setIsFetching(false);

        const info = {
          current: {
            date: weatherData.current.dt,
            temp: weatherData.current.temp,
            description: weatherData.current.weather[0].description,
          },
          daily: weatherData.daily.map<Weather>(
            (w) =>
              new Weather(
                w.dt,
                Math.round(w.temp.day),
                w.weather[0].description
              )
          ),
        } as Report;

        setWeatherReport(info);
      }
    };

    fetchWeather();
  }, [city]);


  const renderDate = (sec: number) => {
    return new Date(sec * 1000).toDateString();
  };

  return (
    <div
      className={`card card--feature`}
      style={loadImage()}
    >
      {editMode && (
        <button
          className={"delete"}
          onClick={() => {
            cardActions("delete", 0);
          }}
        >
          <span className="material-icons">close</span>
        </button>
      )}

      <div className="card__info">
        <ul className={"forecast"}>{weatherReport && renderForecast()}</ul>

        <div className="current">
          <h3
            className="current__city"
          >
            {city.name}
          </h3>
          {isFetching && <Loader />}
          <span className="current__date">
            {!isFetching && renderDate(weatherReport?.current.date)}
          </span>
        </div>

          <div className="weather">
            <span className="weather__condition">
              {isFetching ? "" : weatherReport?.current?.description}
            </span>
            <span className="weather__temp">
              {isFetching ? "" : `${Math.round(weatherReport?.current.temp)}°`}
            </span>
          </div>
      </div>
      <div
        className="card__overlay"
        style={shouldConfig ? { background: "#ab47bc", opacity: 0.9 } : {}}
      >
        <></>
      </div>
      <img
        ref={imageRef}
        src={imageUrl}
        alt={"city"}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default Feature;
