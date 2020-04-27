import React from "react";
import logo from "../logo.svg";
import logoDark from "../logo-dark.svg";
import {Mode} from "../Model";

interface navProps {
    theme?: Mode;
    onChanges: any;
    editMode: boolean;
}
const Navbar = ({ theme = Mode.light, onChanges, editMode }: navProps) => {
    const currentLogo = theme === Mode.light ? logo : logoDark;

    return (
        <div
            className="navbar"
            style={theme === Mode.dark ? { backgroundColor: "#212121" } : {}}
        >
            <header className={"navbar__logo"}>
                <a href={"/"}>
                    <img src={currentLogo} alt={"logo"} />
                </a>
            </header>

            <ul className={"navbar__links"}>
                <li
                    onClick={() => {
                        if (!editMode) {
                            onChanges("add a city");
                        }
                    }}
                    style={editMode ? { display: "none" } : {}}
                >
          <span style={theme === Mode.dark ? { color: "white" } : {}}>
            add a city
          </span>
                </li>

                <li
                    onClick={() => {
                        onChanges("toggle edit");
                    }}
                >
          <span style={theme === Mode.dark ? { color: "white" } : {}}>
            {editMode ? "back" : "customize"}
          </span>
                </li>

                <li
                    onClick={() => {
                        if (!editMode) {
                            onChanges("toggle mode");
                        }
                    }}
                    style={editMode ? { display: "none" } : {}}
                >
          <span style={theme === Mode.dark ? { color: "white" } : {}}>
            {theme === Mode.dark ? "day" : "night"}
          </span>
                </li>
            </ul>

            <footer style={theme === Mode.dark ? { color: "white" } : {}}>
                powered by{" "}
                <a
                    href={"https://unsplash.com/"}
                    target={"_blank"}
                    rel={"noopener noreferrer"}
                    style={theme === Mode.dark ? { color: "white" } : {}}
                >
                    unsplash
                </a>
            </footer>
        </div>
    );
};

export default Navbar;
