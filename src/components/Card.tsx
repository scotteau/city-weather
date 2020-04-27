import React, { useEffect, useRef, useState } from "react";
import {CardAction, City, Mode} from "../Model";
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

  let imageUrl = "";

  if (city) {
    imageUrl =
      theme === Mode.light ? city?.cover?.day?.url : city?.cover?.night?.url;
  }

  const calculateAndSetCorrectSpan = () => {
    const height = imageRef.current.clientHeight;
    const spanHeight = 4;
    setSpans(Math.round(height / spanHeight) + 1);
  };

  useEffect(() => {
    calculateAndSetCorrectSpan();
    window.addEventListener("resize", () => {
      calculateAndSetCorrectSpan();
    });
    imageRef.current.addEventListener("load", () => {
      calculateAndSetCorrectSpan();
    });
  }, []);

  useEffect(() => {
    setShouldConfig(editMode);
  }, [editMode]);

  const renderControls = () => {
    const controls = ["publish", "refresh", "info"];

    const onPublish = () => {
      cardActions(CardAction.PUBLISH, index);
    };
    const onRefresh = () => {
      cardActions(CardAction.REFRESH, index);
    };
    const onMoreInfo = () => {
      console.log("more info");
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
  const overlayColor = "#ab47bc";

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
            cardActions(CardAction.DELETE, index);
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
        style={shouldConfig ? { background: overlayColor, opacity: 0.95 } : {}}
      >
        <></>
      </div>
      <img ref={imageRef} src={imageUrl} alt={"city"} />
    </div>
  );
};

export default Card;
