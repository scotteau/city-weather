import React, { useEffect, useRef, useState } from "react";
import { CardAction, City, Mode, NavAction } from "./Model";
import Card from "./components/Card";
import Navbar from "./components/Navbar";
import Feature from "./components/Feature";
import fetchGeocoding from "./apis/geocoding.api";
import fetchPhotos from "./apis/photo.api";

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

  const handleChanges = (action: NavAction) => {
    if (action === NavAction.ADD_A_CITY) {
      setAddingCity(true);
    }

    if (action === NavAction.TOGGLE_THEME) {
      //todo - switching between light and dark
      setMode(mode === Mode.light ? Mode.dark : Mode.light);
      window.scrollTo(0, 0);
    }

    if (action === NavAction.TOGGLE_EDIT) {
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

  const onCardActions = (action: CardAction, index: number) => {
    if (!data) return;

    if (action === CardAction.PUBLISH) {
      const payload = data[index] as City;
      const updatedData = data.filter((city, i) => i !== index);
      setData([payload, ...updatedData]);
      window.scrollTo(0, 0);
    }

    if (action === CardAction.DELETE) {
      console.log(index, action);
      const updatedData = Array.from(data).filter((c, i) => i !== index);
      setData(updatedData);
      if (updatedData.length === 0) {
        setEditMode(false);
      }
    }

    if (action === CardAction.REFRESH) {
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

    sessionStorage.setItem("cities", JSON.stringify(data));
  };

  useEffect(() => {
    if (inputElement.current) {
      // @ts-ignore
      inputElement.current.focus();
    }
  }, [addingCity]);

  const fetchingData = async (e: any) => {
    e.preventDefault();
    setIsFetching(true);

    const { lat, lng, cityName } = await fetchGeocoding(currentCityName);

    const images = await fetchPhotos(cityName, numberOfImages);

    const randomIndex = Math.floor(Math.random() * numberOfImages);
    const city: City = {
      name: cityName,
      lat: lat,
      lng: lng,
      backupImages: {
        day: [...images.light],
        night: [...images.dark],
      },
      cover: {
        day: images.light[randomIndex],
        night: images.dark[randomIndex],
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
  };

  useEffect(() => {
    sessionStorage.setItem("cities", JSON.stringify(data));
  }, [data]);

  const smartBgColor = mode === Mode.dark ? { backgroundColor: "#212121" } : {};

  return (
    <div className={"container"} id={"start"} style={smartBgColor}>
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
  );
};

export default App;
