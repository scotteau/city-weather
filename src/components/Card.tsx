import React, { useEffect, useRef, useState } from "react";
import { CardAction, City, Mode } from "../Model";

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
  const [shouldShowControl, setShouldShowControl] = useState(false);

  let imageUrl = "";

  if (city) {
    imageUrl =
      theme === Mode.light ? city?.cover?.day?.url : city?.cover?.night?.url;
  }



  useEffect(() => {
    const calculateAndSetCorrectSpan = () => {
      const height = imageRef.current.clientHeight;
      const spanHeight = 4;
      setSpans(Math.round(height / spanHeight) + 1);
    };

    calculateAndSetCorrectSpan();
    window.addEventListener("resize", () => {
      calculateAndSetCorrectSpan();
    });
    imageRef.current.addEventListener("load", () => {
      calculateAndSetCorrectSpan();
    });
  }, [imageRef]);

  const renderControls = () => {
    const controls = ["publish", "refresh", "info"];

    const onMoreInfo = () => {
      console.log("more info");
      const url =
        theme === Mode.light ? city.cover.day.link : city.cover.night.link;
      window.open(url, "_blank");
    };

    const actions = [
      () =>  cardActions(CardAction.PUBLISH, index),
      () =>  cardActions(CardAction.REFRESH, index),
      onMoreInfo
    ];

    return controls.map((icon, index) => {
      return (
        <button
          key={`${icon}-${index}`}
          onClick={shouldShowControl ? actions[index] : () => {} }
        >
          <span className={"material-icons"}>{icon}</span>
        </button>
      );
    });
  };
  const overlayColor = "#ab47bc";

  const hidden = { opacity: 0 };
  const show = { opacity: 1 };
  const smartTitleStyle = shouldShowControl ? hidden : {};
  const smartControlStyle = shouldShowControl ? show : {};

  const smartOverlay = editMode
    ? { background: overlayColor, opacity: 0.95 }
    : {};

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
          onClick={() => cardActions(CardAction.DELETE, index)}
        >
          <span className="material-icons">close</span>
        </button>
      )}

      <div className="card__info">
        <div className="current">
          <h3 className="current__city" style={smartTitleStyle}>
            {city.name}
          </h3>

          <div className="current__controls" style={smartControlStyle}>
            {renderControls()}
          </div>
        </div>
      </div>
      <div className="card__overlay" style={smartOverlay}>
        <></>
      </div>
      <img ref={imageRef} src={imageUrl} alt={"city"} />
    </div>
  );
};

export default Card;
