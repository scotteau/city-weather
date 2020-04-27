import React, { useEffect, useRef, useState } from "react";
import { City } from "../index";
import { Mode } from "./App";
import Axios from "axios";

export enum Usage {
    Feature,
    Normal,
}

interface CityWeather {
    city: string;
    date: Date;
    temp: number;
    forecast: [];
}

interface myProps {
    city: City;
    usage?: Usage;
    useBg?: boolean;
    editMode: boolean;
    theme: Mode;
    index?: number;
    cardActions?: any;
}

class Weather {
    date: number;
    temp: number;
    description: string;

    constructor(date: number, temp: number, description: string) {
        this.date = date;
        this.temp = temp;
        this.description = description;
    }
}

interface Report {
    current: Weather;
    daily: Weather[];
}

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

const Card = ({
                  city,
                  usage = Usage.Normal,
                  useBg = true,
                  editMode,
                  theme = Mode.light,
                  index,
                  cardActions,
              }: myProps) => {
    const imageRef = useRef(null) as any;
    const [spans, setSpans] = useState(0);
    const [shouldConfig, setShouldConfig] = useState(false);
    const [shouldShowControl, setShouldShowControl] = useState(false);
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

    const calculateAndSetCorrectSpan = () => {
        const height = imageRef.current.clientHeight;
        const spanHeight = 4;
        setSpans(Math.round(height / spanHeight) + 1);
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
        imageRef.current.addEventListener("load", () => {
            calculateAndSetCorrectSpan();
        });
        window.addEventListener("resize", () => {
            calculateAndSetCorrectSpan();
        });
    });

    useEffect(() => {
        setShouldConfig(editMode);
    }, [editMode]);

    useEffect(() => {
        const fetchWeather = async () => {
            if (usage === Usage.Feature && city) {
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

                const info =
                    {
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
    }, [city, usage]);

    const renderControls = () => {
        const controls = ["publish", "refresh", "info"];

        const onPublish = () => {
            cardActions("publish", index);
        };
        const onRefresh = () => {
            cardActions("refresh", index);
        };
        const onMoreInfo = () => {
            console.log("more info");
            // open a new tab on unsplash about this photo
            const url =
                theme === Mode.light ? city.cover.day.link : city.cover.night.link;
            window.open(url, "_blank");
        };

        const actions = [onPublish, onRefresh, onMoreInfo];

        return controls.map((icon, index) => {
            return (
                <button
                    key={`${icon}-${index}`}
                    onClick={shouldShowControl ? actions[index] : () => {}}
                >
                    <span className={"material-icons"}>{icon}</span>
                </button>
            );
        });
    };

    const renderDate = (sec: number) => {
        return new Date(sec * 1000).toDateString();
    };

    return (
        <div
            className={`card ${usage === Usage.Feature && "card--feature"}`}
            style={useBg ? loadImage() : { gridRowEnd: `span ${spans}` }}
            onClick={() => {
                usage === Usage.Normal &&
                !editMode &&
                setShouldShowControl(!shouldShowControl);
            }}
            onMouseLeave={() => {
                usage === Usage.Normal && setShouldShowControl(false);
            }}
        >
            {editMode && (
                <button
                    className={"delete"}
                    onClick={() => {
                        cardActions("delete", usage === Usage.Feature ? 0 : index);
                    }}
                >
                    <span className="material-icons">close</span>
                </button>
            )}

            <div className="card__info">
                {usage === Usage.Feature && (
                    <ul className={"forecast"}>{weatherReport && renderForecast()}</ul>
                )}

                <div className="current">
                    <h3
                        className="current__city"
                        style={shouldShowControl ? { opacity: 0 } : {}}
                    >
                        {city.name}
                    </h3>
                    {isFetching && <div className="loader">Loading...</div>}

                    {usage === Usage.Feature && (
                        <span className="current__date">
              {isFetching ? "" : renderDate(weatherReport?.current.date)}
            </span>
                    )}

                    {usage === Usage.Normal && (
                        <div
                            className="current__controls"
                            style={shouldShowControl ? { opacity: "1" } : {}}
                        >
                            {renderControls()}
                        </div>
                    )}
                </div>

                {usage === Usage.Feature && (
                    <div className="weather">
            <span className="weather__condition">
              {isFetching ? "" : weatherReport?.current?.description}
            </span>
                        <span className="weather__temp">
              {isFetching ? "" : `${Math.round(weatherReport?.current.temp)}°`}
            </span>
                    </div>
                )}
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
                style={useBg ? { display: "none" } : {}}
            />
        </div>
    );
};

export default Card;
