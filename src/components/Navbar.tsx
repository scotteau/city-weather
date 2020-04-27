import React from "react";
import logo from "../assets/logo.svg";
import logoDark from "../assets/logo-dark.svg";
import { Mode, NavAction } from "../Model";

interface navProps {
  theme: Mode;
  onChanges: any;
  editMode: boolean;
}
const Navbar = ({ theme = Mode.light, onChanges, editMode }: navProps) => {
  const currentLogo = theme === Mode.light ? logo : logoDark;

  const smartTextColor = theme === Mode.dark ? { color: "white" } : {};
  const smartBgColor = theme === Mode.dark ? { backgroundColor: "#212121" } : {};
  const hidden = { display: "none" };
  const addingCity = () => !editMode && onChanges(NavAction.ADD_A_CITY);
  const toggledEditMode = () => !editMode && onChanges(NavAction.TOGGLE_THEME);
  const renderNavFooter = () => {
    return (
      <>
        powered by{" "}
        <a
          href={"https://unsplash.com/"}
          target={"_blank"}
          rel={"noopener noreferrer"}
          style={smartTextColor}
        >
          unsplash
        </a>
      </>
    );
  };

  return (
    <div className="navbar" style={smartBgColor}>
      <header className={"navbar__logo"}>
        <a href={"/"}>
          <img src={currentLogo} alt={"logo"} />
        </a>
      </header>

      <ul className={"navbar__links"}>
        <li onClick={() => addingCity()} style={editMode ? hidden : {}}>
          <span style={smartTextColor}>add a city</span>
        </li>

        <li onClick={() => onChanges(NavAction.TOGGLE_EDIT)}>
          <span style={smartTextColor}>{editMode ? "back" : "customize"}</span>
        </li>

        <li onClick={() => toggledEditMode()} style={editMode ? hidden : {}}>
          <span style={smartTextColor}>
            {theme === Mode.dark ? "day" : "night"}
          </span>
        </li>
      </ul>

      <footer style={smartTextColor}>{renderNavFooter()}</footer>
    </div>
  );
};

export default Navbar;
