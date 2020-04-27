import React, { useEffect, useRef, useState } from "react";
import Axios from "axios";
import {CardImage, City, Mode} from "./Model";
import Card from "./components/Card";
import Navbar from "./components/Navbar";
import Feature from "./components/Feature";

interface myProps {
  cities?: City[];
}

const App = ({ cities }: myProps) => {
  const [mode, setMode] = useState(Mode.light);
  const [data, setData] = useState(cities);
  const [editMode, setEditMode] = useState(false);
  const [currentCityName, setCurrentCityName] = useState("");
  const [addingCity, setAddingCity] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const inputElement = useRef(null);

  const numberOfImages = 30;

  const handleChanges = (command: string) => {
    if (command === "add a city") {
      setAddingCity(true);
    }

    if (command === "toggle mode") {
      //todo - switching between light and dark
      setMode(mode === Mode.light ? Mode.dark : Mode.light);
      window.scrollTo(0, 0);
    }

    if (command === "toggle edit") {
      setEditMode(!editMode);
    }
  };

  const renderCards = () => {
    if (data && data.length !== 0) {
      return data.map((city, index) => {
        if (index !== 0) {
          return (
              <Card
                  city={city}
                  key={`${city}-${index}`}
                  editMode={editMode}
                  theme={mode}
                  index={index}
                  cardActions={onCardActions}
              />
          );
        } else {
          return null;
        }
      });
    }
  };

  const onCardActions = (action: string, index: number) => {
    if (!data) return;

    if (action === "publish") {
      const payload = data[index] as City;
      const updatedData = data.filter((city, i) => i !== index);
      setData([payload, ...updatedData]);
      window.scrollTo(0, 0);
    }

    if (action === "delete") {
      console.log(index, action);
      const updatedData = Array.from(data).filter((c, i) => i !== index);
      setData(updatedData);
      if (updatedData.length === 0) {
        setEditMode(false);
      }
    }

    if (action === "refresh") {
      console.log("refresh");
      const city = data[index] as City;

      const randomIndex = Math.floor(Math.random() * numberOfImages);

      const updatedCity: City = {
        ...city,
      };

      updatedCity.cover.day =
          mode === Mode.light
              ? city.backupImages.day[randomIndex]
              : city.cover.day;
      updatedCity.cover.night =
          mode === Mode.dark
              ? city.backupImages.night[randomIndex]
              : city.cover.night;
    }

    localStorage.setItem("cities", JSON.stringify(data));
  };

  useEffect(() => {
    if (inputElement.current) {
      // @ts-ignore
      inputElement.current.focus();
      // @ts-ignore
      inputElement.current.select();
    }
  }, [addingCity]);

  const fetchingData = async (e: any) => {
    e.preventDefault();
    setIsFetching(true);

    const query = currentCityName;
    const query_dark = `${currentCityName} night`;

    try {
      const googleGeocodingUrl =
          "https://maps.googleapis.com/maps/api/geocode/json";

      const geocoding_response = await Axios.get(googleGeocodingUrl, {
        params: {
          address: currentCityName,
          key: process.env.REACT_APP_GOOGLE_GEOCODING_ACCESS_KEY,
        },
      });

      const geocodingData = await geocoding_response.data.results[0];
      const lat = geocodingData.geometry.location.lat;
      const lng = geocodingData.geometry.location.lng;
      const cityName = geocodingData.address_components[0].long_name;

      if (cityName.match(/\d+/)) {
        console.log(lat, lng, cityName);
        console.log("not valid city name, should do something"); // todo - catch this error
        throw new Error("not valid city name!");
      } // good - can get geocoding

      // next - go further to get weather and images

      const unsplashBaseUrl = "https://api.unsplash.com/search/photos";
      const unsplash_response_light = await Axios.get(unsplashBaseUrl, {
        headers: {
          Authorization: process.env.REACT_APP_UNSPLASH_ACCESS_KEY,
        },
        params: {
          query: query,
          per_page: numberOfImages,
        },
      });


      const unsplash_response_dark = await Axios.get(unsplashBaseUrl, {
        headers: {
          Authorization: process.env.REACT_APP_UNSPLASH_ACCESS_KEY,
        },
        params: {
          query: query_dark,
          per_page: numberOfImages,
        },
      });

      const imagesData_light = unsplash_response_light.data.results.map(
          (p: any) => {
            return new CardImage(
                p.urls.regular,
                p.id,
                p.links.html,
                p.alt_description
            );
          }
      );
      const imagesData_dark = unsplash_response_dark.data.results.map(
          (p: any) => {
            return new CardImage(
                p.urls.regular,
                p.id,
                p.links.html,
                p.alt_description
            );
          }
      );

      const randomIndex = Math.floor(Math.random() * numberOfImages);

      const city: City = {
        name: cityName,
        lat: lat,
        lng: lng,
        backupImages: {
          day: [...imagesData_light],
          night: [...imagesData_dark],
        },
        cover: {
          day: imagesData_light[randomIndex],
          night: imagesData_dark[randomIndex],
        },
      };

      if (data && data.length !== 0) {
        setData([...data, city]);
      } else {
        setData([city]);
      }

      //reset ui
      setCurrentCityName("");
      setAddingCity(false);
      setIsFetching(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    localStorage.setItem("cities", JSON.stringify(data));
  }, [data]);

  return (
      //region Structure JSX
      <div
          className={"container"}
          id={"start"}
          style={mode === Mode.dark ? { backgroundColor: "#212121" } : {}}
      >
        <Navbar onChanges={handleChanges} theme={mode} editMode={editMode} />

        <div className="popup" style={!addingCity ? { display: "none" } : {}}>
          <form onSubmit={(e: any) => fetchingData(e)}>
            {!isFetching ? (
                <input
                    type={"text"}
                    autoComplete={"off"}
                    placeholder={"add a new city"}
                    name={"city"}
                    onChange={(e) => {
                      setCurrentCityName(e.target.value);
                    }}
                    value={currentCityName}
                    ref={inputElement}
                    autoFocus={addingCity}
                />
            ) : (
                <div className="loader">Loading...</div>
            )}
          </form>
          <div
              className="popup__overlay"
              onClick={() => {
                setAddingCity(false);
                setCurrentCityName("");
              }}
          >
            <></>
          </div>
        </div>

        {data && data.length !== 0 && (
            <Feature
                city={data[0]}
                editMode={editMode}
                theme={mode}
                cardActions={onCardActions}
            />
        )}

        <section className="cards">
          {data && (
              <>
                {renderCards()}

                {data.length !== 0 && (
                    <div className={"anchor"} id={"#end"}>
                      <a href={"#start"}>
                        <span className={"material-icons"}>arrow_upward</span>
                      </a>
                    </div>
                )}
              </>
          )}
        </section>
      </div>
      //endregion
  );
};

export default App;
