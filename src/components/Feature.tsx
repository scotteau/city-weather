import React, { useEffect, useRef, useState } from "react";
import { CardAction, City, Mode, Report } from "../Model";
import Loader from "./Loader";
import fetchWeather from "../apis/weather.api";

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

  const loadImageAdBackground = () => {
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

    if (weatherReport && weatherReport.length !== 0) {
      for (let i = 0; i < 5; i++) {
        const forecastData = weatherReport?.daily;
        const weekDay = new Date(forecastData[i].date * 1000).getDay();

        const daily = {
          date: i === 0 ? "Tomorrow" : days[(weekDay + 1) > days.length-1 ? 0 : weekDay + 1],
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

  const retrieveWeather = async (city: City) => {
    setIsFetching(true);
    const report = await fetchWeather(city);
    setWeatherReport(report);
    setIsFetching(false);
  };

  const renderDate = (sec: number) => {
    return new Date(sec * 1000).toDateString();
  };

  const hidden = { display: "none" };
  const overlayStyle = shouldConfig
    ? { background: "#ab47bc", opacity: 0.9 }
    : {};

  useEffect(() => {
    setShouldConfig(editMode);
  }, [editMode]);

  useEffect(() => {
    retrieveWeather(city);
  }, [city]);

  return (
    <div className={`card card--feature`} style={loadImageAdBackground()}>
      {editMode && (
        <button
          className={"delete"}
          onClick={() => cardActions(CardAction.DELETE, 0)}
        >
          <span className="material-icons">close</span>
        </button>
      )}

      <div className="card__info">
        <ul className={"forecast"}>{weatherReport && renderForecast()}</ul>

        <div className="current">
          <h3 className="current__city">{city.name}</h3>
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
      <div className="card__overlay" style={overlayStyle}>
        <></>
      </div>
      <img ref={imageRef} src={imageUrl} alt={"city"} style={hidden} />
    </div>
  );
};

export default Feature;
