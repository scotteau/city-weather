import React, { useEffect, useRef, useState } from "react";
import { City, Mode } from "../Model";
import Loader from "./Loader";

interface myProps {
  city: City;
  editMode: boolean;
  theme: Mode;
  index?: number;
  cardActions?: any;
}

const Card = ({
  city,
  editMode,
  theme = Mode.light,
  index,
  cardActions,
}: myProps) => {
  const imageRef = useRef(null) as any;
  const [spans, setSpans] = useState(0);
  const [shouldConfig, setShouldConfig] = useState(false);
  const [shouldShowControl, setShouldShowControl] = useState(false);

  const [isFetching, setIsFetching] = useState(false);

  let imageUrl: string;

  if (city) {
    imageUrl =
      theme === Mode.light ? city?.cover?.day?.url : city?.cover?.night?.url;
  } else {
    imageUrl = "";
  }

  const calculateAndSetCorrectSpan = () => {
    const height = imageRef.current.clientHeight;
    const spanHeight = 4;
    setSpans(Math.round(height / spanHeight) + 1);
  };

  useEffect(() => {
    imageRef.current.addEventListener("load", () => {
      calculateAndSetCorrectSpan();
    });
  }, [spans]);

  useEffect(() => {
    window.addEventListener("resize", () => {
      calculateAndSetCorrectSpan();
    });
  }, []);

  useEffect(() => {
    setShouldConfig(editMode);
  }, [editMode]);

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

  return (
    <div
      className={`card`}
      style={{ gridRowEnd: `span ${spans}` }}
      onClick={() => {
        !editMode && setShouldShowControl(!shouldShowControl);
      }}
      onMouseLeave={() => {
        setShouldShowControl(false);
      }}
    >
      {editMode && (
        <button
          className={"delete"}
          onClick={() => {
            cardActions("delete", index);
          }}
        >
          <span className="material-icons">close</span>
        </button>
      )}

      <div className="card__info">
        <div className="current">
          <h3
            className="current__city"
            style={shouldShowControl ? { opacity: 0 } : {}}
          >
            {city.name}
          </h3>
          {isFetching && <Loader />}

          <div
            className="current__controls"
            style={shouldShowControl ? { opacity: "1" } : {}}
          >
            {renderControls()}
          </div>
        </div>
      </div>
      <div
        className="card__overlay"
        style={shouldConfig ? { background: "#ab47bc", opacity: 0.9 } : {}}
      >
        <></>
      </div>
      <img ref={imageRef} src={imageUrl} alt={"city"} />
    </div>
  );
};

export default Card;
